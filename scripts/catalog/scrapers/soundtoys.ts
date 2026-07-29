import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'
import { loadKnownSources, sourcesForManufacturer } from '../knownSources'

/**
 * Soundtoys public release log publishes suite versions as
 * "Soundtoys 5.5.5 Update" — authoritative for the whole product line.
 */
export async function scrapeSoundtoys(): Promise<ScrapeResult> {
  const known = sourcesForManufacturer(loadKnownSources(), 'soundtoys')
  const pages = [
    ...known.map((s) => s.url),
    'https://www.soundtoys.com/release-log/',
    'https://www.soundtoys.com/downloads/',
  ]
  const seen = new Set<string>()
  const updates: VersionUpdate[] = []
  const errors: string[] = []

  for (const sourceUrl of pages) {
    const key = sourceUrl.replace(/\/$/, '')
    if (seen.has(key)) continue
    seen.add(key)
    try {
      const html = await fetchText(sourceUrl)
      const plain = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, '\n')
      const ver =
        plain.match(/Soundtoys\s+([0-9]+\.[0-9]+\.[0-9]+)\s+Update/i)?.[1] ||
        plain.match(/Soundtoys\s*5[^0-9]{0,24}([0-9]+\.[0-9]+\.[0-9]+)/i)?.[1] ||
        plain.match(/Effect\s*Rack[^0-9]{0,24}([0-9]+\.[0-9]+\.[0-9]+)/i)?.[1]
      if (ver) {
        updates.push({
          manufacturerId: 'soundtoys',
          latestVersion: ver,
          sourceUrl,
          label: 'Soundtoys suite',
          evidence: 'live-scrape',
        })
        break
      }
    } catch (err) {
      errors.push(`${sourceUrl}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  if (!updates.length) {
    errors.push('No Soundtoys suite version found on release log / downloads')
  }
  return { manufacturerId: 'soundtoys', updates, errors }
}
