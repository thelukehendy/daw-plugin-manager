import type { ScanProgress, ScanReport } from './types'

export interface DawPluginManagerApi {
  runScan: (options?: { extraPluginRoots?: string[] }) => Promise<ScanReport>
  loadLastLibrary: () => Promise<ScanReport | null>
  refreshCatalog: () => Promise<{
    updatedAt: string
    source: string
    pluginCount: number
    manufacturerCount: number
  }>
  onScanProgress: (callback: (progress: ScanProgress) => void) => () => void
  /** Save an anonymized snapshot of the latest scan (no paths or usernames). */
  saveScanSnapshot: () => Promise<{
    ok: boolean
    canceled?: boolean
    error?: string
    pluginCount?: number
  }>
  openExternal: (url: string) => Promise<{ ok: boolean; error?: string }>
  getAppInfo: () => Promise<{
    version: string
    name: string
    discoveryOnly: boolean
    policy: string
  }>
}

declare global {
  interface Window {
    dawPluginManager: DawPluginManagerApi
  }
}

export {}
