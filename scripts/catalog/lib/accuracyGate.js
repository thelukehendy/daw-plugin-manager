#!/usr/bin/env node
/**
 * Accuracy gates for catalog version writes.
 * No guessing: versions must come from real public pages and be confirmable on-page.
 */
const BINARY_RE = /\.(dmg|pkg|exe|zip|msi|rar|7z|iso)(\?|$)/i

function assertPortalUrl(url) {
  if (!url || typeof url !== 'string') throw new Error('Missing portal URL')
  if (!/^https?:\/\//i.test(url)) throw new Error(`Non-http portal: ${url}`)
  if (BINARY_RE.test(url)) throw new Error(`Binary URL rejected: ${url}`)
  if (/example\.com/i.test(url)) throw new Error(`Placeholder URL rejected: ${url}`)
  if (/google\.com\/search/i.test(url)) throw new Error(`Search URL rejected: ${url}`)
}

function normalizeVersion(version) {
  return String(version || '')
    .trim()
    .replace(/^v/i, '')
}

function isSuspiciousVersion(version) {
  const v = normalizeVersion(version)
  if (!v) return true
  const parts = v.split('.')
  const major = Number(parts[0])
  // Marketing prices and dollars often look like versions on product pages.
  if (/^\d+\.(99|95|00)$/.test(v)) return true
  if (Number.isFinite(major) && major >= 50) return true
  // Bare huge integers (SKU-ish) — allow small majors like "9" / "12" only with care elsewhere
  if (parts.length === 1 && Number.isFinite(major) && major >= 100) return true
  return false
}

/** True if page text contains the version (exact or common dotted variants). */
function versionAppearsOnPage(html, version) {
  const v = normalizeVersion(version)
  if (!v || !html) return false
  const text = String(html)
  if (text.includes(v)) return true
  // Tolerate "Version 1.2.3" / "v1.2.3" already stripped; try without trailing .0
  if (/\.0$/.test(v) && text.includes(v.replace(/\.0$/, ''))) return true
  const escaped = v.replace(/\./g, '\\.')
  const re = new RegExp(`(?:^|[^0-9])v?${escaped}(?:[^0-9]|$)`, 'i')
  return re.test(text)
}

async function fetchPageText(url, { timeoutMs = 25000 } = {}) {
  assertPortalUrl(url)
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent':
          'DAW-Plugin-Manager-CatalogBot/1.0 (+https://github.com/thelukehendy/daw-plugin-manager; version-check only)',
        accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8'
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    const finalUrl = res.url || url
    if (BINARY_RE.test(finalUrl)) throw new Error(`Redirected to binary: ${finalUrl}`)
    return { url: finalUrl, text: await res.text() }
  } finally {
    clearTimeout(t)
  }
}

/**
 * Confirm a candidate version against a live page before catalog write.
 * @returns {{ ok: true, finalUrl: string, text: string } | { ok: false, reason: string }}
 */
async function confirmVersionOnPage(sourceUrl, version) {
  try {
    assertPortalUrl(sourceUrl)
  } catch (err) {
    return { ok: false, reason: err.message }
  }
  if (!normalizeVersion(version)) return { ok: false, reason: 'empty version' }
  if (isSuspiciousVersion(version)) {
    return { ok: false, reason: `suspicious version ${version}` }
  }
  try {
    const page = await fetchPageText(sourceUrl)
    if (!versionAppearsOnPage(page.text, version)) {
      return { ok: false, reason: `version ${version} not found on page`, finalUrl: page.url }
    }
    return { ok: true, finalUrl: page.url, text: page.text }
  } catch (err) {
    return { ok: false, reason: err.message || String(err) }
  }
}

/** Extract dotted versions from HTML near a product name hint when possible. */
function extractVersionsFromHtml(html, { nameHint } = {}) {
  const text = String(html || '')
  const versions = []
  const re = /\bv?(\d+\.\d+(?:\.\d+){0,3})\b/g
  let m
  while ((m = re.exec(text))) {
    const v = m[1]
    if (isSuspiciousVersion(v)) continue
    versions.push({ version: v, index: m.index })
  }
  if (!nameHint) {
    // Prefer denser / longer versions; unique preserve order
    const seen = new Set()
    const out = []
    for (const row of versions) {
      if (seen.has(row.version)) continue
      seen.add(row.version)
      out.push(row.version)
    }
    return out.slice(0, 20)
  }
  const hint = String(nameHint).toLowerCase()
  const lower = text.toLowerCase()
  // Require product hint on page — otherwise shared manufacturer portals cause false matches
  const hintIdx = lower.indexOf(hint)
  if (hintIdx < 0) {
    // try simplified hint (strip manufacturer prefix words)
    const simplified = hint.replace(/^(izotope|fabfilter|goodhertz|waves)\s+/i, '').trim()
    const idx2 = simplified.length >= 4 ? lower.indexOf(simplified) : -1
    if (idx2 < 0) return []
    return rankNear(versions, idx2)
  }
  return rankNear(versions, hintIdx)
}

function rankNear(versions, hintIdx) {
  // Tight window: shared download portals otherwise match unrelated prices/builds.
  const ranked = versions
    .map((r) => ({ ...r, dist: Math.abs(r.index - hintIdx) }))
    .filter((r) => r.dist < 500)
    .sort((a, b) => a.dist - b.dist || b.version.length - a.version.length)
  const seen = new Set()
  const out = []
  for (const r of ranked) {
    if (seen.has(r.version)) continue
    seen.add(r.version)
    out.push(r.version)
    if (out.length >= 8) break
  }
  return out
}

/** True when version appears close to the product name on the page. */
function versionNearProductName(html, version, product, maxDist = 500) {
  const text = String(html || '')
  const lower = text.toLowerCase()
  const v = normalizeVersion(version)
  if (!v || !product) return false
  const names = [String(product).toLowerCase()]
  const short = names[0].replace(/^(izotope|fabfilter|goodhertz|waves|plugin alliance)\s+/i, '')
  if (short.length >= 4 && short !== names[0]) names.push(short)

  let nameIdx = -1
  for (const n of names) {
    const i = lower.indexOf(n)
    if (i >= 0) {
      nameIdx = i
      break
    }
  }
  if (nameIdx < 0) return false

  const verRe = new RegExp(`(?:^|[^0-9])v?${v.replace(/\./g, '\\.')}(?:[^0-9]|$)`, 'ig')
  let m
  let best = Infinity
  while ((m = verRe.exec(text))) {
    best = Math.min(best, Math.abs(m.index - nameIdx))
  }
  return best <= maxDist
}

module.exports = {
  BINARY_RE,
  assertPortalUrl,
  normalizeVersion,
  isSuspiciousVersion,
  versionAppearsOnPage,
  versionNearProductName,
  fetchPageText,
  confirmVersionOnPage,
  extractVersionsFromHtml
}
