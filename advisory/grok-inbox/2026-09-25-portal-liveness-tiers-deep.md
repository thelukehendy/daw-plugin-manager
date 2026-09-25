# Portal URL liveness tiers — ~1,700 URLs without a bot army

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #6 — Portal URL liveness at scale. Deepens `2026-09-24-portal-url-liveness.md` with inventory model, T0–T3 cadence, method ladder, rate limits, status classifiers, and budget math (~120 checks/day).
- **Context / evidence:**
  - Standing rule: *portal URLs count only if they open* (~1,700 distinct URLs in brief; measured manufacturer portals 660 + plugin overrides → ~1,210–1,232; do **not** HEAD all ~4,800 observation source_urls daily).
  - Heavy tails: Waves / NI / PA / Softube / SSL portals cover hundreds of plugins each — dedupe by URL.
  - portal_app concentrations: PA Installation Manager **294**, Softube Central **164**, SSL Download Manager **69**.
  - Rate-limit history: Arturia, PA text-fetch, Softube, browser flakiness — politeness is load-bearing.
  - Hub landings may be `login_wall` and still valid CTAs for hub_walled vendors (Native Access, Waves Central, …).

- **Recommendation:**
  Build deduped `portal_url_liveness` inventory scoped to **update CTAs** only; check on T0–T3 cadences totaling ~**120/day** steady state — one mild daily job, not a chip army.

  ## In-scope vs out-of-scope

  | In scope | Out of scope |
  |---|---|
  | `COALESCE(plugin.update_portal_url, manufacturer.update_portal_url)` | Every historical `version_observations.source_url` |
  | Optional manufacturer `website_url` / `changelog_url` as secondary | Authenticated deep portal pages |
  | Target **~1,200–1,700** URLs | Mass HEAD of evidence archive (~4,800) |

  ## Table sketch

  ```sql
  CREATE TABLE portal_url_liveness (
    url_hash TEXT PRIMARY KEY,           -- sha256(canonical_url)
    url TEXT NOT NULL,
    host TEXT NOT NULL,
    url_class TEXT NOT NULL,             -- manufacturer_portal|plugin_portal|website|changelog|hub_download
    tier INTEGER,                        -- min popularity_tier of referencing rows
    ref_plugin_count INTEGER NOT NULL,
    ref_manufacturer_ids TEXT,           -- JSON array
    check_tier TEXT NOT NULL,            -- T0|T1|T2|T3
    last_checked_at TEXT,
    last_status_class TEXT,              -- live|redirect_ok|login_wall|soft_404|hard_dead|blocked|error
    last_http_status INTEGER,
    last_final_url TEXT,
    last_latency_ms INTEGER,
    consecutive_failures INTEGER DEFAULT 0,
    next_check_at TEXT,
    notes TEXT
  );
  ```

  Canonicalization: lowercase host; strip `#fragment` + `utm_*`; keep significant query (`?product=`, article ids); HTTPS preferred; collapse trailing-slash variants.

  ## Seed + check_tier assignment

  ```sql
  SELECT
    COALESCE(NULLIF(p.update_portal_url,''), m.update_portal_url) AS url,
    MIN(COALESCE(p.popularity_tier, m.popularity_tier)) AS tier,
    COUNT(*) AS ref_plugin_count
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  GROUP BY 1;
  ```

  | check_tier | Rule | Cadence |
  |---|---|---|
  | **T0** | `tier=1` AND (`ref_plugin_count ≥ 20` OR known hub host: Native Access, Waves, PA, IK, UA, Spitfire, UVI, Softube, Melda, Arturia, EastWest, Steinberg, Avid, SSL, Slate, iZotope, Antares, Output, Spectrasonics) | every **3 days** |
  | **T1** | other tier-1 portals | every **7 days** |
  | **T2** | tier-2 | every **21 days** |
  | **T3** | tier≥3 / long-tail | every **45–60 days** |

  Hub hosts get T0 even for a single manufacturer row — one dead Waves URL hurts hundreds of CTAs.

  ## Check protocol (human-ish)

  Method ladder:
  1. **HEAD** browser-like UA + `Accept: text/html` (10s).
  2. If 405/403/429 → **GET** first 8 KiB (Range or early abort).
  3. If JS-shell / challenge → mark `blocked` or escalate **one** rendered-browser probe **per host per day** (not per URL).
  4. Never authenticate; never POST; never open account portals beyond public landing.

  Rate limits (hard):

  | Scope | Limit |
  |---|---|
  | Global | ≤ **30 checks/minute**; burst ≤ 10 |
  | Per host | ≤ **1 / 20s**; hubs (Waves, NI, PA, Arturia, Softube) ≤ **1 / 45s** |
  | Per daily job | ≤ **250 checks** wall-clock (~15–20 min) |
  | Concurrent | **1** in-flight per host; global **4** |
  | On 429 / WAF | Cool host **24h**; log; **do not** rotate UAs as evasion; no retry storm |

  Jitter: `next_check_at = due + random(0..cadence*0.25)`.

  ## Budget math (~1,500 URLs)

  Assume mix ~80 T0 / 400 T1 / 500 T2 / 520 T3:

  | Tier | Cadence | Steady checks/day |
  |---|---|---|
  | T0 | 3d | ~27 |
  | T1 | 7d | ~57 |
  | T2 | 21d | ~24 |
  | T3 | 45d | ~12 |
  | **Total** | | **~120/day** |

  Plus retry queue ≤40/day. Fits one mild job. First inventory fill: spread over **14 days** (~110/day) so day-1 doesn’t look like a scrape.

  ## Status classifiers

  | Class | Detection | Catalog effect |
  |---|---|---|
  | `live` | Final 2xx; not soft-404; optional download/update/product/account keyword or known hub brand | Clear failures |
  | `redirect_ok` | 301/302 to same registrant / known hub | Treat as live; store `last_final_url` |
  | `login_wall` | 200/401/403 with login/signin/sso markers | **Not dead** — expected for hub_walled |
  | `soft_404` | 200 but not-found/removed/deprecated OR homepage fallback with path stripped | Failure toward dead |
  | `hard_dead` | 404/410/NXDOMAIN/TLS name fail | Failure |
  | `blocked` | 429/403 WAF/challenge empty product | **Do not mark dead**; cool host |
  | `error` | Timeout / DNS flap / tool_failure | Soft; need 2 consecutive |

  Dead threshold: `hard_dead` or `soft_404` on **≥2 consecutive** successful-classification checks (≥24h apart), and not blocked/error-only.

  On dead: flag resolving manufacturers/plugins; dashboard alert; **one** remediation chip (Wayback / nav) — not perpetual. Prefer alternate live `website_url` for export if available; don’t silently drop URL string (Cursor may need it).

  ## Anti-army shape

  1. Host cooldowns — one Waves check covers ~260 plugin CTAs.
  2. Deduplicate by URL before enqueue.
  3. Priority = `f(tier) * log2(1+ref_plugin_count) * overdue_factor`.
  4. Never check observation evidence URLs in this job.
  5. Browser escalation pool: max **15 rendered pages/day** total (T0 soft-404 suspects / JS hubs).
  6. Single stable desktop UA; no UA rotation; honor robots.txt Crawl-delay and Disallow (fallback to homepage liveness only).

  ## Job shape (pairs with freshness)

  ```
  06:00 PT daily push (existing)
  22:00 PT portal_liveness_sweep.py
    - select due URLs by priority (cap 250)
    - check with limits above
    - write portal_url_liveness
    - emit dashboard counters + dead list NOTES if any new dead
  ```

  ## KPIs

  | KPI | Healthy |
  |---|---|
  | Open due backlog | < 1 day of work (~120) |
  | T0 live rate | ≥ 98% |
  | New dead (7d) | Investigate same day |
  | Hosts in 24h cooldown | Track; >5 ⇒ too aggressive |
  | Checks/day | 80–200 steady |
  | False dead (reverted 7d) | 0 |

  Widget: **Portal CTA health** — % live by check_tier; table of dead URLs with `ref_plugin_count`.

