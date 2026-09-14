# NOTES — gaps mop expand5 (non-AW true plugin gaps)

**When:** 2026-09-10 ~3:50→3:55 AM PT (2026-09-10T10:50–10:55Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Zero trust. Never invent. Dual Mac≠Win / portal → leave + document (no unilateral stamp). Prefer manufacturer / OAS / downloads; KVR @60 when platforms agree. No git clone.

## Context

User baseline (~3:48 AM PT) listed **111** non-AW true gaps prioritizing ignite-amps / plugin-boutique / ml-sound-lab / xln / stl / modartt / sample-magic / etc. Those manufacturers were already stamped in **version-chip expand 5** (`NOTES-version-chip-expand-5.md`, +74 → accepted **4571**, non-AW gaps **45**). This mop chips the remaining **actionable** leftovers only.

## Headline

| Metric | Before (STATUS / expand-5) | After | Δ |
|---|---:|---:|---:|
| Manufacturers | 549 | **549** | 0 |
| Plugins (universe) | 6490 | **6490** | 0 |
| Accepted currents | 4571 | **4575** | **+4** |
| True plugin gaps | 557 | **553** | **−4** |
| Of which Airwindows intentional | 512 | **512** | 0 |
| **Non-AW true gaps** | **45** | **41** | **−4** |
| Green ≥85 | 2974 | **2983** | (+9; **+1** this pass Monique @95; remainder concurrent raise) |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 | 1541 | **1536** | (−5 net; **+3** this pass KVR@60 offset by concurrent raises) |

Export: `out/catalog.json` — 549 mfrs, 6490 plugins, **4575** with accepted `latestVersion`.

## Newly accepted (+4)

| plugin_id | version | conf | source_kind | source_url |
|---|---|---:|---|---|
| `surge-synthesizer--monique-monosynth` | **1.2.0** | **95** | vendorFeed | https://open-audio-stack.github.io/open-audio-stack-registry/plugins/surge-synthesizer/monique-monosynth/index.json |
| `surge-synthesizer--b-step-sequencer` | **2.1** | **60** | other (KVR) | https://www.kvraudio.com/product/b-step-sequencer-by-surge-synth-team |
| `audiothing--magical-toy-keyboard` | **1.0** | **60** | other (KVR) | https://www.kvraudio.com/product/magical-toy-keyboard-by-audiothing |
| `headrush--revalver` | **5.1.2** | **60** | other (KVR) | https://www.kvraudio.com/product/revalver-by-headrush |

### Evidence notes

1. **Monique** — OAS registry `version: "1.2.0"`; KVR Win=Mac=Linux **1.2** corroborates. GitHub `releases/tag/Nightly` only. Set `isFreeware=1`. Twin `oas--surge-synthesizer-monique-monosynth` already @1.2.0.
2. **B-Step** — KVR Win=Mac=Linux **2.1**. GitHub Nightly-only. Twin `oas--surge-synthesizer-b-step` uses nightly installer date **2024.7.28** (left on OAS track; this SKU stamped KVR stable listing per Shortcircuit pattern). Set `isFreeware=1`.
3. **Magical Toy Keyboard** — Product page 404; absent from audiothing.net/plugin-updates. KVR Win=Mac **1.0** (same Toys pattern as Toy Bars/Marimba/Piano).
4. **ReValver** — Prior expand-5 skip treated KVR strings as Mac≠Win dual. Re-read: Product Version **5.1.2** leads both Win and Mac; `(AU 4.5.1)` / `(VST3 1.0.0)` are format modules. Manufacturer SPA silent; hardware downloads page only.

## Explicit skips (unchanged — do not unilateral stamp)

All remaining **41** non-AW true gaps are documented leave/portal from expand4 + prior:

| Class | Count | ids / notes |
|---|---:|---|
| Boz Digital Mac≠Win | 11 | homepage dual e.g. Pan Knob 2 Mac 2.1.1 ≠ Win 2.0.8 |
| Image-Line Mac≠Win / no verwin | 5 | do **not** stamp FL Studio version |
| Audified Mac≠Win | 4 | KVR dual |
| Line 6 Mac≠Win | 4 | Metallurgy + POD Farm |
| Sonnox Mac≠Win | 4 | Restore CSV dual |
| Madrona Labs Mac≠Win | 3 | downloads Mac 1.9.5 ≠ Win 1.9.4/1.9.3 |
| Accentize Mac≠Win | 2 | product pages silent/404 |
| Sound Radix Mac≠Win | 2 | downloads dual |
| IK Multimedia portal | 2 | Clavitube / TONEX Standard |
| Portal singles | 4 | mpegh, pitchinnovations groove-shaper-lite, ssl-meter-pro |
| WA Production Mac≠Win | 1 | pumper-stereo-image |

## Already cleared before this mop (expand-5)

ignite-amps 12/12, plugin-boutique 17/17, ml-sound-lab 9 accepted, xln-audio plugin gaps 0, stl-tones 6/6, modartt 5 accepted, sample-magic 4 accepted, thewavewarden leftovers, two-notes GENOME/WoS, fractal-audio software 5 — see `NOTES-version-chip-expand-5.md`.

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
| `NOTES-gaps-mop-expand5.md` | this file |
| `playbooks/{surge-synthesizer,audiothing,headrush}.md` | updated |
| `HANDOFF-FOR-CURSOR.md` | chip section appended |
| `STATUS.md` | headline refresh |
| `out/catalog.json` | re-exported |
| `tmp-fetch/gaps-mop-expand5/` | HTML/JSON caches |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
