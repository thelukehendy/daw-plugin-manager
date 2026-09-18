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
  manufacturers: cat.manufacturers,
  plugins: cat.plugins,
})
const newer = parsePluginCatalog({
  schemaVersion: 3,
  updatedAt: '2026-09-18T00:00:00Z',
  manufacturers: cat.manufacturers,
  plugins: cat.plugins,
})
assert.strictEqual(preferNewerCatalog(older, newer).updatedAt, newer.updatedAt)

console.log('test-catalog-contracts: ok')
