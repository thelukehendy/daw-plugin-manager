# Advisor implement-order checklist — this week vs later (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Integrity pack (`TAXONOMY` / `FRESHNESS` / `RETRACTION` / `PORTAL-LIVENESS` / `SYNTHESIS`) plus hubs/novel oracle chips risk unordered implementation. Muse needs a **single ordered checklist**: what to ship **this week** vs **later**, mapped to concrete inbox chips.
- **Context / evidence:**

Primary doctrine: `/workspace/advisory-deep/integrity/SYNTHESIS.md` §3 dependency order + §7 Muse checklist. Hubs REPORT priority table. Novel REPORT ranked green-impact list. Plateau sentence: discovery chips no longer mint greens — risk is misclassified uncertainty, stale verification, dead CTAs, unhandled decreases.

### Shared invariants (do not violate)
1. Catalog mirrors what user downloads **today** (raises **and** manufacturer-confirmed decreases).
2. No Luke in the loop for classification/SLA/watches/liveness.
3. No telemetry / credentialed hub scraping.
4. Confidence bands unchanged (green ≥85 operational).
5. **Hold refreshes `verified_at`.**
6. Identity guards before any version write (esp. decreases).
7. Advisory boundary until Muse accepts.

---

## THIS WEEK (ordered) — ship or land recipes

