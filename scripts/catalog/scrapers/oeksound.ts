import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

export async function scrapeOeksound(): Promise<ScrapeResult> {
  const sourceUrl = 'https://oeksound.com/downloads/'
  const html = await fetchText(sourceUrl)
  const plain = html.replace(/<[^>]+>/g, '\n')
  const updates: VersionUpdate[] = []
  const errors: string[] = []

  const products = ['Soothe2', 'Soothe', 'Spiff', 'Bloom']
  for (const name of products) {
    const re = new RegExp(`${name}[^\\n]{0,80}?([0-9]+\\.[0-9]+(?:\\.[0-9]+)?)`, 'i')
    const m = plain.match(re)
    if (!m) {
      errors.push(`No version for ${name}`)
      continue
    }
    updates.push({
      manufacturerId: 'oeksound',
      nameIncludes: name,
      latestVersion: m[1],
      sourceUrl,
      label: name,
    })
  }

  return { manufacturerId: 'oeksound', updates, errors }
}
