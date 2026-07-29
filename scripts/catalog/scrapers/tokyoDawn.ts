import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/** Tokyo Dawn Labs — follow product links and read version from each page. */
export async function scrapeTokyoDawn(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.tokyodawn.net/tokyo-dawn-labs/'
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  try {
    const html = await fetchText(sourceUrl)
    const hrefs = new Set<string>()
    const re = /href="(https?:\/\/www\.tokyodawn\.net\/[^"]+)"/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(html))) {
      const u = m[1]
      if (/tokyo-dawn-labs\/?$/i.test(u)) continue
      if (/\/(tdr-|nova|kotelnikov|slickeq|limiter|molot|proximity|feedback)/i.test(u)) {
        hrefs.add(u.replace(/\/$/, ''))
      }
    }

    const products = [
      'Nova',
      'Kotelnikov',
      'SlickEQ',
      'Limiter',
      'Molot',
      'Proximity',
      'Feedback',
    ]

    // Always include known product page URLs as fallbacks
    const known = [
      'https://www.tokyodawn.net/tdr-nova/',
      'https://www.tokyodawn.net/tdr-kotelnikov/',
      'https://www.tokyodawn.net/tdr-vos-slickeq/',
      'https://www.tokyodawn.net/tdr-slickeq-ge/',
      'https://www.tokyodawn.net/tdr-limiter-6-ge/',
      'https://www.tokyodawn.net/tdr-molot-ge/',
      'https://www.tokyodawn.net/tdr-nova-ge/',
      'https://www.tokyodawn.net/tdr-kotelnikov-ge/',
    ]
    for (const u of known) hrefs.add(u)

    for (const url of hrefs) {
      try {
        const page = await fetchText(url)
        const plain = page.replace(/<[^>]+>/g, '\n')
        const ver =
          plain.match(/Version\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)?.[1] ||
          plain.match(/v([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*(?:released|available)/i)?.[1] ||
          page.match(/content="[^"]*?([0-9]+\.[0-9]+\.[0-9]+)[^"]*?"/i)?.[1]
        if (!ver) {
          errors.push(`No version on ${url}`)
          continue
        }
        const slug = url.split('/').filter(Boolean).pop() || ''
        const nameGuess =
          products.find((p) => slug.toLowerCase().includes(p.toLowerCase())) ||
          slug.replace(/^tdr-/, '').replace(/-/g, ' ')
        updates.push({
          manufacturerId: 'tokyo-dawn-labs',
          nameIncludes: nameGuess,
          latestVersion: ver,
          sourceUrl: url,
          label: nameGuess,
          evidence: 'live-scrape',
        })
      } catch (err) {
        errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  return { manufacturerId: 'tokyo-dawn-labs', updates, errors: errors.slice(0, 20) }
}
