# NOTES — confidence raise 20 (2026-09-10 ~4:25→4:32 AM PT)

Overnight corroboration pass #20. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Focus: Audiority Plugin Versions yellows; calf/x42/guitarix green check; WA Update logs; Steinberg leftovers; NI/image-line **public only**; skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope mega hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **9** (yellow→green) |
| Steinberg CDN Version History + installer filenames @92 | **2** |
| Native Instruments public Official update status @92 | **7** |
| Snapshot accepted-current green (≥85) | **3229** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1526** (KVR @60) |
| Accepted currents | **4811** (unchanged count; raises replace currents) |

*This run’s corroboration delta is **+9 green / −9 yellow**. Live bands at start (expand-6 close): green **3220** / amber **56** / yellow **1535** / accepted **4811**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| native-instruments | **7** | Public NI community “Official update status” threads (not Native Access) | **92** |
| steinberg | **2** | Live `download.steinberg.net` Version History PDFs + Installer filenames (HEAD 200) | **92** |

## Breakdown of raises

### steinberg (+2)

Dedicated Padshop 2 / Retrologue download pages still installer-empty (Download Assistant CTA). Manufacturer CDN still hosts installers + Version History PDFs:

| plugin_id | version | Evidence |
|---|---|---|
| `steinberg--padshop-2` | **2.3.0** | `Version_History_Padshop_2_3_0.pdf` title **Padshop 2.3.0** (2026-03-12) + `Padshop_2.3_Installer_{mac.dmg,win64.zip}` HEAD 200 (matches prior KVR 2.3.0.1062) |
| `steinberg--retrologue` | **2.5.0** | `Version_History_Retrologue_2_5_0.pdf` title **Retrologue 2.5.0** (2026-03-12) + `Retrologue_2.5_Installer_{mac.dmg,win64.zip}` HEAD 200 (matches prior KVR 2.5.0.1062) |

### native-instruments (+7)

Public community Official update status (manufacturer-staff threads; not account portal):

| plugin_id | version | Evidence URL |
|---|---|---|
| `native-instruments--kontakt` | **8.13.0** | discussion/39 … current version: 8.13.0 |
| `native-instruments--maschine` | **3.6.0** | discussion/40 … Maschine 3 current 3.6.0 |
| `native-instruments--komplete-kontrol` | **3.5.4** | discussion/55 … KK current 3.5.4 |
| `native-instruments--guitar-rig-pro` | **7.0.2** | discussion/53 … Guitar Rig 7 current 7.0.2 |
| `native-instruments--reaktor` | **6.5.0** | discussion/56 … Reaktor current 6.5.0 |
| `native-instruments--massive-x` | **1.7.0** | discussion/54 … Massive X current **1.7.0** (manufacturer supersedes prior KVR **1.7.1**) |
| `native-instruments--absynth-6` | **6.1** | discussion/49105 … Absynth 6 current **6.1** (was KVR 6.1.0) |

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| Audiority 13 yellow | **Not on** https://www.audiority.com/plugin-versions/ Curr Version table (Dr Drive, freeware pedals, TS-1, Epic Pig, Harshness, L12X, Side Filter, …). Leave KVR@60 |
| calf / x42 / guitarix | **Already all green** (44 / 24 / 13 @90) — no work |
| wa-production 49 | Re-fetched Update logs: **0** exact vs KVR. Soft404×12; mfr_older logs (combustor/imperfect/instacomposer-2/loop-engine-2/midiq/multibender/the-king); pumper-2 contaminated by Pumper 3.x |
| steinberg leftovers 15 | Padshop Pro / VST Live Elements ≠ Pro 3; Karlette/mGuitar/Model-E/Neon/VB-1/Sequel/Omnivocal/RND Portico/Yamaha Vintage / V-Stack — legacy/unsupported or no public installer match. Do **not** invent daw-bundled |
| image-line 30 yellow + 5 gaps | Do **not** stamp FL Studio **26.x** onto discrete plugs (no public per-title receipt) |
| NI Players / other yellows | Kontakt Player **8.0.0** / Reaktor Player **6.4.3** / Massive X Player **1.6.0** ≠ full product Official threads — leave. Effects Series / Battery / FM8 / etc. — no matching public Official update status found this pass |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope | Skipped per brief (mega hubs) |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3229** / amber **56** / yellow **1526**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| wa-production | 49 |
| image-line | 30 |
| native-instruments | 26 |
| boz-digital | 20 |
| steinberg | 15 |
| audiority | 13 |

## Playbook / doc updates

- `NOTES-confidence-raise-20.md` (this file)
- `playbooks/{steinberg,native-instruments,wa-production,audiority,calf,x42,guitarix}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
