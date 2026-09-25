# Learnings — WAVE-5 FINAL + Muse index (2026-09-25)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Close the 2026-09-25 deep advisory campaign with a Muse-facing wrap: what waves 1–5 shipped, anti-patterns that must not recur, and the rule **open the INDEX first**.
- **Context / evidence:** Commits `dfd7c0f` (wave-1 deep) · `ae9c794` (wave-2) · `6d7051a` (wave-3) · `e6891fe` (wave-4) · **this wave-5 final**. Inbox-only boundary. Live control-group re-fetch + dialect/dashboard specs.

---

## WAVE-5 deliverables (this commit)

| File | Role |
|---|---|
| `2026-09-25-muse-inbox-index-and-ship-order.md` | **Muse opens this first** — master index by problem #1–#7 + novel; P0/P1/P2; points at implement-order checklist |
| `2026-09-25-goodhertz-fabfilter-valhalla-live-quotes-deep.md` | LIVE multi-product tip table (≥8 rows) FabFilter/Goodhertz/Valhalla |
| `2026-09-25-research-attempt-outcome-vocabulary-deep.md` | One dialect: `skip:resolvability-*`, `skip:pa-bundle`, `fetch_degraded:incapsula`, `watch:retraction`, `hold:verified_at-refresh` |
| `2026-09-25-green-plateau-dashboard-widgets-deep.md` | Widget specs + SQL on pvc/vo/research_attempts |
| `2026-09-25-learnings-wave5-final.md` | This wrap |

Prior wave files **kept** (no deletes / no rewrites of wave1–4 bodies).

---

## Commit map (waves 1–5)

| Wave | SHA | Theme |
|---:|---|---|
| 1 | `dfd7c0f` | Deep pack: taxonomy, hubs matrix, PA parser, Waves Incapsula, Softube RN, portals, freshness KPIs, retraction, learnings-deep |
| 2 | `ae9c794` | Browser Waves evidence, novel Softube/Antares/oeksound, Slate/UA/EastWest/Output, learnings-wave2 |
| 3 | `6d7051a` | Control-group canary, Softube sc3 YAML, Antares section walk, oeksound tips, NI/Spitfire canaries, SLA overdue SQL, portal dedupe, learnings-wave3 |
| 4 | `e6891fe` | IK PM / UVI Falcon / 8dio park, PA 280-handle map, KVR stop-SQL, Waves diff algo, SSL datalink parser, implement-order checklist, learnings-wave4 |
| 5 | *(this)* | Muse INDEX + live quotes table + outcome vocabulary + dashboard widgets + final learnings |

Implement order source of truth remains:  
`2026-09-25-advisor-implement-order-checklist-deep.md`  
(INDEX links every chip → checklist step / problem bucket).

---

## Key anti-patterns (do not reburn)

1. **Vanity green hero** — Dashboard led by band counts while overdue queue grows.
2. **Hold without `verified_at`** — Melda/FabFilter sticky-queue; must emit `hold:verified_at-refresh`.
3. **Curl-only Waves** — 212 B Incapsula stub treated as empty RN / dead oracle.
4. **Generation stamp** — Waves V17 / UVI “2026” year marketing written as per-SKU semver.
5. **Win-newer beats Mac-current** — Acoustifier 1.0.19 over documented Mac 1.0.18.
6. **Typo SKU creation** — `Acuostifier` CDN path → new plugin id.
7. **KVR army on 1119 yellows** — Dig without resolvability stop-queries.
8. **PA products.json `updated_at` as version** — FALSE SIGNAL; bundles via `skip:pa-bundle`.
9. **Homebrew Softube Central tip** — Stale vs `sc3/latest-*.yml` 3.0.5.
10. **8dio / IK auth catalog grind** — Park / manager canary only.
11. **Invented Falcon x.y.z** — Year string is canary, not build.
12. **Free-text research_attempts notes** — Unaggregatable; use vocabulary prefixes.
13. **Portal army before taxonomy** — SYNTHESIS dependency: W1 stop-lists before portal cadence burn.
14. **Crossing advisory boundary** — Suggestions only under `advisory/grok-inbox/`; never silent catalog-store writes from advisor.
15. **Skipping the INDEX** — Muse starting mid-pack without ship-order → thrash.

---

## Operating posture for Muse (post wave-5)

1. **Open INDEX first** → then checklist deep → then P0 chips only.
2. Land **vocabulary + schema v7 resolvability + hold-refresh** before broad digs.
3. Run **control-group live quotes** as sweep canaries every freshness job.
4. Lead Luke digest with **coverage % / overdue / dialect counts / Waves flag**.
5. Treat parks (8dio) and skips as **successful chip outcomes**, not failures.
6. Retraction watches are correctness (catalog mirrors download today), not shame.

---

## Closed angles (cumulative — still closed)

IK auth PM catalog · UVI Portal login builds · Falcon invented semver · 8dio account/Discord oracle · Waves V17 bulk stamp · SSL Meter→Meter Pro map · Acoustifier Win-prefer · PA products.json churn · Homebrew Softube Central · Goodhertz `/changelog` · credentialed hub scraping · Luke-in-the-loop classification.

---

## Open follow-ups (non-blocking for filing)

- Render dashboard widgets in app (specs are advisory).
- Normalize legacy `resolvability-stop:*` notes on write.
- Optional additive outcomes vs note-prefix-only (vocabulary prefers prefixes).
- Valhalla Cloudflare intermittent — keep curl+degraded escalate path.
- After W1 backfill, re-measure diggable debt (expect ≪113).

---

## Muse first 60 seconds

```
1. Read 2026-09-25-muse-inbox-index-and-ship-order.md
2. Read 2026-09-25-advisor-implement-order-checklist-deep.md
3. Pick next unchecked P0 from INDEX / checklist W1→W2→…
4. Do not start portal army or KVR digs before stop-lists exist
```

- **Expected impact:** Campaign handoff complete; Muse has a single front door and a shared chip dialect.
- **Priority:** P0 meta (process) — this file + INDEX.
