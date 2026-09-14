# Apple Silicon seed batch 1 — 2026-09-13 ~10:15 PM PT

First v5 compat-data sweep: 20 manufacturers verified from their OWN pages
(quote + URL each; forums/resellers never decide). 2 honest unknowns.
17 per-plugin overrides applied with strict product-identity matching.

## Manufacturer defaults

| Manufacturer | apple_silicon | version_scheme | Evidence |
|---|---|---|---|
| valhalla-dsp | universal | semver (4.0.0) | valhalladsp.com blog: "all now Universal Binary 2 plugins" |
| fabfilter | universal | build (4.13) | fabfilter.com news: "universal binaries", 2-part increments |
| soundtoys | native | semver (5.5.5) | soundtoys.com: "native compatibility with both Apple Silicon and Intel"; changelog https://www.soundtoys.com/release-log/ |
| u-he | native | semver (1.1.1) | u-he.com releasenotes: "Native support for Apple Silicon chips (M1)" |
| arturia | universal | semver (8.2) | support.arturia.com FAQ: V Coll 8.2 / FX Coll 2.1 run natively as Universal Binaries |
| native-instruments | mixed | semver (8.1.0) | support.native-instruments.com: current line "Nativ kompatibel"; legacy Rosetta-only |
| waves | mixed | marketing (V16) | waves.com: "V14 and above: Full native Apple Silicon support"; changelog https://www.waves.com/downloads/release-notes |
| izotope | native | semver (12.0.0) | support.izotope.com: "currently shipping products support running natively" |
| eventide | native | semver (3.11.4) | eventideaudio.com staff thread: "natively support Apple Silicon and Intel" |
| sonnox | unknown | — | Own pages state OS only, no native-vs-Rosetta wording anywhere |
| ssl | native | semver (6.8.3) | support.solidstatelogic.com: "native support for Apple silicon (M/ARM)" |
| tokyo-dawn-labs | unknown | semver (2.2.2) | Own pages never mention Apple Silicon/M1/ARM |
| goodhertz | native | semver (3.7.5) | goodhertz.com FAQ: "latest releases (≥ v3.7.0) have native support" |
| kilohearts | native | semver (2.4.6) | kilohearts.com/changelog: "1.8.26 — Native support for Apple Silicon" |
| meldaproduction | native | semver (17.10) | meldaproduction.com: "first version with native Apple Silicon ARM CPU support"; changelog https://www.meldaproduction.com/changes/ |
| slate-digital | native | semver4 (1.2.6.0) | support.slatedigital.com: "run natively on Apple Silicon"; per-product installers 4-part |
| plugin-alliance | native | semver (1.3.0) | Per-product changelogs: "Native M1 builds for VST2, VST3 and AU" |
| universal-audio | native | semver (11.8.2) | help.uaudio.com: UADx "automatically run natively on Apple silicon" |
| softube | native | semver (2.6.42) | softube.com: "Apple silicon is supported natively"; changelog https://www.softube.com/eu/release-notes |
| oeksound | native | semver (1.3.3) | oeksound.com/changelog: "1.3.0 — macOS: native Apple Silicon support" |

## Plugin overrides (17)

- arturia: B-3 V, Jup-8 V, Piano V, Stage-73 V → rosetta (legacy gens per Arturia FAQ).
  Skipped: Spark 2 (no confident catalog match), Analog Lab 4 (no row — genuine
  intel-only: activation impossible on Apple Silicon), Midi Control Center (no row).
- izotope: BreakTweaker, Iris 2, Trash 2, RX Loudness Control, Excalibur, Nimbus,
  PhoenixVerb (+Surround), R2 (+Surround), R4 → rosetta. Skipped: RX 8
  Advanced/Standard (no bundle rows), Product Portal (no row).
- waves: Sync Vx, COSMOS Sample Finder → rosetta (Rosetta-2 background process).
- native-instruments: TRAKTOR DJ 2, KONTAKT 5, GUITAR RIG 5 → no catalog rows, skipped.
- slate-digital: legacy FG-X → ambiguous between two rows, skipped pending disambiguation.

## Surprises (for the normalizer + UI copy)

- Waves varies by product VERSION (V14+ native, ≤V12 Intel-only) — per-version arch
  flags will eventually beat per-manufacturer ones.
- NI ABSYNTH 5: compatible with neither Rosetta nor native — dead on Apple Silicon.
- Melda tells users to run Logic itself in Rosetta (host quirk, not plugin verdict).
- Valhalla plugins are UB2 but their installer app was Intel-only/Rosetta.
- iZotope VST2 is Rosetta-only across the board, "native never coming".
- sonnox + tokyo-dawn-labs: honest unknowns → boundary-assault candidates.

## Coverage after this batch

- 18/583 manufacturers carry apple_silicon defaults; 2 marked unknown (researched).
- 2,213/8,439 plugins resolve an appleSilicon value in the export.
- Weekly job continues: ~10 manufacturers/week.
