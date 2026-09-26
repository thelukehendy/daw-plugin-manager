/**
 * In-app feedback. Sent to the feedback relay, which files it privately for the
 * maintainers; the app never holds repository credentials.
 */
import type { ScanReport } from '../shared/types'
import { toScanSnapshot, type ScanSnapshot } from '../shared/scanSnapshot'
import { platform } from './platform'

/** Relay endpoint; empty until the relay is deployed. */
export const FEEDBACK_URL = ''

export const FEEDBACK_MAX_CHARS = 4000

export interface FeedbackInput {
  message: string
  includeScan: boolean
}

export interface FeedbackPayload {
  kind: 'feedback'
  message: string
  app: { version: string; shell: 'electron' | 'tauri'; os: string; osVersion: string | null; arch: string }
  catalogUpdatedAt: string | null
  scan: ScanSnapshot | null
}

export type FeedbackResult = { ok: true } | { ok: false; error: string }

export function buildFeedbackPayload(
  input: FeedbackInput,
  report: ScanReport | null,
  app: FeedbackPayload['app']
): FeedbackPayload {
  return {
    kind: 'feedback',
    message: input.message.trim().slice(0, FEEDBACK_MAX_CHARS),
    app,
    catalogUpdatedAt: report?.catalog.updatedAt ?? null,
    scan:
      input.includeScan && report
        ? toScanSnapshot(report.plugins, report.daws, report.system)
        : null,
  }
}

export async function sendFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  if (!payload.message) return { ok: false, error: 'Write a message first.' }
  if (!FEEDBACK_URL) return { ok: false, error: "Feedback isn't connected yet." }
  try {
    const res = await platform().fetch(FEEDBACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok ? { ok: true } : { ok: false, error: "Couldn't send feedback. Try again later." }
  } catch {
    return { ok: false, error: "Couldn't reach the feedback service. Check your connection." }
  }
}
