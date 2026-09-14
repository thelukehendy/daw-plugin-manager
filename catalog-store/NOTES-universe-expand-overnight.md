# NOTES — Universe expand overnight (batch 2)

Date: 2026-09-10 ~12:53 AM PT (2026-09-10T07:53Z UTC)  
Actor: coding-assistant (executor)

## Goal

Expand the product **universe** well beyond ~2827 with **new identities** (manufacturers + plugins) from public listings. Identity-only — **no invented versions**. Zero-trust Policy A unchanged.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 475 | **488** | **+13** |
| plugins (universe) | 2827 | **4367** | **+1540** |
| accepted currents | 2653 | 2653 | 0 |
| version_observations | 3720 | 3720 | 0 |
| versions stamped this pass | — | **0** | — |

Export: `out/catalog.json` — 488 manufacturers, 4367 plugins, 2653 with accepted `latestVersion`.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-batch2.json` | Batch payload (13 mfrs, 1540 plugins) |
| `tmp-fetch/build_universe_batch2.py` | Builder |
| `tmp-fetch/expand2/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/expand2/{psp,voxengo,melda,tone,kush,mik}-*.html` | Official public pages |
| `src/import_universe_batch.py` | Upsert (no version wipe) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_batch2.py
python3 src/import_universe_batch.py data/universe-expansion-batch2.json
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+13)

| id | name | plugins in |
|---|---|---:|
| `voxengo` | Voxengo | 73 |
| `psp-audioware` | PSPaudioware | 81 |
| `tone-projects` | Tone Projects | 8 |
| `kush-audio` | Kush Audio | 19 |
| `mixed-in-key` | Mixed In Key | 13 |
| `blue-cat-audio` | Blue Cat Audio | 43 |
| `cytomic` | Cytomic | 3 |
| `dmg-audio` | DMG Audio | 16 |
| `acustica-audio` | Acustica Audio | 139 |
| `zynaptiq` | Zynaptiq | 25 |
| `rob-papen` | Rob Papen | 38 |
| `lennardigital` | LennarDigital | 1 |
| `audio-damage` | Audio Damage | 61 |

## Notable expansions of existing manufacturers

| manufacturer | +added | new total (approx.) |
|---|---:|---:|
| uvi | 185 | 186 |
| meldaproduction | 110 | 152 |
| applied-acoustics | 107 | 110 |
| hornet | 104 | 105 |
| eastwest | 94 | 95 |
| plugin-alliance | 89 | 264 |
| native-instruments | 61 | 64 |
| izotope | 55 | 164 |
| kilohearts | 45 | 84 |
| arturia | 44 | 128 |
| eventide | 43 | 46 |
| sonnox | 21 | 26 |
| tokyo-dawn-labs | 19 | 24 |
| slate-digital | 13 | 39 |
| celemony | 7 | 10 |
| (+ thin fills: goodhertz, focusrite, soundtoys, valhalla, overloud, UA) | | |

## Sources / methodology

1. **KVR developer listings** — product title + slug only (never versions).  
2. **Official public pages** — PSP home/products, Voxengo products, MeldaProduction effects/instruments, Tone Projects, Mixed In Key products, Kush plugins page.  
3. **Filters** — skip bundles/suites (with Softube-aware exceptions), hardware (Apollo/iRig/KeyLab/Astrolab/…), CM editions, Rack Extensions, iOS-only, cab IR packs, Overloud BHS/rig packs, NI library sprawl (keeplist), UVI mega-titles, AAS sound-pack noise.  
4. **Dedup** — plugin id `{mfr}--{slug}` + exact name + **normalized** name (strip vendor prefixes / punctuation) against existing DB.  
5. **identity_kind** post-pass on new rows: EastWest + most UVI → `soundset`; AAS packs → `expansion`; Melodyne edition SKUs → `suite_component`; NI Native Access/Maschine/Traktor → `hub_app`. Remaining new discrete plugs stay `plugin` (intentionally without versions until receipts).

## Versions stamped

**None.** No `version_observations` created. `verified_by=coding-assistant` unused this pass.

## What we did not do

- Did not invent or accept versions from KVR.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not grind hub-walled portals.  
- Did not re-raise yellow KVR@60 confidence (plateau acknowledged).

## Follow-ups

- Version receipts for high-value new discrete plugs (PSP, Voxengo, Eventide, Melda, Blue Cat, Cytomic The Glue, DMG, Tone Projects, Kush, Zynaptiq).  
- Further NI/UVI/EastWest identity_kind mop if Electron UX wants fewer `plugin` unknowns.  
- Softube/UA already dense; leftover yield was tiny (expected).  
- OAS weekly accept still separate (`accept_oas_registry.py`).

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only.
