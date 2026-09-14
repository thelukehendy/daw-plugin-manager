# MILESTONE — hub-walled long tail

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Store: `/workspace/daw-plugin-catalog-store`  
verified_by: coding-assistant  
Policy: public product page / changelog / installer filename only; never trust seed; no git clone.

## Totals

| metric | count |
|---|---|
| plugins total | **816** |
| accepted (`plugin_version_current`) | **592** |
| unknown (no current) | **224** |
| accepted this final sweep | **+16** (Ozone 9 family) |
| prior baseline | 576/816 |

**Remaining unknowns are predominantly hub-walled: 188/224 (83.9%).**

## This sweep — accepted

| family | version | source | evidence |
|---|---|---|---|
| Ozone 9 (+ Elements + 14 module SKUs) | **9.13.0** | https://www.izotope.com/pages/legacy-products | Public installer filenames `iZotope_Ozone_{Standard,Advanced,Elements}_v9_13_0.{dmg,exe}` (Mac+Win both 9.13.0); HEAD 200. content_hash `3de9147e03581c5dab06a1f1bb98cfc99a5850a5c7f9ddaeb1617e0dd4c82508` |

16 plugin_ids: `izotope--ozone-9`, `izotope--ozone-9-elements`, and 14 `izotope--ozone-9-*` modules.

## iZotope careful re-pass (Ozone 9 / Iris 2 / Trash 2 / Nectar 3 Elements)

| SKU | outcome | why |
|---|---|---|
| Ozone 9 family | **ACCEPTED 9.13.0** | Crystal-clear unified Mac/Win installer filenames on legacy-products |
| Iris 2 | unknown / ambiguous | Public installers exist but **dual**: Mac `Iris_v2_0_2d.dmg` vs Win `Iris2_v2_02c.exe`; live RN URLs 404; Apple silicon lists min only |
| Trash 2 | unknown / ambiguous | Public installers **dual**: Mac `Trash_v2_0_6.dmg` vs Win `Trash_2_v2_05d.exe`; reimagined Trash RN is 1.x |
| Nectar 3 Elements | unknown / missing-page | Not on legacy with Version/installer; Elements RN URL redirects to current Nectar 4 downloads; Apple silicon mins only (v3.8.0 / v3.9.0) |
| generic `izotope--rx` | unknown / ambiguous | Generation ambiguous across RX 8/9/11/12 |

Indexed/search hits for Iris/Trash old RN pages (`…/iris-release-notes`, `…/trash2-release-notes.html`) are **stale** — live GET returns Shopify 404 shells.

## Unknown breakdown by reason

| reason | count | % of unknowns |
|---|---|---|
| **hub-walled** | **188** | **83.9%** |
| missing-page | 23 | 10.3% |
| ambiguous | 13 | 5.8% |

Detail lists: `HUB_WALLED.md` (188 hub-walled, grouped by manufacturer). Ambiguous + missing summarized below.

### Ambiguous (13) — public page exists, not crystal-clear

- iZotope Iris 2 / Trash 2 — dual Mac/Win installer versions on legacy-products
- iZotope `rx` — generation ambiguous
- Audiomovers Listento trio — concurrent Mac/Win version labels on public downloads
- SIR StandardCLIP — Mac 1.6.056 vs Win 1.6.057
- Cableguys ShaperBox 2 — store gen-2 vs site gen-3
- Unfiltered Indent — PA Indent **2** v2.4.1 vs store Indent (gen-1)
- Celemony MelodyneBridge — bridge vs host product
- Newfangled EQuivocate / Acon Restoration / WA Heat2 — unclear single current

### Missing-page (23) — no usable public version oracle this sweep

Includes Nectar 3 Elements, Harrison Vocal Intensity Processor, Kiive Xtressor, Klanghelm MJUC (500), LeoTokarev GainMatch (500), Aberrant SketchCassette II, Credland Pink, Nugen Aligner, Synthogy Ivory, Supertone Clear, THX Spatial Creator, MPEG-H Renderer, stub mfrs (`con`, `unfilteredaudio`), and several small indie pages without semver.

## Hub-walled concentration (top)

| manufacturer / portal | unknowns |
|---|---|
| Avid Link / account | 54 |
| AIR → inMusic Software Center | 26 |
| Slate Digital / inMusic portal | 26 |
| UnitedPluginsManager | 13 |
| Plugin Alliance IM / accounts (+ Bettermaker/SPL/AudioPunks/Unfiltered leftovers) | ~20 |
| Steinberg Download Assistant | 9 |
| Focusrite customer portal | 5 |
| Waves Central | 4 |
| Spectrasonics account | 4 |
| Native Access (+ Guitar Rig 5 / Reaktor 6) | 5 |
| Softube Central (+ Saturation Knob + Central SKU) | 2 |
| UA Connect / UAD Software | 1 |
| Splice / Spitfire LABS / IK / EastWest / others | remainder |

## Recommended next strategies

1. **Portal deep-link without version** — For hub-walled SKUs, store `updatePortalUrl` / manufacturer portal only (already largely present). Do **not** invent versions from portal marketing. Optionally mark `portalApp` (Avid Link, Waves Central, Native Access, Softube Central, UA Connect, inMusic Software Center, Steinberg DA, UnitedPluginsManager, PA Installation Manager, Splice).

2. **Lab Mac (on-disk)** — Highest yield for dual-platform ambiguous (Iris 2, Trash 2, StandardCLIP, Audiomovers) and hub-walled titles the lab already owns: read Info.plist / plugin binary version via `labOnDisk` evidence. Prefer one lab machine with Native Access + Avid Link + Waves Central + Softube Central + PA IM + inMusic Center installed.

3. **Vendor outreach for JSON/CSV feeds** — Ask iZotope (legacy finals), Plugin Alliance, United Plugins, Softube, Slate/inMusic, Avid for a public or partner machine-readable current-version feed. United Plugins legacy page proves they *can* publish per-SKU versions; Manager hides current. Same for PA product pages that already expose `Installer vX.Y.Z` when the SKU URL resolves.

4. **SKU hygiene** — Resolve generation mismatches before more scraping: ShaperBox 2 vs 3, Indent vs Indent 2, generic `izotope--rx`, Eiosis→Slate redirects, stub manufacturers (`con`, `digidesign`, `unfilteredaudio`, `guitar-rig-5`, `reaktor-6`).

5. **Do not** keep grinding the forbidden hub login surfaces listed in the user brief / `HUB_WALLED.md`.

## Export

`python3 src/export_catalog.py` → `out/catalog.json`  
**100 manufacturers, 816 plugins, 592 with accepted latestVersion.**
