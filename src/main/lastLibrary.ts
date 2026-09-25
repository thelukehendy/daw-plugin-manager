import type { ScanReport } from '../shared/types'
import { joinPath, platform } from './platform'
import { scrubReportForRenderer } from './catalog/publicFacing'

const SNAPSHOT_VERSION = 1

export interface LibrarySnapshot {
  version: number
  savedAt: string
  report: ScanReport
}

const LIBRARY_FILE = 'last-library.json'

/** Load last successful library scan for instant reopen. */
export async function loadLastLibrary(): Promise<ScanReport | null> {
  const text = await platform().readText(joinPath(platform().userDataDir, LIBRARY_FILE))
  if (!text) return null
  try {
    const raw = JSON.parse(text) as LibrarySnapshot | ScanReport
    if ('report' in raw && raw.report?.manufacturers && raw.report?.daws) {
      return scrubReportForRenderer(raw.report)
    }
    // Legacy: bare ScanReport
    if ('manufacturers' in raw && 'daws' in raw) {
      return scrubReportForRenderer(raw as ScanReport)
    }
    return null
  } catch {
    return null
  }
}

export async function saveLastLibrary(report: ScanReport): Promise<void> {
  try {
    const snap: LibrarySnapshot = {
      version: SNAPSHOT_VERSION,
      savedAt: new Date().toISOString(),
      report: scrubReportForRenderer(report),
    }
    await platform().writeAppFile(LIBRARY_FILE, JSON.stringify(snap))
  } catch {
    /* non-fatal */
  }
}
