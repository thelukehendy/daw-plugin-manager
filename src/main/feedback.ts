/**
 * In-app feedback. POSTs to the feedback relay (Netlify function), which opens a
 * labeled GitHub issue. A workflow mirrors issues into advisory/feedback-inbox/
 * for Cursor + Muse. The app never holds repository credentials.
 */
import type { HelperAppInfo, PluginReportRow, ScanReport } from '../shared/types'
import { toScanSnapshot, type ScanSnapshot } from '../shared/scanSnapshot'
import { platform } from './platform'

/** Public relay endpoint (Netlify function). No secrets in the app. */
export const FEEDBACK_URL = 'https://daw-plugin-manager-feedback.netlify.app/api/feedback'

export const FEEDBACK_MAX_CHARS = 4000
/** Soft cap so a huge library can't blow the serverless body limit. */
export const FEEDBACK_MAX_BYTES = 900_000

export interface FeedbackInput {
  message: string
  includeScan: boolean
}

/** Compact match row for Muse — no paths, no portal URLs. */
export interface FeedbackMatchRow {
  name: string
  manufacturer: string
  installedVersion: string | null
  catalogPluginId: string | null
  status: string
  matchMethod: string | null
  latestVersion: string | null
  identityKind: string | null
}

export interface FeedbackHelperRow {
  name: string
  version: string | null
  bundleId?: string
  catalogPluginId: string | null
  status: string
  latestVersion: string | null
}

export interface FeedbackDawRow {
  name: string
  version: string | null
  bundleId?: string
  catalogPluginId: string | null
  status: string | null
  latestVersion: string | null
}

export interface FeedbackPayload {
  kind: 'feedback'
  schemaVersion: 1
  message: string
  app: { version: string; shell: 'electron' | 'tauri'; os: string; osVersion: string | null; arch: string }
  catalogUpdatedAt: string | null
  /** Raw anonymized install list (golden-fixture shape). */
  scan: ScanSnapshot | null
  /** Matched plugin report rows (what Muse needs for identity/status bugs). */
  matches: FeedbackMatchRow[] | null
  daws: FeedbackDawRow[] | null
  helpers: FeedbackHelperRow[] | null
  summary: {
    pluginCount: number
    matched: number
    unmatched: number
    needsUpdate: number
    dawCount: number
    helperCount: number
  } | null
}

export type FeedbackResult = { ok: true } | { ok: false; error: string }

function compactMatch(row: PluginReportRow): FeedbackMatchRow {
  return {
    name: row.name,
    manufacturer: row.manufacturer,
    installedVersion: row.installedVersion,
    catalogPluginId: row.catalogPluginId ?? null,
    status: row.status,
    matchMethod: row.matchMethod ?? null,
    latestVersion: row.latestVersion,
    identityKind: row.identityKind ?? null,
  }
}

function compactHelper(h: HelperAppInfo): FeedbackHelperRow {
  return {
    name: h.name,
    version: h.version,
    ...(h.bundleId ? { bundleId: h.bundleId } : {}),
    catalogPluginId: h.catalog.catalogPluginId,
    status: h.catalog.status,
    latestVersion: h.catalog.latestVersion,
  }
}

export function buildFeedbackPayload(
  input: FeedbackInput,
  report: ScanReport | null,
  app: FeedbackPayload['app']
): FeedbackPayload {
  const include = input.includeScan && !!report
  const matches = include ? report!.rows.map(compactMatch) : null
  const helpers = include ? (report!.helperApps || []).map(compactHelper) : null
  const daws = include
    ? report!.daws.map((d) => ({
        name: d.name,
        version: d.version,
        ...(d.bundleId ? { bundleId: d.bundleId } : {}),
        catalogPluginId: d.catalog?.catalogPluginId ?? null,
        status: d.catalog?.status ?? null,
        latestVersion: d.catalog?.latestVersion ?? null,
      }))
    : null

  return {
    kind: 'feedback',
    schemaVersion: 1,
    message: input.message.trim().slice(0, FEEDBACK_MAX_CHARS),
    app,
    catalogUpdatedAt: report?.catalog.updatedAt ?? null,
    scan: include ? toScanSnapshot(report!.plugins, report!.daws, report!.system) : null,
    matches,
    daws,
    helpers,
    summary: include
      ? {
          pluginCount: report!.rows.length,
          matched: report!.rows.filter((r) => r.catalogMatched).length,
          unmatched: report!.rows.filter((r) => !r.catalogMatched).length,
          needsUpdate: report!.rows.filter(
            (r) =>
              r.status === 'update_available' ||
              r.status === 'update_likely' ||
              r.status === 'paid_upgrade'
          ).length,
          dawCount: report!.daws.length,
          helperCount: (report!.helperApps || []).length,
        }
      : null,
  }
}

export async function sendFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  if (!payload.message) return { ok: false, error: 'Write a message first.' }
  if (!FEEDBACK_URL) return { ok: false, error: "Feedback isn't connected yet." }
  const body = JSON.stringify(payload)
  if (body.length > FEEDBACK_MAX_BYTES) {
    return {
      ok: false,
      error: 'Feedback is too large to send. Uncheck “Include my plugin list” or shorten the message.',
    }
  }
  try {
    const res = await platform().fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
    })
    if (res.ok) return { ok: true }
    let detail = ''
    try {
      const data = (await res.json()) as { error?: string }
      if (data?.error) detail = ` ${data.error}`
    } catch {
      /* ignore */
    }
    return { ok: false, error: `Couldn't send feedback.${detail}`.trim() }
  } catch {
    return { ok: false, error: "Couldn't reach the feedback service. Check your connection." }
  }
}
