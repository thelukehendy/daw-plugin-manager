# NOTES — confidence raise 19 (2026-09-10 ~4:06→4:15 AM PT)

Overnight corroboration pass #19. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Focus expand-5 manufacturers still yellow with manufacturer evidence. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope/Initial/Cymatics/LANDR/Overloud hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **19** (yellow→green) |
| Steinberg public downloads / installer filenames @92 | **18** |
| Plugin Boutique / Scaler Music forum @92 | **1** (Scaler 2) |
| Snapshot accepted-current green (≥85) | **3011** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1508** (KVR @60) |
| Accepted currents | **4575** |

*This run’s corroboration delta is **+19 green / −19 yellow**. Live bands at start (raise-18 close / brief): green **2992** / amber **56** / yellow **1527** / accepted **4575**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| steinberg | **18** | `o.steinberg.net` public Application Installer filenames + Version History PDFs | **92** |
| plugin-boutique | **1** | Scaler Music forum “CURRENT VERSION: 2.9.1” (public per-title, not account) | **92** |

## Breakdown of raises

### steinberg (+18)

Public download pages (not Download Assistant login):

| plugin_id | version | Evidence |
|---|---|---|
| `steinberg--halion-7` | **7.5.0** | `Halion_7.5_Installer_*` Aug 4 2026 + `Version_History_HALion_7.5.0_en.pdf` (matches KVR 7.5.0.1153) |
| `steinberg--halion-sonic-7` | **7.5.0** | `Halion_Sonic_7.5_Installer_*` + shared 7.5.0 PDF |
| `steinberg--halion-sonic-se` | **3.5.10** | `HALion_Sonic_SE_3.5.10_Installer_*` exact |
| `steinberg--backbone` | **1.6.20** | `Backbone_1.6.20_Installer_*` (matches KVR 1.6.20.1076) |
| `steinberg--groove-agent-6` | **6.0.30** | `GrooveAgent_Application_6.0.30_Installer_*` (matches KVR 6.0.30.1098) |
| `steinberg--dorico-pro` | **6.2.30** | `Dorico_6.2.30_Installer_*` exact |
| `steinberg--dorico-elements` | **6.2.30** | shared Dorico 6.2.30 installer line |
| `steinberg--nuendo` | **15.0.30** | `Nuendo_15.0.30_Installer_*` exact |
| `steinberg--cubase-pro-15` | **15.0.30** | `Cubase_15.0.30_Installer_*` exact |
| `steinberg--cubase-artist-15` | **15.0.30** | shared Cubase 15.0.30 line |
| `steinberg--cubase-elements-15` | **15.0.30** | shared Cubase 15.0.30 line |
| `steinberg--spectralayers-13-pro` | **13.0.20** | `SpectraLayers_13.0.20_Installer_*` (newer than KVR **13.0.0**) |
| `steinberg--spectralayers-13-elements` | **13.0.20** | shared SpectraLayers 13.0.20 line |
| `steinberg--wavelab-pro-13` | **13.0.30** | `WaveLab_13.0.30_Installer_*` (newer than KVR **13.0.20**) |
| `steinberg--wavelab-elements-13` | **13.0.30** | shared WaveLab 13.0.30 line |
| `steinberg--wavelab-cast` | **2.0.50** | `WaveLab_Cast_2.0.50_Installer_*` exact |
| `steinberg--vst-connect-pro` | **5.6.10** | VST Connect SE/Pro **5.6.10** Full Installer exact |
| `steinberg--vst-live-pro-3` | **3.0.60** | `VST_Live_3.0.60_Installer_*` (newer than KVR **3.0.40**) |

### plugin-boutique (+1)

- `plugin-boutique--scaler-2` **2.9.1** — https://forum.scalermusic.com/t/scaler-2-latest-version-updates/3542 “CURRENT VERSION: 2.9.1”. PB Help changelog tops at 2.9.0; forum is public manufacturer confirmation matching KVR. Not account-walled.

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| ignite-amps PTEq-1a | Not on homepage freeware table (only PTEq-X **1.1.1**); no live manufacturer download for 1a |
| xln-audio AD1 / Custom / Custom XL / XO Lite / Life DAW Recorder | Not named on paginated `release_notes` (AD2/Keys/Trigger/XO/Life/DB-30/RC-20/DS-10 only) |
| plugin-boutique other 16 | No public per-title changelog (account My Products only). Scaler EQ / BigKick / Carbon Electra / etc. marketing-only |
| ml-sound-lab 9 | Marketing home thin / account portal — no public per-SKU semver |
| stl-tones 6 | ToneHub/AmpHub marketing — no public per-SKU semver |
| modartt 5 | Account portal; marketing “Pianoteq 9” only. Forum admin confirmed through **9.2.1**; KVR **9.2.4** — do not stamp third-party mirrors |
| fractal-audio | **0** yellow (software editors already @92); hardware untouched |
| wa-production 49 | Re-fetched Update logs: **0** exact. 40 no Update-log / soft404; 8 mfr_older (combustor/imperfect/instacomposer-2/loop-engine-2/midiq/multibender/put-me-on-drums/the-king); pumper-2 contaminated by Pumper 3.x log |
| steinberg leftovers 17 | Padshop 2 / Retrologue download pages installer-empty; VST Live Elements ≠ Pro 3; Karlette/mGuitar/Model-E/Neon/VB-1/Sequel/Omnivocal/RND Portico/Yamaha Vintage / Halion Sonic SE already raised — remaining are legacy/unsupported or no public installer match. Do **not** invent daw-bundled |
| image-line 30 | Do **not** stamp FL Studio **26.x** onto discrete plugs (no public per-title receipt) |
| boz-digital 20 | Product pages marketing-only; no public CDN/version. KVR already Win=Mac — still yellow without manufacturer corroboration. Mac≠Win gaps remain unstamped |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope / Initial / Cymatics / LANDR / Overloud | Skipped per brief |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3011** / amber **56** / yellow **1508**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| wa-production | 49 |
| image-line | 30 |
| boz-digital | 20 |
| steinberg | 17 |
| plugin-boutique | 16 |
| ml-sound-lab | 9 |
| stl-tones | 6 |
| modartt | 5 |
| xln-audio | 5 |
| ignite-amps | 1 |
| fractal-audio | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-19.md` (this file)
- `playbooks/{steinberg,plugin-boutique,wa-production,ignite-amps,xln-audio,ml-sound-lab,stl-tones,modartt,boz-digital,image-line}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
