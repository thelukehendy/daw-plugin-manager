# Waves browser RN evidence — 756KB SUCCESS vs Incapsula curl (no V17 stamp)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — Hub-walled Waves. WAVE-2 deepens `2026-09-25-waves-incapsula-oracle-deep.md` with **confirmed box-browser fetch SUCCESS** (756 KB Webpage Complete), DOM/parser notes from `WAVES-EXTRACT.md`, New Plugin ≥20 list, Fixed-in scopes, Playwright recipe, and CRITICAL no-V17-stamp rule.
- **Context / evidence:**
  - Canonical: https://www.waves.com/downloads/release-notes · offline companion `…/latest-offline-installer`
  - **Curl:** HTTP 200 **212 B** Incapsula stub (`SWJIYLWA` / `_Incapsula_Resource`) — not content. Softube RN curl ~79 KB same day → vendor WAF, not egress death.
  - **Browser (box desktop, 2026-09-24 PT):** SUCCESS. Saved Webpage Complete → `advisory-deep/hubs/raw/waves-rn-browser.html` = **756,723 bytes** + `waves-rn-browser_files/`. Visible text extract `waves-rn-visible.txt` (~100 KB). Parse summary `waves-browser-parse.json`. Specs: `WAVES-EXTRACT.md`, `WAVES-DIFF-SPEC.md`.
  - **Waves Central v17.0.4** (Aug 2, 2026 section): “Waves Central v17.0.4 is now available…”
  - **V17 bulk (June 23, 2026):** “All Waves Plugins: Across-the-board software update to V17” + New Features / Bug Fixes blocks.
  - **New Plugin list (≥20 clear names from parser / EXTRACT):** Atlas Reverb; Curves Resolve; Magma StressBox; L4 Ultramaximizer; Clarix LB; InTrigger; Curves AQ; Sync Vx; Immersive Wrapper; IDX Intelligent Dynamics; Curves Equator; Space Rider; Feedback Hunter; Silk Vocal; Magma Springs; Key Detector; Clarity Vx DeReverb; Clarity Vx DeReverb Pro; Voltage Amps; Magma Tube Channel Strip; BB Tubes; Lil Tube; Waves Harmony (+ archive names e.g. COSMOS, CR8, SSL EV2, CLA Nx, Vocal Bender).
  - **Fixed-in scopes (V17 June 23 cohort examples):** All Waves plugins; All Instrument plugins; Waves Applications; Curves Series (AQ, Equator, Resolve); CLA MixHub; COSMOS; Curves AQ; Doubler; GTR Tool Rack / Solo Tool Rack; IDX; Immersive Wrapper; L4; Magma BB Tubes; MultiMod Rack; ReelADT; Waves Harmony; WLM Plus; H-EQ; RChannel; CR8; OVox; Scheps Omni Channel; StudioVerse; Sync Vx; TG12345 (26+ scopes).
  - DOM (EXTRACT): dated blocks as `<p class="waves-h4">June 23, 2026</p>` → title `<p class="waves-p pt-5"><strong>…` → `<ul class="waves-ul">` / nested `<li>`; labels in `<strong>` / `<a>`; V17 uses `<p class="waves-h3">Bug Fixes in Waves V17</p>`; older dates may use ordinal suffixes (`Month Dth, YYYY`); parse **rendered tree**, not brittle raw-ul assumptions.
  - Fixtures tip: `WAVE2-FIXTURES.json` → `waves_central: 17.0.4`, `waves_v17_date: June 23, 2026`.

- **Recommendation:**
  Ship / harden `waves-rn-oracle-v1` on **Playwright primary + browser-render fallback**; persist snapshots; diff per DIFF-SPEC; emit advisories **without** catalog-wide V17 stamps.

  ## Playwright / browser recipe

  ```
  UA = Chrome 128+ desktop
  GET release-notes WITH browser_engine=playwright
    wait_until=networkidle OR selector "Waves Central v" OR "Across-the-board"
  IF body_bytes < 5000 OR "Incapsula" in body OR "SWJIYLWA" in body:
    fetch_degraded=true; retry once via webfetch/browser-render
    IF still degraded: alert waves_oracle_blocked; DO NOT clear last good snapshot
  ELSE:
    persist raw HTML + sha256 + fetched_at
    parse() → snapshot N; diff(N-1,N) → advisories
  ALSO GET latest-offline-installer with SAME browser path
  Cadence: hash RN daily; full parse on hash change
  ```

  Headers alone are necessary but **not sufficient** — JS challenge required. Never treat size≈212 as success.

  ## CRITICAL — never stamp V17 onto every SKU

  Across-the-board V17 (and future VN) → **one** `waves.generation_bump` (+ narrative under that event). Optional `plugin.waves_generation = 17` if schema has a generation lane. **NOT** `plugin.version = "17"` / `"V17"` for every Waves SKU. Per-SKU version **only** from explicit hotfix lines, product-specific build tuples, or offline pins naming a concrete build. Cohort Fixed-in keys (`All Waves plugins`, …) are **not** SKUs.

  ## Emit map (reminder)

  | Signal | Kind | Catalog write |
  |---|---|---|
  | generation bulk | `waves.generation_bump` | generation field only |
  | Central / LV1 / Driver / Sync Vx builds | `waves.app_build` | that app cell only |
  | New Plugin: Name | `waves.new_plugin` | candidate SKU |
  | Fixed in X: | `waves.fixed_in` | changelog; version unchanged unless hotfix |
  | Hotfix Update: Name vX | `waves.hotfix` | that product only |

- **If accepted, what changes in the engine:**
  - Playbook: Playwright path + stub detector + last-good retention; parser prefers DOM classes from EXTRACT.
  - Unit fixtures: Central 17.0.4; V17 bulk → zero SKU writes; Atlas in new_plugins; CR8 in fixed_in[2026-06-23].
  - Dashboard: `waves_oracle_blocked`; days since last good snapshot (>5000 B, no Incapsula).

- **Expected impact:**
  Highest hub-walled advisory yield (generation + Central/LV1 + New Plugin + Fixed-in) without false per-SKU churn. Closes the “HTTP 200 stub looks healthy” failure mode.

- **Risks / caveats:**
  Playwright flakiness / IP drift — keep last good. Offline pin Central 16.7.2 vs RN Central 17.0.4 are different surfaces. Do not automate Central login.

- **Suggested first step:**
  Land stub detector + one successful Playwright snapshot write; assert V17 bulk → zero SKU version writes before enabling raises for app_builds.

- **New evidence since last verdict:**
  Verdicts empty; **browser HTML 756 KB SUCCESS** vs curl 212 B; EXTRACT DOM notes; ≥20 New Plugin names; Fixed-in scope list; WAVE2-FIXTURES tips.
