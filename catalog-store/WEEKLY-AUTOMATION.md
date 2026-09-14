# WEEKLY AUTOMATION — contract (effective 2026-09-13)

Authorized by Luke 2026-09-13: push the plugin version library's breadth and
depth to the extreme, fully autonomously, with a Git push every week.

## What runs

**Schedule:** every Monday ~02:00 America/Los_Angeles, timeout 4h.
Cron id: `daw-catalog-weekly-chip`. Runs in the Coding Assist side chat.

**Each run, in order:**

1. **Read this file + `STATUS.md`** for current state and conventions.
2. **Backup.** Copy `out/catalog.json` → `backups/<YYYY-MM-DD>/catalog.json`
   and write `backups/<YYYY-MM-DD>/manifest.json`
   (`{date, bands, manufacturers, plugins, accepted, commit_sha}`).
   Prune backup dirs older than 12 weeks (git history is the permanent archive).
   Backup file contents are gitignored; the manifest is committed.
3. **Research chip (bounded: ~40 yellow + all viable amber targets).**
   - Spawn read-only research subagents over yellow targets, prioritizing
     manufacturers whose playbooks show public evidence paths. Hub-walled
     manufacturers (see `dashboard_blocked.json`) are skipped, not forced.
   - Coordinator re-verifies every proposed raise against the manufacturer
     page before any write. Zero trust: no invented versions, no successor /
     suite / hub contamination, exact product-identity matching.
   - Insert via `src/accept_observation.py --set-current`,
     `verified_by=weekly-automation`, confidence per `CONFIDENCE.md`.
4. **Universe expansion (bounded: 1–2 manufacturers or ≤15 plugins).**
   Only with solid product-identity evidence; record leads in the weekly notes.
5. **Freshness spot-check (~20 greens).** If a manufacturer page shows a newer
   version than the accepted current, raise it; note stale-but-unverifiable.
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
7. **Docs.** Write `NOTES-weekly-<YYYY-MM-DD>.md`; append a chip entry to
   `HANDOFF-FOR-CURSOR.md`; refresh `STATUS.md` headline; append to
   `out/band_history.json`; update `dashboard_blocked.json` if blockers change;
   run `src/build_dashboard.py` and copy `dashboard.html` to
   `~/workspace/your_files/daw-plugin-catalog-dashboard.html`.
8. **Commit + push.** Focused message (`catalog: weekly chip <date> (+N ...)`).
   Push via the `github` skill (`~/workspace/skills/github/bin/ghapi.py` +
   Git Data API) — plain `git push` over HTTPS does not carry the stored
   credential. Verify remote ref afterwards. If the remote advanced
   (Cursor work), reconcile before pushing: never force-push.
9. **Report.** Short summary in the side chat: raises, skips, version bumps,
   bands, backup date, push SHA. The dashboard is the live record.

## Hard boundaries (never, autonomously)

- No sign-ins, no account creation, no password resets.
- No purchases, no payment methods, no checkout flows.
- No outreach of any kind (manufacturers, forums, social).
- No `--force` pushes, no history rewrites.
- Hub-walled evidence stays blocked until Luke provides a logged-in session.

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
| `catalog-store/NOTES-weekly-<date>.md` | Run notes | New file weekly |
| `catalog-store/HANDOFF-FOR-CURSOR.md` | Cursor handoff | Chip entry weekly |
| `catalog-store/STATUS.md` | Live one-pager | Headline weekly |

`catalog/catalog.json` must always be an exact structural copy of
`catalog-store/out/catalog.json` (verified: only version fields differ).
If they ever diverge structurally, stop and flag it in the side chat.
