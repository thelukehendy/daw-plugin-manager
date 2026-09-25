/**
 * Matcher + DAW version-rule contract tests (agreed with the catalog operator 2026-09-25).
 * Run: npx tsx scripts/test-matcher-rules.ts
 */
import assert from 'assert'
import { buildCatalogIndex, isWeakPattern, matchCatalogPluginIndexed } from '../src/main/catalog/catalogIndex'
import { applyInstalledVersionRule, compareSegments, dawCatalogInfo } from '../src/main/catalog/dawCatalog'
import type { PluginCatalog } from '../src/shared/types'

// —— installedVersionRule transforms ——
assert.strictEqual(applyInstalledVersionRule('7.54.0_91d78b1u', { transforms: ['strip-build-suffix'] }), '7.54.0')
assert.strictEqual(applyInstalledVersionRule('5.5.2 Build 86528', { transforms: ['strip-build-suffix'] }), '5.5.2')
assert.strictEqual(applyInstalledVersionRule('26.4.1.179', { transforms: ['prefix-year-2000'] }), '2026.4.1.179')
assert.strictEqual(applyInstalledVersionRule('2026.4', { transforms: ['prefix-year-2000'] }), '2026.4')
assert.strictEqual(
  applyInstalledVersionRule('12.7.4d3 build 15815', { transforms: ['strip-build-suffix', 'semver-first-3'] }),
  '12.7.4'
)
assert.strictEqual(applyInstalledVersionRule('12.7.4d3', { transforms: ['semver-first-3'] }), '12.7.4')
assert.strictEqual(applyInstalledVersionRule('1.0', { transforms: ['made-up'] }), null, 'unknown transform → no verdict')

assert.strictEqual(compareSegments('2026.4.1.179', '2026.4', 2), 0)
assert.strictEqual(compareSegments('7.54.0', '7.80', 2), -1)
assert.strictEqual(compareSegments('12.3.1', '12.3.1', 3), 0)
assert.strictEqual(compareSegments('12.10', '12.9', 2), 1, 'segments compare numerically')

// —— matcher ——
const catalog: PluginCatalog = {
  schemaVersion: 3,
  updatedAt: '2026-09-25T00:00:00Z',
  catalogSource: 'store-export:v4',
  manufacturers: [
    { id: 'lindell-audio', name: 'Lindell Audio', updatePortalUrl: 'https://l', aliases: ['Lindell', 'LindellAudio'] },
    { id: 'steinberg', name: 'Steinberg', updatePortalUrl: 'https://s' },
    { id: 'plugin-alliance', name: 'Plugin Alliance', updatePortalUrl: 'https://p', aliases: ['PluginAlliance'] },
    { id: 'spl', name: 'SPL', updatePortalUrl: 'https://spl' },
    { id: 'wa-production', name: 'WA Production', updatePortalUrl: 'https://wa' },
    { id: 'waves', name: 'Waves', updatePortalUrl: 'https://w' },
    { id: 'fabfilter', name: 'FabFilter', updatePortalUrl: 'https://f' },
    { id: 'avid', name: 'Avid', updatePortalUrl: 'https://a' },
  ],
  plugins: [
    { id: 'steinberg--lindell-254e', manufacturerId: 'steinberg', name: 'Lindell 254E', matchPatterns: ['Lindell 254E'] },
    { id: 'spl--tdp', manufacturerId: 'spl', name: 'Transient Designer Plus', matchPatterns: ['SPL Transient Designer Plus'] },
    { id: 'waves--drifter', manufacturerId: 'waves', name: 'Drifter', matchPatterns: ['Drifter'] },
    { id: 'wa-production--drifter', manufacturerId: 'wa-production', name: 'Drifter', matchPatterns: ['Drifter'] },
    { id: 'waves--reverb', manufacturerId: 'waves', name: 'Reverb', matchPatterns: ['Reverb'] },
    {
      id: 'fabfilter--pro-q-4',
      manufacturerId: 'fabfilter',
      name: 'Pro-Q 4',
      matchPatterns: ['FabFilter Pro-Q 4'],
      identityKeys: { bundleIds: ['com.fabfilter.Pro-Q.AU.4'] },
    },
    {
      id: 'avid--pro-tools',
      manufacturerId: 'avid',
      name: 'Pro Tools',
      matchPatterns: ['Pro Tools'],
      identityKind: 'standalone_app',
      latestVersion: '2026.4',
      versionConfidence: 92,
      identityKeys: { bundleIds: ['com.avid.ProTools'] },
      installedVersionRule: { transforms: ['prefix-year-2000'], compareSegments: 2 },
    },
  ],
}
const index = buildCatalogIndex(catalog)
const match = (name: string, vendorNames: string[], extra: Record<string, unknown> = {}) =>
  matchCatalogPluginIndexed({ name, productLine: name, vendorNames, ...extra }, index)

assert.strictEqual(match('Lindell 254E', ['lindellaudio', 'Plugin Alliance']), null, 'exact name from another vendor is rejected')
assert.strictEqual(match('SPL Transient Designer Plus', ['Plugin Alliance'])?.plugin.id, 'spl--tdp', 'brand named in product')
assert.strictEqual(match('Drifter', ['w', 'W.A.Production'])?.plugin.id, 'wa-production--drifter', 'punctuation-insensitive vendor')
assert.strictEqual(match('Drifter', ['w']), null, 'ambiguous exact name with unknown vendor stays unmatched')
assert.strictEqual(match('Reverb', ['Some Vendor']), null, 'generic word never matches across vendors')
assert.strictEqual(
  match('Pro-Q 4', ['Unknown'], { bundleIds: ['com.fabfilter.Pro-Q.AU.4'] })?.method,
  'bundle-id',
  'bundle ID wins'
)
assert.ok(isWeakPattern('EQ') && isWeakPattern('reverb') && !isWeakPattern('Pro-Q 4'))

// —— DAW verdicts ——
const daw = (version: string) => ({ id: 'pt', name: 'Pro Tools', version, path: '', bundleId: 'com.avid.ProTools', detectedAt: '' })
assert.strictEqual(dawCatalogInfo(daw('26.4.1.179'), index)?.status, 'current', 'Pro Tools 26.4.1 == 2026.4')
assert.strictEqual(dawCatalogInfo(daw('25.12.0'), index)?.status, 'update_available')
const noRule = buildCatalogIndex({
  ...catalog,
  plugins: catalog.plugins.map((p) => (p.id === 'avid--pro-tools' ? { ...p, installedVersionRule: undefined } : p)),
})
assert.strictEqual(dawCatalogInfo(daw('25.12.0'), noRule)?.status, 'check_in_app', 'no rule → no verdict')

console.log('test-matcher-rules: ok')
