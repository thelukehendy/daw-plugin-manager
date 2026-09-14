# NOTES — Universe expand 5 (identity + optional FOSS chips)

Date: 2026-09-10 ~3:36→3:42 AM PT (2026-09-10T10:36–10:42Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after expand4 (533 / 6264 / 4489 accepted). Add **missing manufacturers + plugins** (identity-only). Prefer **FOSS + xlnaudio + modartt + ignite/stl/ml-sound-lab/two-notes + spitfire/eastwest soundset expansion**. Dedup. Optional easy version chips in-pass. Zero-trust Policy A unchanged — **no invented versions**.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 533 | **549** | **+16** |
| plugins (universe) | 6264 | **6490** | **+226** |
| accepted currents | 4489 | **4497** | **+8** |
| version_observations | 6113 | **6121** | **+8** |
| versions stamped this pass | — | **8** | FOSS twins + Stochas |
| without version | 1775 | **1993** | +218 net (identity balloon − chips) |

Export: `out/catalog.json` — 549 manufacturers, 6490 plugins, 4497 with accepted `latestVersion`.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand5.json` | Main batch (16 mfrs, 218 plugins) |
| `data/universe-expansion-expand5-mop.json` | FOSS first-class twins (6) |
| `data/universe-expansion-expand5-mop2.json` | ARIA hub + Odin1 (2) |
| `tmp-fetch/build_universe_expand5.py` | Builder |
| `tmp-fetch/expand5/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/expand5/chip/` | Version-chip probes |
| `src/import_universe_batch.py` | Upsert (identity only) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand5.py
python3 src/import_universe_batch.py data/universe-expansion-expand5.json
# mop FOSS twins blocked by OAS also_check in main builder
python3 src/import_universe_batch.py data/universe-expansion-expand5-mop.json
python3 src/import_universe_batch.py data/universe-expansion-expand5-mop2.json
# optional FOSS chips (see below)
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+16)

| id | name | ~plugins |
|---|---|---:|
| `modartt` | Modartt | 30 |
| `ignite-amps` | Ignite Amps | 12 |
| `stl-tones` | STL Tones | 6 |
| `ml-sound-lab` | ML Sound Lab | 10 |
| `two-notes` | Two notes | 8 |
| `fractal-audio` | Fractal Audio Systems | 9 |
| `plugin-boutique` | Plugin Boutique | 17 |
| `sample-magic` | Sample Magic | 10 |
| `garritan` | Garritan | 8 |
| `matt-tytel` | Matt Tytel | 1 |
| `thewavewarden` | TheWaveWarden | 4 |
| `brain-control` | Brain Control | 1 |
| `dexed` | Dexed | 1 |
| `distrho` | DISTRHO | 1 |
| `jean-pierre-cimalando` | Jean Pierre Cimalando | 2 |
| `headrush` | HeadRush | 5 |

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| xln-audio | 68 | Was RC-20 + DS-10 only → full AD/AK/XO/AdPak/XOpak universe |
| eastwest | 20 | KVR marketing bundles as `bundle` |
| spitfire-audio | 2 | British Drama Toolkit, Originals - Media Toolkit → `soundset` |
| eventide | 4 | Leftover bundles only (Newfangled already under own mid) |
| audiothing | 4 | Non-Kontakt residuals (bundles + Magical Toy Keyboard) |
| surge-synthesizer | 3 | Stochas + Monique/B-Step display variants |
| chowdsp | 0 | Already complete under `chowdsp` (OAS remapped + twins) |

## FOSS policy this pass

| Project | Action |
|---|---|
| airwindows | Skip — dense; Consolidated-only version policy locked |
| chowdsp | Fill attempted — already complete |
| surge | +Stochas (chipped 1.3.13); Monique/B-Step name variants |
| vital | Skip — Vital already present; Free/Pro same binary |
| helm / odin2 / tunefish / dexed / cardinal / adlplug | First-class manufacturers + plugins (OAS twins); mop when also_check blocked |
| obxd | Already under `discodsp` + OAS — no new mid |

## Amp / cab line attribution

| Line | Manufacturer | Notes |
|---|---|---|
| Freeware amp sims (TS-999, Anvil, NadIR, …) | `ignite-amps` | `isFreeware` |
| ToneHub / AmpHub / ControlHub / Tonality:* | `stl-tones` | Ignite collab; cross-dedup vs Ignite |
| Libra | `ignite-amps` | Freeware IR loader (Ignite KVR) |
| Amped / MIKKO / Wavebreaker | `ml-sound-lab` | |
| GENOME / Torpedo WoS / DynIR Complete | `two-notes` | Curated — KVR empty, site 403; **no DynIR SKU explosion** |
| Cab-Lab 4 / Axe-Edit III / FM3-Edit / FM9-Edit | `fractal-audio` | + Axe-Fx III / FM3 / FM9 hardware |
| ReValver + HeadRush boards | `headrush` | |

## Skipped / policy notes

| Candidate | Action |
|---|---|
| **loopmasters** | Skip per brief |
| **plugin-boutique** | Added exclusives only (Scaler, Carbon Electra, BigKick, …) — not Loopmasters packs |
| **faold / minimal-system** | Empty KVR developer index — skipped |
| **boss tone studio** | Sparse/bogus KVR (CE-2W / pedals) — skipped |
| **neural-dsp** | Dense already |
| **guitar-rig / amplitube / helix** | Already under NI / IK / Line 6 |
| **liquidsonics** | Complete — 0 gaps |
| **cytomic** | Already present |
| **cableguys / baby-audio** | Residuals were CM editions or bundles only — skipped CM |
| **DynIR individual cabs** | Not exploded (1000+ SKUs) — Complete Collection bundle only |

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | Discrete plugs; Ignite/STL/ML; PB exclusives; FOSS; XLN engines/FX |
| `soundset` | Pianoteq models; Garritan libraries; Sample Magic packs; Spitfire fills; AK instruments |
| `expansion` | XLN AdPaks / XOpaks / Trig packs |
| `bundle` | XLN collections; EastWest/Eventide/AudioThing marketing bundles |
| `hub_app` | GENOME; Torpedo Remote; Fractal editors/Fractal-Bot; XLN Life; Garritan ARIA |
| `hardware` | Two notes Torpedo/OPUS; Fractal Axe-Fx/FM; HeadRush boards |
| `discontinued` | Odin (v1) |

## Versions stamped (+8)

| plugin_id | version | source | conf |
|---|---|---|---:|
| `surge-synthesizer--stochas` | 1.3.13 | GitHub release tag | 90 |
| `dexed--dexed` | 1.0.1 | GitHub release tag | 90 |
| `distrho--cardinal` | 26.02 | GitHub release tag | 90 |
| `thewavewarden--odin-2` | 2.4.1 | GitHub asset names + OAS twin | 85 |
| `matt-tytel--helm` | 0.9.0 | OAS registry twin | 85 |
| `jean-pierre-cimalando--adlplug` | 1.0.2 | OAS registry twin | 85 |
| `jean-pierre-cimalando--opnplug` | 1.0.2 | OAS registry twin | 85 |
| `brain-control--tunefish-4` | 4.2.0 | OAS registry twin | 85 |

**Not chipped (not easy):** Pianoteq (page shows product “9” only, no patch semver), Scaler 2 (PB page ambiguous), XLN/Modartt/STL/ML commercial portals, Two notes (site 403).

## What we did not do

- Did not invent versions from KVR listings.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not explode Two notes DynIR cabinet SKUs.  
- Did not add Loopmasters / FAOld / Minimal System / Boss Tone Studio.  
- Did not duplicate Newfangled titles under Eventide.

## Follow-ups

- Version receipts: Pianoteq Pro/Standard/Stage 9, Organteq, Scaler 2 / Scaler EQ, AmpHub/ToneHub, ML Amped line, XLN AD2/XO/RC-20 (RC-20 may already be current), Torpedo Wall of Sound / GENOME, Cab-Lab 4.  
- Optional: reclass many Spitfire `plugin` rows → `soundset` (libraries) in a dedicated honesty pass.  
- Playbooks markdown for +16 new mfrs (stubs below).  
- Plugin Boutique “Radio” freeware identity present.

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only. Airwindows 512 individuals stay intentionally unversioned — Consolidated-only chip.
