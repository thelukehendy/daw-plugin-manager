/**
 * Anonymized scan snapshot: the format for golden fixtures and opt-in scan submissions.
 * Contains no file paths, usernames, machine names, or timestamps of individual files.
 */

import type { AuComponentKey, DawInfo, InstalledPlugin, PluginFormat } from './types'

export const SCAN_SNAPSHOT_VERSION = 1

export interface SnapshotPlugin {
  name: string
  manufacturer: string
  manufacturerHint?: string
  auVendor?: string
  version: string | null
  formats: PluginFormat[]
  bundleIds: string[]
  auComponents: AuComponentKey[]
}

export interface SnapshotDaw {
  id: string
  name: string
  version: string | null
  bundleId?: string
}

export interface ScanSnapshot {
  snapshotVersion: number
  platform: string
  arch: string
  osVersion: string | null
  capturedAt: string
  plugins: SnapshotPlugin[]
  daws: SnapshotDaw[]
}

export function toScanSnapshot(
  plugins: InstalledPlugin[],
  daws: DawInfo[],
  system: { platform: string; arch: string; osVersion: string | null }
): ScanSnapshot {
  return {
    snapshotVersion: SCAN_SNAPSHOT_VERSION,
    platform: system.platform,
    arch: system.arch,
    osVersion: system.osVersion,
    capturedAt: new Date().toISOString().slice(0, 10),
    plugins: plugins
      .map((p) => ({
        name: p.name,
        manufacturer: p.manufacturer,
        ...(p.manufacturerHint ? { manufacturerHint: p.manufacturerHint } : {}),
        ...(p.auVendor ? { auVendor: p.auVendor } : {}),
        version: p.version,
        formats: [...p.formats].sort(),
        bundleIds: [...new Set(p.bundleIds || (p.bundleId ? [p.bundleId] : []))].sort(),
        auComponents: p.auComponents || [],
      }))
      .sort(
        (a, b) =>
          a.manufacturer.localeCompare(b.manufacturer) ||
          a.name.localeCompare(b.name) ||
          String(a.version).localeCompare(String(b.version))
      ),
    daws: daws.map((d) => ({
      id: d.id,
      name: d.name,
      version: d.version,
      ...(d.bundleId ? { bundleId: d.bundleId } : {}),
    })),
  }
}

/** Rehydrate snapshot plugins into scanner output (paths empty). */
export function pluginsFromSnapshot(snapshot: ScanSnapshot): InstalledPlugin[] {
  return snapshot.plugins.map((p, i) => ({
    id: `snapshot-${i}`,
    name: p.name,
    manufacturer: p.manufacturer,
    manufacturerHint: p.manufacturerHint,
    auVendor: p.auVendor,
    version: p.version,
    formats: p.formats,
    paths: [],
    bundleId: p.bundleIds[0],
    bundleIds: p.bundleIds,
    auComponents: p.auComponents,
  }))
}

export function dawsFromSnapshot(snapshot: ScanSnapshot): DawInfo[] {
  return snapshot.daws.map((d) => ({
    id: d.id,
    name: d.name,
    version: d.version,
    path: '',
    bundleId: d.bundleId,
    detectedAt: snapshot.capturedAt,
  }))
}
