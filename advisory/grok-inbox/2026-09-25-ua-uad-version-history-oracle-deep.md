# UA UAD Version History oracle — chip `uad-version-history-v1`

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 / novel #1 — Universal Audio public Version History restored as curl-friendly high-yield DSP/driver oracle. Path-health false alarm from earlier assault should be lifted.
- **Context / evidence:**
  - Live URL: https://help.uaudio.com/hc/en-us/articles/215270403-UAD-DSP-Plug-Ins-and-Drivers-Version-History-Release-Notes
  - Live fetch (2026-09-24→25 PT): HTTP **200**, **~670–671 KB** HTML. Curl-friendly (no Playwright required).
  - **162 Version heads** extracted → `advisory-deep/hubs/ua-version-heads.txt`.
  - Top heads: **`Version 12.0 — Sept 8, 2026`**; then `11.9.0 — July 7, 2026`; `11.8.3 — March 3, 2026`; … back through 2.x.
  - Archives sibling still labels `UAD 12.0.0 (Current)` (REPORT / novel). `www.uaudio.com/support/uad/versions.html` redirects into this help article.
  - WAVE2-FIXTURES: `ua_top: "12.0 / Sept 8, 2026"`.
  - Doctrine: UAD DSP/drivers = **software bundle**; Softube-UAD-* DSP rows may ride bundle; **UADx / Spark native** still no per-plugin public builds — never stamp suite onto UADx.

- **Recommendation:**
  Ship chip **`uad-version-history-v1`**:

  ```
  GET article (curl OK)
  regex: Version\s+(\d+(?:\.\d+)*)\s*[—\-]\s*([A-Za-z]+ \d{1,2}, \d{4})
  take newest head as tip (page is newest-first)
  hash HTML daily; full parse on hash change
  apply tip ONLY to UAD software/driver hub (and Softube-UAD-* DSP rows that explicitly track the UAD suite)
  DO NOT stamp UAD suite version onto every UAD plugin SKU without product-specific evidence in the same Version entry
  ```

  Optional monthly Archives corroboration of `(Current)` line.

- **If accepted, what changes in the engine:**
  - Re-enable / add playbook job for this URL; mark path **healthy**.
  - Catalog write: UAD Connect/DSP **suite/driver row** (and explicit Softube-UAD DSP riders) only.
  - Nested Console/LUNA mentions under a Version head stay tagged with product field — do not collapse into one blob version for all UA SKUs.
  - Resolvability: UADx stays hub/account-walled for builds.

- **Expected impact:**
  HIGH — restores green freshness for UAD DSP / Softube-UAD-* bundle track after prior “decayed” note. Easy curl win (~670 KB public).

- **Risks / caveats:**
  Huge page — parse headings only, don’t store forever-growing full body in hot path. Product-specific lines inside an entry may name plugins without giving them a separate semver — still not a per-SKU stamp. Never invent UADx from this article.

- **Suggested first step:**
  Wire regex + tip comparison against catalog UAD suite row using fixture `12.0 / Sept 8, 2026`; unit-test “no fan-out to all UAD plugin SKUs.”

- **New evidence since last verdict:**
  Live ~670 KB; 162 heads file; tip 12.0 Sept 8 2026; novel REPORT path-health restored note.
