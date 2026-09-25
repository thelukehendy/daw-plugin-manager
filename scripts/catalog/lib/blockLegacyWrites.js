#!/usr/bin/env node
/**
 * Hard stop for legacy catalog writers.
 * Version authority is store-export only (Coding Assistant / Grok Bot SQLite → published catalog.json).
 * Set ALLOW_LEGACY_CATALOG_WRITE=1 only for deliberate archival experiments — never for shipping.
 */
function assertLegacyCatalogWritesAllowed(scriptName) {
  if (process.env.ALLOW_LEGACY_CATALOG_WRITE === '1') {
    console.warn(
      `[${scriptName}] ALLOW_LEGACY_CATALOG_WRITE=1 — legacy writer unlocked (not for production catalog).`
    )
    return
  }
  console.error(`
┌──────────────────────────────────────────────────────────────────────────┐
│ BLOCKED: legacy catalog writer "${scriptName}"                            │
│                                                                          │
│ catalog/catalog.json is store-export only (Grok Bot / Coding Assistant). │
│ Scrapers, Flash, Antigravity, sticky-reverify, and discovery must NOT    │
│ write latestVersion into the published catalog.                          │
│                                                                          │
│ To override (dev/archive only): ALLOW_LEGACY_CATALOG_WRITE=1             │
└──────────────────────────────────────────────────────────────────────────┘
`)
  process.exit(1)
}

module.exports = { assertLegacyCatalogWritesAllowed }
