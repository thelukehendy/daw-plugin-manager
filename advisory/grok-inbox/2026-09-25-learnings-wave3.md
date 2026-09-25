# Advisor learnings — WAVE-3 (2026-09-25)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Meta — WAVE-3 learnings after novel/integrity deepen + hub canaries (NI/Spitfire) + control-group recipes. Complements `2026-09-25-learnings-wave2.md` and `2026-09-25-learnings-deep.md`; does not replace them.
- **Context / evidence:**
  - Corpus: `/workspace/advisory-deep/{novel,integrity,hubs}/` + live fetches this pack + `WAVE2-FIXTURES.json`.
  - Constraint: suggestions only under `advisory/grok-inbox/`; prior 2026-09-24 and 2026-09-25 files **kept**.

- **Recommendation:**
  Fold these **WAVE-3 learnings** into Muse posture:

  ## New learnings (WAVE-3)

  1. **Softube Central tip = `sc3/` YAML only** — live `version: 3.0.5` / releaseDate 2026-06-24. Root `latest-mac.yml` + Homebrew still **2.2.0**. Chip `softube-central-sc3-yaml-v1` updates **hub_app only**; still never stamp suite RN onto plugins.
  2. **Antares section walk is standing enum** — 28 articles via section API; live AutoTune 2026 tip **`AutoTune 2026 (1.2.1)`** with maintenance-release body quote. Chip `antares-section-rn-walk-v1`; rename-aware.
  3. **oeksound four tips re-confirmed live** — soothe2 **1.3.3**, soothe3 **1.0.5**, bloom **1.1.3**, spiff **1.4.4**. Chip `oeksound-changelog-v1`.
  4. **Control group = freshness canaries** — FabFilter `/download` (Pro-Q **4.13 — Jun 25, 2026**), Goodhertz **3.14.1 / June 30, 2026**, Valhalla `Current Version:` lines. Chip `control-group-canary-v1` gates hold→verified_at acceptance.
  5. **Freshness implementables** — overdue SQL + HOLD→verified_at + plateau KPIs as chips `freshness-sla-sweep-v1` / `freshness-hold-refresh-v1` (deepens KPI deep; TAXONOMY-first).
  6. **Portal ~1210 dedupe** — T0–T3 ~120 checks/day; deepen `login_wall` classifier + fixtures (`portal-liveness-sweep-v1`). Hub login landings are healthy CTAs.
  7. **NI Access canary** — status thread **`3.26.0 - 2026-09-10`** + GCS/assets `Last-Modified` Sep 10, 2026. Hub_app only; **no Komplete matrix grind**. Watch stale “3.6.0” prose in meta — parse dated tip line.
  8. **Spitfire app** — live **`Changelog for v3.4.17 update` / `Release date 04 February 2026`**. Libraries remain app-gated; hub SLA portal-only.
  9. **Integrity quartet still one system** — TAXONOMY → FRESHNESS → RETRACTION → PORTAL (SYNTHESIS). WAVE-3 does not reopen catalog writes.
  10. **Live-fetch discipline** — every tip quote in this wave was re-fetched before write; if a future fetch fails, say so — do not silently reuse stale raw/.

  ## Anti-patterns reinforced

  | Trap | Correct |
  |---|---|
  | Homebrew / root Softube YAML as Central tip | **sc3/** 3.0.5 only |
  | Softube suite RN / Waves V17 / Slate Hub / Access / Spitfire app → SKUs | Hub/suite/generation lane only |
  | Antares blind name search | Section API + TSV map |
  | oeksound `/downloads/` as multi-product SoT | Per-slug `/changelog/{product}/` |
  | Portal HEAD of all observation URLs (~4.8k) | Deduped CTA inventory ~1210 |
  | login_wall → dead | Healthy for hub_walled |
  | NI Komplete public grind | Access hub_app canary only |
  | Spitfire library greens from app tip | App hub_app; libraries blocked |

  ## WAVE-3 file map (this push)

  | File | Chip / focus |
  |---|---|
  | `2026-09-25-softube-central-sc3-yaml-deep.md` | `softube-central-sc3-yaml-v1` |
  | `2026-09-25-antares-zendesk-section-rn-deep.md` | `antares-section-rn-walk-v1` |
  | `2026-09-25-oeksound-changelogs-deep.md` | `oeksound-changelog-v1` |
  | `2026-09-25-control-group-fabfilter-goodhertz-valhalla-deep.md` | `control-group-canary-v1` |
  | `2026-09-25-freshness-sla-and-overdue-queue-deep.md` | `freshness-sla-sweep-v1` + hold-refresh |
  | `2026-09-25-portal-liveness-dedupe-cadence-deep.md` | `portal-liveness-sweep-v1` + login_wall |
  | `2026-09-25-ni-native-access-canary-deep.md` | `ni-native-access-canary-v1` |
  | `2026-09-25-spitfire-app-changelog-deep.md` | `spitfire-app-changelog-v1` |
  | `2026-09-25-learnings-wave3.md` | this meta |

  Prior `2026-09-24-*.md`, WAVE-1 deeps (`dfd7c0f`), and WAVE-2 (`ae9c794`) **kept**.

- **If accepted, what changes in the engine:**
  Muse folds WAVE-3 chips after verdicts; learning log stays inbox-only until accepted. Prefer Softube sc3 + Antares walk + control canaries + Access/Spitfire hub_app in first week.

- **Expected impact:**
  Correct Central tip; Autotune 2026 1.2.1 path; freshness/portal implementable without re-dig; hub canaries without matrix grind; canary-gated hold-refresh.

- **Risks / caveats:**
  Overlap with wave-2 novel overview / freshness KPI / portal tiers deeps is intentional deepen (new chip ids + live quotes), not duplicate grind. Integrity docs remain research — implement via these suggestions, don’t copy wholesale into catalog-store.

- **Suggested first step:**
  Land Softube sc3 canary (blocklist root/brew) + FabFilter hold-refresh acceptance + Antares 1.2.1 dry-run in one maintenance pass.

- **New evidence since last verdict:**
  Live Softube sc3/root YAML; Antares AT2026 1.2.1 quote; oeksound four tips; FabFilter/Goodhertz/Valhalla quotes; NI 3.26.0 + Last-Modified; Spitfire v3.4.17; chip id map above.
