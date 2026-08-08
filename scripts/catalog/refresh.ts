import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { CatalogPlugin, PluginCatalog, VersionEvidence } from '../../src/shared/types'
import { assertPortalUrl, type VersionUpdate } from './http'
import { scrapers } from './scrapers'
import { discoverPublicVersions } from './discovery'

function markVerified(
  plugin: CatalogPlugin,
  version: string,
  sourceUrl: string,
  releaseDate?: string,
  evidence: VersionEvidence = 'live-scrape'
) {
  plugin.latestVersion = version
  if (releaseDate) plugin.releaseDate = releaseDate
  plugin.updatePortalUrl = plugin.updatePortalUrl || sourceUrl
  plugin.versionEvidence = evidence
  plugin.versionSourceUrl = sourceUrl
  plugin.versionVerifiedAt = new Date().toISOString().slice(0, 10)
  const stamp = `verifiedPublic:${version}@${sourceUrl}`
  const notes = (plugin.notes || '').replace(/\s*verifiedPublic:\S+/g, '').trim()
  plugin.notes = notes ? `${notes} ${stamp}` : stamp
}

export function applyUpdates(catalog: PluginCatalog, updates: VersionUpdate[]): number {
  let changed = 0

  const evidenceRank: Record<VersionEvidence, number> = {
    'agent-verified': 6,
    'live-scrape': 5,
    'public-page': 4,
    'search-verified': 3,
    'manufacturer-feed': 3,
    'curated-seed': 2,
    'unverified-seed': 1,
  }

  function norm(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '')
  }

  for (const u of updates) {
    assertPortalUrl(u.sourceUrl)
    const evidence: VersionEvidence = u.evidence || 'live-scrape'
    // Guardrail: marketing pages sometimes expose prices (199.0) as "versions".
    const major = Number(String(u.latestVersion).split('.')[0])
    if (Number.isFinite(major) && major >= 50) {
      console.warn(
        `Skipping suspicious version ${u.latestVersion} for ${u.label || u.nameIncludes || u.pluginId} (${u.manufacturerId})`
      )
      continue
    }
    const qNorm = u.nameIncludes ? norm(u.nameIncludes) : ''
    const targets = catalog.plugins.filter((p) => {
      if (u.pluginId && p.id === u.pluginId) return true
      if (u.manufacturerId && p.manufacturerId === u.manufacturerId) {
        if (!u.nameIncludes) return true
        const candidates = [p.name, p.id, ...(p.matchPatterns || [])].map(norm)
        return candidates.some((c) => {
          if (!c || !qNorm) return false
          if (c === qNorm) return true
          const [a, b] = c.length <= qNorm.length ? [c, qNorm] : [qNorm, c]
          // 4+ chars avoids tiny tokens ("eq") while allowing "Ozone" / "Nectar" / "RX"
          if (a.length < 4) return false
          return b.includes(a)
        })
      }
      return false
    })
    for (const p of targets) {
      const prev = (p.versionEvidence || 'unverified-seed') as VersionEvidence
      // Never let weaker discovery overwrite a stronger scrape.
      if (evidenceRank[evidence] < evidenceRank[prev]) continue
      const before = `${p.latestVersion}|${p.versionVerifiedAt}|${p.versionEvidence}|${p.versionSourceUrl}`
      markVerified(p, u.latestVersion, u.sourceUrl, u.releaseDate, evidence)
      const after = `${p.latestVersion}|${p.versionVerifiedAt}|${p.versionEvidence}|${p.versionSourceUrl}`
      if (before !== after) changed++
    }
  }
  return changed
}

/** Promote legacy notes stamps into structured evidence fields. */
function migrateLegacyEvidence(catalog: PluginCatalog): number {
  let n = 0
  for (const p of catalog.plugins) {
    if (p.versionEvidence) continue
    const m = (p.notes || '').match(/verifiedPublic:([^@\s]+)@(\S+)/)
    if (m) {
      p.versionEvidence = 'public-page'
      p.versionSourceUrl = m[2]
      if (!p.versionVerifiedAt) p.versionVerifiedAt = catalog.updatedAt?.slice(0, 10)
      n++
    } else if (p.bundled) {
      p.versionEvidence = 'manufacturer-feed'
      n++
    } else {
      p.versionEvidence = 'unverified-seed'
      n++
    }
  }
  return n
}

function isVerifiedEvidence(e: VersionEvidence | undefined): boolean {
  return (
    e === 'agent-verified' ||
    e === 'live-scrape' ||
    e === 'public-page' ||
    e === 'search-verified'
  )
}

async function main() {
  const path = join(process.cwd(), 'catalog/catalog.json')
  const catalog = JSON.parse(readFileSync(path, 'utf8')) as PluginCatalog
  const migrated = migrateLegacyEvidence(catalog)
  const allUpdates: VersionUpdate[] = []
  const errors: string[] = []

  for (const scrape of scrapers) {
    try {
      const result = await scrape()
      allUpdates.push(...result.updates)
      if (result.errors?.length) {
        errors.push(...result.errors.map((e) => `${result.manufacturerId}: ${e}`))
      }
      console.log(
        `✓ ${result.manufacturerId}: ${result.updates.length} update rule(s)`,
        result.updates
          .map((u) => `${u.label || u.nameIncludes || '*'}=${u.latestVersion}`)
          .join(', ')
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(msg)
      console.error(`✗ scraper failed:`, msg)
    }
  }

  // Apply dedicated scrapers first so discovery only fills remaining seed gaps.
  let changed = applyUpdates(catalog, allUpdates)

  console.log('\n… free discovery (portal re-fetch + DuckDuckGo, manufacturer domains only)')
  try {
    const discovery = await discoverPublicVersions(catalog)
    console.log(
      `✓ discovery: ${discovery.updates.length} update rule(s)`,
      `mfgs=${discovery.stats.manufacturersTried} searches=${discovery.stats.searches} fetches=${discovery.stats.fetches} hits=${discovery.stats.hits} learned=${discovery.stats.sourcesLearned}`
    )
    if (discovery.updates.length) {
      console.log(
        '  ',
        discovery.updates
          .slice(0, 30)
          .map((u) => `${u.label || u.nameIncludes || u.manufacturerId}=${u.latestVersion}`)
          .join(', ')
      )
    }
    changed += applyUpdates(catalog, discovery.updates)
    if (discovery.errors.length) {
      errors.push(...discovery.errors.map((e) => `discovery: ${e}`))
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`discovery failed: ${msg}`)
    console.error(`✗ discovery failed:`, msg)
  }

  catalog.updatedAt = new Date().toISOString()
  catalog.catalogSource = 'verified-refresh'
  catalog.schemaVersion = Math.max(catalog.schemaVersion || 2, 3)

  const verified = catalog.plugins.filter((p) => isVerifiedEvidence(p.versionEvidence)).length

  writeFileSync(path, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`\nApplied ${changed} version update(s); migrated ${migrated} evidence field(s).`)
  console.log(
    `Verified coverage: ${verified}/${catalog.plugins.length} (${Math.round((verified / catalog.plugins.length) * 100)}%)`
  )
  console.log(`Catalog updatedAt=${catalog.updatedAt}`)
  if (errors.length) {
    console.log(`\nScraper warnings (${errors.length}):`)
    for (const e of errors.slice(0, 80)) console.log(' -', e)
  }
}

const isDirect =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  /refresh\.(ts|js)$/.test(process.argv[1].replace(/\\/g, '/'))

if (isDirect) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
