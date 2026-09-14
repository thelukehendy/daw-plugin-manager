# NOTES — confidence raise 25 (2026-09-10 ~5:24→5:32 AM PT)

Overnight corroboration pass #25. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Focus: ujam Standalone leftovers; audiomodern Filterstep/Panflow mfr zips; surreal-machines public mfr; more initial-audio product badges; united-plugins changelog PDFs; WA Update logs remaining exact. Skip mega hubs.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **3** (yellow→green) |
| audiomodern manufacturer updates CDN @90 | **2** |
| initial-audio manufacturer product page @92 | **1** |
| AM already-green version bumps (same updates page) | **3** (not counted in raised) |
| Snapshot accepted-current green (≥85) | **3346** |
| Snapshot amber (70–84) | **55** |
| Snapshot yellow (<70) | **1577** (KVR @60) |
| Accepted currents | **4978** |

*Brief start (user): green **3343** / yellow **1580** / accepted **4978** / mfrs **571** / plugins **8078**. Yellow Δ −3 (1580→1577); green Δ +3.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| audiomodern | **2** | `/updates/` CDN installer zip + Version label (exact = KVR) | **90** |
| initial-audio | **1** | Public product page version badge (mfr newer than KVR) | **92** |

## Breakdown

### audiomodern (+2 yellow→green; +3 version bumps)

| plugin_id | version | prior | Evidence URL |
|---|---|---|---|
| `audiomodern--filterstep` | **1.1.3** | KVR@60 → | `https://audiomodern.com/updates/` **FILTERSTEP • Version 1.1.3** + CDN `Audiomodern_Filterstep_1.1.3.zip` (exact match KVR **1.1.3**) |
| `audiomodern--panflow` | **1.0.1** | KVR@60 → | same updates page **PANFLOW • Version 1.0.1** + CDN `Audiomodern_Panflow_1.0.1.zip` (exact match KVR **1.0.1**) |
| `audiomodern--chordjam` | **1.5.3** | green trial **1.5.0** → | updates CDN `Audiomodern_Chordjam_1.5.3.zip` (mfr newer; not a yellow raise) |
| `audiomodern--freezr` | **1.0.6** | green trial **1.0.4** → | updates CDN `Audiomodern_Freezr_1.0.6.zip` |
| `audiomodern--loopmix` | **1.1.8** | green trial **1.1.3** → | updates CDN `Audiomodern_Loopmix_1.1.8.zip` |

### initial-audio (+1)

| plugin_id | version | prior | Evidence URL |
|---|---|---|---|
| `initial-audio--sourcelab-2` | **2.4.1** | KVR@60 **2.4.0** → | `/product/sourcelab/` Flagship **v2.4.1** / “now on v2.4.1” — manufacturer **newer** than KVR; accept mfr |

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| **ujam** | **0** yellow remaining — expand-10 already stamped Standalone Installers @92 for all versioned SKUs. Nothing left to raise. |
| **surreal-machines** **6** yellow | Live site + PDF manuals all **SiteGround CAPTCHA** (`sgcaptcha`); Wayback fetch failed/timeout. Product pages previously lacked public installer semver. Leave KVR@60. |
| **united-plugins** remaining **57** yellow | `/Manuals/` lists products → `/Product/documentation` pages are **HTML manuals with 0 PDF changelogs and 0 public installer semver** (“Get the version info” UI copy only). `/download` Manager-only (v02.17). News corpus already exhausted raise-23/24 (stale vs KVR). Do not stamp Manager. |
| **initial-audio** other **19** yellow | Product badges: Sektor page **v1.6.4** < KVR **1.6.5** (mfr older — no stamp); `/product/808-studio/` is **808 Studio 2** badge **v2.1.2** < KVR studio-2 **2.1.3** + gen contamination vs gen-1 id; Clipper/SlowMo product URLs title gen-2 — do not stamp onto gen-1. Soft404 / missing pages: Areena, Clipper 2, SlowMo 2, Vice One, HUW2 Blackout. Most other live pages still **no Version label**. |
| **wa-production** **49** yellow | Re-ran Update-log scan (`scan_wa.py`): **0 exact** vs KVR. Hits with mfr_older: combustor **1.2.0**<**1.2.1**, imperfect ≤**1.6.1**<**1.6.2**, instacomposer-2 ≤**2.0.1**<**2.0.2**, loop-engine-2 ≤**2.0.2**<**2.0.3**, midiq **1.0.0**<**1.0.1**, the-king ≤**2.3.0**<**2.3.2**, put-me-on-drums **1.0.1**<**1.0.4**; multibender log stuck **1.5–1.6** vs KVR **2.2.0**; pumper-2 page contaminated by Pumper **3.x**. Soft404/miss ×40. Leave KVR@60. |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope / NI | Skipped per brief (mega hubs) |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3346** / amber **55** / yellow **1577**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| united-plugins | 57 |
| wa-production | 49 |
| initial-audio | 19 |
| surreal-machines | 6 |
| audiomodern | 0 |
| ujam | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-25.md` (this file)
- `playbooks/{ujam,audiomodern,surreal-machines,initial-audio,united-plugins,wa-production}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
- Evidence under `tmp-fetch/raise25/` (AM updates; IA product pages; UP manuals/docs; WA rescan; Surreal CAPTCHA probes)

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~5:32 AM PT |
| Manufacturers | **571** |
| Plugins | **8078** |
| Accepted currents | **4978** |
| Raised | **3** |
| Bands | green **3346** / amber **55** / yellow **1577** |
| verified_by | coding-assistant |
