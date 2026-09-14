# CATALOG AUTOMATION — contract (effective 2026-09-13; 10x mode + daily pushes from 2026-09-14)

Authorized by Luke 2026-09-13: push the plugin version library's breadth and
depth to the extreme, fully autonomously. 2026-09-14: Luke ordered 10x
timeline compression (continuous research) and daily pushes (smaller,
Cursor-reviewable diffs).

**Reporting:** Luke's live display is
`~/workspace/your_files/daw-plugin-catalog-dashboard.html` — both jobs
refresh it every run. Routine progress stays off-thread; the side chat is
for critical things only (needs Luke's decision/action, unrecoverable
failures, data-integrity issues).

## What runs

**Research engine** — cron `daw-catalog-research-10x`, every 12h, timeout 6h.
Quotas per chip (~10x the old weekly bounds, grounded in demonstrated
throughput — Raise 26: 222 yellows/evening; compat seed: 20 mfrs/15 min):
- ~110 yellows, first-pass (4–8 parallel workers; coordinator re-verifies
  every raise on the manufacturer page; `verified_by=research-engine-10x`)
- ~35 boundary-assault queue items (blocked/hub-walled via alternate public
  evidence; log every attempt)
- ~7 new manufacturers (solid product-identity evidence; enumerate line)
- ~70 green freshness re-checks
- ~35 manufacturers compat sweep (v5 fields; own pages only; never infer)
Target selection: STATUS.md + latest NOTES-*.md; prefer never-researched,
then oldest-researched; no re-work within 7 days without new evidence.
Zero trust always; hard boundaries (no sign-ins/purchases/outreach/
force-pushes); on 429s back off that provider, log, continue.
Bookkeeping: append to `NOTES-10x-<YYYY-MM-DD>.md`; refresh dashboard;
log to `~/memory/YYYY-MM-DD.md`. No export/commit/push — the push job owns that.

**Push job** — cron `daw-catalog-daily-push`, daily ~06:00
America/Los_Angeles, timeout 2h. Ships what the engine found. 06:00 was
chosen so both 12h research chips (10:18 / 22:18) land inside each push
window. Backup retention stays 12 weeks (~84 daily dirs; git is the
permanent archive).

**Each run, in order:**

1. **Read this file + `STATUS.md`** for current state and conventions.
2. **Backup.** Copy `out/catalog.json` → `backups/<YYYY-MM-DD>/catalog.json`
   and write `backups/<YYYY-MM-DD>/manifest.json`
   (`{date, bands, manufacturers, plugins, accepted, commit_sha}`).
   Prune backup dirs older than 12 weeks (git history is the permanent archive).
   Backup file contents are gitignored; the manifest is committed.
3. **Reconcile research notes.** Append a push summary to the day's
   `NOTES-10x-<YYYY-MM-DD>.md` (per-chip entries stay as the raw log).
4. **Export + app sync.**
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
7. **Compat-data sweep** — owned by the research engine (~35 mfrs/chip,
   ~500/week). Field semantics for Cursor live in `DATA-DICTIONARY.md`;
   keep it updated if values change.
8. **Docs.** Append a rollup entry to `HANDOFF-FOR-CURSOR.md`; append a chip entry to
   `HANDOFF-FOR-CURSOR.md`; refresh `STATUS.md` headline; append to
   `out/band_history.json`; update `dashboard_blocked.json` if blockers change;
   run `src/build_dashboard.py` and copy `dashboard.html` to
   `~/workspace/your_files/daw-plugin-catalog-dashboard.html`.
9. **Commit + push.** Focused message (`catalog: daily push <date> (+N ...)`).
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
| `catalog-store/NOTES-10x-<date>.md` | Per-chip research log (2 chips/day) | Appended daily |
| `catalog-store/NOTES-weekly-<date>.md` | Run notes (legacy weekly format) | Superseded by NOTES-10x |
| `catalog-store/HANDOFF-FOR-CURSOR.md` | Cursor handoff | Chip entry weekly |
| `catalog-store/STATUS.md` | Live one-pager | Headline weekly |

`catalog/catalog.json` must always be an exact structural copy of
`catalog-store/out/catalog.json` (verified: only version fields differ).
If they ever diverge structurally, stop and flag it in the side chat.
