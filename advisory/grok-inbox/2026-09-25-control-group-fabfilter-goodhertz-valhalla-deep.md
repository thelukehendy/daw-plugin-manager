# Easy-green control group — FabFilter / Goodhertz / Valhalla canaries

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Novel dig documents what “easy green” freshness looks like. Muse needs exact URLs + quote patterns as **regression canaries** for the freshness sweep / hold→verified_at path (not new discovery).
- **Context / evidence:**
  - Dig: `/workspace/advisory-deep/novel/REPORT.md` §7.
  - **LIVE-FETCH 2026-09-24 PT (all HTTP 200):**

  ### FabFilter — one page, per-plugin `version — date`
  - **URL:** `https://www.fabfilter.com/download`
  - **Quote pattern:** after `Download FabFilter <Name>` / `<h2>`, body line `x.y — Mon DD, YYYY` (HTML entity `&mdash;`).
  - **Live samples:**
    - Pro-Q 4 → **`4.13 — Jun 25, 2026`**
    - Pro-C 3 → **`3.02 — Apr 16, 2026`**
    - Pro-L 2 → **`2.26 — Apr 16, 2026`**
    - Pro-R 2 → `2.06 — Apr 16, 2026`; Pro-MB `1.33`; Pro-DS `1.32`; Pro-G `1.42`; Saturn 2 `2.13`; Timeless 3 `3.10`; Volcano 3 `3.09`; Twin 3 `3.07`; One `3.52`; Simplon `1.42`; Micro `1.32`
  - Recipe: single GET; regex `([0-9]+\.[0-9]+)\s*[—\-–]\s*([A-Za-z]+ [0-9]+, [0-9]{4})` scoped under each product block. Confidence **95**.

  ### Goodhertz — one shared bundle
  - **URL:** `https://goodhertz.com/downloads/`
  - **Live quotes:** heading **`Latest Bundle Release`** / **`Goodhertz 3.14.1`** / **`June 30, 2026`**; copy says installer is for all plugins.
  - Recipe: parse bundle name + date; stamp **shared** `3.14.1` onto all Goodhertz plugin rows. Confidence **95**. `/changelog` still dead — do not use.

  ### Valhalla DSP — per-product shop pages
  | Product URL | Live tip quote |
  |---|---|
  | `https://valhalladsp.com/shop/reverb/valhalla-room/` | **`Current Version: 2.0.5 (Updated March 15, 2024)`** |
  | `https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/` | **`Current Version: 4.0.5 (updated March 15, 2024)`** |
  | `https://valhalladsp.com/shop/reverb/valhalla-supermassive/` | **`Current Version: 5.0.0 (Updated November 26th, 2025)`** |

  - Recipe: GET each shop URL; grep `Current Version:`; confidence **95**. Snippet/cache interim ≠ first-hand `verified_at` refresh.

  **Why easy green:** fixed public URLs, explicit semver + date, no login, no scope ambiguity, low change cadence but **deterministic** re-fetch.

- **Recommendation:**
  Chip pack **`control-group-canary-v1`** (or three micro-chips):
  1. Run on every freshness sweep as **health probes** before / after harder vendors.
  2. Assert parsers still extract the live tip shape (version present; date parseable).
  3. On hold: must advance `verified_at` (acceptance test from FRESHNESS.md — FabFilter sticky-queue bug).
  4. Fail the sweep job (alert, don’t write other vendors) if FabFilter download page returns empty version set or Goodhertz bundle heading missing — indicates fetcher regression, not vendor silence.
  5. Valhalla may need light render escalation if shop HTML flakes — keep curl first; mark `fetch_degraded` not dead.

- **If accepted, what changes in the engine:**
  - Freshness job imports control-group URLs as canaries.
  - Playbooks for FabFilter / Goodhertz / Valhalla already green — wire tip regexes + golden fixtures from this table.
  - Dashboard: “control canary OK” boolean alongside freshness coverage.

- **Expected impact:**
  BASELINE integrity — catches broken fetch/parse before Melda/PA burns. Documents the shape plateau greens should keep matching.

- **Risks / caveats:**
  - FabFilter Total bundle date-only line (no semver) — skip that block; per-plugin lines only.
  - Goodhertz shared-bundle stamp is intentional; do not invent per-plugin builds.
  - Valhalla dates can be old (Room/VV still 2024) — hold-refresh still required; cool/warm SLA 7–14d.

- **Suggested first step:**
  Add three fixture assertions (Pro-Q `4.13`, Goodhertz `3.14.1`, Supermassive `5.0.0`) to CI canary; gate freshness deploy on canary green.

- **New evidence since last verdict:**
  Live quotes for FabFilter / Goodhertz 3.14.1 / three Valhalla Current Version lines; chip `control-group-canary-v1`.
