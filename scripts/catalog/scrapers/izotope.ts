import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'
import { loadKnownSources, sourcesForManufacturer } from '../knownSources'

/**
 * iZotope publishes per-product public release notes under
 *   https://www.izotope.com/pages/release-notes/<product>
 * with lines like "Version 12.1.0 released April 28, 2026".
 */
export async function scrapeIzotope(): Promise<ScrapeResult> {
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  const known = sourcesForManufacturer(loadKnownSources(), 'izotope')

  // Fallback curated list if registry is empty
  const fallback: Array<{ url: string; nameIncludes: string; label: string }> = [
    {
      url: 'https://www.izotope.com/pages/release-notes/ozone-standard',
      nameIncludes: 'Ozone 1',
      label: 'Ozone',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/neutron',
      nameIncludes: 'Neutron 5',
      label: 'Neutron',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/nectar',
      nameIncludes: 'Nectar 4',
      label: 'Nectar',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/rx-standard',
      nameIncludes: 'RX 1',
      label: 'RX',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/vocalsynth',
      nameIncludes: 'VocalSynth',
      label: 'VocalSynth',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/neoverb',
      nameIncludes: 'Neoverb',
      label: 'Neoverb',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/insight',
      nameIncludes: 'Insight',
      label: 'Insight',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/trash',
      nameIncludes: 'Trash',
      label: 'Trash',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/relay',
      nameIncludes: 'Relay',
      label: 'Relay',
    },
    {
      url: 'https://www.izotope.com/pages/release-notes/tonal-balance-control',
      nameIncludes: 'Tonal Balance',
      label: 'Tonal Balance Control',
    },
  ]

  const pages =
    known.length > 0
      ? known.map((s) => ({
          url: s.url,
          nameIncludes: s.nameIncludes || guessNameFromUrl(s.url),
          label: s.label || s.nameIncludes || guessNameFromUrl(s.url),
        }))
      : fallback

  // Prefer Advanced/Standard pages; de-dupe by nameIncludes keeping highest version later
  const byProduct = new Map<string, VersionUpdate>()

  for (const p of pages) {
    try {
      const html = await fetchText(p.url)
      const plain = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, '\n')
      const ver =
        plain.match(/Version\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s+released/i)?.[1] ||
        html.match(/Version\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s+released/i)?.[1]
      if (!ver) {
        errors.push(`No "Version X.Y.Z released" on ${p.url}`)
        continue
      }
      const major = Number(ver.split('.')[0])
      if (major >= 50) {
        errors.push(`Rejected suspicious version ${ver} on ${p.url}`)
        continue
      }
      const key = (p.nameIncludes || p.label).toLowerCase()
      const prev = byProduct.get(key)
      if (!prev || versionScore(ver) > versionScore(prev.latestVersion)) {
        byProduct.set(key, {
          manufacturerId: 'izotope',
          nameIncludes: p.nameIncludes,
          latestVersion: ver,
          sourceUrl: p.url,
          label: p.label,
          evidence: 'live-scrape',
        })
      }
    } catch (err) {
      errors.push(`${p.url}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  updates.push(...byProduct.values())
  if (!updates.length) {
    errors.push('No iZotope release-notes versions parsed')
  }
  return { manufacturerId: 'izotope', updates, errors }
}

function guessNameFromUrl(url: string): string {
  const slug = url.split('/').filter(Boolean).pop() || ''
  return slug
    .replace(/-standard|-advanced|-elements$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function versionScore(v: string): number {
  return v.split('.').reduce((acc, part, i) => acc + Number(part) * Math.pow(1000, 3 - i), 0)
}
