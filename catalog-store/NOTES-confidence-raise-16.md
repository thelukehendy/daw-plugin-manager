# NOTES — confidence raise 16 (2026-09-10 ~3:35 AM PT)

Overnight corroboration pass #16 from expand-4 easy wins. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Zero trust; no invented versions; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **30** (yellow→green) |
| KIT Plugins official S3 installers @88 | **16** |
| GForce product-page CDN installers @88 | **11** |
| zplane products.zplane.de DEMO installers @88 | **3** |
| Black Rooster catalog 3.0.0 | **0** (already all green @90) |
| Snapshot accepted-current green (≥85) | **2942** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1491** (all KVR @60) |
| Accepted currents | **4489** (unchanged — raise replaces observation) |

*This run’s corroboration delta is **+30 green / −30 yellow**. Starting bands (expand-4 STATUS): green **2912** / amber **56** / yellow **1521**. After: green **2942** / amber **56** / yellow **1491**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| gforce-software | **11** | official CDN/product installer filenames matching KVR | **88** |
| kit-plugins | **16** | official CDN/product installer filenames matching KVR | **88** |
| zplane | **3** | official CDN/product installer filenames matching KVR | **88** |

## Breakdown of raises

### gforce-software (+11)

- `gforce-software--axxess` **1.0.1** — Axxess-1.0.1-Installer-macOS.dmg
- `gforce-software--icondrum` **1.0** — IconDrum-1.0-Installer-macOS.dmg
- `gforce-software--imposcar3` **1.0.2** — impOSCar3-1.0.2-Installer
- `gforce-software--map` **1.1.0** — MAP-1.1-Installer (trailing-zero ≡ KVR 1.1.0)
- `gforce-software--minimonsta2` **1.0.2** — Minimonsta2-1.0.2-Installer
- `gforce-software--novation-bass-station` **1.0.1** — BassStation-1.0.1-Installer
- `gforce-software--oberheim-dmx` **1.1.0** — DMX-1.1.0-Installer
- `gforce-software--oberheim-ob-x` **1.5.0** — OB-X-1.5-Installer (trailing-zero ≡ KVR 1.5.0)
- `gforce-software--oberheim-tvs-pro` **1.0** — TVSPro-1.0-Installer
- `gforce-software--oddity3` **1.1.2** — Oddity3-1.1.2-Installer
- `gforce-software--vsm-iv` **1.1** — VSM-IV-1.1-Demo Installer

### kit-plugins (+16)

- `kit-plugins--bb-55a` **1.0.1** — KIT-BB-55A_v1.0.1
- `kit-plugins--bb-55l` **1.0.0** — KIT-BB-55L_v1.0.0
- `kit-plugins--bb-56l` **1.0.0** — KIT-BB-56L_v1.0.0
- `kit-plugins--blackbird-a5` **1.1.4** — KIT-BB-A5_v1.1.4
- `kit-plugins--blackbird-chamber-a` **1.1.2** — KIT-BB-Chamber-A_v1.1.2
- `kit-plugins--blackbird-chamber-d` **1.0.0** — KIT-BB-Chamber-D_v1.0.0
- `kit-plugins--blackbird-f66-67` **1.0.5** — KIT-BB-F66-67_v1.0.5
- `kit-plugins--blackbird-mo-q` **1.0.6** — BB-MO-Q_v1.0.6
- `kit-plugins--blackbird-n105-channel-strip` **2.0.7** — KIT-BB-N105-V2_v2.0.7
- `kit-plugins--blackbird-n54` **1.0.2** — KIT-BB-N54-Single-Dual_v1.0.2
- `kit-plugins--blackbird-n73-channel-strip` **1.0.2** — KIT-BB-N73_v1.0.2
- `kit-plugins--burier` **2.0.2** — Burier_v2.0.2
- `kit-plugins--core-compressor` **1.0.4** — CORE-Comp_v1.0.4
- `kit-plugins--core-eq` **1.0.2** — CORE-EQ_v1.0.2
- `kit-plugins--np-a67` **1.0.1** — KIT-NP-A67_v1.0.1
- `kit-plugins--smash` **1.0.2** — KIT-SMASH_v1.0.2

### zplane (+3)

- `zplane--peel` **1.1.3** — PEEL_1.1.3_DEMO_Installer
- `zplane--peel-stems-2` **2.0.0** — PEEL-STEMS_2.0.0_DEMO_Installer
- `zplane--elastiqueaax` **2.3.1** — elastiqueAAX_2.3.1_DEMO_Installer


## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| black-rooster-audio 26 | Already manufacturer catalog **3.0.0** @90 — no yellows |
| kit-plugins prime-delay / prime-filter | Not on `kitplugins.com/pages/downloads` installer list (Prime Series sub page) |
| boz yellows (matching) | Account-walled; homepage only exposes Pan Knob 2 Mac≠Win dual — no safe matching CDN for other yellows |
| plogue 12 | Site 403 this pass |
| accentize DeRoom Pro / PreTube / VoiceGate | No Version History on live pages; PreTube 404 |
| mastering-the-mix 10 | Release-notes Soft404; updates in-plugin only |
| waldorf 7 | Product pages marketing-only (no installer semver) |
| krotos 4 | Downloads = My Account wall |
| zplane elastiqueAAXtce | Separate SKU; AAX page does not publish TCE installer |
| zplane TONIC/FENNEK/vielklang/ppm* | No versioned CDN on product pages |
| PSP remaining 3 | StereoPack suite→component skip; VintageMeter unversioned Mac `.dmg` |
| sonible / hornet leftovers | Same Soft404 / MK redirect gates as raise-15 — not easy |
| Waves / IK / Spitfire / Acustica / UADx | Skipped per brief |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2942** / amber **56** / yellow **1491**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| kit-plugins | 2 (prime-delay, prime-filter) |
| gforce-software | 0 |
| zplane | 5 |
| black-rooster-audio | 0 |
| boz-digital | 20 (KVR; no public match) |
| plogue | 12 |
| accentize | 3 |
| mastering-the-mix | 10 |
| waldorf | 7 |
| krotos | 4 |
| psp-audioware | 3 |
| sonible | 14 |
| hornet | 36 |

## Playbook / doc updates

- `NOTES-confidence-raise-16.md` (this file)
- `playbooks/{kit-plugins,gforce-software,zplane,black-rooster-audio}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
