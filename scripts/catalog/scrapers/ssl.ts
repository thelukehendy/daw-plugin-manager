import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/** SSL public support downloads — capture versioned release notes / product mentions. */
export async function scrapeSsl(): Promise<ScrapeResult> {
  const sourceUrl = 'https://solidstatelogic.com/support/downloads'
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  try {
    const html = await fetchText(sourceUrl)
    const plain = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, '\n')

    const link = plain.match(/SSL\s*360\s*Link\s*v([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)
    if (link?.[1]) {
      updates.push({
        manufacturerId: 'ssl',
        nameIncludes: '360 Link',
        latestVersion: link[1],
        sourceUrl,
        label: 'SSL 360 Link',
        evidence: 'live-scrape',
      })
    }

    // Named plugin rows with versions when present
    const re =
      /SSL\s+([A-Za-z0-9][A-Za-z0-9 \-\/+]{1,40}?)\s+v?([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*(?:Release|Plug-?in)?/gi
    let m: RegExpExecArray | null
    const seen = new Set<string>()
    while ((m = re.exec(plain))) {
      const name = m[1].trim()
      if (/download|manager|native|software|bundle|pack/i.test(name)) continue
      const key = name.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      updates.push({
        manufacturerId: 'ssl',
        nameIncludes: name,
        latestVersion: m[2],
        sourceUrl,
        label: `SSL ${name}`,
        evidence: 'live-scrape',
      })
    }

    if (!updates.length) {
      errors.push('No SSL plugin versions parsed from support downloads')
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  return { manufacturerId: 'ssl', updates, errors }
}
