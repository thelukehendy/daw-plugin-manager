#!/usr/bin/env node
/**
 * Parallel cheap→smart Flash extract + hard page-confirm.
 *
 * Tier A (cheap, many in parallel): Flash-Lite / light Flash models partition the
 * gap queue. High free RPD buckets first.
 *
 * Tier B (smart, fewer in parallel): fuller Flash models only see escalations —
 * low confidence, null extract with product on page, or page-confirm miss.
 *
 * Accuracy: version must appear on the fetched public page. No invented versions.
 * Antigravity / Pro are intentionally excluded from this path (TPM / paid).
 *
 * Env:
 *   GEMINI_API_KEY
 *   FLASH_LIMIT                 max plugins into cheap tier (default 480)
 *   FLASH_DRY_RUN=1
 *   FLASH_SKIP_SMART=1          cheap tier only
 *   FLASH_CHEAP_MODELS          comma list (default 5 Lite/light models)
 *   FLASH_SMART_MODELS          comma list (default 3 fuller Flash)
 *   FLASH_CHEAP_RPM             default 12
 *   FLASH_SMART_RPM             default 4 (free 3.5/3.6 Flash caps at 5 RPM)
 *   FLASH_CHEAP_BUDGET_EACH     soft per-model call cap (default 400; small models clamp)
 *   FLASH_SMART_BUDGET_EACH     default 40
 */
const { writeFileSync } = require('node:fs')
const { CATALOG_PATH, USAGE_PATH, ESCALATION_PATH } = require('./lib/paths')
const { buildAndWrite, loadJson } = require('./lib/gapQueue')
const {
  assertPortalUrl,
  normalizeVersion,
  isSuspiciousVersion,
  fetchPageText,
  versionAppearsOnPage,
  extractVersionsFromHtml
} = require('./lib/accuracyGate')
const { loadKnownSources, saveKnownSources, mergeDiscoveredSources } = require('./lib/knownSourcesJs')

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
const DRY_RUN = process.env.FLASH_DRY_RUN === '1'
const SKIP_SMART = process.env.FLASH_SKIP_SMART === '1'
const LIMIT = Math.max(1, Number(process.env.FLASH_LIMIT || 480))
const CHEAP_RPM = Math.max(1, Number(process.env.FLASH_CHEAP_RPM || 12))
const SMART_RPM = Math.max(1, Number(process.env.FLASH_SMART_RPM || 4))
const CHEAP_BUDGET = Math.max(1, Number(process.env.FLASH_CHEAP_BUDGET_EACH || 400))
const SMART_BUDGET = Math.max(1, Number(process.env.FLASH_SMART_BUDGET_EACH || 40))

const DEFAULT_CHEAP = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash'
]
const DEFAULT_SMART = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash']

/** Per-model soft budgets for known tiny free free-tier buckets. */
const MODEL_BUDGET_CAP = {
  'gemini-2.5-flash-lite': 18,
  'gemini-2.5-flash': 18,
  'gemini-2.0-flash-lite': 80,
  'gemini-2.0-flash': 80,
  'gemini-3.6-flash': 60,
  'gemini-3.5-flash': 60
}

