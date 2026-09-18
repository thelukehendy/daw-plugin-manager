import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import type { ScanReport } from '../shared/types'

const SNAPSHOT_VERSION = 1

export interface LibrarySnapshot {
  version: number
  savedAt: string
  report: ScanReport
}

function snapshotPath(): string {
  return join(app.getPath('userData'), 'last-library.json')
}

/** Load last successful library scan for instant reopen. */
export async function loadLastLibrary(): Promise<ScanReport | null> {
  const path = snapshotPath()
  if (!existsSync(path)) return null
  try {
    const raw = JSON.parse(await readFile(path, 'utf8')) as LibrarySnapshot | ScanReport
    if ('report' in raw && raw.report?.manufacturers && raw.report?.daws) {
      return raw.report
    }
    // Legacy: bare ScanReport
    if ('manufacturers' in raw && 'daws' in raw) {
      return raw as ScanReport
    }
    return null
  } catch {
    return null
  }
}

export async function saveLastLibrary(report: ScanReport): Promise<void> {
  try {
    const path = snapshotPath()
    await mkdir(app.getPath('userData'), { recursive: true })
    const snap: LibrarySnapshot = {
      version: SNAPSHOT_VERSION,
      savedAt: new Date().toISOString(),
      report,
    }
    await writeFile(path, JSON.stringify(snap), 'utf8')
  } catch {
    /* non-fatal */
  }
}
