# NOTES — confidence raise 11 (2026-09-10 ~2:37 AM PT)

Overnight corroboration pass #11. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Focus: expand-2 manufacturers that landed as KVR@60 yellow and now have manufacturer pages. Also easy HoRNet/Rob Papen/Overloud leftovers. Zero trust; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **85** (yellow→green) |
| Manufacturer changelog / RN PDF @90–92 | **40** (Fuse 29 + Audified 9 + Dear Reality 2) |
| Manufacturer product USER GUIDE / Patreon VERSION @90 | **45** (Glitchmachines 6 + Analog Obsession 39) |
| Snapshot accepted-current green (≥85) | **2694** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1300** (all KVR @60) |
| Export | `out/catalog.json` @ 2026-09-10T09:37:04Z → **2026-09-10 2:37 AM PT** |

*This run’s own corroboration delta is **+85 green / −85 yellow**. Live band totals also reflect concurrent gaps-mop expand-2 (+11 accepted currents / true-gap mop) between STATUS ~2:26 and this export.*

Starting bands (brief): green **~2606** / yellow **~1377**. After this raise (+ concurrent mop): green **2694** / amber **56** / yellow **1300**.

## Breakdown of raises

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| Analog Obsession | **39** | Public Patreon posts (`analogobsession.com` catalog → Patreon) `VERSION X.Y` matching KVR | **90** |
| Fuse Audio Labs | **29** | Official `fuseaudiolabs.de/pages/changelog.md` — `All plugins [v2.7]` + per-SKU `[v1.0]`/`[v2.7]` | **92** |
| Audified | **9** | Official `audified.com/wp-content/uploads/…/*-Release-Notes.pdf` latest section | **92** |
| Glitchmachines | **6** | Product page `USER GUIDE - Version X.Y.Z` | **90** |
| Dear Reality | **2** | Dear Reality–authored USER MANUAL header on PA CDN | **90** |

### Analog Obsession (+39)

Manufacturer site is a catalog that redirects to **public** Patreon posts with `VERSION X.Y` / `Version X.Y` banners (no subscription required to read). Exact / trailing-zero–normalized match to KVR only.

Raised (slug → kept KVR normalized_version): atone 1.0, attractor 1.0, blendeq 2.0.0, busterse 7.0, bxq 5.0, cite 1.0.0, dbcomp 2.0.0, drgate 1.0, edcomp 1.0.0, fetcb 1.0, fiver 5.0.0, g395a 2.0, graphack 1.1.0, harqules 5.0.0, hlqse 5.0.0, indeq 1.0.0, laea 1.2.0 (latest of 1.1/1.2 on post), lala 3.1.0, loades 2.0, lovend 3.0.0, maxbax 2.0.0, midboss 1.0.0, moma 2.2, mpreq 5.0.0, muchild 1.0.0, mythpre 1.0, n492me 7.0.0, oaq 5.0.0, oss 6.0.0, poortec 1.0, razorclip 1.0.0, relife 2.0, ssq 7.0.0, steq 4.0.0, trax 2.0.0, treq 6.0.0, ureq 1.0.0, varimoon 6.0.0, yala 6.0.

AO yellow remaining: **32** (BritBundle/Fet Bundle members without per-SKU VERSION on public post; TILTA Patreon still says 1.0 vs KVR 2.0.0; TheBus/AHEAD/Amper/etc. not on scraped category→Patreon map with clean VERSION).

### Fuse Audio Labs (+29 / 29)

Public markdown changelog https://fuseaudiolabs.de/pages/changelog.md (also `.com/pages/changelog.md`):

- **All plugins [v2.7]** (31 Jan 2025) corroborates every pre-existing Fuse yellow at KVR **2.7**
- Per-SKU: OCELOT Clipper/Octaver/Upmixer **1.0**, Tube Lab **1.0**, OCELOT Limiter / VCS-1 / VREV-63/140/305 **2.7**

Fuse yellow remaining: **0**.

### Audified (+9)

Official release-notes PDFs (latest version heading; when RN is `X.Y.Z` and KVR is `X.Y.Z.build`, keep KVR build as same release line):

- mixchecker-pro **1.3.4.26**, mixchecker-ultra **1.1.0.28**, multidrive-pro **1.2.0**, gk-amplification-pro **3.1.6.19**, u73b-compressor **3.1.5.34**, u78-saturator **2.1.4.13**, rz062-equalizer **2.1.5.18**, 1a-equalizer **1.0.3.11**, toneknob-tinyamp **1.0.0.23**

Skipped mismatches: Linda IronVerb RN 1.0.3 vs KVR 1.0.4.11; ToneKnob Compressor/Saturator/Stargazer/TriMod RN ~1.0.x vs KVR 1.1.0. ToneSpot / STA / ampLion RN PDFs not found under public uploads paths this pass.

Audified yellow remaining: **29**.

### Glitchmachines (+6)

Product-page LEARN `USER GUIDE - Version X.Y.Z` exact match:

- cataract **2.2.0**, palindrome **2.0.0**, polygon **2.1.0**, quadrant **2.0.0**, subvert **2.0.0**, tactic **2.0.0**

Skipped: convex / cryogen / fracture-xt (product URLs 404 / no live USER GUIDE banner). Fracture/Hysteresis already @90 from expand-2 chip.

Glitchmachines yellow remaining: **3**.

### Dear Reality (+2)

Dear Reality GmbH USER MANUAL headers (hosted on Plugin Alliance product CDN — manufacturer-authored, not PA hub grind):

- dearvr-pro **1.10.0** (`v1.10.0`)
- dearvr-music **1.10** (`v1.10`)

Skipped: dearVR PRO 2 manual **V2.0.0** vs KVR **2.1.0.1**; EXOVERB/MICRO/MIX shop “manual” URLs returned HTML SPA shells without semver; other PA paths 403.

Dear Reality yellow remaining: **9**.

## Explicit non-raises (quality)

| Target | Why skipped |
|---|---|
| Antelope Audio 46 | FPGA/AFX software page — no discrete public per-plug semver |
| LANDR 15 | Account / FX marketing — no public installer semver |
| Tracktion 28 | Download Manager hub; BioTek marketing page no public 3.2.5 installer receipt |
| Heavyocity 4 | FURY product page marketing-only; scene mirrors cite 1.1.3 ≠ KVR 1.1.5 — do not raise |
| HoRNet 36 leftovers | Same gate as raise 9/10: gen-1←MK2 redirects; Angle/Freqs/Spaces MK2/HDS1 MK2 marketing-only (no matching version banner); Soft404s |
| Rob Papen 35 | downloads.html / news hub-walled — no public per-title semver |
| Overloud 20 leftovers | TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR — do **not** stamp TH-U host **2.0.19** onto edition SKUs; Fuse GEM already probed |
| AO TILTA | Patreon VERSION **1.0** ≠ KVR **2.0.0** |
| AO Brit/Fet bundle plugs | Bundle posts lack per-SKU VERSION banners |
| Audified ToneKnob 1.1.0 vs RN 1.0.x | Mismatch |
| Waves / IK / Spitfire / Acustica / UADx | Skipped per brief |

## Export

`python3 src/export_catalog.py` → `out/catalog.json` (4050 with latestVersion / versionConfidence).

## Playbook / doc updates

- `NOTES-confidence-raise-11.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/{analog-obsession,fuse-audio-labs,audified,glitchmachines,dear-reality}.md`
