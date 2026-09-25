/**
 * Contract tests: identity kinds, versionScheme canonical-only, popularity COALESCE sort.
 * Run: npx tsx scripts/test-catalog-contracts.ts
 */
import assert from 'assert'
import { decideStatus } from '../src/main/catalog/catalogService'
import { isVersionTrackedKind, resolveIdentityKind } from '../src/main/catalog/identity'
import {
  compareByPopularityThenName,
  effectivePopularityTier,
  popularitySortKey,
} from '../src/main/catalog/popularity'
import { parsePluginCatalog, preferNewerCatalog } from '../src/main/catalog/catalogParse'
import { compareVersions, resolveScheme } from '../src/main/catalog/versionCompare'
import type { CatalogManufacturer, CatalogPlugin } from '../src/shared/types'

function plugin(partial: Partial<CatalogPlugin> & { id: string; name: string }): CatalogPlugin {
  return {
    manufacturerId: 'm',
    matchPatterns: [partial.name],
    ...partial,
  }
}

function mfg(partial: Partial<CatalogManufacturer> & { id: string; name: string }): CatalogManufacturer {
  return {
    updatePortalUrl: 'https://example.com',
    ...partial,
  }
}

// —— identity ——
assert.strictEqual(resolveIdentityKind(plugin({ id: 'a', name: 'A' })), 'plugin')
assert.strictEqual(
  resolveIdentityKind(plugin({ id: 'a', name: 'A', identityKind: 'soundset' })),
  'soundset'
)
assert.ok(isVersionTrackedKind('plugin'))
assert.ok(isVersionTrackedKind(undefined))
assert.ok(!isVersionTrackedKind('instrument'))
assert.ok(!isVersionTrackedKind('effect'))
assert.ok(!isVersionTrackedKind('hub_app'))
assert.ok(!isVersionTrackedKind('soundset'))

assert.strictEqual(
  decideStatus({
    plugin: plugin({ id: 's', name: 'Lib', identityKind: 'soundset' }),
    manufacturer: mfg({ id: 'm', name: 'M' }),
    installedVersion: '1.0',
  }),
  'content'
)
assert.strictEqual(
  decideStatus({
    plugin: plugin({ id: 'i', name: 'Synth', identityKind: 'instrument' }),
    manufacturer: mfg({ id: 'm', name: 'M' }),
    installedVersion: '1.0',
  }),
  'content'
)
assert.strictEqual(
  decideStatus({
    plugin: plugin({
      id: 'p',
      name: 'FX',
      latestVersion: '2.0',
      versionConfidence: 90,
    }),
    manufacturer: mfg({ id: 'm', name: 'M' }),
    installedVersion: '1.0',
  }),
  'update_available'
)
assert.strictEqual(
  decideStatus({
    plugin: plugin({ id: 'p2', name: 'FX2' }),
    manufacturer: mfg({ id: 'm', name: 'M' }),
    installedVersion: '1.0',
  }),
  'unknown'
)

// —— scheme ——
assert.strictEqual(resolveScheme('semver'), 'semver')
assert.strictEqual(resolveScheme('semver4'), 'semver4')
assert.strictEqual(resolveScheme('date'), 'date')
assert.strictEqual(resolveScheme('build'), 'build')
assert.strictEqual(resolveScheme('marketing'), 'marketing')
assert.strictEqual(resolveScheme('major.minor (2-part), some 3-part'), 'semver')
assert.strictEqual(resolveScheme('calendar YY.MM plus build number'), 'semver')
assert.strictEqual(compareVersions('1.0', null, 'semver'), 'unknown')
assert.strictEqual(compareVersions('1.9', '1.10', 'semver'), 'outdated')
assert.strictEqual(compareVersions('2.7.0.6600', '2.7.0.6601', 'semver4'), 'outdated')

// —— popularity ——
assert.strictEqual(popularitySortKey(1), 1)
assert.strictEqual(popularitySortKey(null), 99)
assert.strictEqual(popularitySortKey(undefined), 99)
assert.strictEqual(
  effectivePopularityTier(
    plugin({ id: 'p', name: 'P', popularityTier: 2 }),
    mfg({ id: 'm', name: 'M', popularityTier: 1 })
  ),
  2
)
assert.strictEqual(
  effectivePopularityTier(
    plugin({ id: 'p', name: 'P' }),
    mfg({ id: 'm', name: 'M', popularityTier: 3 })
  ),
  3
)
assert.strictEqual(
  effectivePopularityTier(plugin({ id: 'p', name: 'P' }), mfg({ id: 'm', name: 'M' })),
  null
)

