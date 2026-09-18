import type { CatalogManufacturer, CatalogPlugin, PluginCatalog } from '../../shared/types'
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
  manufacturerByKey: Map<string, CatalogManufacturer>
}

function pushMap<T>(map: Map<string, T[]>, key: string, value: T): void {
  const k = key.trim()
  if (!k) return
  const list = map.get(k)
  if (list) list.push(value)
  else map.set(k, [value])
}

function lineKey(s: string): string {
  return productLineName(s).toLowerCase().trim()
}

/** Build once per catalog load — O(plugins + manufacturers). */
export function buildCatalogIndex(catalog: PluginCatalog): CatalogIndex {
  const byId = new Map<string, CatalogPlugin>()
  const byManufacturerId = new Map<string, CatalogPlugin[]>()
  const byLine = new Map<string, CatalogPlugin[]>()
  const byExactName = new Map<string, CatalogPlugin[]>()
  const manufacturerByKey = new Map<string, CatalogManufacturer>()

  for (const m of catalog.manufacturers) {
    manufacturerByKey.set(m.id.toLowerCase(), m)
    manufacturerByKey.set(m.name.toLowerCase(), m)
    for (const a of m.aliases || []) {
      manufacturerByKey.set(a.toLowerCase(), m)
    }
  }

  for (const plugin of catalog.plugins) {
    byId.set(plugin.id, plugin)
    pushMap(byManufacturerId, plugin.manufacturerId, plugin)
    pushMap(byExactName, plugin.name.toLowerCase(), plugin)
    pushMap(byLine, lineKey(plugin.name), plugin)
    if (plugin.productLine) pushMap(byLine, lineKey(plugin.productLine), plugin)
    const patterns = plugin.matchPatterns?.length ? plugin.matchPatterns : [plugin.name]
    for (const pat of patterns) {
      pushMap(byLine, lineKey(pat), plugin)
      pushMap(byExactName, pat.toLowerCase(), plugin)
    }
  }

  return {
    catalog,
    byId,
    byManufacturerId,
    byLine,
    byExactName,
    manufacturerByKey,
  }
}

export function findManufacturerIndexed(
  manufacturer: string,
  index: CatalogIndex
): CatalogManufacturer | undefined {
  const mfgLower = canonicalizeManufacturer(manufacturer).toLowerCase()
  const direct = index.manufacturerByKey.get(mfgLower)
  if (direct) return direct
  for (const [key, m] of index.manufacturerByKey) {
    if (mfgLower.includes(key) || key.includes(mfgLower)) return m
  }
  return undefined
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
  const esc = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, 'i').test(a)
}

/** Fast match using pre-built index. Same scoring contract as legacy loop. */
export function matchCatalogPluginIndexed(
  name: string,
  manufacturer: string,
  productLine: string,
  index: CatalogIndex
): {
  plugin: CatalogPlugin
  manufacturer: CatalogManufacturer
  score: number
} | null {
  const nameLower = name.toLowerCase()
  const lineLower = productLine.toLowerCase()
  const mfgLower = canonicalizeManufacturer(manufacturer).toLowerCase()

  const candidates = new Map<string, CatalogPlugin>()
  const addAll = (list?: CatalogPlugin[]) => {
    if (!list) return
    for (const p of list) candidates.set(p.id, p)
  }

  addAll(index.byExactName.get(nameLower))
  addAll(index.byLine.get(lineKey(name)))
  addAll(index.byLine.get(lineKey(productLine)))
  addAll(index.byLine.get(lineLower))

  const mfgHit = findManufacturerIndexed(manufacturer, index)
  if (mfgHit) addAll(index.byManufacturerId.get(mfgHit.id))

  let best: {
    plugin: CatalogPlugin
    manufacturer: CatalogManufacturer
    score: number
  } | null = null

  for (const plugin of candidates.values()) {
    const mfg =
      index.manufacturerByKey.get(plugin.manufacturerId.toLowerCase()) ||
      index.catalog.manufacturers.find((m) => m.id === plugin.manufacturerId)
    if (!mfg) continue

    const mfgAliases = [
      mfg.name.toLowerCase(),
      mfg.id.toLowerCase(),
      ...(mfg.aliases || []).map((a) => a.toLowerCase()),
    ]
    const mfgOk = mfgAliases.some(
      (a) => mfgLower === a || mfgLower.includes(a) || a.includes(mfgLower)
    )

    const pluginLine = (plugin.productLine || productLineName(plugin.name)).toLowerCase()
    const patterns = plugin.matchPatterns.length ? plugin.matchPatterns : [plugin.name]
    const matchedPattern = patterns.find(
      (pat) => namesMatch(name, pat) || productLineName(pat).toLowerCase() === lineLower
    )
    const lineMatch = pluginLine === lineLower

    if (!matchedPattern && !lineMatch) continue

    let score = matchedPattern && matchedPattern.toLowerCase() === nameLower ? 100 : 40
    if (lineMatch) score += 50
    if (matchedPattern) score += 20
    if (mfgOk) score += 40
    if (nameLower === plugin.name.toLowerCase()) score += 20

    if (!best || score > best.score) best = { plugin, manufacturer: mfg, score }
  }

  if (best && best.score >= 50) return best
  return null
}
