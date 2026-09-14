# NOTES — Version chip psp-audioware remain

Date: 2026-09-10 ~1:50 AM PT (2026-09-10T08:50Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`  
Export: **not** run (parent will export once)

## Goal

Accept verified **public** versions for remaining psp-audioware true plugin gaps (`identity_kind=plugin`, no current). Never invent. Prefer manufacturer product-page installer filenames; KVR only as fallback.

## Brief gaps

32 plugin IDs listed in overnight brief (see playbook).

## Method

1. Hub: https://www.pspaudioware.com/products — map SKUs → product URLs.
2. Fetch each candidate product page; parse `PSP_*_X.Y.Z_{macOS.dmg|Win.exe}` installer filenames only.
3. Do **not** use account-walled https://www.pspaudioware.net/UserArea/demos.
4. InfiniStrip page → EARTH build only → skip for `psp-infinistrip`.
5. KVR product `verwin` @60 when manufacturer page has no public installer semver; refuse KVR pages that describe gen2 successors under gen1 titles.

## Counts

| Metric | Value |
|---|---:|
| Attempted (brief gaps) | **32** |
| Accepted (set current) | **20** |
| Skipped / still unknown (plugin) | **11** |
| Identity reclass (out of plugin gaps) | **1** (`psp-squad` → bundle) |
| Manufacturer @90 | **1** |
| KVR @60 | **19** |

After this pass: psp-audioware **plugin** currents **66 / 77** (11 plugin unknowns remain).

## Accepted (plugin_id=version)

### Manufacturer productPage / installer-filename @90
- `psp-audioware--psp-e27-avedis=1.7.4` — https://www.pspaudioware.com/products/psp-e27 — heading **PSP E27 AVEDIS**; `PSP_E27_1.7.4_macOS.dmg`

### KVR other / kvr-product-page @60
- `psp-audioware--psp-2meters=2.1.0`
- `psp-audioware--psp-84=1.6.1`
- `psp-audioware--psp-85=1.1.1`
- `psp-audioware--psp-b-scanner=1.0`
- `psp-audioware--psp-chamber=1.0.1`
- `psp-audioware--psp-classicq=1.8.0`
- `psp-audioware--psp-mcq=1.8.0`
- `psp-audioware--psp-n2o=1.0.1`
- `psp-audioware--psp-neon-hr=2.0.4`
- `psp-audioware--psp-nexcellence=1.0.2`
- `psp-audioware--psp-nitro=1.1.2`
- `psp-audioware--psp-pianoverb=1.10.3` (KVR also has PianoVerb 2 @2.5.5 separately; already on `psp-pianoverb2`)
- `psp-audioware--psp-pseudostereo=1.9.9`
- `psp-audioware--psp-retroq=1.8.0`
- `psp-audioware--psp-spector=1.0.1`
- `psp-audioware--psp-stepdelay=1.0.2`
- `psp-audioware--psp-stereoanalyser2=2.0.2`
- `psp-audioware--psp-stereoenhancer=1.9.9`
- `psp-audioware--psp-vintagemeter=1.0`

## Skipped / still unknown (why)

| plugin_id | reason |
|---|---|
| `psp-infinistrip` | Only EARTH `1.4.1` public (mfr + KVR title “InfiniStrip Earth”); `psp-infinistrip-earth` already accepted |
| `psp-hertzrider` | No gen1 product page; KVR page is HertzRider**2** @2.0.4 (already on `psp-hertzrider2`) |
| `psp-lotary` | No gen1 product page; KVR page is L'otary**2** @2.2.0 |
| `psp-masterq` | No gen1 product page; KVR page is MasterQ**2** @2.1.5 |
| `psp-vintagewarmer` | No gen1 product page; KVR page is VintageWarmer**2** @2.11.0 |
| `psp-mixbass` | No public installer / no KVR product page |
| `psp-mixgate` | same |
| `psp-mixpressor` | same |
| `psp-mixsaturator` | same |
| `psp-mixsync` | same |
| `psp-mixtreble` | same — MixPack2 marketing page lists Mix*2 modules with no filenames; do not invent from bundle 2.1.0 |

## Identity reclass

- `psp-audioware--psp-squad`: `plugin` → **`bundle`**. KVR: “PSP sQuad is a bundle of six high-quality equalizer plug-ins…”. Cleared any version current; `notes_for_user` set.

Optional follow-up (not done): seed `successor_plugin_id` for HertzRider→2, L'otary→2, MasterQ→2, PianoVerb→2, VintageWarmer→2, InfiniStrip→EARTH.

## Confidence

- **90** — manufacturer product-page installer filename (`psp-e27-avedis`)
- **60** — KVR product-page verwin (19 accepts)
- Concurrent bad KVR stamps that mapped successor/EARTH/bundle versions onto gen1/InfiniStrip/sQuad were **rejected** and PVC cleared.

## Artifacts

- `playbooks/psp-audioware.md` — updated with this pass
- `NOTES-version-chip-psp-remain.md` — this file
- `tmp-fetch/psp/` — manufacturer HTML; `tmp-fetch/psp/kvr/` — KVR HTML
