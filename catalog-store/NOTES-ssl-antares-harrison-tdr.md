# NOTES — SSL + Antares + Harrison + Tokyo Dawn Labs zero-trust verification

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant

## Store inventory (before accept)

### ssl (39 plugins)
Blitzer; SSL 360 Link Bus Compressor; SSL 360 Link Channel Strip; SSL 4K B; SSL 4K E; SSL Acoustifier; SSL DeEssentials DeEss; SSL Digicrush; SSL Fusion HF Compressor / Stereo Image / Transformer / Vintage Drive / Violet EQ; SSL G3 MultiBusComp; SSL GateVerb; SSL GuitarStrip; SSL LMC+; SSL Meter; SSL Meter Pro; SSL Module8; SSL Native Bus Compressor 2 / Channel Strip 2 / Drumstrip / FlexVerb / Vocalstrip 2 / X-Comp / X-Echo / X-EQ 2 / X-Phase / X-Saturator / X-ValveComp; SSL PlateVerb; SSL Sourcerer; SSL SpringVerb; SSL SubGen; SSL X-Delay / X-DynEQ / X-Gate / X-Limit.

Seed portal `https://solidstatelogic.com/support/downloads` redirects to support-page downloads and lists products + **SSL Download Manager**; it does **not** publish a full per-plugin version table. Clear public versions taken from SSL Support offline-installer article (states installers below are latest).

### antares (26 plugins)
Auto-Key; Auto-Tune Access / Artist / EFX+ / Hybrid / Pro / Slice / SoundSoap / Vocal Compressor / Vocal EQ / Vocodist; AutoTune (2026); AVOX Articulator / Aspire / Choir / Duo / Mutator / Punch / Sybil / Throat / Warm; Harmony Engine 4x; Metamorph; Mic Mod; Vocal De-Esser; Vocal Reverb.

Seed portal `https://www.antarestech.com/downloads/` **404**. Public install path is AutoTune Central (`/software-download`) — manager-only binaries. Versions taken from public **help.antarestech.com Release Notes** articles (section lists 28 RN pages).

### harrison (17 plugins)
Harrison_32Bus; 32ClassicChannelStrip; BassFlow; De-Esser; DrumFlow; FasTrack; LegacyEQ; LookaheadCompressor; MasteringEQ; MicroGlide; MPCChannelStrip; MPCCompressor; MPCSpectralCompressor; MultiBandCompressor; TremoloPanner; VocalFlow; VocalIntensityProcessor.

Seed portal harrisonconsoles.com/support; current public offline list is Harrison Audio Support “Harrison Plug-in Downloads” (recommends SSL Download Manager; scroll for offline installers). 32 Classic also listed on SSL Plug-in Downloads as latest V2.0.20.

### tokyo-dawn-labs (5 plugins)
TDR Kotelnikov; TDR Molotok; TDR Nova; TDR Prism; TDR VOS SlickEQ.

Public product pages on tokyodawn.net publish “Latest version: x.y.z”.

## Accepted (84)

### SSL — downloadsPage (38/39)

| field | value |
|---|---|
| source_url | https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads |
| source_kind | downloadsPage |
| content_hash | `1f944f5164d57fe2662abba2a23b24bcb4c84248ddef64aaac2cb7bf999ebd23` |
| evidence | Table labels e.g. “Blitzer v1.2.5”, “Channel Strip 2 v2.10.6”; page text: “The offline installers available below are the latest versions.” |

