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
  /** Send in-app feedback, optionally with the anonymized plugin list from the last scan. */
  sendFeedback: (input: {
    message: string
    includeScan: boolean
  }) => Promise<{ ok: true } | { ok: false; error: string }>
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
