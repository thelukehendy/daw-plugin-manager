# Advisor learnings — deep pack 2026-09-25

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Meta / cross-cutting — deepen `2026-09-24-learnings.md` and `2026-09-24-advisor-learning-log-and-notes-dir.md` with NEW evidence from the 2026-09-24 deep research corpus; record anti-patterns and operating posture for Muse.
- **Context / evidence:**
  - Verdicts file still empty (`_No suggestions received yet._`) — no REJECTED items; this pack **deepens** 2026-09-24 suggestions with implementable algorithms rather than re-proposing blindly.
  - Evidence corpus: `/workspace/advisory-deep/{pa,hubs,integrity,novel}/` — PA n=50/280, Waves Incapsula 212 B, Softube 2.6.42 suite trap, SSL Acoustifier live split, freshness age histogram, portal budget math, hub matrix.
  - Catalog snapshot (brief): green **3958** / amber **347** / yellow **1346**; yellow kvr-product-page **1119**; PA **291 / 261 versioned**; portal_app PA IM **294**, Softube Central **164**, SSL DM **69**.
  - Constraint reminder: advisor writes **only** `advisory/grok-inbox/`; never catalog-store data/playbooks/src/catalog JSON.

- **Recommendation:**
  Treat the following as standing advisor learnings. Muse should fold accepted items into playbooks/reflect; keep this file as the deep learning log for the 2026-09-25 pack.

  ## Confirmed with NEW evidence (2026-09-24→25)

  1. **PA Changelog is a real manufacturer oracle** — 93.9% dated hit rate on singles (46/49); inventory 280 handles; SSL 4000 E **1.8.0 (Jan 12, 2026)** vs IM hub **1.4.0**. Parser must scope to metafield only.
  2. **Waves curl is a lie of success** — HTTP 200 + **212-byte Incapsula stub**; browser/Playwright required. Softube RN curl ~79 KB same day proves egress OK.
  3. **Softube suite ≠ SKU** — RN **2.6.42 (Aug 21, 2026)** body names Monoment Bass / Parallels / Statement Lead as **FIXED** products; that is suite train context, **not** their product versions. Homebrew Central **2.2.0** is a stale non-sc3 trap vs live **sc3 3.0.5**.
  4. **SSL Acoustifier dual-platform is LIVE-documented** — cell text `Acoustifier v1.0.18 (v1.0.19 Windows only)`; Mac-current catalog = **1.0.18**. Retraction/mac_current_split is not theoretical.
  5. **Yellow is mostly not dig debt** — ~1119 kvr-product-page; diggable tier-1 versionless plugins ≈ **113**. Resolvability enum is the honest dashboard axis.
  6. **Green plateau is operational** — 4,283 currents in 14–29d age bin; hold-refresh + SLA coverage % must replace “more greens” as north star.
  7. **Hub-walled ≠ zero public signal** — UA Version History restored at **12.0 (Sept 8, 2026)**; EastWest / Output / Slate VMR / NI Access / Spitfire app have public tips with clear ceilings; 8Dio parked.
  8. **Portal liveness is cheap if deduped** — ~120 checks/day covers ~1.5k CTA URLs; one Waves URL serves hundreds of plugins.

  ## Critical anti-patterns (memorize)

  | Anti-pattern | Correct posture |
  |---|---|
  | Stamp Installation Manager / Central / Hub app version onto plugins | Separate hub_app oracle; product from product oracle |
  | Stamp Softube suite 2.6.x onto named SKUs | Suite signal → enqueue only |
  | Stamp Waves V17 onto every SKU | `waves_generation` / generation_event only |
  | Treat Incapsula 212 B / SPA “Loading…” as content | Stub detector; keep last good snapshot |
  | Decrease on KVR drop or fetch failure | Manufacturer evidence + consecutive confirm |
  | Prefer higher of Mac/Win without policy | Mac-current dual-platform rule |
  | Dig Spitfire/UVI/Steinberg blocked classes | resolvability hard stop |
  | HEAD all observation source_urls daily | CTA inventory only |
  | Homebrew Softube Central as tip | Prefer `sc3/latest-mac.yml` |
  | UA DSP bundle → UADx native | Separate identity lanes |
  | Slate Hub 2.19.0 → VMR plugins | Hub RN for hub row only |
  | Propose telemetry / Luke-manual steps | Forbidden (brief) |

  ## Integrity system (one picture)

  ```
  TAXONOMY (resolvability) gates queues
      ├─ FRESHNESS (open/kvr_ceiling by SLA) ──► RETRACTION watch on V < C
      ├─ DIG (open_pending only)
      └─ SKIP (blocked / unversioned / discontinued / needs_identity)
  PORTAL-LIVENESS (deduped CTAs) runs parallel — never writes versions
  ```

  Implement order: taxonomy → freshness+hold-refresh → retraction hooks → portal sweep → dashboard KPI pack.

  ## Pack file map (this push)

  | File | Backlog |
  |---|---|
  | `2026-09-25-pa-changelog-parser-spec-deep.md` | #3 PA walk |
  | `2026-09-25-yellow-resolvability-taxonomy-deep.md` | #4 taxonomy |
  | `2026-09-25-vendor-retraction-protocol-deep.md` | #5 retraction |
  | `2026-09-25-softube-rn-suite-vs-sku-deep.md` | integrity catch |
  | `2026-09-25-waves-incapsula-oracle-deep.md` | #2 Waves |
  | `2026-09-25-hub-walled-oracle-matrix-deep.md` | #2 hubs matrix |
  | `2026-09-25-green-plateau-freshness-kpis-deep.md` | #1 + #7 |
  | `2026-09-25-portal-liveness-tiers-deep.md` | #6 portals |
  | `2026-09-25-learnings-deep.md` | this meta |

  Old `2026-09-24-*.md` files **kept** for verdict continuity.

  ## Standing posture (unchanged)

  - Tier-1 only until Luke unpauses Tier-2+.
  - Never design Luke-manual steps; no telemetry / phone-home.
  - Check `advisory/verdicts.md` before re-proposing REJECTED items (need NEW evidence).
  - Suggestions only under `advisory/grok-inbox/`.
  - When blocked: deep research / alternate angles — never “settled, blocked.”

  ## Open questions for Muse (not Luke-blocking)

  1. Confirm operational green threshold (≥85 CONFIDENCE vs ≥90 brief aspiration) — taxonomy pack assumes **do not retune**.
  2. Verdict on freshness-sweep pivot (#1) vs keep 12h chips with hold-refresh only.
  3. Accept schema v7 `resolvability*` + optional export keys?
  4. Waves: allow optional `waves_generation` field vs generation_event-only diagnostics?
  5. Softube: store suite train as manufacturer diagnostic field?
  6. Notes directory (`advisory/grok-notes/`) still pending prior suggestion — deep learnings stay in inbox until accepted.

- **If accepted, what changes in the engine:**
  - No direct engine change from this meta file; it is the learning log for the deep pack.
  - If Muse accepts a notes directory earlier, migrate durable anti-pattern table into `catalog-store/TIER1-REFLECT.md` or `advisory/grok-notes/` (operator-owned).
  - Dashboard/docs should cite the anti-pattern table when onboarding future chips.

- **Expected impact:**
  - Reduces repeat integrity failures (suite stamps, IM contamination, Incapsula false success, Mac/Win higher-wins).
  - Gives Muse a single checklist tying the eight deep suggestions into one implementable sequence.
  - Preserves 2026-09-24 files for audit while shipping 2026-09-25 depth.

- **Risks / caveats:**
  - Learnings file is advisory meta — do not treat as an ACCEPTED schema change.
  - Evidence paths under `/workspace/advisory-deep/` are research scratch, not in-repo; cite playbook destinations when applying.
  - Some live vendor pages will drift; fixtures must be re-fetched before golden tests land in CI.

- **Suggested first step:**
  Muse reads this learnings file + SYNTHESIS dependency order; verdict the eight deep suggestions as a batch (accept / accept-with-edits / defer); apply taxonomy + hold-refresh first.

- **New evidence since last verdict:**
  Entire deep corpus summarized above; Softube FIXED-products quote; Waves 212 B stub; Acoustifier live cell text; PA 93.9% sample; age histogram; hub matrix priorities.
