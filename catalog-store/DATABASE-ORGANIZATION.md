# How the catalog database is organized (for Cursor)

**File:** `catalog-store/data/catalog.db` — SQLite, **schema v6** (see `meta.schema_version`).
Row counts below are from 2026-09-18; expect them to grow.

## Ground rules (repeat of CURSOR-INSTRUCTIONS.md — they matter here)

- This DB is **written continuously by an autonomous research engine**. Never
  write to it: no inserts, updates, deletes, migrations, or `VACUUM`.
- Never run `catalog-store/src/*.py` — those are the engine's tools, not app tools.
- If you genuinely need DB-level detail the JSON lacks: **copy the `.db` to
  `/tmp` first** and query the copy. The DB runs in WAL mode; if you copy the
  file by hand, grab the `-wal`/`-shm` sidecars too (or the copy may look stale).
- The app's source of truth is **`catalog/catalog.json`**, not this DB.

## Table map

| Table | Rows | Role | App-relevant? |
|---|---|---|---|
| `manufacturers` | 660 | Vendor identity + portal/app metadata + research hints | **Yes** (via JSON export) |
| `plugins` | 9,494 | Product identity: names, `match_patterns`, `identity_kind`, portal overrides, successor links | **Yes** (via JSON export) |
| `version_observations` | 7,866 | **Every version sighting ever recorded** — proposed, accepted, rejected, superseded | Only via the accepted pointer (below) |
| `plugin_version_current` | 5,651 | The single join: which observation is the **accepted current** version for each plugin | **Yes** — this is what `latestVersion` in the JSON comes from |
| `research_attempts` | 13,788 | Claim ledger: which plugin was researched in which chip, and the outcome | No — engine-internal |
| `manufacturer_playbooks` | 521 | Per-vendor notes on *how* to find versions (URLs, extraction tricks, cadence) | No — engine-internal |
| `vendor_feeds` | 1 | Machine-readable feed configs for re-fetching | No — engine-internal |
| `meta` | 11 | Engine key-value state (`schema_version`, `surge_active`, migration timestamps) | Only `schema_version` |

## Relationships

```
manufacturers 1───* plugins 1───* version_observations
     │                │
     │                └───1 plugin_version_current ──1 version_observations (accepted)
     │
     └───* manufacturer_playbooks (research notes, not app data)
```

- `plugins.manufacturer_id → manufacturers.id`
- `version_observations.plugin_id → plugins.id`
- `plugin_version_current.plugin_id → plugins.id`,
  `plugin_version_current.observation_id → version_observations.id`

## The version pipeline (read this before querying versions)

A plugin's **current version is never read straight from `version_observations`.**
That table is an evidence ledger containing three statuses:

| `status` | Meaning |
|---|---|
| `accepted` | Passed review; a candidate for "current" |
| `superseded` | Was accepted, then a newer observation replaced it — **do not use** |
| `rejected` | Failed review (`reject_reason` says why) — **do not use** |

The **only** thing that makes an observation "the" version is a row in
`plugin_version_current` pointing at it. The JSON export's `latestVersion`,
`versionConfidence`, `versionSourceUrl`, etc. all come through that pointer.
If you query the DB copy directly, always join through `plugin_version_current`.

Rejected and superseded rows are kept deliberately as an audit trail —
they are not errors to clean up.

## `popularity_tier` (both tables — resolve plugin-first)

