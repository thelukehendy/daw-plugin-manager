/**
 * Catalog feed v2 — pointer + commit-pinned download + sha256.
 * Pointer URL and pinned endpoints stay in the main process. Never send them
 * (or hashes / commits) to the renderer.
 */

import { sha256Hex } from '../platform'

export const CATALOG_VERIFY_USER_MESSAGE = "Couldn't verify the catalog"

/** Mutable branch catalog.json — v2 must never fetch this for updates. */
export const MUTABLE_BRANCH_CATALOG_RE =
  /(?:@main|\/main)\/catalog\/catalog\.json(?:[?#]|$)/i

export const CATALOG_VERSION_POINTER_URL =
  'https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog-version.json'

const PINNED_JSDELIVR =
  /^https:\/\/cdn\.jsdelivr\.net\/gh\/thelukehendy\/daw-plugin-manager@[a-f0-9]{40}\/catalog\/catalog\.json$/i

const PINNED_RAW =
  /^https:\/\/raw\.githubusercontent\.com\/thelukehendy\/daw-plugin-manager\/[a-f0-9]{40}\/catalog\/catalog\.json$/i

const SHA256_HEX = /^[a-f0-9]{64}$/i
const GIT_COMMIT = /^[a-f0-9]{40}$/i

/** Catalog JSON schema the app can parse (v3 core + v5/v6 extras). */
export const MIN_SUPPORTED_SCHEMA_VERSION = 3
export const MAX_SUPPORTED_SCHEMA_VERSION = 6
export const SUPPORTED_FEED_VERSION = 1

export const POINTER_FETCH_TIMEOUT_MS = 8_000
export const CATALOG_FETCH_TIMEOUT_MS = 60_000

export class CatalogVerifyError extends Error {
  constructor() {
    super(CATALOG_VERIFY_USER_MESSAGE)
    this.name = 'CatalogVerifyError'
  }
}

export interface CatalogPointer {
  feedVersion: number
  buildId: string
  catalogCommit: string
  sha256: string
  sizeBytes: number | null
  schemaVersion: number
  endpoints: {
    jsdelivrPinned: string
    rawPinned: string
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

export function isSupportedSchemaVersion(version: unknown): version is number {
  return (
    typeof version === 'number' &&
    Number.isInteger(version) &&
    version >= MIN_SUPPORTED_SCHEMA_VERSION &&
    version <= MAX_SUPPORTED_SCHEMA_VERSION
  )
}

/** ISO buildIds compare as timestamps; otherwise lexicographic. */
export function compareBuildId(a: string, b: string): number {
  const ta = Date.parse(a)
  const tb = Date.parse(b)
  if (Number.isFinite(ta) && Number.isFinite(tb)) {
    if (ta === tb) return 0
    return ta > tb ? 1 : -1
  }
  if (a === b) return 0
  return a > b ? 1 : -1
}

export function isMutableBranchCatalogUrl(url: string): boolean {
  return MUTABLE_BRANCH_CATALOG_RE.test(url)
}

export function isAllowedPinnedCatalogUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  if (isMutableBranchCatalogUrl(url)) return false
  return PINNED_JSDELIVR.test(url) || PINNED_RAW.test(url)
}

function commitFromPinnedUrl(url: string): string | null {
  const m = url.match(/[a-f0-9]{40}/i)
  return m ? m[0].toLowerCase() : null
}

export function pointerUrlWithCacheBust(now = Date.now()): string {
  return `${CATALOG_VERSION_POINTER_URL}?t=${now}`
}

/**
 * Parse catalog-version.json. Unparseable schemaVersion / feedVersion → null
 * (caller refuses the pointer). Extra fields are ignored.
 */
export function parseCatalogPointer(raw: unknown): CatalogPointer | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const feedVersion = o.feedVersion
  if (feedVersion !== SUPPORTED_FEED_VERSION) return null

  const buildId = typeof o.buildId === 'string' ? o.buildId.trim() : ''
  if (!buildId) return null

  const sha256 = typeof o.sha256 === 'string' ? o.sha256.trim().toLowerCase() : ''
  if (!SHA256_HEX.test(sha256)) return null

  const schemaVersion = o.schemaVersion
  if (typeof schemaVersion !== 'number' || !Number.isInteger(schemaVersion)) return null

  const endpoints = o.endpoints
  if (!endpoints || typeof endpoints !== 'object') return null
  const ep = endpoints as Record<string, unknown>
  const jsdelivrPinned = typeof ep.jsdelivrPinned === 'string' ? ep.jsdelivrPinned.trim() : ''
  const rawPinned = typeof ep.rawPinned === 'string' ? ep.rawPinned.trim() : ''
  if (!isAllowedPinnedCatalogUrl(jsdelivrPinned) || !isAllowedPinnedCatalogUrl(rawPinned)) {
    return null
  }

  const catalogCommit =
    typeof o.catalogCommit === 'string' ? o.catalogCommit.trim().toLowerCase() : ''
  if (catalogCommit) {
    if (!GIT_COMMIT.test(catalogCommit)) return null
    const jsCommit = commitFromPinnedUrl(jsdelivrPinned)
    const rawCommit = commitFromPinnedUrl(rawPinned)
    if (jsCommit !== catalogCommit || rawCommit !== catalogCommit) return null
  }

  const sizeBytes =
    typeof o.sizeBytes === 'number' && Number.isFinite(o.sizeBytes) && o.sizeBytes >= 0
      ? o.sizeBytes
      : null

  return {
    feedVersion,
    buildId,
    catalogCommit,
    sha256,
    sizeBytes,
    schemaVersion,
    endpoints: { jsdelivrPinned, rawPinned },
  }
}

async function fetchWithTimeout(
  fetchFn: FetchLike,
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<Response> {
  if (isMutableBranchCatalogUrl(url)) {
    throw new CatalogVerifyError()
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetchFn(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchCatalogPointer(options?: {
  fetch?: FetchLike
  now?: number
}): Promise<CatalogPointer> {
  const fetchFn = options?.fetch || fetch
  const url = pointerUrlWithCacheBust(options?.now ?? Date.now())
  let res: Response
  try {
    res = await fetchWithTimeout(fetchFn, url, POINTER_FETCH_TIMEOUT_MS, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    })
  } catch {
    throw new CatalogVerifyError()
  }
  if (!res.ok) throw new CatalogVerifyError()
  let parsed: unknown
  try {
    parsed = JSON.parse(await res.text())
  } catch {
    throw new CatalogVerifyError()
  }
  const pointer = parseCatalogPointer(parsed)
  if (!pointer) throw new CatalogVerifyError()
  return pointer
}

async function fetchCatalogBytes(
  fetchFn: FetchLike,
  url: string
): Promise<Uint8Array | null> {
  if (!isAllowedPinnedCatalogUrl(url)) return null
  try {
    const res = await fetchWithTimeout(fetchFn, url, CATALOG_FETCH_TIMEOUT_MS, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const buf = new Uint8Array(await res.arrayBuffer())
    return buf.byteLength ? buf : null
  } catch {
    return null
  }
}

async function digestMatches(bytes: Uint8Array, pointer: CatalogPointer): Promise<boolean> {
  return (await sha256Hex(bytes)) === pointer.sha256
}

/**
 * GET jsdelivrPinned, fallback rawPinned. On sha256 mismatch, retry rawPinned
 * once, then CatalogVerifyError. Never fetches mutable @main catalog.json.
 */
export async function fetchVerifiedCatalogBytes(
  pointer: CatalogPointer,
  options?: { fetch?: FetchLike }
): Promise<Uint8Array> {
  if (!isSupportedSchemaVersion(pointer.schemaVersion)) {
    throw new CatalogVerifyError()
  }
  const fetchFn = options?.fetch || fetch
  const primary = pointer.endpoints.jsdelivrPinned
  const fallback = pointer.endpoints.rawPinned

  let bytes = await fetchCatalogBytes(fetchFn, primary)
  if (!bytes) bytes = await fetchCatalogBytes(fetchFn, fallback)
  if (!bytes) throw new CatalogVerifyError()

  if (await digestMatches(bytes, pointer)) return bytes

  console.warn('[catalog] v2 digest mismatch; retrying pinned fallback')
  const retry = await fetchCatalogBytes(fetchFn, fallback)
  if (retry && (await digestMatches(retry, pointer))) return retry

  console.warn('[catalog] v2 digest mismatch after retry; keeping installed catalog')
  throw new CatalogVerifyError()
}
