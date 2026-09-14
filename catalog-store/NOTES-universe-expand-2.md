# NOTES — Universe expand 2 (identity only)

Date: 2026-09-10 ~2:09→2:14 AM PT (2026-09-10T09:09–09:14Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after overnight batch2 (488 / 4367). Add **new manufacturers + plugins** from public KVR developer indexes (and light official pages). **Identity-only** — no invented `latestVersion` / no `version_observations`. Honest `identity_kind`. Zero-trust Policy A unchanged.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 488 | **508** | **+20** |
| plugins (universe) | 4367 | **5091** | **+724** |
| accepted currents | 3593 | **3593** | 0 |
| version_observations | 4881 | **4881** | 0 |
| versions stamped this pass | — | **0** | — |
| without version | 774 | **1498** | +724 (all new identity rows) |

Export: `out/catalog.json` — 508 manufacturers, 5091 plugins, 3593 with accepted `latestVersion`.

**Note on “true plugin gaps”:** `status_report.py` now lists **496** without-version rows with `identity_kind=plugin`. That balloon is **expected** (new identity-only plugs awaiting receipts). The prior stubborn receipt gaps remain exactly **7**: `mpegh--mpeg-h-renderer`, `pitchinnovations--groove-shaper-lite`, Sonnox Restore trio + Fraunhofer, `ssl--ssl-meter-pro`.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand2.json` | Batch payload (20 mfrs, 724 plugins) |
| `tmp-fetch/build_universe_expand2.py` | Builder |
| `tmp-fetch/expand2b/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/expand2b/*-official.html` | Light official public pages |
| `src/import_universe_batch.py` | Upsert (now persists `identity_kind` / `notes_for_user` when present; still never writes versions) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand2.py
# optional refine (elysia→PA remap, IK hardware skip) applied in-session
python3 src/import_universe_batch.py data/universe-expansion-expand2.json
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+20)

| id | name | ~plugins in |
|---|---|---:|
| `auburn-sounds` | Auburn Sounds | 8 |
| `denise` | denise | 26 |
| `excite-audio` | Excite Audio | 29 |
| `polyverse` | Polyverse Music | 8 |
| `sonible` | sonible | 35 |
| `sound-radix` | Sound Radix | 10 |
| `tracktion` | Tracktion | 34 |
| `bitwig` | Bitwig | 4 |
| `xhun-audio` | Xhun Audio | 37 |
| `discodsp` | discoDSP | 32 |
| `heavyocity` | Heavyocity | 72 |
| `glitchmachines` | Glitchmachines | 12 |
| `audified` | Audified | 57 |
| `dear-reality` | Dear Reality | 11 |
| `fuse-audio-labs` | Fuse Audio Labs | 29 |
| `antelope-audio` | Antelope Audio | 47 |
| `landr` | LANDR | 18 |
| `analog-obsession` | Analog Obsession | 72 |
| `toneboosters` | ToneBoosters | 34 |
| `mathew-lane` | Mathew Lane | 4 |

**Not added as separate mfr:** `elysia` — unique titles remapped onto `plugin-alliance` (PA distribution); 7 overlaps skipped. **Relay** — no usable KVR developer index found this pass. **Reason racks** — skipped per brief.

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| ik-multimedia | 86 | many libraries → `soundset`; hardware SKUs → `hardware` |
| tal-software | 27 | was thin (4); now full TAL line |
| plugin-alliance | 21 | Brainworx leftover + remapped elysia uniques |
| unfiltered-audio | 5 | thin fill |
| spitfire-audio | 3 | `soundset` |
| native-instruments | 2 | `soundset` / keep filters |
| cherry-audio | 1 | preset pack → `expansion` |

**Already dense (0 new):** FabFilter, Soundtoys, Eventide, Softube, Waves, MeldaProduction, Voxengo, UAD, Baby Audio, Cableguys, D16, oeksound, u-he — overnight batch2 already covered these KVR lists.

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | Discrete plugs (default) |
| `soundset` | Spitfire / Heavyocity / Excite Bloom·Evolve / NI libraries / IK content packs |
| `expansion` | Xhun Exp / discoDSP sound banks / Cherry preset pack |
| `hub_app` | Bitwig Studio editions, Waveform Free/Pro, IK Product Manager, LANDR services |
| `bundle` | Marketing bundles kept only when useful; Antelope subscription SKU |
| `hardware` | IK iRig/TONEX pedal/board/Z-Tone; elysia 500/Qube/rack form-factors |

Post-import mop: ~108 `identity_kind` corrections (IK libraries/hardware, discoDSP banks, PA elysia hardware SKUs).

## Sources / methodology

1. **KVR developer listings** — product title + slug only (never versions).  
2. **Official public pages** — Auburn Sounds, FabFilter products, sonible, Sound Radix, Polyverse, Excite Audio, denise (supplemental).  
3. **Filters** — skip bundles (mostly), hardware interfaces/controllers, CM editions, Rack Extensions, iOS-only, cab IR packs, Reason racks. Softube suites allowed selectively.  
4. **Dedup** — plugin id `{mfr}--{slug}` + exact name + normalized name; discoDSP also checked against `oas--discodsp`.  
5. **Bitwig stock devices** — not invented; KVR only lists Studio editions (`hub_app`). Stock device inventory not published as discrete KVR products.

## Versions stamped

**None.** No `version_observations` created. `verified_by` unused.

## What we did not do

- Did not invent or accept versions from KVR.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not grind hub-walled portals.  
- Did not create separate `brainworx` / `elysia` manufacturers (PA already covers distribution).  
- Did not fabricate Bitwig stock-device rows without a public discrete listing.

## Follow-ups

- Version receipts for high-value new discrete plugs: Auburn Couture/Graillon, sonible smart:\*, Sound Radix Auto-Align/POWAIR, Polyverse Manipulator/Filterverse, denise Perfect Room 2, TAL-U-No-LX / TAL-Drum, ToneBoosters v4 line, Fuse Ocelot/VCL, Glitchmachines.  
- Optional: Bitwig stock device list from Bitwig manual (separate curated pass → `daw_stock_effect`).  
- Optional: Waves / Softube / UAD long-tail residual if PluginHub benchmark still short.  
- Relay manufacturer: locate public catalog if/when slug known.  
- Playbooks markdown for the +20 new mfrs (DB playbooks still 444).

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only.
