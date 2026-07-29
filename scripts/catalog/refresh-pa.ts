import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { scrapePluginAlliance } from './scrapers/pluginAlliance'
import { applyUpdates } from './refresh'
import type { PluginCatalog } from '../../src/shared/types'

async function main() {
  const path = join(process.cwd(), 'catalog/catalog.json')
  const catalog = JSON.parse(readFileSync(path, 'utf8')) as PluginCatalog
  const result = await scrapePluginAlliance()
  console.log('PA rules', result.updates.length, 'errors', result.errors?.length)
  if (result.errors?.length) {
    for (const e of result.errors.slice(0, 20)) console.log(' -', e)
  }
  const changed = applyUpdates(catalog, result.updates)
  catalog.updatedAt = new Date().toISOString()
  const verified = catalog.plugins.filter(
    (p) => p.versionEvidence === 'live-scrape' || p.versionEvidence === 'public-page'
  ).length
  const pa = catalog.plugins.filter((p) => p.manufacturerId === 'plugin-alliance')
  const paV = pa.filter((p) => p.versionEvidence === 'live-scrape').length
  writeFileSync(path, JSON.stringify(catalog, null, 2) + '\n')
  console.log(
    `changed=${changed} verified=${verified}/${catalog.plugins.length} PA=${paV}/${pa.length}`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
