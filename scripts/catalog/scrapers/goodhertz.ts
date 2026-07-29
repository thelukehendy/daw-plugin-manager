import type { ScrapeResult } from '../http'
import { extractSuiteVersion, fetchText } from '../http'

/** Goodhertz ships one bundle version for all plugins. */
export async function scrapeGoodhertz(): Promise<ScrapeResult> {
  const sourceUrl = 'https://goodhertz.com/downloads/'
  const html = await fetchText(sourceUrl)
  const latestVersion =
    extractSuiteVersion(html, [
      /Goodhertz\s+([0-9]+\.[0-9]+\.[0-9]+)/i,
      /Goodhertz-Installer-([0-9]+\.[0-9]+\.[0-9]+)/i,
      /Latest Bundle Release[\s\S]{0,200}?([0-9]+\.[0-9]+\.[0-9]+)/i,
    ]) || null

  const dateMatch = html.match(/([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/)
  const releaseDate = dateMatch ? new Date(dateMatch[1]).toISOString().slice(0, 10) : undefined

  if (!latestVersion) {
    return {
      manufacturerId: 'goodhertz',
      updates: [],
      errors: ['Could not parse bundle version from goodhertz.com/downloads'],
    }
  }

  return {
    manufacturerId: 'goodhertz',
    updates: [
      {
        manufacturerId: 'goodhertz',
        latestVersion,
        sourceUrl,
        releaseDate,
        label: 'bundle',
      },
    ],
  }
}
