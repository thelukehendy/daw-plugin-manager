import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/** Klanghelm products page lists product names with version-ish tokens. */
export async function scrapeKlanghelm(): Promise<ScrapeResult> {
  const sourceUrl = 'https://klanghelm.com/contents/products.php'
  const html = await fetchText(sourceUrl)
  const plain = html.replace(/<[^>]+>/g, '\n')
  const updates: VersionUpdate[] = []
  const errors: string[] = []

  const products = ['SDRR', 'IVGI', 'DC1A', 'VUMT', 'MJUC', 'TENS']
  for (const name of products) {
    const re = new RegExp(`${name}[^\\n]{0,120}?v?([0-9]+\\.[0-9]+(?:\\.[0-9]+)?)`, 'i')
    const m = plain.match(re)
    if (!m) {
      errors.push(`No version for ${name}`)
      continue
    }
    updates.push({
      manufacturerId: 'klanghelm',
      nameIncludes: name,
      latestVersion: m[1],
      sourceUrl,
      label: name,
      evidence: 'live-scrape',
    })
  }

  return { manufacturerId: 'klanghelm', updates, errors }
}
