import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/** Softube public installers page. */
export async function scrapeSoftube(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.softube.com/installers'
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  try {
    const html = await fetchText(sourceUrl)
    const plain = html.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ')
    const suite =
      plain.match(/Softube\s+Central[^0-9]{0,40}([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i) ||
      plain.match(/Central[^0-9]{0,20}([0-9]+\.[0-9]+\.[0-9]+)/i) ||
      plain.match(/Installer[^0-9]{0,40}([0-9]+\.[0-9]+\.[0-9]+)/i)
    if (suite?.[1]) {
      updates.push({
        manufacturerId: 'softube',
        latestVersion: suite[1],
        sourceUrl,
        label: 'Softube Central / suite',
        evidence: 'live-scrape',
      })
    } else {
      // Per-product rows if present
      const re = /\n\s*([A-Za-z][A-Za-z0-9 \-]{2,40})\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*\n/g
      let m: RegExpExecArray | null
      const seen = new Set<string>()
      while ((m = re.exec(plain))) {
        const name = m[1].trim()
        if (/download|mac|windows|version|softube/i.test(name)) continue
        const key = name.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        updates.push({
          manufacturerId: 'softube',
          nameIncludes: name,
          latestVersion: m[2],
          sourceUrl,
          label: name,
          evidence: 'live-scrape',
        })
      }
      if (!updates.length) errors.push('Could not parse Softube installer version')
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  return { manufacturerId: 'softube', updates, errors }
}
