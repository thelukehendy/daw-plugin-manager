# NOTES — Klanghelm + TAL + Sonnox + Metric Halo + Wavesfactory (+ Focusrite/Bettermaker/ADPTR)

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant

## Store inventory (before accept)

### klanghelm (4)
DC1A3; IVGI2; MJUC; TENSjr.  
Portal: https://klanghelm.com/contents/products.php — free plugins publish `(version x.y.z)` on product pages; paid MJUC downloads are purchase/user-area only (no public version string).

### tal-software (4)
TAL-Chorus-LX; TAL-Reverb-2; TAL-Reverb-3; TAL-Reverb-4.  
Product pages under https://tal-software.com/products/… (Safari UA). Reverb-2/3 current installers are listed on the Reverb-4 product page.

### sonnox (5)
Oxford Drum Gate; Oxford Drum Gate 2; Oxford Inflator; Oxford Limiter; Oxford TransMod.  
https://sonnox.com/installers loads a public Google Sheets CSV (`Version Number` column) via installer widget.

### metric-halo (6)
CGII; MH ChannelStrip; Character; HaloVerb; MHChannelStrip; TransientControl.  
https://mhsecure.com/metric_halo/support/downloads.html — Production Bundle v4 omnibus + CGII rows.

### wavesfactory (6)
Cassette; Cassette Transport; Flash; SK10; SnareBuzz; Spectre.  
Canonical list: https://www.wavesfactory.com/blog/posts/changelog-and-updates/ (my-account downloads login-walled).

### focusrite (5) — optional
FB360 Control / Converter / Mix Loudness / Spatialiser / Stereo Loudness. Suite discontinued by Meta (2022); no official Focusrite version oracle.

### bettermaker (5) — optional
C502V DSP; EQ232D; Passive Equalizer; Bus Comp DSP; Mastering Comp DSP. Seed portal = Plugin Alliance; bettermaker.com/downloads lists hardware-companion installers — DSP SKUs not crystal-clear vs PA builds.

### adptr (5) — optional
Hype; MetricAB; Sculpt; StreamLiner; Utopia. Public adptraudio.com; Metric AB has public changelog. Others lacked clear public semver.

## Accepted (25)

### Klanghelm — productPage (3/4)

| plugin_id | accepted | source_url | content_hash | seed → page |
|---|---|---|---|---|
| klanghelm--dc1a3 | **3.5.0** | https://klanghelm.com/contents/products/DC1A.html | `6b3d09aead3b5969873195a433a97b24257c85fdd90d27b80da193d81a55974b` | match |
| klanghelm--ivgi2 | **2.5.0** | https://klanghelm.com/contents/products/IVGI.html | `40588e6168bcd28edf4ddc5821ce31ccd96010f33ee983d5389856adc2b8627c` | match |
| klanghelm--tensjr | **1.0.7** | https://klanghelm.com/contents/products/TENSjr.html | `e6850176caf10a04aa1ea16bdb818332786b1bd250773b0fc4e4c9d71d8ef133` | match |

Evidence: “Download …: (version x.y.z)”.

### TAL Software — productPage (4/4)

| plugin_id | accepted | source_url | content_hash | seed → page |
|---|---|---|---|---|
| tal--reverb-4 | **4.0.4** | https://tal-software.com/products/tal-reverb-4 | `618eb41b9741f2016621c3e4d1aae2b7cc6a2f371fbf3ca954acc4f08bfd6c57` | 2.11.5 → 4.0.4 |
| tal--chorus-lx | **1.6.3** | https://tal-software.com/products/tal-chorus-lx | `61080cf604533d9909fa9b197c1fedcc24adf752045918571240f26089ddb693` | match |
| tal--reverb-2 | **2.3.0** | https://tal-software.com/products/tal-reverb-4 | (same as reverb-4) | match |
| tal--reverb-3 | **2.3.0** | https://tal-software.com/products/tal-reverb-4 | (same as reverb-4) | match |

Evidence: Reverb-4 “Downloads v4.0.4” + changelog; Chorus-LX “v1.6.3”; Reverb-2/3 h4 labels “TAL-Reverb-2/3 v2.3.0” with current unversioned installers (2.1.1 archived separately).

### Sonnox — downloadsPage (5/5)

| field | value |
|---|---|
| source_url | https://sonnox.com/installers |
| source_kind | downloadsPage |
| content_hash | `cec304f90204266129d51871c81ac03dbd6c56b15b904b60c56af5853597a697` (public CSV) |
| data oracle | Google Sheet CSV linked by installer widget |

