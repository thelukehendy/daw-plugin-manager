/**
 * Catalog feed v2: pointer → pinned bytes → sha256 → atomic install.
 * Run: npx tsx scripts/test-catalog-feed-v2.ts
 */
import assert from 'assert'
import { createHash } from 'crypto'
import { mkdtemp, writeFile, mkdir } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  CATALOG_VERIFY_USER_MESSAGE,
  CATALOG_VERSION_POINTER_URL,
  CatalogVerifyError,
  compareBuildId,
  fetchVerifiedCatalogBytes,
  isAllowedPinnedCatalogUrl,
  isMutableBranchCatalogUrl,
  isSupportedSchemaVersion,
  parseCatalogPointer,
  pointerUrlWithCacheBust,
} from '../src/main/catalog/catalogFeed'
import { setPlatform, sha256Hex } from '../src/main/platform'
import { createNodePlatform } from '../src/main/nodePlatform'
import { loadCatalog, refreshCatalog } from '../src/main/catalog/catalogService'
import { rendererCatalogMeta, publicCatalogOrigin } from '../src/main/catalog/publicFacing'
import { loadInstalledCatalog } from '../src/main/catalog/catalogCache'

const COMMIT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const JSDELIVR = `https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@${COMMIT}/catalog/catalog.json`
const RAW = `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/${COMMIT}/catalog/catalog.json`
const MUTABLE_RAW =
  'https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json'
const MUTABLE_JSDELIVR =
  'https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@main/catalog/catalog.json'

const BUNDLED_CATALOG = {
  schemaVersion: 3,
  updatedAt: '2026-09-18T17:18:28Z',
  catalogSource: 'store-export:v4',
  manufacturers: [{ id: 'm', name: 'Old', updatePortalUrl: 'https://example.com' }],
  plugins: [{ id: 'p', manufacturerId: 'm', name: 'Old Plug', matchPatterns: ['Old Plug'] }],
}

const NEW_CATALOG = {
  schemaVersion: 3,
  updatedAt: '2026-09-20T00:00:00Z',
  catalogSource: 'store-export:v4',
  manufacturers: [{ id: 'm', name: 'New', updatePortalUrl: 'https://example.com' }],
  plugins: [{ id: 'p', manufacturerId: 'm', name: 'New Plug', matchPatterns: ['New Plug'] }],
}

const NEW_BYTES = Buffer.from(JSON.stringify(NEW_CATALOG))
const NEW_HASH = createHash('sha256').update(NEW_BYTES).digest('hex')
const BAD_BYTES = Buffer.from('{"not":"a catalog"}')