| Step | Deliverable | Why now | Inbox / deep sources to implement from |
|---:|---|---|---|
| **W1** | Schema v7 `resolvability*` + backfill-v1 | Stop-queries unlock honest dig vs skip; prevents wasting freshness on soundsets/Spitfire libraries | `yellow-resolvability-taxonomy-deep` · `yellow-kvr-ceiling-stop-queries-deep` · TAXONOMY.md |
| **W2** | Hold-refresh + SLA columns + daily freshness sweep | Plateau operating mode; fixes verified_at lie | `freshness-sla-and-overdue-queue-deep` · `green-plateau-freshness-kpis-deep` · FRESHNESS.md |
| **W3** | Dig chip SQL → `open_pending` only (≤113 → shrink) | Stops KVR army on 1119 yellows | `yellow-kvr-ceiling-stop-queries-deep` |
| **W4** | Waves Playwright/WebFetch + **`waves-rn-diff-v1`** parser | Highest advisory yield (hubs #1) | `waves-incapsula-oracle-deep` · `waves-browser-rn-evidence-deep` · **`waves-diff-algorithm-implementable-deep`** |
| **W5** | UA Version History scraper re-enable @ 12.0 | Public Zendesk; Softube-UAD-* DSP bundle freshness (novel #1) | `ua-uad-version-history-oracle-deep` |
| **W6** | SSL Zendesk JSON `data-link` parser + Mac-current / Acoustifier | Offline installers live; updated 2026-09-22; retraction safety | **`ssl-zendesk-datalink-parser-deep`** · vendor-retraction chips |
| **W7** | EastWest `/support/updates` + Output Help Center trio | Curl-friendly high confidence (hubs #3–4) | `eastwest-support-updates-oracle-deep` · `output-help-center-oracles-deep` |
| **W8** | Softube Central `sc3/latest-*.yml` + RN scope trap docs | Machine-readable Central 3.0.5; Homebrew trap (novel #2) | `softube-central-sc3-yaml-deep` · `softube-rn-suite-vs-sku-deep` |
| **W9** | Retraction watch + SSL/CDN decrease hook | Piggybacks freshness; Acoustifier-class | `vendor-retraction-protocol-deep` · RETRACTION.md |
| **W10** | Dashboard KPI pack flip (freshness %, diggable debt, …) | Stop celebrating raw green counts | SYNTHESIS §5 · green-plateau KPI chip |

**This-week gate:** Do **not** start portal army or broad dig chips before **W1** stop-lists exist (SYNTHESIS §3).

---

## THIS WEEK — canaries / parks (small, still ship)

| Item | Chip | Posture |
|---|---|---|
| IK Product Manager `v.1.1.15` | **`ik-product-manager-canary-deep`** | Manager-only; hub_wall product SKUs |
| UVI Falcon year-string | **`uvi-falcon-year-canary-deep`** | Year only — **no invented semver** |
| 8Dio | **`eight-dio-park-deep`** | FAQ liveness quarterly; oracle_absent |
| NI Native Access | `ni-native-access-canary-deep` | Access build + Last-Modified; not full Komplete |
| Spitfire app changelog | `spitfire-app-changelog-deep` | App `v3.4.17`; libraries allowlist later |
| Slate VMR Zendesk | `slate-vmr-zendesk-oracle-deep` | VMR RN; Hub 2.19.0 manager-only |

---

## LATER (next 2–4 weeks) — after W1–W10 stable

| Step | Deliverable | Depends on | Sources |
|---:|---|---|---|
| **L1** | Portal inventory + ~120 checks/day + host cooldowns | Parallel OK after W2; better after W1 | `portal-liveness-tiers-deep` · `portal-liveness-dedupe-cadence-deep` · PORTAL-LIVENESS.md |
| **L2** | PA walker: identity map + bundle skip + Installer `v` browser pass | W1 identity guards | **`pa-handle-inventory-and-identity-map-deep`** · `pa-changelog-parser-spec-deep` |
| **L3** | Antares section JSON enumeration (28 RN articles) + AT2026 1.2.1 | Dig budget spare | `antares-zendesk-section-rn-deep` · novel notes TSV |
| **L4** | oeksound per-product changelog cadence | Low volume | `oeksound-changelogs-deep` |
| **L5** | Spitfire library VH allowlist from Product Information | App oracle healthy | spitfire chip |
| **L6** | Control-group regression pack (FabFilter / Goodhertz / Valhalla) as CI fixtures | Anytime as tests | `control-group-fabfilter-goodhertz-valhalla-deep` |
| **L7** | Export optional `resolvability` JSON keys | App/Cursor ignore-until-wired | TAXONOMY export table |
| **L8** | Softube **per-plugin** yellow unless scoped RN / Central manifest | Do not force | softube suite-vs-sku chip |
| **L9** | Surge/Vital FOSS-adjacent — only if catalog cares | Low priority | novel §8 negatives |
| **L10** | Reflect after 7 days: publish coverage %, diggable debt, watches, portal dead list | W10 live | SYNTHESIS §7 last box |

---

## Explicit non-goals (park indefinitely unless policy changes)
- Retuning confidence thresholds  
- Unpausing tier-2+ research  
- App telemetry / demand queue  
- Credentialed hub scraping (IK PM catalog, UVI Portal login, Waves Central, Spitfire App, Native Access entitlements, 8dio account downloader, Softube direct-installers login)  
- Parallel "bot army" portal HEAD from many chips  
- Force-push / catalog mutation from advisor role  
- Catalog-wide Waves `version=V17` stamp  
- UADx builds from UAD DSP Version History  
- Homebrew Softube Central as tip (stale 2.2.0 vs sc3 3.0.5)  
- PA `products.json` `updated_at` as churn  

---

## Dependency diagram (from SYNTHESIS)

```
TAXONOMY (resolvability) ──► FRESHNESS queues
         │                      │
         │                      ▼
         │               RETRACTION watches
         ▼
   DIG only open_pending          PORTAL-LIVENESS (parallel)
         │
         ▼
   Dashboard KPI pack (ships with freshness/portal)
```

## Luke-facing one-liner template (after W10)
> *"Freshness X% in-SLA · diggable debt N · R retraction watches · portals T0 Y% live · +0 greens (plateau)."*

## Concrete Muse checkbox (merge of SYNTHESIS §7 + this week table)
- [ ] Verdict four integrity docs  
- [ ] Land schema v7 + backfill; claim-ledger filters  
- [ ] Hold-refresh + SLA; daily freshness primary  
- [ ] Dig chip → open_pending only  
- [ ] Waves browser fetch + waves-rn-diff-v1  
- [ ] UA Version History green check  
- [ ] SSL datalink parser + Mac-current  
- [ ] EastWest + Output oracles  
- [ ] Softube sc3 YAML (+ Homebrew trap note)  
- [ ] Retraction watch jsonl + SSL hook  
- [ ] Dashboard KPI reorder  
- [ ] Canaries: IK PM / UVI year / NI Access / Spitfire app; park 8dio  
- [ ] Later: portal job, PA identity map, Antares API, oeksound  
- [ ] Day-7 reflect metrics — no Luke ping unless policy block  

- **Recommendation:** Treat this file as the **wave-4 operating checklist**. Muse implements top-to-bottom; advisor packs after this should not invent parallel "priority #1" without updating this order.

- **If accepted, what changes in the engine:** Cadence config + chip scheduler priorities; dashboard; stop-query wiring; playbook enable flags matching W* vs L*.

- **Expected impact:** Converts advisor sprawl into one week of plateau-correct work; prevents assault re-probe bans from being violated by eager digs.

- **Risks / caveats:** Over-committing W4–W8 in one day — sequence still matters (taxonomy before digs). Portal L1 can start mid-week if W1/W2 landed.

- **Suggested first step:** Muse verdict on TAXONOMY+FRESHNESS; land W1–W3 same change-set; then Waves diff (W4) as first oracle ship.

- **New evidence since last verdict:** SYNTHESIS dependency order cross-walked to all WAVE-1..4 inbox chips; live diggable 113 / yellow 1119 anchors.


---

## Appendix — Mapping hubs REPORT #1–10 → checklist slots

| Hubs # | Vendor action | Checklist slot |
|---:|---|---|
| 1 | Waves Playwright + DIFF-SPEC | **W4** |
| 2 | UA Version History | **W5** |
| 3 | EastWest updates | **W7** |
| 4 | Output HC trio | **W7** |
| 5 | Slate VMR Zendesk | this-week canary table |
| 6 | NI Native Access | this-week canary table |
| 7 | Spitfire app changelog | this-week canary table |
| 8 | IK PM canary | this-week canary table |
| 9 | UVI Falcon year | this-week canary table |
| 10 | 8Dio park | this-week canary table |
| bonus | Softube RN / sc3 YAML | **W8** |

Novel REPORT ranks (UA restored, Softube sc3, Antares, SSL, Slate Hub, oeksound, PA seeds, control group) map to W5/W8/L3/W6/canary/L4/L2/L6 respectively.

Integrity SYNTHESIS steps 1–5 map to W1, W2, W9, L1, W10.

This appendix exists so Muse does not need to re-read three deep folders to sequence a week.


---

## Appendix — Risk if order is inverted

| If Muse does… first | Failure mode |
|---|---|
| Portal army before taxonomy | Re-probe banned classes; WAF noise; assault ban violations |
| Dig chips before stop-queries | 1119 KVR re-hits; diggable debt KPI lies |
| Waves mass V17 stamp before diff-v1 | False churn across catalog; Luke trust hit |
| PA browser walk before identity/skip | Bundle waste + fuzzy mis-writes (`limiter`) |
| Celebrate green counts after freshness flip | Dashboard teaches wrong era |

Checklist exists to prevent these inversions.


---

## Appendix — Suggested calendar (Mon–Fri, no Luke)

| Day | Focus |
|---|---|
| Mon | W1 resolvability schema+backfill; W3 dig SQL cutover; smoke diggable debt number |
| Tue | W2 freshness hold-refresh+SLA sweep; W10 dashboard widgets sketched |
| Wed | W4 Waves browser fetch + diff-v1 fixtures; W9 retraction hook stub |
| Thu | W5 UA Version History; W6 SSL datalink; W7 EastWest+Output |
| Fri | W8 Softube sc3; canaries IK/UVI/NI/Spitfire; park 8dio; day-7 metrics dry-run |

Later week: L1 portal job ramp; L2 PA identity map using handle inventory chip.
