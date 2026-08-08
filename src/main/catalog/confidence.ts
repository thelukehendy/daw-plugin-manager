import type {
  CatalogPlugin,
  PluginCatalog,
  UpdateStatus,
  VersionEvidence,
} from '../../shared/types'

export interface ConfidenceResult {
  confidence: number
  confidenceBand: 'high' | 'medium' | 'low'
  confidenceReason: string
}

/**
 * Green OK / Current when ≥ HIGH.
 * High confidence requires hard page-confirm (Flash Lite / sticky / Antigravity).
 * Deterministic scrapers stay medium/low until page-confirmed.
 */
const HIGH = 85
const MEDIUM = 72

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function band(confidence: number): ConfidenceResult['confidenceBand'] {
  if (confidence >= HIGH) return 'high'
  if (confidence >= MEDIUM) return 'medium'
  return 'low'
}

function daysSince(isoDate: string | undefined, catalogUpdatedAt?: string): number | null {
  const raw = isoDate || catalogUpdatedAt?.slice(0, 10)
  if (!raw) return null
  const t = Date.parse(raw.length === 10 ? `${raw}T00:00:00Z` : raw)
  if (Number.isNaN(t)) return null
  return Math.max(0, (Date.now() - t) / (1000 * 60 * 60 * 24))
}

/** Infer evidence from structured fields or legacy notes stamp. */
export function resolveEvidence(plugin: CatalogPlugin | null | undefined): {
  evidence: VersionEvidence
  sourceUrl?: string
  verifiedAt?: string
} {
  if (!plugin) return { evidence: 'unverified-seed' }
  if (plugin.versionEvidence) {
    return {
      evidence: plugin.versionEvidence,
      sourceUrl: plugin.versionSourceUrl,
      verifiedAt: plugin.versionVerifiedAt,
    }
  }
  const notes = plugin.notes || ''
  const m = notes.match(/verifiedPublic:([^@\s]+)@(\S+)/)
  if (m) {
    return {
      evidence: 'public-page',
      sourceUrl: m[2],
      verifiedAt: plugin.releaseDate || undefined,
    }
  }
  if (plugin.bundled) return { evidence: 'manufacturer-feed' }
  return { evidence: 'unverified-seed' }
}

function isPageConfirmed(evidence: VersionEvidence): boolean {
  return evidence === 'page-confirmed' || evidence === 'agent-verified'
}

/**
 * Confidence that the **status on this machine** is correct.
 *
 * Authority model:
 * - page-confirmed / agent-verified → can reach high / 100
 * - live-scrape (deterministic scrapers) → provisional, capped below HIGH until page-confirm
 * - public-page / search / seed → medium or low
 */
export function computeVersionConfidence(opts: {
  status: UpdateStatus
  plugin: CatalogPlugin | null
  catalog: PluginCatalog
  matchScore?: number
  catalogMatched: boolean
  hasInstalledVersion: boolean
}): ConfidenceResult {
  const { status, plugin, catalog, matchScore, catalogMatched, hasInstalledVersion } = opts
  const reasons: string[] = []

  if (status === 'bundled') {
    return {
      confidence: 100,
      confidenceBand: 'high',
      confidenceReason: 'Bundled with macOS / DAW — version owned by the host vendor',
    }
  }

  if (!catalogMatched || !plugin) {
    return {
      confidence: 55,
      confidenceBand: 'low',
      confidenceReason: 'No catalog match — status cannot be compared to a public latest',
    }
  }

  if (status === 'unknown') {
    return {
      confidence: 58,
      confidenceBand: 'low',
      confidenceReason: 'Incomplete data (missing installed or catalog version)',
    }
  }

  const { evidence, sourceUrl, verifiedAt } = resolveEvidence(plugin)

  // Base: successful compare, but provenance decides the ceiling.
  let score = 78
  reasons.push('Installed version compared to catalog latest')

  if (!hasInstalledVersion) {
    score -= 18
    reasons.push('Could not read installed version from plugin bundle')
  }

  if (evidence === 'page-confirmed') {
    score = 92
    reasons.push('Catalog latest page-confirmed on a live public page (Flash/sticky)')
  } else if (evidence === 'agent-verified') {
    score = 92
    reasons.push('Catalog latest confirmed by Antigravity on a live public page')
  } else if (evidence === 'live-scrape') {
    score = 70
    reasons.push('Catalog latest from deterministic scrape — awaiting page confirmation')
  } else if (evidence === 'public-page') {
    score = 76
    reasons.push('Catalog latest from sticky public page re-verify — awaiting hard page-confirm')
  } else if (evidence === 'search-verified') {
    score = 68
    reasons.push('Catalog latest from search discovery — awaiting page confirmation')
  } else if (evidence === 'manufacturer-feed') {
    score = 74
    reasons.push('Catalog latest from manufacturer feed — awaiting page confirmation')
  } else if (evidence === 'curated-seed') {
    score = 66
    reasons.push('Catalog latest from curated seed')
  } else {
    score = 62
    reasons.push('Catalog latest from unverified seed')
  }

  const age = daysSince(verifiedAt, catalog.updatedAt)
  if (age != null && evidence !== 'unverified-seed' && evidence !== 'curated-seed') {
    if (age > 90) {
      score -= 6
      reasons.push(`Public verification ${Math.round(age)}d old`)
    } else if (age > 30) {
      score -= 2
    }
  }

  if (evidence !== 'unverified-seed' && evidence !== 'curated-seed' && !sourceUrl) {
    score -= 4
    reasons.push('Missing public source URL')
  }

  if (typeof matchScore === 'number') {
    if (matchScore < 70) {
      score -= 10
      reasons.push('Weak name match to catalog')
    } else if (matchScore < 90) {
      score -= 3
      reasons.push('Partial name match to catalog')
    }
  }

  if (status === 'outdated') {
    reasons.push(
      isPageConfirmed(evidence)
        ? 'Page-confirmed latest is newer than installed'
        : 'Installed build is behind catalog latest'
    )
  } else if (status === 'current') {
    reasons.push('Installed meets or exceeds catalog latest')
  }

  // Hard page-confirm (Flash/sticky/Antigravity) may reach full confidence.
  const pageConfirmed =
    isPageConfirmed(evidence) &&
    !!sourceUrl &&
    hasInstalledVersion &&
    (typeof matchScore !== 'number' || matchScore >= 70)

  if (pageConfirmed) {
    score = 100
    reasons.push('Public-page confirmation — full confidence')
  } else if (
    evidence === 'live-scrape' ||
    evidence === 'search-verified' ||
    evidence === 'public-page'
  ) {
    // Hard cap: scrapers / legacy sticky cannot show green-high until page-confirmed.
    score = Math.min(score, HIGH - 1)
  }

  const confidence = clamp(score)
  return {
    confidence,
    confidenceBand: band(confidence),
    confidenceReason: reasons.join(' · '),
  }
}

export function aggregateManufacturerConfidence(
  products: Array<{ confidence: number }>
): ConfidenceResult {
  if (!products.length) {
    return { confidence: 0, confidenceBand: 'low', confidenceReason: 'No products' }
  }
  const sorted = [...products.map((p) => p.confidence)].sort((a, b) => a - b)
  const p10 = sorted[Math.floor((sorted.length - 1) * 0.1)]
  const confidence = clamp(p10)
  return {
    confidence,
    confidenceBand: band(confidence),
    confidenceReason: 'Lower-bound confidence across products in this manufacturer group',
  }
}
