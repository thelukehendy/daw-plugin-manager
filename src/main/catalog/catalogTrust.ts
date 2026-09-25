/**
 * Catalog trust policy — store-export only.
 *
 * Version authority is the catalog store's export, published as catalog.json with
 * catalogSource "store-export:v*". Legacy scrapers, Flash/Antigravity stamps, seeds and
 * local floors must never supply latestVersion to the app.
 */

import type { CatalogPlugin, PluginCatalog } from '../../shared/types'

const STORE_EXPORT_RE = /^store-export:/i

/** True when the catalog's own published catalogSource is a store export. */
export function isStoreExportSource(source: unknown): boolean {
  return typeof source === 'string' && STORE_EXPORT_RE.test(source.trim())
}

/**
 * A version is only trusted when the store stamped confidence on it.
 * Strips latestVersion values that lack versionConfidence.
 */
export function sanitizeStoreExportVersions(catalog: PluginCatalog): PluginCatalog {
  const plugins: CatalogPlugin[] = catalog.plugins.map((plugin) => {
    if (!plugin.latestVersion) return plugin
    const hasConfidence =
      typeof plugin.versionConfidence === 'number' && Number.isFinite(plugin.versionConfidence)
    if (hasConfidence) return plugin

    const {
      latestVersion: _lv,
      versionEvidence: _ve,
      versionSourceUrl: _vs,
      versionVerifiedAt: _vv,
      versionConfidence: _vc,
      versionConfidenceReasons: _vcr,
      releaseDate: _rd,
      ...rest
    } = plugin
    return rest
  })
  return { ...catalog, plugins }
}

export function trustGateMessage(source: unknown): string {
  return (
    `Rejected catalog source "${typeof source === 'string' ? source : 'unknown'}". ` +
    'Only catalogSource matching store-export:* is trusted.'
  )
}
