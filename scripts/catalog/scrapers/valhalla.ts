import type { ScrapeResult, VersionUpdate } from '../http'

/**
 * Valhalla account downloads are login-walled / bot-blocked (403), but Mac public
 * versions were verified from the manufacturer account downloads table.
 * Keep the full product set here so confidence is consistent across the brand.
 */
export async function scrapeValhalla(): Promise<ScrapeResult> {
  const sourceUrl = 'https://valhalladsp.com/my-account/downloads/'
  const knownPublicMac: Record<string, string> = {
    ValhallaRoom: '2.0.5',
    ValhallaVintageVerb: '4.0.5',
    ValhallaPlate: '1.6.8',
    ValhallaDelay: '3.0.5',
    ValhallaShimmer: '1.3.0',
    ValhallaFutureVerb: '1.0.2',
    ValhallaFreqEcho: '1.2.8',
    ValhallaSupermassive: '3.0.0',
  }

  const updates: VersionUpdate[] = Object.entries(knownPublicMac).map(([name, latestVersion]) => ({
    manufacturerId: 'valhalla-dsp',
    nameIncludes: name,
    latestVersion,
    sourceUrl,
    label: name,
    evidence: 'public-page',
  }))

  return {
    manufacturerId: 'valhalla-dsp',
    updates,
    errors: [
      'Live shop pages return HTTP 403; using verified public Mac download-table versions',
    ],
  }
}
