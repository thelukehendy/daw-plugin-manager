# EastWest support/updates oracle — chip `ew-support-updates-v1`

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — EastWest public Installation Center / Opus / Spaces / PLAY hub apps have a curl-friendly updates page; must not stamp hub versions onto every library SKU.
- **Context / evidence:**
  - Live: https://www.soundsonline.com/support/updates (~**72 KB**, HTTP 200 — verified).
  - Quotes (raw `ew-support-updates.html` / REPORT):
    - **`IC 2.0 / Sept 22, 2026`** (also IC 1.6.1 / Jan 8, 2026 …)
    - **`Opus 1.6.5 / June 4, 2026`** (1.6.4 May 28 2026 …)
    - **`Spaces 2.5.3 / May 7, 2024`**
    - **`PLAY 6.1.9 - Legacy product`** (+ PLAY 4.3.5 NOT SUPPORTED notes)
  - WAVE2-FIXTURES: `ew_ic`, `ew_opus` tips above.
  - Installation Center account still required to *download*; Community CDN 403 noise — don’t scrape CDN. `appcast.xml` redirects home.

- **Recommendation:**
  Ship chip **`ew-support-updates-v1`** for **hub apps only**:

  ```
  GET /support/updates (curl OK)
  section-split by product family
  regex: ^(IC|Opus|Spaces|PLAY)\s*([\d.]+)\s*/\s*(.+)
         also: PLAY\s+([\d.]+)\s*-\s*Legacy
  map:
    IC → Installation Center app row
    Opus → Opus engine/app row
    Spaces → Spaces app row
    PLAY → PLAY legacy engine row (mark legacy / discontinued policy)
  NEVER stamp IC/Opus/Spaces/PLAY version onto every EastWest library SKU
  Cadence: daily GET + hash; parse on change
  ```

- **If accepted, what changes in the engine:**
  - Playbook EastWest: public updates poller; four hub product keys.
  - Libraries remain hub/account-walled for content versions unless a separate library VH exists.
  - DO-NOT-GRIND: IC login, ComposerCloud entitlement, authenticated library CDN.

- **Expected impact:**
  HIGH confidence for IC/Opus/Spaces/PLAY hub freshness with minimal fetch cost (~72 KB curl).

- **Risks / caveats:**
  PLAY is legacy — raises should flag discontinued posture, not “upgrade all PLAY libraries.” Spaces tip is older (2024) — still valid oracle, low churn expected.

- **Suggested first step:**
  Snapshot page + parse four tips into observations for hub rows only; fixture IC 2.0 / Opus 1.6.5.

- **New evidence since last verdict:**
  Live ~72 KB; IC 2.0 Sept 22 2026; Opus 1.6.5 June 4 2026; Spaces 2.5.3; PLAY 6.1.9 legacy.
