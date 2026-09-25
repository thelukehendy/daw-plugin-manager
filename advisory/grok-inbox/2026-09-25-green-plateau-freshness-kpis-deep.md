# Green plateau freshness KPIs — SLA matrix + dashboard north star

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #1 + #7 — Green-plateau strategy and freshness rotation. Deepens `2026-09-24-green-plateau-freshness-pivot.md` with live age picture, churn×share SLA matrix, queue SQL, hold-refresh rule, and KPI pack that demotes band counts.
- **Context / evidence:**
  - PROJECT-BRIEF: research chips add almost no new greens (2026-09-24: 263 researched, 0 promoted; several zero-drift days). Value shifted to freshness + integrity.
  - Live age picture (accepted currents vs 2026-09-24): 0d 213 · 1–2d 79 · 3–6d 5 · 7–13d 1,071 · **14–29d 4,283** · 30d+ ~0. Most catalog still in 14–29d bin from 2026-09-10 bulk verification wave.
  - Tier-1 mean age: amber ~8.6d · green ~10.9d · yellow ~12.3d.
  - TIER1-REFLECT 2026-09-22 lesson: *refresh `verified_at` on holds* or Melda/FabFilter-style rows stick at head-of-queue forever.
  - Bands: green **3958** / amber **347** / yellow **1346** — informational only on the plateau.
  - Depends on resolvability taxonomy to avoid spending freshness budget on structurally_blocked / unversioned_by_kind.

- **Recommendation:**
  Replace 12h green dig chips with **one daily freshness sweep** (+ small dig budget for `open_pending`) and lead the dashboard with **freshness coverage %**, not band counts. Claim ledger, playbooks, and push mechanics stay.

  ## Definition of “done” on the plateau

  Done ≠ more greens. Done =

  1. Tier-1 `open` / `kvr_ceiling` rows within their **SLA**.
  2. Diggable debt (`open_pending`) trending down or honestly flat with documented blockers.
  3. Portal CTAs live (portal-liveness deep).
  4. Retraction watches resolved (retraction deep).
  5. Dashboard led by freshness coverage %, not band counts.

  Luke-facing one-liner template:  
  *"Catalog freshness: 96% of tier-1 tracked plugins verified within SLA; 12 overdue; 0 raises today."* — not *"3,958 green."*

  ## SLA model: churn × user share

  Inputs per manufacturer: `user_share` (popularity_tier + plugin count), `churn_class`, `oracle_cost`.

  | Class | Meaning | Examples |
  |---|---|---|
  | `hot` | Weekly–monthly public bumps | Airwindows, Melda (cheap recipe), some PA post-changelog |
  | `warm` | Monthly–quarterly | FabFilter, Valhalla, oeksound, Celemony, SSL Zendesk, Softube RN, Waves RN generation |
  | `cool` | Rare public bumps | Sonnox, many boutique greens |
  | `frozen` | Discontinued / no public churn | Exponential Audio freeze, Image-Line legacy |
  | `hub` | No public per-product churn | Spitfire libraries, UVI banks, Steinberg DA libs |

  ### Interval matrix (days between successful re-verify)

  |  | Tier-1 | Tier-2 | Tier-3+ |
  |---|---|---|---|
  | **hot** | **3** | 7 | 14 |
  | **warm** | **7** | 14 | 30 |
  | **cool** | **14** | 30 | 45 |
  | **frozen** | **90** (dead-link only) | 180 | 180 |
  | **hub** | **30** portal/app oracle only | 60 | 90 |

  Caps: rendered-browser vendors floor **7d** even if hot (cost).

  ### Seed assignment (tier-1 starting table)

  | Manufacturer | Churn | Oracle cost | SLA (days) | Notes |
  |---|---|---|---|---|
  | Airwindows | hot | cheap | 3 | Rolling releases |
  | MeldaProduction | warm→hot | cheap | 3–7 | Hold-refresh critical |
  | Kilohearts | warm | cheap | 7 | |
  | FabFilter | cool–warm | cheap | 7–14 | |
  | Valhalla | cool–warm | rendered | 7 | Browser primary |
  | oeksound | warm | cheap | 7 | Per-product changelog |
  | Celemony | warm | cheap | 7 | |
  | Newfangled / Eventide | warm | medium | 7 | H910 guard |
  | SSL | warm | cheap (Zendesk API) | 7 | Retraction-sensitive |
  | Softube | warm | medium | 7 | Suite≠SKU guards |
  | Waves | warm | browser | 7–14 | Generation watch monthly |
  | Plugin Alliance | warm | cheap HTML | 7–14 | New changelog oracle |
  | Arturia | warm | medium + rate limit | 14 | 1 concurrent; 3–5s gaps |
  | Native Instruments | hub/warm mix | medium | 14 products; **3–7** Native Access binary | Content packs skipped |
  | iZotope | cool + frozen legacy | medium | 14 current; 90 discontinued | |
  | UA | hub | medium (RN restored) | 7–14 DSP bundle; 30 hub else | UADx still blocked |
  | IK Multimedia | hub | expensive | 30 | Yellow-heavy; portal CTA |
  | Spitfire / UVI / Steinberg libs | hub / blocked | n/a | 30 portal only | No per-library dig |
  | Antares | warm | rendered help center | 7 | Section API 28 articles |
  | Soundtoys / u-he | cool | cheap | 14 | |
  | Default other T1 green | cool | — | 14 | |
  | Default T1 yellow `kvr_ceiling` | cool | KVR | 30 | Don’t hammer KVR |
  | `open_pending` dig | — | — | separate dig budget | |

  Store `manufacturers.freshness_sla_days` + `manufacturers.churn_class` (nullable; default from matrix).

  ## Queue algorithm

  ```sql
  SELECT p.id, m.id,
         vo.verified_at,
         COALESCE(m.freshness_sla_days, default_sla(m)) AS sla,
         julianday('now') - julianday(vo.verified_at) AS age_days
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
  JOIN version_observations vo ON vo.id = pvc.observation_id
  WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
    AND p.resolvability IN ('open', 'kvr_ceiling')
    AND age_days >= sla
  ORDER BY
    (age_days / sla) DESC,
    COALESCE(p.popularity_tier, m.popularity_tier) ASC,
    m.id
  LIMIT :daily_cap;  -- 200–400 typical
  ```

  ### Hold-refresh rule (non-negotiable)

  If re-fetch confirms same version:
  1. Write new observation **or** bump `verified_at` on current observation **and** `plugin_version_current.updated_at`.
  2. Never leave `verified_at` stale on a successful hold.

  Also always run retraction detector on manufacturer re-fetch (see retraction deep).

  ### Daily cap

  Plateau mode: **one** freshness sweep/day. Suggested **300 tier-1 re-verifies/day** + dig budget ≤50 `open_pending`.  
  Steady state ≈ 2,000 T1 versioned / ~10d mean SLA ≈ **200/day** — matches cap.

  ## Dashboard KPIs (reorder)

  | KPI | Definition | Target |
  |---|---|---|
  | **Freshness coverage (T1)** | % of T1 open/kvr_ceiling with age ≤ sla | ≥ **95%** |
  | **Overdue count (T1)** | age > sla | < 100 steady; alert if > 250 |
  | **Median / p95 age (T1 green)** | days since verified_at | Median ≤ 7; p95 ≤ 21 |
  | **Hold-refresh rate** | holds that bumped verified_at / holds | = **100%** |
  | **Raises / day** | promotions | Informational (~0 expected) |
  | **Diggable debt** | open_pending count | Trend down / flat with reason |
  | **Band counts** | green/amber/yellow | **Demoted** widget |
  | **Retraction open watches** | | < 10 |
  | **Portal T0 live %** | | ≥ 98% |
  | **Stop-query compliance** | banned resolvability attempts | **0** |

  ## Presentation of `versionVerifiedAt`

  Keep ISO export. Optional later: `versionFreshnessSlaDays` for app soft-warn when local clock − verifiedAt > 2× SLA (**no phone-home**). Until then app may use blunt 30d dimming (Cursor-side).