| plugin_id | accepted | seed → page |
|---|---|---|
| sonnox--oxford-drum-gate | **2.05.0** | match |
| sonnox--oxford-drum-gate-2 | **1.03.0** | 1.02.0 → 1.03.0 |
| sonnox--oxford-inflator | **4.03.0** | 4.02.4 → 4.03.0 |
| sonnox--oxford-limiter | **4.05.0** | 4.04.1 → 4.05.0 |
| sonnox--oxford-transmod | **4.05.0** | 4.04.0 → 4.05.0 |

### Metric Halo — downloadsPage (6/6)

| field | value |
|---|---|
| source_url | https://mhsecure.com/metric_halo/support/downloads.html |
| content_hash | `cb100c973514c37e1b74a4ccd8cc15108d9d6ab35ad2c655576f4761e89b864f` |
| suite | Production Bundle v4 All Plug-Ins **4.1.12** (documented omnibus) |
| CGII | **4.1.12** (separate row) |

Accepted all six store plugins at **4.1.12** (channelstrip + mhchannelstrip both map to ChannelStrip v4; legacy PB 3.2.18 not used). Seed 3.2.19 / CGII 4.0.71.235 superseded by live table.

### Wavesfactory — releaseNotesPage (6/6)

| field | value |
|---|---|
| source_url | https://www.wavesfactory.com/blog/posts/changelog-and-updates/ |
| content_hash | `a919c2f12e776417d49569e1822227541ff6bdd46dc2bf4b4beb402bb17e8fa6` |

| plugin_id | accepted | seed → page |
|---|---|---|
| wavesfactory--cassette | **1.0.7** | match (also product page) |
| wavesfactory--spectre | **1.5.6** | match (also product page) |
| wavesfactory--sk10 | **1.0.3** | match |
| wavesfactory--snarebuzz | **2.0.1** | match |
| wavesfactory--cassette-transport | **1.0.5** | match |
| wavesfactory--flash | **1.0.2** | match |

### ADPTR — productPage (1/5)

| plugin_id | accepted | source_url | content_hash |
|---|---|---|---|
| adptr--adptr-metricab | **1.5** | https://www.adptraudio.com/products/metric-ab/ | `050d2986af637f1b56f7e0ada4e79b37361f3c4d999d5048103716ffa9eac246` |

Evidence: LATEST VERSION UPDATES “Version v.15 (July 2026)” + homepage “Version 1.5 Out Now”. Seed 1.4.1 → 1.5.

## Left unknown (15)

| plugin_id | why |
|---|---|
| klanghelm--mjuc | Paid product page has no public version; installers via purchase/user area. News last explicit MJUC number is historical. |
| focusrite--fb360-* (5) | FB360 Spatial Workstation discontinued by Meta (2022); no current official Focusrite download/version page. |
| bettermaker--* (5) | DSP SKUs PA-portal; bettermaker.com/downloads covers hardware-companion installers — not crystal-clear mapping to store DSP plugin_ids / PA builds. |
| adptr--adptr-hype | No clear public semver on product page. |
| adptr--adptr-sculpt | No clear public semver. |
| adptr--adptr-streamliner | No clear public semver. |
| adptr--adptr-utopia | Only “Version 1 – Initial Release” — too coarse / ambiguous vs 1.0.0. |

## Final stats (after export)

- accepted observations total: **252** (was 227; **+25** this round)
- plugins with current version: **252**
- by manufacturer (current): meldaproduction 42, kilohearts 39, ssl 38, antares 26, soundtoys 23, fabfilter 17, harrison 15, goodhertz 14, valhalla-dsp 8, **metric-halo 6**, **wavesfactory 6**, **sonnox 5**, tokyo-dawn-labs 5, **tal-software 4**, **klanghelm 3**, **adptr 1**
- export: `out/catalog.json` — 100 manufacturers, 816 plugins, 252 with accepted latestVersion

## Policy notes

- Did not trust seed `latestVersion` (notably TAL-Reverb-4 seed 2.11.5 vs live 4.0.4; Metric Halo seed 3.2.19 vs live PB v4 4.1.12).
- Suite-wide Metric Halo PB v4 4.1.12 accepted only because downloads table documents omnibus installer for all listed v4 plug-ins.
- Sonnox versions taken from public CSV referenced by installers page (not account portal).
- Did not clone git repos.
