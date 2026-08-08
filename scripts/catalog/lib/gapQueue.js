#!/usr/bin/env node
/**
 * Build prioritized gap queue + coverage metrics from catalog.json.
 */
const { readFileSync, writeFileSync, existsSync } = require('node:fs')
const { CATALOG_PATH, KNOWN_SOURCES_PATH, GAP_QUEUE_PATH, COVERAGE_REPORT_PATH } = require('./paths')

const STRONG_EVIDENCE = new Set(['agent-verified'])
const SCRAPER_EVIDENCE = new Set(['live-scrape', 'public-page', 'manufacturer-feed'])
const WEAK_EVIDENCE = new Set(['search-verified', 'curated-seed', 'unverified-seed'])

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback
  return JSON.parse(readFileSync(path, 'utf8'))
}

function daysSince(dateStr) {
  if (!dateStr) return null
  try {
    const dt =
      dateStr.includes('T')
        ? new Date(dateStr)
        : new Date(`${dateStr}T00:00:00.000Z`)
    if (Number.isNaN(dt.getTime())) return null
    return Math.floor((Date.now() - dt.getTime()) / 86400000)
  } catch {
    return null
  }
}

function buildGapQueue(catalog, knownSources, { freshDays = 7 } = {}) {
  const mfr = Object.fromEntries((catalog.manufacturers || []).map((m) => [m.id, m]))
  const stickyByMfr = new Map()
  for (const s of knownSources.sources || []) {
    if (!stickyByMfr.has(s.manufacturerId)) stickyByMfr.set(s.manufacturerId, [])
    stickyByMfr.get(s.manufacturerId).push(s)
  }

  const items = []
  for (const p of catalog.plugins || []) {
    const manufacturer = mfr[p.manufacturerId] || {}
    const evidence = p.versionEvidence || 'unverified-seed'
    const ageDays = daysSince(p.versionVerifiedAt)
    const stickyUrls = []
    if (p.versionSourceUrl) stickyUrls.push(p.versionSourceUrl)
    for (const s of stickyByMfr.get(p.manufacturerId) || []) {
      if (!s.url) continue
      // Only product-scoped known sources count as sticky (avoid cross-product false matches)
      if (s.nameIncludes) {
        const a = String(s.nameIncludes).toLowerCase()
        const b = String(p.name).toLowerCase()
        if (b.includes(a) || a.includes(b)) {
          if (!stickyUrls.includes(s.url)) stickyUrls.push(s.url)
        }
      }
    }
    const portalUrl =
      p.updatePortalUrl || manufacturer.updatePortalUrl || manufacturer.websiteUrl || null

    let priority = 99
    let reason = 'ok'
    const strongFresh =
      STRONG_EVIDENCE.has(evidence) && p.versionSourceUrl && ageDays != null && ageDays <= freshDays

    if (!p.versionSourceUrl || evidence === 'unverified-seed' || !evidence) {
      priority = 1
      reason = 'unverified_or_missing_source'
    } else if (evidence !== 'agent-verified' && SCRAPER_EVIDENCE.has(evidence)) {
      // Deterministic scrape / sticky exists, but Antigravity has not confirmed yet
      priority = 2
      reason = 'awaiting_agent_confirmation'
    } else if (ageDays == null || ageDays > freshDays) {
      priority = 2
      reason = 'stale_gt_7d'
    } else if (WEAK_EVIDENCE.has(evidence) && stickyUrls.length === 0) {
      priority = 3
      reason = 'weak_evidence_no_sticky'
    } else if (strongFresh) {
      priority = 100
      reason = 'fresh_strong'
    } else {
      priority = 4
      reason = 'other'
    }

    // Sticky path only when we have a product-associated URL to re-fetch
    const path = stickyUrls.length ? 'sticky' : 'cold'
    items.push({
      pluginId: p.id,
      manufacturerId: p.manufacturerId,
      manufacturer: manufacturer.name || p.manufacturerId,
      product: p.name,
      latestVersion: p.latestVersion || null,
      versionEvidence: evidence,
      versionSourceUrl: p.versionSourceUrl || null,
      versionVerifiedAt: p.versionVerifiedAt || null,
      ageDays,
      portalUrl,
      stickyUrls,
      path,
      priority,
      reason
    })
  }

  // Manufacturer-first: within same priority, larger pending manufacturers first, then name
  const pendingByMfr = new Map()
  for (const it of items) {
    if (it.priority <= 3) {
      pendingByMfr.set(it.manufacturerId, (pendingByMfr.get(it.manufacturerId) || 0) + 1)
    }
  }

  const gaps = items
    .filter((it) => it.priority <= 3)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      const ca = pendingByMfr.get(a.manufacturerId) || 0
      const cb = pendingByMfr.get(b.manufacturerId) || 0
      if (ca !== cb) return cb - ca
      return (
        a.manufacturer.localeCompare(b.manufacturer) ||
        a.product.localeCompare(b.product)
      )
    })

  const coverage = summarizeCoverage(items, catalog, freshDays)
  return { gaps, items, coverage, pendingByMfr }
}

