# NOTES — version chip Eventide / TDR / Sonnox (+ Goodhertz / Focusrite / Valhalla)

Date: 2026-09-10 ~1:20 AM PT (2026-09-10T08:20Z UTC)
Verified by: coding-assistant
Fetch dir: `tmp-fetch/chip-eventide-tdr-sonnox/`

## Scope note
At chip start the store already had Eventide 39/46 and Sonnox 5/26; parallel overnight chips also raced some accepts (KVR + live-page-fetch). This chip focused on manufacturer-primary public receipts and Goodhertz leftovers.

## Accepted this chip (manufacturer primary)

### Eventide — downloadsPage @ 92
| plugin_id | version | source |
|---|---|---|
| eventide--h9-series-blackhole | **3.11.4** | downloads/?product=Blackhole%C2%AE (Mac/Win Installer Version 3.11.4) |
| eventide--h9-series-crushstation | **1.4.4** | downloads/?product=CrushStation%C2%AE |
| eventide--h949-harmonizer | **3.12.4** | downloads/?product=H949+Harmonizer%C2%AE |

Also observed (not stamped — identity_kind=bundle): Anthology XI **2.7.14**, Anthology XII **1.5.5**.

### Sonnox — installers CSV @ 92 (this chip; some may supersede parallel live-page-fetch)
CSV content_hash=`cec304f90204266129d51871c81ac03dbd6c56b15b904b60c56af5853597a697`

| plugin_id | version |
|---|---|
| sonnox--claro | **2.04.0** |
| sonnox--oxford-dynamic-eq | **2.03.0** |
| sonnox--oxford-dynamics | **4.04.0** |
| sonnox--oxford-envolution | **2.04.0** |
| sonnox--oxford-eq | **4.04.0** |
| sonnox--oxford-reverb | **4.04.0** |
| sonnox--oxford-supresser | **4.04.0** |
| sonnox--listenhub | **1.02.0** |
| sonnox--voca | **1.02.0** |
| sonnox--voxdoubler | **2.02.0** |

### Goodhertz — suite downloads @ 92 (+7 → 21/21)
Suite **3.14.1** (June 30, 2026) stamped on: dc19, la-210, loudness, megaverb, tupe, tupe-wow, vcme-vulf-compressor-mastering-edition.
content_hash=`447b20f213a14e1578a40d2c60ef467281735d8131cb75f761cf8263305ed003`

## Skips / reasons
| id / group | reason |
|---|---|
| tokyo-dawn-labs Feedback Compressor I/II | discontinued; no live version page |
| eventide Anthology XI/XII | identity_kind=bundle (versions public but out of true-plugin scope) |
| eventide H9/H90 Harmonizer | hardware |
| sonnox DeBuzzer/DeClicker/DeNoiser | Mac 3.02.0 vs Win 3.01.0 installer filenames — dual mismatch |
| sonnox Fraunhofer Pro-Codec | Mac 4.02.0 vs Win 4.01.0 — dual mismatch |
| sonnox Soften | no public product/installer (404); leftover KVR@60 1.0.0 from parallel chip (not raised) |
| focusrite FAST* + Soften | discontinued; Help Centre says no further updates; no public installer version |
| valhalla SpaceModulator / ÜberMod | Current Version Mac 1.2.8 vs Win 1.1.6 — dual mismatch |

Note: mid-chip parallel KVR stamps briefly pushed Sonnox to 22/26 (Enhance/Essential/Live/Mastering/Post @1.0); those weak bundle stubs were later cleared — final **17/26** keeps manufacturer CSV accepts + Soften/Restore KVR leftovers.

## Final manufacturer counts
| mfr | start (chip) | now | Δ (net vs chip start) |
|---|---|---|---|
| eventide | 39/46 | **42/46** | +3 |
| tokyo-dawn-labs | 22/24 | **22/24** | +0 |
| sonnox | 5/26 | **17/26** | +12 |
| goodhertz | 14/21 | **21/21** | +7 |
| focusrite | 5/12 | **5/12** | +0 |
| valhalla-dsp | 8/10 | **8/10** | +0 |

Store-wide current versions: **3242** (green ≥85: **2239**); unknowns **1125** (true plugin gaps **480**).

## Artifacts
- Playbooks: `playbooks/{eventide,tokyo-dawn-labs,sonnox,goodhertz,focusrite,valhalla-dsp}.md` (+ DB upsert)
- Fetch: `tmp-fetch/chip-eventide-tdr-sonnox/`
- Export: `out/catalog.json`
