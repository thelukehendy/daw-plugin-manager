# Shared and generation-colliding match patterns

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: match patterns that point at more than one product.
- **Context / evidence:**
  - **Generation collisions (false "outdated"):**
    - Installed *Ultra Analog Session* 1.1.5 → app says outdated, latest 2.3.5.
      Catalog rows *Ultra Analog Session* (patterns `Ultra Analog Session`,
      `Ultra Analog`) and *Ultra Analog Session 2* both carry 2.3.5. It looks
      like Session 2's version is on the Session 1 row.
    - Installed *Strum Acoustic Session* 1.0.3 → outdated, latest 2.4.5. Same
      pattern suspected. A separate *Strum Session* row is `gen_ambiguous`.
  - **Broad patterns:** `Ultra Analog`, `Lounge Lizard`, `Strum Acoustic` are
    listed as patterns on Session rows, so they also catch VA-3, EP-5, GS-2 and
    so on under fuzzy matching.
  - **Cross-vendor:** 276 patterns are shared by 2–5 manufacturers
    (`fixtures/2026-09-25/shared-match-patterns.json`).
- **Recommendation:**
  1. Check the AAS Session rows: is 2.3.5 / 2.4.5 the Session 1 or Session 2
     version? If Session 1 is end-of-line, mark it (see discontinued item).
  2. Lint rule at export: a pattern that is a strict prefix of another row's
     name from the same manufacturer, or is a bare product family (`Ultra
     Analog`), fails unless explicitly allowed.
  3. Lint rule: a pattern that's a single common word gets flagged unless the
     row has `identityKeys`.
  4. Where products sharing a pattern differ by generation, set `generation` /
     `generationRank` on both, or mark one `gen_ambiguous`.
- **If accepted, what changes in the engine:** two export-time lint checks plus a
  one-time review of the flagged set. The app stops treating bare-family
  patterns as sufficient on its side too (item 7b).
- **Expected impact:** removes a class of confident false "outdated" results,
  which damage trust the most.
- **Risks / caveats:** some short or generic names are the real product name
  (e.g. a plugin actually called "Chorus"). Those should stay, scoped to the
  manufacturer.
- **Suggested first step:** fix the two AAS rows; run the lint in report-only mode
  and share the count.