const sorted = [
  { name: 'Zebra', popularityTier: null },
  { name: 'Ableton', popularityTier: 1 },
  { name: 'Niche', popularityTier: 4 },
  { name: 'Serum', popularityTier: 1 },
].sort(compareByPopularityThenName)
assert.deepStrictEqual(
  sorted.map((x) => x.name),
  ['Ableton', 'Serum', 'Niche', 'Zebra']
)

// —— parse extras ——
const cat = parsePluginCatalog({
  schemaVersion: 3,
  updatedAt: '2026-09-18T00:00:00Z',
  catalogSource: 'store-export:v4',
  futureField: true,
  manufacturers: [{ id: 'm', name: 'M', updatePortalUrl: 'https://x', extra: 1 }],
  plugins: [
    {
      id: 'p',
      manufacturerId: 'm',
      name: 'P',
      matchPatterns: ['P'],
      weirdV6: { nested: true },
    },
  ],
})
assert.strictEqual(cat.plugins.length, 1)
assert.strictEqual(cat.updatedAt, '2026-09-18T00:00:00Z')

const older = parsePluginCatalog({
  schemaVersion: 3,
  updatedAt: '2026-01-01T00:00:00Z',
  catalogSource: 'store-export:v4',
  manufacturers: cat.manufacturers,
  plugins: cat.plugins,
})
const newer = parsePluginCatalog({
  schemaVersion: 3,
  updatedAt: '2026-09-18T00:00:00Z',
  catalogSource: 'store-export:v4',
  manufacturers: cat.manufacturers,
  plugins: cat.plugins,
})
assert.strictEqual(preferNewerCatalog(older, newer).updatedAt, newer.updatedAt)

// —— store-export trust gate ——
for (const catalogSource of [undefined, 'verified-refresh', 'bundled', 'smart-scrub store-export']) {
  assert.throws(
    () =>
      parsePluginCatalog({
        schemaVersion: 3,
        updatedAt: '2026-09-18T00:00:00Z',
        catalogSource,
        manufacturers: cat.manufacturers,
        plugins: cat.plugins,
      }),
    /store-export/,
    `catalogSource ${String(catalogSource)} must be rejected`
  )
}
const trusted = parsePluginCatalog({
  schemaVersion: 3,
  updatedAt: '2026-09-18T00:00:00Z',
  catalogSource: 'store-export:v4',
  manufacturers: cat.manufacturers,
  plugins: [
    { id: 'a', manufacturerId: 'm', name: 'A', matchPatterns: ['A'], latestVersion: '1.0', versionConfidence: 90 },
    { id: 'b', manufacturerId: 'm', name: 'B', matchPatterns: ['B'], latestVersion: '2.0' },
  ],
})
assert.strictEqual(trusted.plugins[0].latestVersion, '1.0')
assert.strictEqual(trusted.plugins[1].latestVersion, undefined, 'version without confidence is stripped')

// —— remote-urls order + portal contract ——
import { readFileSync } from 'fs'
import { join } from 'path'

const remoteUrls = JSON.parse(
  readFileSync(join(process.cwd(), 'catalog/remote-urls.json'), 'utf8')
) as { urls: string[] }
assert.ok(remoteUrls.urls[0].includes('raw.githubusercontent.com'), 'raw GitHub must be first')
assert.ok(remoteUrls.urls.some((u) => u.includes('jsdelivr.net')), 'jsdelivr fallback present')

const KNOWN_DEAD = ['slatedigital.com/activate/']
const shipped = JSON.parse(
  readFileSync(join(process.cwd(), 'catalog/catalog.json'), 'utf8')
) as {
  manufacturers: Array<{ id: string; updatePortalUrl?: string }>
  plugins: Array<{ id: string; updatePortalUrl?: string }>
}

function assertPortal(url: string | undefined, id: string) {
  if (url == null || url === '') return
  assert.ok(/^https?:\/\//i.test(url), `portal must be http(s): ${id} → ${url}`)
  for (const dead of KNOWN_DEAD) {
    assert.ok(!url.toLowerCase().includes(dead), `known-dead portal: ${id} → ${url}`)
  }
}

for (const m of shipped.manufacturers) assertPortal(m.updatePortalUrl, `mfg:${m.id}`)
for (const p of shipped.plugins) assertPortal(p.updatePortalUrl, `plugin:${p.id}`)

console.log('test-catalog-contracts: ok')
