import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/**
 * MeldaProduction public downloads page exposes:
 *   installer version: XX.YY  (manager)
 *   kernel version: AA.BB.CC  (plugin suite — this is what Installed versions track)
 */
export async function scrapeMelda(): Promise<ScrapeResult> {
  const sourceUrl = 'https://www.meldaproduction.com/downloads'
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  try {
    const html = await fetchText(sourceUrl)
    const kernel =
      html.match(/kernel\s+version:\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)?.[1] ||
      html.match(/Release notes<\/a>[\s\S]{0,200}?kernel version:\s*([0-9.]+)/i)?.[1]
    if (kernel) {
      // Catalog / installers often use major.minor (17.09) without patch
      const short = kernel.split('.').slice(0, 2).join('.')
      updates.push({
        manufacturerId: 'meldaproduction',
        latestVersion: short,
        sourceUrl,
        label: `Melda kernel ${kernel}`,
        evidence: 'live-scrape',
      })
    } else {
      errors.push('Could not parse Melda kernel version')
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
  }
  return { manufacturerId: 'meldaproduction', updates, errors }
}
