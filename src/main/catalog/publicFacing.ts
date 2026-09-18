/**
 * Keep catalog provenance (URLs, paths, store names) in the main process.
 * Renderer-facing strings must not leak GitHub/raw/jsDelivr/Muse/catalog-store origins.
 */

import type { PluginReportRow, ScanReport } from '../../shared/types'

const ORIGIN_LEAK =
  /https?:\/\/\S+|raw\.githubusercontent|jsdelivr\.net|github\.com\/[^\s)]+|catalog-store|muse\s*db|\/Users\/\S+|file:\/\/\S+|synced from\s+\S+|remote:\S+|bundled:\S+/gi

/** Opaque origin label for ScanReport.catalog.source (never a URL or path). */
export function publicCatalogOrigin(raw: string | null | undefined): string {
  if (!raw) return 'catalog'
  const s = raw.toLowerCase()
  if (s === 'scanning' || s === 'pending') return raw
  return 'catalog'
}

export function scrubUserFacingError(message: string): string {
  const cleaned = message
    .replace(ORIGIN_LEAK, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim()
  if (!cleaned || cleaned.length < 8) {
    return 'Something went wrong while scanning. Try Rescan.'
  }
  return cleaned
}

/** Strip provenance URLs from confidence / note strings before they hit the UI. */
export function scrubReasonText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\(\s*source:\s*[^)]*\)/gi, '')
    .replace(/\bsource:\s*\S+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function scrubRow(row: PluginReportRow): PluginReportRow {
  return {
    ...row,
    versionSourceUrl: null,
    confidenceReason: scrubReasonText(row.confidenceReason || ''),
    confidenceReasons: (row.confidenceReasons || []).map(scrubReasonText).filter(Boolean),
    compatibilityFlags: (row.compatibilityFlags || []).map((f) => ({
      ...f,
      note: scrubReasonText(f.note),
    })),
  }
}

/** Prepare a scan report for IPC / persisted snapshot — data only, no provenance. */
export function scrubReportForRenderer(report: ScanReport): ScanReport {
  return {
    ...report,
    catalog: {
      ...report.catalog,
      source: publicCatalogOrigin(report.catalog?.source),
    },
    rows: (report.rows || []).map(scrubRow),
    manufacturers: (report.manufacturers || []).map((g) => ({
      ...g,
      products: (g.products || []).map(scrubRow),
    })),
  }
}
