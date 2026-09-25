# Green-plateau dashboard widgets — concrete specs + SQL sketches

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Plateau KPIs are named in `green-plateau-freshness-kpis-deep` / SYNTHESIS §5, but Muse still needs **widget-level specs**: inputs, SQL against `plugin_version_current` + `version_observations` + `research_attempts`, alert thresholds, and Luke one-liners. Band counts (green 3958…) must demote.
- **Context / evidence:**
  - Schema: `catalog-store/schema.sql` — currents only via `plugin_version_current → version_observations`.
  - Ledger: `research_attempts.outcome ∈ {observed,promoted,skipped}` (+ dialect notes from vocabulary deep).
  - Live anchors (2026-09-24/25): 263 researched / 0 promoted day; yellow kvr-product-page **1119**; diggable residual **≤113**; Waves curl Incapsula **212 B**.
  - Companion: freshness SLA / overdue queue deep; yellow resolvability taxonomy; outcome vocabulary deep.

---

## North-star layout (replace “green count” hero)

| Slot | Widget id | Title | Priority |
|---|---|---|---|
| Hero | `kpi-freshness-coverage` | Tier-1 freshness coverage % | P0 |
| Hero sub | `kpi-overdue-queue` | Overdue freshness queue size | P0 |
| Row 2 | `kpi-research-promote-ratio` | Researched → promoted ratio (24h / 7d) | P0 |
| Row 2 | `kpi-yellow-resolvability-pie` | Yellow by resolvability | P0 |
| Row 3 | `kpi-hub-oracle-health` | Hub oracle health (Waves `fetch_degraded`) | P0 |
| Row 3 | `kpi-control-canary` | Control-group canary OK | P1 |
| Row 4 | `kpi-retraction-watches` | Open retraction watches | P1 |
| Row 4 | `kpi-diggable-debt` | `open_pending` diggable count | P1 |
| Footer | `kpi-band-counts` | Green / amber / yellow (demoted) | P2 |

Luke one-liner template:  
*"Catalog freshness: 96% of tier-1 tracked plugins verified within SLA; 12 overdue; researched→promoted 180:0 today; Waves fetch_degraded=0."*  
— **not** *"3,958 green."*

---

## Widget 1 — `kpi-research-promote-ratio`

**Purpose:** Prove discovery chips are plateaued; celebrate integrity work (holds) separately via dialect.

**Definition:**
- `researched_N` = count of finalized `research_attempts` in window (`outcome IN ('observed','promoted','skipped')`, exclude lingering `claimed`).
- `promoted_N` = `outcome = 'promoted'`.
- `hold_N` = notes matching `hold:verified_at-refresh%` (integrity work).
- Ratio display: `promoted_N / researched_N` + absolute `researched_N : promoted_N`.

```sql
-- 24h researched → promoted (+ hold dialect)
WITH w AS (
  SELECT
    outcome,
    note,
    attempted_at
  FROM research_attempts
  WHERE attempted_at >= datetime('now', '-1 day')
    AND outcome IN ('observed', 'promoted', 'skipped')
)
SELECT
  COUNT(*) AS researched_n,
  SUM(CASE WHEN outcome = 'promoted' THEN 1 ELSE 0 END) AS promoted_n,
  SUM(CASE WHEN outcome = 'observed' THEN 1 ELSE 0 END) AS observed_n,
  SUM(CASE WHEN outcome = 'skipped' THEN 1 ELSE 0 END) AS skipped_n,
  SUM(CASE WHEN note LIKE 'hold:verified_at-refresh%' THEN 1 ELSE 0 END) AS hold_refresh_n,
  ROUND(
    1.0 * SUM(CASE WHEN outcome = 'promoted' THEN 1 ELSE 0 END) / MAX(COUNT(*), 1),
    4
  ) AS promote_rate
FROM w;
```

**Alert:** `researched_n ≥ 50 AND promoted_n = 0` is **normal plateau** (info badge), not red. Red only if `hold_refresh_n = 0` while overdue queue > 0 (freshness job idle).

**UI:** sparkline 7d promote_rate; stacked bar researched by dialect (vocabulary deep SQL B).

---

## Widget 2 — `kpi-overdue-queue`

**Purpose:** Size of SLA breach set driving the daily freshness sweep.

Depends on proposed columns (`manufacturers.freshness_sla_days`, churn_class) from freshness deep — until landed, use default tier-1 warm **7d** / cool **14d** matrix in a CASE.

