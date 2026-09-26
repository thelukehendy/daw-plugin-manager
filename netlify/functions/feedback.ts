import type { Config, Context } from '@netlify/functions'
import {
  feedbackPayloadLooksLeaky,
  scrubFeedbackText,
} from '../../src/shared/feedbackPrivacy'

const REPO = process.env.FEEDBACK_GITHUB_REPO || 'thelukehendy/daw-plugin-manager'
const LABEL = 'app-feedback'
const BRANCH = process.env.FEEDBACK_GITHUB_BRANCH || 'main'
const MAX_BYTES = 1_000_000
/** Soft abuse brake — cold starts reset the map; still stops casual floods. */
const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_MAX = 8
const rateHits = new Map<string, { count: number; resetAt: number }>()

function clientIp(req: Request): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('client-ip') ||
    'unknown'
  )
}

function allowRequest(ip: string): boolean {
  const now = Date.now()
  const row = rateHits.get(ip)
  if (!row || now >= row.resetAt) {
    rateHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (row.count >= RATE_MAX) return false
  row.count += 1
  return true
}

type FeedbackBody = {
  kind?: string
  schemaVersion?: number
  message?: string
  app?: { version?: string; shell?: string; os?: string }
  catalogUpdatedAt?: string | null
  summary?: { pluginCount?: number; unmatched?: number; needsUpdate?: number } | null
}

function cors(res: Response): Response {
  const headers = new Headers(res.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
}

function json(status: number, data: unknown): Response {
  return cors(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

function issueTitle(issueNumber: number | null, os?: string): string {
  const id = issueNumber != null ? `#${issueNumber}` : 'new'
  const osPart = os ? ` · ${os}` : ''
  return `[app-feedback] ${id}${osPart}`
}

/** Short human-readable issue — full JSON goes to the inbox file (no 65KB cap). */
function issueBody(parsed: FeedbackBody, inboxPath: string): string {
  const summary = parsed.summary
  const lines = [
    '<!-- daw-plugin-manager-feedback schemaVersion=1 inbox-written-by-relay -->',
    '',
    '## Message',
    '',
    parsed.message || '(empty)',
    '',
    '## App',
    '',
    `- Shell: \`${parsed.app?.shell || '?'}\` ${parsed.app?.version || ''}`,
    `- OS: \`${parsed.app?.os || '?'}\``,
    `- Catalog: \`${parsed.catalogUpdatedAt || 'unknown'}\``,
  ]
  if (summary) {
    lines.push(
      '',
      '## Scan summary',
      '',
      `- Plugins: ${summary.pluginCount ?? '?'}`,
      `- Unmatched: ${summary.unmatched ?? '?'}`,
      `- Needs update: ${summary.needsUpdate ?? '?'}`,
    )
  }
  lines.push(
    '',
    '## Full payload',
    '',
    `Complete JSON (message + scan + matches + daws + helpers) is on \`${BRANCH}\` at:`,
    '',
    `\`${inboxPath}\``,
    '',
    '_Issue titles and filenames are opaque IDs; free-text is scrubbed for emails/paths/hosts._',
    ''
  )
  return lines.join('\n')
}

async function ensureLabel(token: string): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/labels/${encodeURIComponent(LABEL)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'daw-plugin-manager-feedback',
    },
  })
  if (res.status === 200) return
  await fetch(`https://api.github.com/repos/${REPO}/labels`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'daw-plugin-manager-feedback',
    },
    body: JSON.stringify({
      name: LABEL,
      color: '0E8A16',
      description: 'In-app user feedback from DAW Plugin Manager',
    }),
  })
}

async function createIssue(
  token: string,
  title: string,
  body: string
): Promise<{ number: number; html_url: string; created_at: string }> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'daw-plugin-manager-feedback',
    },
    body: JSON.stringify({ title, body, labels: [LABEL] }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub issue ${res.status}: ${text.slice(0, 200)}`)
  }
  return (await res.json()) as { number: number; html_url: string; created_at: string }
}

async function patchIssue(
  token: string,
  number: number,
  update: { title?: string; body?: string }
): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${number}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'daw-plugin-manager-feedback',
    },
    body: JSON.stringify(update),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub issue patch ${res.status}: ${text.slice(0, 200)}`)
  }
}

/** Write the full envelope to advisory/feedback-inbox/ on main (no size cap like issue bodies). */
async function writeInboxFile(
  token: string,
  path: string,
  envelope: unknown,
  issueNumber: number
): Promise<void> {
  const content = Buffer.from(JSON.stringify(envelope, null, 2) + '\n', 'utf8').toString('base64')
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'daw-plugin-manager-feedback',
    },
    body: JSON.stringify({
      message: `advisory(feedback): mirror issue #${issueNumber}`,
      content,
      branch: BRANCH,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub contents ${res.status}: ${text.slice(0, 240)}`)
  }
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }))
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  if (!allowRequest(clientIp(req))) {
    return json(429, { error: 'Too many feedback requests. Try again later.' })
  }

  const token = process.env.FEEDBACK_GITHUB_TOKEN || process.env.GITHUB_TOKEN
  if (!token) return json(503, { error: 'Feedback relay is not configured.' })

  const raw = await req.text()
  if (!raw || raw.length > MAX_BYTES) return json(413, { error: 'Payload too large.' })

  let parsed: FeedbackBody & Record<string, unknown>
  try {
    parsed = JSON.parse(raw) as FeedbackBody & Record<string, unknown>
  } catch {
    return json(400, { error: 'Invalid JSON.' })
  }

  if (parsed.kind !== 'feedback') return json(400, { error: 'Expected kind=feedback.' })
  if (!parsed.message || typeof parsed.message !== 'string' || !parsed.message.trim()) {
    return json(400, { error: 'Message required.' })
  }
  if (parsed.message.length > 4000) return json(400, { error: 'Message too long.' })

  // Scrub free-text again server-side; opaque public names below.
  parsed.message = scrubFeedbackText(parsed.message.trim()).slice(0, 4000)
  const sealed = JSON.stringify(parsed)
  if (feedbackPayloadLooksLeaky(sealed)) {
    return json(400, {
      error: 'Feedback looks like it includes machine paths. Remove personal folders and try again.',
    })
  }

  const day = new Date().toISOString().slice(0, 10)
  const os = parsed.app?.os

  try {
    await ensureLabel(token)
    const provisionalPath = `advisory/feedback-inbox/${day}-pending.json`
    const issue = await createIssue(
      token,
      issueTitle(null, os),
      issueBody(parsed, provisionalPath)
    )
    const inboxPath = `advisory/feedback-inbox/${day}-${issue.number}.json`
    const envelope = {
      source: 'app-feedback',
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      receivedAt: issue.created_at,
      payload: parsed,
    }
    await writeInboxFile(token, inboxPath, envelope, issue.number)
    await patchIssue(token, issue.number, {
      title: issueTitle(issue.number, os),
      body: issueBody(parsed, inboxPath),
    })

    return json(200, {
      ok: true,
      issue: issue.number,
      url: issue.html_url,
      inboxPath,
      id: `${day}-${issue.number}`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return json(502, { error: `Could not file feedback (${msg}).` })
  }
}

export const config: Config = {
  path: '/api/feedback',
}
