# NOTES — Universe unknowns mop 1

Date: 2026-09-10 ~1:20 AM PT (2026-09-10T08:20Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`  
Zero trust. No git clone.

## Goal

Overnight mop of expanded-universe unknowns: public manufacturer version chips first, identity_kind reclassify for soundsets/expansions, KVR@60 when manufacturer silent.

## Counts

| Metric | Before (chip-new-mfrs-1) | After | Delta |
|---|---:|---:|---:|
| manufacturers | 488 | **488** | 0 |
| plugins (universe) | 4367 | **4367** | 0 |
| accepted currents | 2920 | **3242** | **+322** |
| without version | 1447 | **1125** | −322 |
| true plugin gaps | 1008 | **480** | **−528** |
| exported `identityKind` ≠ plugin | 440 | **647** | **+207** |

### Confidence bands (accepted currents)

| Band | Before | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 2049 | **2239** | **+190** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 815 | **947** | **+132** |

Export: `out/catalog.json` — 488 mfrs, 4367 plugins, **3242** with accepted `latestVersion`.

## +Accepted by manufacturer (this mop window)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **hornet** | **100** | ~17 product-page + ~83 KVR | 90 / 60 |
| **meldaproduction** | **88** | downloads kernel 17.10.01 | 92 |
| **eventide** | **39** | downloads/?product= | 92 |
| **audio-damage** | **29** | KVR verwin (legacy long-tail) | 60 |
| **tokyo-dawn-labs** | **17** | product page Latest version | 92 |
| **voxengo** | **13** | KVR legacy cards | 60 |
| **sonnox** | **12** | installers CSV (~10) + KVR (~2) | 92 / 60 |
| **kilohearts** | **9** | KVR (Phase Plant / snapins @2.4.6) | 60 |
| **applied-acoustics** | **8** | support Latest Installers table | 92 |
| **goodhertz** | **7** | suite bundle release (parallel) | 92 |
| **TOTAL** | **322** | | |

## identity_kind reclassifies (highlights)

Do **not** invent versions — reclassify only:

| kind | approx n | examples |
|---|---:|---|
| soundset | ~113 | UVI `*-for-falcon` (~30); AAS Chromaphone/Strum/UA packs (~83); Melda MDrummer/Power* (~8) |
| gen_ambiguous | ~39 | kilohearts bare-id dupes of `khs-*` (~33); AAS prior gens Chromaphone1/VS-2/etc (~6) |
| bundle | ~21 | Melda *Bundle (~7); Blue Cat packs/series (~6); Sonnox suite umbrellas (~5); Kilohearts Essentials/Ultimate/Works (~3); Eventide Anthology XI/XII |
| discontinued | 2 | TDR Feedback Compressor / II → successor Kotelnikov |
| hardware | 2 | Eventide H9 Gen2 / H90 pedals |
| suite_component | ~2 | Melda MTexturedStyleEditor; Eventide H9 Series Blackhole (ambiguous vs main Blackhole) |

Net true-plugin gap reduction from reclassify alone ≈ **206** (1008→480 with −322 versions ⇒ −528 total; −322 versioned ⇒ −206 identity).

EastWest already fully `soundset` pre-mop (0 plugin unknowns).

## Method highlights

1. **Melda** — public downloads still `kernel version: 17.10.01`; applied to all remaining true plugins; classified bundles/soundsets.
2. **TDR** — product pages `Latest version: <strong>X.Y.Z</strong>`; Limiter6 GE at `/tdr-limiter6-ge/`; Feedback Compressor discontinued.
3. **Eventide** — downloads product query; Mac/Win must match; H9 Blackhole left suite_component after bad main-Blackhole map rejected.
4. **HoRNet** — product-page “is available” via WebFetch (box curl/chrome 403); KVR `*-by-hornet-plugins` for long tail. 4 gaps remain (FilterSolo, GuitarKit, TrackUtility, Track Coherence).
5. **Kilohearts** — bare snapin ids without `khs-` prefix → gen_ambiguous duplicates; Phase Plant / Carve EQ / etc via KVR.
6. **UVI/AAS** — Falcon expansions + AAS packs → soundset; AAS instruments via support installers table (parallel).
7. **Acustica** — no public per-plugin oracle (Aquarius gated) → **0** accepts (139 remain).
8. **KVR@60** — Hornet/AD/Voxengo/Kilohearts leftovers when manufacturer silent.
9. **Confidence raise** — corroborated yellow KVR→mfr pages: Kush Omega TWK; Rob Papen B.I.T.2 / PowerChord / SynFeX (+4 → green 88).

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/universe-mop-1/` | Melda/TDR/Eventide/Hornet/KVR caches |
| `tmp-fetch/universe-mop-1/melda-plan.json` | Melda accept/classify plan |
| `tmp-fetch/universe-mop-1/tdr-versions.json` | TDR version map |
| `tmp-fetch/universe-mop-1/kvr-accepted.json` | KVR accept list |
| `playbooks/{meldaproduction,eventide,tokyo-dawn-labs,hornet}.md` | Updated playbooks |
| `out/catalog.json` | Re-exported |

## Still open (notable)

- **Acustica Audio 139** — Aquarius hub-walled; no public oracle this pass
- Plugin Alliance ~89, NI ~59, iZotope ~55, PSP ~35, Arturia ~31 leftovers
- Hornet 4; Sonnox restore/debuzzer/etc. 4; AD legacy ~8; Voxengo legacy ~10
- Pre-expansion stubborn 4 unchanged: `mpegh--mpeg-h-renderer`, `pitchinnovations--groove-shaper-lite`, `soundspot--propane`, `ssl--ssl-meter-pro`

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
