# Muse inbox INDEX + ship order — OPEN THIS FIRST

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** The 2026-09-25 grok-inbox deep pack is large. Without a **master index**, Muse risks implementing out of order (portal before taxonomy, Waves curl before browser, digs before stop-queries). This file is the front door: every deep chip grouped by advisory problem, with one-line chip name, evidence fixture, and P0/P1/P2.
- **Context / evidence:** Waves 1–5 commits `dfd7c0f` `ae9c794` `6d7051a` `e6891fe` + wave-5 final. Doctrine: `/workspace/advisory-deep/integrity/SYNTHESIS.md`. **Ordered checklist (implement steps):** `2026-09-25-advisor-implement-order-checklist-deep.md`.

---

## How Muse should use this file

1. Read **this INDEX** completely once.
2. Open **`2026-09-25-advisor-implement-order-checklist-deep.md`** for W1…Wn sequencing + shared invariants.
3. Pull only the deep files for the **next unchecked P0**.
4. Emit `research_attempts` notes in the **vocabulary dialect** (`2026-09-25-research-attempt-outcome-vocabulary-deep.md`).
5. Do **not** delete or rewrite prior inbox files; append verdicts elsewhere per protocol.

**Shared invariants (from checklist — do not violate):**  
catalog mirrors download-today · no Luke-in-loop classification · no credentialed hub scrape · confidence bands unchanged · **hold refreshes `verified_at`** · identity guards before version writes (esp. decreases) · advisory boundary until Muse accepts.

---

## Priority legend

| P | Meaning |
|---|---|
| **P0** | This week — blocks honest digs / freshness / hub #1 yield |
| **P1** | This week canary / park / parser once P0 prerequisites land |
| **P2** | Later — after stop-lists + freshness path healthy |

Checklist crosswalk: P0 ≈ W1–W10; P1 ≈ canaries/parks; P2 ≈ later portal army / broad digs.

---

## #1 Green plateau (freshness operating mode)

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Plateau KPI north star + SLA matrix | `2026-09-25-green-plateau-freshness-kpis-deep.md` | Age hist 14–29d≈4283; tier-1 green mean ~10.9d; 263 researched/0 promoted day | P0 |
| HOLD→verified_at + overdue SQL | `2026-09-25-freshness-sla-and-overdue-queue-deep.md` | Melda/FabFilter sticky-queue lesson (TIER1-REFLECT) | P0 |
| Dashboard widget specs + SQL | `2026-09-25-green-plateau-dashboard-widgets-deep.md` | pvc⋈vo⋈research_attempts sketches; Waves degraded flag | P0 |
| Control-group canary recipes | `2026-09-25-control-group-fabfilter-goodhertz-valhalla-deep.md` | FabFilter Pro-Q `4.13 — Jun 25, 2026`; Goodhertz `3.14.1`; Valhalla Room `2.0.5` | P0 |
| LIVE multi-product quote table | `2026-09-25-goodhertz-fabfilter-valhalla-live-quotes-deep.md` | ≥8-row product×version golden fixtures (re-fetched 2026-09-25) | P0 |
| First-batch plateau pivot (thin) | `2026-09-24-green-plateau-freshness-pivot.md` | Original problem statement | P2 (superseded by deep) |

**Ship gate:** freshness sweep + hold-refresh before celebrating band counts (checklist W2, W10).

---