```sql
-- Overdue = accepted current whose verified_at older than SLA days
SELECT COUNT(*) AS overdue_n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status = 'accepted'
  AND p.popularity_tier = 1
  -- after taxonomy: AND p.resolvability IN ('open','open_pending','kvr_ceiling')
  AND julianday('now') - julianday(vo.verified_at) >
      COALESCE(
        m.freshness_sla_days,
        CASE COALESCE(m.churn_class, 'cool')
          WHEN 'hot' THEN 3
          WHEN 'warm' THEN 7
          WHEN 'hub' THEN 30
          WHEN 'frozen' THEN 90
          ELSE 14
        END
      );
```

**Secondary breakdown:**

```sql
SELECT
  COALESCE(m.churn_class, 'cool') AS churn,
  COUNT(*) AS overdue_n,
  ROUND(AVG(julianday('now') - julianday(vo.verified_at)), 1) AS mean_age_d
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status = 'accepted' AND p.popularity_tier = 1
GROUP BY 1
ORDER BY overdue_n DESC;
```

**Alert:** overdue_n tier-1 tracked > **25** → yellow; > **100** → red (sweep starved / hold-refresh bug).

**UI:** big number + link to queue table (plugin_id, age_d, sla_d, last source_url).

---

## Widget 3 — `kpi-yellow-resolvability-pie`

**Purpose:** Stop treating yellow count as dig backlog. Pie = honesty about ceilings.

**Post schema v7:**

```sql
SELECT
  COALESCE(p.resolvability, 'unknown') AS resolvability,
  COUNT(*) AS n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
WHERE vo.status = 'accepted' AND vo.confidence < 70
GROUP BY 1
ORDER BY n DESC;
```

**Pre-taxonomy interim (live today):**

```sql
SELECT
  CASE
    WHEN vo.extract_method = 'kvr-product-page' THEN 'interim:kvr_ceiling'
    WHEN vo.extract_method LIKE 'kvr%' THEN 'interim:kvr_other'
    WHEN vo.source_url LIKE '%kvraudio.com%' THEN 'interim:kvr_source'
    WHEN m.hub_walled = 1 OR mp.hub_walled = 1 THEN 'interim:hub_walled'
    ELSE 'interim:other_yellow'
  END AS bucket,
  COUNT(*) AS n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
LEFT JOIN manufacturer_playbooks mp ON mp.manufacturer_id = m.id
WHERE vo.status = 'accepted' AND vo.confidence < 70
GROUP BY 1
ORDER BY n DESC;
```

**Callout KPI:** `open_pending` diggable ≤ **113** (wave-4) — separate number next to pie, not inside “yellow=1346”.

**Alert:** dig chips claiming rows where resolvability ∈ hard-stop → compliance red (TAXONOMY E).

---

## Widget 4 — `kpi-hub-oracle-health` (Waves flag first)

**Purpose:** Hub public oracles are brittle (Incapsula). Surface fetch health before “no Waves raises.”

```sql
-- Waves Incapsula degraded flag (24h)
SELECT
  SUM(CASE WHEN note LIKE 'fetch_degraded:incapsula%' THEN 1 ELSE 0 END) AS waves_degraded_n,
  SUM(CASE WHEN note LIKE 'fetch_degraded:%' THEN 1 ELSE 0 END) AS any_degraded_n,
  SUM(CASE WHEN chip_id LIKE 'waves%' AND outcome = 'promoted' THEN 1 ELSE 0 END) AS waves_promoted_n,
  SUM(CASE WHEN chip_id LIKE 'waves%' AND note LIKE 'hold:%' THEN 1 ELSE 0 END) AS waves_hold_n
FROM research_attempts
WHERE attempted_at >= datetime('now', '-1 day');
```

**Boolean:** `waves_fetch_ok = (waves_degraded_n = 0 AND waves_attempts_n > 0)` OR last successful browser snapshot age < SLA.

**Per-hub matrix (extend):**

| Hub | Healthy signal | Degraded note prefix |
|---|---|---|
| Waves RN | Browser body ≫ 212 B; snapshot JSON written | `fetch_degraded:incapsula` |
| Softube Central | `sc3/latest-*.yml` parse | `fetch_degraded:empty-parse` |
| SSL Zendesk | article JSON `updated_at` + data-link count | timeout / empty |
| EastWest updates | `/support/updates` ~72 KB | empty-parse |
| NI Access | status thread + dmg Last-Modified | — |
| Control group | FabFilter≥10 tips / Goodhertz bundle / Valhalla≥4 | `canary:fail:*` |

