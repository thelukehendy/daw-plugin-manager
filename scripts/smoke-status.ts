import '../src/main/registerNodePlatform'
import {
  buildCatalogBrowseRows,
  decideStatus,
  loadCatalog,
} from '../src/main/catalog/catalogService'
import { bandFromScore, HIGH, MEDIUM } from '../src/main/catalog/confidence'
import { compareVersions, normalizeVersion } from '../src/main/catalog/versionCompare'

async function main() {
  console.log('semver 1.9 vs 1.10 →', compareVersions('1.9', '1.10', 'semver'))
  console.log('date normalize →', normalizeVersion('2026-09-05-2a6d1c0', 'date'))
  console.log('bands', bandFromScore(90), bandFromScore(75), bandFromScore(60), {
    HIGH,
    MEDIUM,
  })

  const catalog = await loadCatalog({ preferBundled: true })
  const m = (id: string) => catalog.manufacturers.find((x) => x.id === id) || null

  const fab = catalog.plugins.find(
    (p) => p.id.includes('fabfilter') && p.latestVersion && (p.versionConfidence || 0) >= 85
  )
  const yellow = catalog.plugins.find(
    (p) =>
      p.latestVersion &&
      (p.versionConfidence || 0) < 70 &&
      (!p.identityKind || p.identityKind === 'plugin')
  )
  const content = catalog.plugins.find((p) => p.identityKind === 'soundset')
  const hubApp = catalog.plugins.find((p) => p.identityKind === 'hub_app')
  const paidAmbiguous = catalog.plugins.find(
    (p) => p.identityKind === 'gen_ambiguous' && p.successorPluginId
  )
  const noVer = catalog.plugins.find(
    (p) =>
      !p.latestVersion &&
      (!p.identityKind || p.identityKind === 'plugin') &&
      !p.discontinued
  )

  if (!fab || !yellow || !content) {
    throw new Error('fixture plugins missing from catalog')
  }

  const checks: Array<[string, string]> = [
    [
      'green outdated',
      decideStatus({
        plugin: fab,
        manufacturer: m(fab.manufacturerId),
        installedVersion: '0.0.1',
      }),
    ],
    [
      'green current',
      decideStatus({
        plugin: fab,
        manufacturer: m(fab.manufacturerId),
        installedVersion: fab.latestVersion!,
      }),
    ],
    [
      'yellow behind',
      decideStatus({
        plugin: yellow,
        manufacturer: m(yellow.manufacturerId),
        installedVersion: '0.0.1',
      }),
    ],
    [
      'content',
      decideStatus({
        plugin: content,
        manufacturer: m(content.manufacturerId),
        installedVersion: null,
        catalogOnly: true,
      }),
    ],
  ]

  if (hubApp) {
    checks.push([
      'hub app',
      decideStatus({
        plugin: { ...hubApp, latestVersion: undefined },
        manufacturer: m(hubApp.manufacturerId),
        installedVersion: null,
        catalogOnly: true,
      }),
    ])
  }
  if (paidAmbiguous) {
    checks.push([
      'paid gen_ambiguous',
      decideStatus({
        plugin: paidAmbiguous,
        manufacturer: m(paidAmbiguous.manufacturerId),
        installedVersion: null,
        catalogOnly: true,
      }),
    ])
  }

  if (noVer) {
    checks.push([
      'missing latest',
      decideStatus({
        plugin: noVer,
        manufacturer: m(noVer.manufacturerId),
        installedVersion: '1.0',
      }),
    ])
  }

  for (const [label, status] of checks) {
    console.log(label, '→', status)
  }

  if (checks.find(([l]) => l === 'green outdated')?.[1] !== 'update_available') {
    throw new Error('expected update_available for green outdated')
  }
  if (checks.find(([l]) => l === 'green current')?.[1] !== 'current') {
    throw new Error('expected current for green equal')
  }
  const yb = checks.find(([l]) => l === 'yellow behind')?.[1]
  if (yb === 'update_available') {
    throw new Error('yellow must never be update_available')
  }
  if (checks.find(([l]) => l === 'content')?.[1] !== 'content') {
    throw new Error('expected content identity')
  }
  if (hubApp && checks.find(([l]) => l === 'hub app')?.[1] !== 'use_vendor_hub') {
    throw new Error('expected use_vendor_hub for hub app without version')
  }
  if (
    paidAmbiguous &&
    checks.find(([l]) => l === 'paid gen_ambiguous')?.[1] !== 'paid_upgrade'
  ) {
    throw new Error('expected paid_upgrade for gen_ambiguous successor')
  }

  const rows = buildCatalogBrowseRows(catalog)
  const invented = rows.filter((r) => r.latestVersion === 'unknown')
  if (invented.length) throw new Error('must not invent latestVersion string unknown in data')

  console.log('browse rows', rows.length)
  console.log('status logic OK')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
