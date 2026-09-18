# Cursor instructions — DAW Plugin Catalog

**Last refreshed: 2026-09-17.** This is the current entry point. `HANDOFF-FOR-CURSOR.md`
is a historical log from the 2026-09-10 pause — background only, do not treat its
counts or "paused" state as current.

## What to read

**`catalog/catalog.json`** — this is your source of truth. It is the app/CDN export of the
version catalog (PluginCatalog `schemaVersion` 3 plus v5/v6 extension fields).

- Raw URL: `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`
- As of 2026-09-17: **660 manufacturers / 9,494 plugins / 5,651 with an accepted version**
- `updatedAt` at the top tells you when it was exported. It refreshes on a schedule
  (research runs every 12h; export + push goes out daily ~06:00 PT, plus manual pushes
  like today's). **Never hand-edit this file** — the next export overwrites it.

Field-by-field semantics: **`catalog-store/DATA-DICTIONARY.md`** (the contract between
the data pipeline and the app — read it before building version UI).

## What NOT to read: the live database

`catalog-store/data/catalog.db` (SQLite) is **written continuously by an autonomous
research engine** — version observations land in it around the clock. Rules:

- **Do not treat it as a stable snapshot.** Any query you run may be mid-write.
- **Do not write to it.** No inserts, updates, deletes, migrations, or vacuum.
  The research engine owns all writes; concurrent writes from Cursor risk corruption
  and will be overwritten or conflicted.
- **Do not run the `catalog-store/src/*.py` scripts.** They are the research engine's
  tooling (export, accept, migrate) — not app tooling.
- If you genuinely need DB-level detail the JSON lacks: copy the `.db` to `/tmp`
  first and query the copy. Even then, prefer the JSON.

Ignore stray database-looking files if you see them (`catalog.db`, `db.sqlite`,
`store.sqlite` at odd paths) — those are worker scratch, not data.

## How to interpret the data (read this before building UI)

**Confidence bands** (`versionConfidence`, 0–100):
- **≥85 green** — verified, trust it for up-to-date / update-available states.
- **70–84 amber** — likely, render softer.
- **<70 yellow** — weak (often KVR-only). Show the version with a low-confidence badge;
  surface `versionConfidenceReasons` + `versionSourceUrl` in details.

**Yellow does NOT mean "update available" or "outdated."** A large share of yellow rows
are structural, not failures: vendors that publish no public per-product versions
(Native Instruments content, UAD/UA plugins, Output FX, 8Dio libraries behind logins,
Kontakt libraries generally). The catalog records this honestly instead of inventing
versions. Never render yellow as an "update available" CTA.

**`identityKind`** — only `plugin` (or omitted) means a real version-tracked plugin.
Everything else is not version-tracked by design; do NOT show "unknown version" for it:
- `soundset` / `expansion` — content packs, no plugin semver
- `bundle` / `suite_component` — no single installer version
- `hub_app` — updater/manager app (Native Access, Waves Central…)
- `hardware` / `eurorack` — physical gear
- `discontinued` — show a Discontinued state, not "unknown"
- `gen_ambiguous` — don't map versions across generations

**`portalApp`** — when set (plugin or manufacturer), the update path is the vendor's hub
app. Deep-link / CTA to the hub instead of a version chase.

**Micro vs macro** — `successorPluginId` / `updateClass: "paid_upgrade"` means a *paid*
next generation (e.g. Pro-Q 3 → Pro-Q 4). Badge it as "Paid upgrade available",
never as a free update.

**Hard rules**
- Never invent or guess `latestVersion`. If it's absent, the app must not fabricate one
  (no KVR scraping, no filename heuristics, no sibling-SKU mapping like TONEX Max → Standard,
  no Consolidated → individual Airwindows).
- `versionScheme` (when present) tells your normalizer how the vendor writes versions:
  `semver`, `semver4`, `date`, `build`, `marketing`. Normalize before comparing.

## If something looks wrong in the data

Don't fix the JSON — report it to Luke (or note it in your handoff). The data pipeline
is owned by the research engine; app-side workarounds for data issues belong in the
app with a comment, not as edits to catalog files.

## File map

| Path | Role |
|---|---|
| `catalog/catalog.json` | **App source of truth** (synced export) |
| `catalog-store/DATA-DICTIONARY.md` | Field contract for the app |
| `catalog-store/DATABASE-ORGANIZATION.md` | How the SQLite DB is organized: tables, relationships, version pipeline (read-only — never write the DB) |
| `catalog-store/CONFIDENCE.md` | Confidence rubric + bands |
| `catalog-store/TIER1-ASSAULT.md` | Per-manufacturer research playbooks (how each vendor's versions are found) |
| `catalog/HUB_WALLED.md` | Which vendors are account-gated and why |
| `catalog-store/dashboard.html` | Human-readable progress dashboard (not for the app) |

**Start here for judgment calls:** `catalog/TEACHING-CURSOR.md` (methods, trust model, UX).
