# NOTES — confidence raise 15 (2026-09-10 ~3:19 AM PT)

Overnight corroboration pass #15. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Focus NEW public corroboration: sonible / psp-audioware CDN / acon-digital public / cableguys manuals / hornet banners / rob-papen downloads / overloud CDN leftovers / baby-audio gen-careful / united-plugins+output hub-skip / tracktion public downloads. Zero trust; no invented versions; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope/Initial/Cymatics/LANDR hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **13** (yellow→green) |
| Official PSP CDN installer filenames @88 | **12** |
| Acon public `/software/` installer (newer than KVR) @88 | **1** |
| Snapshot accepted-current green (≥85) | **2869** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1345** (all KVR @60) |
| Accepted currents | **4270** |

*This run’s own corroboration delta is **+13 green / −13 yellow**. Starting bands (raise-14 close): green **2856** / amber **56** / yellow **1358**. After: green **2869** / amber **56** / yellow **1345**. Absolute universe counts may differ from raise-14 STATUS due to concurrent catalog growth (live: manufacturers **533** / plugins **6264**).*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| psp-audioware | **12** | `download-eu2.pspaudioware.net` CDN installer filenames (Mac OSX; Win same semver where listed) | **88** |
| acon-digital | **1** | `acondigital.com/software/ExtractDialogue2_*_2_0_8` public installer (product page) — newer than KVR **2.0.1** | **88** |

## Breakdown of raises

### PSPaudioware (+12)

Open CDN directory listing + native/OSX installer filenames matching KVR (trailing-zero OK for B-Scanner **1.0**↔**1.0.0**).

| plugin_id | Version | CDN path |
|---|---|---|
| psp-2meters | 2.1.0 | `PSP_2Meters/OSX/PSP_2Meters_2.1.0.dmg` (+ Win `.exe`) |
| psp-b-scanner | 1.0.0 | `PSP_B-Scanner/OSX/PSP_B-Scanner_1.0.0.dmg` |
| psp-classicq | 1.8.0 | `PSP_ClassicQ/OSX/PSP_ClassicQ_1.8.0.dmg` |
| psp-mcq | 1.8.0 | `PSP_McQ/OSX/PSP_McQ_1.8.0.dmg` |
| psp-n2o | 1.0.1 | `PSP_N2O/OSX/PSP_N2O_1.0.1.dmg` |
| psp-nexcellence | 1.0.2 | `PSP_Nexcellence/OSX/PSP_Nexcellence_1.0.2.dmg` |
| psp-retroq | 1.8.0 | `PSP_RetroQ/OSX/PSP_RetroQ_1.8.0.dmg` |
| psp-84 | 1.6.1 | `PSP_84/OSX/native/PSP_84_1.6.1.dmg` |
| psp-85 | 1.1.1 | `PSP_85/OSX/native/PSP_85_1.1.1.dmg` |
| psp-neon-hr | 2.0.4 | `PSP_Neon_HR/OSX/native/PSP_Neon_2.0.4.dmg` |
| psp-nitro | 1.1.2 | `PSP_Nitro/OSX/native/PSP_Nitro_1.1.2.dmg` |
| psp-pianoverb | 1.10.3 | `PSP_PianoVerb/OSX/native/PSP_PianoVerb_1.10.3_macOS.dmg` |

PSP yellow remaining: **3** — psp-pseudostereo, psp-stereoenhancer (StereoPack **1.9.9** bundle installer only — do not suite→component stamp), psp-vintagemeter (Mac `PSP_VintageMeter.dmg` **unversioned**; Win 32-bit `1.0.0` only).

### Acon Digital (+1)

- `acon-digital--extract-dialogue-2` **2.0.8** — product page `acondigital.com/products/extract-dialogue` exposes public Mac/Win trial+full installers `ExtractDialogue2_*_2_0_8` on `/software/` (HEAD 200). Accept manufacturer newer than KVR **2.0.1**.

Acon yellow remaining: **13** — DeEss:Dialogue + all Studio* (no matching public `/software/` installers; account/Zendesk pattern unchanged).

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| sonible 14 | Legacy/learn/smart:EQ 2–3 / smart:comp 2 / smart:reverb slugs **redirect** to learnbundle / smartcomp3 / smarteq4 / smartreverb2 — do not stamp successors. freiraum → homepage Soft404. FAST series Focusrite-branded KVR; no live sonible product page. smart:EQ live 404. |
| cableguys 13 modules/Curve | No per-module Manual PDF on `downloads.cableguys.com` (only ShaperBox 3 + already-raised standalones). Do **not** stamp ShaperBox **3.6.3**. |
| hornet 36 | Remaining pages are marketing-only / Soft404 / **MK2/MK3 redirects** (e.g. `/hornet-magnus-mk2/` → Magnus MK3 **1.1.2**; `/hornet-tape/` → Tape MK2 **2.1.3**; `/hornet-elm128/` → ELM128 MK2 **2.2.2**; multicomp-plus → Plus MK2 **2.1.3**). Angle/Freqs/VCA/3XOver/Dynamics Control/HDS1 MK2/Spaces MK2 lack KVR-matching banners. Do not stamp redirects. |
| rob-papen 35 | `downloads.html` / demo-versions login-oriented; no public per-title installer semver. |
| overloud 20 leftovers | Fuse / TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR libs — CDN naming still 404; do **not** stamp TH-U changelog **2.0.19**. |
| baby-audio 9 | `babyaud.io/downloads` lists current-gen only (Smooth Operator **Pro**, Transit **2**, Comeback **Kid**, BA-1). Yellow leftovers are gen-1 / FX-strip / Magic* — do not stamp Pro/2/Kid onto them. |
| united-plugins 13 | Manager-only public oracle — hub skip. |
| output 11 | Account hub — hub skip; no public product-page semver. |
| tracktion 28 | Product pages marketing-only (no semver). Myth manual placeholder `Myth_1.00.pkg` ≠ KVR **1.63**. F.'em manual placeholder **1.0.0** ≠ KVR **1.3.1**. Downloads/account gated. |
| PSP StereoPack → PseudoStereo/StereoEnhancer | Bundle installer **1.9.9** — suite→component skip (same gate as MixPack). |
| PSP VintageMeter | Unversioned Mac `.dmg`. |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2869** / amber **56** / yellow **1345**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| psp-audioware | 3 |
| acon-digital | 13 |
| sonible | 14 |
| cableguys | 13 |
| hornet | 36 |
| rob-papen | 35 |
| overloud | 20 |
| baby-audio | 9 |
| united-plugins | 13 |
| output | 11 |
| tracktion | 28 |

## Playbook / doc updates

- `NOTES-confidence-raise-15.md` (this file)
- `playbooks/psp-audioware.md` — CDN directory listing + `*/OSX/native/` method
- `playbooks/acon-digital.md` — Extract:Dialogue 2 public `/software/` 2.0.8
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
