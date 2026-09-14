# NOTES — gaps mop expand6 (non-AW true plugin gaps)

**When:** 2026-09-10 ~4:25→4:32 AM PT (2026-09-10T11:25–11:32Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Zero trust. Never invent. Dual Mac≠Win / portal → leave + document (no unilateral stamp). Prefer reclass soundset/hardware/discontinued when honest. Chip audiority/cfa leftovers only if public. No git clone.

## Context

User baseline after version-chip expand-6: **559 / 6887 / 4811**; green **3220** / yellow **1535**; **non-AW true gaps 50** (boz 11, IL 5, audified 4, audiority 4, line-6 4, sonnox 4, cfa 3, madrona 3, …).

## Headline

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 559 | **559** | 0 |
| Plugins (universe) | 6887 | **6887** | 0 |
| Accepted currents | 4811 | **4811** | 0 (classify-only this mop) |
| True plugin gaps | 562 | **556** | **−6** |
| Of which Airwindows intentional | 512 | **512** | 0 |
| **Non-AW true gaps** | **50** | **44** | **−6** |

Export: `out/catalog.json` — 559 mfrs, 6887 plugins, **4811** with accepted `latestVersion`; **1721** with non-default `identityKind`.

## Reclass (+6 honesty; −6 non-AW gaps)

| plugin_id | was | → identity_kind | Evidence |
|---|---|---|---|
| `audiority--pills-1-metal-leads` | plugin | **soundset** | Kontakt library (KVR/Rekkerd: NKI sample pack) |
| `audiority--pills-2-synth-strings` | plugin | **soundset** | Kontakt library (Pills series) |
| `audiority--marimbula` | plugin | **soundset** | Kontakt library (bass kalimba samples) |
| `audiority--the-modular-piano` | plugin | **soundset** | Kontakt library (27 NKI) |
| `cfa-sound--dc-zero-vintage-synth` | plugin | **soundset** | Kontakt instrument (requires full Kontakt 6+) |
| `cfa-sound--warp-acid-bass-rack` | plugin | **expansion** | Ableton Live Instrument Rack + MIDI (not VST/AU/AAX) |

`notes_for_user` set on each row explaining why there is no `latestVersion`.

## Chip attempts (audiority / cfa leftovers)

| Target | Result |
|---|---|
| Audiority Plugin Versions table | **0** leftovers present (Marimbula / Pills / Modular Piano absent — expected once reclassed as Kontakt soundsets) |
| CFA Grip | KVR `verwin` **1.01b**; Resonance changelog Mac **1.01c** Catalina path vs Win **1.01** — **Mac≠Win leave** |
| CFA DC-Zero / WARP | No plugin installer semver (Kontakt / Ableton rack) → reclass above |

## Explicit skips / leave (remaining **44** — do not unilateral stamp)

| Class | Count | notes |
|---|---:|---|
| Boz Digital Mac≠Win / marketing-only | 11 | homepage dual e.g. Pan Knob 2 Mac≠Win |
| Image-Line Mac≠Win / no per-title | 5 | do **not** stamp FL Studio version onto discrete plugs |
| Audified Mac≠Win | 4 | KVR dual |
| Line 6 Mac≠Win / account | 4 | Metallurgy + POD Farm |
| Sonnox Mac≠Win | 4 | Restore CSV dual |
| Madrona Labs Mac≠Win | 3 | downloads Mac≠Win |
| Accentize Mac≠Win | 2 | product pages silent/404 |
| Sound Radix Mac≠Win | 2 | downloads dual |
| IK Multimedia portal / beta ambiguity | 2 | Clavitube dual; TONEX Standard beta-in-verwin |
| Portal / hub singles | 4 | mpegh, pitchinnovations groove-shaper-lite, ssl-meter-pro, modartt pianoteq-demo |
| CFA Grip Mac≠Win | 1 | 1.01b vs 1.01c |
| UA C-Suite C-Max mismatch | 1 | leave |
| WA Production Mac≠Win | 1 | pumper-stereo-image |

## Remaining non-AW true plugin gaps (**44**)

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
cfa-sound--grip-valve-drive-compressor
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
modartt--pianoteq-demo
mpegh--mpeg-h-renderer
pitchinnovations--groove-shaper-lite
sonnox--fraunhofer-pro-codec
sonnox--oxford-debuzzer
sonnox--oxford-declicker
sonnox--oxford-denoiser
sound-radix--drum-leveler
sound-radix--surfereq-2
ssl--ssl-meter-pro
universal-audio--uad-c-suite-c-max
wa-production--pumper-stereo-image
```

## Artifacts

| Path | Role |
|---|---|
| `NOTES-gaps-mop-expand6.md` | this file |
| `playbooks/{audiority,cfa-sound}.md` | updated |
| `HANDOFF-FOR-CURSOR.md` | Mac≠Win/portal leave + chip section |
| `STATUS.md` | headline refresh |
| `out/catalog.json` | re-exported |
| `tmp-fetch/gaps-mop-expand6/` | HTML caches |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
