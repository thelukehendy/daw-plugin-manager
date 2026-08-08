#!/usr/bin/env node
/**
 * Sticky-URL fast path: re-verify gap plugins that already have a known public URL.
 * No Antigravity / Gemini tokens. Accuracy gate requires version on page.
 *
 * Env:
 *   STICKY_LIMIT     default 40
 *   STICKY_DRY_RUN   "1" = no catalog writes
 */
const { readFileSync, writeFileSync } = require('node:fs')
const { CATALOG_PATH } = require('./lib/paths')
const { buildAndWrite, loadJson } = require('./lib/gapQueue')
const {
  fetchPageText,
  extractVersionsFromHtml,
  versionAppearsOnPage,
  normalizeVersion,
  isSuspiciousVersion,
  assertPortalUrl
} = require('./lib/accuracyGate')
const { loadKnownSources, saveKnownSources, mergeDiscoveredSources } = require('./lib/knownSourcesJs')

const LIMIT = Math.max(1, Number(process.env.STICKY_LIMIT || 200))
const DRY_RUN = process.env.STICKY_DRY_RUN === '1'

function markVerified(plugin, version, sourceUrl) {
  plugin.latestVersion = normalizeVersion(version)
  plugin.versionEvidence = 'page-confirmed'
  plugin.versionSourceUrl = sourceUrl
  plugin.versionVerifiedAt = new Date().toISOString().slice(0, 10)
  plugin.updatePortalUrl = plugin.updatePortalUrl || sourceUrl
  const stamp = `verifiedPublic:${plugin.latestVersion}@${sourceUrl}`
  const notes = (plugin.notes || '').replace(/\s*verifiedPublic:\S+/g, '').trim()
  plugin.notes = notes ? `${notes} ${stamp}` : stamp
}

async function reverifyOne(gap, knownSources) {
  const urls = []
  if (gap.versionSourceUrl) urls.push(gap.versionSourceUrl)
  // Only use known-sources URLs that are product-scoped (nameIncludes) or exact product match
  for (const s of knownSources.sources || []) {
    if (s.manufacturerId !== gap.manufacturerId || !s.url) continue
    if (s.nameIncludes) {
      const a = String(s.nameIncludes).toLowerCase()
      const b = String(gap.product).toLowerCase()
      if (!(b.includes(a) || a.includes(b))) continue
    } else {
      // manufacturer-wide sticky without nameIncludes: skip for sticky fast path
      continue
    }
    if (!urls.includes(s.url)) urls.push(s.url)
  }
  if (!urls.length) return { ok: false, reason: 'no_product_scoped_sticky_url', cold: true }

  let lastReason = 'extract_failed'
  for (const url of urls.slice(0, 4)) {
    try {
      assertPortalUrl(url)
      const page = await fetchPageText(url)
      const candidates = extractVersionsFromHtml(page.text, { nameHint: gap.product })
      // Prefer keeping existing version if still on page (freshness renew)
      const ordered = []
      if (gap.latestVersion) ordered.push(normalizeVersion(gap.latestVersion))
      for (const c of candidates) {
        const n = normalizeVersion(c)
        if (!ordered.includes(n)) ordered.push(n)
      }
      for (const ver of ordered.slice(0, 6)) {
        if (!ver || isSuspiciousVersion(ver)) continue
        if (versionAppearsOnPage(page.text, ver)) {
          // Require product name on page when renewing from shared URLs
          if (!page.text.toLowerCase().includes(String(gap.product).toLowerCase())) {
            const short = String(gap.product).toLowerCase().replace(/^(izotope|fabfilter|goodhertz)\s+/i, '')
            if (short.length < 4 || !page.text.toLowerCase().includes(short)) {
              lastReason = 'product_name_not_on_page'
              continue
            }
          }
          return {
            ok: true,
            version: normalizeVersion(ver),
            sourceUrl: page.url || url,
            pluginId: gap.pluginId,
            manufacturerId: gap.manufacturerId,
            product: gap.product
          }
        }
        lastReason = `version ${ver} not found on page`
      }
      lastReason = `no_confirmable_version_on ${url}`
    } catch (err) {
      lastReason = err.message || String(err)
    }
  }
  return { ok: false, reason: lastReason, cold: true, pluginId: gap.pluginId }
}

async function main() {
  const { gaps } = buildAndWrite({ writeCoverage: false })
  const stickyGaps = gaps.filter((g) => g.path === 'sticky').slice(0, LIMIT)
  console.log(`sticky-reverify: candidates=${stickyGaps.length} limit=${LIMIT} dryRun=${DRY_RUN}`)

  const catalog = loadJson(CATALOG_PATH)
  const byId = Object.fromEntries(catalog.plugins.map((p) => [p.id, p]))
  const known = loadKnownSources()

  let hits = 0
  let rejects = 0
  const cold = []
  const promotions = []

  for (const gap of stickyGaps) {
    const result = await reverifyOne(gap, known)
    if (!result.ok) {
      rejects++
      cold.push(gap.pluginId)
      console.log(`  ✗ ${gap.manufacturer} / ${gap.product}: ${result.reason}`)
      continue
    }
    hits++
    console.log(
      `  ✓ ${gap.manufacturer} / ${gap.product}: ${result.version} @ ${result.sourceUrl}`
    )
    if (!DRY_RUN) {
      const plugin = byId[result.pluginId]
      if (plugin) markVerified(plugin, result.version, result.sourceUrl)
      promotions.push({
        manufacturerId: result.manufacturerId,
        url: result.sourceUrl,
        kind: 'release-notes',
        label: `${gap.manufacturer} sticky`,
        nameIncludes: gap.product,
        lastVersion: result.version,
        lastVerifiedAt: new Date().toISOString().slice(0, 10),
        addedBy: 'discovery'
      })
    }
  }

  if (!DRY_RUN) {
    if (hits) {
      catalog.updatedAt = new Date().toISOString()
      catalog.catalogSource = catalog.catalogSource || 'sticky-reverify'
      writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)
    }
    if (promotions.length) {
      mergeDiscoveredSources(known, promotions)
      saveKnownSources(known)
    }
  }

  const summary = {
    ok: true,
    sticky_hits: hits,
    sticky_rejects: rejects,
    cold_followups: cold.length,
    dryRun: DRY_RUN
  }
  console.log(JSON.stringify(summary, null, 2))
  return summary
}

module.exports = { main, reverifyOne }

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
