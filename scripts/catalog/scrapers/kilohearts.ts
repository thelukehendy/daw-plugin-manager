import type { ScrapeResult } from '../http'
import { fetchText } from '../http'

/** All Kilohearts plugins share one installer version (public download page). */
export async function scrapeKilohearts(): Promise<ScrapeResult> {
  const sourceUrl = 'https://kilohearts.com/download'
  const html = await fetchText(sourceUrl)

  const installer = html.match(/Installer[^0-9]{0,16}([0-9]+\.[0-9]+\.[0-9]+)\s+for\s+Mac/i)
  const changelog = html.match(/###\s*([0-9]+\.[0-9]+\.[0-9]+)\s*[-–—]/)
  const latestVersion = installer?.[1] || changelog?.[1] || null

  if (!latestVersion) {
    return {
      manufacturerId: 'kilohearts',
      updates: [],
      errors: ['Could not parse suite version from kilohearts.com/download'],
    }
  }

  return {
    manufacturerId: 'kilohearts',
    updates: [
      {
        manufacturerId: 'kilohearts',
        latestVersion,
        sourceUrl,
        label: 'suite',
      },
    ],
  }
}
