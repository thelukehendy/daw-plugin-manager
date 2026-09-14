# NOTES — Deep unknowns (creative public sources)

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant  
Policy: public source_url + evidence_snippet + content_hash; never trust seed; no hub logins; no invented versions.

## Totals

| metric | count |
|---|---|
| Starting accepted (pre-mission, 816-universe era) | **592** |
| **New accepts this mission** | **+19** |
| Store after export | **611** accepted / **2827** plugins (universe expanded mid-mission via `data/universe-expansion-batch1.json`) |
| Original-816-relevant unlocks | **+11** (9 hub-walled + 1 ambiguous EQuivocate + ANA 2) |
| Remaining listed hub-walled (HUB_WALLED.md) | **179** (was 188) |

## Methods that unlocked hub-walled / unknowns

### 1. Homebrew cask JSON (`formulae.brew.sh/api/cask/{token}.json`) — hub *apps*

Public machine-readable version + often versioned CDN installer URL. SHA-256 of cask JSON body = content_hash. Corroborate with CDN HEAD 200 when URL embeds version.

| plugin_id | version | source | notes |
|---|---|---|---|
| `softube--central` | **2.2.0** | brew `softube-central` | Installer `Softube Central-2.2.0-universal.pkg` CDN HEAD 200 |
| `splice--splice` | **5.4.12** | brew `splice` | Installer `splice-5.4.12-mac-aarch64.zip` S3 HEAD 200 |
| `native-instruments--native-access` | **3.25.2** | brew `native-access` | Version in public cask JSON (download URL is `…-latest.zip`) |

Also present but **not** mapped to store SKUs (wrong product): `waves-central` 17.0.4, `spitfire-audio` 3.4.17 (app ≠ LABS), `steinberg-download-assistant` 1.40.1, `ik-product-manager` 1.1.15 (≠ AmpliTube 5).

### 2. Plugin Alliance public product pages — Bettermaker leftovers

`https://www.plugin-alliance.com/products/{slug}` + `Installer vX.Y.Z (Mac…)` label. Discover slugs via `/collections/all/products.json`.

| plugin_id | version | PA slug |
|---|---|---|
| `bettermaker--bus-comp-dsp` | **1.0.0** | `bus-compressor` |
| `bettermaker--bettermaker-c502v-dsp` | **1.0.0** | `c502v` |
| `bettermaker--bettermaker-eq232d` | **1.1.0** | `eq232d` |
| `bettermaker--bettermaker-passive-equalizer` | **1.0.0** | `passive-equalizer` |
| `bettermaker--mastering-comp-dsp` | **1.0.0** | `bettermaker-mastering-compressor` |

**Still PA-404 / gen-mismatch (left unknown):** bx_XL V2, bx_crispyscale, MEGA Sampler, Schoeps*, The Sauce, SPL Bass/Full/Vox Ranger, Indent gen-1, Vitalizer **MK2**-T (live slug `vitalizer-mk2-t` is **MK3-T** — do not map), elysia alpha master/mix (only `elysia-alpha-compressor-v2` exists).

### 3. Manufacturer product-page installer filename — Sonic Academy ANA 2

Was hub-walled (account). Public product page embeds signed CDN zip `Sonic_Academy_ANA_2.5.6.zip` (HEAD 200).

| plugin_id | version | source |
|---|---|---|
| `sonic-academy--ana-2` | **2.5.6** | https://www.sonicacademy.com/products/ana-2 |

### 4. Newfangled / Eventide release-notes pages — ambiguous + expansion long-tail

Pattern: `https://www.newfangledaudio.com/{slug}-release-notes`  
Latest bold version heading (Wix may split digits across spans — reconstruct `1`+`.`+`14.4` → `1.14.4`).

| plugin_id | version |
|---|---|
| `newfangled-audio--newfangled-equivocate` / `--equivocate` | **1.14.4** |
| `newfangled-audio--punctuate` / `--saturate` | **1.14.4** |
| `newfangled-audio--generate` / `--pendulate` | **1.7.4** |
| `newfangled-audio--articulate` | **1.1.4** |
| `newfangled-audio--invigorate` | **1.4.4** |
| `newfangled-audio--recirculate` | **1.2.4** |
| `newfangled-audio--fixate-midrange` | **1.0.6** |

`obliterate-release-notes` → 404 (left unknown).

## Probed but NOT accepted (still ambiguous / missing / hub)

| target | finding |
|---|---|
| **Iris 2** | Legacy installers dual Mac `Iris_v2_0_2d.dmg` vs Win `Iris2_v2_02c.exe`. Indexed RN (2.02d) live **404**; Wayback CDX/snapshots SSL/429 this run. |
| **Trash 2** | Dual Mac `Trash_v2_0_6.dmg` vs Win `Trash_2_v2_05d.exe`; indexed RN says 2.06 **Mac-only** — explains dual; no unified current. |
| **Audiomovers Listento*** | Downloads page concurrent Mac plugin **v2.102** vs Win **v2.137**. |
| **SIR StandardCLIP** | Mac **1.6.056** vs Win **1.6.057**. |
| **Cableguys ShaperBox 2** | Site is ShaperBox **3**; no gen-2 version oracle. |
| **Unfiltered Indent** | Only Indent **2** v2.4.1 on PA; gen-1 404. |
| Softube Saturation Knob | Softube Central only; no public plugin semver / CDN pkg. |
| United Plugins Core* | Manager page shows Manager **02.19** only; per-SKU via Manager. |
| Avid / AIR / Slate / Waves plugins / Spectrasonics / Focusrite FB360 / etc. | Still account hubs; brew only covers hub *apps* where SKU matches. |
| Mixland Vac Attack | Removed from `products.json` (missing-page). |
| WA Heat2 | Feature note 2.1.0 only — not crystal-clear “current”. |
| KVR product slugs | Soft-404 / search shells for guessed slugs; not used. |

## Creative sources tried

1. KVR product pages — low yield (slug/404).  
2. Wayback Machine — rate-limit/SSL failures this run; Iris/Trash RN still valuable if snapshot body hashable later.  
3. Homebrew cask API + full `cask.json` scan — **unlocked 3 hub apps**.  
4. Public CDN/installer filenames — Softube Central, Splice, ANA 2.  
5. PA `products.json` + product pages — **Bettermaker 5/5**.  
6. Newfangled `*-release-notes` — **family unlock**.  
7. Apple silicon / Production Expert — not needed for accepts this round.  
8. GitHub Releases — Modalics/etc. not found under guessed repos.

## Export

`python3 src/export_catalog.py` → `out/catalog.json`  
**474 manufacturers, 2827 plugins, 611 with accepted latestVersion.**
