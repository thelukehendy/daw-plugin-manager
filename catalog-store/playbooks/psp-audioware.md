# psp-audioware

## Version chip new-mfrs-1 (2026-09-10 ~1:05 AM PT)
- Method: Per-product pages expose public demo/installer filenames with semver (PSP_Name_X.Y.Z_macOS.dmg). Downloads hub is account-walled.
- Primary URLs: https://www.pspaudioware.com/products
- Extract: Parse installer filename on product page. Some legacy SKUs have no public installer link. InfiniStrip page currently ships EARTH build only. preQursor2 URL hosts preQursor3 installers.
- Success: Medium-high — 46/81 accepted @90 from installer filenames; remainder no public file on product page.
- hub_walled: 0

## Version chip psp-remain (2026-09-10 ~1:50 AM PT)
- Goal: fill remaining **true plugin** gaps (identity_kind=plugin, no current) from the prior remainder.
- Method (unchanged primary): product-page installer filenames @90. Downloads hub still account-walled — do not grind.
- Fallback: KVR product-page `verwin` @60 only when manufacturer page has no public installer semver.
- Attempted: **32** gap plugin IDs from overnight brief.
- Accepted this pass: **20**
  - Manufacturer installer @90 (1): `psp-e27-avedis=1.7.4` from https://www.pspaudioware.com/products/psp-e27 (page heading **PSP E27 AVEDIS**; file `PSP_E27_1.7.4_macOS.dmg`). Same installer already stamps `psp-e27`.
  - KVR @60 (19): 2meters 2.1.0, 84 1.6.1, 85 1.1.1, b-scanner 1.0, chamber 1.0.1, classicq 1.8.0, mcq 1.8.0, n2o 1.0.1, neon-hr 2.0.4, nexcellence 1.0.2, nitro 1.1.2, pianoverb 1.10.3 (distinct from pianoverb2 2.5.5), pseudostereo 1.9.9, retroq 1.8.0, spector 1.0.1, stepdelay 1.0.2, stereoanalyser2 2.0.2, stereoenhancer 1.9.9, vintagemeter 1.0.
- Skipped / still unknown (11 plugins + 1 reclass):
  - `psp-infinistrip` — manufacturer + KVR only expose **InfiniStrip EARTH** `1.4.1` (already on `psp-infinistrip-earth`); no clear non-EARTH InfiniStrip semver.
  - `psp-hertzrider`, `psp-lotary`, `psp-masterq`, `psp-vintagewarmer` — gen1 SKUs; product pages 404; KVR pages describe **gen2 successors** (HertzRider2 2.0.4, L'otary2 2.2.0, MasterQ2 2.1.5, VintageWarmer2 2.11.0) already accepted on `*2` IDs. Do **not** copy successor versions onto gen1.
  - MixPack individuals (`mixbass`, `mixgate`, `mixpressor`, `mixsaturator`, `mixsync`, `mixtreble`) — no per-SKU product page / installer; MixPack2 hub page lists Mix*2 modules with **no** installer filenames; no KVR per-module product pages. Leave unknown (do not invent from MixPack2 bundle 2.1.0).
  - `psp-squad` — **reclassed** `plugin` → `bundle` (six EQ plug-ins). Bundle SKU; no plugin latestVersion.
- Rejected concurrent bad KVR currents that had stamped successor/EARTH/bundle versions onto gen1/InfiniStrip/sQuad IDs; PVC cleared for those six.
- hub_walled: 0 (still; demos hub login-only)
- Confidence used: **90** manufacturer installer-filename; **60** KVR fallback.

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- Open CDN `https://download-eu2.pspaudioware.net/` still hosts gen1 archives:
  - HertzRider **1.0.3** Mac+Win → accepted @88; discontinued → HertzRider2
  - L'otary **1.0.3** Mac+Win → accepted @88; discontinued → L'otary2
  - MasterQ **1.5.2** native Mac+Win → accepted @88; discontinued → MasterQ2
- VintageWarmer gen1 CDN folder **404** → discontinued → VintageWarmer2 (no version)
- InfiniStrip bare SKU → **gen_ambiguous** (product page = EARTH 1.4.1; FIRE/WIND trains on CDN) → successor InfiniStrip Earth
- MixBass/Gate/Pressor/Saturator/Sync/Treble → **discontinued** (MixPack gen-1; MixPack2 @2.1.0 is live bundle — do not invent per-module versions)

## Confidence raise 9 (2026-09-10 ~2:08 AM PT)
- **+4** yellow→green @88 via official `download-eu2.pspaudioware.net` installer filenames matching KVR.
- Raised: chamber 1.0.1, spector 1.0.1, stepdelay 1.0.2, stereoanalyser2 2.0.2 (Mac+Win HEAD 200).
- Remaining yellow **15**: no public installer on product page; CDN naming sweep 404 (account freemium / legacy).


## Confidence raise 10
- Non-raise: remaining 15 yellow CDN naming sweep still HEAD 404.

## Confidence raise 15 (2026-09-10 ~3:19 AM PT)
- **+12** yellow→green @88 via open CDN `https://download-eu2.pspaudioware.net/` directory listing.
- Method: list product folder → `OSX/` or `OSX/native/` current `.dmg` filename semver; corroborate Win when present.
- Raised: 2meters, b-scanner, classicq, mcq, n2o, nexcellence, retroq, 84, 85, neon-hr (`PSP_Neon_2.0.4.dmg`), nitro, pianoverb.
- Remaining yellow **3**: PseudoStereo / StereoEnhancer (StereoPack **1.9.9** suite→component skip); VintageMeter (unversioned Mac `.dmg`).
