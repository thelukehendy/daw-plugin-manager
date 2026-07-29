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

/** Green OK / Current when ≥ this. Yellow only for genuinely weaker determinations. */
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

/**
 * Confidence that the **status on this machine** is correct.
 *
 * Primary signal = successful install scan + catalog compare (most results should be green
 * when plugins are current and versions were read cleanly).
 * Catalog provenance is a smaller bonus/penalty — unverified seed must NOT dump everything to ~62%.
 * Low confidence should be rare: unknown / unmatched / missing installed version / weak match.
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

  // Successful current/outdated determination starts high.
  let score = 90
  reasons.push('Installed version compared to catalog latest')

  if (!hasInstalledVersion) {
    score -= 22
    reasons.push('Could not read installed version from plugin bundle')
  }

  const { evidence, sourceUrl, verifiedAt } = resolveEvidence(plugin)

  // Provenance is a modest adjustment — not the whole score.
  if (evidence === 'live-scrape') {
    score += 7
    reasons.push('Catalog latest from live public download scrape')
  } else if (evidence === 'public-page' || evidence === 'search-verified') {
    score += 5
    reasons.push(
      evidence === 'search-verified'
        ? 'Catalog latest found via free search, verified on manufacturer page'
        : 'Catalog latest verified on public download page'
    )
  } else if (evidence === 'manufacturer-feed') {
    score += 4
    reasons.push('Catalog latest from manufacturer feed')
  } else if (evidence === 'curated-seed') {
    score += 0
    reasons.push('Catalog latest from curated seed')
  } else {
    score -= 3
    reasons.push('Catalog latest from seed (weekly scrape will strengthen this)')
  }

  const age = daysSince(verifiedAt, catalog.updatedAt)
  if (age != null && (evidence === 'live-scrape' || evidence === 'public-page' || evidence === 'search-verified')) {
    if (age > 90) {
      score -= 6
      reasons.push(`Public verification ${Math.round(age)}d old`)
    } else if (age > 30) {
      score -= 2
    }
  }

  if (
    (evidence === 'live-scrape' || evidence === 'public-page' || evidence === 'search-verified') &&
    !sourceUrl
  ) {
    score -= 4
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
    if (
      evidence === 'live-scrape' ||
      evidence === 'public-page' ||
      evidence === 'search-verified'
    ) {
      score = Math.max(score, 94)
      reasons.push('Public latest is newer than what is installed')
    } else {
      reasons.push('Installed build is behind catalog latest')
    }
  } else if (status === 'current') {
    reasons.push('Installed meets or exceeds catalog latest')
  }

  // 100% when this machine's status is backed by a public download-page verification.
  const publiclyVerified =
    (evidence === 'live-scrape' ||
      evidence === 'public-page' ||
      evidence === 'search-verified' ||
      evidence === 'manufacturer-feed') &&
    !!sourceUrl &&
    hasInstalledVersion &&
    (typeof matchScore !== 'number' || matchScore >= 70)

  if (publiclyVerified) {
    score = 100
    reasons.push('Public source confirmed — full confidence')
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
  // Prefer median-ish floor: ignore a single weak outlier if most are strong
  const sorted = [...products.map((p) => p.confidence)].sort((a, b) => a - b)
  const p10 = sorted[Math.floor((sorted.length - 1) * 0.1)]
  const confidence = clamp(p10)
  return {
    confidence,
    confidenceBand: band(confidence),
    confidenceReason: 'Lower-bound confidence across products in this manufacturer group',
  }
}
