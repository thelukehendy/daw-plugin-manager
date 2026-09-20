# tal-software

## Version chip expand-2 (2026-09-10)
- Method: Product pages `https://tal-software.com/products/{slug}` show `Downloads vX.Y.Z` (HTML may insert tags between Downloads and version — textify before regex). Changelog `Version X.Y.Z / DD.MM.YYYY` corroborates.
- Note: curl often 404s; urllib/WebFetch with Safari UA works.
- Confidence: **92** productPage.
- Success: 16 @92 (expand-2 new) + prior Chorus/Reverb line; leftovers Flanger/Phaser/Tube → KVR or thin pages.

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- TAL-Flanger / TAL-Phaser / TAL-Tube: **not** on current Free Plug-Ins list; Deprecated section. KVR Product Version dual **1.0 vs 1.0.1** → skip stamp; reclass **discontinued**.
- Live products still use `Downloads vX.Y.Z` on product pages (Safari UA / urllib; curl often 404).


## Confidence raise 13 (2026-09-10 ~2:55 AM PT)
- Raised **1**: TAL-Elek7ro **2.7** @**92** from product page `Downloads v 2.7` (`https://tal-software.com/products/tal-elek7ro`) exact match to KVR.
- Legacy freeware pages for BassLine / Dub I–III / U-No-62 expose archive zips **without** semver labels → leave yellow.
- Reverb III / USEq pages not corroborable this pass (fetch 422 / no Downloads-v label found before wrap).

## JS-storefront migration (2026-09-19)
- tal-software.com has migrated to a JS-rendered storefront. Static fetches still return the `Downloads vX.Y.Z` label on *live* product pages, but **discontinued products now return an empty JS shell** (identical ~7,604-byte template, "You need to enable JavaScript", no version text) **or a hard 404** instead of the old thin pages. 2026-09-19 confirmed: TAL-Reverb-2/3, TAL-Dub-II/III, TAL-Reverb III, TAL-USEq = JS shells; `/products/tal-filter` (Filter II's stored source URL) = 404.
- **Discontinued-page signal rule:** a `/products/{slug}` fetch returning the JS shell with no `Downloads` label = product page retired. Do NOT re-probe without a new angle (e.g., Wayback installer filename); KVR-only re-confirmation raises nothing per CONFIDENCE.md anti-patterns. This supersedes the old "thin pages → KVR" expectation.