## #2 Hub-walled oracles

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Hub oracle matrix ranked | `2026-09-25-hub-walled-oracle-matrix-deep.md` | Per-hub curl vs browser matrix 2026-09-24 | P0 |
| Waves Incapsula oracle path | `2026-09-25-waves-incapsula-oracle-deep.md` | Curl **212 B** stub vs Softube RN ~79 KB same day | P0 |
| Waves browser RN SUCCESS evidence | `2026-09-25-waves-browser-rn-evidence-deep.md` | **756 KB** Webpage Complete; no V17 stamp | P0 |
| Waves RN diff algorithm implementable | `2026-09-25-waves-diff-algorithm-implementable-deep.md` | `waves-rn-diff-v1` snapshot schema; generation_bump vs hotfix | P0 |
| EastWest `/support/updates` | `2026-09-25-eastwest-support-updates-oracle-deep.md` | ~72 KB HTTP 200 updates page | P1 |
| Output Help Center trio | `2026-09-25-output-help-center-oracles-deep.md` | Public HC articles (hub canary) | P1 |
| Slate VMR Zendesk | `2026-09-25-slate-vmr-zendesk-oracle-deep.md` | Zendesk RN / VMR scope | P1 |
| UA UAD Version History | `2026-09-25-ua-uad-version-history-oracle-deep.md` | Public Zendesk @ 12.0 re-enable | P0 (checklist W5) |
| NI Native Access canary | `2026-09-25-ni-native-access-canary-deep.md` | Access **3.26.0**; no Komplete matrix grind | P1 |
| Spitfire app changelog | `2026-09-25-spitfire-app-changelog-deep.md` | App-gated libraries → hub/portal posture | P1 |
| IK Product Manager canary | `2026-09-25-ik-product-manager-canary-deep.md` | Public PM **`v.1.1.15`** only | P1 |
| UVI Falcon year canary | `2026-09-25-uvi-falcon-year-canary-deep.md` | Marketing **2026** year-string; Portal for builds | P1 |
| 8dio park (no public RN) | `2026-09-25-eight-dio-park-deep.md` | FAQ-only; `/support` 404 | P1 |
| First-batch hub priorities (thin) | `2026-09-24-hub-walled-oracle-priorities.md` | Original ranking seed | P2 |

**Hard rules:** never credential scrape · never Waves V17 bulk stamp · Incapsula → `fetch_degraded:incapsula` then browser.

---

## #3 Plugin Alliance changelog / identity

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| PA changelog parser spec | `2026-09-25-pa-changelog-parser-spec-deep.md` | n=50/280 sample walk; Installer scrape guards | P1 |
| PA 280-handle inventory + identity map | `2026-09-25-pa-handle-inventory-and-identity-map-deep.md` | 280 handles; bx_*≈62; bundleish≈27; join SQL | P0 |
| First-batch PA changelog walk (thin) | `2026-09-24-plugin-alliance-changelog-walk.md` | Seed | P2 |

**Dialect:** `skip:pa-bundle` · never products.json `updated_at` as version churn.

---

## #4 Yellow resolvability taxonomy

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Resolvability enum + migration SQL | `2026-09-25-yellow-resolvability-taxonomy-deep.md` | Enum open/open_pending/kvr_ceiling/hub_walled/… | P0 |
| KVR ceiling dig-vs-stop SQL | `2026-09-25-yellow-kvr-ceiling-stop-queries-deep.md` | **1119** kvr-product-page yellow; diggable ≤**113** | P0 |
| Outcome / note vocabulary | `2026-09-25-research-attempt-outcome-vocabulary-deep.md` | `skip:resolvability-*` family + aliases | P0 |
| First-batch yellow taxonomy (thin) | `2026-09-24-yellow-confidence-taxonomy.md` | Seed classes | P2 |

**Ship gate:** W1 schema v7 + stop-queries **before** dig chips (SYNTHESIS §3).

---

## #5 Vendor retraction

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Retraction protocol + classes | `2026-09-25-vendor-retraction-protocol-deep.md` | Classes A–E; Acoustifier teaching case | P0 |
| SSL Zendesk `data-link` parser | `2026-09-25-ssl-zendesk-datalink-parser-deep.md` | 96 data-links; Mac `1.0.18` / Win `1.0.19`; `Acuostifier` typo | P0 |
| First-batch retraction detection (thin) | `2026-09-24-vendor-retraction-detection.md` | Seed | P2 |

**Dialect:** `watch:retraction:mac_current_split` etc. Mac-current beats higher Win when documented.

---

## #6 Portal URL liveness

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Portal liveness tiers | `2026-09-25-portal-liveness-tiers-deep.md` | Tiered CTA checks; budget math | P2 |
| Portal dedupe + cadence | `2026-09-25-portal-liveness-dedupe-cadence-deep.md` | Deduped URL set + cadence caps | P2 |
| First-batch portal liveness (thin) | `2026-09-24-portal-url-liveness.md` | Seed | P2 |

**Gate:** do **not** start portal army before W1 stop-lists (checklist this-week gate).

---

## #7 Freshness SLA (overlap with #1 — keep explicit)

Freshness is the plateau’s primary job. Prefer files under **#1**; this bucket exists so checklist W2 / FRESHNESS.md mapping stays visible.

