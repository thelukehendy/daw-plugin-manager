#!/usr/bin/env node
/**
 * Build catalog/spark-inventory.json — identity-only seed for Gemini Spark.
 * Intentionally omits all version numbers from catalog.json / known-sources.json.
 */
const { readFileSync, writeFileSync } = require('node:fs')
const { resolve } = require('node:path')

const ROOT = resolve(__dirname, '../..')
const catalogPath = resolve(ROOT, 'catalog/catalog.json')
const knownPath = resolve(ROOT, 'catalog/known-sources.json')
const outPath = resolve(ROOT, 'catalog/spark-inventory.json')

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
const known = JSON.parse(readFileSync(knownPath, 'utf8'))

const manufacturers = catalog.manufacturers.map((m) => {
  const row = { id: m.id, name: m.name }
  if (m.updatePortalUrl) row.updatePortalUrl = m.updatePortalUrl
  if (m.websiteUrl) row.websiteUrl = m.websiteUrl
  if (Array.isArray(m.aliases) && m.aliases.length > 0) row.aliases = m.aliases
  return row
})

const plugins = catalog.plugins.map((p) => {
  const row = {
    id: p.id,
    manufacturerId: p.manufacturerId,
    name: p.name
  }
  if (p.updatePortalUrl) row.updatePortalUrl = p.updatePortalUrl
  return row
})

const checkUrls = new Set()
const stickySources = []

for (const source of known.sources || []) {
  if (!source.url) continue
  const row = { url: source.url }
  if (source.manufacturerId) row.manufacturerId = source.manufacturerId
  if (source.pluginId) row.pluginId = source.pluginId
  if (source.label) row.label = source.label
  if (source.kind) row.kind = source.kind
  if (source.nameIncludes) row.nameIncludes = source.nameIncludes
  // Explicitly omit lastVersion / lastVerifiedAt
  stickySources.push(row)
  checkUrls.add(source.url)
}

for (const m of catalog.manufacturers) {
  for (const key of ['updatePortalUrl', 'websiteUrl']) {
    const url = m[key]
    if (typeof url === 'string' && url && !url.includes('google.com/search')) {
      checkUrls.add(url)
    }
  }
}

for (const p of catalog.plugins) {
  // versionSourceUrl is a page to visit, not a version — include in checkUrls only
  if (typeof p.versionSourceUrl === 'string' && p.versionSourceUrl) {
    checkUrls.add(p.versionSourceUrl)
  }
  if (typeof p.updatePortalUrl === 'string' && p.updatePortalUrl) {
    checkUrls.add(p.updatePortalUrl)
  }
}

const inventory = {
  schemaVersion: 1,
  kind: 'spark-scrub-inventory',
  purpose:
    'Identity-only seed for Gemini Spark weekly version scrub. Intentionally contains NO version numbers.',
  generatedAt: new Date().toISOString(),
  sourceCatalogUpdatedAt: catalog.updatedAt ?? null,
  rules: [
    'Use this file only for manufacturer/product inventory and portal URLs to visit.',
    'Do not invent or import version numbers from catalog.json or any other file.',
    'candidateLatestVersion is valid only when found on a live public page during a Spark scrub.'
  ],
  counts: {
    manufacturers: manufacturers.length,
    plugins: plugins.length,
    checkUrls: checkUrls.size,
    stickySources: stickySources.length
  },
  manufacturers,
  plugins,
  stickySources,
  checkUrls: [...checkUrls].sort()
}

const serialized = `${JSON.stringify(inventory, null, 2)}\n`
if (
  /"latestVersion"|"versionEvidence"|"versionVerifiedAt"|"lastVersion"|"releaseDate"/.test(
    serialized
  )
) {
  throw new Error('Refusing to write spark-inventory.json: version fields leaked')
}

writeFileSync(outPath, serialized)
console.log(
  `Wrote ${outPath} (manufacturers=${manufacturers.length}, plugins=${plugins.length}, checkUrls=${checkUrls.size})`
)
