# NOTES — universe expand 9 (2026-09-10 ~4:56→5:10 AM PT)

## STATUS HANDOFF

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Manufacturers | 561 | **563** | **+2** |
| Plugins (universe) | 7020 | **7262** | **+242** |
| Accepted currents | 4893 | **4895** | **+2** chips |

Export: `out/catalog.json` — 563 / 7262 / 4895.

## Goal

Continue exhaustive identity growth after expand8. Prefer Melda/Voxengo/PSP/Softube/PA product-list deltas + **NI Expansions as soundset**. New/gap fills: d16, u-he (plugins not soundsets), tal, audiothing, kazrog; FOSS lsp/x42/airwindows denser + **carla** + **yabridge** (jack skip); baby-audio/output/excite/polyverse/sonible fill; wavesfactory denser if missing. Dedup. Chip easy public versions in-pass. No git clone.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand9.json` | Import batch (+2 mfrs, +242 plugins) |
| `tmp-fetch/build_universe_expand9.py` | Builder |
| `tmp-fetch/expand9/` | Cached PA/Melda/Voxengo/PSP/Softube/D16/u-he/KVR/NI Sounds JSON |
| `playbooks/carla.md` | New |
| `playbooks/yabridge.md` | New |
| `NOTES-universe-expand-9.md` | This handoff |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand9.py
python3 src/import_universe_batch.py data/universe-expansion-expand9.json
python3 src/accept_observation.py --plugin-id carla--carla --version 2.5.10 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id yabridge--yabridge --version 5.1.1 ... --set-current --confidence 92
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+2)

| id | name | identity |
|---|---|---|
| `carla` | Carla | hub_app `carla--carla` |
| `yabridge` | yabridge | hub_app `yabridge--yabridge` |

## Inserted by manufacturer

| manufacturer | +n | notes |
|---|---:|---|
| native-instruments | 218 | Sounds collection Shopify JSON — **215 soundset** + **3 bundle** (Luxury Hip Hop / Italo Disco / Lo-fi Samples Bundles). Product lines: Expansion/Sounds, Massive X Expansion, Leap Expansion, MPC Expansion |
| u-he | 9 | BazilleCM (plugin/freeware); Everything / All Effects / Bazille·Diva·Hive·Repro Soundset Bundles; Wiretap + CEN2RION eurorack |
| d16-group | 7 | Sound expansions Ripple/Pulse/Aurora/Lure + Total/Classic Boxes/SilverLine bundles |
| tal-software | 3 | Multi-Filter / Vintager / Real Synth (Kunz & Knobel) — **discontinued** legacy KVR |
| polyverse | 2 | Everything Bundle + Infected Mushroom Bundle |
| carla | 1 | hub_app |
| yabridge | 1 | hub_app |
| kazrog | 1 | Avalon AD 2077/2055 EQ Bundle |

## Focus checklist

| Focus | Result |
|---|---|
| wavesfactory denser | Already dense after expand8 (24 titles); no further product-page gaps |
| Melda full M* | Sitemap top-level M* **0** missing after norm dedup; promo landings (FLC/Humble/PABundle/…) skipped; Analog Empire / Drum Empire already present as soundsets |
| Voxengo full | Product-page slugs **0** net (Marquis/r8brain already present) |
| PSP full | Shopify `/products` slugs **0** net (PreQursor2 superseded by preQursor3; image-asset false misses ignored) |
| Softube full | KVR developer **1** false miss (Tinnerö Tremolo already in DB @2.6.41) |
| FabFilter dense | KVR titles all present (FabFilter-prefixed names) |
| Soundtoys dense | KVR **0** miss |
| d16 gaps | **+7** sound expansions + manufacturer bundles |
| u-he plugin gaps | **+1** BazilleCM; soundset-bundles + eurorack Wiretap/CEN2RION; individual soundsets already dense (skipped re-add) |
| tal gaps | Live catalog dense (Bitcrusher/J-8X/EQ/G-Verb present); **+3** discontinued legacy |
| audiothing gaps | KVR Kontakt titles already present as plugins — **0** net |
| kazrog gaps | **+1** Avalon EQ Bundle |
| lsp dense | Already **65/65** @ **1.2.35** (download page confirms) — no identity add |
| x42 dense | Manufacturer page titles already covered (24) — no identity add |
| airwindows dense | Policy-locked unversioned algorithms — no mass reclass |
| yabridge hub | **New** hub_app chipped **5.1.1** |
| carla | **New** hub_app chipped **2.5.10** |
| jack | **Skipped** per brief |
| plugin-alliance products.json | Marketplace 30 SKUs — remaining handles already under Baby/MTM/Waldorf/GForce/Fuse/Krotos/Brainworx vendors; **0** net PA-row adds |
| NI Expansions as soundset | **+215 soundset** (+3 bundle) from `collections/sounds/products.json` (NI vendor only; Image Sounds / Wave Alchemy / Soundiron third-party skipped) |
| baby-audio / output / excite-audio | KVR gaps **0** |
| polyverse | **+2** bundles |
| sonible | Studio Bundle already present — **0** |

## In-pass version chips (+2 @92)

| id | version | source |
|---|---|---|
| carla--carla | 2.5.10 | GitHub Releases tag `v2.5.10` |
| yabridge--yabridge | 5.1.1 | GitHub Releases tag `5.1.1` |

**Not chipped (not easy / already current):** NI Expansions (Native Access gated); D16/u-he/Polyverse commercial portals; Softube Tinnerö already @2.6.41; TAL-Bitcrusher already @0.9.9; LSP already @1.2.35.

## identity_kind honesty

| kind | role this pass |
|---|---|
| `soundset` | NI Sounds/Expansions/Massive X/Leap/MPC packs; D16 Ripple/Pulse/Aurora/Lure |
| `bundle` | NI sample bundles; D16 collections; u-he Everything/Effects/Soundset bundles; Polyverse; Kazrog Avalon EQ |
| `hub_app` | Carla; yabridge |
| `plugin` | u-he BazilleCM |
| `eurorack` | u-he Wiretap; CEN2RION |
| `discontinued` | TAL Multi-Filter / Vintager / Real Synth |

## Skipped / policy

| Candidate | Action |
|---|---|
| Jack | Explicit skip |
| Melda promo sitemap (FLC/Humble23/PABundle/subscription/basket) | Marketing — skipped |
| Melda Studio 2008-2018 | Sitemap ghost; product URL 404 — skipped |
| NI third-party (Image Sounds / Wave Alchemy / Soundiron) on Sounds collection | Not Native Instruments vendor — skipped |
| Softube.com SPA product grid | Not machine-readable; KVR already dense |
| AudioThing Kontakt KVR titles | Already in DB as plugin rows — left (no kind-flip this pass) |
| Airwindows per-SKU versions | Policy locked |

## Return counts

**+2 manufacturers · +242 plugins · +2 versions** (accepted currents 4893→4895)
