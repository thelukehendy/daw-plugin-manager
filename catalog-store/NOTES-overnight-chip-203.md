# NOTES — overnight chip-203 creative leftovers (2026-09-09 PT)

Zero-trust overnight pass. Start: **2624/2827** accepted · **203** unknown.
End: **2644/2827** accepted · **183** unknown (Δ **+20**). `verified_by=coding-assistant`. No git clone.

## Accepts (+20)

### Softube pack / All-plug-ins family (**+8** → 2.6.41)

Source: Softube release notes 2.6.41 (2026-08-20) **"All plug-ins"** section — same receipt already used for 100+ Softube Central plugins. Corroborated by live KVR pack pages where applicable.

| plugin_id | corroboration |
|---|---|
| `softube--active-equalizer` | Passive-Active Pack KVR verwin **2.6.41** (names Active/Passive/Focusing EQ) |
| `softube--passive-equalizer` | same |
| `softube--focusing-equalizer` | same |
| `softube--fix-doubler` | Fix Flanger and Doubler KVR verwin **2.6.41** |
| `softube--fix-flanger` | same |
| `softube--trident-a-range` | softube.com/plug-ins/trident-a-range (live) + All plug-ins RN |
| `softube--tsar-1-reverb` | softube.com/plug-ins/tsar-1-reverb (live; includes TSAR-1R already accepted) |
| `softube--tsar-1-true-stereo-algorithmic-reverb` | alias of TSAR-1 line |

`extract_method=manufacturer-release-notes`, `source_kind=releaseNotesPage`, confidence **92**.

**Still skipped Softube:** Amp Room *Suites; British Class A compressor/drive/EQ splits; Dyna-mite Gate/Slam; Overstayer Extended; Tonelux Tilt Live; Model 72/77/84 FX spinouts; Console 1 hardware + edition packs. Notes updated.

### GainMatch (**+1** → 1.53)

`leotokarev--gainmatch-aax` via LetiMix `version_history.txt` (**August 6, 2026 v 1.53**); manufacturer aliases include letimix. Product page also shows v1.53. (KVR displays mangled 1.5.30 — prefer manufacturer.)

### Mixland Vac Attack (**+1** → 1.0.1)

PA product page Installer v1.0.1 + changelog. (KVR lists 1.0.2 — prefer manufacturer installer field.)

### bx_crispyscale (**+1** → 1.1.0)

Included companion on bx_crispytuner PA page; same Installer v1.1.0 as accepted crispytuner. Standalone crispyscale URL 404.

### Listento-MIDI (**+1** → 2.141.20260225)

Suite-shared with LISTENTO/LISTENTO Receiver (already accepted). Audiomovers docs/downloads: LISTENTO Instrument transmits MIDI; no individual KVR page. confidence set **70** at accept; after `backfill_confidence.py` → **60** (KVR URL heuristic).

### SPL legacy → Plus (**+8** → 1.9, discontinued)

Public legacy installer filenames on `files.plugin-alliance.com` (HEAD 200). Marked `discontinued=1` with `successor_plugin_id` → Plus SKUs already in catalog.

| SKU | file receipt |
|---|---|
| Attacker / SPL Attacker | `spl_attacker_mac_1_9.zip` |
| De-Verb / Mo-Verb | `…_win_x64_1_9.zip` |
| EQ Rangers Vol. 1 + Bass/Vox/Full Ranger | `spl_eq_rangers_vol_1_win_x64_1_9.zip` |

## Notes-only / no version

- **u-he soundsets (24)** + eurorack/cookbook: `notes_for_user` = soundset/hardware/docs — not plugin semver; dl.u-he.com/releases/ still core-only.
- **Arturia classic V (13)**: gen-ambiguous notes — V3/V4 redirects are ground-up rewrites; **no** accept of Vn onto V SKU.
- **AIR CC (20+Vacuum)**: still no per-effect semver; bundle year-only rejected.
- **PA 404 leftovers**: bx_XL V2 marked discontinued→V3; elysia alpha master/mix, Schoeps 1to3, The Sauce notes; UAD Vitalizer under spl noted as UA track.
- Softube skip SKUs: explanatory `notes_for_user`.

## Probed but not accepted

Steinberg ChannelX/Lindell/PEX; Slate VSX/VBC/Trigger_2; Omnisphere (KVR→Omnisphere 1 **1.5.8d** gen mismatch vs current Omnisphere 3); VocAlign Pro dual verwin; EON-Arp MIDI title mismatch; Capstan no semver; SSL Meter Pro 404; Kiive Xtressor→XTComp rename; oeksound Sculpt 404; AIR Creative FX 2 marketing page no per-plugin versions.

## Artifacts

- `tmp-fetch/overnight-chip-203/` (RN HTML, KVR packs, PA pages, letimix history, accepted.json, remaining-structured.json)
- Playbooks: softube/air/arturia/u-he/plugin-alliance/spl touch-ups recommended in same spirit as prior rounds
- Export: `out/catalog.json`
- `REMAINING-UNKNOWNS.md` regenerated

## Totals

| metric | before | after |
|---|---:|---:|
| accepted | 2624 | **2644** |
| unknown | 203 | **183** |
| Δ accepted | | **+20** |


## Confidence backfill

Re-ran `backfill_confidence.py` after accepts. Softube RN / LetiMix / PA product-page accepts stay green (~88–92). Listento-MIDI lands yellow (60) because source_url is the LISTENTO KVR page.
