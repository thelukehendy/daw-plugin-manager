# NOTES — identity reclass + AAS public versions chip

**When:** 2026-09-10 ~1:20 AM PT (UTC 2026-09-10T08:18:38Z)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Policy:** Never invent versions. `verified_by=coding-assistant` on accepts. Confidence manufacturer **92**. No git clone.

## Goal

Honest **identity_kind** reclassification so true plugin gaps drop without fake versions, plus accept clear public AAS instrument versions from the support latest-installers table.

## Before → after (this chip start snapshot → live after export)

Chip start (before our writes; concurrent overnight work already above STATUS.md 2920):

| Metric | Chip start | Live after |
|---|---:|---:|
| Accepted currents | **3071** | **3226** |
| Universe | 4367 | 4367 |
| Without version | 1296 | 1141 |
| True plugin gaps (`identity_kind=plugin`) | **689** | **501** |
| Non-plugin unknowns | 607 | 640 |

**This chip’s own contribution (isolating concurrent overnight):**
- **+8** AAS manufacturer accepts @ confidence 92
- **Identity writes:** 62 rows (see transitions). True-gap reducers from reclass alone: **31** (`plugin` → non-plugin) + **7** prior-plugin accepts (Lounge Lizard EP-5 was mis-tagged expansion → corrected to plugin → accepted; net true-gap neutral for that SKU).

Live accepted/gap totals also moved from other overnight chips running in parallel — report both.

## A) Identity reclassification

### Rules documented (also in `src/classify_identity_aas_bluecat_uvi_arturia.py`)

| Manufacturer | Rule | kind |
|---|---|---|
| **applied-acoustics** | Sound packs / `for Chromaphone|Strum|Ultra Analog|Multiphonics` / `Instrument - PackName` | `soundset` or `expansion` (packs already mostly soundset) |
| AAS | Bare `Chromaphone`, `Strum Session` (≠ Session 2) | `gen_ambiguous` |
| AAS | Chromaphone 1, Strum Acoustic/Electric GS-1, String Studio VS-2, Ultra Analog VA-2, Tassman | `discontinued` (+ successor where next-gen SKU exists) |
| AAS | **Lounge Lizard EP-5** | **plugin** (EP = Electric Piano product line — was wrongly `expansion`) |
| **blue-cat-audio** | `*Pack`, `*Series`, All Plug-Ins Pack | `bundle` |
| Blue Cat | Digital Peak Meter, Stereo Triple EQ, Widening Meter Pro, Widening Triple EQ | `discontinued` (legacy/vault; do not map current Triple EQ / DP Meter Pro versions) |
| **uvi** | `*for Falcon` | `expansion` (was `soundset`; Falcon/Workstation stay `plugin`) |
| **arturia** | MiniBrute / MicroBrute / MiniFuse / MicroLab / MiniLab / PolyBrute / MicroFreak / MiniFreak (hardware SKUs) | `hardware` |
| Arturia | classic `* V` SKUs | keep `gen_ambiguous` |
| **meldaproduction** | Remaining 22 unknowns already `soundset`/`bundle`/`suite_component` — **0** true-plugin Melda gaps; no blind kernel stamp |

### Kind transitions (this chip)

| Transition | n |
|---|---:|
| `soundset` → `expansion` (UVI Falcon packs) | 30 |
| `plugin` → `hardware` (Arturia) | 13 |
| `plugin` → `discontinued` (AAS legacy + Blue Cat vault) | 10 |
| `plugin` → `bundle` (Blue Cat packs/series) | 6 |
| `plugin` → `gen_ambiguous` (AAS Chromaphone / Strum Session) | 2 |
| `expansion` → `plugin` (Lounge Lizard EP-5 fix) | 1 |

### Successor links set

- `string-studio-vs-2` → `string-studio-vs-3`
- `ultra-analog-va-2` → `ultra-analog-va-3`
- `strum-acoustic-gs-1` / `strum-electric-gs-1` → `strum-gs-2`

## B) Public AAS versions accepted

Source: [AAS Support — Latest installers and manuals](https://www.applied-acoustics.com/support/)  
Evidence: Mac+Win columns agree; installer filenames embed versions (`…-v313-mac.zip`, etc.).  
`source_kind=downloadsPage`, `extract_method=aas-support-latest-installers-table`, `confidence=92`, `verified_by=coding-assistant`.

| plugin_id | version |
|---|---|
| `applied-acoustics--multiphonics-cv-3` | **3.1.3** |
| `applied-acoustics--objeq-delay-2` | **2.0.0** |
| `applied-acoustics--string-studio-vs-3` | **3.3.0** |
| `applied-acoustics--strum-gs-2` | **2.4.6** |
| `applied-acoustics--ultra-analog-va-3` | **3.3.0** |
| `applied-acoustics--ultra-analog-session-2` | **2.3.5** |
| `applied-acoustics--aas-player` | **1.6.7** (Swatches / AAS Player row) |
| `applied-acoustics--lounge-lizard-ep-5` | **5.1.3** |

**Not accepted (honest skip):**
- Chromaphone 3 **3.2.0** — no `chromaphone-3` SKU in catalog; bare `Chromaphone` left `gen_ambiguous`.
- Falcon / UVI Workstation — public pages brand “Falcon 2026” without a clean installer semver receipt on the product page; left unknown plugin (Portal-walled).
- Melda kernel stamp — remaining Melda unknowns are non-plugins; no M* plugins left without version.

Prior AAS sessions already versioned: Lounge Lizard Session 4.4.5, Strum Acoustic Session 2.4.5, Ultra Analog Session 2.3.5.

## C) Confidence raise (optional)

Skipped this chip — time spent on A/B. Yellow KVR@60 batch not touched.

## Live unknowns by identity_kind

| identity_kind | n |
|---|---:|
| plugin | 501 |
| soundset | 368 |
| gen_ambiguous | 55 |
| suite_component | 53 |
| expansion | 43 |
| discontinued | 33 |
| hardware | 28 |
| bundle | 28 |
| unknown_other | 20 |
| hub_app | 9 |
| eurorack | 2 |
| daw_stock_effect | 1 |

## Artifacts

- `src/classify_identity_aas_bluecat_uvi_arturia.py` (idempotent re-run)
- `NOTES-identity-and-aas-chip.md` (this file)
- `out/catalog.json` re-exported (`catalogSource: store-export:v4`)
- Evidence HTML: `tmp-fetch/aas/support.html`

## Totals (live @ export)

| metric | value |
|---|---:|
| manufacturers | 488 |
| universe | 4367 |
| accepted | **3226** |
| true plugin gaps | **501** |
| green ≥85 | 2235 |
| amber 70–84 | 56 |
| yellow &lt;70 | 935 |
| successorPluginId | 99 |
| playbooks | 439 |

*Note: live accepted/gap counts include concurrent overnight chips; this chip’s isolated delta is +8 AAS accepts + identity transitions listed above.*
