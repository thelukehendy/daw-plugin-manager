# Project brief — DAW Plugin Manager catalog research engine

Audience: Grok Bot, advisory role. Maintained by the catalog operator (Muse).
Last updated: 2026-09-24 PDT. Read this first; it is kept current.

## 1. What this is

The DAW Plugin Manager is a macOS **Tauri** app (repo `thelukehendy/daw-plugin-manager`;
Electron in that repo is legacy reference only)
that scans a user's installed DAWs/plugins and reports which have updates available.
The version catalog behind it is researched and maintained by an autonomous research
engine run by this operator. Luke codes the app in Cursor; the engine and all data
work run here, on a 12-hour research cadence with a daily push.

## 2. Mission constraint (from Luke, non-negotiable)

Tier-1-only: *"If we can't improve tier 1, what's the point of this project?"*
Tier 1 = household-name vendors covering roughly 80–95% of users. Tier 2+ research
(3,325 plugins across 126 manufacturers) is PAUSED until Luke says otherwise — it is
a completeness/credibility play, not a value play.

## 3. Current state (2026-09-24)

- Catalog: 660 manufacturers / 9,494 plugins / 5,651 accepted version observations.
- Confidence bands: green 3,958 / amber 347 / yellow 1,346.
- Tier-1 detail (4,389 plugins): 1,940 green, 308 amber, 529 yellow, 1,612 with no
  accepted version. Roughly two-thirds of yellows are KVR-only evidence on hub-walled
  vendors with no public version to find. All but 113 of the versionless are
  intentionally unversioned (soundsets, bundles, hardware).
- Engine cadence: research chips every 12h (backlog currently 0 — steady-state
  freshness only), daily push 06:00 PT.
- Delivery: every daily push publishes `catalog/catalog-version.json`, a tiny pointer
  naming the exact GitHub commit, buildId, sha256, and byte size. The app fetches the
  pointer from raw GitHub, downloads the catalog from a commit-pinned jsDelivr URL
  (immutable — CDN caching becomes correct behavior), verifies sha256 before install,
  and shows "Catalog as of \<buildId\>". Spec: `catalog/CATALOG-FEED.md`.
  App-side implementation is with Cursor.

## 4. The green plateau (the central strategic fact)

Research chips now add almost no new greens (2026-09-24: 263 researched, 0 promoted;
several zero-drift days recently). The engine's value has shifted from discovery to
freshness maintenance and data integrity. A strategy pivot is PENDING Luke's verdict:
replace the 12h research chips with one daily freshness sweep + the 06:00 push, and
lead the dashboard with "last verified" instead of band counts. Claim ledger,
playbooks, and push mechanics stay as-is. Advisory topic #1 below.

## 5. How the engine works (mechanics worth knowing)

- **Claim ledger:** chips claim rows in `research_attempts` so parallel/back-to-back
  chips never duplicate work. SQLite in WAL mode.
- **Zero-trust gates:** every version change needs first-hand evidence (vendor page,
  installer binary metadata, dated changelog), corroboration where possible, and
  confidence bands (green ≥85, amber 70–84, yellow <70 — see
  `catalog-store/CONFIDENCE.md`). Researched and raised are
  reported separately — *done means visible, verified versions, not processed rows.*
- **Per-vendor playbooks:** `catalog-store/TIER1-ASSAULT.md` (re-fetch/parse/diff
  recipes per vendor, built for permanent maintenance, not one-time discovery),
  `catalog-store/TIER1-REFLECT.md` (mandatory per-chip reflect → refine → dig loop),
  `catalog-store/playbooks/*.md`. Recent wins: NI installer-binary oracle, Antares
  help-center master index (21 article IDs), oeksound per-product changelog pages,
  Waves release-notes diff template, Plugin Alliance per-product dated changelogs
  (discovered 2026-09-24), rendered-browser as primary path for JS-gated vendors
  (Klanghelm, Antares, Valhalla — 3-for-3).
- **Standing rule:** the catalog mirrors what a user downloads TODAY. A
  vendor-confirmed version *decrease* is a legitimate correction (first seen: SSL
  installer rollback, 2026-09-24 — vendor pulled newer installers).
- **Portal URLs count only if they open** (~1,700 distinct URLs; liveness is the
  catalog's problem, not the user's).
- **Identity guards:** framework-version misattribution (Eventide H910-class stamps),
  hardware misclassified as plugins (Knife Drop pedal), bundle-vs-product identity.
- **Push mechanics:** GitHub pushes go through the Git Data API
  (`goals/daw-plugin-catalog-research-engine/hidden_files/gitdata_push.py`).
  Plain HTTPS git push doesn't carry the credential. Never force-push.

## 6. Advisory backlog (hard problems — start here)

1. **Green-plateau strategy.** Is the freshness-sweep pivot right, or is there a
   better framing of catalog value (freshness coverage %, per-vendor freshness,
   user-trust signals)? What should "done" mean for a maintenance-phase catalog?
2. **Hub-walled vendor discovery.** Waves, NI, IK, Spitfire, UA, Slate, EastWest,
   Output, 8Dio, UVI publish no public per-product versions. Novel discovery angles
   that need no credentials and no manual input from Luke.
3. **Plugin Alliance changelog-diff walk.** New oracle (2026-09-24): every PA product
   page carries a dated Changelog; the top entry is the current version. A 261-row
   stale block is now unblocked. Cheapest durable automation design? Bundle/suite
   dedup? Cost/benefit of walking all PA rows?
4. **Confidence taxonomy.** The yellow band mixes "no public version exists" with
   "haven't found it yet." A principled taxonomy distinguishing structurally
   unresolvable from new-angle-worthy — so the dashboard is honest and chips stop
   re-trying dead ends.
5. **Vendor-retraction detection.** SSL pulled newer installers (2026-09-24); the
   catalog corrected downward. Generalize: retraction watchlist, re-release
   detection, do other vendors do this?
6. **Portal URL liveness at scale.** ~1,700 URLs, standing rule "counts only if it
   opens." Cheapest durable recheck design that doesn't look like a bot attack
   (cadence, sampling, rotation).
7. **Freshness rotation model.** `verified_at` rotation is now self-advancing. What
   are optimal recheck intervals per vendor (churn rate × user share)? How should
   "last verified" be presented?

## 7. Standing constraints (non-negotiable)

- Never design anything requiring manual input from Luke. Fully autonomous, always.
- No telemetry, no phoning home. The app-reporting idea was dropped 2026-09-20 —
  do not re-propose it.
- Advisory-only: you never modify code, data, the DB, or docs outside `advisory/`.
  Suggestions only; the operator accepts or rejects.
- Routine engine progress goes to the dashboard, never to Luke's thread. You don't
  message Luke at all.
- When research hits a boundary, the posture is deep research — alternate methods,
  forums, creative angles — never "blocked, settled."

## 8. Key files

- `catalog-store/TIER1-ASSAULT.md` — per-vendor discovery/maintenance playbooks
- `catalog-store/TIER1-REFLECT.md` — reflect-loop log
- `catalog-store/DATA-DICTIONARY.md` — data contract with the app
- `catalog-store/CONFIDENCE.md` — confidence band definitions
- `catalog-store/HUB_WALLED.md` — the hub-walled vendor problem
- `catalog/CATALOG-FEED.md` — immutable catalog feed spec
- `catalog/catalog-version.json` — today's pointer (live example)

## 9. What good advising looks like

Concrete, evidence-linked, scoped to one problem. Say what changes in the engine if
accepted. Flag what you don't know. Check `advisory/verdicts.md` first — don't
re-propose anything marked REJECTED without new evidence.
