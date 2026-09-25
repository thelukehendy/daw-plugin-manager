/**
 * Atomic on-disk install of a verified v2 catalog. Meta never stores URLs.
 */

import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type { PluginCatalog } from '../../shared/types'
import { parsePluginCatalog } from './catalogParse'

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

export function defaultUserDataPath(): string {
  return join(homedir(), 'Library/Application Support/DAW Plugin Manager')
}

export function catalogCacheDir(userDataPath: string): string {
  return join(userDataPath, CATALOG_CACHE_DIRNAME)
}

function paths(userDataPath: string) {
  const dir = catalogCacheDir(userDataPath)
  return {
    dir,
    catalog: join(dir, 'catalog.json'),
    catalogTmp: join(dir, 'catalog.json.tmp'),
    meta: join(dir, 'catalog-meta.json'),
    metaTmp: join(dir, 'catalog-meta.json.tmp'),
  }
}

export async function atomicInstallCatalog(
  userDataPath: string,
  bytes: Uint8Array,
  meta: Omit<InstalledCatalogMeta, 'installedAt'>
): Promise<InstalledCatalogMeta> {
  const p = paths(userDataPath)
  await mkdir(p.dir, { recursive: true })
  const installed: InstalledCatalogMeta = {
    ...meta,
    installedAt: new Date().toISOString(),
  }
  await writeFile(p.catalogTmp, Buffer.from(bytes))
  await writeFile(p.metaTmp, JSON.stringify(installed), 'utf8')
  await rename(p.catalogTmp, p.catalog)
  await rename(p.metaTmp, p.meta)
  return installed
}

export async function loadInstalledCatalog(
  userDataPath: string
): Promise<InstalledCatalog | null> {
  const p = paths(userDataPath)
  if (!existsSync(p.catalog)) return null
  try {
    const buf = await readFile(p.catalog)
    const bytes = new Uint8Array(buf)
    const catalog = parsePluginCatalog(JSON.parse(buf.toString('utf8')), 'remote:v2')
    let meta: InstalledCatalogMeta | null = null
    if (existsSync(p.meta)) {
      const raw = JSON.parse(await readFile(p.meta, 'utf8')) as Partial<InstalledCatalogMeta>
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
