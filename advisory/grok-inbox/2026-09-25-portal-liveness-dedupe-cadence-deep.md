# Portal liveness — ~1210 deduped CTAs, T0–T3, login_wall classifier deepen

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Backlog #6. Wave-1 `2026-09-24-portal-url-liveness.md` is thin; `2026-09-25-portal-liveness-tiers-deep.md` already ports table + budget. This file deepens **dedupe math (~1210), login_wall classifier heuristics, host cooldown chip, and acceptance fixtures** so Muse can implement without re-opening PORTAL-LIVENESS.md.
- **Context / evidence:**
  - Source: `/workspace/advisory-deep/integrity/PORTAL-LIVENESS.md` + SYNTHESIS.
  - Measured universe: manufacturer `update_portal_url` 660; + plugin overrides → **~1,210–1,232 distinct** CTA URLs (brief’s ~1,700 includes related). Union with all observation `source_url`s ~4,800 — **out of scope** for daily HEAD army.
  - Concentrations: PA Installation Manager ~294 plugins → **1 URL**; Softube Central ~164; SSL Download Manager ~69; Waves Central × hundreds → **1 URL**.
  - Standing rule: portal counts only if it opens.

- **Recommendation:**
  Chip **`portal-liveness-sweep-v1`** (+ classifier unit **`portal-login-wall-classifier-v1`**):

  ## In-scope inventory (~1210)
  ```sql
  SELECT
    COALESCE(NULLIF(p.update_portal_url,''), m.update_portal_url) AS url,
    MIN(COALESCE(p.popularity_tier, m.popularity_tier)) AS tier,
    COUNT(*) AS ref_plugin_count
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  GROUP BY 1;
  ```
  Canonicalize: lowercase host; strip `#fragment` + `utm_*`/`fbclid`; keep `?product=` / article ids; prefer HTTPS; collapse trailing slash. PK = sha256(canonical_url).

  ## T0–T3 cadence
  | Tier | Rule | Cadence | Steady checks/day (≈1.5k mix) |
  |---|---|---|---|
  | **T0** | tier=1 AND (ref≥20 OR known hub host) | **3d** | ~27 |
  | **T1** | other tier-1 | **7d** | ~57 |
  | **T2** | tier-2 | **21d** | ~24 |
  | **T3** | tier≥3 | **45–60d** | ~12 |
  | **Total** | | | **~120/day** (+ ≤40 retries) |

  Known hub hosts (T0 even if single manufacturer): Native Access, Waves, PA, IK, UA, Spitfire, UVI, Softube, Melda, Arturia, EastWest, Steinberg, Avid, SSL, Slate, iZotope, Antares, Output, Spectrasonics.

  Rate: ≤30 checks/min global; ≤1/20s per host (hubs ≤1/45s); concurrency 1/host, 4 global; on 429 cool host **24h** — **no UA rotation**.

  ## login_wall classifier (deepen)
  Mark `login_wall` (healthy for hub_walled) when final response is 200/401/403 **and** any of:
  - URL path/query contains `/login`, `/signin`, `/sso`, `/account`, `/auth`, `RedirectUrl=`
  - Body/title markers (case-insensitive): `sign in`, `log in`, `log-in`, `create account`, `native access`, `waves central`, `complete access hub`, `softube central`, `ilogin`, `session expired`
  - Known hub landing allowlist (Native Access download page, Waves Central marketing, Softube Central) even if CTA requires later auth

  **Never** promote `login_wall` → `hard_dead`. Dead only if landing itself is gone (`hard_dead`/`soft_404` ≥2 consecutive ≥24h apart, not `blocked`/`error`-only).

  Other classes unchanged: `live`, `redirect_ok`, `soft_404`, `hard_dead`, `blocked`, `error` (see tiers-deep).

  ## Anti-army
  - Dedupe before enqueue (inventory PK).
  - Priority = `f(tier) * log2(1+ref_plugin_count) * overdue_factor`.
  - Browser escalation ≤ **15** rendered pages/day total.
  - First fill: spread **14 days** (~110/day).
  - Job `22:00 PT` `portal_liveness_sweep.py` after research quiet; never writes versions.

  ## Acceptance fixtures
  1. Waves CTA inventory row count = **1** despite ≥200 plugins.
  2. Native Access landing → `login_wall` or `live`, never `hard_dead`.
  3. Softube plug-in-installers redirect-to-login → `login_wall`.
  4. Arturia single 429 → host cooldown 24h; portals not mass-marked dead.
  5. Steady schedule ≤ ~150 checks/day for ~1,210–1,500 URLs.

- **If accepted, what changes in the engine:**
  - Table `portal_url_liveness` (as tiers-deep); daily sweep chip; classifier tests.
  - Dashboard “Portal CTA health”; dead list NOTES on new dead.
  - Couples to freshness (dead portal ≠ version unknown — infra debt).

- **Expected impact:**
  Honest CTAs at ~120 checks/day; protects hub landings from false-dead; deepens wave-1/tiers with measurable ~1210 dedupe + login_wall fixtures.

- **Risks / caveats:**
  - Over-broad login regex could mark normal product pages `login_wall` — require hub allowlist OR strong markers.
  - Incapsula challenge → `blocked`, not dead.
  - Do not expand to observation archive without new design.

- **Suggested first step:**
  RO seed → CSV of distinct CTAs with ref counts; hand-label top 20 T0; land classifier unit tests (Native Access, Softube login redirect, Waves) before enabling writes.

- **New evidence since last verdict:**
  Chip ids `portal-liveness-sweep-v1` / `portal-login-wall-classifier-v1`; explicit ~1210 dedupe target; login_wall heuristic list + fixtures. Deepens beyond `2026-09-24-portal-url-liveness.md` and complements `2026-09-25-portal-liveness-tiers-deep.md`.
