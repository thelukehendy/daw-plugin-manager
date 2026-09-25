import type { ManufacturerReportGroup, PluginReportRow, UpdateStatus } from '../../shared/types'

/** Triage buckets — ordered by what a producer should look at first. */
export type TriageBucket =
  | 'needs_update'
  | 'use_hub'
  | 'paid'
  | 'uncertain'
  | 'clear'

export const TRIAGE_ORDER: TriageBucket[] = [
  'needs_update',
  'use_hub',
  'paid',
  'uncertain',
  'clear',
]

export const TRIAGE_LABEL: Record<TriageBucket, string> = {
  needs_update: 'Needs update',
  use_hub: 'Use vendor hub',
  paid: 'Paid upgrade',
  uncertain: 'Not tracked / check for updates',
  clear: 'All clear',
}

export const TRIAGE_HINT: Record<TriageBucket, string> = {
  needs_update: 'Installed is behind a trusted newer version — open the portal when ready.',
  use_hub: 'Updates go through the vendor’s manager app, not a per-plugin installer.',
  paid: 'Next-generation product for sale — not a free in-place update.',
  uncertain:
    'No trustworthy latest (or only a weak source) — not the same as “update available.”',
  clear: 'Up to date, bundled, content, or otherwise fine to ignore for now.',
}

/** One-line under every section title (visible, not hover-only). */
export const TRIAGE_EXPLAINER: Record<TriageBucket, string> = {
  needs_update: 'Installed is behind a trusted newer version — open the portal when ready.',
  use_hub: 'Updates go through the vendor’s manager app, not a per-plugin installer.',
  paid: 'Next-generation product for sale — not a free in-place update.',
  uncertain:
    'No trustworthy latest (or only a weak source) — not the same as “update available.”',
  clear: 'Up to date, bundled, content, or otherwise fine to ignore for now.',
}

/** Chip hover — what filtering to this bucket means. */
export const TRIAGE_CHIP_TITLE: Record<'all' | TriageBucket, string> = {
  all: 'Show every vendor section: needs update, hub, paid, unknown, and all clear.',
  needs_update:
    'Only plugins where you’re behind a trusted newer version (Update Available / Update likely).',
  use_hub: 'Only plugins that update through a vendor hub app (Native Access, Waves Central, …).',
  paid: 'Only plugins with a paid next generation — not free updates.',
  uncertain:
    'Only rows with no trustworthy latest or a weak source. Yellow here is not “update available.”',
  clear: 'Only plugins that look fine: up to date, bundled, content, or otherwise ignore-for-now.',
}

const UPDATE_STATUSES: UpdateStatus[] = ['update_available', 'update_likely']
const UNCERTAIN_STATUSES: UpdateStatus[] = ['unverified', 'unknown']
const CLEAR_STATUSES: UpdateStatus[] = [
  'current',
  'bundled',
  'legacy',
  'content',
  'discontinued',
]

export function productTriage(status: UpdateStatus): TriageBucket {
  if (UPDATE_STATUSES.includes(status)) return 'needs_update'
  if (status === 'use_vendor_hub') return 'use_hub'
  if (status === 'paid_upgrade') return 'paid'
  if (UNCERTAIN_STATUSES.includes(status)) return 'uncertain'
  return 'clear'
}

export type VendorSignal = {
  bucket: TriageBucket
  /** Products that belong in this bucket (for expand / counts). */
  focusProducts: PluginReportRow[]
  focusCount: number
  /** One line the producer should read. */
  primary: string
  minConfidence: number
  minBand: 'high' | 'medium' | 'low'
}

function minConfidence(products: PluginReportRow[]): {
  minConfidence: number
  minBand: 'high' | 'medium' | 'low'
} {
  if (!products.length) return { minConfidence: 0, minBand: 'low' }
  let min = products[0]
  for (const p of products) {
    if (p.confidence < min.confidence) min = p
  }
  return { minConfidence: min.confidence, minBand: min.confidenceBand }
}

