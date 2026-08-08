#!/usr/bin/env node
/**
 * Accuracy-first smart scrub orchestrator.
 *
 * 1) Build gap queue + coverage
 * 2) Sticky-URL reverify (cheap, no Gemini) → page-confirmed
 * 3) Flash Lite extract + page-confirm (primary Gemini path, ~500 RPD free)
 * 4) Antigravity cold discovery (last resort; skip by default unless enabled)
 * 5) Write coverage-report.json with run metrics
 *
 * Env:
 *   STICKY_LIMIT
 *   FLASH_LIMIT / FLASH_RPM / FLASH_MODEL
 *   SMART_SCRUB_SKIP_FLASH=1
 *   SMART_SCRUB_ENABLE_ANTIGRAVITY=1  — opt-in rare cold path
 *   SMART_SCRUB_SKIP_ANTIGRAVITY=1    — force skip (default when not enabled)
 *   ANTIGRAVITY_BATCH_SIZE / adaptive via antigravity-usage.json
 *   ANTIGRAVITY_DRY_RUN / STICKY_DRY_RUN / FLASH_DRY_RUN
 *   GEMINI_API_KEY — required unless skip flash (+ antigravity)
 */
const { writeFileSync } = require('node:fs')
const { COVERAGE_REPORT_PATH, USAGE_PATH } = require('./lib/paths')
const { buildAndWrite, loadJson } = require('./lib/gapQueue')
const sticky = require('./sticky-reverify')
const flash = require('./flash-extract')
const antigravity = require('./antigravity-scrub')

async function main() {
  const skipFlash = process.env.SMART_SCRUB_SKIP_FLASH === '1'
  const enableAgent = process.env.SMART_SCRUB_ENABLE_ANTIGRAVITY === '1'
  const skipAgent =
    process.env.SMART_SCRUB_SKIP_ANTIGRAVITY === '1' || !enableAgent

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

  let flashSummary = {
    hits: 0,
    flashCalls: 0,
    heuristicHits: 0,
    rejects: 0,
    tokens: 0,
    skipped: skipFlash
  }

  if (skipFlash) {
    console.log('=== smart-scrub: flash skipped (SMART_SCRUB_SKIP_FLASH=1) ===')
  } else {
    console.log('=== smart-scrub: flash extract ===')
    flashSummary = (await flash.main()) || flashSummary
  }

  let agentSummary = {
    antigravity_hits: 0,
    page_confirm_rejects: 0,
    tokens_used: 0,
    next_batch_size: loadJson(USAGE_PATH, { nextBatchSize: 8 }).nextBatchSize || 8,
    skipped: skipAgent
  }

  if (skipAgent) {
    console.log(
      enableAgent
        ? '=== smart-scrub: antigravity skipped (SMART_SCRUB_SKIP_ANTIGRAVITY=1) ==='
        : '=== smart-scrub: antigravity skipped (opt-in via SMART_SCRUB_ENABLE_ANTIGRAVITY=1) ==='
    )
  } else {
    console.log('=== smart-scrub: antigravity cold (last resort) ===')
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
      flash_hits: flashSummary.hits || 0,
      flash_calls: flashSummary.flashCalls || 0,
      flash_heuristic_hits: flashSummary.heuristicHits || 0,
      flash_rejects: flashSummary.rejects || 0,
      flash_tokens: flashSummary.tokens || 0,
      flash_skipped: Boolean(flashSummary.skipped),
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
        flash_hits: report.run.flash_hits,
        flash_calls: report.run.flash_calls,
        antigravity_hits: report.run.antigravity_hits,
        page_confirm_rejects: report.run.page_confirm_rejects,
        tokens_used: report.run.tokens_used,
        flash_tokens: report.run.flash_tokens
      },
      null,
      2
    )
  )
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = { main }