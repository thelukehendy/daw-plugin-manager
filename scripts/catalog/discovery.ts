/**
 * Free secondary discovery when dedicated scrapers miss a manufacturer.
 *
 * Strategy (no paid APIs):
 *  1. Re-fetch known manufacturer portal / website paths
 *  2. DuckDuckGo HTML search restricted to the manufacturer domain
 *  3. Fetch candidate pages and extract versions only from those pages
 *
 * Never trusts search snippets alone. Never calls paid LLM APIs.
 * Optional future: an env-gated LLM may only suggest URLs; versions still
 * require a successful fetch+parse of a manufacturer-domain page.
 */

import type { CatalogManufacturer, CatalogPlugin, PluginCatalog } from '../../src/shared/types'
import { fetchText, type VersionUpdate } from './http'
import {
  loadKnownSources,
  looksLikeReleaseKnowledgeUrl,
  mergeDiscoveredSources,
  saveKnownSources,
  sourcesForManufacturer,
} from './knownSources'

const COMMON_PATHS = [
  '/release-log',
  '/release-log/',
  '/release-notes',
  '/changelog',
  '/downloads',
  '/download',
  '/support/downloads',
]

const MAX_MANUFACTURERS = Number(process.env.CATALOG_DISCOVERY_MFGS || 20)
const MAX_SEARCHES = Number(process.env.CATALOG_DISCOVERY_SEARCHES || 30)
const MAX_FETCHES = Number(process.env.CATALOG_DISCOVERY_FETCHES || 60)

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return ''
  }
}

function originOf(url: string): string | null {
  try {
    const u = new URL(url)
    return `${u.protocol}//${u.host}`
  } catch {
    return null
  }
}

function allowedHostsFor(mfg: CatalogManufacturer): string[] {
  const hosts = new Set<string>()
  for (const u of [mfg.websiteUrl, mfg.updatePortalUrl]) {
    const h = u ? hostOf(u) : ''
    if (h) hosts.add(h)
  }
  // Common CDN / shop subdomains still count as manufacturer surface
  return [...hosts]
}

function isAllowedUrl(url: string, hosts: string[]): boolean {
  const h = hostOf(url)
  if (!h || !hosts.length) return false
  return hosts.some((a) => h === a || h.endsWith(`.${a}`))
}

