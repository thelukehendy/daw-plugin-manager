# STATUS — DAW Plugin Catalog Store

> **DAILY PUSH 2026-09-23 ~06:00 PT** — shipped the research chips' work via cron `daw-catalog-daily-push` (12h maintenance cadence, tier-1-only; TIER-1 assault COMPLETE, owner-verified 2026-09-16). Bands: green **3,958** (−1), amber **347** (+0), yellow **1,346** (+1). Two plugin changes, both data-integrity corrections from the 09-22 1018+2218 chips (245 researched, zero other version churn): ssl--ssl-acoustifier 1.0.19 → **1.0.18** @92 (green→green; vendor page now explicitly labels "Acoustifier v1.0.18 (v1.0.19 Windows only)", Mac-current convention) and eventide--knife-drop @92 → **@60** (green→yellow; Knife Drop is a Third Man Hardware dot9-series analog pedal — hardware, not a plugin; prior @92 vendor observation was unattributed; identity_kind corrected plugin→hardware, KVR-only evidence demoted). Band movement is honest, not regression.
> Resumed 2026-09-13 ~9:44 PM PT per Luke; `daw-catalog-keep-going` + `daw-catalog-weekly-scrub` stay paused pending his call. Pause snapshot: `PAUSE-SNAPSHOT.md`.

**Snapshot:** 2026-09-23 ~06:00 PT (daily push, ships through maintenance chip 2218 incl. ssl--ssl-acoustifier 1.0.19→1.0.18 @92 correction + eventide--knife-drop @92→@60 hardware-integrity correction)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**SQLite:** `data/catalog.db` · `meta.schema_version=4`  
**Export:** `out/catalog.json` · PluginCatalog `schemaVersion: 3` · `catalogSource: store-export:v4`

## Headline (at pause)

| Metric | Value |
|---|---|
| Manufacturers | **660** |
| Plugins (universe) | **9494** |
| Accepted current versions | **5651** |
| Green (≥85) | **3958** |
| Amber (70–84) | **347** |
| Yellow (<70) | **1346** |
| True plugin gaps (non-Airwindows) | **74** |
| Airwindows intentional unversioned | **512** |

---

## This pass (confidence raise 26 — first chip since pause)

| Action | Result |
|---|---|
| Targets researched | **222** yellows across 12 manufacturers (3 parallel batches) |
| Raised yellow→green | **+14** — plogue **11** @92 (downloads.html version labels; chipsounds/chipspeech/sforzando 1.981→1.982), FL Studio Mobile **4.10.19** @90 (IL forum), DC Snares **1.2** @91 + Scaler EQ **1.1.3** @91 (Scaler Music forum) |
| Skips | **208** principled (hub-walled portals, marketing-only pages, gen-redirect contamination) |
| Notes | `NOTES-confidence-raise-26.md` |
| Universe lead | cymatics.fm now lists ~20 products not in the store (candidate universe-expand-12) |

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
| Green | ≥ 85 | **3959** |
| Amber | 70–84 | **347** |
| Yellow | < 70 | **1345** (KVR @ 60) |

## This pass (universe expand 11)

| Action | Result |
|---|---|
| Manufacturers | **+12** (projectsam, impact-soundworks, fracture-sounds, keepforest, wolf-spectrum, wolf-shaper, ninjas2, fabla, padthv1, synthv1, samplv1, drumkv1) |
| Plugins | **+361** (Spitfire +107, ISW +72, Fracture +56, NI Leap +42, Keepforest +40, ProjectSAM +19, AT/CG/BA/GH/EW/Modartt + FOSS) |
| Version chips | **+8** FOSS (wolf/ninjas2/fabla/v1 suite) |
| Skipped | emotive-sounds (no public SKU matrix); Fracture site captcha → KVR |
| Export | `out/catalog.json` matches DB (**589 / 8494 / 4993**) |

**Prior — version-chip expand-10:** see `NOTES-version-chip-expand-10.md` (571 / 8078 / 4978)  
**Prior — universe expand 10:** see `NOTES-universe-expand-10.md` (571 / 8078 / 4899)