- **If accepted, what changes in the engine:**
  - New `portal_url_liveness` table + daily sweep script.
  - Dashboard Portal CTA health widget; feed TAXONOMY/FRESHNESS (dead portal ≠ version unknown — infrastructure debt).
  - `login_wall` treated healthy for hub_walled vendors.
  - Liveness job never writes versions; freshness never mass-HECKs portals.
  - No Luke involvement; no app telemetry.

- **Expected impact:**
  - Honest CTAs for ~1.2–1.7k URLs at ~120 checks/day — cheap, durable, non-hostile.
  - Catches dead Waves/NI/PA landings before users.
  - Completes the integrity quartet with taxonomy / freshness / retraction (SYNTHESIS).

- **Risks / caveats:**
  - Misclassifying hub login landings as dead would nuke CTAs — classifier tests mandatory (Native Access fixture).
  - Waves/Incapsula may return challenge on HEAD — use `blocked` not `hard_dead`; escalate sparingly.
  - Soft-404 homepage fallbacks are vendor-specific — maintain pattern list.
  - Do not expand scope to full observation URL archive without a separate design.

- **Suggested first step:**
  RO seed query → inventory CSV of distinct CTA URLs with ref_plugin_count; manually classify top 20 T0 hubs once; implement table + T0-only sweep for 1 week before enabling T1–T3.

- **New evidence since last verdict:**
  Verdicts empty; portal_app counts (PA 294 / Softube 164 / SSL 69); full tier math + classifiers from `advisory-deep/integrity/PORTAL-LIVENESS.md`.
