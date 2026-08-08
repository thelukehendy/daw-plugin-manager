#!/usr/bin/env node
/** JS helper mirroring scripts/catalog/knownSources.ts merge behavior. */
const { readFileSync, writeFileSync, existsSync } = require('node:fs')
const { KNOWN_SOURCES_PATH } = require('./paths')
const { assertPortalUrl } = require('./accuracyGate')

function loadKnownSources() {
  if (!existsSync(KNOWN_SOURCES_PATH)) {
    return { schemaVersion: 1, updatedAt: new Date().toISOString(), sources: [] }
  }
  return JSON.parse(readFileSync(KNOWN_SOURCES_PATH, 'utf8'))
}

function saveKnownSources(file) {
  file.updatedAt = new Date().toISOString()
  file.schemaVersion = Math.max(file.schemaVersion || 1, 1)
  writeFileSync(KNOWN_SOURCES_PATH, `${JSON.stringify(file, null, 2)}\n`)
}

function mergeDiscoveredSources(file, incoming) {
  let added = 0
  const today = new Date().toISOString().slice(0, 10)
  const byUrl = new Map(file.sources.map((s) => [s.url.replace(/\/$/, ''), s]))

  for (const raw of incoming) {
    assertPortalUrl(raw.url)
    const key = raw.url.replace(/\/$/, '')
    const existing = byUrl.get(key)
    if (existing) {
      if (raw.lastVersion) existing.lastVersion = raw.lastVersion
      if (raw.lastVerifiedAt) existing.lastVerifiedAt = raw.lastVerifiedAt
      if (raw.nameIncludes && !existing.nameIncludes) existing.nameIncludes = raw.nameIncludes
      if (raw.label && !existing.label) existing.label = raw.label
      continue
    }
    const next = {
      manufacturerId: raw.manufacturerId,
      url: raw.url.split('#')[0].split('?')[0],
      kind: raw.kind || 'release-notes',
      label: raw.label,
      nameIncludes: raw.nameIncludes,
      addedBy: raw.addedBy || 'discovery',
      addedAt: today,
      lastVerifiedAt: raw.lastVerifiedAt,
      lastVersion: raw.lastVersion
    }
    file.sources.push(next)
    byUrl.set(key, next)
    added++
  }
  return added
}

module.exports = {
  loadKnownSources,
  saveKnownSources,
  mergeDiscoveredSources
}
