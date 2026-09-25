# Plugin Alliance changelog parser spec — deep implementable chip

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #3 — Plugin Alliance changelog-diff walk. Deepens `2026-09-24-plugin-alliance-changelog-walk.md` with a full parser spec, sample evidence (n=50 / 280 handles), SQL claim batches, and anti-patterns (Installation Manager hub contamination).
- **Context / evidence:**
  - Live Shopify inventory 2026-09-24 PT: `GET https://www.plugin-alliance.com/products.json?limit=250&page=N` → **280 handles** (`advisory-deep/pa/all-handles.txt`). Page1=250, page2=30.
  - Coordinator sample **50** product HTML URLs: **46/49 singles (93.9%)** have dated Changelog top version; 1 bundle + 3 collection/suite-like misses. Full table in `advisory-deep/pa/sample-results.json` / `REPORT.md`.
  - Confirmed fixture: `bx_console-ssl-4000-e` → Changelog top **`1.8.0 (Jan 12, 2026)`** while page chrome Installation Manager = **`1.4.0`**. Treating IM as plugin version poisons advisories.
  - Brief state: Plugin Alliance **291 plugins / 261 versioned**; portal_app includes **PA Installation Manager (294)**. Stale amber/yellow block unblocked by this oracle.
  - URL rule: `/products/{handle}` works; **`/en/products/{handle}` soft/real 404**. Changelog is **not** in `.json` `body_html` — HTML metafield only.
  - Operator brief: catalog **green 3958 / amber 347 / yellow 1346**; PA is a Tier-1 freshness/oracle win, not a dig grind.

