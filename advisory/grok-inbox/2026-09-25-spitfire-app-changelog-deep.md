# Spitfire Audio App changelog — v3.4.17 hub_app (libraries stay app-gated)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Spitfire libraries largely update inside Spitfire App only. Public support article gives **app** tip; Muse must poll app changelog without inventing per-library greens. Hubs dig ranked this #7.
- **Context / evidence:**
  - Dig: `/workspace/advisory-deep/hubs/REPORT.md` § Spitfire + WAVE2-FIXTURES `spitfire_app: "3.4.17 / 04 February 2026"`.
  - **LIVE-FETCH 2026-09-24 PT:**  
    `https://support.spitfireaudio.com/en/articles/13616557-spitfire-audio-app-changelogs` → HTTP **200** (~66 KB).  
    Quote from body text:
    > **Changelog for v3.4.17 update:**  
    > **Release date 04 February 2026**
  - Related surfaces (not this chip’s tip source):
    | Surface | HTTP | Role |
    |---|---|---|
    | Product Information collection | 200 (~513 KB) | Index for **future** library VH allowlist |
    | BBCSO version history | 200 (~224 KB) | Library VH — can lag app; allowlist later only |
  - Many library updates **only** appear inside Spitfire App (login / library CDN auth). FRESHNESS seed: Spitfire libs = `hub`, SLA **30d portal only**.

- **Recommendation:**
  Chip **`spitfire-app-changelog-v1`**:

  1. Weekly GET app changelogs article (browser UA; Intercom help may be curl-OK today).
  2. Parse tip: `Changelog for v(\d+\.\d+\.\d+)` + nearby `Release date (.+)`.
  3. Normalize date (`04 February 2026` → `2026-02-04`) in observation metadata.
  4. Write **only** Spitfire Audio App **hub_app** row (confidence **Med/~90**).
  5. Libraries: `churn_class=hub` — freshness = portal liveness / app oracle only; **no per-SKU public dig**.
  6. Hold → bump `verified_at` even when tip unchanged for months.
  7. Optional later (separate chip after Luke verdict): monthly allowlist of library VH URLs from Product Information — never RTO serial / CDN auth.

  ### DO-NOT-GRIND
  - Spitfire App login, library CDN auth, RTO serial APIs
  - Stamping app `3.4.17` onto BBCSO / LABS / library SKUs
  - Treating BBCSO VH as app tip (or vice versa)
  - Guessing library versions from marketing “What’s new” pages

- **If accepted, what changes in the engine:**
  - Spitfire playbook: app changelog URL pinned; hub_app observation source = article URL.
  - TAXONOMY: Spitfire libraries `hub_walled` / structurally skipped for public version dig.
  - Fixture: `v3.4.17` / `04 February 2026` matches WAVE2-FIXTURES.json.

- **Expected impact:**
  MED for app row freshness; prevents false library greens; aligns plateau hub SLA with portal-liveness sibling.

- **Risks / caveats:**
  - Intercom article id `13616557` could move — keep title search fallback “Spitfire Audio App changelogs”.
  - App tip may sit still for months — hold-refresh still mandatory; overdue queue must not thrash libraries.
  - Product Information / BBCSO are tempting — leave allowlisted and offline until a dedicated library chip exists.

- **Suggested first step:**
  Snapshot article HTML; unit-test regex → `3.4.17` + date; dry-run hub_app write; assert zero library rows touched in the transaction.

- **New evidence since last verdict:**
  Live quote `Changelog for v3.4.17 update` / `Release date 04 February 2026`; chip `spitfire-app-changelog-v1`; explicit hub vs library boundary.
