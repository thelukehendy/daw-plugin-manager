# Successor-URL / gen-stamp contamination — measurable fingerprint (Wave 8 Ask 6)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (Wave 8 Ask 6, lane6)
- **Mode:** Advisor-only. No catalog writes. No git commits.
- **DB:** catalog.db RO; tip = `plugin_version_current` ⋈ `version_observations` `status='accepted'`
- **Tier:** `COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)=1`
- **Non-redundant vs:** Ask1 Softube/Waves/UA **hub cohort** stamps; Ask2 D16 **historical** gen-2→gen-1 + retraction protocol. This pass: **live still-contaminated** rows + SQL fingerprint across the successor graph.

## 0. Problem

D16 class: predecessor identity stamped with **successor** installer / product URL / semver major. After correction, D16 gen-1 tips are clean (`fazortan` 1.4.0 @95). The same fingerprint still lights **Plugin Alliance** rows that are green @88–90 today.

Naive `tip_major != generation` floods false positives (Valhalla gen=`1` with tip `3.0.5` is a product train, not contamination). **Use the successor edge + URL path.**

## 1. SQL fingerprint

Tier-1 plugins with `successor_plugin_id`: **100**.

**Primary detector** (URL path embeds successor slug while row is predecessor):

```sql
-- fixtures/wave8/explore/plugin-alliance/successor-url-stamp-detect.sql
SELECT p.id AS predecessor_id, p.generation, p.generation_rank, p.successor_plugin_id,
       vo.observed_version AS tip, vo.confidence, vo.source_url,
       s.id AS successor_id, svo.observed_version AS successor_tip
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
JOIN plugins s ON s.id = p.successor_plugin_id
LEFT JOIN plugin_version_current spvc ON spvc.plugin_id = s.id
LEFT JOIN version_observations svo ON svo.id = spvc.observation_id
WHERE vo.status = 'accepted'
  AND COALESCE(p.popularity_tier, m.popularity_tier) = 1
  AND REPLACE(LOWER(vo.source_url), '-', '_')
      LIKE '%' || REPLACE(LOWER(REPLACE(s.id, p.manufacturer_id || '--', '')), '-', '_') || '%';
```

**Secondary detector:** `generation_rank` set AND `semver_major(tip) > generation_rank` AND successor tip major equals predecessor tip major (same v3 stamped on both ends).

Live hits (2026-09-25 PT):

| predecessor | tip | conf | source_url | successor | succ tip |
|---|---|---|---|---|---|
| plugin-alliance--bx-boom | 3.0.0 | 88 | …/products/**bx_boom-v3** | bx-boom-v3 | 3.0.0 |
| plugin-alliance--bx-refinement | 3.0.0 | 88 | …/products/**bx_refinement-v3** | bx-refinement-v3 | 3.0.0 |
| plugin-alliance--proaudiodsp-dsm | 3.7.0 | 90 | …/products/**dsm-v3** | pro-audio-dsp-dsm-v3 | 3.7.0 |

Also URL-hit but weaker identity (legacy page naming): `izotope--izotope-trash-2` → KVR trash-2; `celemony--celemony-melodyne-4-studio` → cakewalk melodyne thread. Triage separately.

Fixture pack: `fixtures/wave8/explore/plugin-alliance/successor-url-stamp-tips.json`

## 2. PA case anatomy (why accuracy breaks)

Both ends of the chain tip-point at the **same** V3 product URL:

- `bx-boom` (gen=1, rank=1, `identity_kind=plugin`) → tip 3.0.0 @88 from `bx_boom-v3`
- `bx-boom-v3` (gen=V3, rank=3) → tip 3.0.0 @88 from same URL

Same pattern for `bx-refinement` / `bx-refinement-v3`.

`proaudiodsp-dsm` is worse for taxonomy: `identity_kind=gen_ambiguous`, successor `pro-audio-dsp-dsm-v3`, tip 3.7.0 @90 from `dsm-v3` with **empty** evidence_snippet (raise without snippet).

NOTES-plugin-alliance-chip.md already recorded the dual stamp (`bx_boom` + `bx_boom V3` → same installer) without clearing the predecessor tip. Graph edges exist; **tips ignore them**.

### Contrast — corrected D16 (fingerprint should be dark)

| id | gen/rank | tip | URL class |
|---|---|---|---|
| d16-group--fazortan | 1/1 | 1.4.0 @95 | Products History (gen-final) |
| d16-group--fazortan-2 | 2/2 | 2.2.2 @88 | `/fazortan2` |

Predecessor tip major **matches** rank; URL does not embed successor slug. Detector silent — good.

### Near-misses (do not auto-clear)

| id | tip | note |
|---|---|---|
| cableguys--shaperbox | 3.6.3 @92 | gen=1 rank=1 but product **is** ShaperBox 3; successor `shaperbox-2` tip NULL — naming inversion, identity pass first |
| cableguys--filtershaper | 3.3.2 @60 | KVR; successor XL is different product line |
| u-he--zebralette | 2.9.4 @88 | genuine 2.x train; successor zebralette-3 @3.0.0 — major≠succ tip |

Secondary `tip_maj > rank` alone is insufficient; **require URL∩successor or tip_maj==succ_tip_maj**.

## 3. Operator actions (advisor)

For PA clear/hold list:

1. **Clear / HOLD tip on predecessor** only after identity pass: either reclass predecessor `discontinued` / `gen_ambiguous` with no tip, or find a **gen-1 final** installer URL that is not `-v3`.
2. Keep V3 row as sole tip for the live SKU.
3. Wire Ask2 triggers **T1** (gen CDN mismatch) / **T2** (KVR vs mfr gen-final) to fire on **raise** when `successor_plugin_id` set and URL matches successor slug — refuse accept.
4. Export integrity check: fail CI if detector returns rows with `confidence ≥ 85`.

## 4. Why this matters for robustness / accuracy

- Green @88 tips on **gen-1 ids** that cite **V3 product pages** tell the app the predecessor “updated” to a version that belongs to another catalog identity — false upgrade UX and broken match against on-disk gen-1 bundles.
- Unlike Softube 2.6.41 cohort (Ask1), this is **pairwise identity** contamination: two rows, one URL, same tip — invisible to cohort-size detectors.
- Fingerprint is pure SQL on columns already populated (`successor_plugin_id`, `source_url`) — measurable, regression-testable, no scraping.

