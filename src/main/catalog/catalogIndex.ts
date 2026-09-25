import type {
  AuComponentKey,
  CatalogManufacturer,
  CatalogPlugin,
  MatchMethod,
  PluginCatalog,
} from '../../shared/types'
import {
  canonicalizeManufacturer,
  productFamilyName,
  productLineName,
} from '../scanner/grouping'

export interface CatalogIndex {
  catalog: PluginCatalog
  byId: Map<string, CatalogPlugin>
  byManufacturerId: Map<string, CatalogPlugin[]>
  byLine: Map<string, CatalogPlugin[]>
  byExactName: Map<string, CatalogPlugin[]>
  byBundleId: Map<string, CatalogPlugin[]>
  byAuComponent: Map<string, CatalogPlugin[]>
  bundlePrefixes: Array<[string, CatalogPlugin]>
  manufacturerById: Map<string, CatalogManufacturer>
  manufacturerByKey: Map<string, CatalogManufacturer>
  /** Keys with punctuation and spaces removed ("W.A.Production" → "waproduction"). */
  manufacturerByCompactKey: Map<string, CatalogManufacturer>
  vendorPrefixes: Array<[string, CatalogManufacturer]>
  manufacturerByAuCode: Map<string, CatalogManufacturer>
}

export interface MatchInput {
  name: string
  productLine: string
  /** Scanned vendor strings: bundle vendor, folder vendor, AU vendor. */
  vendorNames: string[]
  bundleIds?: string[]
  auComponents?: AuComponentKey[]
  /** Newest installed version; picks between generation rows sharing a name. */
  installedVersion?: string | null
}

export interface CatalogMatch {
  plugin: CatalogPlugin
  manufacturer: CatalogManufacturer
  score: number
  method: MatchMethod
}

/**
 * Single words that name a kind of effect, not a product. A pattern made only of one of
 * these never identifies a plugin without an identity key or manufacturer agreement.
 */
const GENERIC_WORDS = new Set([
  'amp', 'bass', 'chorus', 'clipper', 'comp', 'compressor', 'deesser', 'delay', 'distortion',
  'drive', 'drums', 'dynamics', 'echo', 'eq', 'equalizer', 'filter', 'flanger', 'gate',
  'keys', 'limiter', 'multiband', 'phaser', 'piano', 'reverb', 'saturation', 'saturator',
  'strings', 'synth', 'tape', 'tremolo', 'tuner', 'vibrato', 'vocal', 'vocals',
])

function pushMap<T>(map: Map<string, T[]>, key: string, value: T): void {
  const k = key.trim()
  if (!k) return
  const list = map.get(k)
  if (list) {
    if (!list.includes(value)) list.push(value)
  } else map.set(k, [value])
}

function lineKey(s: string): string {
  return productLineName(s).toLowerCase().trim()
}

