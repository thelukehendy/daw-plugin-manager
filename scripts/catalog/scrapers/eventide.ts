import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/** Eventide public downloads page. */
export async function scrapeEventide(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.eventideaudio.com/downloads/'
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  try {
    const html = await fetchText(sourceUrl)
    const plain = html.replace(/<[^>]+>/g, '\n')
    // Lines like "UltraTap 3.2.0" or "Blackhole 3.1.0"
    const re = /\n\s*([A-Za-z][A-Za-z0-9 \/\-]{1,40}?)\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*\n/g
    const seen = new Set<string>()
    let m: RegExpExecArray | null
    while ((m = re.exec(plain))) {
      const name = m[1].trim()
      if (/^(download|mac|windows|version|release|login|account)$/i.test(name)) continue
      if (name.length < 3 || name.length > 36) continue
      const key = name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      updates.push({
        manufacturerId: 'eventide',
        nameIncludes: name,
        latestVersion: m[2],
        sourceUrl,
        label: name,
        evidence: 'live-scrape',
      })
    }
    if (!updates.length) errors.push('No Eventide product versions parsed')
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  return { manufacturerId: 'eventide', updates, errors }
}
