import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { runFullScan } from './scanService'
import { loadLastLibrary } from './lastLibrary'
import { CatalogVerifyError, refreshCatalog } from './catalog/catalogService'
import {
  CATALOG_VERIFY_USER_MESSAGE,
  rendererCatalogMeta,
  scrubUserFacingError,
} from './catalog/publicFacing'
import type { ScanProgress } from '../shared/types'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 880,
    minWidth: 900,
    minHeight: 640,
    title: 'DAW Plugin Manager',
    backgroundColor: '#0e1418',
    show: false,
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

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('library:loadLast', async () => loadLastLibrary())

ipcMain.handle('catalog:refresh', async () => {
  try {
    const catalog = await refreshCatalog({
      appPath: app.getAppPath(),
      userDataPath: app.getPath('userData'),
    })
    return rendererCatalogMeta(catalog)
  } catch (err) {
    if (err instanceof CatalogVerifyError) {
      throw new Error(CATALOG_VERIFY_USER_MESSAGE)
    }
    throw new Error(scrubUserFacingError(err instanceof Error ? err.message : String(err)))
  }
})

ipcMain.handle('scan:run', async (event, options?: { extraPluginRoots?: string[] }) => {
  const sendProgress = (progress: ScanProgress) => {
    if (!event.sender.isDestroyed()) {
      event.sender.send('scan:progress', progress)
    }
  }

  // Indexed catalog match + setImmediate yields keep the renderer painting
  // progressive DAW/vendor updates via scan:progress.
  return runFullScan(sendProgress, {
    extraPluginRoots: options?.extraPluginRoots,
    appPath: app.getAppPath(),
    userDataPath: app.getPath('userData'),
  })
})

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
    return { ok: false, error: 'Could not open that link.' }
  }
})

ipcMain.handle('app:getInfo', async () => ({
  version: app.getVersion(),
  name: app.getName(),
  discoveryOnly: true,
  policy:
    'This utility never deletes, overwrites, or installs software. Updates are opened in your browser for you to install.',
}))
