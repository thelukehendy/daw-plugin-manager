/**
 * Atomic on-disk install of a verified v2 catalog. Meta never stores URLs.
 */

import type { PluginCatalog } from '../../shared/types'
import { parsePluginCatalog } from './catalogParse'
import { joinPath, platform } from '../platform'

export const CATALOG_CACHE_DIRNAME = 'catalog-cache'

export interface InstalledCatalogMeta {
  buildId: string
  sha256: string
  schemaVersion: number
  installedAt: string
}

export interface InstalledCatalog {
  catalog: PluginCatalog
  meta: InstalledCatalogMeta
  bytes: Uint8Array
}

const CATALOG_FILE = joinPath(CATALOG_CACHE_DIRNAME, 'catalog.json')
const META_FILE = joinPath(CATALOG_CACHE_DIRNAME, 'catalog-meta.json')

/** Catalog bytes first, meta second: a crash between them leaves meta stale, never a torn catalog. */
export async function atomicInstallCatalog(
  bytes: Uint8Array,
  meta: Omit<InstalledCatalogMeta, 'installedAt'>
): Promise<InstalledCatalogMeta> {
  const installed: InstalledCatalogMeta = { ...meta, installedAt: new Date().toISOString() }
  await platform().writeAppFile(CATALOG_FILE, bytes)
  await platform().writeAppFile(META_FILE, JSON.stringify(installed))
  return installed
}

export async function loadInstalledCatalog(): Promise<InstalledCatalog | null> {
  const host = platform()
  const bytes = await host.readBytes(joinPath(host.userDataDir, CATALOG_FILE))
  if (!bytes) return null
  try {
    const catalog = parsePluginCatalog(JSON.parse(new TextDecoder().decode(bytes)), 'remote:v2')
    let meta: InstalledCatalogMeta | null = null
    const metaText = await host.readText(joinPath(host.userDataDir, META_FILE))
    if (metaText) {
      const raw = JSON.parse(metaText) as Partial<InstalledCatalogMeta>
      if (typeof raw.buildId === 'string' && raw.buildId.trim()) {
        meta = {
          buildId: raw.buildId.trim(),
          sha256: typeof raw.sha256 === 'string' ? raw.sha256.toLowerCase() : '',
          schemaVersion:
            typeof raw.schemaVersion === 'number' ? raw.schemaVersion : catalog.schemaVersion,
          installedAt: typeof raw.installedAt === 'string' ? raw.installedAt : '',
        }
      }
    }
    if (!meta) {
      meta = {
        buildId: catalog.updatedAt,
        sha256: '',
        schemaVersion: catalog.schemaVersion,
        installedAt: '',
      }
    }
    catalog.catalogBuildId = meta.buildId
    catalog.catalogSource = 'remote:v2'
    return { catalog, meta, bytes }
  } catch {
    return null
  }
}