function pointer(overrides: Record<string, unknown> = {}) {
  return {
    feedVersion: 1,
    buildId: '2026-09-20T00:00:00Z',
    catalogCommit: COMMIT,
    sha256: NEW_HASH,
    sizeBytes: NEW_BYTES.byteLength,
    schemaVersion: 3,
    endpoints: { jsdelivrPinned: JSDELIVR, rawPinned: RAW },
    ...overrides,
  }
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function bytesRes(bytes: Uint8Array | Buffer, status = 200): Response {
  return new Response(Buffer.from(bytes), { status })
}

async function fixtureDirs() {
  const root = await mkdtemp(join(tmpdir(), 'catalog-feed-v2-'))
  const bundledPath = join(root, 'bundled-catalog.json')
  await writeFile(bundledPath, JSON.stringify(BUNDLED_CATALOG))
  const userDataPath = join(root, 'userData')
  await mkdir(userDataPath, { recursive: true })
  setPlatform(createNodePlatform({ userDataDir: userDataPath, bundledCatalogPath: bundledPath }))
  return { root, bundledPath, userDataPath }
}

type FetchMock = (url: string) => Promise<Response>

function recordingFetch(handler: FetchMock) {
  const urls: string[] = []
  const fetchFn = async (url: string) => {
    urls.push(url)
    return handler(url)
  }
  return { fetchFn, urls }
}

function assertNoLeak(text: string) {
  assert.doesNotMatch(
    text,
    /https?:\/\/|raw\.githubusercontent|jsdelivr|github\.com|catalog-store|muse\s*db|sha256|catalogSource/i
  )
}

// —— pointer parse ——
assert.ok(parseCatalogPointer(pointer()))
assert.equal(parseCatalogPointer(pointer({ schemaVersion: '3' })), null)
assert.equal(parseCatalogPointer(pointer({ schemaVersion: Number.NaN })), null)
assert.equal(parseCatalogPointer(pointer({ feedVersion: 2 })), null)
assert.equal(parseCatalogPointer(pointer({ sha256: 'abc' })), null)
assert.equal(
  parseCatalogPointer(
    pointer({
      endpoints: {
        jsdelivrPinned: MUTABLE_JSDELIVR,
        rawPinned: RAW,
      },
    })
  ),
  null
)
assert.ok(isSupportedSchemaVersion(3))
assert.ok(isSupportedSchemaVersion(6))
assert.ok(!isSupportedSchemaVersion(99))
assert.ok(!isSupportedSchemaVersion('3'))

assert.ok(isAllowedPinnedCatalogUrl(JSDELIVR))
assert.ok(isAllowedPinnedCatalogUrl(RAW))
assert.ok(!isAllowedPinnedCatalogUrl(MUTABLE_RAW))
assert.ok(!isAllowedPinnedCatalogUrl(MUTABLE_JSDELIVR))
assert.ok(isMutableBranchCatalogUrl(MUTABLE_RAW))
assert.ok(isMutableBranchCatalogUrl(MUTABLE_JSDELIVR))
assert.ok(!isMutableBranchCatalogUrl(CATALOG_VERSION_POINTER_URL + '?t=1'))
assert.ok(!isMutableBranchCatalogUrl(JSDELIVR))

assert.equal(compareBuildId('2026-09-20T00:00:00Z', '2026-09-18T17:18:28Z'), 1)
assert.equal(compareBuildId('2026-09-18T17:18:28Z', '2026-09-20T00:00:00Z'), -1)
assert.equal(compareBuildId('2026-09-20T00:00:00Z', '2026-09-20T00:00:00Z'), 0)

sha256Hex(NEW_BYTES).then((h) => assert.equal(h, NEW_HASH))
assert.equal(pointerUrlWithCacheBust(42), `${CATALOG_VERSION_POINTER_URL}?t=42`)

const verifyErr = new CatalogVerifyError()
assert.equal(verifyErr.message, CATALOG_VERIFY_USER_MESSAGE)
assertNoLeak(verifyErr.message)
assert.ok(!verifyErr.message.includes(COMMIT))
assert.ok(!verifyErr.message.includes(NEW_HASH))

async function main() {
  // —— sha256 mismatch retries rawPinned once ——
  {
    let rawHits = 0
    const { fetchFn, urls } = recordingFetch(async (url) => {
      if (url === JSDELIVR) return bytesRes(BAD_BYTES)
      if (url === RAW) {
        rawHits++
        return bytesRes(NEW_BYTES)
      }
      throw new Error(`unexpected ${url}`)
    })
    const bytes = await fetchVerifiedCatalogBytes(parseCatalogPointer(pointer())!, {
      fetch: fetchFn,
    })
    assert.equal(await sha256Hex(bytes), NEW_HASH)
    assert.equal(rawHits, 1)
    assert.ok(urls.includes(JSDELIVR))
    assert.ok(urls.includes(RAW))
    assert.ok(!urls.some((u) => isMutableBranchCatalogUrl(u)))
  }

  {
    const { fetchFn } = recordingFetch(async (url) => {
      if (url === JSDELIVR || url === RAW) return bytesRes(BAD_BYTES)
      throw new Error(`unexpected ${url}`)
    })
    await assert.rejects(
      () => fetchVerifiedCatalogBytes(parseCatalogPointer(pointer())!, { fetch: fetchFn }),
      (err: unknown) => {
        assert.ok(err instanceof CatalogVerifyError)
        assert.equal((err as Error).message, CATALOG_VERIFY_USER_MESSAGE)
        assertNoLeak((err as Error).message)
        return true
      }
    )
  }

  // —— loadCatalog v2 upgrade / skip / provenance ——
  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const { fetchFn, urls } = recordingFetch(async (url) => {
      if (url.startsWith(CATALOG_VERSION_POINTER_URL)) return jsonRes(pointer())
      if (url === JSDELIVR) return bytesRes(NEW_BYTES)
      throw new Error(`unexpected ${url}`)
    })
    const catalog = await loadCatalog({
      fetch: fetchFn,
      now: 99,
    })
    assert.equal(catalog.catalogBuildId, '2026-09-20T00:00:00Z')
    assert.equal(catalog.plugins[0].name, 'New Plug')
    assert.equal(catalog.catalogSource, 'remote:v2')
    const meta = rendererCatalogMeta(catalog)
    assert.equal(meta.source, 'online')
    assert.equal(meta.updatedAt, '2026-09-20T00:00:00Z')
    assertNoLeak(meta.source)
    assert.equal(publicCatalogOrigin(catalog.catalogSource), 'online')
    assert.ok(urls[0] === `${CATALOG_VERSION_POINTER_URL}?t=99`)
    assert.ok(urls.includes(JSDELIVR))
    assert.ok(!urls.some((u) => isMutableBranchCatalogUrl(u)))
    assert.ok(!urls.some((u) => /@main\/catalog\/catalog\.json/.test(u)))

    const installed = await loadInstalledCatalog()
    assert.ok(installed)
    assert.equal(installed.meta.buildId, '2026-09-20T00:00:00Z')
    const metaJson = JSON.stringify(installed.meta)
    assert.ok(!/https?:\/\//.test(metaJson))
    assert.ok(!metaJson.includes('jsdelivr'))
    assert.ok(!metaJson.includes('github'))
  }

  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const { fetchFn, urls } = recordingFetch(async (url) => {
      if (url.startsWith(CATALOG_VERSION_POINTER_URL)) {
        return jsonRes(pointer({ buildId: '2026-09-10T00:00:00Z' }))
      }
      throw new Error(`body fetch should not run when pointer is older: ${url}`)
    })
    const catalog = await loadCatalog({
      fetch: fetchFn,
      now: 1,
    })
    assert.equal(catalog.catalogBuildId, '2026-09-18T17:18:28Z')
    assert.equal(catalog.plugins[0].name, 'Old Plug')
    assert.equal(rendererCatalogMeta(catalog).source, 'shipped')
    assert.equal(urls.length, 1)
    assert.ok(urls[0].startsWith(CATALOG_VERSION_POINTER_URL))
  }

  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const catalog = await loadCatalog({
      preferBundled: true,
      fetch: async () => {
        throw new Error('fetch must not run when preferBundled')
      },
    })
    assert.equal(catalog.catalogSource, 'bundled')
    assert.equal(rendererCatalogMeta(catalog).source, 'shipped')
  }

  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const { fetchFn } = recordingFetch(async (url) => {
      if (url.startsWith(CATALOG_VERSION_POINTER_URL)) {
        return jsonRes(pointer({ schemaVersion: 99, buildId: '2026-09-21T00:00:00Z' }))
      }
      throw new Error(`must not download unparseable schema: ${url}`)
    })
    await assert.rejects(
      () =>
        refreshCatalog({
          fetch: fetchFn,
          now: 2,
        }),
      (err: unknown) => {
        assert.ok(err instanceof CatalogVerifyError)
        assert.equal((err as Error).message, "Couldn't verify the catalog")
        assertNoLeak((err as Error).message)
        return true
      }
    )
    const kept = await loadCatalog({
      preferBundled: true,
    })
    assert.equal(kept.plugins[0].name, 'Old Plug')
  }

  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const { fetchFn, urls } = recordingFetch(async (url) => {
      if (url.startsWith(CATALOG_VERSION_POINTER_URL)) return jsonRes(pointer())
      if (url === JSDELIVR) return new Response(null, { status: 500 })
      if (url === RAW) return bytesRes(NEW_BYTES)
      throw new Error(`unexpected ${url}`)
    })
    const catalog = await loadCatalog({
      fetch: fetchFn,
      now: 3,
    })
    assert.equal(catalog.plugins[0].name, 'New Plug')
    assert.ok(urls.includes(JSDELIVR))
    assert.ok(urls.includes(RAW))
  }

  {
    const { bundledPath, userDataPath } = await fixtureDirs()
    const { fetchFn } = recordingFetch(async (url) => {
      if (url.startsWith(CATALOG_VERSION_POINTER_URL)) return jsonRes(pointer())
      if (url === JSDELIVR || url === RAW) return bytesRes(BAD_BYTES)
      throw new Error(`unexpected ${url}`)
    })
    await assert.rejects(
      () =>
        refreshCatalog({
          fetch: fetchFn,
          now: 4,
        }),
      (err: unknown) => err instanceof CatalogVerifyError
    )
    const kept = await loadCatalog({
      preferBundled: true,
    })
    assert.equal(kept.plugins[0].name, 'Old Plug')
  }

  {
    const meta = rendererCatalogMeta({
      schemaVersion: 3,
      updatedAt: '2026-09-18T17:18:28Z',
      catalogSource: 'bundled',
      catalogBuildId: '2026-09-18T17:18:28Z',
      manufacturers: [],
      plugins: [],
    })
    assert.equal(meta.source, 'shipped')
    assert.deepEqual(Object.keys(meta).sort(), [
      'manufacturerCount',
      'pluginCount',
      'source',
      'updatedAt',
    ])
  }

  console.log('test-catalog-feed-v2: ok')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
