#!/usr/bin/env node
/**
 * Antigravity cold-gap discovery (accuracy-first).
 *
 * - Only processes cold gap-queue items (no sticky URL / sticky failed)
 * - Does NOT send existing latestVersion values to the agent
 * - Page-confirms every version before catalog write
 * - Promotes successful URLs into known-sources.json
 * - Tracks Gemini usage and adapts next batch size for free tier
 *
 * Env:
 *   GEMINI_API_KEY              required (unless SMART_SCRUB_SKIP_ANTIGRAVITY=1)
 *   ANTIGRAVITY_BATCH_SIZE      optional override
 *   ANTIGRAVITY_DRY_RUN         "1" = no catalog.json writes (export/usage still written)
 *   ANTIGRAVITY_COLD_IDS        comma pluginIds to force (testing)
 */
const { writeFileSync } = require('node:fs')
const {
  CATALOG_PATH,
  EXPORT_PATH,
  CURSOR_PATH,
  USAGE_PATH,
  GAP_QUEUE_PATH
} = require('./lib/paths')
const { buildAndWrite, loadJson } = require('./lib/gapQueue')
const {
  assertPortalUrl,
  normalizeVersion,
  isSuspiciousVersion,
  confirmVersionOnPage
} = require('./lib/accuracyGate')
const { loadKnownSources, saveKnownSources, mergeDiscoveredSources } = require('./lib/knownSourcesJs')

const DRY_RUN = process.env.ANTIGRAVITY_DRY_RUN === '1'
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
const DEFAULT_BATCH = 8
const MIN_BATCH = 3
const MAX_BATCH = 15

function loadUsage() {
  return loadJson(USAGE_PATH, {
    schemaVersion: 1,
    nextBatchSize: DEFAULT_BATCH,
    runs: []
  })
}

function chooseBatchSize(usage) {
  if (process.env.ANTIGRAVITY_BATCH_SIZE) {
    return Math.max(1, Number(process.env.ANTIGRAVITY_BATCH_SIZE))
  }
  const n = Number(usage.nextBatchSize || DEFAULT_BATCH)
  return Math.min(MAX_BATCH, Math.max(MIN_BATCH, n))
}

function adaptNextBatchSize(usage, { quotaError, tokens, batchSize, successes }) {
  let next = batchSize
  if (quotaError) {
    next = Math.max(MIN_BATCH, Math.floor(batchSize * 0.5))
  } else if (successes > 0 && tokens != null && tokens < 180000) {
    next = Math.min(MAX_BATCH, batchSize + 1)
  } else if (tokens != null && tokens > 350000) {
    next = Math.max(MIN_BATCH, batchSize - 1)
  }
  usage.nextBatchSize = next
  return next
}

