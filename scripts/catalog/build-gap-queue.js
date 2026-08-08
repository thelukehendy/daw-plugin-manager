#!/usr/bin/env node
/**
 * CLI: build catalog/gap-queue.json + catalog/coverage-report.json
 * Usage: node scripts/catalog/build-gap-queue.js
 */
const { buildAndWrite } = require('./lib/gapQueue')

const result = buildAndWrite({ freshDays: Number(process.env.CATALOG_FRESH_DAYS || 7) })
const c = result.coverage
console.log(
  JSON.stringify(
    {
      plugins_total: c.plugins_total,
      verified_strong: c.verified_strong,
      verified_within_7d: c.verified_within_7d,
      pending_unverified: c.pending_unverified,
      sticky_eligible: c.sticky_eligible,
      cold_eligible: c.cold_eligible,
      top_pending_manufacturers: (c.pending_manufacturers || []).slice(0, 12)
    },
    null,
    2
  )
)