- **Recommendation:**
  Ship a Muse chip `pa-changelog-oracle-v1` that (1) weekly refreshes the 280-handle inventory from `products.json`, (2) nightly walks stale non-bundle handles at ≤1–2 req/s, (3) parses **only** the Changelog metafield, (4) emits version observations when confidence ≥ 0.80, (5) **never** uses Installation Manager `hub_im` as `observed_version`.

  ## URL construction

  ```
  base = "https://www.plugin-alliance.com"
  product_url(handle) = f"{base}/products/{handle}"
  product_json(handle) = f"{base}/products/{handle}.json"
  ```

  | Do | Don't |
  |---|---|
  | `/products/{handle}` | `/en/products/{handle}` |
  | ASCII handles from inventory | Guess branded prefixes (`maag-eq4` ✗ → `eq4` ✓) |
  | `User-Agent: Mozilla/5.0` | Authenticated/session scraping |
  | HTML for versions | Rely on `.json` body_html for changelog |

  ## Fetch algorithm

  ```
  function fetch_pa_product(handle):
    url = product_url(handle)
    resp = HTTP_GET(url, headers={User-Agent: "Mozilla/5.0"}, timeout=60)
    if resp.status != 200:
      return miss(extract_method="pa_http_error", http_status=resp.status)
    html = resp.body
    if is_soft404(html, resp):
      return miss(extract_method="pa_soft404")
    if challenge_wall(html):  # rare; theme scripts alone OK
      return miss(extract_method="pa_captcha")
    return parse_pa_html(handle, url, html)
  ```

  Soft404 heuristic: HTTP 404, or ~520–535 KB “not found” shell, or missing Product JSON-LD / `meta.product` for handle.

  ## HTML isolation (changelog only)

  Observed structure:

  ```html
  <details>
    <summary>…<h3>Changelog</h3>…</summary>
    <div class="collapsible-content">
      <h4>{Product} Changelog</h4>
      <div class="metafield-rich_text_field">…</div>
    </div>
  </details>
  ```

  ```regex
  CHANGELOG_BLOCK = (?is)<h3>\s*Changelog\s*</h3>.*?</summary>\s*<div class="collapsible-content">(.*?)</details>
  METAFIELD       = (?is)<div class="metafield-rich_text_field">(.*?)</div>
  ```

  Plain-text pipeline: replace `<br>`/`</p>` → `\n`; strip tags; `html.unescape`. Parse versions **only** from this text.

  ## Version regexes

  Primary (PA / Brainworx):

  ```regex
  VERSION_PA = (?i)Version\s+(\d+(?:\.\d+){1,3})\s*(?:\(([^)]+)\))?
  ```

  Examples: `Version 1.8.0 (Jan 12, 2026)` · `Version 1.0 (Jan 28, 2026)` · `Version 1.16.1 (Feb 26, 2026)`.

  **Top version = first match** (newest listed first).

  Secondary (Unfiltered MD), only if primary yields zero:

  ```regex
  VERSION_MD = (?m)^(?:#{1,4}\s*)?(\d+(?:\.\d+){1,3})\s*\((\d{1,2}/\d{1,2}/\d{4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})\)
  ```

  Example: `### 1.1.11 (06/23/2023)` on `lo-fi-af`.

  Forbidden hub:

  ```regex
  IM_HUB = (?i)Installation Manager\s+v?(\d+(?:\.\d+){1,3})
  ```

  Store as `hub_im_version` diagnostic only. **Never** as `top_version`. Assert on fixture SSL 4000 E: `top_version != hub_im` (1.8.0 ≠ 1.4.0).

  ## Bundle / suite skip

  ```regex
  BUNDLE_HANDLE = (?i)(bundle|suite|collection|complete-bundle|heritage|essentials|mixing-set|mastering-studio)
  ```

  Hard skips from sample: `brainworx-mix-essentials-bundle-1`, `brainworx-creative-mixing-set`, `bx_ssl-collection`, `bx_mastering-studio`. Collection pages with foreign plugin changelogs → `pa_hub_contamination` (confidence ≤ 0.50).

  ## Date normalization

  Try formats: `%b %d, %Y` · `%B %d, %Y` · `%d %b, %Y` · `%m/%d/%Y` · `%Y-%m-%d` (zero-padded days OK). Keep `date_raw` if parse fails; lower confidence.

  ## extract_method + confidence

  | Code | Meaning |
  |---|---|
  | `pa_changelog_pa_version` | Primary regex in metafield |
  | `pa_changelog_md_heading` | MD fallback |
  | `pa_no_changelog` | 200 OK, no section |
  | `pa_changelog_unparsed` | Section present, no regex |
  | `pa_skip_bundle` | Bundle policy |
  | `pa_hub_contamination` | Collection / foreign changelog |
  | `pa_soft404` / `pa_http_error` / `pa_captcha` | Fetch failures |

  | Score | Condition |
  |---|---|
  | 0.92–0.95 | PA version + `date_iso` + not bundle |
  | 0.85–0.90 | MD + date, or PA + raw date only |
  | 0.70–0.80 | Version without date |
  | ≤0.50 | hub contamination |
  | 0.05–0.15 | no changelog |
  | 0 | soft404 / http_error / captcha |

  Emit advisory / raise when confidence ≥ 0.80 and semver_lt(installed, top). Coerce `1.0` → `1.0.0` for ordering.

  ## Evidence blob

  ```json
  {
    "vendor": "plugin_alliance",
    "handle": "bx_console-ssl-4000-e",
    "url": "https://www.plugin-alliance.com/products/bx_console-ssl-4000-e",
    "fetched_at": "2026-09-24T18:07:00-07:00",
    "http_status": 200,
    "content_sha256": "<sha256 of changelog metafield plain text>",
    "changelog_present": true,
    "top_version": "1.8.0",
    "top_date_raw": "Jan 12, 2026",
    "top_date_iso": "2026-01-12",
    "hub_im_version": "1.4.0",
    "extract_method": "pa_changelog_pa_version",
    "confidence": 0.93,
    "is_bundle": false,
    "n_version_entries": 11
  }
  ```

  Store ≤2 KB plain-text snippet, not full ~600 KB HTML.

  ## Sample top-15 (evidence)

  | handle | top_version | top_date |
  |---|---|---|
  | bx_console-ssl-4000-e | 1.8.0 | Jan 12, 2026 |
  | bx_glue | 1.1.0 | Feb 13, 2025 |
  | bx_opto | 1.11.0 | Feb 06, 2026 |
  | bx_limiter | 1.16.1 | Feb 26, 2026 |
  | elysia-alpha-compressor-v2 | 2.2.0 | Dec 18, 2025 |
  | bx_tonebox | 1.0 | Jan 28, 2026 |
  | bx_dyneq-v2 | 2.18.0 | Aug 12, 2026 |
  | bx_paneq | 1.10.0 | Mar 31, 2026 |
  | bx_saturator-v2 | 2.13.1 | Mar 2, 2026 |
  | bx_console-n | 1.10.1 | Feb 5, 2026 |
  | bx_rockrack-v3 | 3.10.0 | Jan 19, 2026 |
  | bx_cleansweep-v2 | 2.17.0 | Dec 17, 2025 |
  | bx_meter | 1.18.0 | 13 Jan, 2026 |
  | bx_shredspread | 1.19.0 | Feb 5, 2026 |
  | bx_rockergain100 | 1.4.0 | Jan 16, 2026 |

  Note: `bx_rockergain100` top **1.4.0** equals hub IM **1.4.0** by coincidence — still require metafield-scoped parse (do not invent “IM equals plugin” shortcuts).

  ## Cadence / cost

  | Job | Cadence | GETs |
  |---|---|---|
  | Handle inventory | Weekly / sitemap ETag | ~3 |
  | Full HTML oracle | Nightly OR rolling 40 claims/hour | ≤280 |
  | On-demand | User opens stale (>7d) plugin | 1 |
  | Throttle | 250–500 ms; 1–2 workers | Full walk ~3–6 min |
  | Cache | Skip parse if `content_sha256` unchanged | |

