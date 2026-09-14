# NOTES — Version chip universe-expand-3 manufacturers

Date: 2026-09-10 ~2:45→3:05 AM PT (2026-09-10T09:45–10:05Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for identity-only universe-expand-3 manufacturers (+ SSL/WA/Cymatics fills). Prefer manufacturer pages/CDN/GitHub **88–95**; KVR **@60** when manufacturer silent. Honest `identity_kind` (Kemper/Line 6/SSL 500-series hardware; VCV hub_app). **Airwindows:** no invented global pack version for all algorithms. Zero trust. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 520 | **520** | 0 |
| plugins (universe) | 5960 | **5960** | 0 |
| accepted currents | 4050 | **4267** | **+217** |
| without version | 1910 | **1693** | −217 |
| without version + identity_kind=plugin | 773 | **554** | −219 |
| observations (currents) | — | **4267** | — |

### Confidence bands (accepted currents)

| Band | Before | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 2694 | **2772** | **+78** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1300 | **1439** | **+139** |

Export: `out/catalog.json` — 520 mfrs, 5960 plugins, **4267** with accepted `latestVersion`.

This-pass stamped currents: **+217** (≈35 green manufacturer/corroboration, ≈182 yellow KVR). Overall green Δ (+78) includes this-pass greens plus any concurrent raise on the shared box during the hour.

## Accepted new versions by manufacturer (+217)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **wa-production** | **86** | KVR verwin | 60 |
| **neural-dsp** | **29** | 22 downloads page + 7 KVR | 92 / 60 |
| **sugar-bytes** | **23** | 1 productPage (Effectrix2) + 22 KVR | 90 / 60 |
| **initial-audio** | **22** | KVR (expansions skipped) | 60 |
| **cymatics** | **19** | KVR | 60 |
| **ssl** | **8** | KVR (fills; Meter Pro left open) | 60 |
| **sonic-charge** | **6** | multi-installer 2024.08.30 + Cyclone 1.1 | 90–92 |
| **audiorealism** | **5** | KVR | 60 |
| **dawesome** | **5** | KVR | 60 |
| **line-6** | **4** | KVR (hardware left open) | 60 |
| **airwindows** | **3** | Consolidated GitHub + SoftGate/DrumSlam KVR | 90 / 60 |
| **madrona-labs** | **2** | Sumu 1.3.0 + Aaltoverb 2.0.3 Mac==Win | 92 |
| **vcv** | **2** | Rack page 2.6.6 (hub_app Free+Pro) | 92 |
| **positive-grid** | **2** | BIAS FX 2 manufacturer 2.7.0 + BIAS X KVR | 92 / 60 |
| **kemper** | **1** | Rig Manager KVR (Profilers=hardware) | 60 |
| **TOTAL** | **217** | | |

## Airwindows strategy used

1. Set **`is_freeware=1`** for all 515 Airwindows rows (MIT / free site downloads).
2. **Consolidated only** stamped from official distribution GitHub release (`baconpaul/airwin2rack` tag `DAWPlugin`) installer filenames → **`2026-09-05-2a6d1c0` @90**. Site documents Consolidated as a separate host build; **not** applied to individual algorithm plugs.
3. Standalone zips / platform VST packs on airwindows.com **lack semver** in filenames → **no global pack version** invented for ~512 remaining algorithms.
4. Sparse exact KVR product pages only (SoftGate, DrumSlam @60). **Revoked** bad fuzzy maps: Air←Consolidated `1.2026.249`, Desk4←Desk, Logical4←Logical.
5. airwindows GitHub `airwindows/airwindows` has **no Releases** API tags usable as per-plugin versions (empty releases list).

## Method highlights

1. **Neural DSP** — `https://neuraldsp.com/downloads` public installer versions for Archetype X / Suites / Mantra / etc.
2. **Sonic Charge** — documented shared multi-installer `Version: 2024.08.30` for five plugs; Cyclone `1.1` separate.
3. **Madrona** — product-page installer labels; **skip** Aalto/Kaivo/Virta Mac≠Win.
4. **VCV** — Rack page `2.6.6 Download` for hub_app rows.
5. **Sugar Bytes** — Effectrix2 `v2.0.0` on product page; rest KVR (account downloads).
6. **Positive Grid** — BIAS FX 2 page `Update Version 2.7.0` raised to green; hardware pedals untouched.
7. **SSL** — KVR for software fills; **reclassified 500 Series Application** rows to `hardware`: UltraViolet EQ, B/E-Series Dynamics, SiX Channel, VHD+ Pre. **Meter Pro** still portal-only (must not use Meter 1.6.6).
8. **Kemper / Line 6** — hardware SKUs unversioned; Helix Native + legacy Farms via KVR; Rig Manager hub_app KVR.
9. **WA / Cymatics / Initial / AudioRealism / Dawesome** — manufacturer silent → KVR@60; skip expansions/soundsets/bundles.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand3/` | HTML caches, queues, kvr product pages |
| `tmp-fetch/chip-expand3/build_and_apply.py` | Apply script |
| `tmp-fetch/chip-expand3/accept-queue-manufacturer.json` | Manufacturer accepts |
| `tmp-fetch/chip-expand3/accept-queue-kvr.json` | KVR accepts |
| `tmp-fetch/chip-expand3/accepted-summary.json` | Pre-audit summary |
| `playbooks/{airwindows,neural-dsp,…}.md` | 15 playbooks |
| `out/catalog.json` | Re-exported |

## Still open (notable, expand-3 scope)

- Airwindows ~512 algorithm plugs without public per-plugin semver
- Madrona Aalto / Kaivo / Virta (Mac/Win installer mismatch)
- SSL Meter Pro (Download Manager / Complete Access)
- SSL 500-series hardware rows (now `hardware`, no DAW version)
- Positive Grid BIAS Amp 2 / OMNYSS / JamUp (User Center / discontinued)
- Line 6 Metallurgy trio / POD Farm; Neural Quad Cortex mini hardware
- Sugar Bytes Unique LE discontinued

## Identity honesty this pass

| kind | action |
|---|---|
| `hardware` | Kemper Profilers; Line 6 Helix/HX/POD; Positive Grid pedals/Spark; Neural Quad Cortex mini; **SSL 500-series** UltraViolet / B&E Dynamics / SiX Channel / VHD+ Pre |
| `hub_app` | VCV Rack / Pro versioned; Kemper Rig Manager versioned; Positive Grid JamUp open |
| `expansion` / `soundset` / `bundle` / `discontinued` | skipped for version stamp |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/chip-expand3/build_and_apply.py   # already applied
python3 src/export_catalog.py
python3 src/status_report.py
```

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Never invent. Hub portals not ground. No global Airwindows pack version for individual algorithms.

---

## Addendum — executor mop (chowdsp + AudioRealism) ~2:53–2:56 AM PT

After parent Sugar Bytes @92 / Sonic / Madrona accepts. **No re-export.**

### Accepted (+3 currents)

| plugin_id | version | source | conf | notes |
|---|---|---|---:|---|
| `chowdsp--chow-centaur` | **1.4.0** | https://chowdsp.com/products.html | 90 | Mac `ChowCentaur-Mac-1.4.0.dmg` == Win `ChowCentaur-Win-1.4.0.exe`; same product as OAS `oas--jatinchowdhury18-kloncentaur` |
| `chowdsp--chow-kick` | **1.2.0** | https://chowdsp.com/products.html | 90 | Mac/Win installer basenames 1.2.0; OAS twin `oas--chowdhury-dsp-chowkick` |
| `chowdsp--chow-phaser` | **1.1.1** | https://chowdsp.com/products.html | 90 | Mac/Win installer basenames 1.1.1; OAS twin `oas--jatinchowdhury18-chowphaser` |

`content_hash` = sha256 of fetched `products.html`. Method: `installer-basename-mac-win-match`. Kept KVR expand3 identity rows (not reclassed) — stamped matching manufacturer versions so catalog match works for either id.

### Reclass (no version)

| plugin_id | action |
|---|---|
| `audiorealism--technobox` | `identity_kind` → **`unknown_other`** — KVR `verios` 2.2.1 only; absent from audiorealism.se `/products` desktop list (iOS app, not desktop DAW plugin) |

### Skips (this mop)

| item | reason |
|---|---|
| madrona Aalto / Kaivo / Virta | Mac pkg 1.9.5 ≠ Win 1.9.4 / 1.9.3 (parent + confirm) |
| sonic-charge Synplant | no discrete SKU semver (parent) |
| sugar-bytes redo | parent already @92 product-page Downloads Version |
| cymatics / initial-audio plugins | already versioned (IA leftovers = expansions only) |
| SSL LMC-1 / X-ISM | not on offline Plug-in Downloads table (LMC+ is separate SKU); leave open |

### Parent accepts documented (do not redo)

See also `NOTES-version-chip-expand3-parent.md`: Sugar Bytes 19 @92; Sonic Charge 5 @85–90; Madrona Aaltoverb/Sumu @88; Airwindows Consolidated @88.

### Stats snapshot after mop

- accepted currents: **4268** (`python3 src/stats.py`)
- chowdsp manufacturer: **11/11** versioned (8 OAS + 3 KVR-twin rows)
