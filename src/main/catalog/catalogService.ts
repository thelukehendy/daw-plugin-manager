import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type {
  CompatibilityFlag,
  DawInfo,
  InstalledPlugin,
  InstalledVersionInfo,
  ManufacturerReportGroup,
  PluginCatalog,
  PluginReportRow,
  SystemInfo,
  UpdateStatus,
} from '../../shared/types'
import {
  compareVersions,
  isOsAtLeast,
  normalizeVersion,
} from './versionCompare'
import {
  aggregateManufacturerConfidence,
  computeVersionConfidence,
} from './confidence'
import {
  canonicalizeManufacturer,
  generationFromMember,
  groupInstalledPlugins,
  productFamilyName,
  productLineName,
  uniqueSortedVersions,
} from '../scanner/grouping'

const FALLBACK_REMOTE_CATALOG_URLS = [
  'https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@main/catalog/catalog.json',
  'https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json',
]

async function resolveRemoteCatalogUrls(appPath?: string): Promise<string[]> {
  const resourcePath =
    typeof process.resourcesPath === 'string' ? process.resourcesPath : undefined
  const candidates = [
    join(__dirname, '../../catalog/remote-urls.json'),
    join(__dirname, '../../../catalog/remote-urls.json'),
    join(process.cwd(), 'catalog/remote-urls.json'),
    appPath ? join(appPath, 'catalog/remote-urls.json') : '',
    resourcePath ? join(resourcePath, 'catalog/remote-urls.json') : '',
  ].filter(Boolean)

  for (const path of candidates) {
    if (!existsSync(path)) continue
    try {
      const raw = JSON.parse(await readFile(path, 'utf8')) as { urls?: string[] }
      if (Array.isArray(raw.urls) && raw.urls.length) return raw.urls
    } catch {
      /* try next */
    }
  }
  return FALLBACK_REMOTE_CATALOG_URLS
}

function localCatalogOverridePath(): string {
  return join(homedir(), 'Library/Application Support/DAW Plugin Manager/catalog-overrides.json')
}

interface CatalogOverrides {
  updatedAt: string
  versionFloors: Record<string, string>
}

async function loadOverrides(): Promise<CatalogOverrides> {
  const path = localCatalogOverridePath()
  if (!existsSync(path)) return { updatedAt: new Date(0).toISOString(), versionFloors: {} }
  try {
    return JSON.parse(await readFile(path, 'utf8')) as CatalogOverrides
  } catch {
    return { updatedAt: new Date(0).toISOString(), versionFloors: {} }
  }
}

async function saveOverrides(overrides: CatalogOverrides): Promise<void> {
  const path = localCatalogOverridePath()
  try {
    await mkdir(join(homedir(), 'Library/Application Support/DAW Plugin Manager'), {
      recursive: true,
    })
    overrides.updatedAt = new Date().toISOString()
    await writeFile(path, JSON.stringify(overrides, null, 2), 'utf8')
  } catch {
    /* non-fatal */
  }
}

function maxVersion(a: string | null | undefined, b: string | null | undefined): string | null {
  if (!a) return b ?? null
  if (!b) return a
  const rel = compareVersions(a, b)
  if (rel === 'newer') return a
  if (rel === 'outdated') return b
  return normalizeVersion(a) || a
}

