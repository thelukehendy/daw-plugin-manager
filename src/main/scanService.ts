import { release, arch, homedir, platform } from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'
import type {
  DawInfo,
  ManufacturerReportGroup,
  ScanProgress,
  ScanReport,
  SystemInfo,
} from '../shared/types'
import { scanDaws } from './scanner/dawScanner'
import { scanPlugins } from './scanner/pluginScanner'
import { buildManufacturerGroups, buildReportRows, loadCatalog } from './catalog/catalogService'
import { saveLastLibrary } from './lastLibrary'

const execFileAsync = promisify(execFile)

async function readMacOSVersion(): Promise<string | null> {
  if (platform() !== 'darwin') return release()
  try {
    const { stdout } = await execFileAsync('sw_vers', ['-productVersion'])
    return stdout.trim() || release()
  } catch {
    return release()
  }
}

async function getSystemInfo(): Promise<SystemInfo> {
  return {
    platform: platform(),
    osVersion: await readMacOSVersion(),
    arch: arch(),
    homedir: homedir(),
    scannedAt: new Date().toISOString(),
  }
}

function emptySummary(dawCount: number): ScanReport['summary'] {
  return {
    dawCount,
    pluginBundleCount: 0,
    pluginCount: 0,
    manufacturerCount: 0,
    current: 0,
    outdated: 0,
    unknown: 0,
    bundled: 0,
    legacy: 0,
    compatWarnings: 0,
    updateAvailable: 0,
    paidUpgrade: 0,
    content: 0,
    discontinued: 0,
    useVendorHub: 0,
  }
}

/**
 * Full discovery scan. Read-only — never deletes, overwrites, or installs.
 * Progressive: DAWs stream first; matching yields so the UI stays alive.
 */
export async function runFullScan(
  onProgress?: (p: ScanProgress) => void,
  options?: { extraPluginRoots?: string[]; preferBundledCatalog?: boolean; appPath?: string }
): Promise<ScanReport> {
  const emit = (
    phase: ScanProgress['phase'],
    message: string,
    percent: number,
    partial?: ScanProgress['partial']
  ) => {
    onProgress?.({ phase, message, percent, partial })
  }

  if (platform() !== 'darwin') {
    emit('error', `Platform ${platform()} is not fully supported yet (macOS scanners active).`, 0)
  }

  emit('daws', 'Detecting installed DAWs…', 3)
  const system = await getSystemInfo()
  const daws = await scanDaws()
  emit('daws', `Found ${daws.length} DAW${daws.length === 1 ? '' : 's'}`, 8, { daws })

  // Warm catalog while plugins scan (overlap I/O). Prefer remote when newer.
  const catalogPromise = loadCatalog({
    preferBundled: options?.preferBundledCatalog,
    appPath: options?.appPath,
  })

  emit('plugins', 'Scanning plugin folders…', 12)
  const plugins = await scanPlugins(options?.extraPluginRoots || [], (message, percent) => {
    emit('plugins', message, 12 + Math.round(percent * 0.48), { daws })
  })
  emit('plugins', `Found ${plugins.length} plugin bundles`, 62, { daws })

  emit('catalog', 'Indexing version catalog…', 68, { daws })
  const catalog = await catalogPromise
  emit(
    'catalog',
    `Catalog ready · ${catalog.plugins.length.toLocaleString()} entries`,
    74,
    { daws }
  )

  emit('compare', 'Matching library to catalog…', 78, { daws })
  const rows = await buildReportRows(plugins, catalog, system, daws, (done, total) => {
    const pct = 78 + Math.round((done / Math.max(total, 1)) * 18)
    emit('compare', `Matching ${done}/${total}…`, pct, { daws })
  })

  const manufacturers = buildManufacturerGroups(rows)
  emit('compare', 'Organizing by manufacturer…', 97, {
    daws,
    manufacturers,
  })

  const summary = {
    dawCount: daws.length,
    pluginBundleCount: plugins.length,
    pluginCount: rows.length,
    manufacturerCount: manufacturers.length,
    current: rows.filter((r) => r.status === 'current').length,
    outdated: rows.filter(
      (r) =>
        r.status === 'update_available' ||
        r.status === 'update_likely' ||
        r.status === 'unverified'
    ).length,
    updateAvailable: rows.filter((r) => r.status === 'update_available').length,
    unknown: rows.filter((r) => r.status === 'unknown').length,
    bundled: rows.filter((r) => r.status === 'bundled').length,
    legacy: rows.filter((r) => r.versionDetails.some((v) => v.legacy)).length,
    paidUpgrade: rows.filter(
      (r) => r.status === 'paid_upgrade' || (!!r.successorPluginId && r.status === 'current')
    ).length,
    content: rows.filter((r) => r.status === 'content').length,
    discontinued: rows.filter((r) => r.status === 'discontinued').length,
    useVendorHub: rows.filter((r) => r.status === 'use_vendor_hub').length,
    compatWarnings: rows.filter((r) =>
      r.compatibilityFlags.some((f) => f.severity === 'warn' || f.severity === 'block')
    ).length,
  }

  const report: ScanReport = {
    system,
    daws,
    plugins,
    rows,
    manufacturers,
    catalog: {
      updatedAt: catalog.updatedAt,
      source: catalog.catalogSource || 'unknown',
      pluginCount: catalog.plugins.length,
      manufacturerCount: catalog.manufacturers.length,
    },
    summary,
  }

  await saveLastLibrary(report)
  emit('done', 'Scan complete', 100, {
    daws,
    manufacturers,
  })

  return report
}

/** Lightweight DAW-only probe for first paint before a full rescan. */
export async function probeDaws(): Promise<DawInfo[]> {
  return scanDaws()
}

export function placeholderReport(daws: DawInfo[]): ScanReport {
  return {
    system: {
      platform: platform(),
      osVersion: null,
      arch: arch(),
      homedir: homedir(),
      scannedAt: new Date().toISOString(),
    },
    daws,
    plugins: [],
    rows: [],
    manufacturers: [] as ManufacturerReportGroup[],
    catalog: {
      updatedAt: new Date(0).toISOString(),
      source: 'pending',
      pluginCount: 0,
      manufacturerCount: 0,
    },
    summary: emptySummary(daws.length),
  }
}
