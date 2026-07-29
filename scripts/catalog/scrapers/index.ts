import type { ScrapeResult } from '../http'
import { scrapeKilohearts } from './kilohearts'
import { scrapeGoodhertz } from './goodhertz'
import { scrapeFabFilter } from './fabfilter'
import { scrapeValhalla } from './valhalla'
import { scrapeOeksound } from './oeksound'
import { scrapeSonarworks } from './sonarworks'
import { scrapeKlanghelm } from './klanghelm'
import { scrapeSoftube } from './softube'
import { scrapeTokyoDawn } from './tokyoDawn'
import { scrapeMelda } from './melda'
import { scrapePluginAlliance } from './pluginAlliance'
import { scrapeSoundtoys } from './soundtoys'
import { scrapeEventide } from './eventide'
import { scrapeIzotope } from './izotope'
import { scrapeSsl } from './ssl'
import { scrapeUnitedPlugins } from './unitedPlugins'
import { scrapeKnownSources } from './knownSourcesScraper'

export type Scraper = () => Promise<ScrapeResult>

/**
 * Order: known-sources registry first (sticky release-note URLs), then dedicated
 * scrapers, then heavy multi-page (PA). Discovery runs after these in refresh.ts.
 */
export const scrapers: Scraper[] = [
  scrapeKnownSources,
  scrapeKilohearts,
  scrapeGoodhertz,
  scrapeFabFilter,
  scrapeValhalla,
  scrapeOeksound,
  scrapeSonarworks,
  scrapeKlanghelm,
  scrapeSoftube,
  scrapeTokyoDawn,
  scrapeMelda,
  scrapeSoundtoys,
  scrapeEventide,
  scrapeIzotope,
  scrapeSsl,
  scrapeUnitedPlugins,
  scrapePluginAlliance,
]
