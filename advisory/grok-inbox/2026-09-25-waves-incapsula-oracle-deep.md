# Waves Incapsula oracle — browser path + diff spec (no V17 stamp)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — Hub-walled vendor discovery (Waves). Deepens `2026-09-24-hub-walled-oracle-priorities.md` with confirmed Incapsula failure mode, Playwright/WebFetch-only fetch recipe, snapshot/diff algorithm, and hard rule: **never stamp generation V17 onto every SKU**.
- **Context / evidence:**
  - Canonical URLs:
    - https://www.waves.com/downloads/release-notes
    - https://www.waves.com/downloads/latest-offline-installer
    - https://www.waves.com/downloads
  - Live 2026-09-24 PT: bare/light curl → **HTTP 200 with ~212-byte Incapsula stub**:
    ```html
    <html><head>
    <META NAME="robots" CONTENT="noindex,nofollow">
    <script src="/_Incapsula_Resource?SWJIYLWA=..."></script>
    <body></body></html>
    ```
    Probed `/release-notes/`, `/r/…`, `/api/…`, `.json`, appcast paths — all stubbed from datacenter egress. Evidence: `advisory-deep/hubs/raw/waves-rn.html`, `probe-body.tmp` (212 B).
  - Browser / WebFetch path returns full RN (~600–700 KB) with dated sections.
  - Softube RN curl 200 ~79 KB same day → Waves block is **vendor WAF**, not general egress failure.
  - Live quotes (WebFetch): `Waves Central v17.0.4` · `Across-the-board software update to V17` @ June 23, 2026 · Offline `Last updated: June 23rd, 2026` · pins Central `16.7.2`, LV1 `16.5.289.393`, SuperRack `15.15.12.23` · `New Plugin: Atlas Reverb`.
  - Waves is hub-walled for per-SKU builds; public RN is still a high-yield **generation / app_build / new_plugin / fixed_in** oracle when fetched correctly.

