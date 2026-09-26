/**
 * Installed DAWs and helper apps ↔ catalog `standalone_app` / `hub_app` rows.
 *
 * With an `installedVersionRule` the comparison is exact. Without one it's inferred
 * conservatively (never a verified "Update"), because installed apps can report versions
 * differently from marketing versions (Pro Tools 26.4.1.179 vs 2026.4).
 */

import type {
  CatalogPlugin,
  DawCatalogInfo,
  DawInfo,
  HelperAppInfo,
  InstalledApp,
  InstalledVersionRule,
} from '../../shared/types'
import { HIGH, MEDIUM } from './confidence'
import type { CatalogIndex } from './catalogIndex'

const KNOWN_TRANSFORMS = new Set(['strip-build-suffix', 'prefix-year-2000', 'semver-first-3'])

function normName(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Apply the row's named transforms in order. Returns null when a transform is unknown
 * or the result has no numeric segments — the caller must then give no verdict.
 */
export function applyInstalledVersionRule(
  installed: string,
  rule: InstalledVersionRule
): string | null {
  let v = installed.trim()
  for (const t of rule.transforms || []) {
    if (!KNOWN_TRANSFORMS.has(t)) return null
    if (t === 'strip-build-suffix') {
      v = v.split(/[_ ]|build|(?<=\d)[bd]\d/i)[0].trim()
    } else if (t === 'prefix-year-2000') {
      const [first, ...rest] = v.split('.')
      const n = Number(first)
      if (Number.isInteger(n) && n < 100) v = [String(2000 + n), ...rest].join('.')
    } else if (t === 'semver-first-3') {
      const m = v.match(/^\d+(?:\.\d+){0,2}/)
      if (!m) return null
      v = m[0]
    }
  }
  return /^\d+(\.\d+)*$/.test(v) ? v : null
}

/** Compare the first `segments` numeric segments, padding missing ones with 0. */
export function compareSegments(a: string, b: string, segments: number): -1 | 0 | 1 | null {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  if (pa.some((n) => !Number.isFinite(n)) || pb.some((n) => !Number.isFinite(n))) return null
  const n = segments > 0 ? segments : Math.max(pa.length, pb.length)
  for (let i = 0; i < n; i++) {
    const x = pa[i] ?? 0
    const y = pb[i] ?? 0
    if (x < y) return -1
    if (x > y) return 1
  }
  return 0
}

function findDawRow(daw: DawInfo, index: CatalogIndex): CatalogPlugin | null {
  const apps = index.catalog.plugins.filter((p) => p.identityKind === 'standalone_app')
  if (daw.bundleId) {
    const id = daw.bundleId.toLowerCase()
    const byId = apps.find((p) => p.identityKeys?.bundleIds?.some((b) => b.toLowerCase() === id))
    if (byId) return byId
  }
  const name = normName(daw.name)
  const exact = apps.find(
    (p) => normName(p.name) === name || p.matchPatterns?.some((m) => normName(m) === name)
  )
  if (exact) return exact
  // Edition / major suffixes: "Ableton Live 12 Suite" → "Ableton Live". Longest name wins.
  const prefixed = apps
    .filter((p) => name.startsWith(`${normName(p.name)} `))
    .sort((a, b) => b.name.length - a.name.length)
  return prefixed[0] || null
}

function leadingVersion(v: string): string | null {
  return v.match(/^\s*(\d+(?:\.\d+)*)/)?.[1] ?? null
}

/**
 * No installedVersionRule yet: compare conservatively. Never claims a verified update;
 * a different number format (26 vs 2026) only lines up when it clearly is the year scheme.
 */
function inferredVerdict(
  installedRaw: string,
  latestRaw: string,
  confidence: number,
  kind: 'daw' | 'helper'
): DawCatalogInfo['status'] {
  let installed = leadingVersion(installedRaw)
  const latest = leadingVersion(latestRaw)
  if (!installed || !latest) return 'check_in_app'
  const ia = Number(installed.split('.')[0])
  const la = Number(latest.split('.')[0])
  if (String(ia).length !== String(la).length) {
    const year = 2000 + ia
    if (ia >= 100 || la < 2000 || la - year < 0 || la - year > 5) return 'check_in_app'
    installed = [String(year), ...installed.split('.').slice(1)].join('.')
  }
  const rel = compareSegments(installed, latest, 0)
  if (rel == null) return 'check_in_app'
  if (rel >= 0) return 'current'
  const sameMajor = installed.split('.')[0] === latest.split('.')[0]
  if (!sameMajor && kind === 'daw') return 'newer_major'
  return confidence >= MEDIUM ? 'update_likely' : 'check_in_app'
}

/** Compare an installed app (DAW or helper) with its catalog row. */
export function appVerdict(
  row: CatalogPlugin,
  installedVersion: string | null,
  index: CatalogIndex,
  kind: 'daw' | 'helper'
): DawCatalogInfo {
  const mfg = index.manufacturerById.get(row.manufacturerId)
  const base: DawCatalogInfo = {
    catalogPluginId: row.id,
    latestVersion: row.latestVersion ?? null,
    finalVersion: row.finalVersion ?? null,
    confidence: row.versionConfidence ?? null,
    status: 'check_in_app',
    inferred: false,
    updateUrl: row.updatePortalUrl || mfg?.updatePortalUrl || null,
    portalApp: row.portalApp || mfg?.portalApp || null,
  }
  if (row.discontinued || row.identityKind === 'discontinued') return { ...base, status: 'discontinued' }
  if (!row.latestVersion) return { ...base, status: 'not_tracked' }
  if (!installedVersion) return base

  const rule = row.installedVersionRule
  if (!rule) {
    return {
      ...base,
      inferred: true,
      status: inferredVerdict(installedVersion, row.latestVersion, row.versionConfidence ?? 0, kind),
    }
  }
  const installed = applyInstalledVersionRule(installedVersion, rule)
  const latest = applyInstalledVersionRule(row.latestVersion, { transforms: [] })
  if (!installed || !latest) return base
  const rel = compareSegments(installed, latest, rule.compareSegments ?? 0)
  if (rel == null) return base
  if (rel >= 0) return { ...base, status: 'current' }
  const conf = row.versionConfidence ?? 0
  if (conf >= HIGH) return { ...base, status: 'update_available' }
  if (conf >= MEDIUM) return { ...base, status: 'update_likely' }
  return base
}

export function dawCatalogInfo(daw: DawInfo, index: CatalogIndex): DawCatalogInfo | null {
  const row = findDawRow(daw, index)
  return row ? appVerdict(row, daw.version, index, 'daw') : null
}

function compactName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Installed apps that are vendor helpers (license managers, installers, hub apps).
 * Matched by bundle ID or exact name against hub_app / standalone_app rows; apps named
 * after a vendor's `portalApp` are listed as not tracked when no row exists.
 */
export function matchHelperApps(
  apps: InstalledApp[],
  index: CatalogIndex,
  exclude: Set<string>
): HelperAppInfo[] {
  const rows = index.catalog.plugins.filter(
    (p) => p.identityKind === 'hub_app' || p.identityKind === 'standalone_app'
  )
  const byBundle = new Map<string, CatalogPlugin>()
  const byName = new Map<string, CatalogPlugin>()
  for (const row of rows) {
    for (const id of row.identityKeys?.bundleIds || []) byBundle.set(id.toLowerCase(), row)
    const mfgName = index.manufacturerById.get(row.manufacturerId)?.name || ''
    for (const n of [row.name, ...(row.matchPatterns || [])]) {
      if (!byName.has(compactName(n))) byName.set(compactName(n), row)
      const withVendor = compactName(`${mfgName} ${n}`)
      if (!byName.has(withVendor)) byName.set(withVendor, row)
    }
  }
  const portalNames = new Map<string, { url: string | null }>()
  for (const m of index.catalog.manufacturers) {
    if (m.portalApp) portalNames.set(compactName(m.portalApp), { url: m.updatePortalUrl || null })
  }

  const out: HelperAppInfo[] = []
  for (const app of apps) {
    if (exclude.has(app.path)) continue
    const row =
      (app.bundleId && byBundle.get(app.bundleId.toLowerCase())) || byName.get(compactName(app.name))
    if (row) {
      out.push({ ...app, catalog: appVerdict(row, app.version, index, 'helper') })
      continue
    }
    const portal = portalNames.get(compactName(app.name))
    if (portal) {
      out.push({
        ...app,
        catalog: {
          catalogPluginId: null,
          latestVersion: null,
          finalVersion: null,
          confidence: null,
          status: 'not_tracked',
          inferred: false,
          updateUrl: portal.url,
          portalApp: app.name,
        },
      })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}
