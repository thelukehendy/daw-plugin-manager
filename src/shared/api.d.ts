import type { ScanProgress, ScanReport } from './types'

export interface DawPluginManagerApi {
  runScan: (options?: { extraPluginRoots?: string[] }) => Promise<ScanReport>
  onScanProgress: (callback: (progress: ScanProgress) => void) => () => void
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
