# Catalog hosting (private vs public) + feedback relay + product ideas

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Problem:** Luke asked whether GitHub is the right free backend, whether it
  can stay private while still powering the app, how to hide the database
  location from users, and how in-app feedback should reach Cursor/Muse. Also
  small product ideas that do not need Muse data work.
- **Context / evidence:** App already:
  - Fetches catalog feed v2 (pointer → commit-pinned URL → sha256) in the
    **main** process only (`catalogFeed.ts`).
  - Scrubs URLs / GitHub / jsDelivr / paths from anything sent to the renderer
    (`publicFacing.ts`). UI shows **Catalog {date}** only.
  - Feedback UI + payload builder exist; `FEEDBACK_URL` is still `''` (relay not
    deployed) — send returns "Feedback isn't connected yet."

## #7 — Is GitHub the right move? Can it be private?

**Short answer:** GitHub is fine as the **operator** store (Muse + Grok Bot +
Cursor advisory loop). It is **not** enough by itself as a *private* runtime
catalog for shipping clients.

| Approach | Free? | Hides origin from casual users? | Works for shipped app? |
|---|---|---|---|
| Public repo + jsDelivr / raw (today) | Yes | Weak — anyone can find `catalog/` if they inspect the binary or MITM the pointer URL | Yes (current feed v2) |
| Private GitHub + raw URL in the app | Yes (private repos free) | No — raw private URLs need a token; token in the app = public | **No** |
| Private GitHub + **Cloudflare Worker** (or similar) that holds a PAT and serves only `catalog-version.json` + pinned `catalog.json` | Yes (CF free tier) | Better — users see `https://catalog.<your-domain>/…`, not github.com; Worker can omit listing | Yes |
| Cloudflare R2 / Backblaze B2 public bucket with opaque object names + Worker front door | Yes (generous free tiers) | Best opacity; GitHub stays private for humans | Yes |
| Paid DB (Supabase/Firebase/PlanetScale) | Often free tier, not "forever free" at scale | Good | Overkill for a static JSON catalog |

**Recommendation (all free):**

1. Keep the **research repo private** (or public for collaboration — your call).
2. Publish the **runtime feed** through a tiny Worker:
   - `GET /v` → `catalog-version.json` (buildId, sha256, size)
   - `GET /c/:buildId` → catalog bytes (or Worker fetches pinned private raw /
     R2 object server-side)
3. Point the app's `CATALOG_VERSION_POINTER_URL` at the Worker (main process
   only). Do **not** put GitHub hostnames in renderer strings or Settings.
4. Keep showing **Catalog as of {buildId/updatedAt}** in the UI (already done).

Private GitHub **alone** cannot power anonymous desktop clients without either
making the repo public or embedding a secret. A free Worker/R2 front door is the
missing piece.

`DISTRIBUTE.md` still describes the old public-scrape + `catalog-refresh.yml`
path — treat it as stale relative to store-export + feed v2. Muse should not
revive scraper writers.

## Feedback relay (item #3 finish)

Desired path (no credentials in the app):

1. App `POST`s JSON (`kind: feedback`, message, app meta, optional anonymized
   `ScanSnapshot`) to `FEEDBACK_URL`.
2. Relay (same Cloudflare Worker or a second route) verifies size limits,
   strips anything unexpected, and opens a **private** GitHub issue or writes
   `advisory/feedback-inbox/YYYY-MM-DD-*.json` via the GitHub API with a
   server-side token.
3. Cursor/Muse read that inbox; never ask users to manage dumps.

Until the Worker exists, leave `FEEDBACK_URL` empty — better a clear "not
connected" than a dead public webhook.

## #8 — Other ideas (app / product, low Muse cost)

1. **Attention inbox on first open** — one list: plugins + DAWs + helpers that
   need action; everything else collapsed (partially there via triage sidebar).
2. **Per-vendor "Open hub"** from the helper row using `portalApp` /
   `updatePortalUrl` only (never download/install).
3. **Catalog freshness chip** — already date; optional "checked just now" after
   Refresh catalog.
4. **Golden fixtures from opt-in feedback** — when `includeScan` is checked,
   snapshots can seed `catalog-store/fixtures/scans/` after human review (never
   auto-merge).
5. **Windows later** — wait until Mac identity keys are dense; same schema with
   VST3 class IDs.
6. **Auto-update the shell** (Tauri/Electron) separately from the catalog feed
   so catalog freshness is not blocked on DMG shipping.
7. **Do not** build in-app installers, license redeemers, or account logins —
   stay read-only discovery + portal handoff.

- **Recommendation:** Luke pick Worker+R2 (or Worker→private raw) for runtime
  catalog; Muse keep exporting store-export JSON unchanged; Cursor wires
  pointer URL + `FEEDBACK_URL` once the Worker is live.
- **If accepted, what changes in the engine:** none for Muse beyond continuing
  store-export; ops adds Worker publish step after each export push.
- **Expected impact:** origin not trivially visible in UI; feedback actually
  reaches the advisory loop; free forever at current scale.
- **Risks / caveats:** Worker URL can still be extracted from the binary — opacity
  is "not obvious," not DRM. Rotate PATs; rate-limit the feedback route.
- **Suggested first step:** deploy a Worker that proxies today's public
  pointer + pinned catalog (no behavior change), then flip the app pointer URL;
  second, add `POST /feedback` → private issues.
