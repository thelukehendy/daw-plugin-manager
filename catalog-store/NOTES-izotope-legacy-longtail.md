# NOTES — iZotope legacy + long-tail singles

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant  
Method: live GET + SHA-256 of HTML; `accept_observation.py --set-current`; never trust seed.

Starting accepted: **531/816**. Ending: **576/816** (+45 this round).

---

## This round — accepted by manufacturer

| manufacturer | this round | store total after |
|---|---|---|
| izotope | **35** | 89/109 |
| tbproaudio | **1** | 1/1 |
| bertom | **1** | 1/1 |
| accentize | **1** | 1/1 |
| liquidsonics | **1** | 1/1 |
| audiothing | **1** | 1/1 |
| tekit-audio (plugin tekit--mscontrol) | **1** | 1/1 |
| spl | **1** | 1/1 |
| d16-group | **1** | 1/1 |
| kazrog | **1** | 1/1 |
| harrison | **1** | 16/17 |

---

## A — iZotope legacy (35 accepted / 20 left unknown)

### Accepted

| family | version | source | content_hash | count |
|---|---|---|---|---|
| Relay | **1.7.0** | https://www.izotope.com/pages/release-notes/relay | `1f7f2fe99576366cae2ae468b78395468cc1c8faa9229aed09107a2d18508349` | 1 |
| Neutron 3 Elements | **3.10.0** | https://www.izotope.com/pages/legacy-products | `d65859299552d8b3ded06b545ef27d8d03718583be6b63c7f980e49deab58cd3` | 1 |
| RX 8 modules (Std/Adv suite) | **8.5.0** | legacy-products (+ Apple silicon table v8.5.0) | same legacy hash | 15 |
| RX 9 modules (Std/Adv suite) | **9.4.0** | legacy-products | same legacy hash | 18 |

Evidence:
- Relay RN: `Version 1.7.0 released June 11th, 2025` (latest h2).
- Legacy products page prints `Version: 3.10.0` for Neutron 3 Elements; `Version: 8.5` for RX 8 Standard/Advanced; `Version: 9.4.0` for RX 9 Standard/Advanced. Suite-shared across component plug-ins.
- Apple silicon compat (live, sha `84c450182378a78207321494fe3b9871b52015d20a1e342503270ee9a7262089`): RX 8 Std/Adv Rosetta `(v8.5.0)` corroborates normalizing legacy `8.5` → `8.5.0`.

### Left unknown (20)

| plugin(s) | why |
|---|---|
| Ozone 9 (+ 15 modules / Elements) | Legacy page has Released dates only (no Version). Apple silicon table lists mins App/AU/VST3 `v9.12.0` / AAX `v9.13.0` — labeled **min. version**, not crystal-clear final. Indexed macOS-compat article citing `(v9.13.0)` returns **404** live. |
| Iris 2 | Legacy Released May 4, 2021 only; Iris RN URLs 404; Apple silicon Rosetta min `v2.0.2` only. |
| Trash 2 | Legacy Released Dec 2, 2022 only; Apple silicon Rosetta min `v2.0.6` only; Trash RN page is reimagined Trash 1.x. |
| Nectar 3 Elements | Not listed with Version on legacy page; Apple silicon mins only (`v3.8.0`/`v3.9.0`). |
| generic `izotope--rx` | Generation ambiguous (8/9/11/12). |

---

## B — long-tail singles (10 accepted)

