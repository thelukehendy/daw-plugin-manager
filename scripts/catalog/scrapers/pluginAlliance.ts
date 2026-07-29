import type { ScrapeResult, VersionUpdate } from '../http'
import { fetchText } from '../http'

interface ShopifyProduct {
  title: string
  handle: string
}

async function fetchTextRetry(url: string, attempts = 5): Promise<string> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchText(url)
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : String(err)
      const retryable = /HTTP 429|HTTP 503|HTTP 502|fetch failed/i.test(msg)
      if (!retryable || i === attempts - 1) throw err
      const waitMs = 1500 * Math.pow(2, i) + Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, waitMs))
    }
  }
  throw lastErr
}

/**
 * Plugin Alliance (Shopify): list products via collection JSON, then scrape each
 * public product page for "Installer vX.Y.Z" (Mac). Portal URLs only — never binaries.
 */
export async function scrapePluginAlliance(): Promise<ScrapeResult> {
  const updates: VersionUpdate[] = []
  const errors: string[] = []
  const products: ShopifyProduct[] = []

  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://www.plugin-alliance.com/collections/all-products/products.json?limit=250&page=${page}`
      const raw = await fetchTextRetry(url)
      const data = JSON.parse(raw) as { products?: ShopifyProduct[] }
      const batch = data.products || []
      if (!batch.length) break
      products.push(...batch.map((p) => ({ title: p.title, handle: p.handle })))
    }
  } catch (err) {
    return {
      manufacturerId: 'plugin-alliance',
      updates: [],
      errors: [err instanceof Error ? err.message : String(err)],
    }
  }

  if (!products.length) {
    return {
      manufacturerId: 'plugin-alliance',
      updates: [],
      errors: ['No products from PA Shopify collection JSON'],
    }
  }

  // Keep concurrency modest — PA returns HTTP 429 under burst load.
  const concurrency = 3
  let i = 0
  async function worker() {
    while (i < products.length) {
      const idx = i++
      const p = products[idx]
      const url = `https://www.plugin-alliance.com/products/${p.handle}`
      try {
        // Small pacing between requests per worker
        await new Promise((r) => setTimeout(r, 200))
        const html = await fetchTextRetry(url)
        const ver =
          html.match(/downloads_installers_mac_text"\]\s*=\s*"Installer v([0-9.]+)/i)?.[1] ||
          html.match(/Installer\s+v([0-9]+\.[0-9]+(?:\.[0-9]+)?)\s*\(Mac/i)?.[1] ||
          html.match(/Installer\s+v([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i)?.[1]
        if (!ver) {
          errors.push(`No Mac installer version on ${url}`)
          continue
        }
        // Prefer handle + title tokens that uniquely identify the product
        const tokens = [
          p.handle.replace(/-/g, ' '),
          p.title,
        ]
        for (const nameIncludes of [...new Set(tokens)]) {
          updates.push({
            manufacturerId: 'plugin-alliance',
            nameIncludes,
            latestVersion: ver,
            sourceUrl: url,
            label: p.title,
            evidence: 'live-scrape',
          })
        }
      } catch (err) {
        errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))

  return {
    manufacturerId: 'plugin-alliance',
    updates,
    errors: errors.slice(0, 60),
  }
}
