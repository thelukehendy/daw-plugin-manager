/** Shared HTTP + parse helpers for catalog scrapers (no circular imports). */

const BINARY_RE = /\.(dmg|pkg|exe|zip|msi|rar|7z|iso)(\?|$)/i

export function assertPortalUrl(url: string): void {
  if (!/^https?:\/\//i.test(url)) throw new Error(`Non-http portal: ${url}`)
  if (BINARY_RE.test(url)) throw new Error(`Binary URL rejected: ${url}`)
}

export async function fetchText(url: string): Promise<string> {
  assertPortalUrl(url)
  const res = await fetch(url, {
    headers: {
      'user-agent':
        'DAW-Plugin-Manager-CatalogBot/1.0 (+https://github.com/daw-plugin-manager; version-check only)',
      accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const finalUrl = res.url || url
  if (BINARY_RE.test(finalUrl)) throw new Error(`Redirected to binary: ${finalUrl}`)
  return await res.text()
}

export function extractSuiteVersion(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1]) return m[1]
  }
  return null
}

export interface VersionUpdate {
  manufacturerId?: string
  pluginId?: string
  nameIncludes?: string
  latestVersion: string
  sourceUrl: string
  releaseDate?: string
  label?: string
  /** Defaults to live-scrape when omitted. */
  evidence?: import('../../src/shared/types').VersionEvidence
}

export interface ScrapeResult {
  manufacturerId: string
  updates: VersionUpdate[]
  errors?: string[]
}
