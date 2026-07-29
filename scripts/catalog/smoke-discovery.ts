import { readFileSync } from 'fs'
import { discoverPublicVersions } from './discovery'
import type { PluginCatalog } from '../../src/shared/types'

async function main() {
  const catalog = JSON.parse(readFileSync('catalog/catalog.json', 'utf8')) as PluginCatalog
  const r = await discoverPublicVersions(catalog)
  console.log(JSON.stringify(r.stats, null, 2))
  for (const u of r.updates.slice(0, 25)) {
    console.log(`- ${u.manufacturerId}: ${u.label || u.nameIncludes} = ${u.latestVersion} @ ${u.sourceUrl}`)
  }
  if (r.errors.length) {
    console.log('errors:')
    for (const e of r.errors.slice(0, 15)) console.log(' ', e)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
