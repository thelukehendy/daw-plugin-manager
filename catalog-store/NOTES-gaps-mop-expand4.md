# NOTES — gaps mop expand4 (overnight)

**When:** 2026-09-10 ~3:32→3:38 AM PT (2026-09-10T10:32–10:38Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Honest reclass only. Dual Mac≠Win → leave + document (no unilateral stamp). Image-Line/Steinberg daw-bundled only with public evidence. Zero trust. No git clone.

## Headline

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 533 | **533** | 0 |
| Plugins (universe) | 6264 | **6264** | 0 |
| Accepted currents | 4489 | **4489** | **+0** |
| True plugin gaps | 556 | **553** | **−3** |
| Of which Airwindows intentional | 512 | **512** | 0 |
| **Non-AW actionable gaps** | **44** | **41** | **−3** |
| Green ≥85 | 2912 | **2942** | (+30 from concurrent raise-16) |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 | 1521 | **1491** | (−30 from raise-16) |

## Reclass (−3 true gaps)

| plugin_id | identity_kind | evidence |
|---|---|---|
| `steinberg--halion-sonic-7-collection` | **soundset** | Content/library pack for HALion Sonic 7 — not discrete installer |
| `steinberg--lm-9` | **discontinued** | Legacy Cubase-bundled drum machine; incompatible post-SX2 |
| `steinberg--nanologue` | **hub_app** | iOS Retrologue-lite app; not desktop DAW plugin |

## Documented Mac≠Win / leave (no stamp)

### Boz Digital Labs (11) — platform dual in notes
Homepage confirms Pan Knob 2 Mac **2.1.1** ≠ Win **2.0.8**. All 11 remain `plugin` gaps with `notesForUser` stating dual — **do not unilateral stamp**.

`big-clipper-2`, `le-snappet`, `manic-compressor`, `mongoose-2`, `pan-knob-2`, `panipulator`, `panther-stereo-manipulation`, `recoil`, `t-bone-2`, `the-hoser-xt-2`, `width-knob`

### Image-Line leftovers (5) — no daw-bundled invent
| plugin_id | action |
|---|---|
| `drumaxx` / `morphine` / `toxic-biohazard` | Mac≠Win leave + notes |
| `dx10` / `simsynth-live` | No verwin — leave + notes; do **not** stamp FL **26.1.6** |

### Accentize (2)
`dialogueenhance`, `prefet` — Mac≠Win leave + notes (product pages silent/404).

## Unchanged portal / dual (already noted)

| Stuck class | ids |
|---|---|
| Mac≠Win | audified×4; line-6×4; madrona×3; sonnox×4; sound-radix×2; wa-production--pumper-stereo-image |
| Portal | mpegh--mpeg-h-renderer; pitchinnovations--groove-shaper-lite; ssl--ssl-meter-pro; ik-multimedia--clavitube, tonex-standard |

## Remaining non-AW true plugin gaps (**41**)

```
accentize--dialogueenhance
accentize--prefet
audified--multi-drive-pedal
audified--multidrive-pedal-le
audified--multidrive-pedal-pro
audified--toneknob-sssniper
boz-digital--big-clipper-2
boz-digital--le-snappet
boz-digital--manic-compressor
boz-digital--mongoose-2
boz-digital--pan-knob-2
boz-digital--panipulator
boz-digital--panther-stereo-manipulation
boz-digital--recoil
boz-digital--t-bone-2
boz-digital--the-hoser-xt-2
boz-digital--width-knob
ik-multimedia--clavitube
ik-multimedia--tonex-standard
image-line--drumaxx
image-line--dx10
image-line--morphine
image-line--simsynth-live
image-line--toxic-biohazard
line-6--metallurgy-doom
line-6--metallurgy-modern
line-6--metallurgy-thrash
line-6--pod-farm
madrona-labs--aalto
madrona-labs--kaivo
madrona-labs--virta
mpegh--mpeg-h-renderer
pitchinnovations--groove-shaper-lite
sonnox--fraunhofer-pro-codec
sonnox--oxford-debuzzer
sonnox--oxford-declicker
sonnox--oxford-denoiser
sound-radix--drum-leveler
sound-radix--surfereq-2
ssl--ssl-meter-pro
wa-production--pumper-stereo-image
```

## Artifacts

| Path | Role |
|---|---|
| `NOTES-gaps-mop-expand4.md` | this file |
| `playbooks/{boz-digital,image-line,steinberg,accentize}.md` | updated |
| `HANDOFF-FOR-CURSOR.md` | portal/Mac≠Win list refreshed |
| `out/catalog.json` | re-exported |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