- **If accepted, what changes in the engine:**
  - New playbook `catalog-store/playbooks/plugin-alliance-changelog.md` (or extend existing PA playbook) with this parser + test vectors.
  - Claim-ledger SQL (illustrative — adapt to Muse schema):

  ```sql
  -- Inventory upsert from products.json walk
  INSERT INTO vendor_products (vendor, handle, product_url, brand, title, is_bundle, last_listed_at)
  VALUES ($1,$2,$3,$4,$5,$6, datetime('now'))
  ON CONFLICT (vendor, handle) DO UPDATE SET
    title=excluded.title, brand=excluded.brand, is_bundle=excluded.is_bundle,
    last_listed_at=datetime('now');

  WITH claimable AS (
    SELECT id, handle FROM vendor_products
    WHERE vendor = 'plugin_alliance'
      AND COALESCE(is_bundle, 0) = 0
      AND (oracle_fetched_at IS NULL
           OR oracle_fetched_at < datetime('now', '-7 days')
           OR (changelog_present = 0 AND oracle_fetched_at < datetime('now', '-30 days'))
           OR confidence < 0.8)
      AND (claim_until IS NULL OR claim_until < datetime('now'))
    ORDER BY oracle_fetched_at NULLS FIRST
    LIMIT 40
  )
  UPDATE vendor_products
  SET claim_owner = :worker, claim_until = datetime('now', '+30 minutes')
  WHERE id IN (SELECT id FROM claimable);

  -- Advisory candidates
  SELECT i.plugin_id, i.installed_version, v.handle, v.top_version, v.top_date_iso, v.confidence, v.product_url
  FROM installed_plugins i
  JOIN vendor_product_map m ON m.plugin_id = i.plugin_id
  JOIN vendor_products v ON v.id = m.vendor_product_id
  WHERE v.vendor = 'plugin_alliance'
    AND v.confidence >= 0.80
    AND v.changelog_present = 1
    AND semver_lt(i.installed_version, v.top_version);
  ```

  - Curated `vendor_product_map` for PA handles (prefer exact handle over fuzzy). Identity tips: `elysia-alpha-compressor-v2` not bare `alpha-…`; Mäag EQ4 → `eq4`.
  - Dashboard: PA oracle hit-rate widget (singles dated rate; alert if <85%).
  - Zero-trust: raises still need observation + confidence band; this is the manufacturer oracle, not a bypass.

- **Expected impact:**
  - Unblocks ~261 versioned PA rows for durable freshness; expected singles hit rate ≈ **94%** from sample.
  - Removes recurring IM/`1.4.0` contamination risk across ~294 portal_app-linked rows.
  - Nightly cost negligible (~3–6 min polite crawl); no Luke input; no browser required.

- **Risks / caveats:**
  - Theme HTML change (no `<h3>Changelog</h3>`) → sudden hit-rate drop; alert + broaden selectors.
  - Collection/hub contamination if skip regex incomplete.
  - Rate limit 429 → exponential backoff; do not UA-rotate as evasion.
  - `bx_rockergain100`-class coincidence where plugin version equals IM — unit test must prove metafield scope, not value inequality alone.
  - Catalog has 291 plugins vs 280 Shopify handles — map gap needs curated reconciliation (bundles, retired SKUs, dual-listed brands).

- **Suggested first step:**
  Implement parser unit tests against cached HTML for the five test vectors (SSL 4000 E, bx_tonebox, mix-essentials-bundle, bx_ssl-collection, lo-fi-af MD), then run a one-shot RO walk of all 280 handles writing evidence JSONL only (no catalog writes) for Muse review.

- **New evidence since last verdict:**
  Verdicts empty as of write; deepens 2026-09-24 PA walk with live n=50 sample, 280-handle inventory, full regex/SQL/anti-pattern pack from `advisory-deep/pa/`.
