# NOTES — gaps mop expand-2 (54 → 15)

**When:** 2026-09-10 ~2:35 AM PT (2026-09-10T09:35Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Public product / downloads / release notes / KVR Product Version only. Dual Mac≠Win → skip. Zero trust. No git clone. No Alliance Manager / Product Manager / Avid Link / SSL DM stamps.

## Headline

| Metric | Before (expand-2 chip) | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 508 | **508** | 0 |
| Plugins (universe) | 5091 | **5091** | 0 |
| Accepted currents | 4039 | **4050** | **+11** |
| Without version | 1052 | **1041** | −11 |
| True plugin gaps (`identity_kind=plugin`) | **54** | **15** | **−39** |
| Green ≥85 | 2606 | **2680** | (live band after mop; this pass +3 green accepts @88–90) |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow &lt;70 (KVR@60) | 1377 | **1314** | (live band after mop; this pass +8 yellow accepts @60) |

Export: `out/catalog.json` — 508 mfrs / 5091 plugins / **4050** with `latestVersion` / **1174** with non-default `identityKind`.

## Accepts (+11)

| plugin_id | version | conf | source |
|---|---|---:|---|
| `glitchmachines--skein` | **1.0.0** | 90 | product page `USER GUIDE - Version 1.0.0` |
| `analog-obsession--comper` | **1.1** | 88 | AO Patreon post (official distribution) `VERSION 1.1` + Mac/Win installers |
| `unfiltered-audio--battlefx` | **1.0.2** | 60 | KVR verwin Win=Mac |
| `unfiltered-audio--renoun-reverb` | **1.1.6** | 60 | KVR verwin (Reason Rack Extension) |
| `unfiltered-audio--yoko-band-splitter` | **1.0.1** | 60 | KVR verwin (Reason Rack Extension) |
| `unfiltered-audio--unfiltered-audio-dent` | **1.0** | 88 | Twin of PA Legacy Dent gen-1; then reclass discontinued → Dent 2 |
| `ik-multimedia--arc-x-software` | **2.0.2** | 60 | KVR verwin Win=Mac |
| `ik-multimedia--hammond-b-3x` | **1.3.5** | 60 | KVR verwin Win=Mac |
| `ik-multimedia--sunset-sound-studio-reverb-ii` | **1.0.2** | 60 | KVR verwin Win=Mac |
| `ik-multimedia--tonex-max` | **1.12.1** | 60 | KVR Product Version Win=Mac |
| `ik-multimedia--tonex-se` | **1.12.1** | 60 | KVR Product Version Win=Mac |

## Reclass (29) — no invented versions

| plugin_id | identity_kind | note |
|---|---|---|
| `xhun-audio--analog-fists` | **expansion** | LittleOne preset expansion (soundware) |
| `sonible--smart-eq` | **gen_ambiguous** | → `smart-eq-4` (slug redirects; do not stamp EQ4) |
| `toneboosters--tb-sibalance-v3` | **discontinued** | → `tb-sibalance-v4`; KVR dual 3.1.8/3.3.0 skipped |
| `tal-software--tal-flanger` / `tal-phaser` / `tal-tube` | **discontinued** | Not on current TAL catalog; KVR dual 1.0/1.0.1 skipped |
| `ik-multimedia--hardcore` / `nanotube` | **soundset** | SampleTank presets — do not stamp 4.0.9 |
| `ik-multimedia--vocalive` | **hub_app** | iOS vocal app, not desktop DAW plugin |
| `ik-multimedia--arc-4-software` | **gen_ambiguous** | → `arc-x-software` (arc4 URL redirects) |
| `unfiltered-audio--g8-dynamic-gate` | **gen_ambiguous** | Duplicate of `unfiltered-audio--unfiltered-audio-g8` @1.6.2 (PA twin) |
| `unfiltered-audio--unfiltered-audio-dent` | **discontinued** | → Dent 2 (after accepting gen1 1.0) |
| `plugin-alliance--uad-bx-digital` / `uad-engl-e646-vs-limited-edition` | **unknown_other** | UAD SKUs misfiled under PA; canonical under `universal-audio--*` |
| `audified--mixchecker` | **gen_ambiguous** | → MixChecker Pro; Mac≠Win dual skip |
| Audified ×14 (AmpLion Free/Rock Essentials, DW Drum, GK LE, inTone×4, Linda RockStack, MultiCabinet, SpeakUp, ToneSpot×2, VocalMint) | **discontinued** | KVR discontinued and/or Mac≠Win dual |

### Unfiltered-audio vs Plugin Alliance

Canonical PA twins already carry current versions for the retail UA catalog (`plugin-alliance--unfiltered-audio-*` and mirrored `unfiltered-audio--unfiltered-audio-*`). Gap leftovers that were **duplicate identities** were merged/reclassed (`g8-dynamic-gate` → G8; Dent gen1 discontinued → Dent 2). BattleFX / Renoun / Yoko are distinct SKUs (RE / multi-FX) and were versioned from KVR.

## Explicitly skipped (still `plugin` gaps or portal)

| plugin_id | reason |
|---|---|
| `sound-radix--drum-leveler` | Mac 1.2.2 ≠ Win 1.2.1 |
| `sound-radix--surfereq-2` | Mac 2.1.2 ≠ Win 2.1.1 |
| `sonnox--fraunhofer-pro-codec` + Restore trio | Mac≠Win CSV dual (unchanged) |
| `mpegh--mpeg-h-renderer` | Avid Link portal-only |
| `pitchinnovations--groove-shaper-lite` | PT-bundled Lite portal-only |
| `ssl--ssl-meter-pro` | SSL Download Manager only |
| `audified--multi-drive-pedal` / `multidrive-pedal-le` / `multidrive-pedal-pro` / `toneknob-sssniper` | KVR Mac≠Win / ambiguous dual |
| `ik-multimedia--clavitube` | KVR Win 1.0 vs Mac contaminated 4.0.9 |
| `ik-multimedia--tonex-standard` | KVR verwin `1.12.1 (beta 2.0.2)` ambiguous; no clean per-title stamp (Max/SE not mapped) |

## Remaining true plugin gaps (**15**)

1. `audified--multi-drive-pedal`
2. `audified--multidrive-pedal-le`
3. `audified--multidrive-pedal-pro`
4. `audified--toneknob-sssniper`
5. `ik-multimedia--clavitube`
6. `ik-multimedia--tonex-standard`
7. `mpegh--mpeg-h-renderer`
8. `pitchinnovations--groove-shaper-lite`
9. `sonnox--fraunhofer-pro-codec`
10. `sonnox--oxford-debuzzer`
11. `sonnox--oxford-declicker`
12. `sonnox--oxford-denoiser`
13. `sound-radix--drum-leveler`
14. `sound-radix--surfereq-2`
15. `ssl--ssl-meter-pro`

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/gaps-mop-expand2/` | HTML caches, accepted.json, reclass.json |
| `NOTES-gaps-mop-expand2.md` | this file |
| `playbooks/*.md` | updated for touched mfrs |
| `out/catalog.json` | re-exported |
| `STATUS.md` / `HANDOFF-FOR-CURSOR.md` | refreshed |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/status_report.py
python3 src/export_catalog.py
```
