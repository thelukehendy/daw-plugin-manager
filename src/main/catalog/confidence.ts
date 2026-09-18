import type {
  CatalogPlugin,
  ConfidenceBand,
  PluginCatalog,
  UpdateStatus,
  VersionEvidence,
} from '../../shared/types'

export interface ConfidenceResult {
  confidence: number
  confidenceBand: ConfidenceBand
  confidenceReason: string
  confidenceReasons: string[]
}

/** Green ≥85, amber 70–84, yellow &lt;70 — matches catalog handoff. */
export const HIGH = 85
export const MEDIUM = 70

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

export function bandFromScore(confidence: number): ConfidenceBand {
  if (confidence >= HIGH) return 'high'
  if (confidence >= MEDIUM) return 'medium'
  return 'low'
}

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
 * Prefer Policy-A `versionConfidence` from the catalog export.
 * Fall back to evidence-based scoring only when the catalog score is absent.
 */
export function computeVersionConfidence(opts: {
  status: UpdateStatus
  plugin: CatalogPlugin | null
  catalog: PluginCatalog
  matchScore?: number
  catalogMatched: boolean
  hasInstalledVersion: boolean
  /** When browsing catalog with a version but no install compare */
  catalogVersionOnly?: boolean
}): ConfidenceResult {
  const {
    status,
    plugin,
    catalogMatched,
    hasInstalledVersion,
    matchScore,
    catalogVersionOnly,
  } = opts

  if (status === 'bundled') {
    return {
      confidence: 100,
      confidenceBand: 'high',
      confidenceReason: 'Bundled with macOS / DAW — version owned by the host vendor',
      confidenceReasons: ['Bundled with macOS / DAW'],
    }
  }

  if (status === 'content') {
    return {
      confidence: 100,
      confidenceBand: 'high',
      confidenceReason: 'Content / non-plugin identity — not version-tracked by design',
      confidenceReasons: ['Not a version-tracked plugin (identityKind)'],
    }
  }

  if (status === 'discontinued') {
    const reasons = plugin?.versionConfidenceReasons?.length
      ? [...plugin.versionConfidenceReasons]
      : ['Discontinued product — last known version if shown']
    const score =
      typeof plugin?.versionConfidence === 'number' ? clamp(plugin.versionConfidence) : 80
    return {
      confidence: score,
      confidenceBand: bandFromScore(score),
      confidenceReason: reasons.join(' · '),
      confidenceReasons: reasons,
    }
  }

  if (!catalogMatched || !plugin) {
    return {
      confidence: 55,
      confidenceBand: 'low',
      confidenceReason: 'No catalog match — cannot compare to a published latest',
      confidenceReasons: ['No catalog match'],
    }
  }

  // Catalog Policy-A score is authoritative when present.
  if (typeof plugin.versionConfidence === 'number') {
    const reasons = [
      ...(plugin.versionConfidenceReasons || []),
    ]
    if (!reasons.length) {
      reasons.push(`Catalog confidence ${plugin.versionConfidence}`)
    }
    if (status === 'unknown' && !plugin.latestVersion) {
      reasons.unshift('No accepted latestVersion in catalog')
    } else if (status === 'unknown' && !hasInstalledVersion && !catalogVersionOnly) {
      reasons.unshift('Installed version could not be read')
    } else if (status === 'update_available' || status === 'update_likely') {
      reasons.push('Installed build is behind catalog latest')
    } else if (status === 'current') {
      reasons.push('Installed meets or exceeds catalog latest')
    } else if (status === 'unverified') {
      reasons.push('Low-confidence catalog version — verify via source or vendor hub')
    } else if (status === 'use_vendor_hub') {
      reasons.push('Updates are managed through the vendor hub app')
    } else if (status === 'paid_upgrade') {
      reasons.push('A paid next-generation product exists (not a free update)')
    }

    if (typeof matchScore === 'number' && matchScore < 70) {
      reasons.push('Weak name match to catalog')
    }

    const confidence = clamp(plugin.versionConfidence)
    return {
      confidence,
      confidenceBand: bandFromScore(confidence),
      confidenceReason: reasons.join(' · '),
      confidenceReasons: reasons,
    }
  }

  // Fallback for older seed rows without versionConfidence
  if (status === 'unknown' && !plugin.latestVersion) {
    return {
      confidence: 50,
      confidenceBand: 'low',
      confidenceReason: 'No accepted latestVersion in catalog',
      confidenceReasons: ['No accepted latestVersion'],
    }
  }

  const { evidence, sourceUrl } = resolveEvidence(plugin)
  const reasons: string[] = []
  let score = 62

  if (evidence === 'page-confirmed' || evidence === 'agent-verified') {
    score = 92
    reasons.push('Catalog latest page-confirmed')
  } else if (evidence === 'manufacturer-feed') {
    score = 74
    reasons.push('Manufacturer feed (no Policy-A confidence field)')
  } else if (evidence === 'live-scrape' || evidence === 'public-page') {
    score = 70
    reasons.push('Provisional scrape / public page')
  } else {
    score = 60
    reasons.push('Unverified seed — prefer portal')
  }

  if (!hasInstalledVersion && !catalogVersionOnly) {
    score = Math.min(score, 58)
    reasons.push('Could not read installed version')
  }
  if (!sourceUrl) reasons.push('Missing public source URL')

  const confidence = clamp(score)
  return {
    confidence,
    confidenceBand: bandFromScore(confidence),
    confidenceReason: reasons.join(' · '),
    confidenceReasons: reasons,
  }
}

export function aggregateManufacturerConfidence(
  products: Array<{ confidence: number }>
): ConfidenceResult {
  if (!products.length) {
    return {
      confidence: 0,
      confidenceBand: 'low',
      confidenceReason: 'No products',
      confidenceReasons: ['No products'],
    }
  }
  const sorted = [...products.map((p) => p.confidence)].sort((a, b) => a - b)
  const p10 = sorted[Math.floor((sorted.length - 1) * 0.1)]
  const confidence = clamp(p10)
  return {
    confidence,
    confidenceBand: bandFromScore(confidence),
    confidenceReason: 'Lower-bound confidence across products in this manufacturer group',
    confidenceReasons: ['Lower-bound across manufacturer group'],
  }
}
