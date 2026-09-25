/**
 * Tolerate schema v3 + v5/v6 extensions: extra fields OK; require core shape.
 * Never invent versions. updatedAt is the freshness clock.
 */

import type { PluginCatalog } from '../../shared/types'
import { isStoreExportSource, sanitizeStoreExportVersions, trustGateMessage } from './catalogTrust'

export class CatalogParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CatalogParseError'
  }
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

/**
 * Parse unknown JSON into a PluginCatalog without crashing on extras.
 * Missing manufacturers/plugins → empty arrays (still usable for reopen).
 */
export function parsePluginCatalog(raw: unknown, sourceHint?: string): PluginCatalog {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogParseError('Catalog is not an object')
  }
  const o = raw as Record<string, unknown>
  const manufacturers = asArray<PluginCatalog['manufacturers'][number]>(o.manufacturers)
  const plugins = asArray<PluginCatalog['plugins'][number]>(o.plugins)

  if (!manufacturers.length && !plugins.length) {
    throw new CatalogParseError('Catalog has no manufacturers or plugins')
  }
  if (!isStoreExportSource(o.catalogSource)) {
    throw new CatalogParseError(trustGateMessage(o.catalogSource))
  }

  const updatedAt =
    typeof o.updatedAt === 'string' && o.updatedAt.trim()
      ? o.updatedAt
      : new Date(0).toISOString()

  const schemaVersion =
    typeof o.schemaVersion === 'number' && Number.isFinite(o.schemaVersion)
      ? o.schemaVersion
      : 3

  const catalog: PluginCatalog = sanitizeStoreExportVersions({
    schemaVersion,
    updatedAt,
    manufacturers,
    plugins,
  })

  // App origin hint wins — never keep engine `store-export` / path strings as fetch provenance.
  if (sourceHint) {
    catalog.catalogSource = sourceHint
  } else if (typeof o.catalogSource === 'string') {
    catalog.catalogSource = o.catalogSource
  }

  if (typeof o.catalogBuildId === 'string' && o.catalogBuildId.trim()) {
    catalog.catalogBuildId = o.catalogBuildId.trim()
  }

  return catalog
}

/** Prefer newer updatedAt; equal → prefer remote when both valid. */
export function preferNewerCatalog(a: PluginCatalog, b: PluginCatalog): PluginCatalog {
  const ta = Date.parse(a.updatedAt)
  const tb = Date.parse(b.updatedAt)
  if (Number.isFinite(tb) && Number.isFinite(ta)) {
    if (tb > ta) return b
    if (ta > tb) return a
  } else if (Number.isFinite(tb) && !Number.isFinite(ta)) {
    return b
  }
  // Tie or unparseable: prefer b (caller passes remote as second arg)
  return b
}

/** User-safe freshness label — never a URL or path. */
export function catalogAsOfLabel(updatedAt: string | null | undefined): string | null {
  if (!updatedAt) return null
  const t = Date.parse(updatedAt)
  if (!Number.isFinite(t)) return null
  return `Catalog as of ${new Date(t).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`
}
