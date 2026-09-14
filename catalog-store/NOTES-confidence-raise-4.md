# NOTES — confidence raise 4 (2026-09-10 ~12:15 AM PT / 2026-09-10T07:15Z UTC)

Overnight corroboration pass #4: manufacturer raises for live yellows by mfr. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises. Skipped Waves 238 / IK 150 hub / UADx 61 per brief.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **22** (all Overloud) |
| Accepted-current green (≥85) | **1858** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **737** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **737** |
| Export | `out/catalog.json` @ 2026-09-10T07:15:48Z → **2026-09-10 12:15 AM PT** |

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Overloud | **22** | Official `installation.php?p=N` + `download.overloud.com` installer filenames encoding semver (GEM / Breverb 2 / SpringAge / REmatrix / Mark Studio / TH1 Triode / TH2 Play Brunetti) | **88** |

### Overloud accepts (installer-filename @88)

**GEM (15)** via `https://www.overloud.com/installation.php?p={3000–3011}` and/or CDN HEAD 200 on `download.overloud.com/Gems/{Folder}/Install Gem … {ver} Mac.pkg` matching KVR:

- Comp76 **2.0.10**, EQ495 **1.2.5**, TAPEDESK **1.2.5**, EQ84 **1.3.5**, Dopamine **1.1.9**, Sculptube **1.0.5**, EQ550 **1.1.6**, Comp G **1.0.7**, ECHOSON **1.0.8**, Comp670 **1.1.7**, OTD-2 **1.0.5**, Comp LA **1.0.7**, Comp160 **1.0.1**, EQP **1.0.3**, Modula **1.0.3**

**Other (7)**:

- Breverb 2 **2.1.18** (`installation.php?p=11`)
- SpringAge **1.5.6** (`p=5` + CDN `SpringAge/Install SpringAge 1.5.6 Mac.pkg`)
- REmatrix **1.2.12** (CDN `REmatrix/Install REmatrix 1.2.12 Mac.pkg`)
- Mark Studio 1 **1.2.1** (`p=9`)
- Mark Studio 2 **2.0.21** (`p=14`)
- TH2 Play Brunetti **2.1.4** (`p=8`)
- TH1 Triode **1.1.17** (`p=3`) — manufacturer newer than KVR **1.1.16** (accepted mfr version)

## Explicit non-raises (quality)

### Spitfire Audio (~72 remaining)
- Support changelogs already used in raise 2/3 (BBCSO / ARO / ART2 / EWC / AIR Reverb / Solar).
- **Originals Changelogs** = INSTRUMENT platform **v2.3.5** — do **not** stamp onto per-SKU KVR 1.x plugin ids (legacy Spitfire plugin format still app-served).
- AIR Studios Reverb Essentials mfr **1.2.2** ≠ KVR **1.2.14** — skip.
- Hans Zimmer / Phobos / LABS / Albion / most libraries: FAQs only, no public Installer v / plugin changelog.
- Ensemble / SSO / Hearth & Hollow changelogs exist but those SKUs are not in the yellow set this pass.

### Overloud leftovers (~22)
- **GEM Voice / Fuse**: product + demo pages exist; no public versioned installer URL / `installation.php` id in scanned ranges (3012+ 404). `/downloads` lists DEMO tiles only (account).
- **REmatrix Player**: no separate Player installer on CDN (do not stamp REmatrix host onto Player).
- **TH-U edition packs @1.4.7**, SuperCabinet, TH3, rig libraries @1.0: no per-edition public changelog/installer; do **not** stamp TH-U Premium **2.0.19**.
- IR libraries @1.0: content packs, no installer semver.

### AudioThing (~27)
- Yellow leftovers are Toys / instruments / Environments expansions / Soundscapes.
- `plugin-updates/` demo DMGs cover effects already green; Toys product URLs 404; Environments parent DMG must not stamp expansions.

### Nugen Audio (~27)
- `/product-updates` lists **stale** versions older than KVR (e.g. Halo Upmix **v1.5.0.10** vs KVR **1.7.3.1**; Halo Downmix **v1.1.2.1** vs **1.5.5.0**; AMB **v1.1.3.2** vs **1.1.4.1**) — do not raise on mismatch / do not replace with older mfr.
- My Products / build-archive still login-walled.

### Slate Digital (~18)
- Hub-heavy (RME). Fresh Air marketing page has no clear current installer semver matching KVR **1.1.6**.

### Acon Digital (~14)
- Studio* / DeEss:Dialogue / Extract:Dialogue 2: public `/software/` still lacks matching installers; Zendesk says account downloads.

### Cableguys (~14)
- Module Shapers / Curve / Kickstart: no Manual PDF on `downloads.cableguys.com`; product pages name major gen only. Do **not** stamp ShaperBox **3.6.3**.

### United Plugins (~13) / Output (~11)
- UnitedPlugins Manager / Output Hub only — no public per-title semver.

### Baby Audio (~9)
- Gen-1 / Magic* / Warp / Beat Slammer / BA-1 FX Strip / Baby Comeback absent from babyaud.io/downloads (Pro/2 / Comeback Kid already green). Do not stamp Comeback Kid onto Baby Comeback; legacy accordion **v1** ≠ KVR.

### Synchro Arts (~7)
- Downloads page → My Account for installers; manuals (e.g. RePitch **2.0.9**) ≠ KVR build-style versions (**2.0.76** / **2.0.108**).

### Kazrog (~5)
- Bug-fix / Oct 2025 posts name Recabinet/Thermionik without per-plugin semver tables. Plugin Manager hub.

### Cherry leftovers (~5)
- Spin VH still HTTP **500**; preset packs / VM Core+Electro product+VH 404/500.

### D16 (~4) / u-he (~4) / Xfer (~4) / AIR (~5)
- D16 Fazortan/Redoptor/Syntorus/Toraverb gen-1 @2.2.2: only gen-2 CDN folders — skip.
- u-he soundsets: no live installer on `dl.u-he.com/releases/`.
- Xfer: freeware page has OTT/etc only; Cthulhu/Nerve/LFOTool/Serum demo paths ≠ KVR or account-gated.
- AIR: public VI pages lack clear Boom/Xpand/Structure/DB-33/MiniGrand installer semver matching KVR.

## Playbook / doc updates

- `STATUS.md`, `HANDOFF-FOR-CURSOR.md` — bands + export refreshed.
- `playbooks/overloud.md` — raise-4 scrub notes; brief non-raise notes on other targeted playbooks where useful.