| Chip | File | P |
|---|---|---|
| SLA + overdue queue | `2026-09-25-freshness-sla-and-overdue-queue-deep.md` | P0 |
| KPI pack | `2026-09-25-green-plateau-freshness-kpis-deep.md` | P0 |
| Hold dialect | `hold:verified_at-refresh` in vocabulary deep | P0 |

---

## Novel oracles (beyond hub assault)

| Chip (one-line) | File | Evidence fixture | P |
|---|---|---|---|
| Softube / Antares / oeksound overview | `2026-09-25-novel-oracles-softube-antares-oeksound-deep.md` | sc3 feeds + RN API + changelog URLs | P1 |
| Softube RN suite-vs-SKU trap | `2026-09-25-softube-rn-suite-vs-sku-deep.md` | Suite **2.6.42** ≠ per-SKU; Homebrew stale | P0 |
| Softube Central sc3 YAML | `2026-09-25-softube-central-sc3-yaml-deep.md` | `sc3/latest-*.yml` → Central **3.0.5** | P0 |
| Antares Zendesk section RN walk | `2026-09-25-antares-zendesk-section-rn-deep.md` | 28 RN articles; AutoTune 2026 tip **1.2.1** | P1 |
| oeksound per-product changelogs | `2026-09-25-oeksound-changelogs-deep.md` | soothe2/3, bloom, spiff live tips | P1 |

---

## Meta / process (Muse hygiene)

| Chip (one-line) | File | P |
|---|---|---|
| **Implement-order checklist (this week vs later)** | `2026-09-25-advisor-implement-order-checklist-deep.md` | **P0 — read after INDEX** |
| **This INDEX** | `2026-09-25-muse-inbox-index-and-ship-order.md` | **P0 — open first** |
| Learnings deep (wave-1) | `2026-09-25-learnings-deep.md` | P1 |
| Learnings wave-2 | `2026-09-25-learnings-wave2.md` | P1 |
| Learnings wave-3 | `2026-09-25-learnings-wave3.md` | P1 |
| Learnings wave-4 | `2026-09-25-learnings-wave4.md` | P1 |
| Learnings wave-5 final | `2026-09-25-learnings-wave5-final.md` | P0 |
| Outcome vocabulary | `2026-09-25-research-attempt-outcome-vocabulary-deep.md` | P0 |
| Dashboard widgets | `2026-09-25-green-plateau-dashboard-widgets-deep.md` | P0 |
| 2026-09-24 learnings / notes-dir (thin) | `2026-09-24-learnings.md`, `2026-09-24-advisor-learning-log-and-notes-dir.md` | P2 |
| Inbox README | `README.md` | P2 |

---

## Suggested ship order (compressed — detail in checklist)

```
W1  resolvability schema + backfill + vocabulary prefixes
W2  hold-refresh + SLA columns + daily freshness sweep + control canaries
W3  dig SQL → open_pending only (≤113)
W4  Waves browser + waves-rn-diff-v1
W5  UA Version History @ 12.0
W6  SSL data-link parser + Acoustifier Mac-current
W7  EastWest + Output HC
W8  Softube sc3 YAML + RN scope docs
W9  Retraction watches
W10 Dashboard widgets (coverage, overdue, ratio, yellow pie, Waves flag)
── later ──
Portal liveness army · broad novel digs · remaining hub canaries polish
```

---

## Full file listing + one-sentence abstracts (all 2026-09-25 deep + wave-5)

Use this section as a searchable TOC. Thin 2026-09-24 seeds listed at end.

### WAVE-5 (new)

1. **`2026-09-25-muse-inbox-index-and-ship-order.md`** — Master INDEX by problem #1–#7 + novel; Muse front door; points at checklist.
2. **`2026-09-25-goodhertz-fabfilter-valhalla-live-quotes-deep.md`** — LIVE FabFilter/Goodhertz/Valhalla tip quotes and ≥8-row product×version canary table.
3. **`2026-09-25-research-attempt-outcome-vocabulary-deep.md`** — Standard `research_attempts` note prefixes so chips share one dialect.
4. **`2026-09-25-green-plateau-dashboard-widgets-deep.md`** — Concrete dashboard widget specs with SQL on currents, observations, and attempts.
5. **`2026-09-25-learnings-wave5-final.md`** — Session wrap: commits, anti-patterns, open-INDEX-first rule.

