# NOTES — confidence raise 10 (2026-09-10 ~2:16 AM PT)

Overnight corroboration pass #10. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Cap effort: meaningful batch, not infinite grind. Zero trust; no git clone.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **67** (yellow→green) |
| Official CDN / free-and-legacy installer filename @88 | **43** (Audio Damage) |
| Legacy products installer / RN @88–92 | **24** (iZotope) |
| Snapshot accepted-current green (≥85) | **2497** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1040** (all KVR @60) |
| Export | `out/catalog.json` @ 2026-09-10T09:16:52Z → **2026-09-10 2:16 AM PT** |

*This run’s own corroboration delta is **+67 green / −67 yellow** (2430→2497 / 1107→1040).*

## Breakdown of raises

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| Audio Damage | **43** | Official S3 demo zip inner installer app names + free-and-legacy CDN/Dropbox installer filenames matching KVR | **88** |
| iZotope | **24** | Legacy products public installers (+ VocalSynth 2 RN @92; Neutron 3 / iDrum / RX Loudness Control manufacturer-newer accepts) | **88–92** |

### Audio Damage (+43)

**Current catalog demos (17)** — `audio-damage-demo-versions.s3` zip central-directory lists `*_Installer_vX.Y.Z*.app` matching KVR (range-fetched CD only):

adverb2 2.3.0, ascent 1.0.9, axon-3 3.0.14, circa 1.1.7, continua 1.2.4, descent 1.0.9, dubstation-2 2.4.3, enso 1.4.0, eos-2 2.5.0, filterstation2 2.3.0, kombinat4 4.0.3, other-desert-cities 1.0.15, phosphor 3.1.10, quanta-2 2.2.2, ratshack-reverb-3 3.2.1, tessera 1.0.0, traverse 1.0.9

**Free RoughRider3 (+1)** — `RoughRider3_Installer_v3.3.0.app` inside free S3 zip from `/pages/roughrider3`.

**Free-and-legacy CDN/Dropbox (+25)** — installer basenames / encoded `NNN` tokens matching KVR:

907a 1.0, 914 1.1.0 (`_110`), automaton 1.2.0, axon1 1.3.0, bigseq2 1.2.0, bitcom 1.0.2, discord3 1.1.2, dr-device 1.2.0, dubstation1 1.5.3, filterstation 1.0, fluid 1.3.0, fuzzplus3 1.0.2, grind 1.1.0 (`AD035_Grind_110`), kombinat-dva 2.0.2, liquid 1.2.0, mangleverb 1.0.1 (`_101`), phase-two 1.3.0, phosphor1 1.2.0, ratshack-reverb-2 2.2, replicant1 1.6.3, ricochet 1.2.0, ronin 1.6.2, rough-rider-pro 1.2 (`Rough Rider Pro 1.2.mpkg`), tattoo 1.2.0, vapor 1.20

Audio Damage yellow remaining: **5** (digitalis-deverb / evil-otto / kombinat-tri / pulse-modulator / shinronin — no public versioned installer receipt).

### iZotope (+24)

Legacy products page `izotope.com/en/products/release-notes/` public installer filenames @88 (exact KVR match unless noted):

- alloy **1.01b**, alloy-2 **2.04**, breaktweaker **1.0.2**, ddly **1.0.1**, excalibur **5.0**, mobius-filter **1.0**, phatmatik-pro **1.5.2**, spectron **1.14b**, the-t-pain-effect **1.0.2**
- Exponential: nimbus **3.0**, phoenixverb **6.0.1**, phoenixverb-surround **4.0.1**, r2 **6.0.1**, r2-surround **4.0.1**, r4 **3.0**, stratus/stratus3d/symphony/symphony3d **3.2.0**
- Manufacturer-newer vs stale KVR: neutron-3-standard/advanced **3.10.0** (was 3.8.1), idrum **1.73** (was 1.7.5), rx-loudness-control **1.03a** (was 1.0)
- VocalSynth 2 **2.7.0** @**92** via `izotope.com/pages/release-notes/vocalsynth` (“Version 2.7.0 released May 6, 2025”)

iZotope yellow remaining: **6** (audiolens, iris-2 dual Mac≠Win, trash-2 dual Mac≠Win, fxeq, neutrino, velvet — no clean unified public receipt).

## Explicit non-raises (quality)

| Target | Why skipped |
|---|---|
| HoRNet 36 leftovers | Gen-1←MK2/MK3/MK4 redirects; marketing-only / Soft404 homepage (vu-meter-mk3, channelstrip-mk2, jamming-rock); HDS1 MK2 page has no version banner |
| Rob Papen 35 | downloads.html login/select-product only; newsletters mention “download latest” via in-plugin menu / My Products — hub-walled, no public semver |
| Native Instruments 27 | Native Access gated; no public per-title installer semver (Kontakt etc.) |
| AudioThing 27 Toys/Environments | `/instruments/{toy}` 404; updates-table lacks per-Toy installer; do not stamp Environments parent onto expansions |
| Overloud 20 leftovers | Fuse / TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR — no per-SKU public installer; do **not** stamp TH-U 2.0.19 |
| Kush Audio 18 | thehouseofkush.com Shopify products.json — marketing/licenses only, zero public installer semver |
| PSP remaining 15 | CDN naming sweep still HEAD 404 (account freemium / legacy) |
| AD 5 leftovers | digitalis-deverb / evil-otto / kombinat-tri / pulse-modulator / shinronin — archives unversioned or absent |
| iZotope Iris 2 / Trash 2 | Dual Mac≠Win installer filenames on legacy page (`2_0_2d` vs `2_02c`; `2_0_6` vs `2_05d`) |

## Export

`python3 src/export_catalog.py` → `out/catalog.json` (3593 with latestVersion / versionConfidence).

## Playbook / doc updates

- `NOTES-confidence-raise-10.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/audio-damage.md`, `playbooks/izotope.md` (+ brief skip notes on hornet/rob-papen/audiothing/overloud/kush/psp/ni)
