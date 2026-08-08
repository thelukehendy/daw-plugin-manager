#!/usr/bin/env node
/**
 * Weekly Antigravity (Gemini managed agent) version scrub.
 *
 * - Seeds identity from catalog.json WITHOUT sending existing latestVersion values
 * - Asks antigravity-preview-05-2026 to verify a small batch from live public pages
 * - Merges high-confidence results into catalog.json + catalog/antigravity-export.json
 *
 * Env:
 *   GEMINI_API_KEY          required
 *   ANTIGRAVITY_BATCH_SIZE  default 10 (keep small on free tier)
 *   ANTIGRAVITY_DRY_RUN     if "1", call API but do not write catalog.json
 *   ANTIGRAVITY_MODEL_HINT  optional model override inside agent config (unused for now)
 */
const { readFileSync, writeFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')

const ROOT = resolve(__dirname, '../..')
const CATALOG_PATH = resolve(ROOT, 'catalog/catalog.json')
const EXPORT_PATH = resolve(ROOT, 'catalog/antigravity-export.json')
const CURSOR_PATH = resolve(ROOT, 'catalog/antigravity-cursor.json')

const BINARY_RE = /\.(dmg|pkg|exe|zip|msi|rar|7z|iso)(\?|$)/i
const BATCH_SIZE = Math.max(1, Number(process.env.ANTIGRAVITY_BATCH_SIZE || 10))
const DRY_RUN = process.env.ANTIGRAVITY_DRY_RUN === '1'
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY (GitHub Actions secret or local env).')
  process.exit(1)
}

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, 'utf8'))
}

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function assertPortalUrl(url) {
  if (!/^https?:\/\//i.test(url)) throw new Error(`Non-http portal: ${url}`)
  if (BINARY_RE.test(url)) throw new Error(`Binary URL rejected: ${url}`)
  if (/example\.com/i.test(url)) throw new Error(`Placeholder URL rejected: ${url}`)
}

function buildIdentitySeed(catalog) {
  const mfr = Object.fromEntries(catalog.manufacturers.map((m) => [m.id, m]))
  return catalog.plugins.map((p) => {
    const m = mfr[p.manufacturerId] || {}
    return {
      pluginId: p.id,
      manufacturerId: p.manufacturerId,
      manufacturer: m.name || p.manufacturerId,
      product: p.name,
      portalUrl: p.updatePortalUrl || m.updatePortalUrl || m.websiteUrl || null,
      // Intentionally omit latestVersion / versionEvidence / versionSourceUrl
      needsVerification: !p.versionEvidence || p.versionEvidence === 'unverified-seed' || !p.versionSourceUrl
    }
  })
}

function pickBatch(seed, cursor, batchSize) {
  if (!seed.length) return { batch: [], nextIndex: 0 }

  // Prefer unverified first, then rotate through the full list from cursor.
  const unverified = seed.filter((p) => p.needsVerification)
  const pool = unverified.length ? unverified : seed
  const start = Number(cursor.lastIndex || 0) % pool.length
  const batch = []
  for (let i = 0; i < Math.min(batchSize, pool.length); i++) {
    batch.push(pool[(start + i) % pool.length])
  }
  return { batch, nextIndex: (start + batch.length) % pool.length, poolSize: pool.length }
}

function buildPrompt(batch) {
  const seed = batch.map(({ manufacturer, product, portalUrl, pluginId, manufacturerId }) => ({
    pluginId,
    manufacturerId,
    manufacturer,
    product,
    portalUrl
  }))

  return `You are verifying public audio-plugin / DAW software version numbers.

TASK
For EACH product in the seed JSON below:
1) Visit the manufacturer portal / release-notes / downloads / changelog page.
   Start from portalUrl when present; follow to a better public page if needed.
2) Extract the latest public version from that live page only.
3) Return ONLY a JSON array (no markdown fences, no commentary) of objects:
{
  "pluginId": string,
  "manufacturerId": string,
  "manufacturer": string,
  "product": string,
  "latestVerifiedVersion": string or null,
  "sourceUrl": string or null,
  "evidenceType": "release-notes"|"download-portal"|"changelog"|"news"|"uncertain"|null,
  "confidence": "high"|"medium"|"low",
  "notes": string
}

RULES
- Do NOT invent versions.
- If unverified, latestVerifiedVersion=null and confidence=low.
- Prefer exact dotted versions (e.g. 5.5.5).
- Never use example.com, placeholder names, or installer binary URLs (.dmg/.pkg/.exe/.zip).
- No downloads of installers. Public pages only.
- Keep pluginId and manufacturerId unchanged from the seed.

SEED
${JSON.stringify(seed, null, 2)}
`
}

async function callAntigravity(prompt) {
  const body = {
    agent: 'antigravity-preview-05-2026',
    input: prompt,
    environment: 'remote'
  }

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
      'Api-Revision': '2025-11-20'
    },
    body: JSON.stringify(body)
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Antigravity HTTP ${res.status}: ${text.slice(0, 1000)}`)
  }

  const data = JSON.parse(text)
  let output = data.output_text || ''
  if (!output) {
    const chunks = []
    for (const step of data.steps || []) {
      for (const c of step.content || []) {
        if (c.type === 'text' && c.text) chunks.push(c.text)
      }
    }
    output = chunks.join('\n')
  }

  return {
    interactionId: data.id,
    environmentId: data.environment_id,
    status: data.status,
    usage: data.usage || null,
    outputText: output
  }
}

function extractJsonArray(text) {
  if (!text) throw new Error('Empty Antigravity output')
  const trimmed = text.trim()
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // fall through — model sometimes wraps in fences/prose
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) {
    const parsed = JSON.parse(fence[1].trim())
    if (Array.isArray(parsed)) return parsed
  }
  const start = trimmed.indexOf('[')
  const end = trimmed.lastIndexOf(']')
  if (start >= 0 && end > start) {
    const parsed = JSON.parse(trimmed.slice(start, end + 1))
    if (Array.isArray(parsed)) return parsed
  }
  throw new Error('Could not parse JSON array from Antigravity output')
}

function sanitizeFindings(raw, batch) {
  const byId = Object.fromEntries(batch.map((b) => [b.pluginId, b]))
  const out = []
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue
    const pluginId = row.pluginId
    const seed = byId[pluginId]
    if (!seed) {
      console.warn('Skipping unknown pluginId from agent:', pluginId)
      continue
    }
    const version = row.latestVerifiedVersion == null ? null : String(row.latestVerifiedVersion).trim()
    const sourceUrl = row.sourceUrl == null ? null : String(row.sourceUrl).trim()
    const confidence = String(row.confidence || 'low').toLowerCase()
    if (!version || !sourceUrl) {
      out.push({
        pluginId: seed.pluginId,
        manufacturerId: seed.manufacturerId,
        manufacturer: seed.manufacturer,
        product: seed.product,
        latestVerifiedVersion: null,
        sourceUrl: null,
        evidenceType: row.evidenceType || null,
        confidence: 'low',
        notes: String(row.notes || 'unverified'),
        status: 'pending'
      })
      continue
    }
    try {
      assertPortalUrl(sourceUrl)
    } catch (err) {
      console.warn(`Rejecting ${pluginId}: ${err.message}`)
      continue
    }
    // Guardrail: marketing prices mistaken for versions
    const major = Number(String(version).replace(/^v/i, '').split('.')[0])
    if (Number.isFinite(major) && major >= 50) {
      console.warn(`Rejecting suspicious version ${version} for ${pluginId}`)
      continue
    }
    if (!['high', 'medium', 'low'].includes(confidence)) continue

    out.push({
      pluginId: seed.pluginId,
      manufacturerId: seed.manufacturerId,
      manufacturer: seed.manufacturer,
      product: seed.product,
      latestVerifiedVersion: version.replace(/^v/i, ''),
      sourceUrl,
      evidenceType: row.evidenceType || 'download-portal',
      confidence,
      notes: String(row.notes || ''),
      status: confidence === 'high' ? 'active' : confidence === 'medium' ? 'active' : 'pending',
      verifiedAt: new Date().toISOString().slice(0, 10)
    })
  }
  return out
}

function applyToCatalog(catalog, findings) {
  let changed = 0
  const byId = Object.fromEntries(catalog.plugins.map((p) => [p.id, p]))
  for (const f of findings) {
    if (f.confidence !== 'high' && f.confidence !== 'medium') continue
    if (!f.latestVerifiedVersion || !f.sourceUrl) continue
    const plugin = byId[f.pluginId]
    if (!plugin) continue
    const before = `${plugin.latestVersion}|${plugin.versionSourceUrl}|${plugin.versionEvidence}`
    plugin.latestVersion = f.latestVerifiedVersion
    plugin.versionEvidence = 'public-page'
    plugin.versionSourceUrl = f.sourceUrl
    plugin.versionVerifiedAt = f.verifiedAt
    plugin.updatePortalUrl = plugin.updatePortalUrl || f.sourceUrl
    const stamp = `verifiedPublic:${f.latestVerifiedVersion}@${f.sourceUrl}`
    const notes = (plugin.notes || '').replace(/\s*verifiedPublic:\S+/g, '').trim()
    plugin.notes = notes ? `${notes} ${stamp}` : stamp
    const after = `${plugin.latestVersion}|${plugin.versionSourceUrl}|${plugin.versionEvidence}`
    if (before !== after) changed++
  }
  if (changed) {
    catalog.updatedAt = new Date().toISOString()
    catalog.catalogSource = 'antigravity-scrub'
  }
  return changed
}

function mergeExport(existing, findings, meta) {
  const byId = Object.fromEntries((existing.findings || []).map((f) => [f.pluginId, f]))
  for (const f of findings) {
    const prev = byId[f.pluginId]
    if (!prev) {
      byId[f.pluginId] = f
      continue
    }
    // Prefer higher confidence / newer verification
    const rank = { high: 3, medium: 2, low: 1 }
    if ((rank[f.confidence] || 0) >= (rank[prev.confidence] || 0)) {
      byId[f.pluginId] = { ...prev, ...f }
    }
  }
  return {
    schemaVersion: 1,
    kind: 'antigravity-version-export',
    updatedAt: new Date().toISOString(),
    lastRun: meta,
    counts: {
      findings: Object.keys(byId).length,
      active: Object.values(byId).filter((f) => f.status === 'active').length,
      pending: Object.values(byId).filter((f) => f.status !== 'active').length
    },
    findings: Object.values(byId).sort((a, b) => a.pluginId.localeCompare(b.pluginId))
  }
}

async function main() {
  const catalog = loadJson(CATALOG_PATH)
  const seed = buildIdentitySeed(catalog)
  const cursor = loadJson(CURSOR_PATH, { lastIndex: 0 })
  const { batch, nextIndex, poolSize } = pickBatch(seed, cursor, BATCH_SIZE)

  console.log(
    `Antigravity scrub: batch=${batch.length} pool=${poolSize} dryRun=${DRY_RUN ? 'yes' : 'no'}`
  )
  for (const b of batch) {
    console.log(` - ${b.manufacturer} / ${b.product} (${b.pluginId})`)
  }

  const prompt = buildPrompt(batch)
  const result = await callAntigravity(prompt)
  console.log(`interaction=${result.interactionId} status=${result.status}`)
  if (result.usage) console.log('usage', JSON.stringify(result.usage))

  const raw = extractJsonArray(result.outputText)
  const findings = sanitizeFindings(raw, batch)
  console.log(`parsed_findings=${findings.length}`)

  const exportDoc = mergeExport(loadJson(EXPORT_PATH, { findings: [] }), findings, {
    interactionId: result.interactionId,
    environmentId: result.environmentId,
    batchSize: batch.length,
    at: new Date().toISOString()
  })
  writeFileSync(EXPORT_PATH, `${JSON.stringify(exportDoc, null, 2)}\n`)
  writeFileSync(
    CURSOR_PATH,
    `${JSON.stringify({ lastIndex: nextIndex, updatedAt: new Date().toISOString() }, null, 2)}\n`
  )

  let changed = 0
  if (!DRY_RUN) {
    changed = applyToCatalog(catalog, findings)
    writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        batchSize: batch.length,
        findings: findings.length,
        catalogPluginsUpdated: changed,
        exportPath: 'catalog/antigravity-export.json',
        nextIndex
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
