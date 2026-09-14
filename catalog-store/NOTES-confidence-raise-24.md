# NOTES — confidence raise 24 (2026-09-10 ~5:08→5:19 AM PT)

Overnight corroboration pass #24. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Focus: United Plugins news corpus (systematic) + remaining yellow product pages; rob-papen / tracktion / initial-audio public labels. Softube already 0 yellow. Skip mega hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **2** (yellow→green) |
| initial-audio manufacturer product pages @92 | **2** |
| Snapshot accepted-current green (≥85) | **3273** |
| Snapshot amber (70–84) | **55** |
| Snapshot yellow (<70) | **1571** (KVR @60) |
| Accepted currents | **4899** |

*Brief start (user): green **3267** / yellow **1573** / accepted **4895** / mfrs **563** / plugins **7262**. Concurrent universe expand elsewhere moved headline to **571 / 8078 / 4899**; yellow delta from this pass alone is **−2** (1573→1571).*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| initial-audio | **2** | Public product page version badge / Version label (not PluginCentre) | **92** |

## Breakdown

### initial-audio (+2)

| plugin_id | version | prior | Evidence URL |
|---|---|---|---|
| `initial-audio--initial-slice` | **1.3.0** | KVR@60 → | `/product/slice-loop-slicer-plugin/` hero badge **v1.3.0 •** (exact match KVR **1.3.0**) |
| `initial-audio--difro-melody-ai` | **1.1.0** | KVR@60 **1.0.2** → | `/product/difro-melody-ai/` **Version 1.1.0** / “Difro 1.1.0 is live” / “What's new in 1.1.0” — manufacturer **newer** than KVR; accept mfr |

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| united-plugins remaining **57** yellow | Systematic news scrape: paginated `/news?page=1..10` → **120** detail ids (6–143); fetched missing **60** older articles into `tmp-fetch/raise24/`. Strong name+version patterns: only Autoformer **5** / Phantomix **1.1** exact (already raise-23). All other update posts **OLDER** than KVR (Pluralis **2.1**≪**2.3**, FireSpacer **1.1**≪**2.1**, Cyberdrive **1.1**≪**2.4**, DarkFire **1.1**≪**2.2**, FrontDAW **3**≪**4.4**, DIFIX **3.0**≪**4.2**, Verbum **3.0**≪**4.1**, Mirror **1.1**≪**3.2**, Hyperspace **1.9**≪**3.1**, …). Launch posts (Continuum/Relooper/Duoflux/Lofinity/…) lack installer semver. **Do not** stamp older mfr news. Product pages for **56** yellow SKUs: **0** public semver (marketing + “update free” only; Manager-gated). `/download` Manager-only |
| rob-papen **35** yellow | Product + demo pages live; demo CDN filenames unversioned (`Blade2_Demo.dmg`, `Predator3_Demo.exe`, …). No public Version label. downloads.html still non-oracle. Leave KVR@60 |
| tracktion **28** yellow | `/downloads` + product pages (BioTek/F.'em/Waverazor/Collective/NOVUM/KULT/SpaceCraft/Attracktive/RetroMod): marketing + login CTAs; **0** public per-title installer semver. Leave KVR@60 |
| initial-audio other **20** yellow leftovers | Most product pages still **no Version label** (AR1/Analog Pro/Boost X/Dynamic Delay/EQ/Heat Up 3/IA-LA1/Reverse/Sektor/SourceLab/…). Gen contamination: `/product/808-studio/` titles **808 Studio 2**; clipper/slowmo pages advertise gen-2 — do **not** stamp onto gen-1 ids. Missing public pages for Areena / Clipper 2 / SlowMo 2 / Vice One / HUW2 Blackout. PluginCentre **404** |
| softube | **0** yellow — nothing to raise |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope / NI | Skipped per brief (mega hubs) |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3273** / amber **55** / yellow **1571**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| united-plugins | 57 |
| rob-papen | 35 |
| tracktion | 28 |
| initial-audio | 20 |
| softube | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-24.md` (this file)
- `playbooks/{united-plugins,initial-audio,rob-papen,tracktion,softube}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
- Evidence under `tmp-fetch/raise24/` (UP news corpus + product pages; RP/TR/IA fetches)

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~5:19 AM PT |
| Manufacturers | **571** |
| Plugins | **8078** |
| Accepted currents | **4899** |
| Raised | **2** |
| Bands | green **3273** / amber **55** / yellow **1571** |
| verified_by | coding-assistant |
