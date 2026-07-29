import { release, arch, homedir, platform } from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'
import type { ScanProgress, ScanReport, SystemInfo } from '../shared/types'
import { scanDaws } from './scanner/dawScanner'
import { scanPlugins } from './scanner/pluginScanner'
import { buildManufacturerGroups, buildReportRows, loadCatalog } from './catalog/catalogService'

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

/**
 * Full discovery scan. Read-only — never deletes, overwrites, or installs.
 */
export async function runFullScan(
  onProgress?: (p: ScanProgress) => void,
  options?: { extraPluginRoots?: string[]; preferBundledCatalog?: boolean; appPath?: string }
): Promise<ScanReport> {
  const emit = (phase: ScanProgress['phase'], message: string, percent: number) => {
    onProgress?.({ phase, message, percent })
  }

  if (platform() !== 'darwin') {
    emit('error', `Platform ${platform()} is not fully supported yet (macOS scanners active).`, 0)
  }

  emit('daws', 'Detecting installed DAWs…', 5)
  const system = await getSystemInfo()
  const daws = await scanDaws()

  emit('plugins', 'Scanning plugin folders…', 15)
  const plugins = await scanPlugins(options?.extraPluginRoots || [], (message, percent) => {
    emit('plugins', message, 15 + Math.round(percent * 0.55))
  })

  emit('catalog', 'Refreshing plugin version catalog…', 75)
  const catalog = await loadCatalog({
    preferBundled: options?.preferBundledCatalog,
    appPath: options?.appPath,
  })

  emit('compare', 'Grouping manufacturers & comparing versions…', 90)
  const rows = await buildReportRows(plugins, catalog, system, daws)
  const manufacturers = buildManufacturerGroups(rows)

  const summary = {
    dawCount: daws.length,
    pluginBundleCount: plugins.length,
    pluginCount: rows.length,
    manufacturerCount: manufacturers.length,
    current: rows.filter((r) => r.status === 'current').length,
    outdated: rows.filter((r) => r.status === 'outdated').length,
    unknown: rows.filter((r) => r.status === 'unknown').length,
    bundled: rows.filter((r) => r.status === 'bundled').length,
    legacy: rows.filter((r) => r.versionDetails.some((v) => v.legacy)).length,
    compatWarnings: rows.filter((r) =>
      r.compatibilityFlags.some((f) => f.severity === 'warn' || f.severity === 'block')
    ).length,
  }

  emit('done', 'Scan complete', 100)

  return {
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
}
