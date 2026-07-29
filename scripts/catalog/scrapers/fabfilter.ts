import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/**
 * FabFilter download page:
 *   <h2>Download FabFilter Pro-Q 4</h2>
 *   … 4.13 &mdash; Jun 25, 2026
 */
export async function scrapeFabFilter(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.fabfilter.com/download'
  const html = await fetchText(sourceUrl)
  const plain = html
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
    .replace(/[ \t]+/g, ' ')

  const updates: VersionUpdate[] = []
  const errors: string[] = []
  const seen = new Set<string>()

  const re =
    /Download\s+FabFilter\s+([A-Za-z0-9][A-Za-z0-9+ \-\/]*?)\s*(?:\n+\s*[^\n\d][^\n]{0,80}?)?\s*\n+\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*[—\-–]\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/gi

  let m: RegExpExecArray | null
  while ((m = re.exec(plain))) {
    const short = m[1].replace(/\s+/g, ' ').trim()
    if (short.length > 40) continue
    const key = short.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    updates.push({
      manufacturerId: 'fabfilter',
      nameIncludes: short,
      latestVersion: m[2],
      sourceUrl,
      releaseDate: new Date(m[3]).toISOString().slice(0, 10),
      label: `FabFilter ${short}`,
    })
  }

  if (!updates.length) errors.push('No FabFilter product versions parsed')

  return { manufacturerId: 'fabfilter', updates, errors }
}
