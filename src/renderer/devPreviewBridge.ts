/**
 * Dev-only stand-in for the Electron preload bridge, so the renderer can be previewed in
 * a plain browser. Reads a real report written by `scripts/dev-preview-report.ts`.
 */
import type { ScanReport } from '../shared/types'

export function installDevPreviewBridge(): void {
  if (window.dawPluginManager) return
  const load = async (): Promise<ScanReport> => {
    const res = await fetch('/__dev-report.json', { cache: 'no-store' })
    if (!res.ok) throw new Error('Run: npx tsx scripts/dev-preview-report.ts')
    return res.json()
  }
  window.dawPluginManager = {
    runScan: load,
    loadLastLibrary: () => load().catch(() => null),
    refreshCatalog: async () => {
      const r = await load()
      return r.catalog
    },
    onScanProgress: () => () => {},
    sendFeedback: async () => ({ ok: false, error: 'Not available in browser preview.' }),
    openExternal: async (url: string) => {
      window.open(url, '_blank')
      return { ok: true }
    },
    getAppInfo: async () => ({
      version: 'preview',
      name: 'DAW Plugin Manager',
      discoveryOnly: true,
      policy: '',
    }),
  }
}
