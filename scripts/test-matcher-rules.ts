/**
 * Matcher + DAW version-rule contract tests (agreed with the catalog operator 2026-09-25).
 * Run: npx tsx scripts/test-matcher-rules.ts
 */
import assert from 'assert'
import { buildCatalogIndex, isWeakPattern, matchCatalogPluginIndexed } from '../src/main/catalog/catalogIndex'
import { applyInstalledVersionRule, compareSegments, dawCatalogInfo, matchHelperApps } from '../src/main/catalog/dawCatalog'
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

// —— generation rows sharing a name ——
const genCatalog: PluginCatalog = {
  ...catalog,
  manufacturers: [...catalog.manufacturers, { id: 'scuffham-amps', name: 'Scuffham Amps', updatePortalUrl: 'https://s' }],
  plugins: [
    { id: 'sg2', manufacturerId: 'scuffham-amps', name: 'S-Gear 2', matchPatterns: ['S-Gear'], generation: '2', latestVersion: '2.9.9', versionConfidence: 90, updateClass: 'paid_upgrade', successorPluginId: 'sg3' },
    { id: 'sg3', manufacturerId: 'scuffham-amps', name: 'S-Gear 3', matchPatterns: ['S-Gear'], generation: '3', latestVersion: '3.2.5', versionConfidence: 92 },
  ],
}
const genIndex = buildCatalogIndex(genCatalog)
const sgear = (v: string | null) =>
  matchCatalogPluginIndexed({ name: 'S-Gear', productLine: 'S-Gear', vendorNames: ['Scuffham Amps'], installedVersion: v }, genIndex)
assert.strictEqual(sgear('2.7.0')?.plugin.id, 'sg2', 'installed major 2 → generation 2 row')
assert.strictEqual(sgear('3.1.0')?.plugin.id, 'sg3')
assert.strictEqual(sgear('4.0.0'), null, 'no generation covers it → no match, not the newest')
assert.strictEqual(sgear(null), null, 'unknown installed version → no guess')

// —— DAW verdicts ——
const daw = (version: string) => ({ id: 'pt', name: 'Pro Tools', version, path: '', bundleId: 'com.avid.ProTools', detectedAt: '' })
assert.strictEqual(dawCatalogInfo(daw('26.4.1.179'), index)?.status, 'current', 'Pro Tools 26.4.1 == 2026.4')
assert.strictEqual(dawCatalogInfo(daw('25.12.0'), index)?.status, 'update_available')
const noRule = buildCatalogIndex({
  ...catalog,
  plugins: catalog.plugins.map((p) => (p.id === 'avid--pro-tools' ? { ...p, installedVersionRule: undefined } : p)),
})
// No rule: inferred, conservative verdicts (never a verified "update_available").
const inferred = (v: string) => dawCatalogInfo(daw(v), noRule)
assert.strictEqual(inferred('26.4.1.179')?.status, 'current', 'year scheme lines up: 26.4.1 = 2026.4')
assert.strictEqual(inferred('26.4.1.179')?.inferred, true)
assert.strictEqual(inferred('25.12.0')?.status, 'newer_major', 'DAW behind a major: possibly paid')
assert.strictEqual(inferred('9.0')?.status, 'check_in_app', 'unrelated number formats: no verdict')

const live = buildCatalogIndex({
  ...catalog,
  manufacturers: [...catalog.manufacturers, { id: 'ableton', name: 'Ableton', updatePortalUrl: 'https://a' }],
  plugins: [{ id: 'ableton--live', manufacturerId: 'ableton', name: 'Ableton Live', matchPatterns: ['Ableton Live'], identityKind: 'standalone_app', latestVersion: '12.4.6', versionConfidence: 82 }],
})
assert.strictEqual(
  dawCatalogInfo({ id: 'l', name: 'Ableton Live 12 Suite', version: '12.2.7', path: '', detectedAt: '' }, live)?.catalogPluginId,
  'ableton--live',
  'edition suffix still finds the DAW row'
)

// Helper apps: majors are free updates; discontinued and versionless rows say so.
const helperIndex = buildCatalogIndex({
  ...catalog,
  manufacturers: [...catalog.manufacturers, { id: 'pace', name: 'PACE', updatePortalUrl: 'https://p' }],
  plugins: [
    { id: 'pace--ilok', manufacturerId: 'pace', name: 'iLok License Manager', matchPatterns: ['iLok License Manager'], identityKind: 'hub_app', latestVersion: '6.0.1', versionConfidence: 90 },
    { id: 'steinberg--elicenser', manufacturerId: 'steinberg', name: 'eLicenser Control Center', matchPatterns: [], identityKind: 'standalone_app', discontinued: true },
    { id: 'avid--link', manufacturerId: 'avid', name: 'Avid Link', matchPatterns: [], identityKind: 'hub_app' },
  ],
})
const helpers = matchHelperApps(
  [
    { name: 'iLok License Manager', version: '5.10.5 GM (b5356, c55e8d80)', path: '/Applications/iLok License Manager.app' },
    { name: 'eLicenser Control Center', version: '7.3.0', path: '/Applications/eLicenser Control Center.app' },
    { name: 'Avid Link', version: '26.4.0', path: '/Applications/Avid/Avid Link/Avid Link.app' },
    { name: 'Safari', version: '26.0', path: '/Applications/Safari.app' },
  ],
  helperIndex,
  new Set()
)
const verdictOf = (name: string) => helpers.find((h) => h.name === name)?.catalog.status
assert.strictEqual(verdictOf('iLok License Manager'), 'update_likely', 'helper major bump is a normal update')
assert.strictEqual(verdictOf('eLicenser Control Center'), 'discontinued')
assert.strictEqual(verdictOf('Avid Link'), 'not_tracked')
assert.strictEqual(verdictOf('Safari'), undefined, 'unrelated apps are not helpers')

console.log('test-matcher-rules: ok')
