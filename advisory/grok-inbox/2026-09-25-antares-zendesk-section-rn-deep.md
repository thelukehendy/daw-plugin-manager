# Antares Zendesk section RN walk — AutoTune 2026 tip 1.2.1

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Antares catalog freshness needs a standing ID enumeration (not blind product-name search). Section API lists 28 RN articles; AutoTune 2026 tip may beat stored. Deepens thin wave-2 novel overview into a walk chip + quote.
- **Context / evidence:**
  - Dig: `/workspace/advisory-deep/novel/REPORT.md` §3 + `notes/antares-rn-article-map.tsv` (28 rows).
  - **Section API (LIVE-FETCH 200):**  
    `https://help.antarestech.com/api/v2/help_center/en-us/sections/47811896963476/articles.json?per_page=100`  
    → `count: 28`, `articles: 28`. HTML twin: `…/hc/en-us/sections/47811896963476-Release-Notes`.
  - **AutoTune 2026 article (LIVE-FETCH 200):**  
    `https://help.antarestech.com/hc/en-us/articles/47967370217620-AutoTune-2026-Release-Notes`  
    Top heading + body quote:
    > **AutoTune 2026 (1.2.1)**  
    > This maintenance release resolves several audio rendering and stability issues in AutoTune 2026, including improvements to Classic Mode consistency and HQ Mode accuracy.
    Prior headings on same page: `(1.2.0)`, `(1.1.0)`, `(1.0.0)` — tip is **first** `Product (x.y.z)` heading.
  - Article map (IDs from TSV / live JSON) includes AutoTune 2026, Metamorph, Vocal Prep, AutoTune Pro 11, Pro X, Vocal suite, Auto-Key 2, EFX+/Access/Hybrid/Artist, AVOX-class renames (Articulator, Aspire, Choir, Duo, Harmony Engine, Mic Mod, Mutator, Punch, Throat, Warm, Slice, Vocodist, Sybil), SoundSoap.
  - Rename hazard: section titles dropped many prefixes — **always enumerate via section API**, then open each `html_url`; never search catalog names blindly.

- **Recommendation:**
  Chip **`antares-section-rn-walk-v1`**:

  1. Cadence: every maintenance pass / ≤12h green check for tier-1 Antares.
  2. GET section JSON (`per_page=100`). Diff article `id` set vs last snapshot (detect new RN pages).
  3. For each allowlisted article (start: full 28 from TSV; prune discontinued later): GET `html_url` (or article JSON body).
  4. Parse first heading matching `^(.+?)\s*\(([0-9]+(?:\.[0-9]+)+)\)\s*$` as tip.
  5. Map article title → catalog product via rename table (AVOX short names → full catalog titles).
  6. Raise only when tip > current and identity match is unique; hold bumps `verified_at`.
  7. Confidence **92** official RN.

  Priority canary product: **AutoTune 2026 → 1.2.1**.

- **If accepted, what changes in the engine:**
  - Antares playbook gains section-API enumerator + article allowlist fixture from TSV.
  - Rename map stored beside playbook (not guessed per run).
  - Observation `source_url` = article `html_url`; never KVR when RN tip present.

- **Expected impact:**
  MED-HIGH — unblocks Autotune 2026 / AVOX-class freshness if catalog lags 1.2.1; keeps SoundSoap / portfolio confirmation path without login.

- **Risks / caveats:**
  - Zendesk rate limits — 1 concurrent, small gaps; cache section JSON 1–6h.
  - Multi-product pages (if any) need per-heading scope — first heading is tip for that article’s primary product only.
  - Do not stamp AutoTune 2026 tip onto AutoTune Pro 11 / Pro X rows.

- **Suggested first step:**
  Snapshot section JSON + AutoTune 2026 HTML; unit-test tip extractor asserts `1.2.1`; dry-run map of 28 IDs → catalog matches before writes.

- **New evidence since last verdict:**
  Live section count 28; live AT2026 quote for 1.2.1; chip id `antares-section-rn-walk-v1`.