| plugin_id | accepted | source_url | content_hash | evidence |
|---|---|---|---|---|
| tbproaudio--gsatplus | **1.3.11** | https://www.tbproaudio.de/products/gsatplus | `ff13f88fae9c2fa81f8b7f95e105ebf64776395481f09b70a3aa9cac23ed5de9` | Details: Version: 1.3.11 |
| bertom--eq-curve-analyzer-2 | **2.1.3** | https://www.bertomaudio.com/eq-curve-analyzer.html | `aede33812ac4d5a992621e49b4d0eb2e733ff31c320e0c59746e43766a845179` | Latest version: 2.1.3 |
| accentize--dxrevivepro | **1.2.8** | https://www.accentize.com/dxrevive | `7b53f8c61444a7ffcc845cda748b3e966ef3b5ba4643fc51edc4d040c120cc77` | Version History: dxRevive Pro 1.2.8 |
| liquidsonics--lustrous-plates | **1.3.7** | https://www.liquidsonics.com/software/lustrous-plates/ | `68cac3c1f3915ee018342785ab73c679d833aeec952593c876ff10e72fe4c0fe` | Changelog Version 1.3.7 (30 Oct 2025) |
| audiothing--things-texture | **1.1.2** | https://www.audiothing.net/effects/things-texture/ | `d5f8e5ab553edd5d75fd31ae734e3cd4b8170a916c2de77e18741d5049093213` | Changelog 2025/10/02: v1.1.2 |
| tekit--mscontrol | **1.0.0** | https://tekitaudio.itch.io/mscontrol | `ad259f4808dbd587efd42180e3105a85d33b16bb41dea233f7f07c240f598d1e` | Files: MScontrol v1.0 → 1.0.0 |
| spl--spl-machine-head | **1.0.0** | https://plugin-alliance.com/en/products/spl_machine_head.html | `eb7b92601bc2c80119d6abd1027990047cdb617fd39cc114969bdc79d75c92e6` | Installer v1.0.0 Mac/Win |
| d16-group--repeater | **1.2.5** | https://d16.pl/downloads | `0e83c772f5b4b0dc2bc06cf652be19a4a336110d2c64e34784057bd9c1f4c512` | Downloads: Repeater 1.2.5 |
| kazrog--true-iron | **1.4.6** | https://kazrog-knowledge-bas.instantdocsbase.com/help/true-iron-version-history | `e5d2e10cc7c31e5d287fb15ecd8066756f1a30b88dfd7c77222dd7743eaddab4` | Version 1.4.6 - March 24, 2026 |

Probed / left unknown (examples): wa-production Heat2 (only 2.1.0 feature note; KVR claims 2.2.1 — not on vendor page), SIR StandardCLIP (Mac 1.6.056 vs Win 1.6.057 dual), Softube Saturation Knob (Softube Central / no public semver), UVI Workstation / Spitfire LABS / Splice / UA UAD Software / Softube Central (hub or no public plugin semver), Cableguys ShaperBox 2 (store is gen-2; site is ShaperBox 3), Newfangled EQuivocate (downloads without clear SKU version; shared RN ambiguous), Nugen Aligner, Supertone Clear, Synthogy Ivory, THX Spatial Creator, Steven Slate Trigger 2, Sonic Academy ANA 2, Soundspot Propane, Aberrant SketchCassette II (HTTP 202 empty), etc.

---

## C — small leftovers

| plugin_id | accepted | note |
|---|---|---|
| harrison--harrison-vocalflow | **3.0.0** | https://store.harrisonaudio.com/all-products/harrison-vocal-flow — offline installers `Harrison_VocalFlow_v3.0.0.e8e07e48_*` (hash `46f22d0095197f4bedc375dfecdf95423514a009ee92bb875ed9e3908a2b1104`) |
| harrison--harrison-vocalintensityprocessor | unknown | No versioned public installer URL found |
| ssl--ssl-meter-pro | unknown | Store pushes SSL Download Manager; no versioned offline installer URL on product page |
| steinberg remaining 9 | unknown | unchanged (Lindell/ChannelX/Reason Rack/etc. need SDA/account) |
| kiive--xtressor / unfiltered Indent | unknown | PA product pages 404 / no Installer v label |

---

## Hub-walled / account-only leftovers (notable)

These remain without public installer semver (or are clearly hubs):

- **Native Access / iZotope Product Portal** gated: Ozone 9 finals (no public Version on legacy), Iris 2 / Trash 2 / Nectar 3 Elements; also AIR Music Technology (inMusic Software Center), Slate Digital portal, Avid Link/account (54), Waves Central (4), Softube Central (+ Saturation Knob installs via Central), Universal Audio UAD Software / UA Connect, Native Instruments (3) / Guitar Rig 5 / Reaktor 6, IK Multimedia Product Manager (AmpliTube 5), EastWest, Spectrasonics, Focusrite, Bettermaker, United Plugins catalog without public per-SKU pages in this sweep.
- **SSL Download Manager / Complete Access Hub**: SSL Meter Pro; Harrison Vocal Intensity Processor.
- **App stores / sample hubs**: Splice app, Spitfire LABS (app), Apple ASAF, MPEG-H Renderer.
- **Steinberg Download Assistant** for remaining Steinberg SKUs.

---

## Export

`python3 src/export_catalog.py` → `out/catalog.json`  
**100 manufacturers, 816 plugins, 576 with accepted latestVersion** (+45 this round).