/** Highest-priority triage for a vendor from its visible products. */
export function vendorPrimaryBucket(products: PluginReportRow[]): TriageBucket {
  const buckets = new Set(products.map((p) => productTriage(p.status)))
  for (const b of TRIAGE_ORDER) {
    if (buckets.has(b)) return b
  }
  return 'clear'
}

export function buildVendorSignal(
  group: ManufacturerReportGroup,
  bucket: TriageBucket
): VendorSignal {
  const focusProducts = group.products.filter((p) => productTriage(p.status) === bucket)
  const focus = focusProducts.length ? focusProducts : group.products
  const { minConfidence: mc, minBand } = minConfidence(focus)
  const n = focusProducts.length
  const hub = group.portalApp

  let primary = ''
  switch (bucket) {
    case 'needs_update':
      primary = n === 1 ? '1 update' : `${n} updates`
      break
    case 'use_hub':
      primary = hub
        ? n === 1
          ? `Use ${hub}`
          : `Use ${hub} · ${n}`
        : n === 1
          ? 'Use vendor hub'
          : `Use vendor hub · ${n}`
      break
    case 'paid':
      primary = n === 1 ? '1 paid upgrade' : `${n} paid upgrades`
      break
    case 'uncertain': {
      const unk = focusProducts.filter((p) => p.status === 'unknown').length
      const unv = focusProducts.filter((p) => p.status === 'unverified').length
      if (unk && unv) primary = `${unk} not tracked · ${unv} to check`
      else if (unk) primary = `${unk} not tracked`
      else primary = `${unv} to check`
      break
    }
    case 'clear':
      primary = n === 1 ? 'Up to date' : `${n} up to date`
      break
  }

  return {
    bucket,
    focusProducts,
    focusCount: n,
    primary,
    minConfidence: mc,
    minBand,
  }
}

export function partitionByTriage(
  groups: ManufacturerReportGroup[]
): Record<TriageBucket, ManufacturerReportGroup[]> {
  const out: Record<TriageBucket, ManufacturerReportGroup[]> = {
    needs_update: [],
    use_hub: [],
    paid: [],
    uncertain: [],
    clear: [],
  }

  for (const g of groups) {
    // Place vendor under each bucket they have products in — but for clear
    // only if they have NO attention products (avoid duplicating Melda in clear).
    const byBucket: Partial<Record<TriageBucket, PluginReportRow[]>> = {}
    for (const p of g.products) {
      const b = productTriage(p.status)
      ;(byBucket[b] ||= []).push(p)
    }

    const hasAttention =
      (byBucket.needs_update?.length || 0) +
        (byBucket.use_hub?.length || 0) +
        (byBucket.paid?.length || 0) +
        (byBucket.uncertain?.length || 0) >
      0

    for (const b of TRIAGE_ORDER) {
      const focus = byBucket[b]
      if (!focus?.length) continue
      if (b === 'clear' && hasAttention) continue
      out[b].push({
        ...g,
        products: focus,
        productCount: focus.length,
        outdatedCount: focus.filter((p) => UPDATE_STATUSES.includes(p.status)).length,
        unknownCount: focus.filter((p) => p.status === 'unknown').length,
        currentCount: focus.filter((p) => CLEAR_STATUSES.includes(p.status)).length,
        popularityTier: (() => {
          let best: number | null = null
          for (const p of focus) {
            if (p.popularityTier == null) continue
            if (best == null || p.popularityTier < best) best = p.popularityTier
          }
          return best
        })(),
      })
    }
  }

  // Sort within bucket: popularity tier 1 first, then focus count, then name
  for (const b of TRIAGE_ORDER) {
    out[b].sort((a, c) => {
      const ta = a.popularityTier == null || a.popularityTier < 1 ? 99 : a.popularityTier
      const tc = c.popularityTier == null || c.popularityTier < 1 ? 99 : c.popularityTier
      if (ta !== tc) return ta - tc
      if (c.productCount !== a.productCount) return c.productCount - a.productCount
      return a.manufacturer.localeCompare(c.manufacturer)
    })
  }

  return out
}

export type TriageFilter = 'all' | TriageBucket