**UI:** traffic lights per hub; Waves light red on any Incapsula-only success path without browser escalate in same window.

---

## Widget 5 — `kpi-freshness-coverage` (hero)

```sql
WITH tracked AS (
  SELECT
    p.id AS plugin_id,
    vo.verified_at,
    COALESCE(
      m.freshness_sla_days,
      CASE COALESCE(m.churn_class, 'cool')
        WHEN 'hot' THEN 3 WHEN 'warm' THEN 7 WHEN 'hub' THEN 30
        WHEN 'frozen' THEN 90 ELSE 14 END
    ) AS sla_d
  FROM plugin_version_current pvc
  JOIN version_observations vo ON vo.id = pvc.observation_id
  JOIN plugins p ON p.id = pvc.plugin_id
  JOIN manufacturers m ON m.id = p.manufacturer_id
  WHERE vo.status = 'accepted'
    AND p.popularity_tier = 1
    -- prefer: resolvability in open/open_pending/kvr_ceiling
),
scored AS (
  SELECT
    CASE WHEN julianday('now') - julianday(verified_at) <= sla_d THEN 1 ELSE 0 END AS in_sla
  FROM tracked
)
SELECT
  COUNT(*) AS tracked_n,
  SUM(in_sla) AS in_sla_n,
  ROUND(100.0 * SUM(in_sla) / MAX(COUNT(*), 1), 1) AS coverage_pct
FROM scored;
```

**Alert:** coverage_pct < **90** tier-1 → yellow; < **80** → red.

---

## Widget 6 — `kpi-control-canary` + retraction + diggable debt

```sql
-- Control canary OK (24h): expect hold/canary notes from fabfilter/goodhertz/valhalla chips
SELECT
  SUM(CASE WHEN note LIKE '%canary%' AND note LIKE '%fail%' THEN 1 ELSE 0 END) AS canary_fail_n,
  SUM(CASE WHEN note LIKE 'hold:verified_at-refresh:canary%' THEN 1 ELSE 0 END) AS canary_ok_n
FROM research_attempts
WHERE attempted_at >= datetime('now', '-1 day');

-- Open retraction watches (7d, not yet promoted)
SELECT COUNT(*) AS open_retraction_watches
FROM research_attempts ra
WHERE ra.note LIKE 'watch:retraction%'
  AND ra.attempted_at >= datetime('now', '-7 days')
  AND NOT EXISTS (
    SELECT 1 FROM research_attempts ra2
    WHERE ra2.plugin_id = ra.plugin_id
      AND ra2.outcome = 'promoted'
      AND ra2.attempted_at >= ra.attempted_at
  );

-- Diggable debt (post backfill)
SELECT COUNT(*) AS open_pending_n
FROM plugins p
WHERE p.popularity_tier = 1
  AND p.resolvability = 'open_pending';
-- interim without column: use wave-4 ≤113 manufacturer list heuristic in app code
```

---

## Demoted band counts (`kpi-band-counts`)

```sql
SELECT
  CASE
    WHEN vo.confidence >= 85 THEN 'green'
    WHEN vo.confidence >= 70 THEN 'amber'
    ELSE 'yellow'
  END AS band,
  COUNT(*) AS n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
WHERE vo.status = 'accepted'
GROUP BY 1;
```

Render as **footer footnote**, not hero. Optional delta vs yesterday for curiosity only.

---

## Implementation notes for Muse

1. Ship widgets in order: coverage → overdue → ratio → yellow pie → Waves flag (matches checklist W10 after W1–W2).
2. All SQL is **RO** against catalog copy; no writes from dashboard.
3. Join discipline: never read “current version” from `version_observations` alone — always `plugin_version_current`.
4. Dialect GROUP BY requires vocabulary deep prefixes — land together.
5. Fixture anchors for tests: kvr yellow 1119; diggable ≤113; Incapsula 212 B path must set degraded flag in chip fakes.

- **If accepted, what changes in the engine / app:** dashboard JSON endpoints or SQL views `dash_*`; daily digest email uses hero widgets; research chip README links widget ids.
- **Expected impact:** Luke sees freshness + honesty, not vanity greens. Waves Incapsula failures become visible in <24h.
- **Priority:** P0 specs / P1 rendering (checklist W10).
