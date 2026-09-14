# NOTES — confidence raise 14 (2026-09-10 ~3:05 AM PT)

Overnight corroboration pass #14. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Focus: denise / initial-audio / wa-production / cymatics / toneboosters / landr / AO leftovers / audified leftovers / sugar-bytes leftovers / neural-dsp yellows. Zero trust; no invented versions; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **49** (yellow→green) |
| Manufacturer legacy-downloads paren versions @92 | **13** (denise) |
| Manufacturer product-page Update log @92 | **36** (WA Production) |
| Snapshot accepted-current green (≥85) | **2856** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1358** (mostly KVR @60) |

*This run’s own corroboration delta is **+49 green / −49 yellow** for the touched currents. Absolute yellow may differ by ± a few from concurrent catalog activity (observed yellow **1358** vs arithmetic 1405−49=1356).*

Starting bands (raise-14 open / raise-13 close): green **2807** / amber **56** / yellow **1405**. After this raise: green **2856** / amber **56** / yellow **1358**.

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| denise | **13** | `deniseaudio.com/legacy-downloads` paren Mac/Win labels (“most up to date versions”) | **92** |
| WA Production | **36** | `waproduction.com/plugins/view/{slug}` public **Update log** semver matching KVR | **92** |

## Breakdown of raises

### denise (+13)

Legacy downloads page lists current installer versions in parentheses beside Mac/Windows links. Trailing-zero–normalized exact match to KVR only.

Raised: bad-tape-2 **1.4.0**, bass-xl **1.0.0**, bite-harder **1.3.0**, dragon-fire **1.3.0**, god-mode **1.3.0**, my-crush **1.1.0**, noize-2 **1.2**, perfect-plate-xl **1.3.0**, perfect-room **1.1.0**, poltergate **1.2.0**, slappy **1.1**, sub-generator **1.2.0**, the-sweeper **1.0.0**.

Denise yellow remaining: **10** — bite, brickwall-limiter, new-york-compressor, noize, noize-retro, perfect-plate, punisher, saturator, space-invader, transient-booster (not listed on legacy-downloads; product pages 404).

### WA Production (+36)

Public product pages expose an **Update log** with `version X.Y.Z` / `v X.Y.Z` / `What's new in … X.Y.Z` entries. Exact / trailing-zero / build-suffix–normalized match to KVR @92. Dates (`DD.MM.YYYY`) filtered out of semver parse. Do **not** stamp suite/gen contamination (e.g. Pumper 3.x → pumper-2).

Raised (slug → kept version): babylon 1.0.5, babylon-2 2.2.1, bassshaper 1.0.1, chopbeast-2 2.0.1, chords 1.0.2, dodge-pro 1.1.3, fundamental-bass 2.1.0, helper-equalizer/saturator/transients 2.2.0, imprint 2.2.0, instachord 1.3.2, instachord-2 2.0.8, instascale 1.1.6, instacomposer-3 3.0.2, kshmr-essentials 1.2.0, kshmr-essentials-kick 1.1.0, kshmr-reverb 1.2.0, loop-engine-3 3.0.7, mutant-delay/reverb 2.2.0, orchid 2.1.0, outlaw 2.3.0, psychopan 1.0.1, puncher 2.2.0, satyrus 1.0.6, screamo 2.2.0, spherecomp 1.5, spheredelay 1.5.1, spherequad 1.5, venom 1.0.0, vocal-compressor 1.2.0, vocal-limiter 2.1.0, vocal-splitter 2.2.0, xtt-by-vinai 1.1.2, zqueezer 1.0.4.

WA yellow remaining: **51** — many product pages lack Update-log semver (or soft-missing); mfr_older vs KVR (combustor/imperfect/instacomposer/loop-engine-2/midiq/multibender/the-king); pumper-2 contaminated by Pumper 3.x log — skip.

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| initial-audio 22 | Product pages live for some SKUs but **no public Version label**; plugincentre installers (`Heatup3.pkg`, `Sektor.pkg`, …) **unversioned filenames**. Leave yellow. |
| cymatics 19 | Downloads account-walled; product pages mostly marketing. Diablo “Mac (v1.1)” hrefs point at **Diablo Lite** CDN zip — gen/SKU contamination; Lite CDN **1.1.0** ≠ KVR Lite **1.1.2**. Skip. |
| toneboosters 16 v3 | Changelog is current v4 line; shared legacy freeware installer ≠ per-SKU **3.1.8** (same gate as raise-12). |
| landr 15 | Marketing / account FX — no public installer semver matching KVR (same as raise-12). |
| analog-obsession leftovers 7 | Still no public CDN/Patreon VERSION for amper/channev/chopa/dynasaur/predd; rarese/tilta manufacturer≠KVR. |
| audified leftovers 11 | AmpLion 2 Rock Essentials ≠ amplion-pro; ToneKnob/Linda RN mismatches; Effect Pedals / inTone 2 / SceneFlow / TNT / ToneSpot ComputerMusic no usable RN. |
| sugar-bytes 4 | artillery / vogue / wow / robotronic — soft404 product pages; gen-2 (artillery2/wow2) already green. Do not stamp gen-2 onto gen-1. |
| neural-dsp 7 | Downloads lists **X** successors only for Cory Wong / Nolly / Plini / Rabea / Nameless / Parallax; Darkglass Ultimate ≠ Ultra. Do not stamp X→non-X. Already mostly green (**22** @92). |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope | Skipped per brief. |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2856** / amber **56** / yellow **1358**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| denise | 10 |
| wa-production | 51 |
| initial-audio | 22 |
| cymatics | 19 |
| toneboosters | 16 |
| landr | 15 |
| analog-obsession | 7 |
| audified | 11 |
| sugar-bytes | 4 |
| neural-dsp | 7 |

## Playbook / doc updates

- `NOTES-confidence-raise-14.md` (this file)
- `playbooks/denise.md` — legacy-downloads paren-version method + raise-14 results
- `playbooks/wa-production.md` — product-page Update log method + raise-14 results

Also refreshed on retry: `STATUS.md` / `HANDOFF-FOR-CURSOR.md`. Export already matched DB: `out/catalog.json`.

## Addendum (retry after unauthenticated parent error)

Retried 2026-09-10 ~3:09 AM PT (2026-09-10T10:09Z): live DB/export already green **2856** / amber **56** / yellow **1358** / accepted **4270** — no re-raise of Denise 13 / WA 36. Spot-checked Denise leftovers (not on downloads/legacy) and WA leftovers (no Update-log exact match; combustor/imperfect/the-king/multibender still mfr_older; pumper-2 still gen-3 contamination). Honest skips unchanged. Raise-14 complete; STATUS/HANDOFF refreshed this addendum.
