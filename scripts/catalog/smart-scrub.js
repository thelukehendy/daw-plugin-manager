#!/usr/bin/env node
/**
 * Accuracy-first smart scrub orchestrator.
 *
 * 1) Build gap queue + coverage
 * 2) Sticky-URL reverify (cheap, no Gemini)
 * 3) Antigravity cold discovery (adaptive free-tier batch)
 * 4) Write coverage-report.json with run metrics
 *
 * Env:
 *   STICKY_LIMIT
 *   ANTIGRAVITY_BATCH_SIZE / adaptive via antigravity-usage.json
 *   SMART_SCRUB_SKIP_ANTIGRAVITY=1  — sticky/gaps only
 *   ANTIGRAVITY_DRY_RUN / STICKY_DRY_RUN
 *   GEMINI_API_KEY — required unless skip antigravity
 */
const { writeFileSync } = require('node:fs')
const { COVERAGE_REPORT_PATH, USAGE_PATH } = require('./lib/paths')
const { buildAndWrite, loadJson } = require('./lib/gapQueue')
const sticky = require('./sticky-reverify')
const antigravity = require('./antigravity-scrub')

async function main() {
  const skipAgent = process.env.SMART_SCRUB_SKIP_ANTIGRAVITY === '1'
  console.log('=== smart-scrub: gap queue ===')
  const before = buildAndWrite({ writeCoverage: false })
  console.log(
    JSON.stringify(
      {
        pending: before.coverage.pending_unverified,
        verified_within_7d: before.coverage.verified_within_7d,
        sticky_eligible: before.coverage.sticky_eligible,
        cold_eligible: before.coverage.cold_eligible
      },
      null,
      2
    )
  )

  console.log('=== smart-scrub: sticky reverify ===')
  const stickySummary = await sticky.main()

  let agentSummary = {
    antigravity_hits: 0,
    page_confirm_rejects: 0,
    tokens_used: 0,
    next_batch_size: loadJson(USAGE_PATH, { nextBatchSize: 8 }).nextBatchSize || 8,
    skipped: skipAgent
  }

  if (skipAgent) {
    console.log('=== smart-scrub: antigravity skipped (SMART_SCRUB_SKIP_ANTIGRAVITY=1) ===')
  } else {
    console.log('=== smart-scrub: antigravity cold ===')
    agentSummary = (await antigravity.main()) || agentSummary
  }

  const after = buildAndWrite({ writeCoverage: false })
  const report = {
    schemaVersion: 1,
    kind: 'catalog-coverage-report',
    ...after.coverage,
    run: {
      at: new Date().toISOString(),
      sticky_hits: stickySummary?.sticky_hits || 0,
      sticky_rejects: stickySummary?.sticky_rejects || 0,
      antigravity_hits: agentSummary.antigravity_hits || 0,
      page_confirm_rejects: agentSummary.page_confirm_rejects || 0,
      tokens_used: agentSummary.tokens_used || 0,
      next_batch_size: agentSummary.next_batch_size ?? null,
      antigravity_skipped: Boolean(agentSummary.skipped)
    }
  }
  writeFileSync(COVERAGE_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)

  console.log('=== smart-scrub: summary ===')
  console.log(
    JSON.stringify(
      {
        plugins_total: report.plugins_total,
        verified_strong: report.verified_strong,
        verified_within_7d: report.verified_within_7d,
        pending_unverified: report.pending_unverified,
        sticky_hits: report.run.sticky_hits,
        antigravity_hits: report.run.antigravity_hits,
        page_confirm_rejects: report.run.page_confirm_rejects,
        tokens_used: report.run.tokens_used,
        next_batch_size: report.run.next_batch_size
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
