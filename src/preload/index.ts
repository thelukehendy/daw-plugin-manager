import { contextBridge, ipcRenderer } from 'electron'
import type { ScanProgress, ScanReport } from '../shared/types'

contextBridge.exposeInMainWorld('dawPluginManager', {
  runScan: (options?: { extraPluginRoots?: string[] }): Promise<ScanReport> =>
    ipcRenderer.invoke('scan:run', options),

  onScanProgress: (callback: (progress: ScanProgress) => void): (() => void) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: ScanProgress) => {
      callback(progress)
    }
    ipcRenderer.on('scan:progress', listener)
    return () => ipcRenderer.removeListener('scan:progress', listener)
  },

  openExternal: (url: string): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke('shell:openExternal', url),

  getAppInfo: (): Promise<{
    version: string
    name: string
    discoveryOnly: boolean
    policy: string
  }> => ipcRenderer.invoke('app:getInfo'),
})
