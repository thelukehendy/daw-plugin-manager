# NOTES — universe expand 11 (2026-09-10 ~5:24→5:37 AM PT)

## STATUS HANDOFF

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Manufacturers | 571 | **583** | **+12** |
| Plugins (universe) | 8078 | **8439** | **+361** |
| Accepted currents | 4978 | **4986** | **+8** chips |

Export: `out/catalog.json` — 583 / 8439 / 4986.

## Goal

Continue exhaustive identity growth after expand10. Prefer **projectsam / impact-soundworks / fracture-sounds / keepforest** soundsets + **audiothing / cableguys / baby-audio / goodhertz** plugin gaps + **rncbc v1 FOSS suite** (padthv1/synthv1/samplv1/drumkv1) + wolf-spectrum/wolf-shaper/ninjas2/fabla. Also Spitfire BBC/Abbey Shopify gaps, NI Leap/sounds gaps, EastWest 25th Anniversary, Modartt Champagne Flute. Dedup. Chip easy public versions in-pass. No git clone.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand11.json` | Import batch (+12 mfrs, +361 plugins) |
| `tmp-fetch/build_universe_expand11.py` | Builder |
| `tmp-fetch/expand11/` | Cached Shopify/KVR/GitHub/HTML |
| `playbooks/projectsam.md` | New |
| `playbooks/impact-soundworks.md` | New |
| `playbooks/fracture-sounds.md` | New |
| `playbooks/keepforest.md` | New |
| `playbooks/wolf-spectrum.md` | New |
| `playbooks/wolf-shaper.md` | New |
| `playbooks/ninjas2.md` | New |
| `playbooks/fabla.md` | New |
| `playbooks/padthv1.md` | New |
| `playbooks/synthv1.md` | New |
| `playbooks/samplv1.md` | New |
| `playbooks/drumkv1.md` | New |
| `NOTES-universe-expand-11.md` | This handoff |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand11.py
python3 src/import_universe_batch.py data/universe-expansion-expand11.json
python3 src/accept_observation.py --plugin-id wolf-spectrum--wolf-spectrum --version 1.0.0 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id wolf-shaper--wolf-shaper --version 1.0.2 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id ninjas2--ninjas2 --version 0.2.0 ... --set-current --confidence 90
python3 src/accept_observation.py --plugin-id fabla--fabla --version 1.5.0 ... --set-current --confidence 88
# padthv1/synthv1/samplv1/drumkv1 @ 1.4.3 each @92
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+12)

| id | name | identity |
|---|---|---|
| `projectsam` | ProjectSAM | Symphobia/Colours/Swing/OE/True Strike/Lineage as soundset |
| `impact-soundworks` | Impact Soundworks | Shreddage/Tokyo/Kontakt libs + FX plugins |
| `fracture-sounds` | Fracture Sounds | Blueprint freebies + Trails/pianos/etc. soundset; Granulate plugin |
| `keepforest` | Keepforest | AizerX/Evolution/Devastator/Risenge/etc. soundset |
| `wolf-spectrum` | Wolf Spectrum | FOSS spectrum analyzer |
| `wolf-shaper` | Wolf Shaper | FOSS waveshaper |
| `ninjas2` | Ninjas 2 | FOSS sample slicer |
| `fabla` | Fabla | FOSS drum sampler (openAV) |
| `padthv1` | padthv1 | FOSS PADSynth (rncbc v1) |
| `synthv1` | synthv1 | FOSS subtractive synth (rncbc v1) |
| `samplv1` | samplv1 | FOSS sampler (rncbc v1) |
| `drumkv1` | drumkv1 | FOSS drumkit sampler (rncbc v1) |

## Inserted by manufacturer

| manufacturer | +n | notes |
|---|---:|---|
| spitfire-audio | 107 | Shopify `/collections/all` + BBC collection gaps as **soundset**/bundle |
| impact-soundworks | 72 | Site products + KVR catalog; mix soundset/plugin/bundle |
| fracture-sounds | 56 | KVR full Blueprint + paid libs; Granulate as plugin |
| native-instruments | 42 | Sounds Shopify Leap/expansion gaps as **soundset**/bundle |
| keepforest | 40 | Store + KVR own-brand libs (3rd-party Boom/etc. skipped) |
| projectsam | 19 | Libraries page + KVR |
| audiothing | 9 | Things-Tilt + Echo/Instrument/Things/Hainbach bundles + gen2 SKUs |
| baby-audio | 3 | Synthwave Essentials / Modern Vocal Production / All Presets bundles |
| cableguys | 2 | ShaperBox 3 + Bundle |
| goodhertz | 1 | VCME Soft Clip |
| eastwest | 1 | 25th Anniversary Collection |
| modartt | 1 | Champagne Flute free instrument |
| wolf-spectrum | 1 | chipped |
| wolf-shaper | 1 | chipped |
| ninjas2 | 1 | chipped |
| fabla | 1 | chipped |
| padthv1 | 1 | chipped |
| synthv1 | 1 | chipped |
| samplv1 | 1 | chipped |
| drumkv1 | 1 | chipped |

## Focus checklist

| Focus | Result |
|---|---|
| ProjectSAM soundsets | **New** +19 |
| Impact Soundworks | **New** +72 |
| Fracture Sounds | **New** +56 |
| Keepforest | **New** +40 |
| Spitfire BBC/Abbey gaps | **+107** soundset/bundle (Shopify) |
| NI more Expansions / Leap | **+42** Leap/sounds Shopify gaps |
| EastWest ComposerCloud | Dense @115; **+1** 25th Anniversary Collection |
| AudioThing gaps | **+9** (live catalog otherwise dense @90→99) |
| Cableguys gaps | **+2** ShaperBox 3 (+bundle); modules already present |
| Baby Audio gaps | Live plugins dense; **+3** bundles from sitemap |
| Goodhertz gaps | Live plugins dense; **+1** VCME Soft Clip |
| Dragonfly dense | Already @5 plugins + 3.2.10 currents — **0** |
| LSP dense | Already dense — **0** |
| Modartt denser | **+1** Champagne Flute free instrument |
| FOSS v1 suite | **New** padthv1/synthv1/samplv1/drumkv1; chipped 1.4.3 |
| wolf-spectrum / wolf-shaper | **New**; chipped 1.0.0 / 1.0.2 |
| ninjas2 / fabla | **New**; chipped 0.2.0 / 1.5.0 |
| emotive-sounds | Skipped — no public SKU matrix (site thin / KVR empty) |
| Fracture site captcha | Used KVR developer catalog instead |

## In-pass version chips (+8)

| id | version | conf | source |
|---|---|---:|---|
| wolf-spectrum--wolf-spectrum | 1.0.0 | 92 | GitHub Releases tag `v1.0.0` |
| wolf-shaper--wolf-shaper | 1.0.2 | 92 | GitHub Releases tag `v1.0.2` |
| ninjas2--ninjas2 | 0.2.0 | 90 | GitHub Releases tag `v0.2.0` |
| fabla--fabla | 1.5.0 | 88 | CMakeLists `FABLA_VERSION` on master (no GH Releases tags) |
| padthv1--padthv1 | 1.4.3 | 92 | GitHub tag `v1.4.3` |
| synthv1--synthv1 | 1.4.3 | 92 | GitHub tag `v1.4.3` |
| samplv1--samplv1 | 1.4.3 | 92 | GitHub tag `v1.4.3` |
| drumkv1--drumkv1 | 1.4.3 | 92 | GitHub tag `v1.4.3` |

**Not chipped (not easy / portal-gated):** ProjectSAM / ISW / Fracture / Keepforest Kontakt installers; Spitfire BBC/Abbey (Spitfire App); NI Leap (Native Access); AudioThing commercial gen2; Cableguys ShaperBox 3 (no public semver on product page this pass); Baby Audio bundles; Goodhertz Soft Clip; EastWest CC; Modartt free instrument (Pianoteq pack, not standalone semver).

**Already current (no chip):** Dragonfly suite @ **3.2.10**.

## identity_kind honesty

| kind | role this pass |
|---|---|
| `soundset` | ProjectSAM / ISW / Fracture / Keepforest / Spitfire gaps / NI Leap / Modartt Champagne Flute |
| `plugin` | ISW FX; Fracture Granulate; Cableguys ShaperBox 3; Goodhertz Soft Clip; AudioThing gaps; FOSS suite |
| `bundle` | Spitfire/NI/ISW/Keepforest/AT/BA/Cableguys/EW collection rows |

## Skipped / policy

| Candidate | Action |
|---|---|
| emotive-sounds | No clear public SKU matrix — deferred |
| Fracture Sounds site | Cloudflare/sgcaptcha — used KVR |
| Keepforest 3rd-party brands on store (Boom Library etc.) | Skipped (not Keepforest identity) |
| Dragonfly / LSP further density | Already dense |
| Airwindows per-SKU versions | Policy locked |
| git clone | Forbidden — used curl HTML/JSON/raw only |

## Return counts

**+12 manufacturers · +361 plugins · +8 versions** (accepted currents 4978→4986)
