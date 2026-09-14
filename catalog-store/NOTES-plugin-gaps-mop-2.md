# NOTES — plugin-gaps mop-2

**When:** 2026-09-10 ~1:50 AM PT (2026-09-10T08:50Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Public product page / downloads / release notes / KVR product-page Product Version only. Zero trust. No git clone. No Alliance Manager / Aquarius / Native Access / ASC stamps.

## Headline

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 488 | **488** | 0 |
| Plugins (universe) | 4367 | **4367** | 0 |
| Accepted currents | **3246** | **3443** | **+197** |
| Without version | 1121 | **924** | −197 |
| True plugin gaps (`identity_kind=plugin`) | **476** | **39** | **−437** |
| Green ≥85 | 2268 | **2318** | **+50** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow &lt;70 (KVR@60) | 922 | **1069** | **+147** |

Export: `out/catalog.json` — 488 mfrs / 4367 plugins / **3443** with `latestVersion` / **888** with non-default `identityKind`.

## What moved the gap needle

1. **+197 version accepts** (manufacturer + KVR + twin-canonical).  
2. **Honest `identity_kind` reclass** (no invented versions): Focusrite FAST discontinued; Overloud packs → expansion; MIK Captain modules → suite_component; NI Kontakt libraries → soundset / hardware / hub_app; Acustica Aquarius hub + **134** Aqua titles → suite_component (Aquarius-only semver); Arturia legacy/gen mismatches; PA gen-ambiguous duplicates; Voxengo legacy discontinued; iZotope expansions + gen umbrellas; Soundtoys 5.5 bundle row.

True gaps fell **476 → 39** (accepts alone would leave ~279; reclass removed the rest of the “fake” yellow unknowns).

## Version accepts by manufacturer (+197)

| manufacturer | +accepted | primary source | conf |
|---|---:|---|---|
| **plugin-alliance** | **74** | twin of canonical SKU (manufacturer) + KVR Product Version | 88–90 / 60 |
| **izotope** | **41** | public RN (Nectar4/Ozone12/RX12/Neoverb/SE2/VEA) + KVR legacy | 95 / 60 |
| **psp-audioware** | **26** | KVR Product Version (leftovers without public installer filename) | 60 |
| **native-instruments** | **26** | KVR Product Version (instruments/FX still `plugin`) | 60 |
| **arturia** | **16** | public `downloads-manuals/product/{slug}` Software Version | 92 |
| **slate-digital** | **12** | KVR Product Version | 60 |
| **soundtoys** | **1** | release-log suite **5.5.5** (FilterFreak umbrella) | 92 |
| **celemony** | **1** | KVR Tonalic **1.0.3** | 60 |

### Manufacturer highlights

- **Arturia downloads-manuals @92:** Pigments 7 `7.0.1.6772`, Pure Sub, Rev OCEAN, Mini V4, Jup-8 V4, Augmented PERSIA, Memory V, Modular/Piano/Wurli/SEM V3, Solina/Stage-73/B-3/VOX/Matrix-12 V2.  
  **Skipped (gen/edition mismatch):** Prophet V→V3 page; SEM V2→V3 page; Augmented Mallets Play / Strings Intro vs full editions; CS-80 V4 / ARP2600 V3 / Analog Lab Pro slug 404; Chorus JUN-6 V / Delay MEMORY-BRIGADE as aliases of already-versioned rows.
- **iZotope RN @95:** Nectar 4 **4.2.0**; Ozone 12 **12.1.0**; RX 12 **12.0.0**; Neoverb **1.4.0**; Stutter Edit 2 **2.1.0**; VEA **1.1.0**. Plus KVR@60 for Exponential Audio / Audiolens / Plasma / Cascadia / VocalSynth 2 / etc.
- **Soundtoys:** `soundtoys--filterfreak` **5.5.5** from release-log (same suite source as FF1/FF2). Suite marketing row → `bundle`.
- **PA:** No Installation Manager stamp. Twins copied from already-accepted canonical ids (Opticom, Tantra, Thorn, Kirchhoff, Cenozoix, THE OVEN, BYOME, Wedge Force, Vac Attack, Chop Shop, Tape Face, Wavesurfer, ADPTR family, Schoeps Mono Upmix). Remaining titles via KVR `verwin` @60 with title match. **Still open:** Magnum-K, EQ4 MS, BDE, Needlepoint (no clean public Product Version this pass).
- **Sonnox Restore / Fraunhofer:** still **skipped** (Mac/Win installer dual mismatch on public CSV — see playbook).

## Identity reclass (selected)

| Kind | Examples |
|---|---|
| `discontinued` | Focusrite FAST + Soften; Melodyne 4 Studio; Arturia Analog Factory / Spark / Storm / Brass; Voxengo Analogflux / Pristine Space / EssEQ / …; PA bx_digital V2 / SPL Attacker / Indent gen-1 |
| `expansion` | Overloud TH-U packs + BREVERB Mix Pack; iZotope BreakTweaker expansions; Slate Classic Tubes 3 |
| `suite_component` | MIK Captain/Human/Pilot modules; **Acustica Aqua titles (134)** via Aquarius |
| `soundset` | NI Abbey Road / Session * / Action * / geographic libraries / Noire / Ashlight / … (**25**) |
| `hardware` | NI Komplete Kontrol Mk3, Traktor Kontrol F1, Traktor MX2 |
| `hub_app` | Aquarius, N4 Player, Nebula3 Server, N4-5; NI Kontakt/Reaktor/Massive X Players, iMaschine; Native Access kind fix |
| `gen_ambiguous` | iZotope Neutron/Insight/Neutron Elements/Stutter Edit gen-1; Arturia Prophet V / SEM V2 / CS-80 V4 / ARP2600 V3 / Analog Lab Pro / Augmented * intro/play; PA DSM / bx_console umbrella / Dangerous BAX EQ umbrella |
| `bundle` | Soundtoys 5.5; PSP MixPack 2 / StereoPack / Studio Classics; NI Effects Series Mod Pack |
| `unknown_other` | Arturia Chorus JUN-6 V + Delay MEMORY-BRIGADE aliases |

## Remaining true plugin gaps (**39**)

Notable leftovers (still yellow-unknown OK):

- **audio-damage** 8 legacy (no public semver / dual mismatch)
- **psp** MixBass/Gate/Pressor/Saturator/Sync/Treble (KVR Mix*2 naming / no verwin)
- **plugin-alliance** Magnum-K, EQ4 MS, BDE, Needlepoint
- **sonnox** Fraunhofer + Restore trio (Mac≠Win)
- **izotope** Alloy/Alloy2/BreakTweaker/iDrum/pHATmatik/Spectron (legacy no-ver / mismatch)
- Stubborn 4 + others: mpegh renderer, groove-shaper-lite, propane, ssl-meter-pro, UVI Falcon/Workstation, Valhalla SpaceModulator/UberMod, Zynaptiq Aura / Orange Vocoder Nano, UADx Electra 88

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/mop2/` | Arturia HTML, iZotope RN, KVR caches, hit JSON |
| `NOTES-plugin-gaps-mop-2.md` | this file |
| `playbooks/*.md` | updated for chipped mfrs |
| `out/catalog.json` | re-exported |
| `STATUS.md` / `HANDOFF-FOR-CURSOR.md` | refreshed |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/status_report.py
python3 src/export_catalog.py
```