| plugin_id | accepted | seed → page |
|---|---|---|
| ssl--blitzer | **1.2.5** | 1.7 → 1.2.5 |
| ssl--ssl-360-link-bus-compressor | **1.3.9** | 1.7 → 1.3.9 |
| ssl--ssl-360-link-channel-strip | **1.4.8** | 1.7 → 1.4.8 |
| ssl--ssl-4k-b | **1.9.8** | 1.7 → 1.9.8 (base row; sonible add-on listed separately as 1.10.2) |
| ssl--ssl-4k-e | **1.6.8** | 1.7 → 1.6.8 (base; sonible add-on 1.7.1 separate) |
| ssl--ssl-acoustifier | **1.0.19** | 1.0.18 → 1.0.19 |
| ssl--ssl-deessentials-deess | **1.4.1** | match |
| ssl--ssl-digicrush | **1.1.4** | match |
| ssl--ssl-fusion-hf-compressor | **1.3.3** | match |
| ssl--ssl-fusion-stereo-image | **1.3.3** | match |
| ssl--ssl-fusion-transformer | **1.3.3** | match |
| ssl--ssl-fusion-vintage-drive | **1.3.2** | match |
| ssl--ssl-fusion-violet-eq | **1.3.3** | match |
| ssl--ssl-g3-multibuscomp | **1.3.2** | match |
| ssl--ssl-gateverb | **1.1.2** | match |
| ssl--ssl-guitarstrip | **1.3.2** | match |
| ssl--ssl-lmc | **1.5.2** | match |
| ssl--ssl-meter | **1.6.6** | 1.5.11 → 1.6.6 |
| ssl--ssl-module8 | **1.2.2** | match |
| ssl--ssl-native-bus-compressor-2 | **1.9.6** | 1.8.8 → 1.9.6 |
| ssl--ssl-native-channel-strip-2 | **2.10.6** | 2.9.11 → 2.10.6 |
| ssl--ssl-native-drumstrip | **6.8.2** | match |
| ssl--ssl-native-flexverb | **6.9.5** | match |
| ssl--ssl-native-vocalstrip-2 | **6.9.4** | match |
| ssl--ssl-native-x-comp | **6.8.2** | match |
| ssl--ssl-native-x-echo | **6.8.4** | 1.7 → 6.8.4 |
| ssl--ssl-native-x-eq-2 | **6.8.3** | match |
| ssl--ssl-native-x-phase | **6.10.15** | match |
| ssl--ssl-native-x-saturator | **6.9.3** | match |
| ssl--ssl-native-x-valvecomp | **6.9.2** | match |
| ssl--ssl-plateverb | **1.2.2** | 1.7 → 1.2.2 |
| ssl--ssl-sourcerer | **1.2.1** | match |
| ssl--ssl-springverb | **1.0.4** | match |
| ssl--ssl-subgen | **1.2.2** | match |
| ssl--ssl-x-delay | **1.4.4** | 1.7 → 1.4.4 |
| ssl--ssl-x-dyneq | **1.2.1** | match |
| ssl--ssl-x-gate | **1.3.2** | match |
| ssl--ssl-x-limit | **1.3.2** | match |

Note: seed `1.7` on several plugins appears to be a prior mis-scrape of marketing “SSL 360 Link v1.7 Release” on the consumer downloads page — not used.

### Antares — releaseNotesPage (26/26)

Each plugin has its own public RN article under https://help.antarestech.com/hc/en-us/sections/47811896963476-Release-Notes. Accepted the heading version (no build suffix). `verified_by=coding-assistant`; per-article SHA-256 stored on each observation.

| plugin_id | accepted | source article (heading) | seed → page |
|---|---|---|---|
| antares--autotune | **1.2.0** | AutoTune 2026 (1.2.0) | 1.2.0.1349 → 1.2.0 |
| antares--auto-tune-pro | **11.6.0** | AutoTune Pro 11 (11.6.0) | match |
| antares--auto-tune-access | **10.6.0** | Auto-Tune Access 10 (10.6.0) | 10.5.0.103 → 10.6.0 |
| antares--auto-tune-artist | **9.6.0** | Auto-Tune Artist (9.6.0) | 9.5.0.115 → 9.6.0 |
| antares--auto-tune-efx | **10.6.1** | Auto-Tune EFX+ 10 (10.6.1) | 10.6.1.85 → 10.6.1 |
| antares--auto-tune-hybrid | **9.6.0** | Auto-Tune Hybrid 9.6.0 | 9.6.0.205 → 9.6.0 |
| antares--auto-key | **2.6.0** | Auto-Key 2 (2.6.0) | 2.6.0.84 → 2.6.0 |
| antares--auto-tune-slice | **1.6.0** | Slice (1.6.0) | build suffix stripped |
| antares--auto-tune-soundsoap | **6.6.0** | SoundSoap (6.6.0) | build suffix stripped |
| antares--auto-tune-vocal-compressor | **1.6.0** | VocalCompressor (1.6.0) | build suffix stripped |
| antares--auto-tune-vocal-eq | **1.6.0** | VocalEQ (1.6.0) | build suffix stripped |
| antares--auto-tune-vocodist | **1.6.0** | Vocodist (1.6.0) | build suffix stripped |
| antares--vocal-de-esser | **1.6.0** | Vocal De-Esser 1.6.0 | build suffix stripped |
| antares--vocal-reverb | **1.6.0** | Vocal Reverb (1.6.0) | build suffix stripped |
| antares--metamorph | **1.1.1** | Metamorph (1.1.1) | 1.1.1.852 → 1.1.1 |
| antares--harmony-engine-4x | **4.6.1** | Harmony Engine (4.6.1) | 4.6.1.171 → 4.6.1 |
| antares--mic-mod | **4.6.0** | Mic Mod (4.6.0) | build suffix stripped |
| antares--avox-* (Articulator, Aspire, Choir, Duo, Mutator, Punch, Throat, Warm) | **4.6.0** | respective RN headings | build suffixes stripped |
| antares--avox-sybil | **4.6.0** | Sybil (4.6.0) | 4.4.1 → 4.6.0 |

