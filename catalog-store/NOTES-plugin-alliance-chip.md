# NOTES — Plugin Alliance chip + Unfiltered Audio + Priority B scraps

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant

## Scope

- **plugin-alliance**: 175 universe plugins; live public product pages only (no account login).
- **unfiltered-audio**: 18/19 on PA product pages (legacy Indent 1 not listed).
- **Priority B scraps**: ADPTR leftovers via PA; Sonarworks download-center; MJUC/Xtressor/MelodyneBridge still unknown.

## Method

1. List seed `update_portal_url` from store DB (never trusted for version).
2. Live GET `https://www.plugin-alliance.com/products/<slug>` with browser UA.
3. Extract **Installer vX.Y.Z (Mac…)** label; SHA-256 of full HTML; title must match plugin.
4. Seed often mapped ~31 plugins to Opticom XLA-3 incorrectly — rediscovered via slug guesses + Shopify suggest.json.
5. Corrected over-broad suite accepts (SSL 9000 J, AMEK 200, Masterdesk variants, Shredspread, Shadow Hills Mastering vs Class A, AMEK Mastering Comp).

## Plugin Alliance — accepted (162/175)

| plugin_id | ver | source slug |
|---|---|---|
| `plugin-alliance--acme-opticom-xla-3` | **1.11.1** | `opticom-xla-3` |
| `plugin-alliance--ada-flanger` | **1.6.0** | `flanger` |
| `plugin-alliance--ada-std-1-stereo-tapped-delay` | **1.6.0** | `std-1-stereo-tapped-delay` |
| `plugin-alliance--amek-eq-200` | **1.5.0** | `eq-200` |
| `plugin-alliance--amek-eq-250` | **1.2.0** | `eq-250` |
| `plugin-alliance--amek-mastering-compressor` | **1.2.0** | `mastering-compressor-amek` |
| `plugin-alliance--ampeg-b15n` | **1.6.0** | `b-15n` |
| `plugin-alliance--ampeg-svt3pro` | **1.6.0** | `svt-3pro` |
| `plugin-alliance--ampeg-svtvr` | **1.6.0** | `svt-vr` |
| `plugin-alliance--ampeg-svtvr-classic` | **1.6.0** | `svt-vr` |
| `plugin-alliance--ampeg-v4b` | **1.6.0** | `v-4b` |
| `plugin-alliance--bde-pa` | **1.2.1** | `bde` |
| `plugin-alliance--bettermaker-bm60` | **1.0.1** | `bm60` |
| `plugin-alliance--black-box-analog-design-hg-2` | **1.10.0** | `hg-2` |
| `plugin-alliance--black-box-analog-design-hg-2ms` | **1.4.0** | `hg-2ms` |
| `plugin-alliance--black-box-analog-design-hg-q` | **1.0.1** | `hg-q` |
| `plugin-alliance--bx-2098-eq` | **1.9.0** | `bx_2098-eq` |
| `plugin-alliance--bx-aura` | **1.1.0** | `bx_aura` |
| `plugin-alliance--bx-bassdude` | **1.12.0** | `bx_bassdude` |
| `plugin-alliance--bx-blackdist2` | **1.10.0** | `bx_blackdist2` |
| `plugin-alliance--bx-bluechorus2` | **1.12.0** | `bx_bluechorus2` |
| `plugin-alliance--bx-boom` | **3.0.0** | `bx_boom-v3` |
| `plugin-alliance--bx-boom-v3` | **3.0.0** | `bx_boom-v3` |
| `plugin-alliance--bx-cleansweep-pro` | **1.11.1** | `bx_cleansweep-pro` |
| `plugin-alliance--bx-cleansweep-v2` | **2.17.0** | `bx_cleansweep-v2` |
| `plugin-alliance--bx-clipper` | **1.1.0** | `bx_clipper` |
| `plugin-alliance--bx-console-amek-200` | **1.1.3** | `bx_console-amek-200` |
| `plugin-alliance--bx-console-amek-9099` | **1.4.0** | `bx_console-amek-9099` |
| `plugin-alliance--bx-console-focusrite-sc` | **1.6.0** | `bx_console-focusrite-sc` |
| `plugin-alliance--bx-console-n` | **1.10.1** | `bx_console-n` |
| `plugin-alliance--bx-console-ssl-4000-e` | **1.8.0** | `bx_console-ssl-4000-e` |
| `plugin-alliance--bx-console-ssl-4000-g` | **1.8.0** | `bx_console-ssl-4000-g` |
| `plugin-alliance--bx-console-ssl-9000-j` | **1.5.0** | `bx_console-ssl-9000-j` |
| `plugin-alliance--bx-control-v2` | **2.16.1** | `bx_control-v2` |
| `plugin-alliance--bx-crispytuner` | **1.1.0** | `bx_crispytuner` |
| `plugin-alliance--bx-delay2500` | **1.9.0** | `bx_delay-2500` |
| `plugin-alliance--bx-digital-v3` | **3.11.0** | `bx_digital-v3` |
| `plugin-alliance--bx-digital-v3-mix` | **3.11.0** | `bx_digital-v3` |
| `plugin-alliance--bx-distorange` | **1.12.0** | `bx_distorange` |
| `plugin-alliance--bx-dyneq-v2` | **2.18.0** | `bx_dyneq-v2` |
| `plugin-alliance--bx-dyneq-v2-mono` | **2.18.0** | `bx_dyneq-v2` |
| `plugin-alliance--bx-enhancer` | **1.2.0** | `bx_enhancer` |
| `plugin-alliance--bx-glue` | **1.1.0** | `bx_glue` |
| `plugin-alliance--bx-greenscreamer` | **1.12.0** | `bx_greenscreamer` |
| `plugin-alliance--bx-hybrid-v2` | **2.14.0** | `bx_hybrid-v2` |
| `plugin-alliance--bx-hybrid-v2-mix` | **2.14.0** | `bx_hybrid-v2` |
| `plugin-alliance--bx-limiter` | **1.3.0** | `bx_limiter-true-peak` |
| `plugin-alliance--bx-limiter-true-peak` | **1.3.0** | `bx_limiter-true-peak` |
| `plugin-alliance--bx-masterdesk` | **1.8.0** | `bx_masterdesk` |
| `plugin-alliance--bx-masterdesk-classic` | **1.8.0** | `bx_masterdesk-classic` |
| `plugin-alliance--bx-masterdesk-pro` | **1.3.0** | `brainworx-bx_masterdesk-pro` |
| `plugin-alliance--bx-masterdesk-true-peak` | **1.2.0** | `bx_masterdesk-true-peak` |
| `plugin-alliance--bx-megadual` | **1.13.0** | `bx_megadual` |
| `plugin-alliance--bx-megasingle` | **1.13.0** | `bx_megasingle` |
| `plugin-alliance--bx-metal2` | **1.10.0** | `bx_metal2` |
| `plugin-alliance--bx-meter` | **1.18.0** | `bx_meter` |
| `plugin-alliance--bx-oberhausen` | **1.7.0** | `bx_oberhausen` |
| `plugin-alliance--bx-opto` | **1.11.0** | `bx_opto` |
| `plugin-alliance--bx-opto-pedal` | **1.11.0** | `bx_opto` |
| `plugin-alliance--bx-paneq` | **1.10.0** | `bx_paneq` |
| `plugin-alliance--bx-pulsar` | **1.0.1** | `brainworx-bx_pulsar` |
| `plugin-alliance--bx-refinement` | **3.0.0** | `bx_refinement-v3` |
| `plugin-alliance--bx-refinement-v3` | **3.0.0** | `bx_refinement-v3` |
| `plugin-alliance--bx-rockergain100` | **1.4.0** | `bx_rockergain100` |
| `plugin-alliance--bx-rockrack-v3` | **3.10.0** | `bx_rockrack-v3` |
| `plugin-alliance--bx-rockrack-v3-player` | **3.10.0** | `bx_rockrack-v3` |
| `plugin-alliance--bx-rooms` | **1.10.0** | `bx_rooms` |
| `plugin-alliance--bx-saturator-v2` | **2.13.1** | `bx_saturator-v2` |
| `plugin-alliance--bx-shredspread` | **1.19.0** | `bx_shredspread` |
| `plugin-alliance--bx-solo` | **1.16.2** | `bx_solo` |
| `plugin-alliance--bx-stereomaker` | **1.15.0** | `bx_stereomaker` |
| `plugin-alliance--bx-subfilter` | **1.10.0** | `bx_subfilter` |
| `plugin-alliance--bx-subsynth` | **1.10.0** | `bx_subsynth` |
| `plugin-alliance--bx-tonebox` | **1.0.0** | `bx_tonebox` |
| `plugin-alliance--bx-townhouse-buss-compressor` | **1.9.0** | `bx_townhouse-buss-compressor` |
| `plugin-alliance--bx-tuner` | **1.12.0** | `bx_tuner` |
| `plugin-alliance--bx-xl-v3` | **3.1.0** | `bx_xl-v3` |
| `plugin-alliance--bx-yellowdrive` | **1.12.0** | `bx_yellowdrive` |
| `plugin-alliance--chandler-gav19t` | **1.12.0** | `gav19t` |
| `plugin-alliance--click-boom-pa` | **1.1.1** | `click-boom` |
| `plugin-alliance--cut-classic-high-flyer` | **1.0.0** | `high-flyer` |
| `plugin-alliance--dangerous-bax-eq-master` | **1.11.0** | `bax-eq` |
| `plugin-alliance--dangerous-bax-eq-mix` | **1.11.0** | `bax-eq` |
| `plugin-alliance--diezel-herbert` | **1.6.0** | `herbert` |
| `plugin-alliance--diezel-vh4` | **1.6.1** | `vh4` |
| `plugin-alliance--ds-tantra-2` | **2.0.2** | `tantra-2` |
| `plugin-alliance--ds-thorn` | **1.3.3** | `thorn` |
| `plugin-alliance--elysia-alpha-compressor-v2` | **2.2.0** | `elysia-alpha-compressor-v2` |
| `plugin-alliance--elysia-karacter-master` | **1.11.0** | `karacter` |
| `plugin-alliance--elysia-karacter-mix` | **1.11.0** | `karacter` |
| `plugin-alliance--elysia-mpressor` | **1.17.0** | `mpressor` |
| `plugin-alliance--elysia-museq-master` | **1.15.0** | `museq` |
| `plugin-alliance--elysia-museq-mix` | **1.15.0** | `museq` |
| `plugin-alliance--elysia-niveau-filter` | **1.18.0** | `niveau-filter` |
| `plugin-alliance--elysia-nvelope` | **1.12.0** | `nvelope` |
| `plugin-alliance--elysia-phils-cascade` | **1.3.0** | `phils-cascade` |
| `plugin-alliance--engl-e646-vs` | **1.13.0** | `e646-vs` |
| `plugin-alliance--engl-e765-rt` | **1.12.0** | `e765-rt` |
| `plugin-alliance--engl-savage-120` | **1.4.0** | `savage-120` |
| `plugin-alliance--friedman-be100` | **1.5.0** | `be-100` |
| `plugin-alliance--friedman-buxom-betty` | **1.3.0** | `buxom-betty` |
| `plugin-alliance--friedman-ds40` | **1.5.0** | `ds-40` |
| `plugin-alliance--fuchs-overdrive-supreme-50` | **1.4.0** | `overdrive-supreme-50` |
| `plugin-alliance--fuchs-train-ii` | **1.4.0** | `train-ii` |
| `plugin-alliance--gallien-krueger-800rb` | **1.4.0** | `800rb` |
| `plugin-alliance--harris-doyle-natalus-dsceq` | **1.2.0** | `natalus-dsceq` |
| `plugin-alliance--hears-perfection` | **1.0.0** | `perfection` |
| `plugin-alliance--hitstrip-pa` | **1.3.1** | `hitstrip` |
| `plugin-alliance--hum-audio-devices-laal` | **1.0.0** | `laal` |
| `plugin-alliance--knif-audio-knifonium` | **1.5.1** | `knifonium` |
| `plugin-alliance--knif-audio-soma` | **1.2.0** | `soma` |
| `plugin-alliance--knocktonal-pa` | **1.2.1** | `knocktonal` |
| `plugin-alliance--looptrotter-sa2rate2` | **1.2.0** | `sa2rate-2` |
| `plugin-alliance--maag-eq2` | **1.12.0** | `eq2` |
| `plugin-alliance--maag-eq4` | **1.16.1** | `eq4` |
| `plugin-alliance--maag-eq4-ms` | **1.0.0** | `eq4-ms` |
| `plugin-alliance--maag-magnum-k` | **1.7.0** | `magnum-k` |
| `plugin-alliance--millennia-nseq-2` | **1.12.0** | `nseq-2` |
| `plugin-alliance--millennia-tcl-2` | **1.12.1** | `tcl-2` |
| `plugin-alliance--neold-big-al` | **1.4.0** | `big-al` |
| `plugin-alliance--neold-oldtimer` | **1.1.0** | `oldtimer` |
| `plugin-alliance--neold-u17` | **1.3.0** | `u17` |
| `plugin-alliance--neold-u2a` | **1.2.0** | `u2a` |
| `plugin-alliance--neold-v76u73` | **1.4.0** | `v76u73` |
| `plugin-alliance--neold-warble` | **1.4.0** | `warble` |
| `plugin-alliance--neold-wunderlich` | **1.1.0** | `wunderlich` |
| `plugin-alliance--noveltech-character` | **1.18.0** | `character` |
| `plugin-alliance--noveltech-vocal-enhancer` | **1.16.0** | `vocal-enhancer` |
| `plugin-alliance--pro-audio-dsp-dsm-v3` | **3.7.0** | `dsm-v3` |
| `plugin-alliance--purple-audio-mc-77` | **1.6.2** | `mc77` |
| `plugin-alliance--shadow-hills-class-a-mastering-comp` | **1.5.0** | `mastering-compressor-class-a` |
| `plugin-alliance--shadow-hills-mastering-compressor` | **1.7.0** | `mastering-compressor` |
| `plugin-alliance--shadow-hills-optomax` | **1.0.1** | `optomax` |
| `plugin-alliance--spl-attacker-plus` | **1.10.1** | `attacker-plus` |
| `plugin-alliance--spl-big` | **1.0.1** | `spl-big` |
| `plugin-alliance--spl-de-esser` | **1.17.2** | `de-esser-collection` |
| `plugin-alliance--spl-de-esser-dual-band` | **1.17.2** | `de-esser-collection` |
| `plugin-alliance--spl-de-verb-plus` | **1.10.1** | `de-verb-plus` |
| `plugin-alliance--spl-drumxchanger` | **1.16.0** | `drumxchanger` |
| `plugin-alliance--spl-eq-ranger-plus` | **1.11.3** | `eq-ranger-plus` |
| `plugin-alliance--spl-free-ranger` | **1.19.3** | `free-ranger` |
| `plugin-alliance--spl-hawkeye` | **1.1.0** | `hawkeye` |
| `plugin-alliance--spl-iron` | **1.7.0** | `iron` |
| `plugin-alliance--spl-mo-verb-plus` | **1.10.1** | `mo-verb-plus` |
| `plugin-alliance--spl-passeq` | **1.16.0** | `passeq` |
| `plugin-alliance--spl-passeq-single` | **1.16.0** | `passeq` |
| `plugin-alliance--spl-pq` | **1.3.0** | `pq` |
| `plugin-alliance--spl-transient-designer` | **1.11.3** | `transient-designer-plus` |
| `plugin-alliance--spl-transient-designer-plus` | **1.11.3** | `transient-designer-plus` |
| `plugin-alliance--spl-twintube` | **1.19.2** | `twintube` |
| `plugin-alliance--spl-vitalizer-mk3-t` | **1.0.0** | `vitalizer-mk3-t` |
| `plugin-alliance--spread-pa` | **1.3.0** | `spread` |
| `plugin-alliance--suhr-pt100` | **1.3.0** | `pt100` |
| `plugin-alliance--suhr-se100` | **1.3.0** | `se100` |
| `plugin-alliance--tbtech-cenozoix-compressor` | **1.1.3** | `cenozoix-compressor` |
| `plugin-alliance--tbtech-kirchhoff-eq` | **1.7.4** | `kirchhoff-eq` |
| `plugin-alliance--tbtech-trinity-shaper` | **1.1.2** | `trinity-shaper` |
| `plugin-alliance--the-oven` | **1.2.0** | `the-oven` |
| `plugin-alliance--tomo-audiolabs-lisa` | **1.3.0** | `lisa` |
| `plugin-alliance--vertigo-vsc-2` | **1.16.0** | `vsc-2` |
| `plugin-alliance--vertigo-vsm-3` | **1.11.0** | `vsm-3` |
| `plugin-alliance--vertigo-vss-2` | **1.0.1** | `vss-2` |

