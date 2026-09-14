# NOTES — Version chip universe-expand-4 manufacturers

Date: 2026-09-10 ~3:17→3:27 AM PT (2026-09-10T10:17–10:27Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for identity-only universe-expand-4 manufacturers (+ Accentize / Steinberg / PA BEATSURFING fills). Prefer manufacturer pages **88–95**; KVR **@60** when manufacturer silent. Careful with **image-line / presonus / steinberg** (DAW hub) — `daw-bundled-version` only with public evidence; else KVR@60 or leave open. Zero trust. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 533 | **533** | 0 |
| plugins (universe) | 6264 | **6264** | 0 |
| accepted currents | 4270 | **4489** | **+219** |
| without version | 1994 | **1775** | −219 |
| without version + identity_kind=plugin | ~742 | **556** | ~−186 |
| observations (accepted currents) | — | **4489** | — |

### Confidence bands (accepted currents)

| Band | Before (STATUS) | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 2863 | **2912** | **+49** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1351 | **1521** | **+170** |

Export: `out/catalog.json` — 533 mfrs, 6264 plugins, **4489** with accepted `latestVersion`.

This-pass stamped currents: **+219** (43 manufacturer @90–92 + 176 KVR@60). Green Δ (+49) tracks manufacturer greens (Crave/BRA/Accentize/zplane/IL FL hubs) plus any concurrent green drift on the shared box during the hour.

## Accepted new versions by manufacturer (+219)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **steinberg** | **35** | KVR (hub_app + discrete VSTi; SpectraLayers/WaveLab prior currents kept) | 60 |
| **image-line** | **34** | 4 FL Studio desktop hub_app @90 + 30 KVR plugs | 90 / 60 |
| **black-rooster-audio** | **26** | catalog-wide v3.0.0 news (2025-04-11) | 90 |
| **boz-digital** | **20** | KVR (11 Mac/Win mismatch skipped) | 60 |
| **kit-plugins** | **18** | KVR | 60 |
| **plogue** | **12** | KVR (plugins + Bidule/ARIA/sforzando hub_app) | 60 |
| **zplane** | **11** | 3 productPage (Pitch/reTune/deCoda) + 8 KVR | 92 / 60 |
| **gforce-software** | **11** | KVR | 60 |
| **accentize** | **10** | 7 product Version History + 3 KVR | 92 / 60 |
| **presonus** | **10** | KVR (hubs + CTC-1/EyeQ/Ampire; no invented stock) | 60 |
| **mastering-the-mix** | **10** | KVR | 60 |
| **waldorf** | **7** | KVR (Edition bundle skipped) | 60 |
| **plugin-alliance** | **6** | BEATSURFING KVR developer pages | 60 |
| **krotos** | **4** | KVR | 60 |
| **crave-dsp** | **3** | productPage download headings | 92 |
| **decomposer** | **2** | KVR (site SSL/empty) | 60 |
| **TOTAL** | **219** | | |

## Method highlights

1. **Crave DSP** — `cravedsp.com` product headings: EQ **2.2.13**, Transient EQ **1.0.6**, Stereo Enhancer **2.0.33** @92.
2. **Black Rooster** — newsreader v3.0.0 release: *“official release of v3.0.0 across its entire plugin catalog”*; product pages serve `/download/current/` without filename semver → catalog-wide **3.0.0** @90.
3. **Accentize** — Version History: Chameleon **2.1.5**, ChameleonSurround **1.1.3** (same chameleon page), DeRoom **2.0.3**, dxLevel **1.0.2**, dxSplit **1.1.2**, SpectralBalance **1.1.6**, dxRevive **1.2.8** @92. DialogueEnhance / PreFET Mac≠Win skipped; VoiceGate / Pretube / DeRoom Pro → KVR when matched.
4. **zplane** — elastique Pitch **2.5.2**, reTune **1.3.5**, deCoda hub_app **1.4.0** from products.zplane.de @92.
5. **Image-Line** — FL Studio download page **Version 26.1.6** (Win `.5639` / Mac `.5406` build suffixes differ; marketing semver matches) → four desktop hub_app editions @90. Discrete plugs KVR; Mobile/Groove Machine KVR if verwin; Juice Pack remains bundle.
6. **Steinberg / PreSonus** — no invented daw-bundled stock versions. Cubase/Nuendo/Dorico/WaveLab/VST Live / Studio One / Notion / Sphere → KVR@60 when verwin present; soundset/discontinued/suite_component skipped.
7. **Boz / KIT / MTM / Plogue / Waldorf / GForce / Krotos / Decomposer** — manufacturer silent or walled → KVR@60; skip Mac/Win mismatch and non-plugin identities.
8. **PA BEATSURFING** — KVR developer `beatsurfing` (not PA index): 7DeadlySnares 1.1.1, LunchTable 1.1.3, beatfader 1.2.0, CHEat Code 1.2.3, RANDOM Metal 1.0.12, RANDOM 1.2.3 @60.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand4/` | HTML caches, queues, kvr product pages |
| `tmp-fetch/chip-expand4/build_and_apply.py` | Apply script |
| `tmp-fetch/chip-expand4/accept-queue-manufacturer.json` | Manufacturer accepts |
| `tmp-fetch/chip-expand4/accept-queue-kvr.json` | KVR accepts |
| `tmp-fetch/chip-expand4/accepted-summary.json` | Pre-audit summary |
| `playbooks/{crave-dsp,black-rooster-audio,…}.md` | 16 playbooks (+ DB upserts) |
| `out/catalog.json` | Re-exported |

## Still open (notable, expand-4 scope)

- Boz: 11 Mac/Win KVR mismatches (Big Clipper 2, Le Snappet, Manic Compressor, Mongoose 2, Pan Knob 2, Panipulator, Panther, ReCoil, T-Bone 2, Hoser XT 2, Width Knob)
- Image-Line: Drumaxx / Morphine / Toxic Biohazard Mac≠Win; DX10 / SimSynth Live no verwin
- Accentize: DialogueEnhance / PreFET Mac≠Win
- Steinberg: Cubasis 2/3, HALion Sonic 7 Collection, LM-9, Nanologue (no verwin)
- Decomposer.nl dead/SSL — Sitala/DERT KVR-only
- Airwindows 512 intentional unversioned (unchanged policy)

## Identity honesty this pass

| kind | action |
|---|---|
| `plugin` | Versioned via manufacturer or KVR |
| `hub_app` | FL Studio desktop editions manufacturer; Steinberg/PreSonus/Plogue/zplane hubs via KVR when verwin |
| `soundset` / `bundle` / `discontinued` / `suite_component` / `hardware` | skipped for version stamp |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/chip-expand4/build_and_apply.py   # already applied
# mop BEATSURFING already applied inline
python3 src/export_catalog.py
python3 src/status_report.py
```

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Never invent. Hub portals not ground. No daw-bundled-version without public installer evidence (IL FL 26.1.6 is the one public DAW hub stamp this pass).
