# NOTES — confidence raise 5 (2026-09-10 ~12:27 AM PT / 2026-09-10T07:27Z UTC)

Overnight corroboration pass #5: smaller yellow piles with likely public pages. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises. Skipped Waves 238 / IK 150 / Slate/Output hubs / Spitfire FAQ-gated / Nugen stale product-updates per brief.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **7** |
| Accepted-current green (≥85) | **1865** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **730** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **730** |
| Export | `out/catalog.json` @ 2026-09-10T07:27:37Z → **2026-09-10 12:27 AM PT** |

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Overloud | **2** | Official CDN installer filenames (`download.overloud.com`) | **88** |
| Cableguys | **1** | Official Manual PDF `Manual v2.0.9` | **90** |
| Spectrasonics | **2** | Official `updates.spectrasonics.net/checkForUpdates.php` “up to date” | **90** |
| Plugin Alliance | **2** | Official product manual CHANGELOG Version **1.2.0** | **90** |

### Overloud (+2)

- **GEM Voice `1.0.7`** — `https://download.overloud.com/Gems/Voice/Install%20Gem%20Voice%201.0.7%20Mac.pkg` (+ Win 64-bit.exe) HEAD 200. Manufacturer **newer than KVR 1.0.6** → accept mfr version @88.
- **REmatrix Player `1.2.12`** — `…/REmatrix%20Player/Install%20REmatrix%20Player%201.2.12%20Mac.pkg` (+ Win) HEAD 200 matching KVR @88. (Raise 4 missed the spaced folder name.)

### Cableguys (+1)

- **Nicky Romero Kickstart `2.0.9`** — `https://downloads.cableguys.com/Nicky-Romero-Kickstart-2-Manual.pdf?v=2.0.9` opens **Manual v2.0.9** (sha256 `3a5518a778c2311c3e171700f09b127dabbf3430a1fe483f6642bbbb0fb3c5eb`) matching KVR @90.

### Spectrasonics (+2)

- **Keyscape `1.5.2c`** — `checkForUpdates.php?Keyscape+version=1.5.2c` → “up to date”; Latest Version displayed **1.5.2** (letter suffix normalized) @90.
- **Stylus RMX `1.10.6d`** — same endpoint with StylusRMX version → up to date; Latest **1.10.6** @90.

### Plugin Alliance (+2)

- **Schoeps Double MS `1.2.0`** — `files.plugin-alliance.com/products/schoeps_double_ms/schoeps_double_ms_manual.pdf` CHANGELOG Version 1.2.0 @90.
- **Schoeps Mono Upmix 1to2 `1.2.0`** — matching Mono Upmix manual CHANGELOG @90.

## Explicit non-raises (quality)

### Synchro Arts (7)
- Downloads/manuals page → My Account for installers; no public installer filename matching KVR build-style versions (RePitch **2.0.76/2.0.108**, VocAlign build strings, Revoice Pro **5.1**).

### D16 Group (4)
- Fazortan/Redoptor/Syntorus/Toraverb gen-1 @KVR **2.2.2**: only **gen-2** CDN folders (`Fazortan2-2.2.2.dmg` HEAD 200; gen-1 path 403/404). Do not stamp.

### Xfer Records (4)
- Freeware page = OTT/etc only. Serum 2 / LFOTool / Cthulhu / Nerve account-gated; Serum 2 manual header **2.0.18** ≠ KVR **2.1.5**.

### Baby Audio (9)
- Legacy page `babyaud.io/downloads-legacy` only lists Smooth Operator / Transit labeled **v1** (≠ KVR **1.6** / **1.2.0**); Magic*/Warp/Beat Slammer/BA-1 FX Strip/Baby Comeback absent. Manuals lack matching semver. Do not stamp Comeback Kid → Baby Comeback.

### Kazrog (5)
- Current public version table (Mar 2026 maintenance) covers Airline/AmpCraft/Avalon/KClip/… — **not** Recabinet/Thermionik/ValvEQ/masterDither/PluginUpdate (legacy/discontinued). Hub Plugin Manager.

### United Plugins (13)
- Product pages semver-free; `/download/` = UnitedPlugins Manager only. Do not stamp Manager onto Core/full titles.

### Cherry Audio leftovers (5)
- Spin product/VH still 404/500; preset packs / VM Core+Electro still broken. No public VH match.

### Overloud leftovers (~20)
- **GEM Fuse**: extensive CDN naming sweep (folder/name/ver) → all 404; shared Gems user-manual PDF has no per-plugin semver.
- TH-U edition packs @1.4.7 / SuperCabinet / TH3 / rig + IR libraries: no per-edition public installer; do **not** stamp TH-U Premium **2.0.19**.
- `installation.php` scan p=1–49 / 100s / 200s / 3016+ : no Voice/Fuse ids (p=20/21 = EZmix/TH2 KR SE unrelated).

### LiquidSonics (1)
- Seventh Heaven Professional still **Mac 1.5.8 vs Win 1.5.9** on public downloads — dual Mac/Win skip.

### Audiomodern / apulSoft
- **0** yellow remaining (already raised prior).

### Eiosis (2)
- eiosis.com redirects into Slate Digital ecosystem; no public AirEQ/E2Deesser installer semver.

### iZotope leftovers (2)
- Iris 2 / Trash 2 discontinued; legacy downloads account/Product Portal only — no public current installer semver.

### Audiomovers (3)
- Public `/downloads/` latest plugin label **v2.137** (Win) / Mac still **2.102**; KVR **2.141.20260225** newer + platform diverge — skip.

### Plugin Alliance MEGA Sampler (1)
- Official manual PDF has no CHANGELOG Version matching KVR **1.2.0** (unlike Schoeps manuals).

### Acon Digital (14)
- Public `/software/` has ExtractDialogue gen-1 (max **1.2.0**) — not Extract:Dialogue **2** **2.0.1**; no Studio* / DeEss:Dialogue installers. Account downloads for current.

### Cableguys modules / Curve (13 left)
- No per-module Manual PDF on `downloads.cableguys.com` (only Kickstart 2 found this pass). Do **not** stamp ShaperBox **3.6.3** / hub PDF query versions onto modules.

### AIR (5) / u-he soundsets (4)
- AIR VI product pages lack clear installer semver matching KVR Boom/Xpand/Structure/DB-33/MiniGrand.
- u-he soundset URLs soft-200 tiny stubs (~298 B), not live packages; product pages lack public soundset semver matching Blue Flamingo **1.0** / RePercussion **1.1.1** / Zebratron / Strobos.

## Playbook / doc updates

- `STATUS.md`, `HANDOFF-FOR-CURSOR.md` — bands + export refreshed.
- Playbooks: `overloud.md`, `cableguys.md`, `spectrasonics.md`, `plugin-alliance.md` (+ brief non-raise notes on targeted playbooks where useful).
