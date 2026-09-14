# NOTES — Universe expand 7 (United/FOSS/Mercurial + dense fills)

Date: 2026-09-10 ~4:25→4:34 AM PT (2026-09-10T11:25–11:34Z UTC)  
Actor: coding-assistant (executor)

## Goal

Continue exhaustive **product universe** expansion after expand6 + version-chip expand-6 (**559 / 6887 / 4811**). Prefer manufacturer product-list fills (United / Melda / Voxengo / PSP / PA marketplace / Baby+Cableguys gaps), FOSS **distrho/cardinal/jalv** (+ surge/helm/odin already dense), FabFilter bundles, Eventide/Soundtoys missing titles, new **Mercurial Tones (Mercer)**. Dedup. Chip easy public FOSS versions in-pass. Zero-trust Policy A — **no invented versions**. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 559 | **561** | **+2** |
| plugins (universe) | 6887 | **7000** | **+113** |
| accepted currents | 4811 | **4832** | **+21** |
| version_observations | 6482 | **6503** | **+21** |
| versions stamped this pass | — | **21** | Jalv + DISTRHO suite + Surge XT twin |
| without version | 2076 | **2168** | +92 net (identity balloon − chips) |

Export: `out/catalog.json` — 561 manufacturers, 7000 plugins, 4832 with accepted `latestVersion`.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand7.json` | Main batch (2 mfrs, 109 plugins) |
| `data/universe-expansion-expand7-mop.json` | Manta + Surge XT twin (2) |
| `data/universe-expansion-expand7-mop2.json` | 3BandEQ + DPF-Plugins twin (2) |
| `tmp-fetch/build_universe_expand7.py` | Builder |
| `tmp-fetch/expand7/` | Cached KVR / manufacturer / GitHub pages |
| `playbooks/jalv.md` | New |
| `playbooks/mercurial-tones.md` | New |
| `src/import_universe_batch.py` | Upsert (identity only) |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand7.py
python3 src/import_universe_batch.py data/universe-expansion-expand7.json
python3 src/import_universe_batch.py data/universe-expansion-expand7-mop.json
python3 src/import_universe_batch.py data/universe-expansion-expand7-mop2.json
# FOSS chips via accept_observation.py (see Versions stamped)
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+2)

| id | name | ~plugins |
|---|---|---:|
| `jalv` | Jalv | 1 |
| `mercurial-tones` | Mercurial Tones | 11 |

## Notable fills of existing manufacturers

| manufacturer | +added | notes |
|---|---:|---|
| united-plugins | 46 | Full commercial catalog (was Core/free leftovers only); `productLine` = sub-brand (JMG / FireSonic / SounDevice / Muramasa / Instant Audio) |
| distrho | 19 | Ildaeil + DPF-Plugins pack + Cardinal Synth/FX/Mini + 3BandEQ/DPF twin |
| psp-audioware | 10 | Manufacturer marketing bundles (Delay/FX/Master/Reverb/Signature/TotalPack/Ultimate/Vintage*/25th) — Voltage Modular/Cherry collections skipped |
| mercurial-tones | 11 | Vanguard/Manta/Yasha/Scepter/Janggo(+Pro)/Shard/Tether/Dagon + Mirage/REACT soundsets |
| sonible | 9 | Dynamics/Metering/pure/smart/smart:essentials/Studio/vocal/Special EQ/learn bundles |
| fabfilter | 7 | Creative/Essentials/FX/Mastering/Mixing/Pro/Total Bundle |
| cableguys | 2 | Curve 2 CM, WaveShaper CM |
| soundtoys | 2 | Soundtoys 5, Academic Bundle |
| surge-synthesizer | 1 | Surge XT first-class twin of OAS |
| voxengo | 1 | **PSquasher** (manufacturer product-page gap) |
| meldaproduction | 1 | MSoundFactory Essentials (sitemap) |
| eventide | 1 | **Blackhole** standalone (≠ H9 Series / Immersive) |
| mastering-the-mix | 1 | **LIMITER** (PA `products.json` marketplace) |
| fuse-audio-labs | 1 | Ocelot Bundle (PA marketplace) |

## Focus checklist

| Focus | Result |
|---|---|
| lsp / x42 | Already dense (expand6 + chip6) — no further SKU explosion |
| jalv | **New mfr** + hub_app chipped **1.10.0** |
| distrho / cardinal | Pack fill + Cardinal variants; suite chips |
| surge / helm / odin | Surge XT twin; Helm/Odin already under `matt-tytel` / `thewavewarden` |
| audified / hornet | Already dense (KVR gaps 0) |
| united-plugins | **Major fill** (+46) |
| baby-audio | KVR/manufacturer gaps 0 after expand6 bundles |
| cableguys | CM giveaways filled |
| soundtoys / eventide / fabfilter | Academic/5 + Blackhole + 7 FabFilter bundles |
| plugin-alliance products.json | Marketplace-only feed (30); vendor titles mostly already under Baby/MTM/Waldorf/GForce/Fuse/Krotos — added LIMITER + Ocelot Bundle |
| voxengo / psp / melda | PSquasher + PSP bundles + MSoundFactory Essentials; KVR individual gaps otherwise 0 |
| Mercer / unfiltered / denise / auburn / sonible | Mercurial Tones new; Unfiltered/Denise/Auburn already dense; sonible bundles |

## FOSS / version chips this pass (+21)

| manufacturer | count | version | source | conf |
|---|---:|---|---|---:|
| jalv | 1 | 1.10.0 | GitLab tags | 90 |
| distrho (Ildaeil) | 1 | 1.3 | GitHub tags | 90 |
| distrho (DPF pack) | 15 | 1.7 | GitHub tags | 90 |
| distrho (Cardinal variants) | 3 | 26.02 | GitHub release tag | 90 |
| surge-synthesizer (Surge XT twin) | 1 | 1.3.4 | sibling OAS accepted current | 88 |

**Not chipped (not easy):** Mercurial Tones (shop JSON has no installer semver), United/FabFilter/PSP/sonible commercial portals, Soundtoys Academic, Eventide Blackhole (needs product RN), Cableguys CM, Melda soundset.

## identity_kind honesty

| kind | role this pass |
|---|---|
| `plugin` | United commercials; DISTRHO pack; Mercurial instruments/FX; Blackhole; LIMITER; CM giveaways |
| `bundle` | FabFilter / PSP / sonible / Soundtoys 5 / Academic / Ocelot / DPF-Plugins |
| `soundset` | Melda MSoundFactory Essentials; Mercurial Mirage/REACT |
| `hub_app` | Jalv; Ildaeil |

## Skipped / policy notes

| Candidate | Action |
|---|---|
| PA Shopify full catalog | `products.json` is **marketplace** only (30 SKUs); main PA HTML product grid not machine-readable this pass — deferred full PA title↔DB reconcile |
| PSP Voltage Modular collections | Cherry Audio expansions — skipped |
| Melda promo sitemap (FLC/PABundle/Humble23/…) | Marketing landing pages — skipped |
| Hornet / Denise / Auburn / Baby individuals | KVR gaps 0 |
| Helm / Odin new mfrs | Already `matt-tytel` / `thewavewarden` (+ OAS twins) |
| Surge Nightly GitHub “latest” | Points at Nightly — used sibling accepted **1.3.4** only for twin |
| Airwindows | Consolidated-only policy unchanged |
| Cross-mfr name collisions | Mercurial **Manta** forced past Florian Mrugalla Manta; DISTRHO **3BandEQ** forced past kHs 3-Band EQ; DPF-Plugins twin of OAS |

## What we did not do

- Did not invent versions from KVR listings.  
- Did not wipe existing observations/currents.  
- Did not clone `daw-plugin-manager`.  
- Did not explode United sub-brands into separate manufacturers (kept `productLine`).  
- Did not bulk-import PA HTML false-positive gaps.

## Follow-ups

- United Plugins manufacturer site / installer versions (portal often account-gated).  
- Mercurial product-page installer semver when published.  
- Eventide Blackhole + Soundtoys Academic/5 receipts.  
- FabFilter Total Bundle / suite version from fabfilter.com support.  
- PA native catalog scrape beyond marketplace `products.json`.  
- Optional: reclass United `*Core` rows as freeware twins of full SKUs.

## Policy reminder

Universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only. Airwindows 512 individuals stay intentionally unversioned — Consolidated-only chip.

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~4:34 AM PT |
| Manufacturers | **561** (+2) |
| Plugins | **7000** (+113) |
| Accepted currents | **4832** (+21) |
| Next natural pass | United/Mercurial/Eventide version receipts; PA native catalog; optional Baby/Cableguys non-CM leftovers |
