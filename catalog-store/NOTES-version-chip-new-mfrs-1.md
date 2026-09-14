# NOTES — Version chip new manufacturers (pass 1)

Date: 2026-09-10 ~1:05 AM PT (2026-09-10T08:05Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp `latestVersion` for as many **new** (universe-expand-overnight) plugins as possible from public manufacturer pages/feeds/CDN/filenames. Absolute zero trust — KVR only when no manufacturer public semver (confidence **60**). Manufacturer primary **88–95**.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 488 | **488** | 0 |
| plugins (universe) | 4367 | **4367** | 0 |
| accepted currents | 2653 | **2920** | **+267** |
| without version | 1714 | **1447** | −267 |
| true plugin gaps | 1274 | **1008** | −266 |
| observations total | 3720 | **3990** | +270 |

### Confidence bands (accepted currents)

| Band | Before | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 1869 | **2049** | **+180** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow &lt;70 (KVR@60) | 728 | **815** | **+87** |

Export: `out/catalog.json` — 488 mfrs, 4367 plugins, **2920** with accepted `latestVersion`.

## Accepted new versions by manufacturer

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **voxengo** | **50** | products page `Version X.Y, date` | 92 |
| **psp-audioware** | **46** | product-page installer filenames | 90 |
| **rob-papen** | **38** | KVR verwin (portal-walled) | 60 |
| **blue-cat-audio** | **33** | Download/Products table | 92 |
| **audio-damage** | **24** | 6 filename + 18 KVR | 85–88 / 60 |
| **zynaptiq** | **23** | support Current Versions (+3 KVR) | 90–92 / 60 |
| **kush-audio** | **19** | KVR verwin | 60 |
| **dmg-audio** | **16** | downloads.php | 92 |
| **tone-projects** | **8** | 6 Current version + 2 KVR | 92 / 60 |
| **mixed-in-key** | **6** | KVR suite SKUs | 60 |
| **cytomic** | **3** | homepage installer filenames | 92 |
| **lennardigital** | **1** | KVR Sylenth1 | 60 |
| **acustica-audio** | **0** | no public per-plugin semver found this pass | — |
| **TOTAL** | **267** | | |

## Source playbooks (created/updated)

Markdown under `playbooks/` + `manufacturer_playbooks` DB rows (now **439**):

- `voxengo`, `blue-cat-audio`, `dmg-audio`, `cytomic`, `tone-projects`, `psp-audioware`
- `audio-damage`, `zynaptiq`, `lennardigital`, `rob-papen`, `kush-audio`, `mixed-in-key`

## Method highlights

1. **Voxengo** — `https://www.voxengo.com/products/` product cards: `Version 3.24, April 4, 2026` etc. 50 current SKUs; ~23 legacy/discontinued identities remain without public card.
2. **Blue Cat** — `https://www.bluecataudio.com/Download/Products/` table with Last updated + version (AcouFiend 1.2 … Triple EQ 4.5). Bundles/series skipped.
3. **DMG** — `https://dmgaudio.com/downloads.php` all 16 products with installer versions (Compassion 1.30 … TrackMeter 1.13).
4. **Cytomic** — datacenter curl captcha-blocked; WebFetch of `https://cytomic.com/` shows `TheGlue_v1.9.3`, `TheDrop_v1.10.5`, `TheScream_v1.3.3` (2026-08-14).
5. **Tone Projects** — product pages `Current version: X.Y.Z (Month Year)`; Compadre/Sonitex via KVR.
6. **PSP** — per-product public installer filenames (`PSP_VintageWarmer2_2.11.0_macOS.dmg`); downloads hub login-walled. InfiniStrip page = EARTH build only; preQursor2 URL hosts preQursor3.
7. **Audio Damage** — filename when present (Discord4 4.1.5, Replicant 3.0.9, …); else KVR. Many S3 demos omit semver in filename.
8. **Zynaptiq** — `https://www.zynaptiq.com/support/` **Current Versions** + Legacy section. Corrected over-map of PitchMap::Colors / Orange Vocoder Nano; Punch/Balance/Colors via KVR; Aura still open.
9. **Rob Papen / Kush** — no reliable public manufacturer semver → KVR@60 sweep.
10. **LennarDigital Sylenth1** — account-walled → KVR 3.0.7.5 @60.
11. **Mixed In Key** — suite SKUs on KVR; individual Captain modules often lack KVR product pages.
12. **Acustica** — Aquarius/Nebula ecosystem; no public per-plugin version oracle found in this pass (0).

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-new-mfrs/` | Fetched HTML, mapped JSON, KVR caches |
| `tmp-fetch/voxengo-mapped.json` | Voxengo product→plugin map |
| `playbooks/{voxengo,blue-cat-audio,…}.md` | Per-mfr playbooks |
| `out/catalog.json` | Re-exported |

## Still open (notable)

- Acustica Audio **139** identity-only
- Voxengo legacy ~23 (Analogflux, Pristine Space, …)
- PSP ~35 without public installer on product page
- Audio Damage ~37 remaining (legacy/discontinued + demos without semver)
- MIK Captain individual modules; Zynaptiq Aura + Orange Vocoder Nano
- Pre-expansion stubborn 4 unchanged: `mpegh--mpeg-h-renderer`, `pitchinnovations--groove-shaper-lite`, `soundspot--propane`, `ssl--ssl-meter-pro`

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
