# DAW Plugin Catalog Store

Zero-trust plugin version store for Luke's DAW Plugin Manager.

- **Product universe** (manufacturers + plugins identity) is imported from the seed catalog.
- **Verified versions** are stored only via accepted `version_observations` + `plugin_version_current`.
- Export emits PluginCatalog **schemaVersion 3** JSON for the Electron app (Policy A: plugins always exported for matching; version fields only when accepted).

## Layout

```
daw-plugin-catalog-store/
  schema.sql
  data/catalog.db          # created by init
  out/catalog.json         # created by export
  src/
    init_db.py
    import_universe.py
    export_catalog.py
    accept_observation.py
    stats.py
  README.md
  NOTES.md
```

## Requirements

Python 3 (stdlib only — uses `sqlite3`).

## Micro vs macro (schema v2)

See **SCHEMA-MICRO-MACRO.md**. After init/import:

```bash
python3 src/migrate_v2.py
python3 src/seed_playbooks_from_notes.py
python3 src/export_catalog.py
```

`latestVersion` = free micro update within that plugin’s generation. `successorPluginId` = optional paid next gen (separate UX badge).

## Version confidence (schema v3)

See **CONFIDENCE.md**. After v2 migrate:

```bash
python3 src/migrate_v3.py
python3 src/backfill_confidence.py
python3 src/export_catalog.py
```

Export adds `versionConfidence` / `versionConfidenceReasons` when a version is present, plus optional `portalApp`, `updateChannel`, `isFreeware`, `requiresIlok`, `notesForUser`. Electron: green ≥85, yellow &lt;70.

## Exact commands

```bash
cd /workspace/daw-plugin-catalog-store

# 1. Create empty DB + tables (schema_version=3)
python3 src/init_db.py

# 2. Import manufacturers + plugins identity ONLY
#    Uses /tmp/dpm_catalog.json if present, else downloads GitHub raw catalog.json
#    Does NOT import latestVersion / versionEvidence / versionSourceUrl / versionVerifiedAt
python3 src/import_universe.py

# 3. Stats (expect ~100 manufacturers, ~816 plugins, 0 accepted versions)
python3 src/stats.py

# 4. Export PluginCatalog schemaVersion 3 (Policy A)
python3 src/export_catalog.py
# → out/catalog.json
```

### Accept a verified version (optional)

```bash
python3 src/accept_observation.py \
  --plugin-id 'plugin-alliance--ada-flanger' \
  --version '1.6.0' \
  --source-url 'https://www.plugin-alliance.com/products/flanger' \
  --source-kind productPage \
  --set-current \
  --verified-by luke \
  --evidence-snippet 'Version 1.6.0 on product page'

# Re-export after accepting observations
python3 src/export_catalog.py
```

## Policy A (export)

- Every manufacturer and every universe plugin is exported (app needs `matchPatterns`).
- `latestVersion` / `versionSourceUrl` / `versionVerifiedAt` / `versionEvidence` are set **only** when `plugin_version_current` points at an observation with `status=accepted`.
- `source_kind` → `versionEvidence` mapping:
  - `vendorFeed` → `manufacturer-feed`
  - `labOnDisk` → `agent-verified`
  - `releaseNotesPage` | `productPage` | `downloadsPage` → `page-confirmed`
  - `other` → `page-confirmed` (preferred over curated-seed)

## Seed source

1. `/tmp/dpm_catalog.json` if it exists
2. Else: `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`

Do **not** clone the daw-plugin-manager git repo.