### Integrity / plateau / taxonomy / retraction / portal

6. **`2026-09-25-advisor-implement-order-checklist-deep.md`** — This-week vs later ordered checklist mapped to inbox chips and SYNTHESIS dependencies.
7. **`2026-09-25-green-plateau-freshness-kpis-deep.md`** — SLA matrix, age histogram, hold-refresh rule, KPI pack that demotes green counts.
8. **`2026-09-25-freshness-sla-and-overdue-queue-deep.md`** — Implementable overdue selection SQL, HOLD→verified_at transaction, chip ids.
9. **`2026-09-25-yellow-resolvability-taxonomy-deep.md`** — Full resolvability enum, schema v7 migration, stop-query rules, dashboard hooks.
10. **`2026-09-25-yellow-kvr-ceiling-stop-queries-deep.md`** — Dig-vs-stop SQL for 1119 kvr-product-page yellows and ≤113 diggable residual.
11. **`2026-09-25-vendor-retraction-protocol-deep.md`** — Downward-move taxonomy A–E with Acoustifier live fixture and false-alarm guards.
12. **`2026-09-25-portal-liveness-tiers-deep.md`** — Tiered portal CTA liveness checks and budget math for hub-walled vendors.
13. **`2026-09-25-portal-liveness-dedupe-cadence-deep.md`** — Deduped portal URL set plus cadence caps so liveness chips do not thrash.

### Hubs

14. **`2026-09-25-hub-walled-oracle-matrix-deep.md`** — Live-verified per-hub public-channel matrix with DO-NOT-GRIND lists.
15. **`2026-09-25-waves-incapsula-oracle-deep.md`** — Incapsula failure mode, Playwright/WebFetch-only path, no V17 stamp rule.
16. **`2026-09-25-waves-browser-rn-evidence-deep.md`** — Confirmed 756 KB browser RN success, DOM notes, New Plugin / Fixed-in scopes.
17. **`2026-09-25-waves-diff-algorithm-implementable-deep.md`** — Compressed `waves-rn-diff-v1` snapshot + generation_bump vs hotfix rules.
18. **`2026-09-25-eastwest-support-updates-oracle-deep.md`** — Curl-friendly EastWest updates page oracle; do not stamp hub versions onto libraries.
19. **`2026-09-25-output-help-center-oracles-deep.md`** — Output public Help Center trio as hub canary sources.
20. **`2026-09-25-slate-vmr-zendesk-oracle-deep.md`** — Softube/Slate-adjacent VMR Zendesk oracle notes for hub matrix.
21. **`2026-09-25-ua-uad-version-history-oracle-deep.md`** — Re-enable UA Version History scraper posture at UAD 12.0 public Zendesk.
22. **`2026-09-25-ni-native-access-canary-deep.md`** — Native Access hub_app canary (3.26.0) without Komplete graph grind.
23. **`2026-09-25-spitfire-app-changelog-deep.md`** — Spitfire app changelog posture; libraries stay hub/portal gated.
24. **`2026-09-25-ik-product-manager-canary-deep.md`** — Public IK Product Manager version canary only; no auth catalog scrape.
25. **`2026-09-25-uvi-falcon-year-canary-deep.md`** — Falcon “2026” year-string canary; builds remain Portal-side.
26. **`2026-09-25-eight-dio-park-deep.md`** — Explicit park: no public RN; FAQ-only; stop grinding.

### PA / SSL

27. **`2026-09-25-pa-changelog-parser-spec-deep.md`** — Parser spec for Plugin Alliance changelogs with identity guards.
28. **`2026-09-25-pa-handle-inventory-and-identity-map-deep.md`** — 280-handle histogram, SQL joins, bundle skip list.
29. **`2026-09-25-ssl-zendesk-datalink-parser-deep.md`** — SSL article JSON data-link parser; Acoustifier dual tips; typo alias.

### Novel

