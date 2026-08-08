#!/usr/bin/env node
/** Shared catalog paths for smart-scrub scripts. */
const { resolve } = require('node:path')

const ROOT = resolve(__dirname, '../../..')

module.exports = {
  ROOT,
  CATALOG_PATH: resolve(ROOT, 'catalog/catalog.json'),
  KNOWN_SOURCES_PATH: resolve(ROOT, 'catalog/known-sources.json'),
  GAP_QUEUE_PATH: resolve(ROOT, 'catalog/gap-queue.json'),
  COVERAGE_REPORT_PATH: resolve(ROOT, 'catalog/coverage-report.json'),
  EXPORT_PATH: resolve(ROOT, 'catalog/antigravity-export.json'),
  CURSOR_PATH: resolve(ROOT, 'catalog/antigravity-cursor.json'),
  USAGE_PATH: resolve(ROOT, 'catalog/antigravity-usage.json'),
  ESCALATION_PATH: resolve(ROOT, 'catalog/flash-escalation.json')
}