function namesMatch(installedName: string, pattern: string): boolean {
  const a = installedName.toLowerCase().trim()
  const b = pattern.toLowerCase().trim()
  if (!a || !b) return false
  if (a === b) return true
  if (productLineName(installedName).toLowerCase() === productLineName(pattern).toLowerCase()) {
    // Only treat as match when pattern is the line itself or same family
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

function matchCatalogPlugin(
  name: string,
  manufacturer: string,
  productLine: string,
  catalog: PluginCatalog
): {
  plugin: PluginCatalog['plugins'][0]
  manufacturer: PluginCatalog['manufacturers'][0]
  score: number
} | null {
  const nameLower = name.toLowerCase()
  const lineLower = productLine.toLowerCase()
  const mfgLower = canonicalizeManufacturer(manufacturer).toLowerCase()

  let best:
    | {
        plugin: PluginCatalog['plugins'][0]
        manufacturer: PluginCatalog['manufacturers'][0]
        score: number
      }
    | null = null

  for (const plugin of catalog.plugins) {
    const mfg = catalog.manufacturers.find((m) => m.id === plugin.manufacturerId)
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

function findManufacturer(
  manufacturer: string,
  catalog: PluginCatalog
): PluginCatalog['manufacturers'][0] | undefined {
  const mfgLower = canonicalizeManufacturer(manufacturer).toLowerCase()
  return catalog.manufacturers.find((m) => {
    const aliases = [m.name, m.id, ...(m.aliases || [])].map((x) => x.toLowerCase())
    return aliases.some((a) => mfgLower === a || mfgLower.includes(a) || a.includes(mfgLower))
  })
}

function evaluateCompatibility(
  plugin: PluginCatalog['plugins'][0] | null,
  daws: DawInfo[],
  newestPluginVersion: string | null
): CompatibilityFlag[] {
  if (!plugin?.dawIssues?.length || !daws.length) return []
  const flags: CompatibilityFlag[] = []

  for (const issue of plugin.dawIssues) {
    // Absolute-certainty gate: skip advisory / unverified / info-only entries.
    if (!issue.verified) continue
    if (issue.severity === 'info') continue
    if (issue.severity !== 'warn' && issue.severity !== 'block') continue
    // Require a concrete DAW version bound — "might want to check notes" is not an issue.
    if (!issue.minDawVersion && !issue.maxDawVersion) continue
    if (!issue.sourceUrl && !issue.verifiedAt) continue

    if (issue.pluginVersionFrom && newestPluginVersion) {
      const rel = compareVersions(newestPluginVersion, issue.pluginVersionFrom)
      if (rel === 'outdated') continue
    }
    if (issue.pluginVersionTo && newestPluginVersion) {
      const rel = compareVersions(newestPluginVersion, issue.pluginVersionTo)
      if (rel === 'newer' || rel === 'equal') continue
    }

    for (const daw of daws) {
      const pat = issue.dawNamePattern.toLowerCase()
      if (!daw.name.toLowerCase().includes(pat) && !(issue.dawId && daw.id.includes(issue.dawId))) {
        continue
      }
      if (!daw.version) continue

      let matches = false
      if (issue.minDawVersion) {
        const rel = compareVersions(daw.version, issue.minDawVersion)
        if (rel === 'outdated') matches = true
      }
      if (issue.maxDawVersion) {
        const rel = compareVersions(daw.version, issue.maxDawVersion)
        if (rel === 'newer') matches = true
      }
      if (!matches) continue

      const note = issue.sourceUrl
        ? `${issue.note} (source: ${issue.sourceUrl})`
        : issue.note

      flags.push({
        severity: issue.severity,
        dawName: daw.name,
        dawVersion: daw.version,
        note,
      })
    }
  }

  return flags
}

export function buildManufacturerGroups(rows: PluginReportRow[]): ManufacturerReportGroup[] {
  const map = new Map<string, PluginReportRow[]>()
  for (const row of rows) {
    const key = row.manufacturer
    const list = map.get(key) || []
    list.push(row)
    map.set(key, list)
  }

  const groups: ManufacturerReportGroup[] = []
  for (const [manufacturer, products] of map) {
    const sorted = [...products].sort((a, b) => {
      const order = { outdated: 0, unknown: 1, legacy: 2, current: 3, bundled: 4 } as const
      const d = order[a.status] - order[b.status]
      return d !== 0 ? d : a.name.localeCompare(b.name)
    })
    groups.push({
      id: manufacturer.toLowerCase(),
      manufacturer,
      updateUrl: sorted.find((p) => p.updateUrl)?.updateUrl ?? null,
      productCount: sorted.length,
      bundleCount: sorted.reduce((n, p) => n + p.installCount, 0),
      outdatedCount: sorted.filter((p) => p.status === 'outdated').length,
      unknownCount: sorted.filter((p) => p.status === 'unknown').length,
      currentCount: sorted.filter((p) => p.status === 'current').length,
      bundledCount: sorted.filter((p) => p.status === 'bundled').length,
      hasCompatWarning: sorted.some((p) => p.compatibilityFlags.some((f) => f.severity !== 'info')),
      ...aggregateManufacturerConfidence(sorted),
      products: sorted,
    })
  }

  return groups.sort((a, b) => {
    if (b.outdatedCount !== a.outdatedCount) return b.outdatedCount - a.outdatedCount
    return a.manufacturer.localeCompare(b.manufacturer)
  })
}

/**
 * Build grouped report rows.
 * - Product lines (Kontakt 6+8) collapse; status uses newest generation only.
 * - Older majors appear as legacy installs inside the expanded bundle list.
 * - Installed ≥ catalog ⇒ current (never "newer than catalog").
 */
export async function buildReportRows(
  plugins: InstalledPlugin[],
  catalog: PluginCatalog,
  system: SystemInfo,
  daws: DawInfo[] = []
): Promise<PluginReportRow[]> {
  const overrides = await loadOverrides()
  const floorUpdates: Record<string, string> = {}
  const groups = groupInstalledPlugins(plugins)

  const rows: PluginReportRow[] = groups.map((group) => {
    const topGen = group.newestGeneration ?? 0
    const formats = [...new Set(group.members.flatMap((m) => m.formats))]
    const paths = [...new Set(group.members.flatMap((m) => m.paths))]
    const installedVersions = uniqueSortedVersions(group.members.map((m) => m.version))

    const versionDetails: InstalledVersionInfo[] = group.members.map((m) => {
      const olderThanNewest =
        !!group.newestVersion &&
        !!m.version &&
        compareVersions(m.version, group.newestVersion) === 'outdated'
      const onlyLegacyVst =
        olderThanNewest &&
        m.formats.length > 0 &&
        m.formats.every((f) => f === 'VST')
      return {
        version: m.version,
        name: m.name,
        formats: m.formats,
        paths: m.paths,
        modifiedAt: m.modifiedAt,
        legacy: (topGen > 0 && generationFromMember(m) < topGen) || onlyLegacyVst,
      }
    })

    const match = matchCatalogPlugin(
      group.name,
      group.manufacturer,
      group.productLine,
      catalog
    )
    const mfgFallback = findManufacturer(group.manufacturer, catalog)
    const isAppleBundled = canonicalizeManufacturer(group.manufacturer) === 'Apple'

    if (!match) {
      let status: UpdateStatus = isAppleBundled ? 'bundled' : 'unknown'
      const conf = computeVersionConfidence({
        status,
        plugin: null,
        catalog,
        catalogMatched: false,
        hasInstalledVersion: !!group.newestVersion,
      })
      return {
        id: group.key,
        name: group.name,
        manufacturer: canonicalizeManufacturer(group.manufacturer),
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: null,
        releaseDate: null,
        status,
        ...conf,
        formats,
        updateUrl: mfgFallback?.updatePortalUrl ?? null,
        dawCompatibility: isAppleBundled ? 'Apple / system component' : null,
        minMacOS: null,
        osCompatible: null,
        compatibilityFlags: [],
        paths,
        catalogMatched: false,
        installCount: group.members.length,
      }
    }

    const { plugin, manufacturer, score: matchScore } = match
    const compatibilityFlags = evaluateCompatibility(plugin, daws, group.newestVersion)

    if (plugin.bundled) {
      const conf = computeVersionConfidence({
        status: 'bundled',
        plugin,
        catalog,
        matchScore,
        catalogMatched: true,
        hasInstalledVersion: !!group.newestVersion,
      })
      return {
        id: group.key,
        name: group.name,
        manufacturer: manufacturer.name,
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: plugin.latestVersion,
        releaseDate: plugin.releaseDate ?? null,
        status: 'bundled',
        ...conf,
        formats,
        updateUrl: plugin.updatePortalUrl || manufacturer.updatePortalUrl,
        dawCompatibility: plugin.dawCompatibility ?? 'Bundled with OS / DAW',
        minMacOS: plugin.minMacOS ?? null,
        osCompatible: isOsAtLeast(system.osVersion, plugin.minMacOS),
        compatibilityFlags,
        paths,
        catalogMatched: true,
        installCount: group.members.length,
      }
    }

    const overrideKey = `${manufacturer.id}::${group.productLine.toLowerCase()}`
    // Display only the catalog's public latest — never inflate from local installs.
    const catalogLatest = plugin.latestVersion
    const floorFromOverride = overrides.versionFloors[overrideKey] || overrides.versionFloors[plugin.id]
    // Floors only help status if a curated override exists; they must not exceed catalog
    // unless explicitly stored as a verified bump (remote catalog should own that).
    const effectiveLatest = catalogLatest

    const relation = compareVersions(group.newestVersion, effectiveLatest)
    let status: UpdateStatus
    if (!group.newestVersion || !effectiveLatest) status = 'unknown'
    else if (relation === 'outdated') status = 'outdated'
    else status = 'current' // equal or installed newer than published catalog entry

    // If this machine is ahead of catalog, remember it locally for maintainers — but do not
    // change the displayed public latest version.
    if (relation === 'newer' && group.newestVersion) {
      const prev = floorFromOverride
      if (!prev || compareVersions(group.newestVersion, prev) === 'newer') {
        floorUpdates[overrideKey] = group.newestVersion
      }
    }

    const conf = computeVersionConfidence({
      status,
      plugin,
      catalog,
      matchScore,
      catalogMatched: true,
      hasInstalledVersion: !!group.newestVersion,
    })

    return {
      id: group.key,
      name: group.name,
      manufacturer: manufacturer.name,
      productLine: group.productLine,
      installedVersion: group.newestVersion,
      installedVersions,
      versionDetails,
      latestVersion: effectiveLatest,
      releaseDate: plugin.releaseDate ?? null,
      status,
      ...conf,
      formats,
      updateUrl: plugin.updatePortalUrl || manufacturer.updatePortalUrl,
      dawCompatibility: plugin.dawCompatibility ?? null,
      minMacOS: plugin.minMacOS ?? null,
      osCompatible: isOsAtLeast(system.osVersion, plugin.minMacOS),
      compatibilityFlags,
      paths,
      catalogMatched: true,
      installCount: group.members.length,
    }
  })

  if (Object.keys(floorUpdates).length) {
    await saveOverrides({
      ...overrides,
      versionFloors: { ...overrides.versionFloors, ...floorUpdates },
    })
  }

  return rows
}

async function loadBundledCatalog(appPath?: string): Promise<PluginCatalog> {
  const resourcePath =
    typeof process.resourcesPath === 'string' ? process.resourcesPath : undefined

  const candidates = [
    join(__dirname, '../../catalog/catalog.json'),
    join(__dirname, '../../../catalog/catalog.json'),
    join(process.cwd(), 'catalog/catalog.json'),
    appPath ? join(appPath, 'catalog/catalog.json') : '',
    resourcePath ? join(resourcePath, 'catalog/catalog.json') : '',
  ].filter(Boolean)

  for (const path of candidates) {
    if (existsSync(path)) {
      const raw = await readFile(path, 'utf8')
      const catalog = JSON.parse(raw) as PluginCatalog
      catalog.catalogSource = catalog.catalogSource || `bundled:${path}`
      return catalog
    }
  }
  throw new Error('Bundled plugin catalog not found')
}

export async function fetchRemoteCatalog(
  urls?: string[]
): Promise<PluginCatalog | null> {
  const list = urls?.length ? urls : await resolveRemoteCatalogUrls()
  for (const url of list) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      if (!res.ok) continue
      const catalog = (await res.json()) as PluginCatalog
      if (!catalog.manufacturers || !catalog.plugins) continue
      catalog.catalogSource = `remote:${url}`
      return catalog
    } catch {
      /* try next */
    }
  }
  return null
}

export async function applyLocalFloors(catalog: PluginCatalog): Promise<PluginCatalog> {
  // Local install floors must never inflate the public "latest" shown to users.
  // Verified versions come only from the bundled/remote catalog.
  return catalog
}

export async function loadCatalog(options?: {
  remoteUrls?: string[]
  preferBundled?: boolean
  appPath?: string
}): Promise<PluginCatalog> {
  const bundled = await loadBundledCatalog(options?.appPath)

  let base = bundled
  if (!options?.preferBundled) {
    const remoteUrls =
      options?.remoteUrls || (await resolveRemoteCatalogUrls(options?.appPath))
    const remote = await fetchRemoteCatalog(remoteUrls)
    if (remote) {
      const remoteTime = Date.parse(remote.updatedAt || '') || 0
      const bundledTime = Date.parse(bundled.updatedAt || '') || 0
      base = remoteTime >= bundledTime ? remote : bundled
    }
  }

  return applyLocalFloors(base)
}
