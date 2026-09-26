/**
 * Tauri shell: runs the shared scanner / matcher / catalog code in the web view and
 * exposes the same `window.dawPluginManager` API the Electron preload provides.
 */
import { invoke } from '@tauri-apps/api/core'
import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import type { DirEntry, Platform } from '../main/platform'
import { setPlatform } from '../main/platform'
import { runFullScan } from '../main/scanService'
import { loadLastLibrary } from '../main/lastLibrary'
import { CatalogVerifyError, refreshCatalog } from '../main/catalog/catalogService'
import {
  CATALOG_VERIFY_USER_MESSAGE,
  rendererCatalogMeta,
  scrubUserFacingError,
} from '../main/catalog/publicFacing'
import { toScanSnapshot } from '../shared/scanSnapshot'
import { buildFeedbackPayload, sendFeedback } from '../main/feedback'
import type { ScanProgress, ScanReport } from '../shared/types'

interface SystemInfo {
  os: Platform['os']
  arch: string
  homeDir: string
  userDataDir: string
  osVersion: string | null
  env: Record<string, string>
  parityDump: boolean
}

function tauriPlatform(info: SystemInfo): Platform {
  const readText = (path: string) => invoke<string | null>('read_text', { path })
  return {
    kind: 'tauri',
    os: info.os,
    arch: info.arch,
    homeDir: info.homeDir,
    userDataDir: info.userDataDir,
    sep: info.os === 'win32' ? '\\' : '/',
    env: (name) => info.env[name],
    osVersion: async () => info.osVersion,
    readDir: (path) => invoke<DirEntry[] | null>('read_dir', { path }),
    exists: (path) => invoke<boolean>('path_exists', { path }),
    readPlists: (paths) => invoke<(Record<string, unknown> | null)[]>('read_plists', { paths }),
    readText,
    async readBytes(path) {
      const text = await readText(path)
      return text == null ? null : new TextEncoder().encode(text)
    },
    async writeAppFile(relativePath, data) {
      const contents = typeof data === 'string' ? data : new TextDecoder().decode(data)
      await invoke('write_app_file', { relativePath, contents })
    },
    bundledCatalogText: () => invoke<string | null>('bundled_catalog_text'),
    fetch: (input, init) => tauriFetch(input, init),
  }
}

export async function installTauriBridge(): Promise<void> {
  const info = await invoke<SystemInfo>('system_info')
  setPlatform(tauriPlatform(info))

  const listeners = new Set<(p: ScanProgress) => void>()
  let lastScan: ScanReport | null = null

  window.dawPluginManager = {
    async runScan(options) {
      const report = await runFullScan((p) => listeners.forEach((l) => l(p)), {
        extraPluginRoots: options?.extraPluginRoots,
      })
      lastScan = report
      return report
    },
    loadLastLibrary: () => loadLastLibrary(),
    async refreshCatalog() {
      try {
        return rendererCatalogMeta(await refreshCatalog())
      } catch (err) {
        if (err instanceof CatalogVerifyError) throw new Error(CATALOG_VERIFY_USER_MESSAGE)
        throw new Error(scrubUserFacingError(err instanceof Error ? err.message : String(err)))
      }
    },
    onScanProgress(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    async sendFeedback(input) {
      const payload = buildFeedbackPayload(input, lastScan ?? (await loadLastLibrary()), {
        version: '1.0.0',
        shell: 'tauri',
        os: info.os,
        osVersion: info.osVersion,
        arch: info.arch,
      })
      return sendFeedback(payload)
    },
    async openExternal(url) {
      try {
        await invoke('open_url', { url })
        return { ok: true }
      } catch {
        return { ok: false, error: 'Could not open that link.' }
      }
    },
    getAppInfo: async () => ({
      version: '1.0.0',
      name: 'DAW Plugin Manager',
      discoveryOnly: true,
      policy:
        'This utility never deletes, overwrites, or installs software. Updates are opened in your browser for you to install.',
    }),
  }

  if (info.parityDump) {
    const report = await window.dawPluginManager.runScan({ extraPluginRoots: [] })
    const snapshot = toScanSnapshot(report.plugins, report.daws, report.system)
    const summary = report.rows.map((r) => ({
      name: r.name,
      status: r.status,
      catalogPluginId: r.catalogPluginId ?? null,
      latest: r.latestVersion,
    }))
    await writeDebugFile('parity-snapshot.json', JSON.stringify(snapshot))
    await writeDebugFile('parity-rows.json', JSON.stringify(summary))
  }
}

function writeDebugFile(relativePath: string, contents: string) {
  return invoke('write_app_file', { relativePath, contents })
}