function summarizeCoverage(items, catalog, freshDays) {
  const byEvidence = {}
  const byReason = {}
  const byManufacturer = {}
  let verifiedStrong = 0
  let verifiedWithin7d = 0
  let pendingUnverified = 0
  let stickyEligible = 0
  let coldEligible = 0

  for (const it of items) {
    byEvidence[it.versionEvidence] = (byEvidence[it.versionEvidence] || 0) + 1
    byReason[it.reason] = (byReason[it.reason] || 0) + 1
    if (!byManufacturer[it.manufacturer]) {
      byManufacturer[it.manufacturer] = {
        total: 0,
        pending: 0,
        freshStrong: 0,
        sticky: 0,
        cold: 0
      }
    }
    const row = byManufacturer[it.manufacturer]
    row.total++
    if (it.priority <= 3) {
      row.pending++
      pendingUnverified++
      if (it.path === 'sticky') {
        stickyEligible++
        row.sticky++
      } else {
        coldEligible++
        row.cold++
      }
    }
    if (
      STRONG_EVIDENCE.has(it.versionEvidence) &&
      it.versionSourceUrl
    ) {
      verifiedStrong++
    }
    if (
      SCRAPER_EVIDENCE.has(it.versionEvidence) &&
      it.versionSourceUrl
    ) {
      // counted separately below via by_evidence
    }
    if (
      STRONG_EVIDENCE.has(it.versionEvidence) &&
      it.versionSourceUrl &&
      it.ageDays != null &&
      it.ageDays <= freshDays
    ) {
      verifiedWithin7d++
      row.freshStrong++
    }
  }

  const pendingMfrs = Object.entries(byManufacturer)
    .filter(([, v]) => v.pending > 0)
    .sort((a, b) => b[1].pending - a[1].pending)
    .map(([name, v]) => ({ manufacturer: name, ...v }))

  return {
    generatedAt: new Date().toISOString(),
    freshDays,
    plugins_total: (catalog.plugins || []).length,
    manufacturers_total: (catalog.manufacturers || []).length,
    verified_strong: verifiedStrong,
    verified_within_7d: verifiedWithin7d,
    pending_unverified: pendingUnverified,
    sticky_eligible: stickyEligible,
    cold_eligible: coldEligible,
    by_evidence: byEvidence,
    by_reason: byReason,
    pending_manufacturers: pendingMfrs
  }
}

function writeGapArtifacts(result, { writeCoverage = true } = {}) {
  const doc = {
    schemaVersion: 1,
    kind: 'catalog-gap-queue',
    generatedAt: new Date().toISOString(),
    counts: {
      gaps: result.gaps.length,
      sticky: result.gaps.filter((g) => g.path === 'sticky').length,
      cold: result.gaps.filter((g) => g.path === 'cold').length
    },
    coverage: result.coverage,
    gaps: result.gaps
  }
  writeFileSync(GAP_QUEUE_PATH, `${JSON.stringify(doc, null, 2)}\n`)
  if (writeCoverage) {
    writeFileSync(
      COVERAGE_REPORT_PATH,
      `${JSON.stringify(
        {
          schemaVersion: 1,
          kind: 'catalog-coverage-report',
          ...result.coverage,
          run: {
            sticky_hits: 0,
            antigravity_hits: 0,
            page_confirm_rejects: 0,
            tokens_used: 0,
            next_batch_size: null
          }
        },
        null,
        2
      )}\n`
    )
  }
  return doc
}

function buildAndWrite(options = {}) {
  const catalog = loadJson(CATALOG_PATH)
  const known = loadJson(KNOWN_SOURCES_PATH, { schemaVersion: 1, sources: [] })
  const result = buildGapQueue(catalog, known, options)
  const doc = writeGapArtifacts(result, options)
  return { ...result, doc }
}

module.exports = {
  STRONG_EVIDENCE,
  SCRAPER_EVIDENCE,
  WEAK_EVIDENCE,
  loadJson,
  daysSince,
  buildGapQueue,
  summarizeCoverage,
  writeGapArtifacts,
  buildAndWrite
}