`1` = household names (the app's primary user base), `2`–`4` = descending
long tail, `NULL` = unranked. The **effective tier** for a plugin is:

```sql
COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)
```

(Plugin-level tier wins when set; otherwise it inherits the manufacturer's.)
Current split: tier 1 ≈ 4,389 plugins · tier 2 ≈ 3,325 · tier 3 ≈ 1,001 ·
tier 4 ≈ 118 · unranked ≈ 661. Research and freshness work is prioritized by
this order — tier 1 is where correctness matters most.

The export resolves this once and emits it as `popularityTier` on every plugin
entry (and the manufacturer's own tier on every manufacturer entry), so the
app sorts tier-1-first without doing the join itself. Omitted = unranked.

## Field resolution order (plugin override → manufacturer default)

Two columns exist on **both** `manufacturers` and `plugins` and resolve the
same way — the plugin value wins when set, otherwise the manufacturer's:

- `update_portal_url` → JSON `updatePortalUrl` (where the user downloads updates)
- `portal_app` → JSON `portalApp` (the vendor's hub/updater app, e.g. "Waves Central")
- `apple_silicon` → JSON `appleSilicon` (`native` / `universal` / `rosetta` / `intel-only` / `mixed`; omitted = unresearched, never assume)

## `version_scheme` (manufacturers)

Tells the app's version normalizer how a vendor writes versions. Canonical
values: `semver`, `semver4`, `date`, `build`, `marketing`. Many rows carry
free-text descriptions instead (e.g. `"major.minor (2-part), some 3-part"`) —
treat those as informational, not as normalizer input. `version_example`
holds a real observed string you can use as a normalizer test fixture.

## `identity_kind` (plugins)

Only `plugin` (or unset) means a real version-tracked plugin. Everything else
is not version-tracked by design: `soundset`, `expansion`, `bundle`,
`suite_component`, `hub_app`, `hardware`, `instrument`, `effect`,
`discontinued`, `gen_ambiguous`, `unknown_other`. Never show "unknown version"
for these — see `DATA-DICTIONARY.md` for the per-kind UX contract.

## Generations and paid upgrades (plugins)

- `generation` / `generation_rank` — which commercial generation a row belongs to.
- `successor_plugin_id` / `predecessor_plugin_id` — links between generations.
- `update_class = 'paid_upgrade'` — the successor is a **paid** upgrade, not a free update.
- Legacy columns `supersedes_plugin_id` / `superseded_by_plugin_id` exist but
  the `successor_*` / `predecessor_*` pair is the canonical link — prefer those.

Never stamp a successor's version onto a predecessor SKU.

## Engine-internal tables (ignore for app work)

- **`research_attempts`** — the claim ledger that stops parallel research
  workers from duplicating work. `outcome` is one of `observed` / `promoted` /
  `skipped`. Interesting for "was this plugin researched?" questions, but it is
  not version data.
- **`manufacturer_playbooks`** — human/agent-readable notes on how each
  vendor's versions are found (primary URLs, extraction notes, hub-walled
  flags). Useful background if you're curious *why* a vendor's versions look
  the way they do; not app data.
- **`vendor_feeds`** — structured re-fetch configs (nearly empty; most vendors
  have no machine feed).
- **`meta`** — engine state. `schema_version` is the only key the app should
  ever care about; `surge_active` and the `*_at` timestamps are engine
  bookkeeping.

## Export chain (DB → app)

```
catalog.db ── src/export_catalog.py ──▶ catalog-store/out/catalog.json
                                              │ (copied, byte-identical)
                                              ▼
                                       catalog/catalog.json  ← the app reads this
```

- `export_catalog.py` is the **only** writer of the JSON. Never hand-edit
  `catalog/catalog.json` — the next export overwrites it.
- `updatedAt` at the top of the JSON tells you when the export ran. If the app
  shows stale data (e.g. a dead portal link the scrub already fixed), check
  `updatedAt` first — the app is probably holding a cached copy, not reading
  fresh data.

## Common mistakes to avoid

1. **Reading `version_observations` directly for "the current version."**
   Always go through `plugin_version_current`, or just use the JSON.
2. **Treating `superseded`/`rejected` observations as live.** They're history.
3. **Treating `NULL` `popularity_tier` as "tier 0 / most popular."** NULL =
   unranked. Resolve with the `COALESCE` above.
4. **Treating an omitted field as `false`.** Omitted = not yet researched
   (applies to `apple_silicon`, `latestVersion`, portal URLs, etc.).
5. **Using engine tables (`research_attempts`, `meta`, playbooks) as app
   data.** They describe the research process, not the products.
6. **Assuming the JSON and the DB agree at every instant.** The DB moves
   continuously; the JSON is a snapshot. `updatedAt` is the bridge between them.