function looksLikeVersion(v: string): boolean {
  if (!/^[0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?(?:\.[0-9]{1,3})?$/.test(v)) return false
  const parts = v.split('.').map(Number)
  if (parts.some((p) => !Number.isFinite(p) || p < 0 || p > 200)) return false
  // Reject CSS-ish floats (6.39941) and prices (199.0 already blocked by major>=50 via 2-digit major)
  if (parts[0] >= 50) return false
  return true
}

function extractVersions(html: string, productHint?: string): string[] {
  const plain = html
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
  const ranked: Array<{ v: string; w: number }> = []
  const add = (v: string | undefined, w: number) => {
    if (!v || !looksLikeVersion(v)) return
    if (ranked.some((x) => x.v === v && x.w >= w)) return
    ranked.push({ v, w })
  }

  for (const re of [
    /Installer\s+v([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    /(?:Current|Latest)\s+version\s*[:=]?\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    /(?:version|ver\.?)\s*[:=]\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
  ]) {
    let m: RegExpExecArray | null
    while ((m = re.exec(html + '\n' + plain))) add(m[1], 3)
  }

  if (productHint) {
    const esc = productHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const near = new RegExp(
      `${esc}[^0-9]{0,40}v?([0-9]{1,2}\\.[0-9]{1,3}(?:\\.[0-9]{1,3})?)`,
      'ig'
    )
    let m: RegExpExecArray | null
    while ((m = near.exec(plain))) add(m[1], 2)
  }

  const lineRe =
    /(?:^|\n)\s*[A-Za-z][^\n]{0,60}?\bv?([0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3})\b/g
  let m: RegExpExecArray | null
  while ((m = lineRe.exec(plain))) add(m[1], 1)

  ranked.sort((a, b) => b.w - a.w)
  const out: string[] = []
  for (const { v } of ranked) {
    if (!out.includes(v)) out.push(v)
  }
  return out.slice(0, 12)
}

function extractTrustedVersions(html: string, brandHint?: string): string[] {
  const plain = html
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
  const blob = html + '\n' + plain
  const out: string[] = []
  const add = (v: string | undefined) => {
    if (v && looksLikeVersion(v) && !out.includes(v)) out.push(v)
  }
  for (const re of [
    /Installer\s+v([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    /(?:Current|Latest)\s+version\s*[:=]?\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    /kernel\s+version:\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    /Release\s+v?([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/gi,
    // "Soundtoys 5.5.5 Update" / "Ozone 11.2.0 released"
    /([A-Za-z][A-Za-z0-9][A-Za-z0-9 +\-]{1,40}?)\s+([0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3})\s+(?:Update|Released|Release)/gi,
  ]) {
    let m: RegExpExecArray | null
    while ((m = re.exec(blob))) {
      // For branded "Name X.Y.Z Update", version is group 2
      add(m[2] && /\d/.test(m[1] || '') === false && /[a-z]/i.test(m[1] || '') ? m[2] : m[1])
      if (m[2] && looksLikeVersion(m[2])) add(m[2])
    }
  }
  if (brandHint) {
    const esc = brandHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const re = new RegExp(
      `${esc}[^0-9]{0,24}([0-9]{1,2}\\.[0-9]{1,3}\\.[0-9]{1,3})`,
      'ig'
    )
    let m: RegExpExecArray | null
    while ((m = re.exec(blob))) add(m[1])
  }
  return out
}

function pickBestVersion(versions: string[], current?: string): string | null {
  if (!versions.length) return null
  const score = (v: string) =>
    v.split('.').reduce((acc, part, i) => acc + Number(part) * Math.pow(1000, 3 - i), 0)
  const sorted = [...versions].sort((a, b) => score(b) - score(a))
  const best = sorted[0]
  if (current && score(best) < score(current) * 0.5) return null // absurd downgrade
  return best
}

async function duckDuckGoUrls(query: string): Promise<string[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const html = await fetchText(url)
  const out: string[] = []
  const re = /uddg=([^&"]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    try {
      const decoded = decodeURIComponent(m[1])
      if (/^https?:\/\//i.test(decoded) && !out.includes(decoded)) out.push(decoded)
    } catch {
      /* ignore */
    }
  }
  // Fallback: plain hrefs
  const re2 = /href="(https?:\/\/[^"]+)"/g
  while ((m = re2.exec(html))) {
    const u = m[1]
    if (/duckduckgo\.com|google\.com|bing\.com/i.test(u)) continue
    if (!out.includes(u)) out.push(u)
  }
  return out
}

function seedManufacturers(catalog: PluginCatalog): Array<{
  mfg: CatalogManufacturer
  plugins: CatalogPlugin[]
  seedCount: number
}> {
  const byId = new Map(catalog.manufacturers.map((m) => [m.id, m]))
  const groups = new Map<string, CatalogPlugin[]>()
  for (const p of catalog.plugins) {
    if (p.versionEvidence && p.versionEvidence !== 'unverified-seed' && p.versionEvidence !== 'curated-seed') {
      continue
    }
    const list = groups.get(p.manufacturerId) || []
    list.push(p)
    groups.set(p.manufacturerId, list)
  }
  return [...groups.entries()]
    .map(([id, plugins]) => ({
      mfg: byId.get(id)!,
      plugins,
      seedCount: plugins.length,
    }))
    .filter((g) => g.mfg && (g.mfg.websiteUrl || g.mfg.updatePortalUrl))
    .sort((a, b) => b.seedCount - a.seedCount)
}

export interface DiscoveryResult {
  updates: VersionUpdate[]
  errors: string[]
  stats: {
    manufacturersTried: number
    searches: number
    fetches: number
    hits: number
    sourcesLearned: number
  }
}

/**
 * Boost coverage for seed-only manufacturers using free portal re-fetch + web search.
 * Successful release-notes / changelog URLs are written into catalog/known-sources.json
 * so weekly refreshes permanently remember them.
 */
export async function discoverPublicVersions(catalog: PluginCatalog): Promise<DiscoveryResult> {
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  let searches = 0
  let fetches = 0
  let hits = 0
  let manufacturersTried = 0
  const knownFile = loadKnownSources()
  const learned: Parameters<typeof mergeDiscoveredSources>[1] = []
  const today = new Date().toISOString().slice(0, 10)

  const targets = seedManufacturers(catalog).slice(0, MAX_MANUFACTURERS)

  for (const { mfg, plugins } of targets) {
    manufacturersTried++
    const hosts = allowedHostsFor(mfg)
    if (!hosts.length) continue

    const candidateUrls: string[] = []
    const pushUrl = (u?: string | null) => {
      if (!u) return
      const clean = u.split('#')[0].split('?')[0]
      if (!candidateUrls.includes(clean) && isAllowedUrl(clean, hosts)) candidateUrls.push(clean)
    }

    for (const s of sourcesForManufacturer(knownFile, mfg.id)) pushUrl(s.url)
    pushUrl(mfg.updatePortalUrl)

    if (searches < MAX_SEARCHES) {
      const site = hosts[0]
      const query = `site:${site} ${mfg.name} ("release notes" OR "release log" OR changelog OR "what's new" OR version history)`
      try {
        searches++
        const found = await duckDuckGoUrls(query)
        for (const u of found.slice(0, 10)) pushUrl(u)
      } catch (err) {
        errors.push(`${mfg.id} search: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    if (mfg.websiteUrl) {
      const origin = originOf(mfg.websiteUrl)
      if (origin) {
        for (const path of COMMON_PATHS) pushUrl(`${origin}${path}`)
        pushUrl(`${origin}/pages/release-notes`)
      }
      pushUrl(mfg.websiteUrl)
    }

    let suiteVersion: string | null = null
    let suiteUrl: string | null = null
    const maxFetchesThisMfg = 8
    let fetchesThisMfg = 0

    for (const url of candidateUrls) {
      if (fetches >= MAX_FETCHES || fetchesThisMfg >= maxFetchesThisMfg) break
      try {
        fetches++
        fetchesThisMfg++
        const html = await fetchText(url)
        const best = pickBestVersion(extractTrustedVersions(html, mfg.name))
        if (best) {
          suiteVersion = best
          suiteUrl = url
          break
        }
      } catch (err) {
        errors.push(`${mfg.id} fetch ${url}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    if (suiteVersion && suiteUrl) {
      hits++
      if (looksLikeReleaseKnowledgeUrl(suiteUrl) || /release|changelog|notes|log/i.test(suiteUrl)) {
        learned.push({
          manufacturerId: mfg.id,
          url: suiteUrl,
          kind: 'release-notes',
          label: `${mfg.name} release notes`,
          lastVersion: suiteVersion,
          lastVerifiedAt: today,
          addedBy: 'discovery',
        })
      }
      for (const plugin of plugins) {
        updates.push({
          manufacturerId: mfg.id,
          pluginId: plugin.id,
          latestVersion: suiteVersion,
          sourceUrl: suiteUrl,
          label: `${mfg.name} / ${plugin.name}`,
          evidence: 'search-verified',
        })
      }
      continue
    }

    const productSample = plugins.slice(0, 3)
    for (const plugin of productSample) {
      if (searches >= MAX_SEARCHES || fetches >= MAX_FETCHES) break
      const site = hosts[0]
      const query = `site:${site} "${plugin.name}" ("release notes" OR version OR changelog)`
      try {
        searches++
        const found = await duckDuckGoUrls(query)
        for (const u of found.slice(0, 4)) {
          if (!isAllowedUrl(u, hosts) || fetches >= MAX_FETCHES) continue
          try {
            fetches++
            const html = await fetchText(u)
            const best = pickBestVersion(extractVersions(html, plugin.name), plugin.latestVersion)
            if (best) {
              hits++
              const sourceUrl = u.split('#')[0].split('?')[0]
              if (looksLikeReleaseKnowledgeUrl(sourceUrl)) {
                learned.push({
                  manufacturerId: mfg.id,
                  url: sourceUrl,
                  kind: 'release-notes',
                  label: `${plugin.name} release notes`,
                  nameIncludes: plugin.name,
                  lastVersion: best,
                  lastVerifiedAt: today,
                  addedBy: 'discovery',
                })
              }
              updates.push({
                manufacturerId: mfg.id,
                nameIncludes: plugin.name,
                pluginId: plugin.id,
                latestVersion: best,
                sourceUrl,
                label: plugin.name,
                evidence: 'search-verified',
              })
              break
            }
          } catch (err) {
            errors.push(`${plugin.id} fetch: ${err instanceof Error ? err.message : String(err)}`)
          }
        }
      } catch (err) {
        errors.push(`${plugin.id} search: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  const sourcesLearned = mergeDiscoveredSources(knownFile, learned)
  if (sourcesLearned > 0 || learned.length) saveKnownSources(knownFile)

  return {
    updates,
    errors: errors.slice(0, 40),
    stats: { manufacturersTried, searches, fetches, hits, sourcesLearned },
  }
}

