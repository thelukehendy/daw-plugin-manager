# Catalog freshness: where the correct links live, and how the app must fetch them

**Audience:** Cursor / the Electron app. **Purpose:** make sure the app always
renders portal/download links from the current catalog, never from stale
copies or engine scratch files.

## 1. Chain of custody (the only path a link may travel)

```
research DB (catalog-store/data/catalog.db)
  → catalog-store/src/export_catalog.py
  → catalog-store/out/catalog.json
  → byte-identical copy at catalog/catalog.json
  → pushed to GitHub main
  → app fetches it (see §2)
```

`updatePortalUrl` (and `latestVersion`) are **owned by the research-engine
export**. Rules:

- **Never hand-edit** portal URLs in `catalog/catalog.json`. A bad link is
  fixed in the DB by the research engine, then re-exported — never patched in
  the JSON.
- **Never let scripts write portal/version fields into `catalog.json`.**
  `scripts/catalog/antigravity-scrub.js` (`markVerified`) and
  `scripts/catalog/flash-extract.js` both do
  `plugin.updatePortalUrl = plugin.updatePortalUrl || sourceUrl`. A version-
  *evidence* URL is not a download portal, and stamping `latestVersion` there
  bypasses the Policy A pipeline (accepted observations only). Scrubs must
  write findings to a separate file or run dry — never mutate `catalog.json`.
- **Engine scratch files are not catalog data.** `gap-queue.json`,
  `known-sources.json`, `coverage-report.json`, `backups/`, `playbooks/`,
  `universe-expansion-*.json` may contain old, rejected, or investigative URLs
  (the dead `slatedigital.com/activate/` link survived for weeks in
  `gap-queue.json` *after* the real catalog was fixed). The app must never
  render a link from any of these.

## 2. How the app resolves its catalog today

`src/main/catalog/catalogService.ts` → `loadCatalog()`:

1. **Bundled:** first `catalog/catalog.json` found on disk — in dev that's the
   repo file (`process.cwd()/catalog/catalog.json`); in a packaged build it's
   the copy baked into `resourcePath` at build time.
2. **Remote:** URLs from `catalog/remote-urls.json`, tried in order —
   **currently jsdelivr first, `raw.githubusercontent.com` second**, 8s
   timeout each (`fetchRemoteCatalog`).
3. **Newer `updatedAt` wins** (`remoteTime >= bundledTime ? remote : bundled`).
   If the fetch fails, the bundled copy is used **silently**.

`catalogSource` on the loaded catalog tells you which one won
(`remote:<url>` vs `bundled:<path>`).

## 3. Staleness vectors — why a fixed link can still show as broken

Real incident, 2026-09-18: the Slate Digital portal fix
(`slatedigital.com/activate/` → `app.completeaccess.audio/installers`) was
live on `main` from 09:20 PDT, yet the app still opened the dead URL at 10:04
and 10:23 PDT. The data was correct; the app was reading a stale copy.

- **(a) jsdelivr CDN cache.** `cdn.jsdelivr.net/gh/…@main/…` caches the file
  and can serve the *previous* revision for hours after a push. The app tries
  jsdelivr **first**, so a cached pre-fix file wins the race. **Fix:** put
  `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`
  **first** in `catalog/remote-urls.json` (it tracks `main` within minutes) and
  keep jsdelivr as the fallback. After an engine push you can also force-purge:
  `https://purge.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@main/catalog/catalog.json`.
- **(b) Bundled copy shadowing remote.** If the on-disk/packaged
  `catalog.json` has `updatedAt` ≥ the fetched remote's, the app uses the
  bundled file — even when its *content* predates a fix. Happens when running
  from a repo checkout that hasn't pulled, or a packaged build made before the
  fix. **Fix:** when a remote fetch succeeds, prefer it (at minimum on ties);
  after catalog updates, re-pull (dev) or rebuild (packaged).
- **(c) Silent fallback.** A failed fetch falls back to bundled with no
  visible signal. **Fix:** log `catalogSource` + `updatedAt` at startup and
  surface it in the UI (e.g. Settings → "Catalog as of \<date\> (\<source\>)"),
  so a stale-link report can be diagnosed in seconds.
- **(d) Scrub writes (see §1).** If a Cursor-side scrub ever commits a
  mutated `catalog.json`, bad links get *republished*. Keep scrubs away from
  the published file.

## 4. Verification protocol (when a bad link is reported)

1. Read the app's loaded catalog `catalogSource` and `updatedAt` (add the
   §3c logging if it's missing).
2. Fetch the raw file directly and compare:
   `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`
   — check its `updatedAt` and the manufacturer's `updatePortalUrl`.
3. If raw is correct but the app shows the old link → the app is on a stale
   copy: purge jsdelivr (§3a), restart/re-pull so the bundled copy is fresh
   (§3b), and confirm `catalogSource` flips to the fresh remote.
4. Only if raw is *also* wrong is it a data problem — then it goes to the
   research engine (DB fix + re-export), never a hand-edit.

## 5. Future-proofing checklist

- [ ] `catalog/remote-urls.json`: `raw.githubusercontent.com` first,
      jsdelivr fallback.
- [ ] Startup log + UI surface: `catalogSource`, `updatedAt`.
- [ ] "Refresh catalog" action: fetch with `cache: 'no-store'`; don't let a
      stale bundled copy win on tie.
- [ ] Scrub scripts default to dry-run / separate findings file; they never
      write `updatePortalUrl` / `latestVersion` into `catalog.json`.
- [ ] Contract test: every `updatePortalUrl` in the shipped `catalog.json`
      must be `http(s)` and must not match a known-dead list (the engine
      already validates `http(s)` at export; extend as needed).