function pickColdBatch(gaps, batchSize, cursor) {
  const forced = (process.env.ANTIGRAVITY_COLD_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  let cold = gaps.filter((g) => g.path === 'cold')
  if (forced.length) {
    const set = new Set(forced)
    cold = gaps.filter((g) => set.has(g.pluginId))
  }

  // Manufacturer-batch: take contiguous manufacturer groups from prioritized gap list
  if (!cold.length) return { batch: [], nextIndex: 0, poolSize: 0 }

  const start = Number(cursor.lastIndex || 0) % cold.length
  const rotated = cold.slice(start).concat(cold.slice(0, start))
  const batch = []
  const seenMfr = new Set()
  for (const item of rotated) {
    if (batch.length >= batchSize) break
    // Prefer filling current manufacturer before hopping too much
    if (seenMfr.size && !seenMfr.has(item.manufacturerId) && batch.length >= Math.ceil(batchSize * 0.6)) {
      // allow new mfr only after 60% filled
    }
    batch.push(item)
    seenMfr.add(item.manufacturerId)
  }
  const nextIndex = (start + batch.length) % cold.length
  return { batch, nextIndex, poolSize: cold.length }
}

function buildPrompt(batch) {
  // Group by manufacturer for fewer navigations
  const byMfr = {}
  for (const b of batch) {
    if (!byMfr[b.manufacturer]) byMfr[b.manufacturer] = []
    byMfr[b.manufacturer].push({
      pluginId: b.pluginId,
      manufacturerId: b.manufacturerId,
      product: b.product,
      portalUrl: b.portalUrl
    })
  }

  return `You are verifying public audio-plugin / DAW software version numbers with ZERO guessing.

TASK
For EACH product below, find the latest public version on an official manufacturer page.
Prefer one shared release-notes/downloads/changelog page per manufacturer when versions are published there.

Return ONLY a JSON array (no markdown fences) of:
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
- Do NOT invent versions. If unsure, null + confidence low.
- Keep pluginId and manufacturerId unchanged.
- Never use example.com, google.com/search, or installer binary URLs (.dmg/.pkg/.exe/.zip).
- Prefer exact dotted versions (e.g. 5.5.5).
- Do not download installers.

MANUFACTURER GROUPS
${JSON.stringify(byMfr, null, 2)}
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
    const err = new Error(`Antigravity HTTP ${res.status}: ${text.slice(0, 1000)}`)
    err.status = res.status
    err.body = text
    throw err
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
    /* continue */
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

function markVerified(plugin, version, sourceUrl) {
  plugin.latestVersion = normalizeVersion(version)
  plugin.versionEvidence = 'agent-verified'
  plugin.versionSourceUrl = sourceUrl
  plugin.versionVerifiedAt = new Date().toISOString().slice(0, 10)
  plugin.updatePortalUrl = plugin.updatePortalUrl || sourceUrl
  const stamp = `verifiedPublic:${plugin.latestVersion}@${sourceUrl}`
  const notes = (plugin.notes || '').replace(/\s*verifiedPublic:\S+/g, '').trim()
  plugin.notes = notes ? `${notes} ${stamp}` : stamp
}

function mergeExport(existing, findings, meta) {
  const byId = Object.fromEntries((existing.findings || []).map((f) => [f.pluginId, f]))
  for (const f of findings) {
    const prev = byId[f.pluginId]
    const rank = { high: 3, medium: 2, low: 1 }
    if (!prev || (rank[f.confidence] || 0) >= (rank[prev.confidence] || 0)) {
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
  if (!API_KEY) {
    console.error('Missing GEMINI_API_KEY')
    process.exit(1)
  }

  const { gaps } = buildAndWrite({ writeCoverage: false })
  const usageDoc = loadUsage()
  const batchSize = chooseBatchSize(usageDoc)
  const cursor = loadJson(CURSOR_PATH, { lastIndex: 0 })
  const { batch, nextIndex, poolSize } = pickColdBatch(gaps, batchSize, cursor)

  console.log(
    `antigravity-cold: batch=${batch.length}/${batchSize} coldPool=${poolSize} dryRun=${DRY_RUN}`
  )
  if (!batch.length) {
    console.log(JSON.stringify({ ok: true, skipped: true, reason: 'no_cold_gaps' }, null, 2))
    return { ok: true, skipped: true, antigravity_hits: 0, page_confirm_rejects: 0, tokens_used: 0, next_batch_size: batchSize }
  }
  for (const b of batch) {
    console.log(` - ${b.manufacturer} / ${b.product}`)
  }

  let quotaError = false
  let result
  try {
    result = await callAntigravity(buildPrompt(batch))
  } catch (err) {
    quotaError = /429|resource.exhausted|quota|rate.?limit/i.test(String(err.message) + (err.body || ''))
    const next = adaptNextBatchSize(usageDoc, {
      quotaError: true,
      tokens: null,
      batchSize,
      successes: 0
    })
    usageDoc.runs = (usageDoc.runs || []).slice(-40)
    usageDoc.runs.push({
      at: new Date().toISOString(),
      batchSize,
      tokens: null,
      successes: 0,
      rejects: batch.length,
      quotaError: true,
      error: String(err.message).slice(0, 500)
    })
    usageDoc.updatedAt = new Date().toISOString()
    writeFileSync(USAGE_PATH, `${JSON.stringify(usageDoc, null, 2)}\n`)
    writeFileSync(
      CURSOR_PATH,
      `${JSON.stringify({ lastIndex: nextIndex, updatedAt: new Date().toISOString() }, null, 2)}\n`
    )
    console.error(err)
    const summary = {
      ok: false,
      quotaError,
      antigravity_hits: 0,
      page_confirm_rejects: batch.length,
      tokens_used: 0,
      next_batch_size: next,
      error: String(err.message).slice(0, 500)
    }
    console.log(JSON.stringify(summary, null, 2))
    if (require.main === module && !quotaError) process.exit(1)
    return summary
  }

  console.log(`interaction=${result.interactionId} status=${result.status}`)
  const tokens = result.usage?.total_tokens ?? null
  if (result.usage) console.log('usage', JSON.stringify(result.usage))

  const raw = extractJsonArray(result.outputText)
  const bySeed = Object.fromEntries(batch.map((b) => [b.pluginId, b]))
  const catalog = loadJson(CATALOG_PATH)
  const byId = Object.fromEntries(catalog.plugins.map((p) => [p.id, p]))
  const known = loadKnownSources()

  let hits = 0
  let rejects = 0
  const exportRows = []
  const promotions = []

  for (const row of raw) {
    const seed = bySeed[row.pluginId]
    if (!seed) {
      rejects++
      continue
    }
    const version = row.latestVerifiedVersion == null ? null : normalizeVersion(row.latestVerifiedVersion)
    const sourceUrl = row.sourceUrl == null ? null : String(row.sourceUrl).trim()
    const confidence = String(row.confidence || 'low').toLowerCase()

    if (!version || !sourceUrl || !['high', 'medium'].includes(confidence)) {
      rejects++
      exportRows.push({
        pluginId: seed.pluginId,
        manufacturerId: seed.manufacturerId,
        manufacturer: seed.manufacturer,
        product: seed.product,
        latestVerifiedVersion: null,
        sourceUrl: null,
        confidence: 'low',
        status: 'pending',
        notes: String(row.notes || 'unverified')
      })
      continue
    }
    if (isSuspiciousVersion(version)) {
      rejects++
      continue
    }

    let portalOk = true
    try {
      assertPortalUrl(sourceUrl)
    } catch {
      portalOk = false
    }
    if (!portalOk) {
      rejects++
      continue
    }

    const confirm = await confirmVersionOnPage(sourceUrl, version)
    if (!confirm.ok) {
      rejects++
      console.log(`  ✗ page-confirm ${seed.product}: ${confirm.reason}`)
      exportRows.push({
        pluginId: seed.pluginId,
        manufacturerId: seed.manufacturerId,
        manufacturer: seed.manufacturer,
        product: seed.product,
        latestVerifiedVersion: version,
        sourceUrl,
        confidence: 'low',
        status: 'needs_review',
        notes: `page_confirm_failed: ${confirm.reason}`
      })
      continue
    }

    const finalUrl = confirm.finalUrl || sourceUrl
    hits++
    console.log(`  ✓ ${seed.manufacturer} / ${seed.product}: ${version} @ ${finalUrl}`)
    exportRows.push({
      pluginId: seed.pluginId,
      manufacturerId: seed.manufacturerId,
      manufacturer: seed.manufacturer,
      product: seed.product,
      latestVerifiedVersion: version,
      sourceUrl: finalUrl,
      evidenceType: row.evidenceType || 'download-portal',
      confidence,
      status: 'active',
      verifiedAt: new Date().toISOString().slice(0, 10),
      notes: String(row.notes || '')
    })

    if (!DRY_RUN) {
      const plugin = byId[seed.pluginId]
      if (plugin) markVerified(plugin, version, finalUrl)
      promotions.push({
        manufacturerId: seed.manufacturerId,
        url: finalUrl,
        kind: 'release-notes',
        label: `${seed.manufacturer} antigravity`,
        nameIncludes: seed.product,
        lastVersion: version,
        lastVerifiedAt: new Date().toISOString().slice(0, 10),
        addedBy: 'discovery'
      })
    }
  }

  const nextBatch = adaptNextBatchSize(usageDoc, {
    quotaError,
    tokens,
    batchSize,
    successes: hits
  })
  usageDoc.runs = (usageDoc.runs || []).slice(-40)
  usageDoc.runs.push({
    at: new Date().toISOString(),
    interactionId: result.interactionId,
    batchSize,
    tokens,
    successes: hits,
    rejects,
    quotaError: false
  })
  usageDoc.updatedAt = new Date().toISOString()
  writeFileSync(USAGE_PATH, `${JSON.stringify(usageDoc, null, 2)}\n`)

  const exportDoc = mergeExport(loadJson(EXPORT_PATH, { findings: [] }), exportRows, {
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

  if (!DRY_RUN && hits) {
    catalog.updatedAt = new Date().toISOString()
    catalog.catalogSource = 'antigravity-scrub'
    writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
    if (promotions.length) {
      mergeDiscoveredSources(known, promotions)
      saveKnownSources(known)
    }
  }

  // Refresh gap queue after writes
  buildAndWrite({ writeCoverage: false })

  const summary = {
    ok: true,
    antigravity_hits: hits,
    page_confirm_rejects: rejects,
    tokens_used: tokens,
    next_batch_size: nextBatch,
    dryRun: DRY_RUN,
    gap_queue: GAP_QUEUE_PATH
  }
  console.log(JSON.stringify(summary, null, 2))
  return summary
}

module.exports = { main, chooseBatchSize, adaptNextBatchSize }

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
