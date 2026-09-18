/**
 * Keep catalog provenance (URLs, paths, store names) in the main process.
 * Renderer-facing strings must not leak GitHub/raw/jsDelivr/Muse/catalog-store origins.
 * Manufacturer verify pages may pass through as versionSourceUrl.
 */

import type { PluginReportRow, ScanReport } from '../../shared/types'

const ORIGIN_LEAK =
  /https?:\/\/\S+|raw\.githubusercontent|jsdelivr\.net|github\.com\/[^\s)]+|catalog-store|muse\s*db|\/Users\/\S+|file:\/\/\S+|synced from\s+\S+|remote:\S+|bundled:\S+/gi

/** Hosts never shown as “verify this version” links. */
const BLOCKED_VERIFY_HOST =
  /(?:^|\.)(?:githubusercontent\.com|jsdelivr\.net|github\.com|open-audio-stack\.github\.io|kvraudio\.com)$/i

/** Opaque origin for ScanReport.catalog.source — Online / Shipped / catalog. Never URLs. */
export function publicCatalogOrigin(raw: string | null | undefined): string {
  if (!raw) return 'catalog'
  const s = raw.toLowerCase()
  if (s === 'scanning' || s === 'pending') return raw
  if (s === 'online' || s.startsWith('remote:')) return 'online'
  if (s === 'shipped' || s.startsWith('bundled:')) return 'shipped'
  return 'catalog'
}

/** Main-only diagnostic log (may include paths/URLs — never send to renderer). */
export function logCatalogLoad(catalog: {
  catalogSource?: string
  updatedAt?: string
  plugins?: unknown[]
}): void {
  const src = catalog.catalogSource || 'unknown'
  const at = catalog.updatedAt || 'unknown'
  const n = Array.isArray(catalog.plugins) ? catalog.plugins.length : 0
  console.log(`[catalog] source=${src} updatedAt=${at} plugins=${n}`)
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

/**
 * Allow a manufacturer (or similar) page the user can open to double-check.
 * Drop catalog CDN / GitHub / OAS registry URLs.
 */
export function scrubVersionSourceUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null
  try {
    const u = new URL(trimmed)
    if (BLOCKED_VERIFY_HOST.test(u.hostname)) return null
    if (/catalog-store|muse/i.test(trimmed)) return null
    return trimmed
  } catch {
    return null
  }
}

function scrubRow(row: PluginReportRow): PluginReportRow {
  return {
    ...row,
    versionSourceUrl: scrubVersionSourceUrl(row.versionSourceUrl),
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
