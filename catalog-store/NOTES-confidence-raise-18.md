# NOTES — confidence raise 18 (2026-09-10 ~3:50 AM PT)

Overnight corroboration pass #18. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope hubs. Raise-17 leftovers mostly exhausted — focused NEW public evidence on non-hub yellows (esp. Neural DSP past-releases, WaveWarden installers, AudioRealism product downloads, SSL Zendesk installer table).

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **17** (yellow→green) |
| Neural DSP past-release titles @92 | **7** |
| WaveWarden installer filenames @88 | **2** |
| AudioRealism product installers @88 | **3** |
| SSL Zendesk downloads table / installer filenames @92 | **5** |
| Snapshot accepted-current green (≥85) | **2992** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1527** (KVR @60) |
| Accepted currents | **4575** |

*This run’s corroboration delta is **+17 green / −17 yellow** on touched SKUs. Live bands at start of this agent (~3:50 AM PT query): green **2974** / amber **56** / yellow **1541** / accepted **4571** (concurrent gaps mop had already moved past raise-17’s 4497/2952/1489). Concurrent gaps mop between STATUS 3:55 snapshot and end of this pass kept accepted **4575**; after our 17 raises: green **2992** / amber **56** / yellow **1527**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| neural-dsp | **7** | `neuraldsp.com/downloads` past-release titles exact-match legacy non-X / Ultra / Nameless / Parallax | **92** |
| thewavewarden | **2** | Official trial/free installer filenames on product pages | **88** |
| audiorealism | **3** | Public product-page `/downloads/*Installer-*-X.Y.Z*.zip` | **88** |
| ssl | **5** | Support article SSL Plug-in Downloads table + S3 installer filenames | **92** |

## Breakdown of raises

### neural-dsp (+7) — https://neuraldsp.com/downloads

Exact past-release title match (do **not** stamp X-gen currents onto these SKUs):

- `neural-dsp--archetype-cory-wong` **2.0.1** — `Archetype: Cory Wong > Version 2.0.1 - May 17th, 2023`
- `neural-dsp--archetype-nolly` **2.0.2** — `Archetype: Nolly > Version 2.0.2 - June 8th, 2023`
- `neural-dsp--archetype-plini` **2.0.3** — `Archetype: Plini > Version 2.0.3 - August 2nd, 2023`
- `neural-dsp--archetype-rabea` **1.0.1** — `Archetype: Rabea > Version 1.0.1 - April 6th, 2023`
- `neural-dsp--darkglass-ultra-plugins` **3.0.1** — `Darkglass Ultra > Version 3.0.1 Ultra (Legacy) - July 12th, 2023`
- `neural-dsp--fortin-nameless-suite` **3.0.2** — `Fortin Nameless Suite > Version 3.0.2, June 20th, 2023`
- `neural-dsp--parallax` **2.0.2** — `Parallax > Version 2.0.2 - June 8th, 2023`

### thewavewarden (+2)

- `thewavewarden--spline-wavetable-synthesizer` **1.1.1** — `SplineSynthWindows-TRIAL-v1.1.1.exe` / `SplineTrial1.1.1MacInstaller.pkg` (+ Linux) on https://thewavewarden.com/pages/spline-wavetable-synthesizer
- `thewavewarden--filter-force` **1.0.4** — page text “Download Filter Force Free 1.0.4”; `FilterForce1.0.4WinInstallerFree.exe` / `FilterForceFree1.0.4MacInstaller.pkg` on https://thewavewarden.com/pages/filter-force-free (catalog SKU is Filter Force Free line; Pro page has no public semver)

### audiorealism (+3)

- `audiorealism--audiorealism-bass-line-3-abl3` **3.3.5.2** — `ABL3x-Installer-Mac-3.3.5.2.zip` + Win `…-3.3.5.2-1.zip`
- `audiorealism--audiorealism-semi-modular-x` **1.6.0.1** — `ASM1x-Installer-Mac/WIN-1.6.0.1.zip`
- `audiorealism--redominator` **1.5.2.2** — `redominator1x-installer-mac-1.5.2.2.zip` + Win signed zip

### ssl (+5) — https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads

- `ssl--ssl-4k-g` **1.3.1** — table `4K G v1.3.1 (sonible add-on)` + Mac installer `…v1.3.1…`
- `ssl--ssl-deess` **1.4.1** — table + Mac/Win installers `…v1.4.1…` exact
- `ssl--ssl-autobus` **1.0.18** — Mac/Win installer filenames **1.0.18** (newer than KVR/table label **1.0.17**)
- `ssl--ssl-autodyn` **1.0.6** — installer **1.0.6** (newer than KVR/table label **1.0.5**)
- `ssl--ssl-autoeq` **1.0.43** — installer **1.0.43** (newer than KVR/table label **1.0.41**)

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| initial-audio 22 | Product pages live; **no public Version label**; PluginCentre / installers unversioned filenames (same as raise-14) |
| overloud 20 leftovers | Fuse / TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR — SuperCabinet page mentions **1.4.26** ≠ KVR **1.4.30**; do **not** stamp TH-U **2.0.19** |
| cymatics 19 | Account-walled downloads; Diablo product Soft404→Lite; Lite CDN **1.1.0** ≠ KVR Lite **1.1.2** (contamination) |
| toneboosters 16 v3 | Changelog is current v4 line; v3 “retired”; no per-SKU **3.1.8** on public pages |
| landr 15 | Marketing / account FX — no public installer semver matching KVR |
| acon-digital 13 Studio* / DeEss:Dialogue | Still no matching public `/software/` installers (Zendesk/account) |
| cableguys 13 modules/Curve | No per-module Manual PDF on `downloads.cableguys.com` (only already-raised standalones). Do **not** stamp ShaperBox **3.6.3** |
| audiorealism ABL2 / ADM | Mfr installers **2.9.1.0** ≠ KVR **2.9.2.4**; ADM **1.6.1.9** ≠ KVR **1.6.2** — mismatch, do not raise |
| ssl--ssl-x-orcism-ii | Downloads article redirects to store marketing page — **no public semver** |
| d16 gen-1 fazortan/redoptor/syntorus/toraverb | CDN is **Fazortan2-…** etc. — do not stamp gen-2 onto gen-1 ids |
| glitchmachines fracture-xt / convex / cryogen | Fracture Free guide already used for `fracture` green; XT ≠ Free; Convex/Cryogen product URLs Soft404 |
| baby-audio / denise / audified leftovers | Same gates as raise-14/15 (legacy gens / not on legacy-downloads) |
| raise-17 leftovers (wa-production, hornet, rob-papen, …) | Not revisited — no NEW public evidence this pass |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope | Skipped per brief |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2992** / amber **56** / yellow **1527**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| initial-audio | 22 |
| overloud | 20 |
| cymatics | 19 |
| toneboosters | 16 |
| landr | 15 |
| acon-digital | 13 |
| cableguys | 13 |
| audiorealism | 2 (ABL2, ADM mismatch) |
| ssl | 1 (X-Orcism II) |
| neural-dsp | 0 |
| thewavewarden | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-18.md` (this file)
- `playbooks/{neural-dsp,thewavewarden,audiorealism,ssl,initial-audio,overloud,cymatics,toneboosters,landr,acon-digital,cableguys}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
