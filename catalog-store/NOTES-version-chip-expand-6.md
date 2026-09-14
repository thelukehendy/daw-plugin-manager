# NOTES — Version chip universe-expand-6 manufacturers

Date: 2026-09-10 ~4:19→4:25 AM PT (2026-09-10T11:19–11:25Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for universe-expand-6 leftovers after FOSS suite chips already landed in expand-6 (LSP 1.2.35 / Dragonfly 3.2.10 / Zam 4.5). Targets: **audiority, cfa-sound, singular-sound, x42, calf, eq10q, guitarix** + Waves/IK/UA/Spitfire/NI/Modartt fills still without currents. Prefer GitHub/OAS/manufacturer **@88–95**; KVR **@60** OK. Classify hardware/soundset honestly. Zero trust. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 559 | **559** | 0 |
| plugins (universe) | 6887 | **6887** | 0 |
| accepted currents | 4669 | **4811** | **+142** |
| without version | 2218 | **2076** | −142 |
| without version + identity_kind=plugin | 697 | **562** | −135 |
| of which non-Airwindows plugin gaps | 185 | **50** | −135 |

### Confidence bands (accepted currents)

| Band | Before (STATUS expand-6) | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 3105 | **3220** | **+115** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1508 | **1535** | **+27** |

Export: `out/catalog.json` — 559 mfrs, 6887 plugins, **4811** with accepted `latestVersion`.

This-pass stamped currents: **+142** (115 manufacturer/GitHub/packaging @88–92 + 27 KVR@60). Green Δ (+115) matches manufacturer greens exactly.

## Accepted new versions by manufacturer (+142)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **calf** | **44** | GitHub tag **0.90.9** (suite) | 90 |
| **audiority** | **44** | 31 Plugin Versions table + 13 KVR leftovers | 92 / 60 |
| **x42** | **24** | Per-plugin GitHub tags (+ setBfree Whirl) | 90 |
| **guitarix** | **13** | GitHub release **0.47.0** (suite) | 90 |
| **cfa-sound** | **5** | KVR (Grizzly / Pro Wave / V-Bass) | 60 |
| **native-instruments** | **5** | KVR hub apps | 60 |
| **eq10q** | **3** | Arch upstream **2.2** (SF 403; Debian corroborates) | 88 |
| **universal-audio** | **2** | KVR C-Suite C-Axe / C-Vox **11.8.3** | 60 |
| **modartt** | **1** | KVR Organteq → organteq-2 **2.1.2** | 60 |
| **ik-multimedia** | **1** | KVR IK Product Manager **1.0.1** | 60 |
| **singular-sound** | **0** | hardware unversioned; BeatBuddy Manager no verwin | — |
| **waves** | **0** | WaveShell / StudioRack OBS no verwin; bundles skipped | — |
| **spitfire-audio** | **0** | fills are soundset/expansion (intentional) | — |
| **TOTAL** | **142** | | |

### Already chipped in expand-6 (unchanged this pass)

| manufacturer | count | version | conf |
|---|---:|---|---:|
| lsp-plugins | 65 | 1.2.35 | 90 |
| zam-audio | 24 | 4.5 | 90 |
| dragonfly-reverb | 5 | 3.2.10 | 90 |

## Method highlights

1. **Audiority** — public https://www.audiority.com/plugin-versions/ Curr Version table → 31 plugins @92 (e.g. Echoes T7E mkII **2.3**, GrainSpace **2.6**, PlexiTape **1.4.2**). Distortion 1 / Green Reaper / Heavy Pedal aliased to mkII / GR9 rows. Leftovers not on table (Dr Drive **1.4**, freeware pedals, TS-1, …) → KVR@60. Soundsets skipped. Open (no verwin): Marimbula, Pills #1/#2, Modular Piano.
2. **Calf** — GitHub tag **0.90.9** (ChangeLog `Version 0.90.9.0`) suite-stamped all 44 @90.
3. **Guitarix** — GitHub release **V0.47.0** / guitarix2-0.47.0 suite-stamped hub + 12 modules @90.
4. **x42** — per-plugin tags from x42/*.lv2 (fil4 **0.8.13**, meters **0.9.30**, darc **0.7.4**, …). **Whirl Speaker** honestly mapped to pantherb/setBfree **0.8.17** (not x42 submodule).
5. **EQ10Q** — SourceForge HTML Cloudflare 403; Arch `eq10q 2.2-8` + Debian `2.2~repack0` document upstream **2.2** → suite chip @88 for EQ / Bass Up / MS.
6. **CFA-Sound** — KVR@60 for DrumGrizzly / FilterGrizzly2 / MonoGrizzly 2 / Pro Wave 2 / V-Bass. Grip Mac≠Win skipped; DC-Zero / WARP no verwin; 16 soundsets skipped.
7. **Fills** — NI hub apps (KK **3.5.4**, Kontakt Player **8.0.0**, Maschine **3.6.0**, Massive X Player **1.6.0**, Reaktor Player **6.4.3**) KVR@60. UA C-Axe/C-Vox **11.8.3**; C-Max mismatch skipped. Modartt organteq-2 **2.1.2**. IK Product Manager **1.0.1**. Spitfire fills remain soundset. TONEX Standard ambiguous `1.12.1 (beta 2.0.2)` skipped; Clavitube Mac≠Win skipped.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand6/` | HTML caches, queues, KVR product pages |
| `tmp-fetch/chip-expand6/build_and_apply.py` | Apply script |
| `tmp-fetch/chip-expand6/accept-queue-manufacturer.json` | Manufacturer/GitHub accepts |
| `tmp-fetch/chip-expand6/accept-queue-kvr.json` | KVR accepts |
| `tmp-fetch/chip-expand6/accepted-summary.json` | Pre-audit summary |
| `tmp-fetch/chip-expand6/audiority-plugin-versions.html` | Manufacturer versions table |
| `playbooks/{audiority,calf,guitarix,x42,eq10q,…}.md` | Updated |
| `out/catalog.json` | Re-exported |

## Still open (notable, expand-6 scope)

- audiority--marimbula / pills-1 / pills-2 / the-modular-piano (no KVR verwin)
- cfa-sound--dc-zero / grip (Mac≠Win) / warp (no verwin)
- singular-sound--beatbuddy-manager (no verwin); hardware BeatBuddy/Aeros unversioned
- modartt--pianoteq-demo (no clean KVR page)
- waves--waveshell / studiorack-obs
- ik-multimedia--clavitube (mismatch) / tonex-standard (beta ambiguity) / vocalive
- universal-audio--uad-c-suite-c-max (mismatch) / uad-software
- native-instruments--traktor-pro / imaschine
- Spitfire / NI / IK soundsets & UA Apollo hardware — intentional non-chip
- Airwindows 512 intentional unversioned (unchanged)

## Identity honesty this pass

| kind | action |
|---|---|
| `plugin` / `hub_app` | Versioned via manufacturer/GitHub or KVR when verwin clean |
| `soundset` / `expansion` / `bundle` / `discontinued` / `hardware` | skipped for version stamp |
| Whirl Speaker | kept under x42 id; version sourced from setBfree (honest upstream) |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/chip-expand6/build_and_apply.py   # already applied
python3 src/export_catalog.py
python3 src/status_report.py
```

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Ambiguous beta-in-verwin → skip. Never invent. Hardware (Singular Sound pedals, UA Apollo, IK TONEX boards) and soundsets stay unversioned.
