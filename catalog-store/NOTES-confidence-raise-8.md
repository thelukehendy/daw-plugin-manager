# NOTES — confidence raise 8 (2026-09-10 ~2:00 AM PT)

Overnight corroboration pass #8. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Cap effort: meaningful batch, not infinite grind.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **29** (yellow→green) |
| Manufacturer product-page banner @92 | **17** (HoRNet) |
| Manufacturer changelog shared-version @90 | **8** (Kilohearts) |
| Manufacturer user-guide PDF @90 | **4** (Voxengo) |
| Snapshot accepted-current green (≥85) | **2416** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1115** (includes concurrent universe/KVR fills + this chip’s 12 Slate@60) |

*Band totals moved from concurrent overnight fills as well; this run’s own delta is **+29 green / −29 yellow** from corroboration, plus **+12 yellow** Slate gap fills (Goal A, separate notes).*

## Breakdown of raises

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| HoRNet | **17** | `hornetplugins.com/plugins/{slug}/` version banners matching KVR | **92** |
| Kilohearts | **8** | `kilohearts.com/changelog` + Installer **2.4.6** (shared codebase) | **90** |
| Voxengo | **4** | Official user-guide PDFs `Version X.Y` header | **90** |

### HoRNet (+17)

Exact KVR match banners only (skipped MK2 redirects onto gen-1 ids: AnalogStage→MK2, TotalEQ→MK2, VHS→MK2, HDS1→MK2, ThirtyOne→MK2, LU Meter→MK2 page for gen-1, homepage Soft404s).

- cassette644 1.0.3, chorus60 1.2.0, clms 1.1.0, deelay 1.4.0, deelay-plus 1.3.1, dyneq 1.1.1, graffio 1.2.0, ha2a 1.1.3, harmonics 1.1.0, harmonics-pro 1.0.1, hcs1 1.1.0, lu-meter-mk2 2.1.2, mbc 1.0.4, spikes 1.1.0, syncpressor 1.0.1, trackshaper 1.2.0, wahwah 1.3.1

Hornet yellow remaining after this pass: **41** (legacy/no banner / successor-redirect contamination risk).

### Kilohearts (+8)

`https://kilohearts.com/changelog`: “All Kilohearts plugins share a code base… same version”; Installer **2.4.6** Mac/Win; section **2.4.6 – March 10, 2026**. Raised KVR@60 currents at 2.4.6:

- carve-eq, compactor, convolver, dynamics, filter-table, phase-plant, shaper-table, slice-eq

Skipped **kHs ONE 1.033** (different product/version line).

### Voxengo (+4)

Official PDFs under `voxengo.com/files/userguides/`:

- BMS **2.7**, CRTIV Chorus **1.5**, CRTIV Reverb **2.4**, CRTIV Shumovick **1.3**

Other yellows (Pristine Space, Analogflux, Radio, Redunoise, …): user-guide URLs 404 / discontinued — left yellow.

## Explicit non-raises (quality)

| Target | Why skipped |
|---|---|
| Slate Digital yellows / hub | Public pages marketing-only; Activate/inMusic gated — Goal A filled via KVR@60 only |
| Cableguys module Shapers / Curve | Still no per-module Manual PDF; do not stamp ShaperBox 3.6.3 |
| Baby Audio leftovers | Trials accordion lacks gen-1 / Magic* / Warp etc. |
| D16 Fazortan/Redoptor/Syntorus/Toraverb gen-1 | Only gen-2 CDN folders |
| Cherry leftovers (Spin, preset packs) | VH 500 / 404 |
| Acon Studio* | Account downloads; no public `/software/` installers |
| Audio Damage current demos | Unversioned zip names on S3 |
| Kazrog Recabinet/Thermionik | Legacy; site points to AmpCraft successors |
| Xfer Serum 2 / LFOTool | Public manual stale (2.0.18) ≠ KVR 2.1.5; account forum for LFOTool |
| Nugen downloads | Site error page |
| HoRNet gen-1←MK2 redirects | AnalogStage, TotalEQ, VHS, HDS1, ThirtyOne, LU Meter gen-1 |

## Export
**Not run** (per brief: Do NOT export catalog.json).

## Playbook / doc updates
- `NOTES-confidence-raise-8.md` (this file)
- `NOTES-version-chip-slate.md`
- `playbooks/slate-digital.md`, `playbooks/hornet.md`, `playbooks/kilohearts.md` (if present), `playbooks/voxengo.md` (create/update)
