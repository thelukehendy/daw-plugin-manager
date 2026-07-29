import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { runFullScan } from './scanService'
import type { ScanProgress } from '../shared/types'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 860,
    minWidth: 900,
    minHeight: 640,
    title: 'DAW Plugin Manager',
    backgroundColor: '#14181f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Safety: this app is discovery-only. Never grant write FS APIs to renderer.
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('scan:run', async (event, options?: { extraPluginRoots?: string[] }) => {
  const sendProgress = (progress: ScanProgress) => {
    if (!event.sender.isDestroyed()) {
      event.sender.send('scan:progress', progress)
    }
  }

  return runFullScan(sendProgress, {
    extraPluginRoots: options?.extraPluginRoots,
    appPath: app.getAppPath(),
  })
})

/** Open manufacturer portal / download page in the user's default browser. */
ipcMain.handle('shell:openExternal', async (_event, url: string) => {
  if (!url || typeof url !== 'string') return { ok: false, error: 'Invalid URL' }
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, error: 'Only http(s) URLs are allowed' }
    }
    await shell.openExternal(parsed.toString())
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
})

ipcMain.handle('app:getInfo', async () => ({
  version: app.getVersion(),
  name: app.getName(),
  discoveryOnly: true,
  policy: 'This utility never deletes, overwrites, or installs software. Updates are opened in your browser for you to install.',
}))
