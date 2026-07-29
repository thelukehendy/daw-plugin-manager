import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { assertPortalUrl } from './http'

export type KnownSourceKind = 'release-notes' | 'downloads' | 'changelog' | 'portal'

export interface KnownSource {
  manufacturerId: string
  url: string
  kind: KnownSourceKind
  label?: string
  /** Optional product name hint for matching catalog plugins */
  nameIncludes?: string
  addedBy: 'curated' | 'discovery'
  addedAt: string
  lastVerifiedAt?: string
  lastVersion?: string
}

export interface KnownSourcesFile {
  schemaVersion: number
  updatedAt: string
  sources: KnownSource[]
}

const PATH = join(process.cwd(), 'catalog/known-sources.json')

export function loadKnownSources(): KnownSourcesFile {
  if (!existsSync(PATH)) {
    return { schemaVersion: 1, updatedAt: new Date().toISOString(), sources: [] }
  }
  return JSON.parse(readFileSync(PATH, 'utf8')) as KnownSourcesFile
}

export function saveKnownSources(file: KnownSourcesFile): void {
  file.updatedAt = new Date().toISOString()
  file.schemaVersion = Math.max(file.schemaVersion || 1, 1)
  writeFileSync(PATH, JSON.stringify(file, null, 2) + '\n')
}

/** Add newly found manufacturer release URLs; returns how many were new. */
export function mergeDiscoveredSources(
  file: KnownSourcesFile,
  incoming: Array<Omit<KnownSource, 'addedBy' | 'addedAt'> & { addedBy?: KnownSource['addedBy'] }>
): number {
  let added = 0
  const today = new Date().toISOString().slice(0, 10)
  const byUrl = new Map(file.sources.map((s) => [s.url.replace(/\/$/, ''), s]))

  for (const raw of incoming) {
    assertPortalUrl(raw.url)
    const key = raw.url.replace(/\/$/, '')
    const existing = byUrl.get(key)
    if (existing) {
      if (raw.lastVersion) existing.lastVersion = raw.lastVersion
      if (raw.lastVerifiedAt) existing.lastVerifiedAt = raw.lastVerifiedAt
      if (raw.nameIncludes && !existing.nameIncludes) existing.nameIncludes = raw.nameIncludes
      if (raw.label && !existing.label) existing.label = raw.label
      continue
    }
    const next: KnownSource = {
      manufacturerId: raw.manufacturerId,
      url: raw.url.split('#')[0].split('?')[0],
      kind: raw.kind || 'release-notes',
      label: raw.label,
      nameIncludes: raw.nameIncludes,
      addedBy: raw.addedBy || 'discovery',
      addedAt: today,
      lastVerifiedAt: raw.lastVerifiedAt,
      lastVersion: raw.lastVersion,
    }
    file.sources.push(next)
    byUrl.set(key, next)
    added++
  }
  return added
}

export function sourcesForManufacturer(file: KnownSourcesFile, manufacturerId: string): KnownSource[] {
  return file.sources.filter((s) => s.manufacturerId === manufacturerId)
}

/** Heuristic: URL path looks like release notes / changelog knowledge worth keeping. */
export function looksLikeReleaseKnowledgeUrl(url: string): boolean {
  return /release[-_ ]?(notes|log)|changelog|what[-_]?s[-_]?new|product[-_]?updates|version[-_]?history/i.test(
    url
  )
}
