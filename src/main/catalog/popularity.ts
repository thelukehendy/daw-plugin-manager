/**
 * Popularity tier: 1 = household names … 4 = long tail; null/undefined = unranked.
 * Effective = COALESCE(plugin.popularityTier, manufacturer.popularityTier).
 * Never treat NULL as most popular.
 */

import type { CatalogManufacturer, CatalogPlugin, PluginReportRow } from '../../shared/types'

/** Sort key: 1–4 first, then unranked as 99. */
export type PopularitySortKey = number

function readTier(raw: unknown): number | null {
  if (raw == null) return null
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 1 && raw <= 4) {
    return Math.floor(raw)
  }
  if (typeof raw === 'string' && /^\d+$/.test(raw)) {
    const n = Number(raw)
    if (n >= 1 && n <= 4) return n
  }
  return null
}

/** Accept camelCase (JSON) or snake_case (future / alternate exports). */
export function readPopularityTier(obj: Record<string, unknown> | null | undefined): number | null {
  if (!obj) return null
  return (
    readTier(obj.popularityTier) ??
    readTier((obj as { popularity_tier?: unknown }).popularity_tier)
  )
}

export function effectivePopularityTier(
  plugin: CatalogPlugin | null | undefined,
  manufacturer: CatalogManufacturer | null | undefined
): number | null {
  const p = readPopularityTier(plugin as unknown as Record<string, unknown>)
  if (p != null) return p
  return readPopularityTier(manufacturer as unknown as Record<string, unknown>)
}

/** Lower is more popular; unranked sorts last. */
export function popularitySortKey(tier: number | null | undefined): PopularitySortKey {
  if (tier == null || !Number.isFinite(tier) || tier < 1) return 99
  return tier
}

export function compareByPopularityThenName(
  a: { popularityTier?: number | null; name: string },
  b: { popularityTier?: number | null; name: string }
): number {
  const d = popularitySortKey(a.popularityTier) - popularitySortKey(b.popularityTier)
  if (d !== 0) return d
  return a.name.localeCompare(b.name)
}

/** Best (lowest) tier among products — for vendor-group ordering. */
export function bestGroupPopularityTier(products: PluginReportRow[]): number | null {
  let best: number | null = null
  for (const p of products) {
    const t = p.popularityTier
    if (t == null) continue
    if (best == null || t < best) best = t
  }
  return best
}
