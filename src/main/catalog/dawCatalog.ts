/**
 * Installed DAWs ↔ catalog `standalone_app` rows.
 *
 * A DAW only gets an update verdict when its catalog row carries an
 * `installedVersionRule`; installed apps report versions differently from marketing
 * versions (Pro Tools 26.4.1.179 vs 2026.4), so comparing without a rule would mislead.
 */

import type {
  CatalogPlugin,
  DawCatalogInfo,
  DawInfo,
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
  return (
    apps.find(
      (p) => normName(p.name) === name || p.matchPatterns?.some((m) => normName(m) === name)
    ) || null
  )
}

export function dawCatalogInfo(daw: DawInfo, index: CatalogIndex): DawCatalogInfo | null {
  const row = findDawRow(daw, index)
  if (!row) return null
  const mfg = index.manufacturerById.get(row.manufacturerId)
  const base: DawCatalogInfo = {
    catalogPluginId: row.id,
    latestVersion: row.latestVersion ?? null,
    confidence: row.versionConfidence ?? null,
    status: 'check_in_app',
    updateUrl: row.updatePortalUrl || mfg?.updatePortalUrl || null,
    portalApp: row.portalApp || mfg?.portalApp || null,
  }
  const rule = row.installedVersionRule
  if (!rule || !daw.version || !row.latestVersion) return base

  const installed = applyInstalledVersionRule(daw.version, rule)
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
