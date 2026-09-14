# NOTES — confidence raise 3 (2026-09-09 PT / 2026-09-10 UTC)

Overnight corroboration pass #3: (7) opt-first re-point, then manufacturer raises. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **34** (27 chip-A + 7 chip-B) |
| Fixed by opt (7) | **0** (no yellow current had another *accepted* obs @≥85 same `normalized_version`) |
| Accepted-current green (≥85) | **1836** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **759** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **759** |
| Export | `out/catalog.json` @ 2026-09-10T06:58:43Z → **2026-09-09 11:58 PM PT** |

## Opt (7)

Scanned all **793** yellow currents. Point `plugin_version_current` at any other **accepted** observation with same `normalized_version` and `confidence≥85`.

- **Fixed: 0**
- Rejected same-version peers (not used): AudioThing Environments expansions had manufacturer demo-installer obs @88 previously **rejected** (parent Environments installer ≠ expansion SKU) — correctly left yellow.

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Cherry Audio | **16** (+**2** chip-B → **18** total raise-3) | chip-A: correct-slug VH matches; chip-B: GX-80 **1.0.13** + Synth Stack 6 **6.0** | 92 |
| Cableguys | **5** | Official PDFs on `downloads.cableguys.com` open “Manual v…” matching KVR | 90 |
| Spitfire Audio | **5** | support.spitfireaudio.com plugin changelogs (ARO **1.4.7** newer than KVR 1.3.29; ART2 / EWC / AIR Reverb / Solar match) | 92 |
| Acon Digital | **1** | `acondigital.com/software/AudioLiquid100us.exe` HEAD 200 → **1.0.0** (norm **1.0**) | 88 |

### Cableguys manuals

- HalfTime **v1.1.12**, Snapback **v1.1.2**, FilterShaper XL **v1.0.6**, MidiShaper **v1.6.3**, PanCake 2 **v2.3.2**

### Cherry VH matches (slug → latest)

Atomika, Blue3, DS-2, Spirit, ESQ-1, Filtomika, Galactic, Memorymode 2, ODC 2800, Polymode, Rackmode, Rhodes Chroma, SH-MAX, Trident Mk III, Wurlybird 140B, Yellowjacket.

### Spitfire support changelogs

- Abbey Road Orchestra plugin **v1.4.7** (was KVR 1.3.29) @92
- Abbey Road Two Iconic Strings Pro **v1.3.9** @92
- Eric Whitacre Choir Plugin **v1.7.2** @92
- AIR Studios Reverb **v.1.4.0** @92
- Solar **v1.7.5** @92

## Explicit non-raises (quality)

- **Opt7 / AudioThing instruments**: updates table + demo DMGs cover effects already green; remaining yellows are Toys/instruments/expansions with no public installer semver. Environments expansions stay yellow (reject reason stands).
- **Cherry leftovers**: Spin VH still HTTP 500; preset packs / VM Core+Electro product+VH 404/500. *(GX-80 + Synth Stack 6 corrected in chip-B below.)*
- **Acon Studio\*** / DeEss:Dialogue / Extract:Dialogue **2**: no matching `acondigital.com/software/` installers (Studio absent; ED gen-1 max macOS **1.2.0** ≠ ED2 **2.0.1**).
- **Overloud GEM / editions**: no per-GEM `download.overloud.com/*/changelog.txt` (unlike TH-U); product pages lack Installer v — do not stamp TH-U **2.0.19**.
- **Spitfire** leftovers (~72): most libraries app-gated; AIR Reverb Essentials mfr **1.2.2** ≠ KVR **1.2.14** — skip; Originals INSTRUMENT platform **2.3.5** not stamped onto per-SKU 1.x KVR ids.
- **UADx / native** (~61): `help.uaudio.com` UAD Native Release Notes lists months/features, not per-title semver — left at 60.
- **United Plugins**: public `/download/` is Plugin Manager only (v02.19) — hub-walled.
- **Cableguys** module Shapers / Curve / Kickstart: no matching Manual PDF this pass; do not stamp ShaperBox 3.6.3 onto modules.
- **D16 gen-1** Fazortan/Redoptor/Syntorus/Toraverb @2.2.2: only gen-2 CDN — skip.
- **u-he** soundsets (Blue Flamingo / Repercussion / Zebratron / Bazille Strobos): no live product pages / CDN 404 after redirect. *(Beatzille raised in chip-B via product page v1.0.2.)*
- **Kazrog / Baby Audio**: Kazrog Plugin Manager hub; Baby Audio yellows are gen-1 / FX-strip / Magic* absent from babyaud.io/downloads (Pro/2 lines already green). Do not stamp Comeback Kid onto Baby Comeback.
- **LiquidSonics Seventh Heaven Professional**: Mac CDN **1.5.8** vs Win **1.5.9** (KVR 1.5.9) — dual Mac/Win ambiguity, skip. *(Filtrate raised in chip-B.)*
- **Waves / IK / Nugen / Slate / Output**: hub-walled or no public per-plugin semver this pass.


