# STATUS — DAW Plugin Catalog Store

> **PAUSED 2026-09-10 ~5:40 AM PT** — Luke asked to pause new development and cancel planned scrubs. Routines `daw-catalog-keep-going` + `daw-catalog-weekly-scrub` are **paused**. Snapshot: `PAUSE-SNAPSHOT.md`. Export refreshed at pause.

**Snapshot:** 2026-09-10 ~5:40 AM PT (pause)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**SQLite:** `data/catalog.db` · `meta.schema_version=4`  
**Export:** `out/catalog.json` · PluginCatalog `schemaVersion: 3` · `catalogSource: store-export:v4`

## Headline (at pause)

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

---

## Airwindows policy (locked)

- **512** individual algorithms stay **unversioned on purpose** (no per-SKU semver on airwindows.com zips).
- Version **only** `airwindows--airwindows-consolidated` = **`2026-09-05-2a6d1c0`**.
- Electron: show Consolidated version / `notesForUser` / `isFreeware` — **do not invent** per-SKU versions.
- Prefer notes + Consolidated CTA over mass `suite_component` reclass (standalones still exist).
- Detail: `NOTES-gaps-mop-airwindows-policy.md`, `NOTES-airwindows-ssl-chip.md`, `playbooks/airwindows.md`.

## Confidence bands (accepted currents)

| Band | Score | Count |
|---|---|---|
| Green | ≥ 85 | **3354** |
| Amber | 70–84 | **55** |
| Yellow | < 70 | **1577** (KVR @ 60) |

## This pass (universe expand 11)

| Action | Result |
|---|---|
| Manufacturers | **+12** (projectsam, impact-soundworks, fracture-sounds, keepforest, wolf-spectrum, wolf-shaper, ninjas2, fabla, padthv1, synthv1, samplv1, drumkv1) |
| Plugins | **+361** (Spitfire +107, ISW +72, Fracture +56, NI Leap +42, Keepforest +40, ProjectSAM +19, AT/CG/BA/GH/EW/Modartt + FOSS) |
| Version chips | **+8** FOSS (wolf/ninjas2/fabla/v1 suite) |
| Skipped | emotive-sounds (no public SKU matrix); Fracture site captcha → KVR |
| Export | `out/catalog.json` matches DB (**583 / 8439 / 4986**) |

**Prior — version-chip expand-10:** see `NOTES-version-chip-expand-10.md` (571 / 8078 / 4978)  
**Prior — universe expand 10:** see `NOTES-universe-expand-10.md` (571 / 8078 / 4899)
