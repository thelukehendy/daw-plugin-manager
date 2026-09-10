# SCHEMA — Micro vs Macro updates

Store path: `/workspace/daw-plugin-catalog-store`  
Schema: SQLite **v4** (`meta.schema_version=4`; micro/macro columns from **v2**, still accurate)  
Export: PluginCatalog **schemaVersion 3** JSON (`out/catalog.json`) with optional forward-compatible fields.

## Problem

Users may own **Pro-Q 3** and want free updates to the latest **3.x**, while **Pro-Q 4** is a **paid** successor product. Treating “anything newer from FabFilter” as a free update is wrong.

The catalog must distinguish:

| Concept | Meaning | Catalog field |
|---|---|---|
| **Micro / free within generation** | Latest installer/version for *this* product line generation | `latestVersion` on *this* plugin row |
| **Macro / paid successor** | Optional pointer to the next paid product SKU | `successorPluginId` (and related gen fields) |

## UX rules (Electron)

1. **`status: outdated` (or equivalent “update available”)** means a **free micro update** is available:
   - Installed plugin matches this catalog row’s `matchPatterns`.
   - Installed version **&lt;** catalog `latestVersion` for **that same plugin id**.
   - Do **not** treat a higher `generation` / different product as a free update.

2. **Separate badge / flag when a paid successor exists**:
   - If `successorPluginId` (or `supersededByPluginId`) is set, show e.g. **“Paid upgrade available”** / **“Next generation”** linking to the successor product — **not** as a free update CTA.
   - Example: Pro-Q 3 installed + Pro-Q 3 `latestVersion` current → **up to date** for free updates; still show **Pro-Q 4** as optional paid upgrade.

3. **Unknown / missing `latestVersion`**:
   - Policy A unchanged: identity always exported; version fields only when an accepted observation exists.
   - Lack of version ≠ paid upgrade.

4. **Ignore unknown JSON keys**:
   - Export only adds micro/macro fields when non-null (and omits `updateClass: "unknown"`).
   - Older app builds may ignore `generation`, `successorPluginId`, etc.

## Plugin columns (SQLite v2)

| Column | Type | Notes |
|---|---|---|
| `generation` | TEXT | e.g. `'3'`, `'V2'`, `'MK2-T'` — label for this SKU’s generation |
| `generation_rank` | INTEGER | Order within `product_line` (higher = newer gen) |
| `update_class` | TEXT | `free_current` \| `paid_upgrade` \| `discontinued` \| `bundled` \| `unknown` |
| `successor_plugin_id` | TEXT | Paid next-gen plugin id (macro target) |
| `predecessor_plugin_id` | TEXT | Prior gen this product replaced |
| `supersedes_plugin_id` | TEXT | **Legacy** — same direction as `predecessor_plugin_id` (the older id this row replaces) |
| `superseded_by_plugin_id` | TEXT | **Legacy** — same direction as `successor_plugin_id` |

### Field alignment

When a macro pair is recorded, migrate/backfill sets **both** naming styles:

```
older.successor_plugin_id     = newer.id
older.superseded_by_plugin_id = newer.id
older.update_class            = paid_upgrade

newer.predecessor_plugin_id   = older.id
newer.supersedes_plugin_id    = older.id
newer.update_class            = free_current   # (unless discontinued/bundled)
```

Prefer reading **`successor_plugin_id` / `predecessor_plugin_id`** in new code; keep legacy columns populated for older tooling.

### `update_class` meanings

| Value | Meaning |
|---|---|
| `free_current` | Current generation SKU; micro updates (if any) are free within this row |
| `paid_upgrade` | Older generation; free micros still apply to *this* row’s `latestVersion`, but a paid successor exists |
| `discontinued` | No longer sold / supported as a line |
| `bundled` | Ships inside another product / DAW |
| `unknown` | Not classified (default; omitted from export) |

## Export JSON (optional keys on each plugin)

Emitted only when set (forward-compatible):

```json
{
  "id": "fabfilter--fabfilter-pro-q-3",
  "manufacturerId": "fabfilter",
  "name": "FabFilter Pro-Q 3",
  "matchPatterns": ["Pro-Q 3", "FabFilter Pro-Q 3"],
  "productLine": "FabFilter Pro-Q",
  "generation": "3",
  "generationRank": 3,
  "updateClass": "paid_upgrade",
  "successorPluginId": "fabfilter--fabfilter-pro-q-4",
  "supersededByPluginId": "fabfilter--fabfilter-pro-q-4",
  "latestVersion": "3.26",
  "versionSourceUrl": "https://www.fabfilter.com/...",
  "versionEvidence": "page-confirmed"
}
```

Successor row:

```json
{
  "id": "fabfilter--fabfilter-pro-q-4",
  "productLine": "FabFilter Pro-Q",
  "generation": "4",
  "generationRank": 4,
  "updateClass": "free_current",
  "predecessorPluginId": "fabfilter--fabfilter-pro-q-3",
  "supersedesPluginId": "fabfilter--fabfilter-pro-q-3",
  "latestVersion": "4.02"
}
```

(`latestVersion` values above are illustrative — export only includes versions from accepted observations.)

## Manufacturer playbooks

Table `manufacturer_playbooks` documents **how we scrub** public versions (not trust evidence itself):

| Column | Purpose |
|---|---|
| `method_summary` | How versions are discovered |
| `primary_urls` | JSON array of oracle URLs |
| `extract_notes` | Parsing / pitfalls |
| `cadence_hint` | e.g. `weekly`, `lab-only` |
| `last_scrub_at` | Last NOTES/MILESTONE-derived scrub time |
| `success_rate_notes` | Yield notes |
| `hub_walled` | `1` if public oracle insufficient |
| `portal_app` | e.g. Waves Central, AutoTune Central |

Seeded by `src/seed_playbooks_from_notes.py` from `NOTES-*.md` / `MILESTONE-*.md` / `HUB_WALLED.md`.

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/migrate_v2.py
python3 src/seed_playbooks_from_notes.py
python3 src/export_catalog.py
```

Fresh DB: `python3 src/init_db.py` applies `schema.sql` (v4). Existing DBs use `migrate_v2.py` → `migrate_v3.py` → `migrate_v4.py` as needed.

## Backfill policy

`migrate_v2.py` only links **obvious** name-based generation pairs already present in the universe (FabFilter Pro-Q/Pro-C, iZotope Ozone/Neutron/RX/Trash, PA bx_XL / Vitalizer / bx_boom / bx_refinement). It does **not** invent version numbers or fabricate SKUs. Valhalla products are single-SKU lines (no paid gen successors in-catalog).