- **Recommendation:**
  Ship `waves-rn-oracle-v1` with Playwright primary + browser-render fallback; persist snapshots; diff; emit advisories **without** catalog-wide V17 stamps.

  ## Fetch recipe

  ```
  UA = Chrome 128+ desktop UA
  GET release-notes WITH browser_engine=playwright
    wait_until=networkidle OR selector matching "Waves Central v" OR "Across-the-board"
  IF response.body_bytes < 5000 OR "Incapsula" in body OR "SWJIYLWA" in body:
    mark fetch_degraded=true
    retry once via webfetch/browser-render fallback
    IF still degraded: alert "waves_oracle_blocked"; DO NOT clear last good snapshot
  ELSE:
    persist raw HTML + sha256 + fetched_at
    parse() → snapshot N
    diff(N-1, N) → advisories
  ALSO GET latest-offline-installer with SAME browser path
  ```

  **Cadence:** hash RN daily; full parse on hash change. Offline page weekly or on RN change.

  Headers alone (Accept / Sec-Fetch / modern UA) are **necessary but not sufficient** — JS challenge required. Do **not** treat size≈212 or Incapsula markers as success.

  ## Page structure → parse model

  | Kind | Pattern | Emits |
  |---|---|---|
  | A. Dated section | `September 22, 2026` | `date` |
  | B. Generation bulk | `All Waves Plugins: Across-the-board software update to V17` | `generation_event` **only** |
  | C. Central / app | `Waves Central v17.0.4…` | `app_build` |
  | D. Live/driver builds | eMotion LV1 / SoundGrid Driver / SuperRack / Sync Vx tuples | `app_build` |
  | E. New Plugin | `New Plugin: Atlas Reverb` | `new_plugin` |
  | F. Fixed-in / hotfix | `Fixed in CR8:` · `Hotfix Update: L4 Ultramaximizer v1.0.1` | `fixed_in` / `hotfix` |
  | G. Feature bullets under VN | narrative under generation_event | **not** per-SKU versions |

  ## Snapshot schema (persist per successful fetch)

  ```json
  {
    "fetched_at": "2026-09-24T18:00:00-07:00",
    "source_url": "https://www.waves.com/downloads/release-notes",
    "content_sha256": "...",
    "fetch_degraded": false,
    "generation_current": 17,
    "generation_events": [
      {"date": "2026-06-23", "generation": 17, "headline": "Across-the-board software update to V17"}
    ],
    "app_builds": {
      "Waves Central": {"version": "17.0.4", "date": "2026-08-02"},
      "eMotion LV1": {"version": "16.5.289.393", "date": "2026-04-27"}
    },
    "new_plugins": {"Atlas Reverb": {"date": "2026-07-27"}},
    "fixed_in": {"2026-06-23": {"CR8": ["…"], "All Waves plugins": ["…"]}},
    "hotfixes": {"L4 Ultramaximizer": {"version": "1.0.1", "date": "2025-11-13"}},
    "offline": {
      "last_updated": "2026-06-23",
      "plugin_generation": 17,
      "pins": {"Waves Central": "16.7.2", "eMotion LV1": "16.5.289.393"},
      "plugin_inventory": ["Abbey Road Chambers", "…"]
    }
  }
  ```

  ## Diff → advisory kinds

  | Diff signal | Advisory kind | Catalog write rule |
  |---|---|---|
  | New higher generation_event | `waves.generation_bump` | Update **bundle/generation** field only; **never** set every plugin `version=V17` |
  | app_builds[k] changed | `waves.app_build` | That app cell only |
  | new_plugins key added | `waves.new_plugin` | Candidate SKU insert |
  | fixed_in changed | `waves.fixed_in` | Changelog snippet; version unchanged unless hotfix |
  | hotfixes version changed | `waves.hotfix` | That product patch only |
  | offline pins / inventory delta | `waves.offline_pin` / `waves.inventory_delta` | Pins / names only |

  ### Hard rule — V17 (and future VN) bulk

  When parser sees Across-the-board → VN:

  1. Emit **one** `waves.generation_bump`.
  2. Store feature/bug bullets on that event.
  3. **NOT** iterate catalog setting `plugin.version = "17"` / `"V17"`.
  4. Optional `plugin.waves_generation = 17` if schema has a generation lane — still distinct from `version`/`build`.
  5. Per-SKU `version` updates **only** from explicit hotfix lines, product-specific build tuples, or offline pins naming a concrete build.

  Rationale: shared WaveShell generation coexists with distinct builds (e.g. Sync Vx `16.8.136.297` after V16 day). Stamping gen onto every SKU creates false churn.

  ## Confidence ladder

  | Level | Condition |
  |---|---|
  | High | Browser fetch OK + app_build or generation_event with date |
  | Med | new_plugin / fixed_in / offline pin |
  | Low | Inventory name-only delta |
  | None | `fetch_degraded` — suppress publishes; keep last good snapshot |

  ## DO-NOT-GRIND

  - Waves Central login / Creative Access APIs / authenticated `.cen` downloads
  - Forum threads as primary oracle
  - Blind appcast guessing (also Incapsula-stubbed)
  - Catalog-wide `version=V17` stamp
  - Publishing from 212-byte stubs

  ## Regression fixtures (must pass)

  ```
  GEN: "All Waves Plugins: Across-the-board software update to V17" @ June 23, 2026
  APP: "Waves Central v17.0.4" @ August 2, 2026
  APP: "eMotion LV1 … v16.5.289.393" @ April 27, 2026
  NEW: "New Plugin: Atlas Reverb" @ July 27, 2026
  FIX: "Fixed in CR8:" under V17 Bug Fixes @ June 23, 2026
  OFF: "Last updated: June 23rd, 2026" / "Waves Central 16.7.2" / "All Waves plugins V17"
  ```

  Assert: V17 bulk → exactly one generation_event; **zero** SKU version writes; Central 17.0.4 present; Atlas in new_plugins; CR8 in fixed_in[2026-06-23].

- **If accepted, what changes in the engine:**
  - Playbook Waves section: primary path = Playwright; stub detector; last-good snapshot retention.
  - Implement parser/diff per `WAVES-DIFF-SPEC.md` (operator copies into playbooks).
  - Optional schema lane `waves_generation` separate from version.
  - Resolvability: Waves plugins stay `hub_walled` for per-SKU unless hotfix/app_build applies; Central/LV1/Driver rows `open` via app_build.
  - Dashboard: `waves_oracle_blocked` alert; days since last good snapshot.

- **Expected impact:**
  - Highest hub-walled advisory yield this week (generation + Central/LV1 + New Plugin + Fixed-in) without false per-SKU churn.
  - Stops silent “success” on Incapsula stubs that previously looked like HTTP 200.
  - Aligns with Softube suite-vs-SKU anti-pattern (same class of bulk-stamp bug).

- **Risks / caveats:**
  - Playwright flakiness / residential IP drift — keep last good snapshot; never clear on degrade.
  - Offline pin Central `16.7.2` vs RN Central `17.0.4` — different surfaces; do not auto-reconcile without rules (prefer RN app_build for Central app row; offline as pin inventory).
  - Fixed-in cohort keys (`All Waves plugins`) are not SKUs.
  - Do not propose Luke credentials or Central login automation.

- **Suggested first step:**
  Land stub detector + Playwright fetch writing snapshots only; unit-test V17 bulk → zero SKU writes using WebFetch excerpt; Muse reviews one successful snapshot before enabling raises for app_builds.

- **New evidence since last verdict:**
  Verdicts empty; confirmed **212 B Incapsula stub** on curl vs full browser page; Softube curl control; full diff spec from `advisory-deep/hubs/WAVES-DIFF-SPEC.md` + REPORT.md.
