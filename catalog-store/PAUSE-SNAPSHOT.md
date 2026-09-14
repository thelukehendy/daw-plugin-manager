# PAUSE SNAPSHOT — DAW Plugin Catalog Store

**Paused:** 2026-09-10 ~5:40 AM PT (user request: pause new development + cancel planned scrubs)  
**Actor:** coding-assistant

## Live totals at pause

| Metric | Value |
|---|---|
| Manufacturers | **583** |
| Plugins (universe) | **8439** |
| Accepted current versions | **4986** |
| Green (≥85) | **3354** |
| Amber (70–84) | **55** |
| Yellow (<70) | **1577** |
| True plugin gaps (non-Airwindows) | **74** |
| Airwindows intentional unversioned | **512** |

## Artifacts (saved on disk)

- `data/catalog.db` — SQLite source of truth (schema v4)
- `out/catalog.json` — PluginCatalog schemaVersion 3 export (refreshed at pause)
- `HANDOFF-FOR-CURSOR.md` — app integration handoff
- `STATUS.md` — live status
- `CONFIDENCE.md`, `SCHEMA-MICRO-MACRO.md`
- `NOTES-*.md` — all overnight pass notes
- `playbooks/` — per-manufacturer scrub recipes
- This file: `PAUSE-SNAPSHOT.md`

## Routines

- `daw-catalog-keep-going` — **PAUSED**
- `daw-catalog-weekly-scrub` — **PAUSED**

## Resume later

1. Resume routines if desired
2. Read `HANDOFF-FOR-CURSOR.md` + `STATUS.md`
3. Re-export: `python3 src/export_catalog.py`
