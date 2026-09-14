# NOTES — Universe expand 4 (identity only)

Date: 2026-09-10 ~3:10→3:16 AM PT (2026-09-10T10:10–10:16Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after expand3 (520 / 5960 / 4270 accepted). Add **missing manufacturers + plugins** (identity-only). Prefer strong gaps: **boz-digital, black-rooster-audio, kit-plugins, crave-dsp, zplane, plogue, decomposer, image-line, presonus, mastering-the-mix, waldorf, gforce-software, krotos**, plus **accentize** / **steinberg** / **plugin-alliance** (products.json) fills. Honest `identity_kind`. Zero-trust Policy A unchanged — **no invented versions**.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 520 | **533** | **+13** |
| plugins (universe) | 5960 | **6264** | **+304** |
| accepted currents | 4270 | **4270** | 0 |
| version_observations | 5858 | **5858** | 0 |
| versions stamped this pass | — | **0** | — |
| without version | 1690 | **1994** | +304 (all new identity rows) |

Export: `out/catalog.json` — 533 manufacturers, 6264 plugins, 4270 with accepted `latestVersion`.

**Note on “true plugin gaps”:** `status_report.py` lists **~742** without-version rows with `identity_kind=plugin`. Balloon is **expected** (new identity-only plugs + **512** intentional Airwindows). Stubborn receipt gaps unchanged (~23 excl. Airwindows).

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand4.json` | Batch payload (13 mfrs, 304 plugins incl. mop) |
| `data/universe-expansion-expand4-mop.json` | Hardcore + short-name mop audit |
| `tmp-fetch/build_universe_expand4.py` | Builder |
| `tmp-fetch/expand4/kvr-*.html` | Cached KVR developer pages |
| `tmp-fetch/last16/pa-products-p1.json` (+ p2) | PA Shopify products.json (cached) |
| `src/import_universe_batch.py` | Upsert (identity only; never writes versions) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand4.py
# mop: Crave EQ / Accentize Chameleon / IL Hardcore (short-name cross-mfr false positives)
python3 src/import_universe_batch.py data/universe-expansion-expand4.json
python3 src/import_universe_batch.py data/universe-expansion-expand4-mop.json
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+13)

| id | name | ~plugins in |
|---|---|---:|
| `boz-digital` | Boz Digital Labs | 51 |
| `black-rooster-audio` | Black Rooster Audio | 26 |
| `kit-plugins` | KIT Plugins | 21 |
| `crave-dsp` | Crave DSP | 3 |
| `zplane` | zplane | 12 |
| `plogue` | Plogue | 12 |
| `decomposer` | Decomposer | 2 |
| `image-line` | Image-Line | 40 |
| `presonus` | PreSonus | 17 |
| `mastering-the-mix` | Mastering The Mix | 10 |
| `waldorf` | Waldorf | 8 |
| `gforce-software` | GForce Software | 11 |
| `krotos` | Krotos | 4 |

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| steinberg | 69 | Cubase/Nuendo/Dorico/WaveLab/VST Live → `hub_app`; HALion/Padshop/Retrologue/Backbone/Groove Agent → `plugin`; libraries → `soundset`; legacy → `discontinued` |
| accentize | 12 | was dxRevivePro-only; full KVR restoration/dialogue line |
| plugin-alliance | 6 | BEATSURFING titles from products.json (vendor-prefixed) |

## Skipped / policy notes

| Candidate | Action |
|---|---|
| **chowdsp** | Already complete enough (OAS + twin names); KVR slug empty this pass. |
| **airwindows** | Already dense (expand3); Consolidated-only version policy locked. |
| **fabfilter / melda / voxengo / auburn / softube / soundtoys / baby-audio / cableguys** | Dense — residual KVR “gaps” were bundles, CM editions, or spelling variants (e.g. Tinnerö / DevilLoc). |
| **eventide** | KVR “gaps” are **Newfangled Audio** titles already under `newfangled-audio` — cross-mfr deduped. |
| **kilohearts** | Already present (`kilohearts`, 84 plugs) — user “kilohertz already”. |
| **puremix** | Empty KVR developer index — skipped. |
| **produce-like-a-pro** | Skip per brief. |
| **ableton stock** | Skip — no Ableton manufacturer; no invented Live stock devices. |
| **Presonus / Studio One stock devices** | Not invented; only KVR-listed hubs + discrete plugs/content. |
| **celemony** | Already complete; KVR false-hit “RX Post Production Suite” is iZotope — skipped. |
| **applied-acoustics / uvi suites** | Residual KVR titles were marketing suites/bundles already covered or present; UVI discrete FX already in DB. |
| **PA products.json false gaps** | Unfiltered/NEOLD/Fuse/Three-Body/etc. already present under own or PA ids with prefixed names — prefix-stripping dedup. |
| **elysia / brainworx** | Remain under `plugin-alliance` (prior policy). |

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | Discrete plugs (default); Boz FX; Black Rooster; KIT Blackbird; Crave; Accentize; GForce; MTM; Krotos; IL instruments/FX |
| `soundset` | Boz pianos/clap packs; KIT Drums/NOIZ; Steinberg libraries; PreSonus loops/orchestra |
| `hub_app` | FL Studio editions; Studio One / Notion / Sphere; Steinberg Cubase/Nuendo/Dorico/WaveLab/VST Live; Plogue Bidule/ARIA/sforzando; zplane deCoda/utilities |
| `bundle` | Marketing collections (Boz collections, IL Juice Pack, Waldorf Edition, Absolute 7) |
| `discontinued` | Legacy Steinberg (Hypersonic, Virtual Guitarist, old SpectraLayers, etc.) |
| `hardware` | PreSonus Quantum/1824c interfaces (from KVR; filtered mostly) |
| `expansion` | (none new this pass beyond classification hooks) |

## Sources / methodology

1. **KVR developer listings** — product title + slug only (never versions).  
2. **Plugin Alliance Shopify `products.json`** (cached p1+p2, 288 unique) — promote independent store brands to own mfrs (MTM, Waldorf, GForce, Krotos); keep BEATSURFING under PA with vendor prefix.  
3. **Filters** — skip CM editions, SDKs, hardware interfaces, iOS-only (except Cubasis/FL Mobile as hub_app), marketing subscriptions.  
4. **Dedup** — plugin id `{mfr}--{slug}` + exact name + normalized name; **cross-mfr** normalized-name dedup with manufacturer-prefix stripping.  
5. **Short-name mop** — `Crave EQ`, `Accentize Chameleon`, `Image-Line Hardcore` restored after false collisions with Airwindows EQ / GuitarML Chameleon / IK Hardcore (different products; distinct manufacturer ids).

## Versions stamped

**None.** Optional public version chip probed (cravedsp.com news only; decomposer.nl SSL mismatch) — **not easy enough** this pass. No `version_observations` created.

## What we did not do

- Did not invent or accept versions from KVR / PA Shopify JSON.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not grind hub-walled portals.  
- Did not invent Ableton / Studio One / Bitwig stock-device inventories.  
- Did not add produce-like-a-pro or empty puremix.  
- Did not duplicate Newfangled titles under Eventide.

## Follow-ups

- Version receipts for high-value new discrete plugs: Crave EQ / Transient EQ, Sitala, Accentize DeRoom Pro / dxRevive, Boz Transgressor 3 / Bark of Dog, Black Rooster VLA-2A Mark II, KIT Blackbird N73, Mastering The Mix REFERENCE 3 / ANIMATE, Waldorf Nave/Largo 2, GForce Oddity3/Minimonsta2, Krotos Igniter/Dehumaniser 2, zplane élastique Pitch / PEEL STEMS 2, Plogue chipsounds.  
- Optional: Ableton Live editions as `hub_app` only (no stock devices) in a later curated pass.  
- Optional: Fractal Audio when public software catalog slug found (carryover).  
- Playbooks markdown for the +13 new mfrs (DB playbooks still lag).

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only. Airwindows 512 individuals stay intentionally unversioned — Consolidated-only chip.
