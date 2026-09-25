# Accepted tips with hostile / weak sources — tip-promotion gate (Wave 8 Ask 6)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (Wave 8 Ask 6, lane6)
- **Mode:** Advisor-only. No catalog writes. No git commits.
- **DB:** catalog.db RO; tip join as elsewhere
- **Non-redundant vs:** Ask1/2/3 (cohort stamps, retraction, chip death). CONFIDENCE.md already defines KVR@60 yellow UX — this pass is **tips that should never have become `status=accepted` tip**, including a pirate host that **raised** confidence.

## 0. Problem

`plugin_version_current` points at `status='accepted'` regardless of host quality. Yellow UX assumes weak sources stay ≤69. Live DB violates that:

1. **Pirate tip raise:** `xfer-records--serum-2` KVR@60 → **vstorrent.org @75** (amber) as current tip.
2. **Pirate sole tip:** `native-instruments--action-strikes` **vstorrent.org @58** only observation.
3. **Mass KVR ceiling as tip:** 500 tier-1 accepted tips with `confidence ≤ 60` (470 on kvraudio.com) — policy-tolerated yellow, but press/forum/pirate tails are accuracy debt that chips keep re-verifying.

## 1. Live numbers (tier-1 accepted tips, 2026-09-25 PT)

| Band | N tips | kvraudio URL | has content_hash |
|---|---|---|---|
| conf ≤ 60 | **500** | 470 | (amber bucket has_hash 362 / 530 for &lt;70) |
| 70–84 | 308 | 28 | 54 |
| ≥ 85 | 1899 | 19 | 1104 |
| **Total** | **2777** | 540 | — |

`confidence ≤ 60` extract_method top: `kvr-product-page` 426; null 20; `kvr-verwin-osx` 11; forum/press/news tails.

### 1.1 Hostile host — must never stick

| plugin_id | tip | conf | source_url | history |
|---|---|---|---|---|
| xfer-records--serum-2 | 2.1.5 | **75** | `https://vstorrent.org/xfer-records-serum-2-v2-1-5-update-ce-v-r-vsti3-aax-win-x64/` | Prior tip KVR@60 **superseded** by this row 2026-09-14 |
| native-instruments--action-strikes | 1.2 | **58** | `https://vstorrent.org/native-instruments-action-strikes-v1-2-kontakt/` | Sole observation 2026-09-16 |

Serum `confidence_reasons` (verbatim themes): `third-party-mirror-of-official-changelog`, `installer-filename-match`, `three-independent-mirrors-agree`, `no-official-page-version-found`. Engine treated a warez mirror as corroboration and **promoted past KVR**.

Fixtures:
- `fixtures/wave8/explore/xfer-records/serum-2-observation-history.json`
- `fixtures/wave8/explore/native-instruments/action-strikes-observation-history.json`

### 1.2 Press-only tips @60 (should not be tip without mfr corroboration)

| id | ver | host |
|---|---|---|
| celemony--capstan | 1.3 | synthtopia.com |
| voxengo--lampthruster | 2.5 | rekkerd.org |
| arturia--minifreak-vocoder | 4.0 | musicradar.com |
| arturia--spark | 2.4.0 | gearnews.com |
| sugar-bytes--unique-le | 1.1.0 | rekkerd.org |

### 1.3 Forum-ledger tips (hub-walled libraries — structural, but host is not manufacturer)

15 tips, mostly `vi-control.net` 8dio/spitfire ledgers + arturia legacy forum. Acceptable as **yellow library** only if playbook names forum-ledger; still must not raise ≥70 without manufacturer.

## 2. Tip-promotion gate (advisor spec)

Before `plugin_version_current` write / accept:

```
HOST = urlparse(source_url).netloc
DENY if HOST matches:
  vstorrent|audioz|rutracker|pirate|nulled|cracked|release-bbs…
DENY raise that increases confidence when new HOST ∈ DENY
  (Serum bug: 60 → 75 on deny-host)
ALLOW KVR only if confidence ≤ 65 AND status may be accepted
  but mark reasons ["kvr_ceiling"]; never use as sole corroborator to raise
ALLOW press/forum only if confidence ≤ 60 AND manufacturer portal is hub-walled
  AND playbook lists the host; else reject / keep prior tip
REQUIRE manufacturer-registrable domain OR allowlisted CDN/helpdesk
  for confidence ≥ 70
```

Aligns with CONFIDENCE.md anti-pattern “Raising confidence from KVR alone or from another crowdsourced mirror” — extend to **any non-manufacturer mirror**, especially pirate SEO mirrors of changelogs.

### CI / integrity query

```sql
SELECT p.id, vo.confidence, vo.source_url
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status = 'accepted'
  AND COALESCE(p.popularity_tier, m.popularity_tier) = 1
  AND (
    LOWER(vo.source_url) GLOB '*vstorrent*'
    OR LOWER(vo.source_url) GLOB '*audioz*'
    OR LOWER(vo.source_url) GLOB '*rutracker*'
    OR (vo.confidence >= 70 AND LOWER(vo.source_url) LIKE '%kvraudio%')
  );
```

Live: 2 pirate tips (both fail); KVR@≥70 should be empty or rare (export currently has 0 KVR@≥80 in earlier probe — good). Pirate@75 is the severity spike.

## 3. Operator actions (advisor)

1. **Immediate clear candidates:** demote/supersede both vstorrent tips; restore Serum to last non-deny tip (KVR@60) or HOLD versionless until Xfer official page/changelog on xferrecords.com; Action Strikes → drop tip or KVR-only yellow after real KVR fetch — never vstorrent.
2. Add deny-host list to research-engine accept path (hard fail).
3. Do not mass-delete 470 KVR@60 tips — they are honest yellow — but stop chips from “corroborating” via mirrors.

## 4. Why this matters for robustness / accuracy

- Tip table is the app’s **source of truth**. A warez URL as `versionSourceUrl` is an integrity and trust failure even if the semver string happens to match.
- Confidence **increasing** on a deny-host (60→75) inverts the rubric: amber UI looks “better corroborated” than KVR yellow while the citation is worse.
- Mechanical host gate is cheaper and stronger than hoping yellow badges educate users; pirate tips should be **unrepresentable**, not merely low-scored.

