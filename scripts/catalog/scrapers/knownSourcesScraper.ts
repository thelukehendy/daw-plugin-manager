import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'
import {
  loadKnownSources,
  mergeDiscoveredSources,
  saveKnownSources,
  type KnownSource,
} from '../knownSources'

/**
 * Generic pass over catalog/known-sources.json — every curated/discovered
 * release-notes URL is scraped weekly so new knowledge sticks permanently.
 */
export async function scrapeKnownSources(): Promise<ScrapeResult> {
  const file = loadKnownSources()
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  const today = new Date().toISOString().slice(0, 10)
  const touch: KnownSource[] = []

  for (const src of file.sources) {
    try {
      const html = await fetchText(src.url)
      const plain = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, '\n')
      const ver =
        plain.match(/Version\s+([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)\s+released/i)?.[1] ||
        plain.match(
          /([A-Za-z][A-Za-z0-9 +\-]{1,40}?)\s+([0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3})\s+Update/i
        )?.[2] ||
        plain.match(/Installer\s+v([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/i)?.[1] ||
        plain.match(/(?:Current|Latest)\s+version\s*[:=]?\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/i)?.[1] ||
        plain.match(/kernel\s+version:\s*([0-9]{1,2}\.[0-9]{1,3}(?:\.[0-9]{1,3})?)/i)?.[1]

      if (!ver) {
        errors.push(`No version on ${src.url}`)
        continue
      }
      const major = Number(ver.split('.')[0])
      if (major >= 50) continue

      updates.push({
        manufacturerId: src.manufacturerId,
        nameIncludes: src.nameIncludes,
        latestVersion: ver,
        sourceUrl: src.url,
        label: src.label || src.nameIncludes || src.manufacturerId,
        evidence: 'live-scrape',
      })
      touch.push({
        ...src,
        lastVersion: ver,
        lastVerifiedAt: today,
      })
    } catch (err) {
      errors.push(`${src.url}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Persist lastVerifiedAt / lastVersion on successes
  if (touch.length) {
    mergeDiscoveredSources(
      file,
      touch.map((s) => ({
        manufacturerId: s.manufacturerId,
        url: s.url,
        kind: s.kind,
        label: s.label,
        nameIncludes: s.nameIncludes,
        lastVersion: s.lastVersion,
        lastVerifiedAt: s.lastVerifiedAt,
        addedBy: s.addedBy,
      }))
    )
    saveKnownSources(file)
  }

  return {
    manufacturerId: 'known-sources',
    updates,
    errors: errors.slice(0, 40),
  }
}
