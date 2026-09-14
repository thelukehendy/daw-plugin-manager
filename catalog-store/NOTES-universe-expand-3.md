# NOTES — Universe expand 3 (identity only)

Date: 2026-09-10 ~2:38→2:45 AM PT (2026-09-10T09:38–09:45Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after expand2 (508 / 5091). Add **missing mid/small manufacturers + plugins** (identity-only). Prefer **airwindows + sugar-bytes + madrona + sonic-charge + neural-dsp + positive-grid + initial-audio + wa-production** when absent. Honest `identity_kind`. Zero-trust Policy A unchanged — **no invented versions**.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 508 | **520** | **+12** |
| plugins (universe) | 5091 | **5960** | **+869** |
| accepted currents | 4050 | **4050** | 0 |
| version_observations | 5490 | **5490** | 0 |
| versions stamped this pass | — | **0** | — |
| without version | 1041 | **1910** | +869 (all new identity rows) |

Export: `out/catalog.json` — 520 manufacturers, 5960 plugins, 4050 with accepted `latestVersion`.

**Note on “true plugin gaps”:** `status_report.py` now lists **~773** without-version rows with `identity_kind=plugin`. That balloon is **expected** (new identity-only plugs awaiting receipts). The definitive receipt gaps remain exactly **15** — see `NOTES-gaps-mop-expand2.md` / HANDOFF section.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand3.json` | Batch payload (12 mfrs, ~870 plugins incl. mop) |
| `tmp-fetch/build_universe_expand3.py` | Builder |
| `tmp-fetch/expand3/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/expand3/Airwindopedia.txt` | Airwindows algorithm catalog (GitHub raw) |
| `src/import_universe_batch.py` | Upsert (identity only; never writes versions) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand3.py
python3 src/import_universe_batch.py data/universe-expansion-expand3.json
# mop: Neural DSP discrete *Suite* installers (bundle-filter false positive)
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+12)

| id | name | ~plugins in |
|---|---|---:|
| `airwindows` | Airwindows | 515 |
| `sugar-bytes` | Sugar Bytes | 24 |
| `madrona-labs` | Madrona Labs | 5 |
| `sonic-charge` | Sonic Charge | 6 |
| `neural-dsp` | Neural DSP | 30 |
| `positive-grid` | Positive Grid | 9 |
| `initial-audio` | Initial Audio | 34 |
| `audiorealism` | AudioRealism | 6 |
| `dawesome` | Dawesome | 5 |
| `line-6` | Line 6 | 16 |
| `kemper` | Kemper | 8 |
| `vcv` | VCV | 2 |

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| wa-production | 101 | was Heat2-only; full KVR W.A. Production line |
| native-instruments | 73 | mostly Kontakt/NKS → `soundset` |
| cymatics | 19 | was Origin-only |
| ssl | 13 | 4K G, autoSeries trio, B/E Dynamics, SiX Channel, UltraViolet, VHD+, X-Orcism II, LMC-1, X-ISM, DeEss |
| chowdsp | 3 | Centaur/Kick/Phaser native twin names (OAS already has them) |
| softube | 0 | already dense (Tinnerö Tremolo present) |
| baby-audio / cableguys / valhalla-dsp / fabfilter | 0 | already dense |

## Skipped / policy notes

| Candidate | Action |
|---|---|
| **elysia** | Still **only under PA** (`plugin-alliance--elysia-*`) — no separate mfr (expand2 policy). |
| **vital** / **surge** | Already present (`vital-audio--vital`, `oas--surge-synthesizer-surge`, etc.). |
| **cardinal** | Already `oas--distrho-cardinal` — no duplicate mfr. |
| **fractal-audio** | No usable KVR developer index this pass. |
| **plugin-boutique exclusives** | Not invented; only add when a real developer KVR/official catalog exists. |
| **Kemper** | Hardware Profiler SKUs + `Rig Manager` hub_app (no discrete DAW plugin line). |
| **Dawesome vs Tracktion** | Deduped: Hate/KULT/NOVUM/Myth/Chop Suey already on `tracktion`; added Abyss/Kontrast/Love 2/Sol/Zyklop under `dawesome`. |
| **UA Apollo / bundles** | Hardware + marketing collections skipped. Softube residual already present. |
| **Airwindows** | Consolidated + Airwindopedia algorithms (individual standalone + Consolidated host). Freeware MIT. **No versions stamped.** |

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | Discrete plugs (default); Airwindows algorithms; Neural Archetypes; WA FX |
| `soundset` | NI Kontakt/NKS libraries (~73) |
| `expansion` | Initial Audio Heat Up expansions / kits |
| `hardware` | Kemper Profilers; Line 6 Helix/POD hardware; Positive Grid pedals/Spark; Neural Quad Cortex mini |
| `hub_app` | VCV Rack / Pro; Kemper Rig Manager; Positive Grid JamUp |
| `bundle` / `discontinued` | Rare (Sugar Bundle skipped mostly; Unique LE → discontinued) |

## Sources / methodology

1. **Airwindopedia.txt** (GitHub raw of airwindows/airwindows) — category algorithm list + Consolidated official page.  
2. **KVR developer listings** — product title + slug only (never versions).  
3. **Filters** — skip marketing bundles (except intentional Neural *Suite* installers mopped back in), iOS-only, CM editions, Rack Extensions, Apollo interfaces.  
4. **Dedup** — plugin id `{mfr}--{slug}` + exact name + normalized name; dawesome also checked against `tracktion`; chowdsp against OAS chow mids.  
5. **Neural DSP “Suite”** — product names containing “Suite” are discrete installers, not marketing bundles; mopped after initial BUNDLE_RE false positive.

## Versions stamped

**None.** No `version_observations` created. `verified_by` unused.

## What we did not do

- Did not invent or accept versions from KVR / Airwindopedia.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not grind hub-walled portals.  
- Did not create separate `elysia` manufacturer.  
- Did not invent Synplant 2 / Fractal FM3 plugin rows without public discrete listings.  
- Did not add Plugin Boutique as a manufacturer or invent PB-exclusive brands.

## Follow-ups

- Version receipts for high-value new discrete plugs: Airwindows Consolidated, Sugar Bytes Effectrix2/Turnado/Aparillo, Madrona Aalto/Kaivo/Sumu, Sonic Charge Synplant/Microtonic/Permut8, Neural Archetype X line, Positive Grid BIAS X / BIAS FX 2, Initial Heat Up 3 / Sektor, WA InstaComposer 3 / ChopBeast 2, Cymatics Diablo/Omnivox.  
- Optional: Fractal Audio when public software catalog slug found.  
- Optional: raise Airwindows `isFreeware` flags in DB (export path) in a later pass.  
- Playbooks markdown for the +12 new mfrs (DB playbooks still 466).

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only. The **15** portal/dual receipt gaps are unchanged — see HANDOFF Electron UX section.