- **If accepted, what changes in the engine:**
  1. Columns or playbook fields: `churn_class`, `freshness_sla_days`.
  2. Daily freshness sweep job; deprecate 12h green dig chips (pending Luke verdict on pivot — Muse can stage behind flag).
  3. Hold path always advances `verified_at`.
  4. Dashboard KPI reorder per table.
  5. Wire TAXONOMY stop-lists so freshness never spends budget on blocked/unversioned kinds.
  6. Push mechanics / catalog-version.json unchanged.

- **Expected impact:**
  - Honest “done” metric for maintenance-phase catalog.
  - Clears the 14–29d bulk-wave pile without pretend discovery.
  - Stops sticky-queue bugs that currently fake staleness.

- **Risks / caveats:**
  - Pivot needs Luke’s strategy verdict (brief says PENDING) — Muse can still land hold-refresh + SLA columns + KPI widgets without killing 12h chips immediately.
  - Without taxonomy first, freshness may re-select Spitfire libraries — **implement taxonomy stop-lists before or with** the sweep.
  - Over-aggressive hot SLAs on rendered-browser vendors → rate limits (Arturia/PA lessons) — respect floor 7d + host cooldowns.
  - Do not re-propose app telemetry / phone-home for demand signals.

- **Suggested first step:**
  Ship hold-refresh (zero product risk) + compute coverage % RO SQL for current defaults; publish KPI widget beside band counts; wait on Luke for full 12h→daily chip retirement.

- **New evidence since last verdict:**
  Verdicts empty; live age histogram (4,283 in 14–29d); mean ages by band; SLA seed table + unified dashboard pack from `advisory-deep/integrity/FRESHNESS.md` + `SYNTHESIS.md`.