### Harrison — downloadsPage (15/17)

| field | value |
|---|---|
| primary source_url | https://support.harrisonaudio.com/hc/en-gb/articles/15986119874845-Harrison-Plug-in-Downloads |
| content_hash | `f40f7e594a81b7e92f8ee1c1d69a24fc7eed7523398b719f297ba06fa73041ba` |
| 32 Classic exception | accepted **2.0.20** from SSL Plug-in Downloads (hash above) — installer path dated 2026.07.23; Harrison article still labels v1.1.0 |

Accepted (display label matched installer path): 32Bus **2.1.0**, BassFlow **3.1.0**, De-Esser **5.1.0**, DrumFlow **2.1.0**, FasTrack **2.1.0**, LegacyEQ **5.1.0**, LookaheadCompressor **1.1.0**, MasteringEQ **5.1.0**, MicroGlide **1.1.0**, MPCChannelStrip **5.1.0**, MPCCompressor **1.1.0**, MPCSpectralCompressor **3.1.0**, MultiBandCompressor **4.1.0**, TremoloPanner **1.1.0**, plus 32Classic **2.0.20**.

### Tokyo Dawn Labs — productPage (5/5)

| plugin_id | accepted | source_url | content_hash | seed |
|---|---|---|---|---|
| tokyo-dawn-labs--tdr-kotelnikov | **1.6.7** | https://www.tokyodawn.net/tdr-kotelnikov/ | `197e26564b7bd66af5868dc7ee1aa9b8c642728b67c6c5aea0ee98c0b535f621` | match |
| tokyo-dawn-labs--tdr-nova | **2.2.2** | https://www.tokyodawn.net/tdr-nova/ | `f4f0ea2fe9b25070fca5df3272a9159e5427337f6c922cf3363316ea6559378f` | match |
| tokyo-dawn-labs--tdr-vos-slickeq | **1.3.9** | https://www.tokyodawn.net/tdr-vos-slickeq/ | `3d230e0f288cf09fe04dce4a1eb4a6b1a1ce36e5c209c51112dc790723f3db87` | match |
| tokyo-dawn-labs--tdr-molotok | **1.0.7** | https://www.tokyodawn.net/tdr-molotok/ | `721e885483f1538e04d938ebf1e9a2e60f2cf9c2fd7de6e3f1549767caa61cdf` | match |
| tokyo-dawn-labs--tdr-prism | **1.1.4** | https://www.tokyodawn.net/tdr-prism/ | `092bc45b1f0580a0c735c457b400ba6b5385b734bc8e4ba49d7eb9d52ae3464d` | match |

Evidence on each page: “Latest version: x.y.z (Changelog)”.

## Left unknown (3)

| plugin_id | why |
|---|---|
| ssl--ssl-meter-pro | Not listed on SSL Plug-in Downloads latest offline table (only “Meter v1.6.6”). Manager-only / no clear public version. |
| harrison--harrison-vocalflow | Harrison downloads page labels “Vocal Flow v3.1.0” but offline installer href is `…VocalFlow_v3.0.1…` — ambiguous. |
| harrison--harrison-vocalintensityprocessor | Labels “Vocal Intensity Processor v2.1.0” but installer href is `…v2.0.0…` — ambiguous. |

## Final stats (after export)

- accepted observations total: **227** (was 143 prior batch family; +84 this round)
- plugins with current version: **227**
- by manufacturer (current): meldaproduction 42, kilohearts 39, **ssl 38**, **antares 26**, soundtoys 23, fabfilter 17, **harrison 15**, goodhertz 14, valhalla-dsp 8, **tokyo-dawn-labs 5**
- export: `out/catalog.json` — 100 manufacturers, 816 plugins, 227 with accepted latestVersion

## Policy notes

- Did not trust seed `latestVersion` (notably SSL seed `1.7` mis-attributions).
- Did not use SSL Download Manager / AutoTune Central as version oracle.
- Antares public RN versions omit build suffixes present in seed; accepted published RN headings.
- Did not clone git repos.
