# NOTES — Universe expand 6 (identity + FOSS chips)

Date: 2026-09-10 ~4:06→4:17 AM PT (2026-09-10T11:06–11:17Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after expand5 (549 / 6490 / 4575 accepted). Add **missing manufacturers + plugins** (identity-only). Prefer **lsp-plugins + x42 + calf + dragonfly + audiority + singular-sound + more NI/Spitfire soundsets**, plus mid-mfr / large-mfr fills. Dedup. Chip easy FOSS suite versions in-pass when GitHub tags clear. Zero-trust Policy A unchanged — **no invented versions**. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 549 | **559** | **+10** |
| plugins (universe) | 6490 | **6887** | **+397** |
| accepted currents | 4575 | **4669** | **+94** |
| version_observations | 6237 | **6331** | **+94** |
| versions stamped this pass | — | **94** | LSP + Dragonfly + Zam suites |
| without version | 1915 | **2218** | +303 net (identity balloon − chips) |

Export: `out/catalog.json` — 559 manufacturers, 6887 plugins, 4669 with accepted `latestVersion`.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand6.json` | Main batch (10 mfrs, 394 plugins) |
| `data/universe-expansion-expand6-mop.json` | FOSS suite umbrella twins (3) |
| `tmp-fetch/build_universe_expand6.py` | Builder |
| `tmp-fetch/expand6/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/expand6/lsp-*.html` / `*-rel.html` | LSP manuals + GitHub release pages |
| `tmp-fetch/expand6/x42-plugin-list.txt` | x42 packaging index |
| `src/import_universe_batch.py` | Upsert (identity only) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand6.py
python3 src/import_universe_batch.py data/universe-expansion-expand6.json
python3 src/import_universe_batch.py data/universe-expansion-expand6-mop.json
# FOSS suite chips via accept_observation.py (see Versions stamped)
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+10)

| id | name | ~plugins |
|---|---|---:|
| `audiority` | Audiority | 50 |
| `cfa-sound` | CFA-Sound | 24 |
| `singular-sound` | Singular Sound | 6 |
| `lsp-plugins` | LSP Plugins | 65 |
| `x42` | x42 | 24 |
| `calf` | Calf Studio Gear | 44 |
| `dragonfly-reverb` | Dragonfly Reverb | 5 |
| `eq10q` | EQ10Q | 3 |
| `zam-audio` | Zam Audio | 24 |
| `guitarix` | Guitarix | 13 |

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| native-instruments | 35 | Session Guitarist/Bassist, Piano Colors, Pharlight/Straylight, Symphony Essentials, Expansions, Traktor Pro, legacy B4 |
| spitfire-audio | 31 | Originals Emotional Cello / Intimate Brass / Intimate Woodwinds / Crystal Keys (2026); ARO section fills; Chamber/Symphonic/Studio; Labs variants — all `soundset` |
| universal-audio | 30 | Apollo Solo/x6/x8/x16/x16D hardware; C-Suite C-Axe/C-Max/C-Vox; classic collections/bundles |
| waves | 14 | Marketing bundles/collections (Diamond/Gold/Mercury/…, Abbey Road/API/SSL collections) |
| ik-multimedia | 14 | AmpliTube collections + ARC Studio / AXE I/O / TONEX hardware (iOS + iRig flood skipped) |
| modartt | 11 | Pianoteq Stage/Standard/Pro 6–8 discontinued gens + Organteq 2 + Demo |
| baby-audio | 3 | Complete / Essentials / Industry Pro bundles |
| output | 1 | Temper discontinued residual |

## FOSS policy this pass

| Project | Action |
|---|---|
| **lsp-plugins** | +65 family rows (Mono/Stereo/LR/MS collapsed) + umbrella mop; chipped **1.2.35** @90 |
| **dragonfly-reverb** | Hall/Room/Plate/ER + umbrella mop; chipped **3.2.10** @90 |
| **zam-audio** | 23 individuals + umbrella mop; chipped **4.5** @90 |
| **x42** | 24 from plugin.list (skip robtk toolkit); no suite tag |
| **calf** | 44 curated; GitHub releases page had no clear latest tag |
| **eq10q** | 3 (EQ / Bass Up / MS); SourceForge — no easy chip |
| **guitarix** | hub + 12 modules; also_check oas--brummer10 |
| airwindows | Skip — Consolidated-only policy locked |
| chowdsp / surge / vital | Skip — prior passes |

## Skipped / policy notes

| Candidate | Action |
|---|---|
| **rc-20 / xln-audio** | Already XL after expand5 — no further SKU explosion |
| **excite-audio** | Already dense (29) |
| **cableguys / goodhertz / melda / softube** | KVR gaps 0 or spelling-only (Tinnero) — skipped |
| **cf-sound** | Interpreted as **cfa-sound** (CFA-Sound); empty `cf-sound` KVR slug |
| **IK iRig / iLoud / iKlip flood** | Skipped hardware accessory explosion; kept ARC/AXE/TONEX + AmpliTube collections |
| **PA products.json** | Norm collisions vs vendor-prefixed DB names — deferred (already 291) |
| **LSP channel variants** | Not exploded (would be 200+); family identity only |
| **DynIR / Airwindows** | Unchanged policies |

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | FOSS families; Audiority FX; UA C-Suite; Guitarix modules |
| `soundset` | Spitfire fills; NI library fills; CFA presets; Audiority Kontakt/SFZ |
| `bundle` | Waves/IK/UA marketing collections; Baby Audio; FOSS suite umbrellas |
| `expansion` | NI Expansions; Output Arcade Expansions |
| `hardware` | Singular Sound BeatBuddy/Aeros; UA Apollo; IK ARC/AXE/TONEX |
| `hub_app` | Guitarix; BeatBuddy Manager; Traktor Pro |
| `discontinued` | Modartt Pianoteq 6–8; NI B4; Output Temper |

## Versions stamped (+94)

| manufacturer | count | version | source | conf |
|---|---:|---|---|---:|
| lsp-plugins | 65 | 1.2.35 | GitHub release tag | 90 |
| zam-audio | 24 | 4.5 | GitHub release tag | 90 |
| dragonfly-reverb | 5 | 3.2.10 | GitHub release tag | 90 |

**Not chipped (not easy):** x42 (per-repo), calf (no clear latest tag on releases HTML), eq10q (SourceForge), guitarix, audiority/cfa/singular commercial, Spitfire/NI/UA/Waves/IK portals.

## What we did not do

- Did not invent versions from KVR listings.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not explode LSP Mono/Stereo/LR/MS SKUs.  
- Did not add IK iRig accessory flood.  
- Did not bulk-import PA products.json false-positive gaps.

## Follow-ups

- Version receipts: x42 fil4/dpl/meters individual tags; calf latest; guitarix; Audiority portal; UA C-Suite; Spitfire Originals 2026; Organteq 2.  
- Optional: reclass many existing Spitfire `plugin` rows → `soundset`.  
- PA Shopify title↔DB vendor-prefix reconcile pass.  
- Playbooks stubs written for +10 new mfrs.

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only. Airwindows 512 individuals stay intentionally unversioned — Consolidated-only chip.