30. **`2026-09-25-novel-oracles-softube-antares-oeksound-deep.md`** — Softube Central feeds, Antares RN API enum, oeksound changelog map.
31. **`2026-09-25-softube-rn-suite-vs-sku-deep.md`** — Suite version vs SKU scope trap; Homebrew Central tip closed.
32. **`2026-09-25-softube-central-sc3-yaml-deep.md`** — Machine-readable `sc3/latest-*.yml` Central tip recipe.
33. **`2026-09-25-antares-zendesk-section-rn-deep.md`** — Section API walk; AutoTune 2026 tip sample.
34. **`2026-09-25-oeksound-changelogs-deep.md`** — Four per-product changelog tip confirmations.
35. **`2026-09-25-control-group-fabfilter-goodhertz-valhalla-deep.md`** — Easy-green canary URLs and tip shapes for freshness probes.

### Learnings

36. **`2026-09-25-learnings-deep.md`** — Wave-1 cross-cutting anti-patterns from deep corpus.
37. **`2026-09-25-learnings-wave2.md`** — Wave-2 hubs browser + novel dig lessons.
38. **`2026-09-25-learnings-wave3.md`** — Wave-3 control-group / SLA / canary lessons.
39. **`2026-09-25-learnings-wave4.md`** — Wave-4 parks, stop-SQL, SSL/PA/Waves diff lessons.
40. **`2026-09-25-learnings-wave5-final.md`** — Final wrap + INDEX-first rule.

### 2026-09-24 first-batch seeds (keep; prefer deep siblings)

41. **`2026-09-24-green-plateau-freshness-pivot.md`** — Original plateau pivot ask.
42. **`2026-09-24-hub-walled-oracle-priorities.md`** — Original hub priority seed.
43. **`2026-09-24-plugin-alliance-changelog-walk.md`** — Original PA walk seed.
44. **`2026-09-24-portal-url-liveness.md`** — Original portal liveness seed.
45. **`2026-09-24-vendor-retraction-detection.md`** — Original retraction seed.
46. **`2026-09-24-yellow-confidence-taxonomy.md`** — Original yellow taxonomy seed.
47. **`2026-09-24-learnings.md`** — First-batch learnings.
48. **`2026-09-24-advisor-learning-log-and-notes-dir.md`** — Notes-dir / learning-log convention.
49. **`README.md`** — Inbox pointer stub.

---

## Evidence fixture cheat-sheet (fast)

| Fixture | Value |
|---|---|
| FabFilter Pro-Q 4 | `4.13 — Jun 25, 2026` |
| FabFilter Pro-C 3 | `3.02 — Apr 16, 2026` |
| Goodhertz bundle | `Goodhertz 3.14.1` / `June 30, 2026` |
| ValhallaRoom | `Current Version: 2.0.5 (Updated March 15, 2024)` |
| ValhallaVintageVerb | `Current Version: 4.0.5 (updated March 15, 2024)` |
| ValhallaDelay | `Current Version: 3.0.5 (updated May 20th, 2025)` |
| ValhallaSupermassive | `Current Version: 5.0.0 (Updated November 26th, 2025)` |
| ValhallaPlate | `Current Version: 1.6.8 (Mac) / 1.6.3 (Windows)` |
| Waves curl | HTTP 200 **212 B** Incapsula stub |
| Waves browser | **756 KB** RN success |
| SSL Acoustifier | Mac **1.0.18** / Win **1.0.19**; article updated 2026-09-22 |
| Yellow kvr-product-page | **1119** |
| Diggable residual | **≤113** tier-1 versionless `plugin` |
| PA handles | **280** |
| IK PM | `v.1.1.15` |
| Softube Central sc3 | **3.0.5** (not Homebrew 2.2.0) |
| NI Access | **3.26.0** |

---

## Anti-patterns (INDEX reminder — full list in wave-5 learnings)

No vanity-green hero · no hold without verified_at · no curl-only Waves · no generation stamp · no Win-over-Mac when split documented · no typo SKUs · no KVR army without stops · no PA updated_at versions · no Homebrew Softube tip · no auth hub grinds · no free-text attempt notes · no portal army before taxonomy · no skipping this INDEX.

---

## Acceptance for Muse kickoff

- [ ] Opened this INDEX
- [ ] Opened implement-order checklist
- [ ] Next work item is a **P0** with prerequisites satisfied
- [ ] Chip will write vocabulary-compliant `research_attempts.note`
- [ ] Control-group canary planned inside freshness sweep

**Advisor:** Grok Bot · **Repo path:** `advisory/grok-inbox/` only · **Keep all prior files.**
