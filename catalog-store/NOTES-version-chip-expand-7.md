# NOTES — Version chip universe-expand-7 leftovers

Date: 2026-09-10 ~4:36→4:42 AM PT (2026-09-10T11:36–11:42Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for universe-expand-7 leftovers without currents. Targets: **united-plugins** new commercials, **mercurial-tones**, sonible fills, **fabfilter** bundles (careful identity), **cableguys** CM, **soundtoys** academic, **voxengo** PSquasher, **melda** MSoundFactory Essentials, **eventide** Blackhole, **MTM LIMITER**, **fuse** Ocelot, **PSP** new bundles. Prefer manufacturer **@88–95**; KVR **@60** OK. Reclass bundles/soundsets honestly. Zero trust. No git clone.

## Counts

| Metric | Before (expand-7 close) | After | Delta |
|---|---:|---:|---:|
| manufacturers | 561 | **561** | 0 |
| plugins (universe) | 7000 | **7000** | 0 |
| accepted currents | 4832 | **4885**¹ | **+53** |
| without version | 2168 | **2115** | −53 |
| without version + identity_kind=plugin | 616 | **563** | −53 |
| of which non-Airwindows plugin gaps | 104 | **51** | **−53** |

¹ Traktor Pro chip landed in confidence-raise-21 (+1 → **4886**); this table is chip-only.

### Confidence bands (accepted currents) — chip pass only

| Band | Before (STATUS expand-7) | After chips (pre-raise21) | Δ |
|---|---:|---:|---:|
| Green ≥85 | 3250 | **3252** | **+2** (Blackhole + PSquasher manufacturer) |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1526 | **1577** | **+51** |

## Accepted new versions by manufacturer (+53)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---:|
| **united-plugins** | **46** | KVR branded slugs `{product}-by-{label}-by-united-plugins` | 60 |
| **cableguys** | **2** | KVR Curve 2 CM **2.6.2** / WaveShaper CM **1.3** | 60 |
| **mercurial-tones** | **2** | KVR Vanguard **1.0.3**; Scepter → Scepter Pro **1.2.1** | 60 |
| **eventide** | **1** | Downloads Blackhole® **3.11.4** (+ KVR twin of H9 Series) | 92 |
| **voxengo** | **1** | `/product/psquasher/` Polysquasher **3.6** (PSquasher twin) | 92 |
| **mastering-the-mix** | **1** | KVR LIMITER **1.0.6** | 60 |
| **TOTAL** | **53** | | |

## Method highlights

1. **United Plugins commercials (+46)** — All expand7 commercial SKUs chipped via KVR Product Version Win=Mac @60 (e.g. Autoformer **5.0**, FireEQ **2.1**, MorphVerb **4.1**, Front DAW **4.4**). `unitedplugins.com/download` is Manager-only (no per-SKU semver) — stay yellow until manufacturer corroboration. Never stamp UnitedPluginsManager version onto plugins.
2. **Mercurial Tones (+2)** — Vanguard **1.0.3** @60. DB `scepter` mapped carefully to KVR **Scepter Pro 1.2.1** (Lite Mac≠Win skipped; Lite/Pro not separate DB rows). Manta/Yasha/Janggo(+Pro)/Shard/Tether/Dagon: no KVR product page + shop JSON semver-free — left open. Soundsets Mirage/REACT unversioned.
3. **Eventide Blackhole** — KVR slug `blackhole-by-eventide` titles as **H9 Series: Blackhole** with verwin **3.11.4**; Eventide downloads `product=Blackhole®` same version. Stamped @92 as identity twin of `eventide--h9-series-blackhole` (suite_component) for match-alias coverage. ≠ Blackhole Immersive **1.4.4**.
4. **Voxengo PSquasher** — expand7 short-name twin of existing `voxengo--polysquasher`; same manufacturer URL `/product/psquasher/` → **3.6** @92.
5. **Cableguys CM** — Curve 2 CM **2.6.2**, WaveShaper CM **1.3** KVR@60.
6. **MTM LIMITER** — KVR **1.0.6** @60; Shopify product page / PA Installation Manager semver-free publicly.

## Identity honesty (bundles/soundsets — intentional non-chip)

| kind | ids | action |
|---|---|---|
| `bundle` | FabFilter Creative/Essentials/FX/Mastering/Mixing/Pro/Total (7) | Kept bundle; download page lists individuals only — **no suite installer semver** |
| `bundle` | sonible Dynamics/Metering/Special EQ/Studio/learn/pure/smart/smart:essentials/vocal (9) | Kept bundle; unversioned |
| `bundle` | Soundtoys 5 / 5.5 / Academic; Fuse Ocelot Bundle; PSP expand7 marketing packs | Kept bundle; unversioned |
| `soundset` | Melda MSoundFactory Essentials; Mercurial Mirage / REACT | Kept soundset; unversioned |
| `gen_ambiguous` | sonible--smart-eq | Left open |

## Still open (expand-7 plugin scope)

- mercurial-tones: manta, yasha, janggo, janggo-pro, shard, tether, dagon (shop semver-free)
- sonible--smart-eq (gen_ambiguous)
- All expand7 bundles/soundsets above (intentional)

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand7/kvr-slug-map.json` | Plugin→KVR slug map |
| `tmp-fetch/chip-expand7/kvr/*.html` | Cached KVR product pages |
| `tmp-fetch/chip-expand7/mfr/*` | United download, Voxengo, Eventide, MTM, Mercurial shop |
| `tmp-fetch/chip-expand7/accept-queue.json` | Applied accepts |
| `tmp-fetch/chip-expand7/skipped.json` | Bundle/soundset + open leftovers |
| `tmp-fetch/chip-expand7/accepted-summary.json` | Summary |
| `out/catalog.json` | Re-exported (with raise-21) |

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Bundles/soundsets/hardware stay unversioned unless a real suite installer semver exists. Never invent. UnitedPluginsManager version is not a plugin CFBundle.

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~4:42 AM PT |
| Manufacturers | **561** |
| Plugins | **7000** |
| Accepted currents (chip-only) | **4885** (+53) |
| Non-AW plugin gaps | **51** (−53) |
| Next | confidence-raise-21; Mercurial shop semver when published |
