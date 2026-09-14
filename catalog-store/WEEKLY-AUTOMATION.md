# WEEKLY AUTOMATION — contract (effective 2026-09-13)

Authorized by Luke 2026-09-13: push the plugin version library's breadth and
depth to the extreme, fully autonomously, with a Git push every week.

## What runs

**Schedule:** every Monday ~02:00 America/Los_Angeles, timeout 8h.
Cron id: `daw-catalog-weekly-chip`. Runs in the Coding Assist side chat.

**Each run, in order:**

1. **Read this file + `STATUS.md`** for current state and conventions.
2. **Backup.** Copy `out/catalog.json` → `backups/<YYYY-MM-DD>/catalog.json`
   and write `backups/<YYYY-MM-DD>/manifest.json`
   (`{date, bands, manufacturers, plugins, accepted, commit_sha}`).
   Prune backup dirs older than 12 weeks (git history is the permanent archive).
   Backup file contents are gitignored; the manifest is committed.
3. **Research chip (bounded: ~150 yellows/week first-pass, plus the
   boundary-assault queue at ~50/week).**
   - Spawn read-only research subagents over yellow targets, prioritizing
     manufacturers whose playbooks show public evidence paths. Demonstrated
     throughput: 222 yellows in one evening session (Raise 26) — the old
     ~40/week bound was far too conservative.
   - Boundary assault (Luke's directive: never give up): every run attacks
     at least one blocked/hub-walled manufacturer through alternate public
     evidence — Wayback Machine, forum archaeology (KVR, Reddit, Gearspace),
     reseller listings, installer/CDN filename leaks, release-note archives,
     RSS/newsletter mirrors, cross-corroboration. Log every attempt in the
     weekly notes. A persistent block becomes a narrow, actionable request
     for Luke, not a vague permanent label.
   - Coordinator re-verifies every proposed raise against the manufacturer
     page before any write. Zero trust: no invented versions, no successor /
     suite / hub contamination, exact product-identity matching.
   - Insert via `src/accept_observation.py --set-current`,
     `verified_by=weekly-automation`, confidence per `CONFIDENCE.md`.
4. **Universe expansion (bounded: ~10 new manufacturers/week).**
   Only with solid product-identity evidence; enumerate their plugin line
   and seed initial version research; record leads in the weekly notes.
5. **Freshness spot-check (~100 greens).** Re-check known source URLs for
   newer versions than the accepted current; if a manufacturer page shows a
   newer version, raise it; note stale-but-unverifiable.
6. **Export + app sync.**
   - `python3 src/export_catalog.py` → `out/catalog.json`
   - Copy `out/catalog.json` → `../../catalog/catalog.json` (the file the app
     loads: CDN `cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@main/catalog/catalog.json`
     with bundled fallback). The two files must remain structurally identical;
     only version fields change.
   - Structural check: `catalog/catalog.json` must parse as JSON, keep
     `schemaVersion` 3, and remain an exact structural copy of
     `out/catalog.json` (only version fields may differ). (Note: the repo's
     `npm run catalog:validate` is stale — it rejects the 3453 legitimately
     versionless plugins — and node_modules isn't installed here; the python
     structural check is the gate.)
7. **Compat-data sweep (v5 fields, bounded: ~50 manufacturers/week).**
   Demonstrated: 20 manufacturers verified in ~15 minutes via parallel
   workers (seed batch 1) — the old ~10/week bound was far too conservative.
   For each target: verify Apple Silicon status from the manufacturer's own
   pages (quote + URL), set `manufacturers.apple_silicon`; record
   `version_scheme` + `version_example` for Cursor's normalizer;
   `changelog_url` when a fixed page exists. Per-plugin `apple_silicon`
   overrides only with manufacturer-page evidence of an exception.
   Allowed values: `native|universal|rosetta|intel-only|mixed|unknown`.
   Never infer — `unknown` beats a guess. Field semantics for Cursor live in
   `DATA-DICTIONARY.md`; keep it updated if values change.
8. **Docs.** Write `NOTES-weekly-<YYYY-MM-DD>.md`; append a chip entry to
   `HANDOFF-FOR-CURSOR.md`; refresh `STATUS.md` headline; append to
   `out/band_history.json`; update `dashboard_blocked.json` if blockers change;
   run `src/build_dashboard.py` and copy `dashboard.html` to
   `~/workspace/your_files/daw-plugin-catalog-dashboard.html`.
9. **Commit + push.** Focused message (`catalog: weekly chip <date> (+N ...)`).
   Push via the `github` skill (`~/workspace/skills/github/bin/ghapi.py` +
   Git Data API) — plain `git push` over HTTPS does not carry the stored
   credential. Verify remote ref afterwards. If the remote advanced
   (Cursor work), reconcile before pushing: never force-push.
9. **Report.** Short summary in the side chat: raises, skips, version bumps,
   bands, backup date, push SHA. The dashboard is the live record.

## Hard boundaries (never, autonomously)

- No sign-ins, no account creation, no password resets.
- No purchases, no payment methods, no checkout flows.
- No public outreach of any kind (manufacturers, forums, social, Discord) —
  reading them aggressively is encouraged; posting is not.
- No `--force` pushes, no history rewrites.

## Boundary assault protocol (Luke's directive: never give up)

A blocked manufacturer is a research problem, not a stop sign. Each weekly
run must spend part of its budget attacking at least one blocked
manufacturer from `dashboard_blocked.json` via alternate evidence paths:

- Wayback Machine snapshots of version badges, changelogs, download pages
- Forum archaeology: KVR threads, manufacturer forums, Reddit r/audioplugins,
  Gearspace — version numbers surface in user posts constantly
- Reseller / bundle listings (Plugin Boutique, Sweetwater, Thomann) that
  print current versions on product pages
- Installer filename leaks: version strings in CDN URLs, S3 buckets,
  support-KB download links
- Release-note archives, RSS feeds, email-newsletter mirrors, YouTube
  release videos with version in title/description
- Cross-corroboration: a version seen in two independent public places
  counts as a raise per CONFIDENCE.md, even without the vendor page
- `browser.deep_research` for the stubborn ones — a full sourced deep dive

Record every attempt (paths tried, what failed, what worked) in the weekly
NOTES file under "Boundary assault". When a boundary is truly unbreakable
without a login, convert it into a *specific narrow ask* for Luke
(e.g. "log into Output Hub once and read the version under Downloads for
these 11 plugins") instead of a vague block. Never silently carry a
"blocked" label forward week after week without a new attempt logged.

## File contract (for Cursor)

| Path | Role | Changes |
|---|---|---|
| `catalog-store/data/catalog.db` | Source of truth (schema v4) | Weekly inserts |
| `catalog-store/out/catalog.json` | Store export (schema v3) | Regenerated weekly |
| `catalog/catalog.json` | **App-facing catalog (CDN + bundle)** | Synced copy of the export, weekly |
| `catalog-store/backups/<date>/` | Pre-update snapshots | New dir weekly, 12-week retention, gitignored |
| `catalog-store/backups/MANIFEST.md` | Backup log | Appended weekly (tracked) |
| `catalog-store/dashboard.html` | Live dashboard (tracked) | Regenerated weekly |
| `~/workspace/your_files/daw-plugin-catalog-dashboard.html` | Luke's one-tap dashboard copy | Regenerated weekly |
| `catalog-store/DATA-DICTIONARY.md` | App-facing field semantics for Cursor | Updated when fields change |
| `catalog-store/NOTES-weekly-<date>.md` | Run notes | New file weekly |
| `catalog-store/HANDOFF-FOR-CURSOR.md` | Cursor handoff | Chip entry weekly |
| `catalog-store/STATUS.md` | Live one-pager | Headline weekly |

`catalog/catalog.json` must always be an exact structural copy of
`catalog-store/out/catalog.json` (verified: only version fields differ).
If they ever diverge structurally, stop and flag it in the side chat.
