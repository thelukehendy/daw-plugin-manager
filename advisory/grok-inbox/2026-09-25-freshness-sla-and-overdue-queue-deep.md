# Freshness SLA + overdue queue — implementable HOLD→verified_at path

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #1/#7 — green plateau. `2026-09-25-green-plateau-freshness-kpis-deep.md` already ports the SLA matrix + KPI pack. This file adds the **overdue selection SQL, HOLD→verified_at transaction, daily cap wiring, and chip ids** Muse can land without re-reading FRESHNESS.md.
- **Context / evidence:**
  - Source of truth: `/workspace/advisory-deep/integrity/FRESHNESS.md` (+ SYNTHESIS dependency order).
  - Live age picture (2026-09-24): most currents still in **14–29d** bin (~4,283) from 2026-09-10 bulk wave; tier-1 green mean ~10.9d.
  - TIER1-REFLECT: Melda/FabFilter sticky-queue when re-check holds **without** writing `verified_at`.
  - Control-group canaries (sibling file) are the acceptance probes for hold-refresh.

- **Recommendation:**
  Chip **`freshness-sla-sweep-v1`** + **`freshness-hold-refresh-v1`**:

  ## Churn × tier SLA (store columns)
  `manufacturers.churn_class` ∈ {hot,warm,cool,frozen,hub} + `manufacturers.freshness_sla_days` (nullable; default from matrix).

  |  | Tier-1 | Tier-2 | Tier-3+ |
  |---|---|---|---|
  | hot | **3** | 7 | 14 |
  | warm | **7** | 14 | 30 |
  | cool | **14** | 30 | 45 |
  | frozen | **90** (dead-link only) | 180 | 180 |
  | hub | **30** portal/app only | 60 | 90 |

  Cap: rendered-browser vendors floor **7d**. Seed examples: Airwindows 3; Melda 3–7; FabFilter/oeksound/SSL/Softube/Antares/Waves 7–14; NI products 14 / Native Access binary 3–7; Spitfire libs hub 30 portal-only; default tier-1 yellow `kvr_ceiling` 30.

  ## Overdue selection SQL (daily)
  ```sql
  SELECT p.id AS plugin_id, m.id AS manufacturer_id,
         vo.verified_at,
         COALESCE(m.freshness_sla_days, default_sla(m)) AS sla,
         julianday('now') - julianday(vo.verified_at) AS age_days
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
  JOIN version_observations vo ON vo.id = pvc.observation_id
  WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
    AND p.resolvability IN ('open', 'kvr_ceiling')  -- after TAXONOMY
    AND (julianday('now') - julianday(vo.verified_at)) >= COALESCE(m.freshness_sla_days, default_sla(m))
  ORDER BY
    ((julianday('now') - julianday(vo.verified_at)) / COALESCE(m.freshness_sla_days, default_sla(m))) DESC,
    COALESCE(p.popularity_tier, m.popularity_tier) ASC,
    m.id
  LIMIT :daily_cap;  -- 200–400; plateau default 300
  ```

  Separate dig budget ≤50 `open_pending` — **not** in this LIMIT.

  ## HOLD → verified_at (non-negotiable)
  If re-fetch confirms same version:
  1. Prefer **new observation** with same version + fresh `verified_at` (ledger honesty), **or** audited bump of current observation `verified_at` + `plugin_version_current.updated_at`.
  2. Never leave `verified_at` stale on successful hold.
  3. Acceptance: FabFilter Pro-Q hold advances `verified_at` same day; Spitfire library SKUs never enter this queue.

  ## Plateau KPIs (dashboard lead)
  | KPI | Target |
  |---|---|
  | Freshness coverage (T1) — % with age ≤ sla | ≥ **95%** |
  | Overdue count (T1) | < 100 steady; alert > 250 |
  | Median / p95 age (T1 green) | ≤ 7 / ≤ 21 |
  | Hold-refresh rate | **100%** |
  | Raises / day | Informational (~0) |
  | Diggable debt | Trend down or flat with reason |
  | Band counts | Demoted widget |
  | Portal T0 live % | ≥ 98% (sibling portal chip) |

  Luke one-liner: *“Catalog freshness: 96% of tier-1 tracked plugins verified within SLA; 12 overdue; 0 raises today.”* — not *“3,958 green.”*

  ## Cadence change
  Replace 12h green dig chips with **one** daily freshness sweep (Luke pivot). Steady state ≈ 2,000 tier-1 / ~10d ≈ **200/day** — matches cap 300.

- **If accepted, what changes in the engine:**
  - Schema: `churn_class`, `freshness_sla_days`.
  - Job: `freshness-sla-sweep-v1` daily; hold path `freshness-hold-refresh-v1`.
  - Wire TAXONOMY stop-lists so structurally_blocked / unversioned_by_kind never consume budget.
  - Dashboard KPI reorder; export still ISO `versionVerifiedAt`.

- **Expected impact:**
  Rotates the 14–29d bulk-wave mass back under SLA; kills sticky-queue; makes plateau “done” measurable.

- **Risks / caveats:**
  - Without TAXONOMY first, Spitfire libraries / soundsets pollute overdue queue — implement stop-lists before enabling full sweep.
  - Over-aggressive hot SLA on rendered vendors → 429s; honor cost floor.
  - Choosing bump-in-place vs new observation must be one audited path.

- **Suggested first step:**
  Ship hold-refresh path + FabFilter canary only; add SLA columns with defaults; run overdue SQL RO for one week and publish coverage % before auto-writes.

- **New evidence since last verdict:**
  Implementable chip ids; overdue SQL + HOLD rule extracted for Muse; couples to control-group canary deep (this wave). Complements but does not replace `2026-09-25-green-plateau-freshness-kpis-deep.md`.
