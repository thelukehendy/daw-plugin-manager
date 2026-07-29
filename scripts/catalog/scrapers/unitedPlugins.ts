import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

/**
 * United Plugins — product pages under /product/<slug> often include version;
 * fallback: download page manager version is NOT used for plugins.
 */
export async function scrapeUnitedPlugins(): Promise<ScrapeResult> {
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  const indexUrl = 'https://unitedplugins.com/download'

  let html = ''
  try {
    html = await fetchText(indexUrl)
  } catch (err) {
    return {
      manufacturerId: 'united-plugins',
      updates: [],
      errors: [err instanceof Error ? err.message : String(err)],
    }
  }

  const hrefs = new Set<string>()
  const re = /href="(https?:\/\/unitedplugins\.com\/(?:product|Product)\/[A-Za-z0-9_\-]+\/?)"/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) hrefs.add(m[1].replace(/\/$/, ''))
  const re2 = /href="(\/(?:product|Product)\/[A-Za-z0-9_\-]+\/?)"/gi
  while ((m = re2.exec(html))) hrefs.add(`https://unitedplugins.com${m[1]}`.replace(/\/$/, ''))

  // Also try products listing
  if (hrefs.size < 5) {
    try {
      const listing = await fetchText('https://unitedplugins.com/')
      while ((m = re.exec(listing))) hrefs.add(m[1].replace(/\/$/, ''))
      while ((m = re2.exec(listing))) hrefs.add(`https://unitedplugins.com${m[1]}`.replace(/\/$/, ''))
    } catch {
      /* ignore */
    }
  }

  const urls = [...hrefs].slice(0, 80)
  let i = 0
  const concurrency = 6
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++]
      try {
        const page = await fetchText(url)
        const plain = page.replace(/<[^>]+>/g, '\n')
        const ver =
          plain.match(/Current\s+version:\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)?.[1] ||
          plain.match(/Version\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)?.[1]
        if (!ver || /^0?2\.\d+$/.test(ver)) continue // skip manager-ish
        const slug = url.split('/').filter(Boolean).pop() || ''
        updates.push({
          manufacturerId: 'united-plugins',
          nameIncludes: slug,
          latestVersion: ver,
          sourceUrl: url,
          label: slug,
          evidence: 'live-scrape',
        })
      } catch (err) {
        errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }
  if (urls.length) await Promise.all(Array.from({ length: concurrency }, () => worker()))
  else errors.push('No United Plugins product URLs discovered')

  return { manufacturerId: 'united-plugins', updates, errors: errors.slice(0, 30) }
}