## Chip-B continuation (same overnight pass)

Additional manufacturer corroborations after chip-A (+27). Pre-chip-B snapshot: green **1829** / yellow **766**. Post: green **1836** / yellow **759**.

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Cherry Audio | **2** | GX-80 VH latest **Version 1.0.13, Build 147** (prior “1.0.9 mismatch” was Initial Release, not latest); Synth Stack 6 VH **Version 6.0** Initial Release | 92 |
| u-he | **1** | Beatzille product page “NEW in v1.0.2” / “Beatzille 1.0.2 (revision 12092)” | 92 |
| apulSoft | **1** | apulsoft.ch apTrigga3 download modal **Downloads (v3.7.4)** + `aptrigga3-mac-3-7-4.pkg` | 92 |
| LiquidSonics | **1** | Legacy downloads `Setup_Filtrate_1.120` / `Setup_Filtrate-OSX_1.120.pkg` | 90 |
| Black Salt Audio | **1** | silencer product inventory `Silencer-1.1.4.exe/.pkg` + `/silencer/download/1.1.4/` | 90 |
| Audiomodern | **1** | CDN trial `Audiomodern_Riffer_3.1.2_Trial.zip` | 90 |

### Chip-B explicit non-raises

- **Nugen Audio (~27)**: `/downloads` error; product-updates stale; My Products / build-archive login-walled.
- **Acon Studio* / Dialogue 2 (~13 remaining)**: public `/software/` has no Studio* or ExtractDialogue2; Zendesk says current installers account-only.
- **Cableguys module Shapers / Curve / Kickstart (~14)**: product pages name gen (VolumeShaper **7**) not installer semver; no per-module Manual PDF; do not stamp ShaperBox **3.6.3**.
- **United Plugins (~13)**: product pages semver-free; updates via UnitedPlugins Manager.
- **Output (~11)**: Output Hub only — no public per-title semver.
- **Baby Audio yellow (~9)**: gen-1 Smooth Operator / Transit legacy accordion shows **v1** (≠ KVR 1.6 / 1.2.0); Magic*/Warp/Beat Slammer/BA-1 FX Strip / Baby Comeback absent from downloads — skip.
- **Synchro Arts (~7)**: downloads page manuals (e.g. RePitch manual **2.0.9**) ≠ KVR build-style versions (2.0.76 / 2.0.108); no installer filenames matching.
- **SIR StandardCLIP**: Mac **1.6.056** ≠ Win **1.6.057** — dual-platform skip (KVR=Win).
- **AudioMovers LISTENTO**: public downloads latest plugin label **v2.137** (Win) / Mac alias still **2.102**; KVR **2.141.20260225** newer + platform diverge — do not fake-confirm or force.
- **Xfer**: demo download paths (Cthulhu 1.1x / Nerve 1.2.3) ≠ KVR (1.248 / 1.2.9.5); Serum account-gated.
- **Safari Gorilla / Scuffham / Supertone / Klanghelm MJUC / Leapwing LimitOne**: marketing pages without clear current installer semver (MJUC JS-gated).
- **UADx (~61)**: no per-title public semver (unchanged).
- **Waves / IK / Spitfire leftovers / Overloud / Slate / AIR**: still blocked as prior.

## Export (chip-B)

`out/catalog.json` @ 2026-09-10T06:58:43Z → **2026-09-09 11:58 PM PT**.

## Playbook / doc updates

- `STATUS.md`, `HANDOFF-FOR-CURSOR.md` — bands + export refreshed (chip-A + chip-B).
- `playbooks/cherry-audio.md`, `cableguys.md`, `spitfire-audio.md`, `acon-digital.md`, `u-he.md`, `liquidsonics.md`, `apulsoft.md`, `black-salt-audio.md`, `audiomodern.md`, `nugen-audio.md` — scrub notes.
