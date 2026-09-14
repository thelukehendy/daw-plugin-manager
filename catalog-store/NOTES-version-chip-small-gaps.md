# NOTES — version chip small gaps

Date: 2026-09-10 ~1:50 AM PT (2026-09-10T08:53:53Z)
Verified by: coding-assistant
Fetch dir: `tmp-fetch/chip-small-gaps/`
Export: **not** run (per brief)

## Goal
Exhaust public version discovery for remaining true plugin gaps (Audio Damage legacy 8, Sonnox 4, Valhalla 2, Zynaptiq 2, singles). Never invent versions. Manufacturer preferred over KVR@60.

## Accepted this chip

| plugin_id | version | conf | source_kind | receipt |
|---|---|---:|---|---|
| celemony--tonalic | **1.0.3.003** | 92 | releaseNotesPage | https://www.tonalic.com/release-notes.html — heading Tonalic 1.0.3.003 (July 21, 2026). Raises prior KVR 1.0.3@60 |
| zynaptiq--orange-vocoder-nano | **4.0.6** | 92 | releaseNotesPage | https://www.zynaptiq.com/orange-vocoder-nano/orange-vocoder-nano-downloads/ Change Log Version 4.0.6 June 8th 2025 (initial 4.0.3). Not on support Current Versions table |
| audio-damage--quatromod | **1.0.3** | 88 | downloadsPage | free-and-legacy Dropbox `AD040_QuatroMod_103.zip` → 1.0.3 |
| valhalla-dsp--valhallaspacemodulator | **1.2.8** | 88 | productPage | Current Version 1.2.8 (Mac), 1.1.6 (Win) — Mac accepted matching Plate/Shimmer/FreqEcho precedent |
| valhalla-dsp--valhallaubermod | **1.2.8** | 88 | productPage | Same dual Mac/Win; still sold $50 (not discontinued). Mac 1.2.8 accepted |
| zynaptiq--aura | **1.3.3** | 88 | releaseNotesPage | legacy-software-downloads AURA 1.3.3 final line |
| audio-damage--pulse-modulator | **1.0** | 60 | other (KVR) | KVR Product Version 1.0; absent from AD free-and-legacy archive |
| uvi--falcon | **2026** | 88 | productPage | https://www.uvi.net/falcon “Added in Version 2026”; manual SOFTWARE VERSION 2026. Installers still Portal-gated |

## Reclassified (identity_kind / discontinued) — no invented versions

| plugin_id | identity_kind | notes |
|---|---|---|
| audio-damage--basic | discontinued | free-and-legacy: Basic Subtractive Synthesizer; zip unversioned |
| audio-damage--crush | discontinued | Mayhem Suite on free-and-legacy; no zip semver |
| audio-damage--filterpod | discontinued | Mayhem Suite filter component |
| audio-damage--master-destrukto | discontinued | Mayhem Suite distortion component |
| audio-damage--timefnk | discontinued | Mayhem Suite delay component |
| audio-damage--panstation1 | discontinued | free-and-legacy Panstation; successor `audio-damage--panstation-2` (@2.1.1) |
| audio-damage--quatromod | discontinued | free-and-legacy Modulation list; last version 1.0.3 also stamped |
| zynaptiq--aura | discontinued | Mac Apps Bundle 2.0: AURA discontinued → SPECTRE (`zynaptiq--spectre` @1.12.1) |
| soundspot--propane | discontinued | SoundSpot store/support collapsed; no live manufacturer semver page |

## Still unknown (true plugin gaps)

| plugin_id | reason |
|---|---|
| sonnox--fraunhofer-pro-codec | installers CSV Version Number 4.02.0 but Mac pkg `v4.02.0` vs Win exe `v4.01.0` — dual mismatch (playbook skip; CONFIDENCE dual-cap) |
| sonnox--oxford-debuzzer | same Restore pattern Mac 3.02.0 vs Win 3.01.0 |
| sonnox--oxford-declicker | same |
| sonnox--oxford-denoiser | same |
| ssl--ssl-meter-pro | store.solidstatelogic.com Meter Pro — free trial / SSL Download Manager only; no public installer semver (Meter v1.6.6 ≠ Meter Pro) |
| pitchinnovations--groove-shaper-lite | Pro Tools–bundled MIDI FX Lite; full Groove Shaper has retail installers; Lite has no standalone public semver |
| mpegh--mpeg-h-renderer | Fraunhofer/Avid — install only via Avid Link / MyAvid; no public semver |
| uvi--uvi-workstation | Public free download page; no published build/semver (Portal/hub for updates) |
| universal-audio--uadx-electra-88-vintage-keyboard-studio | UA Connect hub-walled per HUB_WALLED.md — skipped |

## Confidence mix (this chip accepts)

| band | count | IDs |
|---|---:|---|
| Green ≥85 | 7 | tonalic 92, nano 92, quatromod 88, spacemod 88, ubermod 88, aura 88, falcon 88 |
| Yellow &lt;70 | 1 | pulse-modulator KVR 60 |

## Method notes

### Audio Damage
- Shopify product collections often Cloudflare-blocked from datacenter curl; **free-and-legacy** page works and is the oracle for discontinued SKUs.
- Filename encoding: `AD040_QuatroMod_103` → 1.0.3 (same family as prior Discord4/Replicant/914 encodes).
- Mayhem Suite zip `Audio_Damage_Mayhem_Installers.zip` has **no** semver — classify only.

### Valhalla
- SpaceModulator + ÜberMod still publish Mac≠Win currents. Accepted **Mac** train @88 to align with already-accepted Plate/Shimmer/FreqEcho dual documentation (not the overly cautious overnight skip). ÜberMod remains a live $50 SKU.

### Zynaptiq
- Orange Vocoder **Nano** versions live on product-specific downloads changelog (4.0.x), **not** the support Current Versions table (that lists Orange Vocoder **IV** 4.0.5).
- Aura is a discontinued Mac audio app (not a live AU/VST product); last legacy 1.3.3 + successor Spectre.

### Sonnox
- Re-fetched installers CSV `content_hash≈cec304f9…` — dual Mac/Win filename mismatch **unchanged** for Restore trio + Fraunhofer Pro-Codec. Keep skip.

## Artifacts
- `NOTES-version-chip-small-gaps.md` (this file)
- Playbooks updated: `playbooks/{audio-damage,valhalla-dsp,zynaptiq,sonnox,celemony}.md` (+ brief uvi if created)
- Fetch: `tmp-fetch/chip-small-gaps/`