### Samples (evidence)

- `plugin-alliance--ada-flanger` **1.6.0** ← `https://www.plugin-alliance.com/products/flanger` hash `86a215b61a141ff0…`
- `plugin-alliance--bx-console-ssl-9000-j` **1.5.0** ← `https://www.plugin-alliance.com/products/bx_console-ssl-9000-j` hash `a55defe3fc887f0d…`
- `plugin-alliance--bx-masterdesk` **1.8.0** ← `https://www.plugin-alliance.com/products/bx_masterdesk` hash `9f25507237f1e647…`
- `plugin-alliance--bx-shredspread` **1.19.0** ← `https://www.plugin-alliance.com/products/bx_shredspread` hash `59b61c49500d540d…`
- `plugin-alliance--amek-mastering-compressor` **1.2.0** ← `https://www.plugin-alliance.com/products/mastering-compressor-amek` hash `948253a2651fcbac…`
- `plugin-alliance--spl-de-esser` **1.17.2** ← `https://www.plugin-alliance.com/products/de-esser-collection` hash `765db833ded64b6c…`

### Suite / multi-plugin installers (explicit evidence)

- Dangerous BAX EQ Master/Mix → `/products/bax-eq` Installer v1.11.0
- bx_boom + bx_boom V3 → `/products/bx_boom-v3` Installer v3.0.0
- SPL De-Esser + Dual-Band → `/products/de-esser-collection` Installer v1.17.2 (`imv1_subpluginlist=spl_de-esser,spl_de-esser_dual-band`)
- Mix/Master pairs (karacter, museq, passeq, etc.) share one product installer when page title matches family
- Shadow Hills Mastering Compressor Class A (1.5.0) ≠ Mastering Compressor (1.7.0) ≠ AMEK Mastering Compressor (1.2.0)

