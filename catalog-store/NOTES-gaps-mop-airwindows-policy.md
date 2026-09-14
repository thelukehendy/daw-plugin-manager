# NOTES — gaps mop + Airwindows policy

**When:** 2026-09-10 ~3:02 AM PT (2026-09-10T10:02Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Public product / KVR Product Version only. Dual Mac≠Win → skip. Zero trust. No git clone. No hub stamps.

## Headline

| Metric | Before (expand-3 chip) | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 520 | **520** | 0 |
| Plugins (universe) | 5960 | **5960** | 0 |
| Accepted currents | 4268 | **4270** | **+2** |
| Without version | 1692 | **1690** | −2 |
| True plugin gaps (`identity_kind=plugin`) | **550** | **535** | **−15** |
| Of which Airwindows (intentional) | 512 | **512** | 0 |
| **Actionable true gaps (excl. Airwindows)** | **~38** | **23** | **−15** |

Export: `out/catalog.json` — 520 mfrs / 5960 plugins / **4270** with `latestVersion` / **1306** with non-default `identityKind`.

## A) Airwindows policy (locked)

| Rule | Detail |
|---|---|
| Versioned SKU | **Only** `airwindows--airwindows-consolidated` = **`2026-09-05-2a6d1c0`** (GitHub `baconpaul/airwin2rack` tag `DAWPlugin`) |
| Individuals | **512** algorithms stay **unversioned on purpose** — date-stamped standalone zips, no per-SKU semver |
| `identity_kind` | Keep **`plugin`** (standalones still ship). Do **not** mass-reclass `suite_component` unless a title is clearly Consolidated-only |
| Electron UX | Show Consolidated `latestVersion` + `notesForUser` + `isFreeware`; **never invent** per-SKU versions from Consolidated |
| Prefer | `notes_for_user` + CTA/portal toward Consolidated over mass reclass |

See also `NOTES-airwindows-ssl-chip.md`, `playbooks/airwindows.md`.

## B) Accepts (+2)

| plugin_id | version | conf | source |
|---|---|---:|---|
| `wa-production--chords-pro-notes` | **1.0.0** | 60 | KVR Win=`1.0.0` = Mac=`1.0.0` |
| `native-instruments--solid-eq-solid-mix-series` | **1.4.11** | 60 | KVR Win=Mac `1.4.11` (matches Solid Bus Comp / Solid Dynamics) |

## C) Reclass (+13) — no invented versions

### WA Production soundset ×11

`drum-and-bass-jumbo`, `dubstep-salvation`, `edm-assault`, `future-edm-energy`, `future-pop-mystic`, `mantra`, `melodic-dragon`, `og-series-unkwn`, `riddim-dubstep-ammo`, `riddim-riot-by-yuja`, `synthwave-arcade` → **`soundset`** (construction kits / sample packs on waproduction.com Sounds).

**Not reclassed as soundset (true plugins):**

- `chords-pro-notes` — MIDI plugin → accepted above  
- `pumper-stereo-image` — stereo imaging plugin → left (Mac≠Win)

### Positive Grid ×2

| plugin_id | identity_kind | note |
|---|---|---|
| `positive-grid--omnyss` | **expansion** | BIAS FX 2 content collection |
| `positive-grid--bias-amp-2` | **discontinued** | No longer for sale; User Center only; successor `positive-grid--bias-x` |

## D) Left as true plugin gaps (23 excl. Airwindows)

| Class | plugin_ids |
|---|---|
| Mac≠Win dual | audified MultiDrive×3 + ToneKnob Sssniper; line-6 Metallurgy×3 + POD Farm; madrona Aalto/Kaivo/Virta; sonnox×4; sound-radix Drum Leveler / SurferEQ2; wa `pumper-stereo-image` |
| Portal / hub | mpegh MPEG-H Renderer (Avid Link); groove-shaper-lite (Avid Link); ssl-meter-pro (SSL DM); IK ClaviTube / TONEX Standard (IK Product Manager) |

Notes / `portal_app` refreshed where missing. No invented versions.

## Electron reminders

1. Airwindows individuals without `latestVersion` are **policy**, not unfinished chips — suppress “needs version” grind; surface Consolidated + freeware notes.  
2. Dual Mac≠Win rows: dual-platform notice, no unilateral OS pick.  
3. Portal-only: CTA via `portalApp` only.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/gaps-mop-airwindows/` | KVR/product HTML caches |
| `NOTES-gaps-mop-airwindows-policy.md` | this file |
| `playbooks/{airwindows,wa-production,positive-grid,native-instruments,line-6,madrona-labs}.md` | appends |
| `out/catalog.json` | re-exported |
| `STATUS.md` / `HANDOFF-FOR-CURSOR.md` | refreshed |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/status_report.py
python3 src/export_catalog.py
```
