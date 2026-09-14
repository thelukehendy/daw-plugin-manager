# NOTES — confidence raise 23 (2026-09-10 ~4:56→5:04 AM PT)

Overnight corroboration pass #23. `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions; no git clone. Fresh angles after raise-21/22 exhausted NI Official + many oracles.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **2** (yellow→green) |
| united-plugins manufacturer news @92 | **2** |
| Snapshot accepted-current green (≥85) | **3265** |
| Snapshot amber (70–84) | **55** |
| Snapshot yellow (<70) | **1573** (KVR @60) |
| Accepted currents | **4893** (unchanged count; raises replace currents) |

*Baseline at raise-22 close / brief start: green **3263** / amber **55** / yellow **1575** / accepted **4893** / mfrs **561** / plugins **7020**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| united-plugins | **2** | Public `unitedplugins.com/news/detail/*` per-SKU version announcements (not Manager) | **92** |

## Breakdown

### united-plugins (+2)

| plugin_id | version | prior | Evidence URL |
|---|---|---|---|
| `united-plugins--autoformer` | **5.0** | KVR@60 → | `/news/detail/135` (2025-12-08) “Autoformer, now version 5” / “Autoformer 5” / “Version 5” — matches KVR **5.0** (trailing-zero) |
| `united-plugins--phantomix` | **1.1** | KVR@60 → | `/news/detail/133` (2025-10-27) title+body “Phantomix updated to v1.1” — exact |

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| united-plugins other 57 yellow | Product pages semver-free; `/download` Manager-only; `/download/old` legacy installers **older** than KVR (e.g. FirePresser legacy **3.1** ≪ KVR **4.4**). Stale news (Pluralis **2.1**≪**2.3**, FireSpacer **1.1**≪**2.1**, Cyberdrive **1.1**≪**2.4**, DarkFire **1.1**≪**2.2**, FrontDAW **3**≪**4.4**) — do **not** stamp older mfr news. Launch posts (Duoflux/Relooper/Continuum/…) lack installer semver. Docs say “Get the version info” in-UI only |
| wavesfactory yellow leftovers | **0** yellow — all 11 versioned currents already @92 (expand-8 + prior blog changelog) |
| wa-production 49 | Re-scan Update logs: **0 exact** vs KVR. Hits with mfr_older: combustor **1.2.0**<**1.2.1**, imperfect **1.6.1**<**1.6.2**, instacomposer-2 **2.0.1**<**2.0.2**, loop-engine-2 **2.0.2**<**2.0.3**, midiq **1.0.0**<**1.0.1**, the-king **2.3.0**<**2.3.2**, put-me-on-drums **1.0.1**<**1.0.4**; multibender log stuck at **1.6.x** vs KVR **2.2.0**; pumper-2 page contaminated by Pumper **3.x**. Soft404×40 |
| hornet 36 | WebFetch: Angle/Freqs/CompExp/StereoView/MultiComp/ZeroWidth = marketing-only (no KVR-matching banners). vu-meter-mk3 Soft404→homepage. curl CleanTalk-403 on bulk leftovers. Prior redirects (SongKey MK3→MK4, SW34EQ→MK2, etc.) unchanged — do not stamp successors |
| cableguys 15 (modules + Curve + CM) | Manual PDF naming sweep on `downloads.cableguys.com` **all 404** (Curve/Curve-2-CM/WaveShaper-CM/VolumeShaper/…/FilterShaper-Core). Curve support page = HTML guide, **no** Manual vX.Y.Z PDF. Do **not** stamp ShaperBox **3.6.3** |
| softube yellow | **0** yellow (145/145 green 90–92) — nothing to raise |
| cherry VH leftovers 5 | Spin product+VH still **404/500**; Rackmode/Retro Waves/Snow Angel/VM Core+Electro product pages **404**, VH **500**. Expansions/bundles — leave KVR@60 |
| overloud CDN leftovers 20 | Fuse: product live; User Manual = shared Gems PDF **Rev. 1.13.1** (manual rev ≠ Fuse **1.0.2**); CDN `Gems/Fuse` naming sweep 404; `installation.php` p=3012+ 404. SuperCabinet page cites Fluid IR as of TH-U **1.4.26** ≠ KVR SuperCabinet **1.4.30**; pack installs THU v2. TH-U editions @**1.4.7** / TH3 / rig+IR libs — do **not** stamp TH-U changelog **2.0.19**. installation.php p=18–23 = OEM stubs (TH2 Musician/KR, BREVERB Antelope/Cakewalk) unrelated to yellow SKUs |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope | Skipped per brief (mega hubs) |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3265** / amber **55** / yellow **1573**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| united-plugins | 57 |
| wa-production | 49 |
| hornet | 36 |
| overloud | 20 |
| cableguys | 15 |
| cherry-audio | 5 |
| softube | 0 |
| wavesfactory | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-23.md` (this file)
- `playbooks/{united-plugins,wavesfactory,wa-production,hornet,cableguys,softube,cherry-audio,overloud}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
- Evidence under `tmp-fetch/raise23/`

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~5:04 AM PT |
| Manufacturers | **561** |
| Plugins | **7020** |
| Accepted currents | **4893** |
| Raised | **2** |
| Bands | green **3265** / amber **55** / yellow **1573** |
| verified_by | coding-assistant |
