# NOTES — version chip KVR hub-remain (Acustica / NI / iZotope)

Date: 2026-09-10 ~1:47–2:00am PT  
Verified by: coding-assistant  
Method: KVR product pages (`id="verwin"` / Product Version) only for hub-heavy gaps.  
No Aquarius / Native Access / iZotope Product Portal logins (see HUB_WALLED.md).  
No `catalog.json` export this pass.

## Goal

Chip remaining **true plugin** gaps for hub-walled manufacturers via crowdsourced KVR → confidence **60** (yellow), except iZotope manufacturer release notes when available → **92**.

## Before → after (identity_kind = plugin gaps at start)

| manufacturer | gaps at start | attempted | accepted this pass | skipped | still unknown (plugin) |
|---|---:|---:|---:|---:|---:|
| acustica-audio | 134 | 134 | **134** (all KVR@60) | 0 | **0** |
| native-instruments | 26 | 26 | **24** (KVR@60) + 2 parallel* | 2 ambiguous here* | **0** |
| izotope | 35 | 35 | **34** (7 RN@92 + 27 KVR@60) + 1 parallel* | 1 ambiguous here* | **0** |

\* Parallel overnight agent (same window ~08:49Z) accepted the three dual-string KVR pages by taking the **primary** token before parentheses/slash:
- `native-instruments--battery` → **4.3.1** from `4.3.1 (VST3 4.3)`
- `native-instruments--super-8` → **2.1.0** from `2.1.0 (R26)`
- `izotope--the-t-pain-effect` → **1.0.2** from `1.0.2 / 1.74`

This pass **skipped** those three as ambiguous (zero-trust dual-string policy from scrub round 6). Currents now present from the parallel accept; left as-is (not re-litigated).

## Accepts detail

### acustica-audio — +134 @60
- Every gap row already had `notes` with a KVR product URL (`…-by-acustica-audio`).
- Fetched HTML → `tmp-fetch/kvr-hub-chip/products/*.html`; parsed `id="verwin"`.
- Versions look like Acqua/Nebula builds (`3.0.5`, `2.3.5`, `1.4.xxx`, etc.) — per-SKU, not invented.
- Top verwin frequencies: `2.3.5` (44), `3.0.5` (23), `3.0.0` (18) — family-ish but each taken from that SKU’s own page.
- `portal_app='Aquarius'` present on all Acustica plugin rows (manufacturer already `Aquarius`; plugin-level backfill satisfied — concurrent classify also wrote Aquarius @ 08:49:51Z).

### native-instruments — +24 @60 (this pass)
- Public KVR Product Version for Absynth 6, Dirt, Driver, FM8, Guitar Rig Pro **7.0.2**, Massive, Massive X, Raum, Reaktor **6.5.0**, Replika/XT, Solid Mix / Premium Tube / VC / Supercharger family, etc.
- Native Access still hub-walled for installers; KVR is yellow-band only.
- Remaining NI rows without version are mostly **soundset / bundle / discontinued** identity_kinds (universe expansion) — out of scope for this plugin-gap chip.

### izotope — +34 this pass
**Manufacturer release notes @92** (preferred over KVR when page live):

| plugin_id | version | source |
|---|---|---|
| izotope--aurora | 1.1.0 | `/pages/release-notes/aurora` |
| izotope--cascadia | 1.1.0 | `/pages/release-notes/cascadia` |
| izotope--plasma | 1.1.0 | `/pages/release-notes/plasma` |
| izotope--equinox | 1.1.0 | `/pages/release-notes/equinox` |
| izotope--ozone-imager | 2.3.0 | `/pages/release-notes/ozone-imager` |
| izotope--dialogue-match | 1.3.0 | `/pages/release-notes/dialogue-match` |
| izotope--tonal-balance-control | 3.2.0 | `/pages/release-notes/tonal-balance-control` |

**KVR @60** for legacy / long-tail without usable public RN (Alloy, BreakTweaker, Exponential Audio line, Neutron 3 Adv/Std, VocalSynth 2, Audiolens, etc.).  
Skipped here: T-Pain Effect dual Mac/Win-style string (accepted by parallel as 1.0.2).

Product Portal still hub-walled for many current titles — do not grind.

## Skips (this pass policy)

| plugin_id | KVR verwin | reason |
|---|---|---|
| izotope--the-t-pain-effect | `1.0.2 / 1.74` | dual string |
| native-instruments--battery | `4.3.1 (VST3 4.3)` | dual / annotated |
| native-instruments--super-8 | `2.1.0 (R26)` | dual / annotated |

No 404s in this batch (195/195 fetched OK).

## Concurrent note (identity_kind)

During this pass another agent reclassified the 134 Acustica product rows to `identity_kind='suite_component'` (Aquarius ecosystem) and left hub apps (`aquarius`, `n4-player`, …) as `hub_app`. Version currents from this chip remain on those rows. Gap queries that filter `identity_kind='plugin'` will no longer list them — versions still export when identity allows.

## Artifacts

- `tmp-fetch/kvr-hub-chip/fetch-list.json` — 195 targets
- `tmp-fetch/kvr-hub-chip/parsed.json` — verwin parse decisions
- `tmp-fetch/kvr-hub-chip/products/*.html` — fetched KVR HTML + SHA-256 on accept
- `tmp-fetch/kvr-hub-chip/izotope-rn/` — manufacturer RN HTML for the 7 @92
- `tmp-fetch/kvr-hub-chip/accepts.json` / `skips.json`
- Playbooks: `playbooks/acustica-audio.md` (new), `playbooks/native-instruments.md`, `playbooks/izotope.md`

## Accept pattern used

```bash
python3 src/accept_observation.py \
  --plugin-id … --version X.Y.Z \
  --source-url 'https://www.kvraudio.com/product/…' \
  --source-kind other --set-current \
  --extract-method kvr-product-page \
  --evidence-snippet 'id="verwin">X.Y.Z' \
  --content-hash <sha256> \
  --verified-by coding-assistant \
  --confidence 60 \
  --confidence-reason 'KVR product page Product Version (crowdsourced)'
```

iZotope RN variant: `--source-kind releaseNotesPage --extract-method izotope-release-notes --confidence 92`.
