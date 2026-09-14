# NOTES — Version chip universe-expand-2 manufacturers

Date: 2026-09-10 ~2:14→2:26 AM PT (2026-09-10T09:14–09:26Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for identity-only universe-expand-2 manufacturers (+ TAL +27). Prefer manufacturer pages/CDN **88–95**; KVR **@60** only when no manufacturer public semver. Honest `identity_kind` (Bitwig/Tracktion hub_app; Heavyocity/Excite soundsets; discoDSP/Xhun expansions). Zero trust. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 508 | **508** | 0 |
| plugins (universe) | 5091 | **5091** | 0 |
| accepted currents | 3593 | **4039** | **+446** |
| without version | 1498 | **1052** | −446 |
| without version + identity_kind=plugin | 496 | **54** | −442 |
| observations total | 4881 | **5394** | +513 |

### Confidence bands (accepted currents)

| Band | Before | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 2430 | **2606** | **+176** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1107 | **1377** | **+270** |

Export: `out/catalog.json` — 508 mfrs, 5091 plugins, **4039** with accepted `latestVersion`.

## Accepted new versions by manufacturer (+446)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **analog-obsession** | **71** | KVR verwin | 60 |
| **antelope-audio** | **46** | KVR verwin | 60 |
| **audified** | **38** | KVR verwin | 60 |
| **sonible** | **34** | 20 productPage latest version + 14 KVR | 92 / 60 |
| **toneboosters** | **33** | 17 changelog builds + 16 KVR (v3) | 92 / 60 |
| **fuse-audio-labs** | **29** | KVR verwin (JS SPA) | 60 |
| **tracktion** | **28** | KVR (Waveform hub_app left open) | 60 |
| **denise** | **26** | 3 downloads (ver) + 23 KVR | 92 / 60 |
| **tal-software** | **24** | product Downloads vX.Y.Z (+ KVR leftovers) | 92 / 60 |
| **xhun-audio** | **21** | 13 download VERSION + 8 KVR | 90 / 60 |
| **discodsp** | **16** | 9 product heading + 7 KVR | 92 / 60 |
| **landr** | **15** | KVR landr-audio | 60 |
| **glitchmachines** | **11** | 2 USER GUIDE + 9 KVR | 90 / 60 |
| **dear-reality** | **11** | KVR | 60 |
| **auburn-sounds** | **8** | product page H1 vX.Y | 92 |
| **polyverse** | **8** | update page Current versions | 92 |
| **sound-radix** | **8** | 5 downloads Mac==Win + 3 KVR | 92 / 60 |
| **excite-audio** | **7** | KVR (Bloom*=soundset skipped) | 60 |
| **bitwig** | **4** | Studio installer 6.1.1 → hub_app rows | 92 |
| **heavyocity** | **4** | KVR (libraries=soundset) | 60 |
| **mathew-lane** | **4** | support FAQ macOS/WIN64 match | 92 |
| **TOTAL** | **446** | | |

## Method highlights

1. **Auburn Sounds** — product titles `Name vX.Y` (Couture 1.10 … Selene 1.1).
2. **sonible** — `latest version` on product pages; skip redirect contamination (smartcomp2→3, smarteq→4).
3. **Sound Radix** — downloads Mac/Win; skipped Drum Leveler & SurferEQ 2 dual mismatch; Muteomatic login-walled.
4. **ToneBoosters** — changelog `Product build X.Y.Z` (not shared installer 2.1.8).
5. **Polyverse** — https://polyversemusic.com/update/ Current versions list (public).
6. **denise** — downloads page `(1.3)/(1.4)` for Bass XXL / Motion Filter / Perfect Room 2.
7. **TAL** — `Downloads vX.Y.Z` after HTML textify (curl often 404; urllib/Safari UA OK).
8. **discoDSP** — product headings (Discovery Pro 9.3, Bliss 3.23, OB-Xd 3.24, Corona 7.0, …).
9. **Xhun** — download page `VERSION : X.Y.Z (DEMO)` paired with `*.products.png` slug.
10. **Mathew Lane** — support FAQ current macOS==WIN64.
11. **Bitwig** — one installer **6.1.1** for all Studio editions (`hub_app`).
12. **Glitchmachines** — Fracture/Hysteresis USER GUIDE 1.4.0; rest KVR.
13. **Analog Obsession / Fuse / Audified / Antelope / LANDR / Dear Reality / Excite / Tracktion / Heavyocity plugs** — manufacturer oracle missing or hub → KVR@60. Skip Mac/Win diverge.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand2/` | Manufacturer HTML, accept queues |
| `tmp-fetch/chip-expand2/kvr/` | KVR developer + product caches + accept-kvr.json |
| `playbooks/{auburn-sounds,sonible,…}.md` | 21 new/updated playbooks |
| `out/catalog.json` | Re-exported |

## Still open (notable, expand-2 scope)

- Sound Radix: Drum Leveler, SurferEQ 2 (Mac/Win mismatch)
- sonible: smart:EQ+ (no safe product page; bad KVR map dropped)
- Audified ~19 without verwin
- TAL: Flanger / Phaser / Tube
- ToneBoosters: Sibalance v3
- Glitchmachines: Skein
- Analog Obsession: Comper
- Xhun: Analog Fists
- Tracktion Waveform Free/Pro hub_app (no clear public Waveform 14 installer semver this pass)
- Heavyocity / Excite / discoDSP / Xhun **non-plugin** identities intentionally unversioned

Stubborn pre-expansion receipt gaps unchanged (mpegh, groove-shaper-lite, Sonnox Restore trio, SSL Meter Pro, …).

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Never invent. Hub portals not ground.
