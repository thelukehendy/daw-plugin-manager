import { readFileSync } from 'fs'
import { join } from 'path'
import type { PluginCatalog } from '../src/shared/types'

const path = join(process.cwd(), 'catalog/catalog.json')
const catalog = JSON.parse(readFileSync(path, 'utf8')) as PluginCatalog

if (!catalog.schemaVersion) throw new Error('Missing schemaVersion')
if (!Array.isArray(catalog.manufacturers) || catalog.manufacturers.length === 0) {
  throw new Error('No manufacturers')
}
if (!Array.isArray(catalog.plugins) || catalog.plugins.length === 0) {
  throw new Error('No plugins')
}

const mfgIds = new Set(catalog.manufacturers.map((m) => m.id))
for (const plugin of catalog.plugins) {
  if (!mfgIds.has(plugin.manufacturerId)) {
    throw new Error(`Plugin ${plugin.id} references missing manufacturer ${plugin.manufacturerId}`)
  }
  if (!plugin.latestVersion) throw new Error(`Plugin ${plugin.id} missing latestVersion`)
  if (!plugin.matchPatterns?.length) throw new Error(`Plugin ${plugin.id} missing matchPatterns`)
}

for (const m of catalog.manufacturers) {
  if (!m.updatePortalUrl?.startsWith('http')) {
    throw new Error(`Manufacturer ${m.id} missing http(s) updatePortalUrl`)
  }
}

console.log(
  `Catalog OK: ${catalog.manufacturers.length} manufacturers, ${catalog.plugins.length} plugins (updated ${catalog.updatedAt})`
)
