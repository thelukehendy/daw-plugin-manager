import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type {
  CatalogBrowseReport,
  CatalogManufacturer,
  CatalogPlugin,
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
import { compareVersions, isOsAtLeast } from './versionCompare'
import {
  HIGH,
  MEDIUM,
  aggregateManufacturerConfidence,
  bandFromScore,
  computeVersionConfidence,
} from './confidence'
import {
  canonicalizeManufacturer,
  generationFromMember,
  groupInstalledPlugins,
  productLineName,
  uniqueSortedVersions,
} from '../scanner/grouping'
import {
  buildCatalogIndex,
  findManufacturerIndexed,
  matchCatalogPluginIndexed,
  type CatalogIndex,
} from './catalogIndex'
import { isContentLikeKind, isVersionTrackedKind, resolveIdentityKind } from './identity'
import {
  bestGroupPopularityTier,
  compareByPopularityThenName,
  effectivePopularityTier,
  popularitySortKey,
} from './popularity'
import { catalogAsOfLabel, parsePluginCatalog, preferNewerCatalog } from './catalogParse'

export { catalogAsOfLabel } from './catalogParse'

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

function matchCatalogPlugin(
  name: string,
  manufacturer: string,
  productLine: string,
  catalog: PluginCatalog,
  index?: CatalogIndex
): {
  plugin: CatalogPlugin
  manufacturer: CatalogManufacturer
  score: number
} | null {
  const idx = index || buildCatalogIndex(catalog)
  return matchCatalogPluginIndexed(name, manufacturer, productLine, idx)
}

function findManufacturer(
  manufacturer: string,
  catalog: PluginCatalog,
  index?: CatalogIndex
): CatalogManufacturer | undefined {
  const idx = index || buildCatalogIndex(catalog)
  return findManufacturerIndexed(manufacturer, idx)
}

function portalAppFor(
  plugin: CatalogPlugin | null | undefined,
  mfg: CatalogManufacturer | null | undefined
): string | null {
  return plugin?.portalApp || mfg?.portalApp || null
}

function successorMeta(
  plugin: CatalogPlugin | null | undefined,
  catalog: PluginCatalog
): { successorPluginId: string | null; successorName: string | null; updateClass: string | null } {
  const id = plugin?.successorPluginId || null
  const updateClass = plugin?.updateClass || (id ? 'paid_upgrade' : null)
  if (!id) return { successorPluginId: null, successorName: null, updateClass }
  const succ = catalog.plugins.find((p) => p.id === id)
  return {
    successorPluginId: id,
    successorName: succ?.name || id,
    updateClass,
  }
}

function evaluateCompatibility(
  plugin: CatalogPlugin | null,
  daws: DawInfo[],
  newestPluginVersion: string | null,
  scheme?: string | null
): CompatibilityFlag[] {
  if (!plugin?.dawIssues?.length || !daws.length) return []
  const flags: CompatibilityFlag[] = []

  for (const issue of plugin.dawIssues) {
    if (!issue.verified) continue
    if (issue.severity === 'info') continue
    if (issue.severity !== 'warn' && issue.severity !== 'block') continue
    if (!issue.minDawVersion && !issue.maxDawVersion) continue
    if (!issue.sourceUrl && !issue.verifiedAt) continue

    if (issue.pluginVersionFrom && newestPluginVersion) {
      const rel = compareVersions(newestPluginVersion, issue.pluginVersionFrom, scheme)
      if (rel === 'outdated') continue
    }
    if (issue.pluginVersionTo && newestPluginVersion) {
      const rel = compareVersions(newestPluginVersion, issue.pluginVersionTo, scheme)
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

      const note = issue.note

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

/**
 * Decide display status. Yellow confidence never becomes a hard "update available".
 */
export function decideStatus(opts: {
  plugin: CatalogPlugin | null
  manufacturer: CatalogManufacturer | null
  installedVersion: string | null
  catalogOnly?: boolean
}): UpdateStatus {
  const { plugin, manufacturer, installedVersion, catalogOnly } = opts
  const kind = resolveIdentityKind(plugin)
  const portal = portalAppFor(plugin, manufacturer)
  const succ = plugin?.successorPluginId || plugin?.updateClass === 'paid_upgrade'
  const conf = typeof plugin?.versionConfidence === 'number' ? plugin.versionConfidence : null
  const latest = plugin?.latestVersion || null

  if (kind === 'discontinued' || plugin?.discontinued) return 'discontinued'
  if (plugin?.bundled) return 'bundled'

  // Paid next-gen is first-class even when identity is ambiguous / content-like.
  if (
    (plugin?.updateClass === 'paid_upgrade' || plugin?.successorPluginId) &&
    (catalogOnly || !latest) &&
    kind !== 'discontinued'
  ) {
    if (kind === 'gen_ambiguous' || catalogOnly) {
      // Prefer successor CTA over a false "unknown version" for gen-ambiguous SKUs.
      if (plugin?.successorPluginId || plugin?.updateClass === 'paid_upgrade') {
        if (kind === 'gen_ambiguous' || !isVersionTrackedKind(kind)) {
          return 'paid_upgrade'
        }
      }
    }
  }

  if (isContentLikeKind(kind) || kind === 'gen_ambiguous') {
    return 'content'
  }

  if (kind === 'hub_app') {
    // Hub apps are not version-tracked; CTA is the vendor manager.
    return 'use_vendor_hub'
  }

  if (!isVersionTrackedKind(kind)) {
    return 'content'
  }

  if (!latest) {
    if (portal) return 'use_vendor_hub'
    if (succ) return 'paid_upgrade'
    return 'unknown'
  }

  if (catalogOnly) {
    if (conf != null && conf < MEDIUM) return 'unverified'
    if (portal && conf != null && conf < HIGH) return 'use_vendor_hub'
    // successorPluginId still surfaces as a paid-upgrade tag in the UI
    return 'current'
  }

  if (!installedVersion) {
    if (portal) return 'use_vendor_hub'
    return 'unknown'
  }

  const scheme = manufacturer?.versionScheme
  const relation = compareVersions(installedVersion, latest, scheme)

  if (relation === 'unknown') {
    if (conf != null && conf < MEDIUM) return 'unverified'
    if (portal) return 'use_vendor_hub'
    return 'unknown'
  }

  if (relation === 'outdated') {
    // Yellow: never "update available"
    if (conf != null && conf < MEDIUM) {
      return portal ? 'use_vendor_hub' : 'unverified'
    }
    if (conf != null && conf < HIGH) return 'update_likely'
    return 'update_available'
  }

  // equal or newer than catalog
  if (succ && plugin?.updateClass === 'paid_upgrade') {
    // Still current on this generation; paid upgrade is additive in UI via fields
    return 'current'
  }
  return 'current'
}

function emptyRowBase(): Pick<
  PluginReportRow,
  | 'confidenceReasons'
  | 'versionSourceUrl'
  | 'versionVerifiedAt'
  | 'identityKind'
  | 'portalApp'
  | 'successorPluginId'
  | 'successorName'
  | 'updateClass'
  | 'notesForUser'
  | 'appleSilicon'
  | 'requiresIlok'
  | 'isFreeware'
  | 'manufacturerId'
> {
  return {
    confidenceReasons: [],
    versionSourceUrl: null,
    versionVerifiedAt: null,
    identityKind: 'plugin',
    portalApp: null,
    successorPluginId: null,
    successorName: null,
    updateClass: null,
    notesForUser: null,
    appleSilicon: null,
    requiresIlok: false,
    isFreeware: false,
    manufacturerId: null,
  }
}

function enrichFromCatalog(
  plugin: CatalogPlugin | null,
  mfg: CatalogManufacturer | null,
  catalog: PluginCatalog
): ReturnType<typeof emptyRowBase> {
  const succ = successorMeta(plugin, catalog)
  return {
    confidenceReasons: plugin?.versionConfidenceReasons || [],
    versionSourceUrl: plugin?.versionSourceUrl || null,
    versionVerifiedAt: plugin?.versionVerifiedAt || null,
    identityKind: resolveIdentityKind(plugin),
    portalApp: portalAppFor(plugin, mfg),
    successorPluginId: succ.successorPluginId,
    successorName: succ.successorName,
    updateClass: succ.updateClass,
    notesForUser: plugin?.notesForUser || null,
    appleSilicon: plugin?.appleSilicon ?? mfg?.appleSilicon ?? null,
    // Booleans: only true when explicitly set — omitted ≠ false for research, but
    // UI treats missing as "no" for requiresIlok / isFreeware flags.
    requiresIlok: plugin?.requiresIlok === true,
    isFreeware: plugin?.isFreeware === true,
    manufacturerId: mfg?.id || plugin?.manufacturerId || null,
  }
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
      const order: Record<string, number> = {
        update_available: 0,
        update_likely: 1,
        paid_upgrade: 2,
        unverified: 3,
        use_vendor_hub: 4,
        unknown: 5,
        discontinued: 6,
        legacy: 7,
        current: 8,
        content: 9,
        bundled: 10,
      }
      const d = (order[a.status] ?? 50) - (order[b.status] ?? 50)
      if (d !== 0) return d
      const tier = compareByPopularityThenName(a, b)
      if (tier !== 0) return tier
      return a.name.localeCompare(b.name)
    })
    const outdatedLike = sorted.filter(
      (p) =>
        p.status === 'update_available' ||
        p.status === 'update_likely' ||
        p.status === 'unverified'
    ).length
    groups.push({
      id: (sorted[0]?.manufacturerId || manufacturer).toLowerCase(),
      manufacturer,
      manufacturerId: sorted[0]?.manufacturerId ?? null,
      updateUrl: sorted.find((p) => p.updateUrl)?.updateUrl ?? null,
      portalApp: sorted.find((p) => p.portalApp)?.portalApp ?? null,
      productCount: sorted.length,
      bundleCount: sorted.reduce((n, p) => n + p.installCount, 0),
      outdatedCount: outdatedLike,
      unknownCount: sorted.filter((p) => p.status === 'unknown').length,
      currentCount: sorted.filter((p) => p.status === 'current').length,
      bundledCount: sorted.filter((p) => p.status === 'bundled').length,
      hasCompatWarning: sorted.some((p) => p.compatibilityFlags.some((f) => f.severity !== 'info')),
      ...aggregateManufacturerConfidence(sorted),
      popularityTier: bestGroupPopularityTier(sorted),
      products: sorted,
    })
  }

  return groups.sort((a, b) => {
    const tier = popularitySortKey(a.popularityTier) - popularitySortKey(b.popularityTier)
    if (tier !== 0) return tier
    if (b.outdatedCount !== a.outdatedCount) return b.outdatedCount - a.outdatedCount
    return a.manufacturer.localeCompare(b.manufacturer)
  })
}

/**
 * Build grouped report rows from installed plugins + catalog.
 * Never invents latestVersion — absent stays null (UI shows "unknown").
 * Uses a pre-built catalog index (O(candidates) per group, not O(catalog)).
 */
export async function buildReportRows(
  plugins: InstalledPlugin[],
  catalog: PluginCatalog,
  system: SystemInfo,
  daws: DawInfo[] = [],
  onProgress?: (done: number, total: number) => void
): Promise<PluginReportRow[]> {
  const overrides = await loadOverrides()
  const floorUpdates: Record<string, string> = {}
  const groups = groupInstalledPlugins(plugins)
  const index = buildCatalogIndex(catalog)
  const rows: PluginReportRow[] = []
  const chunk = 48

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
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
        olderThanNewest && m.formats.length > 0 && m.formats.every((f) => f === 'VST')
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
      catalog,
      index
    )
    const mfgFallback = findManufacturer(group.manufacturer, catalog, index)
    const isAppleBundled = canonicalizeManufacturer(group.manufacturer) === 'Apple'

    if (!match) {
      let status: UpdateStatus = isAppleBundled ? 'bundled' : 'unknown'
      if (mfgFallback?.portalApp && status === 'unknown') status = 'use_vendor_hub'
      const conf = computeVersionConfidence({
        status,
        plugin: null,
        catalog,
        catalogMatched: false,
        hasInstalledVersion: !!group.newestVersion,
      })
      rows.push({
        id: group.key,
        name: group.name,
        manufacturer: canonicalizeManufacturer(group.manufacturer),
        manufacturerId: mfgFallback?.id ?? null,
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: null,
        releaseDate: null,
        status,
        ...conf,
        ...enrichFromCatalog(null, mfgFallback || null, catalog),
        portalApp: mfgFallback?.portalApp || null,
        formats,
        updateUrl: mfgFallback?.updatePortalUrl ?? null,
        dawCompatibility: isAppleBundled ? 'Apple / system component' : null,
        minMacOS: null,
        osCompatible: null,
        compatibilityFlags: [],
        paths,
        catalogMatched: false,
        installCount: group.members.length,
        popularityTier: effectivePopularityTier(null, mfgFallback || null),
      })
    } else {
      const { plugin, manufacturer, score: matchScore } = match
      const scheme = manufacturer.versionScheme
      const compatibilityFlags = evaluateCompatibility(
        plugin,
        daws,
        group.newestVersion,
        scheme
      )
      const catalogLatest = plugin.latestVersion ?? null
      const effectiveLatest = catalogLatest

      const status = plugin.bundled
        ? ('bundled' as UpdateStatus)
        : decideStatus({
            plugin,
            manufacturer,
            installedVersion: group.newestVersion,
          })

      const overrideKey = `${manufacturer.id}::${group.productLine.toLowerCase()}`
      const floorFromOverride =
        overrides.versionFloors[overrideKey] || overrides.versionFloors[plugin.id]
      const relation = compareVersions(group.newestVersion, effectiveLatest, scheme)
      if (relation === 'newer' && group.newestVersion) {
        const prev = floorFromOverride
        if (!prev || compareVersions(group.newestVersion, prev, scheme) === 'newer') {
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

      const extra = enrichFromCatalog(plugin, manufacturer, catalog)

      rows.push({
        id: group.key,
        name: group.name,
        manufacturer: manufacturer.name,
        manufacturerId: manufacturer.id,
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: effectiveLatest,
        releaseDate: plugin.releaseDate ?? null,
        status,
        ...conf,
        ...extra,
        confidenceReasons:
          conf.confidenceReasons.length > 0
            ? conf.confidenceReasons
            : extra.confidenceReasons,
        formats,
        updateUrl: plugin.updatePortalUrl || manufacturer.updatePortalUrl,
        dawCompatibility: plugin.dawCompatibility ?? null,
        minMacOS: plugin.minMacOS ?? null,
        osCompatible: isOsAtLeast(system.osVersion, plugin.minMacOS),
        compatibilityFlags,
        paths,
        catalogMatched: true,
        installCount: group.members.length,
        popularityTier: effectivePopularityTier(plugin, manufacturer),
      })
    }

    if ((i + 1) % chunk === 0 || i === groups.length - 1) {
      onProgress?.(i + 1, groups.length)
      await new Promise<void>((r) => setImmediate(r))
    }
  }

  if (Object.keys(floorUpdates).length) {
    await saveOverrides({
      ...overrides,
      versionFloors: { ...overrides.versionFloors, ...floorUpdates },
    })
  }

  return rows
}

/** Project catalog plugins into browse rows (no local install). */
export function buildCatalogBrowseRows(catalog: PluginCatalog): PluginReportRow[] {
  return catalog.plugins.map((plugin) => {
    const manufacturer =
      catalog.manufacturers.find((m) => m.id === plugin.manufacturerId) || null
    const status = decideStatus({
      plugin,
      manufacturer,
      installedVersion: null,
      catalogOnly: true,
    })
    const conf = computeVersionConfidence({
      status,
      plugin,
      catalog,
      catalogMatched: true,
      hasInstalledVersion: false,
      catalogVersionOnly: true,
    })
    const extra = enrichFromCatalog(plugin, manufacturer, catalog)
    return {
      id: plugin.id,
      name: plugin.name,
      manufacturer: manufacturer?.name || plugin.manufacturerId,
      productLine: plugin.productLine || productLineName(plugin.name),
      installedVersion: null,
      installedVersions: [],
      versionDetails: [],
      latestVersion: plugin.latestVersion ?? null,
      releaseDate: plugin.releaseDate ?? null,
      status,
      ...conf,
      ...extra,
      confidenceReasons:
        conf.confidenceReasons.length > 0
          ? conf.confidenceReasons
          : extra.confidenceReasons,
      formats: (plugin.formats || []) as PluginReportRow['formats'],
      updateUrl: plugin.updatePortalUrl || manufacturer?.updatePortalUrl || null,
      dawCompatibility: plugin.dawCompatibility ?? null,
      minMacOS: plugin.minMacOS ?? null,
      osCompatible: null,
      compatibilityFlags: [],
      paths: [],
      catalogMatched: true,
      installCount: 0,
      catalogOnly: true,
      popularityTier: effectivePopularityTier(plugin, manufacturer),
    }
  })
}

export async function buildCatalogBrowseReport(
  options?: { appPath?: string; preferBundled?: boolean }
): Promise<CatalogBrowseReport> {
  const catalog = await loadCatalog(options)
  const rows = buildCatalogBrowseRows(catalog)
  const manufacturers = buildManufacturerGroups(rows)

  let withVersion = 0
  let unknownVersion = 0
  let green = 0
  let amber = 0
  let yellow = 0
  let content = 0
  let discontinued = 0
  let hub = 0

  for (const row of rows) {
    if (row.status === 'content') content++
    if (row.status === 'discontinued') discontinued++
    if (row.status === 'use_vendor_hub' || row.identityKind === 'hub_app') hub++
    if (row.latestVersion) {
      withVersion++
      const b = bandFromScore(row.confidence)
      if (b === 'high') green++
      else if (b === 'medium') amber++
      else yellow++
    } else if (isVersionTrackedKind(row.identityKind)) {
      unknownVersion++
    }
  }

  return {
    mode: 'catalog',
    rows,
    manufacturers,
    catalog: {
      updatedAt: catalog.updatedAt,
      source: catalog.catalogSource || 'bundled',
      pluginCount: catalog.plugins.length,
      manufacturerCount: catalog.manufacturers.length,
    },
    summary: {
      pluginCount: rows.length,
      manufacturerCount: manufacturers.length,
      withVersion,
      unknownVersion,
      green,
      amber,
      yellow,
      content,
      discontinued,
      hub,
    },
  }
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
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        continue
      }
      try {
        return parsePluginCatalog(parsed, `bundled:${path}`)
      } catch {
        continue
      }
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
      const parsed = (await res.json()) as unknown
      try {
        return parsePluginCatalog(parsed, `remote:${url}`)
      } catch {
        continue
      }
    } catch {
      /* try next */
    }
  }
  return null
}

export async function applyLocalFloors(catalog: PluginCatalog): Promise<PluginCatalog> {
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
      // Prefer newer updatedAt; never invent versions from a stale snapshot.
      base = preferNewerCatalog(bundled, remote)
    }
  }

  return applyLocalFloors(base)
}

export { HIGH, MEDIUM, bandFromScore }
