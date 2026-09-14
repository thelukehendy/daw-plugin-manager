# NOTES — Version chip universe-expand-10 leftovers

Date: 2026-09-10 ~5:17→5:24 AM PT (2026-09-10T12:17–12:24Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for universe-expand-10 leftovers needing versions or classification: **ujam**, **orchestra-tools** (SINE only), **cinesamples/8dio/puremagnetik** identity honesty (+ Musio hub if public), **surreal-machines**, **audiomodern** fills, **arturia Play** fills, confirm **Output Arcade Lines** soundset. Do **not** invent versions for sound libraries. Chip player/hub apps + actual plugins with public semver. Zero trust. No git clone.

## Counts

| Metric | Before (STATUS expand-10) | After | Delta |
|---|---:|---:|---:|
| manufacturers | 571 | **571** | 0 |
| plugins (universe) | 8078 | **8078** | 0 |
| accepted currents | 4899 | **4978** | **+79** |
| without version | 3179 | **3100** | −79 |
| without version + identity_kind=plugin | 644 | **567** | −77 |
| of which non-Airwindows plugin gaps | 132 | **55** | **−77** |

### Confidence bands (accepted currents)

| Band | Before | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 3271 | **3343** | **+72** |
| Amber 70–84 | 55 | **55** | 0 |
| Yellow <70 (KVR@60) | 1573 | **1580** | **+7** |

Export: `out/catalog.json` — 571 / 8078 / **4978**.

This-pass stamped currents: **+79** (70 manufacturer @90–92 + 9 KVR@60). Green Δ (+72) vs manufacturer greens (+70) reflects band arithmetic on live DB (Musio/SINE hubs counted in yellow/green separately from plugin-gap Δ).

## Accepted new versions by manufacturer (+79)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---:|
| **ujam** | **63** | Standalone Installers article (Mac=Win) | 92 |
| **audiomodern** | **8** | 6 manufacturer zip filenames + 2 KVR | 90 / 60 |
| **surreal-machines** | **6** | KVR Product Version Win=Mac | 60 |
| **orchestra-tools** | **1** | get-sine SINE Player **1.4.2** | 92 |
| **cinesamples** | **1** | KVR Musio 1 **1.49.1** | 60 |
| **arturia** | **0** | Play editions email/ASC gated | — |
| **8dio / puremagnetik / output** | **0** | soundset/bundle honesty only | — |
| **TOTAL** | **79** | | |

## Method highlights

1. **UJAM (+63 @92)** — Public https://support.ujam.com/hc/en-us/articles/28023878713500-Standalone-Installers lists per-SKU Mac+Win versions. Beatmaker titles mapped to **BM3** rows (e.g. DOPE/KAYA **3.0.1**). Finisher / Usynth titles / Symphonic Elements / Subcraft / Carbon / CINEDREAM / Slap / Dandy / Brute / Deep / Hot / Legend / Neon 1:1. Gen2 portals: `/guitarist/amber|iron|silk|sparkle/` are Amber/Iron/Silk/Sparkle **2** → AMBER2 **2.3.1**, IRON2 **2.3.1**, SILK2 **2.4.0**, SPARKLE2 **2.4.1**. Heavy/Phat/Solid + Mellow/Rowdy/Royal use current `*2` installer SKUs (gen1 discontinued). Bundles + MIDI Drum Beat Pack soundset intentionally unversioned. UJAM App v1.2.12 public but **no catalog identity** this pass.
2. **Orchestral Tools SINE** — get-sine shows **v1.4.2** + `SINE_Player_1.4.2.*` downloads @92 (KVR still 1.4.1). Collections remain soundset unversioned.
3. **Cinesamples Musio** — KVR `musio-1-by-musio` **1.49.1** Win=Mac @60. Libraries/bundles unversioned.
4. **Audiomodern (+8)** — Manufacturer zip primary: Soundbox **1.3.0**, Playbeat→Playbeat 4 **4.2.2**, Gatelab→Gatelab 2 **2.0.2**, Chordjam trial **1.5.0**, Freezr trial **1.0.4**, Loopmix trial **1.1.3** @90. Filterstep **1.1.3** / Panflow **1.0.1** KVR@60. Complete Suite bundle skipped.
5. **Surreal Machines (+6)** — KVR@60 all six plugins; product pages lacked public installer semver.
6. **Arturia Play** — Analog Lab Play / Pigments Play remain open (email download / ASC; no public semver).
7. **Output Arcade Lines** — confirmed already `soundset` (10 lines); no version invented.

## Identity honesty (reclass + confirm)

| Action | Count | Detail |
|---|---:|---|
| 8dio soundset→bundle | **41** | Name contains Bundle/Collection (marketing packs) |
| puremagnetik confirm | 0 | 216 soundset + 30 bundle + 4 discontinued; **no player/hub** |
| cinesamples confirm | 0 | libraries soundset; Musio hub_app; bundles bundle |
| OT collections confirm | 0 | soundset unversioned; SINE hub_app chipped |
| Output Arcade Lines confirm | 0 | already soundset |

## Still open (expand-10 scope)

- arturia--analog-lab-play / pigments-play (no public semver)
- All expand10 soundsets/bundles (intentional)
- Airwindows 512 intentional unversioned (unchanged)

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand10/build_and_apply.py` | Apply script |
| `tmp-fetch/chip-expand10/accept-queue.json` | Queue |
| `tmp-fetch/chip-expand10/accept-applied.json` | Applied accepts |
| `tmp-fetch/chip-expand10/accepted-summary.json` | Summary |
| `tmp-fetch/chip-expand10/reclass.json` | 8dio 41 reclasses |
| `tmp-fetch/chip-expand10/skipped.json` | Bundles/Play/open |
| `tmp-fetch/chip-expand10/ujam-standalone-versions.json` | Parsed installer tokens |
| `tmp-fetch/chip-expand10/mfr/*` | UJAM/SINE/AM/Arturia caches |
| `tmp-fetch/chip-expand10/kvr/*` | KVR product pages |
| `playbooks/{ujam,orchestra-tools,cinesamples,8dio,puremagnetik,surreal-machines,audiomodern,arturia,output}.md` | Updated |
| `out/catalog.json` | Re-exported |

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Ambiguous `2.x` / beta strings → skip. Bundles/soundsets/hardware stay unversioned unless a real suite/player installer semver exists. Never invent library versions. Gen2 portal SKUs mapped carefully (Amber→AMBER2, Playbeat→Playbeat 4, Gatelab→Gatelab 2).

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~5:24 AM PT |
| Manufacturers | **571** |
| Plugins | **8078** |
| Accepted currents | **4978** (+79) |
| Reclass | **41** (8dio soundset→bundle) |
| Non-AW plugin gaps | **55** (−77) |
| Bands | Green **3343** / Amber **55** / Yellow **1580** |
| Next | Arturia Play when public semver; remaining non-AW gaps (Boz/IL/Mercurial/…) |
