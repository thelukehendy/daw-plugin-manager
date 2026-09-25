import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
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
  type PluginGroup,
} from '../scanner/grouping'
import {
  buildCatalogIndex,
  findManufacturerIndexed,
  matchCatalogPluginIndexed,
  type CatalogIndex,
  type MatchInput,
} from './catalogIndex'
import { isContentLikeKind, isVersionTrackedKind, resolveIdentityKind } from './identity'
import {
  bestGroupPopularityTier,
  compareByPopularityThenName,
  effectivePopularityTier,
  popularitySortKey,
} from './popularity'
import { catalogAsOfLabel, parsePluginCatalog } from './catalogParse'
import { logCatalogLoad } from './publicFacing'
import {
  CatalogVerifyError,
  compareBuildId,
  fetchCatalogPointer,
  fetchVerifiedCatalogBytes,
  isSupportedSchemaVersion,
  type FetchLike,
} from './catalogFeed'
import {
  atomicInstallCatalog,
  defaultUserDataPath,
  loadInstalledCatalog,
} from './catalogCache'

export { catalogAsOfLabel } from './catalogParse'
export { CatalogVerifyError, CATALOG_VERIFY_USER_MESSAGE } from './catalogFeed'

function matchInputForGroup(group: PluginGroup): MatchInput {
  const vendorNames = new Set<string>([group.manufacturer])
  const bundleIds = new Set<string>()
  const auComponents: MatchInput['auComponents'] = []
  for (const m of group.members) {
    if (m.manufacturerHint) vendorNames.add(m.manufacturerHint)
    if (m.auVendor) vendorNames.add(m.auVendor)
    for (const id of m.bundleIds || (m.bundleId ? [m.bundleId] : [])) bundleIds.add(id)
    auComponents.push(...(m.auComponents || []))
  }
  return {
    name: group.name,
    productLine: group.productLine,
    vendorNames: [...vendorNames].filter(Boolean),
    bundleIds: [...bundleIds],
    auComponents,
  }
}

function findManufacturerForGroup(
  input: MatchInput,
  index: CatalogIndex
): CatalogManufacturer | undefined {
  for (const v of input.vendorNames) {
    const m = findManufacturerIndexed(v, index)
    if (m) return m
  }
  return undefined
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

    const matchInput = matchInputForGroup(group)
    const match = matchCatalogPluginIndexed(matchInput, index)
    const mfgFallback = findManufacturerForGroup(matchInput, index)
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
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: null,
        finalVersion: null,
        catalogPluginId: null,
        matchMethod: null,
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
      const { plugin, manufacturer, score: matchScore, method: matchMethod } = match
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
        productLine: group.productLine,
        installedVersion: group.newestVersion,
        installedVersions,
        versionDetails,
        latestVersion: effectiveLatest,
        finalVersion: plugin.finalVersion ?? null,
        catalogPluginId: plugin.id,
        matchMethod,
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
      finalVersion: plugin.finalVersion ?? null,
      catalogPluginId: plugin.id,
      matchMethod: null,
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

async function loadBundledCatalog(
  appPath?: string,
  bundledCatalogPath?: string
): Promise<PluginCatalog> {
  const resourcePath =
    typeof process.resourcesPath === 'string' ? process.resourcesPath : undefined

  const candidates = [
    bundledCatalogPath || '',
    join(__dirname, '../../catalog/catalog.json'),
    join(__dirname, '../../../catalog/catalog.json'),
    join(process.cwd(), 'catalog/catalog.json'),
    appPath ? join(appPath, 'catalog/catalog.json') : '',
    resourcePath ? join(resourcePath, 'catalog/catalog.json') : '',
  ].filter(Boolean)

  for (const path of candidates) {
    if (existsSync(path)) {
      const raw = await readFile(path, 'utf8')
      try {
        const catalog = parsePluginCatalog(JSON.parse(raw), 'bundled')
        catalog.catalogBuildId = catalog.updatedAt
        catalog.catalogSource = 'bundled'
        return catalog
      } catch {
        continue
      }
    }
  }
  throw new Error('Bundled plugin catalog not found')
}

export async function applyLocalFloors(catalog: PluginCatalog): Promise<PluginCatalog> {
  return catalog
}

function buildIdOf(catalog: PluginCatalog): string {
  return catalog.catalogBuildId || catalog.updatedAt
}

/** Newer buildId wins; equal → keep `preferred` (installed/remote, never downgrade). */
function preferNewerBuild(
  fallback: PluginCatalog,
  preferred: PluginCatalog | null
): PluginCatalog {
  if (!preferred) return fallback
  return compareBuildId(buildIdOf(preferred), buildIdOf(fallback)) >= 0 ? preferred : fallback
}

export async function loadCatalog(options?: {
  preferBundled?: boolean
  appPath?: string
  userDataPath?: string
  bundledCatalogPath?: string
  throwOnVerifyFailure?: boolean
  fetch?: FetchLike
  now?: number
}): Promise<PluginCatalog> {
  const bundled = await loadBundledCatalog(options?.appPath, options?.bundledCatalogPath)
  const userDataPath = options?.userDataPath || defaultUserDataPath()

  let current = bundled
  if (!options?.preferBundled) {
    const installed = await loadInstalledCatalog(userDataPath)
    current = preferNewerBuild(bundled, installed?.catalog ?? null)
  }

  if (!options?.preferBundled) {
    try {
      const pointer = await fetchCatalogPointer({
        fetch: options?.fetch,
        now: options?.now,
      })
      if (compareBuildId(pointer.buildId, buildIdOf(current)) <= 0) {
        // Already current — v2 never downgrades.
      } else if (!isSupportedSchemaVersion(pointer.schemaVersion)) {
        console.warn('[catalog] v2 pointer schema refused; keeping installed catalog')
        throw new CatalogVerifyError()
      } else {
        const bytes = await fetchVerifiedCatalogBytes(pointer, { fetch: options?.fetch })
        let parsed
        try {
          parsed = parsePluginCatalog(
            JSON.parse(Buffer.from(bytes).toString('utf8')),
            'remote:v2'
          )
        } catch {
          throw new CatalogVerifyError()
        }
        parsed.catalogSource = 'remote:v2'
        parsed.catalogBuildId = pointer.buildId
        await atomicInstallCatalog(userDataPath, bytes, {
          buildId: pointer.buildId,
          sha256: pointer.sha256,
          schemaVersion: pointer.schemaVersion,
        })
        current = parsed
      }
    } catch (err) {
      if (err instanceof CatalogVerifyError && options?.throwOnVerifyFailure) {
        logCatalogLoad(current)
        throw err
      }
      if (!(err instanceof CatalogVerifyError)) {
        console.warn('[catalog] v2 feed unavailable; keeping installed catalog')
      }
    }
  }

  const out = await applyLocalFloors(current)
  logCatalogLoad(out)
  return out
}

/** Force a pointer re-check (Refresh catalog). Surfaces verify failures to the UI. */
export async function refreshCatalog(options?: {
  appPath?: string
  userDataPath?: string
  bundledCatalogPath?: string
  fetch?: FetchLike
  now?: number
}): Promise<PluginCatalog> {
  return loadCatalog({
    preferBundled: false,
    throwOnVerifyFailure: true,
    appPath: options?.appPath,
    userDataPath: options?.userDataPath,
    bundledCatalogPath: options?.bundledCatalogPath,
    fetch: options?.fetch,
    now: options?.now,
  })
}

export { HIGH, MEDIUM, bandFromScore }