function normName(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function compactKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function auKey(k: AuComponentKey): string {
  return `${k.manufacturer}:${k.subtype || ''}`.toLowerCase()
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function containsWord(haystack: string, word: string): boolean {
  if (!word) return false
  return new RegExp(`(^|[^a-z0-9])${escapeRe(word.toLowerCase())}([^a-z0-9]|$)`, 'i').test(
    haystack
  )
}

/** Build once per catalog load — O(plugins + manufacturers). */
export function buildCatalogIndex(catalog: PluginCatalog): CatalogIndex {
  const byId = new Map<string, CatalogPlugin>()
  const byManufacturerId = new Map<string, CatalogPlugin[]>()
  const byLine = new Map<string, CatalogPlugin[]>()
  const byExactName = new Map<string, CatalogPlugin[]>()
  const byBundleId = new Map<string, CatalogPlugin[]>()
  const byAuComponent = new Map<string, CatalogPlugin[]>()
  const bundlePrefixes: Array<[string, CatalogPlugin]> = []
  const manufacturerById = new Map<string, CatalogManufacturer>()
  const manufacturerByKey = new Map<string, CatalogManufacturer>()
  const manufacturerByCompactKey = new Map<string, CatalogManufacturer>()
  const vendorPrefixes: Array<[string, CatalogManufacturer]> = []
  const manufacturerByAuCode = new Map<string, CatalogManufacturer>()

  for (const m of catalog.manufacturers) {
    manufacturerById.set(m.id, m)
    for (const key of [m.id, m.name]) {
      manufacturerByKey.set(key.toLowerCase(), m)
      const compact = compactKey(key)
      if (compact.length >= 3) manufacturerByCompactKey.set(compact, m)
    }
    for (const a of m.aliases || []) {
      if (!manufacturerByKey.has(a.toLowerCase())) manufacturerByKey.set(a.toLowerCase(), m)
      const compact = compactKey(a)
      if (compact.length >= 3 && !manufacturerByCompactKey.has(compact)) {
        manufacturerByCompactKey.set(compact, m)
      }
    }
    for (const p of m.bundleIdVendorPrefixes || []) vendorPrefixes.push([p.toLowerCase(), m])
    if (m.auManufacturerCode) manufacturerByAuCode.set(m.auManufacturerCode.toLowerCase(), m)
  }

  for (const plugin of catalog.plugins) {
    byId.set(plugin.id, plugin)
    pushMap(byManufacturerId, plugin.manufacturerId, plugin)
    pushMap(byExactName, normName(plugin.name), plugin)
    pushMap(byLine, lineKey(plugin.name), plugin)
    if (plugin.productLine) pushMap(byLine, lineKey(plugin.productLine), plugin)
    const patterns = plugin.matchPatterns?.length ? plugin.matchPatterns : [plugin.name]
    for (const pat of patterns) {
      pushMap(byLine, lineKey(pat), plugin)
      pushMap(byExactName, normName(pat), plugin)
    }
    const keys = plugin.identityKeys
    for (const id of keys?.bundleIds || []) pushMap(byBundleId, id.toLowerCase(), plugin)
    for (const k of keys?.auComponents || []) pushMap(byAuComponent, auKey(k), plugin)
    for (const p of keys?.bundleIdPrefixes || []) bundlePrefixes.push([p.toLowerCase(), plugin])
  }

  return {
    catalog,
    byId,
    byManufacturerId,
    byLine,
    byExactName,
    byBundleId,
    byAuComponent,
    bundlePrefixes,
    manufacturerById,
    manufacturerByKey,
    manufacturerByCompactKey,
    vendorPrefixes,
    manufacturerByAuCode,
  }
}

/**
 * Resolve one scanned vendor string to a catalog manufacturer.
 * Exact key, then punctuation-insensitive key, then a whole-word match of a 4+ character key.
 */
export function findManufacturerIndexed(
  manufacturer: string,
  index: CatalogIndex
): CatalogManufacturer | undefined {
  const mfgLower = canonicalizeManufacturer(manufacturer).toLowerCase().trim()
  if (!mfgLower || mfgLower === 'unknown') return undefined
  const direct = index.manufacturerByKey.get(mfgLower)
  if (direct) return direct
  const compact = compactKey(mfgLower)
  if (compact.length >= 3) {
    const byCompact = index.manufacturerByCompactKey.get(compact)
    if (byCompact) return byCompact
  }
  let best: { m: CatalogManufacturer; len: number } | undefined
  for (const [key, m] of index.manufacturerByKey) {
    if (key.length < 4) continue
    if (containsWord(mfgLower, key) || (mfgLower.length >= 4 && containsWord(key, mfgLower))) {
      if (!best || key.length > best.len) best = { m, len: key.length }
    }
  }
  return best?.m
}

/** Every catalog manufacturer the scanned install plausibly belongs to. */
function resolveInstalledManufacturers(
  input: MatchInput,
  index: CatalogIndex
): Set<string> {
  const ids = new Set<string>()
  for (const v of input.vendorNames) {
    const m = findManufacturerIndexed(v, index)
    if (m) ids.add(m.id)
  }
  for (const bid of input.bundleIds || []) {
    const lower = bid.toLowerCase()
    for (const [prefix, m] of index.vendorPrefixes) {
      if (lower === prefix || lower.startsWith(`${prefix}.`)) ids.add(m.id)
    }
  }
  for (const k of input.auComponents || []) {
    const m = index.manufacturerByAuCode.get(k.manufacturer.toLowerCase())
    if (m) ids.add(m.id)
  }
  return ids
}

function namesMatch(installedName: string, pattern: string): boolean {
  const a = installedName.toLowerCase().trim()
  const b = pattern.toLowerCase().trim()
  if (!a || !b) return false
  if (a === b) return true
  if (productLineName(installedName).toLowerCase() === productLineName(pattern).toLowerCase()) {
    if (productFamilyName(pattern).toLowerCase() === productLineName(pattern).toLowerCase()) {
      return true
    }
  }
  const familyA = productFamilyName(installedName).toLowerCase()
  const familyB = productFamilyName(pattern).toLowerCase()
  if (familyA === familyB) return true
  if ((b.endsWith('-') || b.endsWith('_')) && a.startsWith(b)) return true
  if (a.startsWith(b) && b.length >= 4) {
    const next = a.charAt(b.length)
    if (!next || /[\s\-_/]/.test(next) || /\d/.test(next)) return true
  }
  return containsWord(a, b)
}

/** A pattern too vague to identify a product by itself. */
export function isWeakPattern(pattern: string): boolean {
  const p = normName(pattern)
  if (p.length < 4) return true
  if (!/\s/.test(p) && GENERIC_WORDS.has(p.replace(/[^a-z]/g, ''))) return true
  return false
}

function manufacturerNames(m: CatalogManufacturer): string[] {
  return [m.name, ...(m.aliases || [])].map((s) => s.toLowerCase()).filter((s) => s.length >= 3)
}

/**
 * Does the candidate's manufacturer agree with the scanned vendor? Also accepts the
 * candidate's brand named in the installed product ("SPL Transient Designer" sold by
 * Plugin Alliance).
 */
function manufacturerAgrees(
  candidateMfg: CatalogManufacturer,
  installedName: string,
  installedMfgIds: Set<string>
): boolean {
  if (installedMfgIds.has(candidateMfg.id)) return true
  return manufacturerNames(candidateMfg).some((n) => containsWord(installedName, n))
}

function majorOf(version: string | null | undefined): number | null {
  const m = version?.match(/^\s*(\d+)/)
  return m ? Number(m[1]) : null
}

function generationCovers(plugin: CatalogPlugin, major: number): boolean {
  if (plugin.versionMajors?.length) return plugin.versionMajors.includes(major)
  return Number(plugin.generation) === major
}

/**
 * Several equally good rows that are generations of one product (S-Gear 2 / S-Gear 3):
 * keep the one covering the installed major. None covers it → no match, never the
 * newest generation's version.
 */
function resolveGeneration(tied: CatalogMatch[], installedVersion?: string | null): CatalogMatch | null {
  if (tied.length < 2) return tied[0] ?? null
  const generational = tied.filter((m) => m.plugin.generation != null || m.plugin.versionMajors?.length)
  if (generational.length < 2) return tied[0]
  const major = majorOf(installedVersion)
  if (major == null) return null
  return generational.find((m) => generationCovers(m.plugin, major)) ?? null
}

function pickAmong(
  list: CatalogPlugin[],
  input: MatchInput,
  index: CatalogIndex,
  method: MatchMethod,
  score: number
): CatalogMatch | null {
  const nameLower = normName(input.name)
  const ranked = [...list].sort((a, b) => {
    const ea = normName(a.name) === nameLower ? 0 : 1
    const eb = normName(b.name) === nameLower ? 0 : 1
    return ea - eb
  })
  const plugin = ranked[0]
  const manufacturer = plugin && index.manufacturerById.get(plugin.manufacturerId)
  if (!plugin || !manufacturer) return null
  return { plugin, manufacturer, score, method }
}

/**
 * Resolve an installed product to one catalog row, strongest evidence first:
 * bundle ID → AU component → bundle-ID prefix → exact name → name pattern.
 * Name evidence never crosses manufacturers; no match beats a wrong match.
 */
export function matchCatalogPluginIndexed(
  input: MatchInput,
  index: CatalogIndex
): CatalogMatch | null {
  const byBundle = new Set<CatalogPlugin>()
  for (const id of input.bundleIds || []) {
    for (const p of index.byBundleId.get(id.toLowerCase()) || []) byBundle.add(p)
  }
  if (byBundle.size) return pickAmong([...byBundle], input, index, 'bundle-id', 1000)

  const byAu = new Set<CatalogPlugin>()
  for (const k of input.auComponents || []) {
    for (const p of index.byAuComponent.get(auKey(k)) || []) byAu.add(p)
  }
  if (byAu.size) return pickAmong([...byAu], input, index, 'au-component', 900)

  if (index.bundlePrefixes.length && input.bundleIds?.length) {
    const hits = new Set<CatalogPlugin>()
    for (const id of input.bundleIds) {
      const lower = id.toLowerCase()
      for (const [prefix, plugin] of index.bundlePrefixes) {
        if (lower === prefix || lower.startsWith(prefix)) hits.add(plugin)
      }
    }
    if (hits.size) return pickAmong([...hits], input, index, 'bundle-prefix', 800)
  }

  const installedMfgIds = resolveInstalledManufacturers(input, index)
  const nameLower = normName(input.name)
  const lineLower = input.productLine.toLowerCase()

  const candidates = new Set<CatalogPlugin>()
  const addAll = (list?: CatalogPlugin[]) => list?.forEach((p) => candidates.add(p))
  addAll(index.byExactName.get(nameLower))
  addAll(index.byLine.get(lineKey(input.name)))
  addAll(index.byLine.get(lineKey(input.productLine)))
  addAll(index.byLine.get(lineLower))
  for (const id of installedMfgIds) addAll(index.byManufacturerId.get(id))

  const exactOwners = new Set(
    (index.byExactName.get(nameLower) || []).map((p) => p.manufacturerId)
  )

  const scored: CatalogMatch[] = []
  for (const plugin of candidates) {
    const mfg = index.manufacturerById.get(plugin.manufacturerId)
    if (!mfg) continue

    const patterns = plugin.matchPatterns?.length ? plugin.matchPatterns : [plugin.name]
    const exactPattern = [plugin.name, ...patterns].find((p) => normName(p) === nameLower)
    const agrees = manufacturerAgrees(mfg, input.name, installedMfgIds)

    let score = 0
    let method: MatchMethod = 'name-pattern'

    if (exactPattern) {
      if (agrees) {
        score = normName(plugin.name) === nameLower ? 220 : 200
      } else if (
        installedMfgIds.size === 0 &&
        exactOwners.size === 1 &&
        !isWeakPattern(exactPattern)
      ) {
        score = 120
      } else {
        continue
      }
      method = 'exact-name'
    } else {
      if (!agrees) continue
      const fuzzyPattern = patterns.find(
        (pat) =>
          !isWeakPattern(pat) &&
          (namesMatch(input.name, pat) || productLineName(pat).toLowerCase() === lineLower)
      )
      const pluginLine = (plugin.productLine || productLineName(plugin.name)).toLowerCase()
      const lineMatch = pluginLine === lineLower && !isWeakPattern(pluginLine)
      if (!fuzzyPattern && !lineMatch) continue
      score = 60 + (lineMatch ? 50 : 0) + (fuzzyPattern ? 20 : 0)
    }

    scored.push({ plugin, manufacturer: mfg, score, method })
  }

  if (!scored.length) return null
  const top = Math.max(...scored.map((m) => m.score))
  return resolveGeneration(
    scored.filter((m) => m.score === top),
    input.installedVersion
  )
}
