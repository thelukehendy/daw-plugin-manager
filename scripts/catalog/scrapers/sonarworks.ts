import type { ScrapeResult } from '../http'
import { extractSuiteVersion, fetchText } from '../http'

export async function scrapeSonarworks(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.sonarworks.com/soundid-reference/download'
  try {
    const html = await fetchText(sourceUrl)
    const latestVersion = extractSuiteVersion(html, [
      /SoundID\s+Reference[^0-9]{0,40}([0-9]+\.[0-9]+\.[0-9]+)/i,
      /version\s+([0-9]+\.[0-9]+\.[0-9]+)/i,
    ])
    if (!latestVersion) {
      return {
        manufacturerId: 'sonarworks',
        updates: [],
        errors: ['Could not parse SoundID Reference version'],
      }
    }
    return {
      manufacturerId: 'sonarworks',
      updates: [
        {
          manufacturerId: 'sonarworks',
          nameIncludes: 'SoundID',
          latestVersion,
          sourceUrl,
          label: 'SoundID Reference',
        },
      ],
    }
  } catch (err) {
    return {
      manufacturerId: 'sonarworks',
      updates: [],
      errors: [err instanceof Error ? err.message : String(err)],
    }
  }
}
