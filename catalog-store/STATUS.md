# STATUS — DAW Plugin Catalog Store

> **DAILY PUSH 2026-09-24 ~06:00 PT** — shipped the research chips' work via cron `daw-catalog-daily-push` (12h maintenance cadence, tier-1-only; TIER-1 assault COMPLETE, owner-verified 2026-09-16). Bands: green **3,958** (+0), amber **347** (+0), yellow **1,346** (+0). **Zero-churn push:** 263 plugins researched across the 09-23 1018 + 2218 chips (0 promoted, 263 observed, all held at stored versions — MeldaProduction 130 @17.10.01, Kilohearts 83 @2.4.6, Soundtoys 27 @5.5.5, Goodhertz 22 @3.14.1) plus one resolved FabFilter probe (Pro-Q 3 held at 3.29 — the 3.31/3.33/3.35 numbers on the Additional Downloads page belong to other products; identity guard honored). All 263 held rows' `verified_at` refreshed to chip time; the head-of-queue freshness rotation stays self-advancing. Zero version churn is the freshness loop confirming stability, not a miss.
> Resumed 2026-09-13 ~9:44 PM PT per Luke; `daw-catalog-keep-going` + `daw-catalog-weekly-scrub` stay paused pending his call. Pause snapshot: `PAUSE-SNAPSHOT.md`.

**Snapshot:** 2026-09-24 ~06:00 PT (daily push, ships through maintenance chip 2218 — zero-churn freshness push: 263 researched, 0 promoted, all rows held)  
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
