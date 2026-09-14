# NOTES — daw-plugin-catalog-store

## What was built

Zero-trust catalog store at `/workspace/daw-plugin-catalog-store`:

- SQLite schema (`schema.sql` → `data/catalog.db`) with manufacturers, plugins, version_observations, plugin_version_current, vendor_feeds, and meta (`schema_version=1`).
- Python 3 stdlib scripts: init, import_universe (identity-only), export (schemaVersion 3 Policy A), accept_observation CLI, stats.
- Seed import from `/tmp/dpm_catalog.json` strips all version trust fields; `identity_source=seed-catalog-2026-08-10`.
- After init+import: ~100 manufacturers, ~816 plugins, **0** accepted versions / empty `plugin_version_current`.
- Export writes `out/catalog.json` with manufacturers+plugins; no `latestVersion` fields until observations are accepted.

## Trust model

Import never writes version evidence into trusted tables. Versions enter only via `accept_observation.py` (or future feed/lab pipelines) into `version_observations`, then optionally `plugin_version_current` when `--set-current` / accepted.