## Plugin Alliance — unknown (13)

| plugin_id | reason |
|---|---|
| `plugin-alliance--bx-crispyscale` | No public PA product page (search only hits bx_crispytuner) |
| `plugin-alliance--bx-xl-v2` | Legacy; only bx_XL V3 public |
| `plugin-alliance--elysia-alpha-master` | Only alpha compressor V2 public; no separate master page |
| `plugin-alliance--elysia-alpha-mix` | Same as alpha master |
| `plugin-alliance--mega-sampler` | No PA product page found |
| `plugin-alliance--schoeps-double-ms` | No PA product page found |
| `plugin-alliance--schoeps-mono-upmix-1to2` | No PA product page found |
| `plugin-alliance--schoeps-mono-upmix-1to3` | No PA product page found |
| `plugin-alliance--spl-vitalizer-mk2-t` | /vitalizer-mk2-t redirects/serves MK3-T; refused to accept MK3 for MK2 |
| `plugin-alliance--swivel-audio-the-sauce` | No PA product page found |
| `spl--bass-ranger` | Mentioned historically on EQ Ranger Plus page only; no dedicated installer page |
| `spl--full-ranger` | Same |
| `spl--vox-ranger` | Same |

## Unfiltered Audio — accepted (18/19)

| plugin_id | ver | slug |
|---|---|---|
| `unfiltered-audio--unfiltered-audio-bass-mint` | **1.1.7** | `bass-mint` |
| `unfiltered-audio--unfiltered-audio-battalion` | **1.2.0** | `battalion` |
| `unfiltered-audio--unfiltered-audio-byome` | **1.3.6** | `byome` |
| `unfiltered-audio--unfiltered-audio-dent-2` | **2.4.1** | `dent-2` |
| `unfiltered-audio--unfiltered-audio-fault` | **1.4.1** | `fault` |
| `unfiltered-audio--unfiltered-audio-g8` | **1.6.2** | `g8` |
| `unfiltered-audio--unfiltered-audio-indent-2` | **2.4.1** | `indent-2` |
| `unfiltered-audio--unfiltered-audio-instant-delay` | **1.3.1** | `instant-delay` |
| `unfiltered-audio--unfiltered-audio-lion` | **1.5.0** | `lion` |
| `unfiltered-audio--unfiltered-audio-lo-fi-af` | **1.1.11** | `lo-fi-af` |
| `unfiltered-audio--unfiltered-audio-needlepoint` | **1.0.7** | `needlepoint` |
| `unfiltered-audio--unfiltered-audio-sandman` | **1.4.1** | `sandman` |
| `unfiltered-audio--unfiltered-audio-sandman-pro` | **1.4.3** | `sandman-pro` |
| `unfiltered-audio--unfiltered-audio-silo` | **1.1.7** | `silo` |
| `unfiltered-audio--unfiltered-audio-specops` | **1.4.0** | `specops` |
| `unfiltered-audio--unfiltered-audio-tails` | **1.1.0** | `tails` |
| `unfiltered-audio--unfiltered-audio-triad` | **1.3.5** | `triad` |
| `unfiltered-audio--unfiltered-audio-zip` | **1.4.2** | `zip` |

