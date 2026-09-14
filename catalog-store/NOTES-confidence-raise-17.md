# NOTES — confidence raise 17 (2026-09-10 ~3:46 AM PT)

Overnight corroboration pass #17 from raise-16 leftovers. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Zero trust; no invented versions; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen/Antelope.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **2** (yellow→green) |
| WA Production Update log @92 | **2** |
| Snapshot accepted-current green (≥85) | **2952** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1489** (all KVR @60) |
| Accepted currents | **4497** |

*This run’s corroboration delta is **+2 green / −2 yellow**. Starting bands (raise-16 STATUS / brief): green **2942** / amber **56** / yellow **1491** / accepted **4489**. Concurrent universe/OAS+GitHub chip between raise-16 and this accept added **+8** new green currents → accepted **4497** before/with this pass; after our 2 raises: green **2952** / amber **56** / yellow **1489**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| wa-production | **2** | public `waproduction.com/plugins/view/{slug}` Update log matching KVR | **92** |

## Breakdown of raises

### wa-production (+2)

- `wa-production--instacomposer` **1.0.3** — Update log `v1.0.3.b2111023` / `v1.0.3.b2111024` (build-suffix ≡ KVR 1.0.3). Prior raise-14 saw only through 1.0.2 (mfr_older); log now includes 1.0.3.
- `wa-production--biggifier-by-aden` **1.1.0** — alt slug `/plugins/view/biggifier` (title **Biggifier by Aden**); Update log `version 1.1.0` exact. Catalog slug `/biggifier-by-aden` Soft404s to `/plugins/items`.

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| black-rooster-audio | Already all green @90 (catalog 3.0.0) — skip per brief |
| wa-production remaining 49 | soft404→`/plugins/items`, no Update-log semver, mfr_older (combustor/imperfect/instacomposer-2/loop-engine-2/midiq/multibender/the-king/put-me-on-drums), pumper-2 contaminated by Pumper 3.x log |
| hornet 36 | Chrome dumps Angle/Freqs/CompExp/StereoView/MultiComp/ZeroWidth marketing-only; curl CleanTalk-403; MK redirects / Soft404 same gate as raise-15/16 |
| sonible 14 denser | learn/*→learnbundle; smartcomp2/smarteq2–3/smartreverb→successor gens; freiraum→homepage Soft404; FAST Focusrite-branded; smart:EQ live 404 — do not stamp |
| softube yellow | **0** yellow (all 145 currents green 90–92). Public RN is Softube Central suite line — nothing to denser-raise |
| audiothing 27 | Toys/Environments expansions not on plugin-updates per-SKU; Environments parent **1.0** must not stamp onto Piscina/Temple/Soundscapes |
| plogue 12 | Site **403** this pass |
| accentize 3 | DeRoom Pro URL → DeRoom VH **2.0.3** ≠ Pro KVR **2.0.7**; VoiceGate no VH; PreTube 404 |
| mastering-the-mix 10 | Unversioned suite installer zips only; release-notes Soft404 |
| waldorf 7 | Marketing-only product pages |
| krotos 4 | Downloads = My Account wall |
| boz-digital 20 | No matching public CDN; Mac≠Win unilateral skip |
| rob-papen 35 | downloads.html login-oriented |
| tracktion 28 | Marketing-only / downloads→login |
| united-plugins 13 | Product pages live but semver-free; manager-only oracle |
| output 11 | SPA shell (~3KB) — no public per-title semver |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen / Antelope | Skipped per brief |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2952** / amber **56** / yellow **1489**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| wa-production | 49 |
| hornet | 36 |
| rob-papen | 35 |
| tracktion | 28 |
| audiothing | 27 |
| boz-digital | 20 |
| sonible | 14 |
| united-plugins | 13 |
| plogue | 12 |
| output | 11 |
| mastering-the-mix | 10 |
| waldorf | 7 |
| krotos | 4 |
| accentize | 3 |
| softube | 0 |
| black-rooster-audio | 0 |

## Playbook / doc updates

- `NOTES-confidence-raise-17.md` (this file)
- `playbooks/{wa-production,hornet,sonible,audiothing,softube,united-plugins,output,plogue,rob-papen,tracktion,accentize,boz-digital,waldorf,krotos,mastering-the-mix}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB
