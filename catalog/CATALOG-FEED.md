# Catalog feed v2 — immutable, staleness-proof fetching

**Audience:** Cursor / the Electron app. **Status:** live as of 2026-09-19.
Supersedes §2 ("How the app resolves its catalog today") of
`CATALOG-FRESHNESS.md` — the chain of custody in §1 is unchanged.

## The problem this kills

`catalog/catalog.json` is overwritten in place every push. Any fetch of the
mutable branch URL can return a cached older copy (jsDelivr edge cache held a
pre-fix catalog for hours on 2026-09-18). The v2 feed makes staleness
structurally impossible instead of racing cache expiry.

## How it works

Each daily push now publishes two things:

1. `catalog/catalog.json` — the full catalog (unchanged, still updated daily).
2. `catalog/catalog-version.json` — a tiny pointer (~700 bytes):

```json
{
  "feedVersion": 1,
  "buildId": "2026-09-19T13:02:03Z",
  "catalogCommit": "76937ff005124928387ac0c6dc94fd13dcf23fd8",
  "sha256": "7d5883f4037adc0f141fe8dcb1f327b90237b1fc2ceee304dcadf8e7d5a076ff",
  "sizeBytes": 7706615,
  "schemaVersion": 3,
  "counts": { "manufacturers": 660, "plugins": 9494, "tier1Plugins": 4389 },
  "endpoints": {
    "jsdelivrPinned": "https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@<commit>/catalog/catalog.json",
    "rawPinned": "https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/<commit>/catalog/catalog.json"
  }
}
```

The `catalogCommit` is the exact GitHub commit that contains that build's
`catalog.json`. A commit-pinned URL is **immutable** — its bytes can never
change — so CDN caching is correct behavior, not a staleness vector.

## App fetch flow (implement in `catalogService.ts`)

```
1. GET https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog-version.json?t=<Date.now()>
   (tiny file; raw serves it with ~5 min cache, the ?t= cache-buster makes it fresh)
2. If pointer.buildId <= last installed buildId → nothing to do.
3. Else GET pointer.endpoints.jsdelivrPinned
   (immutable commit URL — safe to cache forever; fast via CDN)
   Fallback on failure: pointer.endpoints.rawPinned.
4. sha256(downloaded bytes) MUST equal pointer.sha256 before install.
   On mismatch: discard, keep the old catalog, retry rawPinned once, then surface an error.
5. Install atomically, persist buildId, display "Catalog as of <buildId>" in the UI.
```

Notes:

- Keep the bundled `catalog.json` as the offline fallback; the v2 feed only
  ever *upgrades* from it, never downgrades (`buildId` comparison).
- The pointer's `schemaVersion` lets the app refuse builds it can't parse.
- A manual "Refresh catalog" action re-runs step 1 on demand.
- Do **not** fetch the mutable branch URL
  (`...@main/catalog/catalog.json`) for update checks anymore — it is kept for
  backward compatibility only.

## Why not the alternatives

- *Freshness check that alarms after the fact:* kept as a server-side backstop
  (the push job verifies both endpoints after every push), but alarming is
  worse than making the failure mode impossible.
- *Versioned filenames in the repo* (`catalog-2026-09-19.json`): would add
  ~7.4 MB of blobs to git history every day (~2.7 GB/yr). Commit pinning gets
  the same immutability with zero repo bloat.
- *jsDelivr purge API:* purge latency is unreliable; deterministic URLs beat
  cache invalidation.

## Rollout

- The pointer is published from the 2026-09-19 push onward; `catalog.json`
  keeps updating in place, so the old fetch path keeps working during
  migration.
- After the app ships the v2 flow, the branch-URL fetch path can be removed.