Unknown: `unfiltered--indent` (Indent 1 legacy; only Indent 2 public on PA).

## Priority B

### ADPTR (PA product pages) — 4 leftovers + prior MetricAB

- `adptr--adptr-hype` **1.5.0** ← `https://www.plugin-alliance.com/products/hype`
- `adptr--adptr-metricab` **1.5** ← `https://www.adptraudio.com/products/metric-ab/`
- `adptr--adptr-sculpt` **1.3.0** ← `https://www.plugin-alliance.com/products/sculpt`
- `adptr--adptr-streamliner` **1.1.0** ← `https://www.plugin-alliance.com/products/streamliner`
- `adptr--adptr-utopia` **1.0.0** ← `https://www.plugin-alliance.com/products/utopia`

### Sonarworks — downloadsPage

- `sonarworks--reference-4` **4.4.10** ← `https://www.sonarworks.com/download-center` hash `3e95650fbc0d6504…`
- `sonarworks--soundid-reference-plugin` **5.13.8** ← `https://www.sonarworks.com/download-center` hash `3e95650fbc0d6504…`

Evidence: download-center “Current version 5.13.8.1308” + SoundID Reference release-notes link; Reference 4 offline installer label 4.4.10.11 → **4.4.10**.

### Still unknown (this run)

- `klanghelm--mjuc` — paid; product page has DOWNLOADS tab but no public semver (same as prior NOTES).
- `kiive--xtressor` — PA `/xtressor` 404; kiiveaudio redirects to XTComp.
- `celemony--melodyne-bridge` — no public version page found.
- xln-audio / audiomovers / applied-acoustics / eiosis / fiedler-audio / steinberg — public pages weak/404/login-oriented; not accepted this round.

## Store totals after export

- Accepted observations / plugins with current: **468** / 816
- This round delta vs ~282 start: **+186** (PA 162 + UA 18 + ADPTR 4 + Sonarworks 2)
- Superseded observations from suite corrections: 9

