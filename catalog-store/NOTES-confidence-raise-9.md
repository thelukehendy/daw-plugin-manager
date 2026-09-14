# NOTES — confidence raise 9 (2026-09-10 ~2:08 AM PT)

Overnight corroboration pass #9. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Cap effort: meaningful batch, not infinite grind. Zero trust; no git clone.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **9** (yellow→green) |
| Manufacturer product-page banner @92 | **5** (HoRNet) |
| Official CDN installer filename @88 | **4** (PSP) |
| Snapshot accepted-current green (≥85) | **2430** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1107** (all KVR @60) |
| Export | `out/catalog.json` @ 2026-09-10T09:08:22Z → **2026-09-10 2:08 AM PT** |

*Live band totals may also reflect concurrent overnight chips; this run’s own corroboration delta is **+9 green / −9 yellow**.*

## Breakdown of raises

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| HoRNet | **5** | `hornetplugins.com/plugins/{slug}/` version banners matching KVR | **92** |
| PSPaudioware | **4** | `download-eu2.pspaudioware.net/…/{Name}_{ver}_macOS.dmg` HEAD 200 (+ Win.exe) matching KVR | **88** |

### HoRNet (+5)

Exact KVR match banners only (WebFetch; datacenter curl CleanTalk-403).

- coherence-meter **1.1.0** — “Coherence Meter 1.1.0 is available”
- hatefish-rhygenerator-one **1.1.0** — “HATEFISh RhyGenerator One 1.1.0 is available”
- hornet-adda **1.0.4** — “HoRNet ADDA 1.0.4 is available”
- hornet-sybilla **1.4.0** — “Sybilla 1.4.0 is available”
- hornet-l3012-bass-channel **1.0.1** — “HoRNet L3012 1.0.1 is out”

Hornet yellow remaining after this pass: **36**.

### PSP (+4)

Official CDN installer filenames matching KVR yellows (Mac + Win HEAD 200). Receipts: `tmp-fetch/raise9/psp/cdn-head-receipts.json`.

- psp-chamber **1.0.1** — `PSP_Chamber_1.0.1_macOS.dmg`
- psp-spector **1.0.1** — `PSP_Spector_1.0.1_macOS.dmg`
- psp-stepdelay **1.0.2** — `PSP_stepDelay_1.0.2_macOS.dmg`
- psp-stereoanalyser2 **2.0.2** — `PSP_stereoAnalyser2_2.0.2_macOS.dmg`

PSP yellow remaining: **15** (product pages lack public installer links; CDN naming sweep 404 for 84/85/ClassicQ/McQ/RetroQ/N2O/Nitro/NeonHR/Nexcellence/B-Scanner/PianoVerb/PseudoStereo/StereoEnhancer/2Meters/VintageMeter).

## Already manufacturer (skipped per brief)

| Manufacturer | Status |
|---|---|
| MeldaProduction | **0** yellow — all 130 currents already @92 (kernel **17.10.01** / downloads-page) |
| Eventide | **0** yellow — all 42 @92 (downloads product/installer labels) |
| Softube | **0** yellow — 144 RN @92 + Central CDN @90 |
| Blue Cat / DMG / Tone Projects / Cytomic | skipped (already manufacturer) |
| Waves / IK / Spitfire / UADx hubs | skipped unless rare public |

## Explicit non-raises (quality)

| Target | Why skipped |
|---|---|
| HoRNet gen-1←MK2/MK3/MK4 redirects | AnalogStage, ELM128→MK2, Magnus/Magnus MK2→MK3, Multicomp Plus→MK2, SongKey/SongKey MK3→MK4, Spaces→MK2, SW34EQ→MK2, Tape→MK2, ThirtyOne→MK2, TotalEQ→MK2, LU Meter / VU Meter soft404 homepage |
| HoRNet marketing-only (no banner) | 3XOver, Angle, CompExp, Dynamics Control, Freqs, H160, MixComp, Molla, Multicomp, StereoView, Magnus Lite, TapeLite, Spaces MK2, HDS1 MK2, VCA, TreBande, ZeroWidth; channelstrip-mk2 404; jamming-rock Soft404 |
| PSP remaining 15 yellows | No public installer on product page; CDN path variants HEAD 404 (account/user-area freemium downloads) |
| Cherry leftovers (Spin, preset packs, VM Core+Electro) | Spin VH HTTP **500**; Cloudflare on WebFetch; expansions not clean VH |
| Overloud CDN leftovers | Fuse / TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR libs — no per-SKU public installer; do **not** stamp TH-U changelog **2.0.19**; `installation.php` p=15/18/19/22/23 = unrelated stubs/TH2/BREVERB OEMs |

## Export

`python3 src/export_catalog.py` → `out/catalog.json` (3593 with latestVersion / versionConfidence).

## Playbook / doc updates

- `NOTES-confidence-raise-9.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/hornet.md`, `psp-audioware.md`, `cherry-audio.md`, `overloud.md`
