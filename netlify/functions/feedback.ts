import type { Config, Context } from '@netlify/functions'

const REPO = process.env.FEEDBACK_GITHUB_REPO || 'thelukehendy/daw-plugin-manager'
const LABEL = 'app-feedback'
const MAX_BYTES = 1_000_000

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

function slug(message: string): string {
  const base = message
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return base || 'note'
}

function issueTitle(body: FeedbackBody): string {
  const msg = (body.message || '').trim().replace(/\s+/g, ' ')
  const short = msg.length > 72 ? `${msg.slice(0, 69)}…` : msg
  const os = body.app?.os ? ` · ${body.app.os}` : ''
  return `[app-feedback] ${short}${os}`
}

function issueBody(raw: string, parsed: FeedbackBody): string {
  const summary = parsed.summary
  const lines = [
    '<!-- daw-plugin-manager-feedback schemaVersion=1 -->',
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
      '',
      '_Full JSON (scan + matches) is in the details block for Cursor/Muse._'
    )
  }
  lines.push('', '<details>', '<summary>Payload JSON</summary>', '', '```json', raw, '```', '', '</details>', '')
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

async function createIssue(token: string, title: string, body: string): Promise<{ number: number; html_url: string }> {
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
    throw new Error(`GitHub ${res.status}: ${text.slice(0, 200)}`)
  }
  return (await res.json()) as { number: number; html_url: string }
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }))
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  const token = process.env.FEEDBACK_GITHUB_TOKEN || process.env.GITHUB_TOKEN
  if (!token) return json(503, { error: 'Feedback relay is not configured.' })

  const raw = await req.text()
  if (!raw || raw.length > MAX_BYTES) return json(413, { error: 'Payload too large.' })

  let parsed: FeedbackBody
  try {
    parsed = JSON.parse(raw) as FeedbackBody
  } catch {
    return json(400, { error: 'Invalid JSON.' })
  }

  if (parsed.kind !== 'feedback') return json(400, { error: 'Expected kind=feedback.' })
  if (!parsed.message || typeof parsed.message !== 'string' || !parsed.message.trim()) {
    return json(400, { error: 'Message required.' })
  }
  if (parsed.message.length > 4000) return json(400, { error: 'Message too long.' })

  try {
    await ensureLabel(token)
    const issue = await createIssue(token, issueTitle(parsed), issueBody(raw, parsed))
    return json(200, {
      ok: true,
      issue: issue.number,
      url: issue.html_url,
      id: `${new Date().toISOString().slice(0, 10)}-${slug(parsed.message)}`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return json(502, { error: `Could not file feedback (${msg}).` })
  }
}

export const config: Config = {
  path: '/api/feedback',
}