function parseModelList(envVal, fallback) {
  const raw = String(envVal || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return raw.length ? raw : fallback
}

function budgetFor(model, tierBudget) {
  const cap = MODEL_BUDGET_CAP[model]
  if (cap == null) return tierBudget
  return Math.min(tierBudget, cap)
}

function isHopelessPortalUrl(url) {
  const u = String(url || '').toLowerCase()
  return /accounts\.html|\/my-account\/|\/account\/(login|register)|\/signin|\/sign-in|master.?account|\/login\/?(\?|$)/i.test(
    u
  )
}

function looksLikeLoginWall(text) {
  const t = String(text || '').toLowerCase()
  const loginHits = (t.match(/\bsign in\b|\blog in\b|\bcreate account\b|\bpassword\b/g) || [])
    .length
  const versions = extractVersionsFromHtml(text)
  return loginHits >= 3 && versions.length === 0
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function snippetForProduct(html, product, maxLen = 14000) {
  const text = stripHtml(html)
  const lower = text.toLowerCase()
  const hint = String(product || '').toLowerCase()
  let idx = hint ? lower.indexOf(hint) : -1
  if (idx < 0 && hint) {
    const short = hint.replace(/^(izotope|fabfilter|goodhertz|waves|plugin alliance)\s+/i, '')
    if (short.length >= 4) idx = lower.indexOf(short)
  }
  if (idx < 0) return text.slice(0, maxLen)
  return text.slice(Math.max(0, idx - 2000), Math.max(0, idx - 2000) + maxLen)
}

function productAppearsOnPage(pageText, product) {
  const lower = pageText.toLowerCase()
  const name = String(product || '').toLowerCase()
  if (name && lower.includes(name)) return true
  const short = name.replace(/^(izotope|fabfilter|goodhertz|waves|plugin alliance)\s+/i, '')
  return short.length >= 4 && lower.includes(short)
}

function candidateUrls(gap, known) {
  const urls = []
  const add = (u) => {
    if (!u || urls.includes(u)) return
    try {
      assertPortalUrl(u)
      urls.push(u)
    } catch {
      /* skip */
    }
  }
  add(gap.versionSourceUrl)
  for (const u of gap.stickyUrls || []) add(u)
  add(gap.portalUrl)
  for (const s of known.sources || []) {
    if (s.manufacturerId !== gap.manufacturerId) continue
    if (s.nameIncludes) {
      const a = String(s.nameIncludes).toLowerCase()
      const b = String(gap.product).toLowerCase()
      if (!(b.includes(a) || a.includes(b))) continue
    }
    add(s.url)
  }
  return urls.filter((u) => !isHopelessPortalUrl(u)).slice(0, 4)
}

class AsyncQueue {
  constructor() {
    this.items = []
    this.waiters = []
    this.closed = false
  }
  push(item) {
    if (this.closed) return
    const w = this.waiters.shift()
    if (w) w(item)
    else this.items.push(item)
  }
  async take() {
    if (this.items.length) return this.items.shift()
    if (this.closed) return null
    return new Promise((resolve) => this.waiters.push(resolve))
  }
  close() {
    this.closed = true
    while (this.waiters.length) this.waiters.shift()(null)
  }
  get size() {
    return this.items.length
  }
}

async function callModel(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 320,
      responseMimeType: 'application/json'
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  if (!res.ok) {
    const err = new Error(`${model} HTTP ${res.status}: ${text.slice(0, 400)}`)
    err.status = res.status
    err.body = text
    err.model = model
    throw err
  }
  const data = JSON.parse(text)
  const parts = data?.candidates?.[0]?.content?.parts || []
  return {
    text: parts.map((p) => p.text || '').join(''),
    usage: data?.usageMetadata || null,
    model
  }
}

function parseFlashJson(text) {
  const trimmed = String(text || '').trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const m = trimmed.match(/\{[\s\S]*\}/)
    if (m) return JSON.parse(m[0])
    throw new Error('Model did not return JSON')
  }
}

function buildPrompt(product, manufacturer, pageUrl, snippet, { smart = false, priorReason = '' } = {}) {
  const extra = smart
    ? `\nThis is an escalation after a cheaper model struggled (${priorReason || 'unclear'}).
Be extra careful: only return a version if you can point to it in the PAGE TEXT for THIS product.
If ambiguous across products, return version=null.`
    : ''
  return `You extract a public software version from manufacturer page text.
Return ONLY JSON:
{"version": string|null, "confidence":"high"|"medium"|"low", "notes": string}

Rules:
- Product: ${JSON.stringify(product)}
- Manufacturer: ${JSON.stringify(manufacturer)}
- Page URL: ${pageUrl}
- Do NOT invent a version. If the product version is not clearly present, version=null and confidence=low.
- Prefer exact dotted versions (e.g. 5.5.5).
- Ignore prices, years-only tokens, and unrelated products on the same page.
- If multiple versions appear for THIS product, choose the newest clearly labeled current/latest release.${extra}

PAGE TEXT:
${snippet}
`
}

function markVerified(plugin, version, sourceUrl, via) {
  plugin.latestVersion = normalizeVersion(version)
  plugin.versionEvidence = 'page-confirmed'
  plugin.versionSourceUrl = sourceUrl
  plugin.versionVerifiedAt = new Date().toISOString().slice(0, 10)
  plugin.updatePortalUrl = plugin.updatePortalUrl || sourceUrl
  const stamp = `verifiedPublic:${plugin.latestVersion}@${sourceUrl}`
  const notes = (plugin.notes || '').replace(/\s*verifiedPublic:\S+/g, '').trim()
  const tag = via ? ` flash:${via}` : ''
  plugin.notes = notes ? `${notes} ${stamp}${tag}` : `${stamp}${tag}`
}

function shouldEscalate(reason, meta = {}) {
  if (!reason) return false
  if (/login_wall|no_usable|HTTP 404|HTTP 403|hopeless/i.test(reason)) return false
  if (/product_name_not_on_page/i.test(reason) && !meta.productOnPage) return false
  if (/flash_null|low_confidence|page_confirm_failed|parse|ambiguous/i.test(reason)) {
    return Boolean(meta.productOnPage || meta.hasPage)
  }
  return false
}

/**
 * @param {object} opts
 * @param {'cheap'|'smart'} opts.tier
 * @param {string} opts.model
 * @param {number} opts.rpm
 * @param {object} opts.gap
 * @param {object} opts.known
 * @param {object} opts.stats
 * @param {string} [opts.priorReason]
 * @param {string} [opts.preferredUrl]
 * @param {string} [opts.cachedSnippet]
 * @param {string} [opts.cachedPageText]
 */
async function verifyWithModel(opts) {
  const { tier, model, rpm, gap, known, stats, priorReason } = opts
  const urls = opts.preferredUrl
    ? [opts.preferredUrl, ...candidateUrls(gap, known).filter((u) => u !== opts.preferredUrl)]
    : candidateUrls(gap, known)

  if (!urls.length) {
    return { ok: false, reason: 'no_usable_candidate_url', escalate: false }
  }

  let lastReason = 'failed'
  let lastMeta = {}

  for (const url of urls) {
    try {
      let pageText = opts.cachedPageText
      let pageUrl = opts.preferredUrl || url
      if (!pageText || pageUrl !== url) {
        const page = await fetchPageText(url)
        pageText = page.text
        pageUrl = page.url || url
      }
      const productOnPage = productAppearsOnPage(pageText, gap.product)
      lastMeta = { productOnPage, hasPage: true, sourceUrl: pageUrl, pageText }

      // Free heuristic — only on cheap tier first pass
      if (tier === 'cheap') {
        const heuristic = extractVersionsFromHtml(pageText, { nameHint: gap.product })
        for (const ver of heuristic.slice(0, 4)) {
          if (!ver || isSuspiciousVersion(ver)) continue
          if (!productOnPage) break
          if (versionAppearsOnPage(pageText, ver)) {
            stats.heuristicHits++
            return {
              ok: true,
              version: normalizeVersion(ver),
              sourceUrl: pageUrl,
              via: 'heuristic',
              escalate: false
            }
          }
        }
      }

      if (looksLikeLoginWall(pageText)) {
        lastReason = 'login_wall_skip_flash'
        stats.skippedLoginWall++
        continue
      }

      const snippet =
        opts.cachedSnippet && opts.preferredUrl === pageUrl
          ? opts.cachedSnippet
          : snippetForProduct(pageText, gap.product)
      const prompt = buildPrompt(gap.product, gap.manufacturer, pageUrl, snippet, {
        smart: tier === 'smart',
        priorReason
      })

      await sleep(Math.ceil(60000 / rpm))
      let flash
      try {
        flash = await callModel(model, prompt)
      } catch (err) {
        if (err.status === 404 || /not found|is not found/i.test(String(err.body || ''))) {
          return { ok: false, reason: `model_unavailable:${model}`, escalate: false, disableModel: true }
        }
        if (err.status === 429 || /resource.exhausted|quota|rate.?limit/i.test(String(err.body || err.message))) {
          stats.quotaErrors++
          return { ok: false, reason: `rate_limited:${model}`, escalate: tier === 'cheap', disableModel: true, meta: lastMeta }
        }
        throw err
      }

      stats.flashCalls++
      stats.tokens += Number(flash.usage?.totalTokenCount || 0)
      stats.byModel[model] = (stats.byModel[model] || 0) + 1

      let parsed
      try {
        parsed = parseFlashJson(flash.text)
      } catch {
        lastReason = 'parse_error'
        lastMeta.snippet = snippet
        continue
      }

      const version = parsed.version == null ? null : normalizeVersion(parsed.version)
      if (!version) {
        lastReason = `flash_null:${parsed.notes || ''}`
        lastMeta.snippet = snippet
        continue
      }
      if (isSuspiciousVersion(version)) {
        lastReason = `suspicious:${version}`
        continue
      }
      if (!productOnPage) {
        lastReason = 'product_name_not_on_page'
        stats.rejects++
        continue
      }
      if (!versionAppearsOnPage(pageText, version)) {
        lastReason = `page_confirm_failed:${version}`
        stats.rejects++
        lastMeta.snippet = snippet
        continue
      }
      const conf = String(parsed.confidence || '').toLowerCase()
      if (!['high', 'medium'].includes(conf)) {
        lastReason = `low_confidence:${version}`
        lastMeta.snippet = snippet
        lastMeta.candidateVersion = version
        continue
      }
      return {
        ok: true,
        version,
        sourceUrl: pageUrl,
        via: `${tier}:${model}`,
        notes: parsed.notes || '',
        escalate: false
      }
    } catch (err) {
      lastReason = err.message || String(err)
      if (/429|resource.exhausted|quota/i.test(lastReason)) stats.quotaErrors++
    }
  }

  return {
    ok: false,
    reason: lastReason,
    escalate: shouldEscalate(lastReason, lastMeta),
    meta: lastMeta
  }
}

function buildQueue(gaps) {
  return gaps
    .filter((g) => g.portalUrl || g.versionSourceUrl || (g.stickyUrls && g.stickyUrls.length))
    .map((g) => {
      const urls = [g.versionSourceUrl, ...(g.stickyUrls || []), g.portalUrl].filter(Boolean)
      const usable = urls.filter((u) => !isHopelessPortalUrl(u))
      const score =
        (g.stickyUrls && g.stickyUrls.length ? 40 : 0) +
        (g.versionSourceUrl && !isHopelessPortalUrl(g.versionSourceUrl) ? 30 : 0) +
        (usable.length ? 20 : -50) +
        (g.reason === 'awaiting_page_confirmation' ? 10 : 0)
      return { ...g, _score: score, _usable: usable.length }
    })
    .sort((a, b) => b._score - a._score || a.priority - b.priority)
    .filter((g) => g._usable > 0)
    .slice(0, LIMIT)
}

async function main() {
  if (!API_KEY) {
    console.error('Missing GEMINI_API_KEY')
    process.exit(1)
  }

  const cheapModels = parseModelList(process.env.FLASH_CHEAP_MODELS, DEFAULT_CHEAP)
  const smartModels = parseModelList(process.env.FLASH_SMART_MODELS, DEFAULT_SMART)

  const { gaps } = buildAndWrite({ writeCoverage: false })
  const queue = buildQueue(gaps)

  console.log(
    JSON.stringify(
      {
        phase: 'start',
        queue: queue.length,
        cheapModels,
        smartModels: SKIP_SMART ? [] : smartModels,
        dryRun: DRY_RUN
      },
      null,
      2
    )
  )

  const catalog = loadJson(CATALOG_PATH)
  const byId = Object.fromEntries(catalog.plugins.map((p) => [p.id, p]))
  const known = loadKnownSources()
  const promotions = []
  const escalationLog = []
  const stats = {
    flashCalls: 0,
    heuristicHits: 0,
    hits: 0,
    cheapHits: 0,
    smartHits: 0,
    rejects: 0,
    escalations: 0,
    smartResolved: 0,
    quotaErrors: 0,
    skippedLoginWall: 0,
    tokens: 0,
    byModel: {},
    disabledModels: []
  }

  let writeLock = Promise.resolve()
  const withWriteLock = (fn) => {
    writeLock = writeLock.then(fn, fn)
    return writeLock
  }

  const recordHit = async (gap, result) => {
    stats.hits++
    if (String(result.via).startsWith('smart:')) stats.smartHits++
    else stats.cheapHits++
    console.log(
      `  ✓ [${result.via}] ${gap.manufacturer} / ${gap.product}: ${result.version} @ ${result.sourceUrl}`
    )
    if (DRY_RUN) return
    await withWriteLock(async () => {
      const plugin = byId[gap.pluginId]
      if (plugin) markVerified(plugin, result.version, result.sourceUrl, result.via)
      promotions.push({
        manufacturerId: gap.manufacturerId,
        url: result.sourceUrl,
        kind: 'release-notes',
        label: `${gap.manufacturer} flash`,
        nameIncludes: gap.product,
        lastVersion: result.version,
        lastVerifiedAt: new Date().toISOString().slice(0, 10),
        addedBy: 'discovery'
      })
      // Flush periodically so long runs keep progress
      if (stats.hits % 25 === 0) {
        catalog.updatedAt = new Date().toISOString()
        catalog.catalogSource = 'flash-extract-parallel'
        writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
      }
    })
  }

  const escalateQ = new AsyncQueue()
  let workIdx = 0
  const nextGap = () => {
    if (workIdx >= queue.length) return null
    return queue[workIdx++]
  }
  const requeueFront = (gap) => {
    queue.splice(workIdx, 0, gap)
  }

  const activeCheap = new Set(cheapModels)
  const activeSmart = new Set(smartModels)
  const unresolved = []
  function unresolvedPush(item) {
    unresolved.push({
      pluginId: item.gap.pluginId,
      product: item.gap.product,
      manufacturer: item.gap.manufacturer,
      reason: item.reason,
      fromModel: item.fromModel
    })
  }

  async function cheapWorker(model) {
    let calls = 0
    const budget = budgetFor(model, CHEAP_BUDGET)
    console.log(`cheap-worker ${model}: budget=${budget} rpm=${CHEAP_RPM}`)
    while (activeCheap.has(model)) {
      if (calls >= budget) {
        console.warn(`  ${model}: cheap budget reached (${budget})`)
        break
      }
      const gap = nextGap()
      if (!gap) break

      const result = await verifyWithModel({
        tier: 'cheap',
        model,
        rpm: CHEAP_RPM,
        gap,
        known,
        stats
      })

      if (result.disableModel) {
        activeCheap.delete(model)
        stats.disabledModels.push(model)
        console.warn(`  disabling cheap ${model}: ${result.reason}`)
        if (activeCheap.size) requeueFront(gap)
        else if (result.escalate && !SKIP_SMART) {
          stats.escalations++
          escalateQ.push({
            gap,
            reason: result.reason,
            sourceUrl: result.meta?.sourceUrl,
            snippet: result.meta?.snippet,
            pageText: result.meta?.pageText,
            fromModel: model
          })
        }
        break
      }

      calls++
      if (result.ok) {
        await recordHit(gap, result)
        continue
      }
      console.log(`  ✗ [cheap:${model}] ${gap.manufacturer} / ${gap.product}: ${result.reason}`)
      if (result.escalate && !SKIP_SMART) {
        stats.escalations++
        escalationLog.push({
          pluginId: gap.pluginId,
          product: gap.product,
          manufacturer: gap.manufacturer,
          reason: result.reason,
          fromModel: model,
          sourceUrl: result.meta?.sourceUrl || null
        })
        escalateQ.push({
          gap,
          reason: result.reason,
          sourceUrl: result.meta?.sourceUrl,
          snippet: result.meta?.snippet,
          pageText: result.meta?.pageText,
          fromModel: model
        })
      }
    }
  }

  async function smartWorker(model) {
    let calls = 0
    const budget = budgetFor(model, SMART_BUDGET)
    console.log(`smart-worker ${model}: budget=${budget} rpm=${SMART_RPM}`)
    while (activeSmart.has(model)) {
      const item = await escalateQ.take()
      if (!item) break
      if (calls >= budget) {
        unresolvedPush(item)
        console.warn(`  ${model}: smart budget reached`)
        activeSmart.delete(model)
        break
      }
      const { gap, reason, sourceUrl, snippet, pageText, fromModel } = item
      const plugin = byId[gap.pluginId]
      if (
        plugin &&
        (plugin.versionEvidence === 'page-confirmed' || plugin.versionEvidence === 'agent-verified')
      ) {
        continue
      }
      const result = await verifyWithModel({
        tier: 'smart',
        model,
        rpm: SMART_RPM,
        gap,
        known,
        stats,
        priorReason: `${reason} via ${fromModel}`,
        preferredUrl: sourceUrl,
        cachedSnippet: snippet,
        cachedPageText: pageText
      })
      if (result.disableModel) {
        activeSmart.delete(model)
        stats.disabledModels.push(model)
        console.warn(`  disabling smart ${model}: ${result.reason}`)
        escalateQ.push(item)
        break
      }
      calls++
      if (result.ok) {
        stats.smartResolved++
        await recordHit(gap, result)
      } else {
        console.log(`  ✗ [smart:${model}] ${gap.manufacturer} / ${gap.product}: ${result.reason}`)
      }
    }
  }

  const smartPromise =
    !SKIP_SMART && smartModels.length
      ? Promise.all(smartModels.map((m) => smartWorker(m)))
      : Promise.resolve()

  await Promise.all(cheapModels.map((m) => cheapWorker(m)))
  escalateQ.close()
  await smartPromise

  while (escalateQ.size) {
    const item = escalateQ.items.shift()
    if (item) unresolvedPush(item)
  }

  if (!DRY_RUN && (stats.hits || promotions.length)) {
    catalog.updatedAt = new Date().toISOString()
    catalog.catalogSource = 'flash-extract-parallel'
    writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
    if (promotions.length) {
      mergeDiscoveredSources(known, promotions)
      saveKnownSources(known)
    }
  }

  const escalationDoc = {
    schemaVersion: 1,
    kind: 'flash-escalation-log',
    generatedAt: new Date().toISOString(),
    escalated: escalationLog,
    unresolved
  }
  writeFileSync(ESCALATION_PATH, `${JSON.stringify(escalationDoc, null, 2)}\n`)

  const usage = loadJson(USAGE_PATH, { schemaVersion: 1, runs: [] })
  usage.flash = {
    updatedAt: new Date().toISOString(),
    lastTokens: stats.tokens,
    lastCalls: stats.flashCalls,
    lastHits: stats.hits,
    byModel: stats.byModel,
    escalations: stats.escalations,
    smartResolved: stats.smartResolved
  }
  usage.runs = (usage.runs || []).slice(-60)
  usage.runs.push({
    at: new Date().toISOString(),
    kind: 'flash-extract-parallel',
    tokens: stats.tokens,
    flashCalls: stats.flashCalls,
    heuristicHits: stats.heuristicHits,
    successes: stats.hits,
    cheapHits: stats.cheapHits,
    smartHits: stats.smartHits,
    escalations: stats.escalations,
    smartResolved: stats.smartResolved,
    rejects: stats.rejects,
    quotaErrors: stats.quotaErrors,
    byModel: stats.byModel,
    disabledModels: stats.disabledModels
  })
  writeFileSync(USAGE_PATH, `${JSON.stringify(usage, null, 2)}\n`)
  buildAndWrite({ writeCoverage: false })

  const summary = {
    ok: true,
    ...stats,
    dryRun: DRY_RUN,
    unresolved: unresolved.length,
    hint: 'Cheap Lite buckets (~500 RPD each) + small smart Flash budgets; Antigravity/Pro excluded'
  }
  console.log(JSON.stringify(summary, null, 2))
  return summary
}

module.exports = { main }

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
