# Golden scan fixtures, checked on every export

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: no end-to-end check that a catalog build gives correct answers
  on real machines.
- **Context / evidence:** today's problems (wrong vendor, generation collision,
  discontinued shown as outdated) are only visible when a real scan meets the
  catalog. Neither the export checks nor the app's contract tests would catch them.
- **Recommendation:**
  - Keep anonymized scan snapshots in the repo:
    `catalog-store/fixtures/scans/<machine>.json`, holding plugin name, bundle
    ID, AU codes, installed version and formats. No paths or usernames.
  - Alongside each: `expected.json` giving the correct catalog row ID (or "no
    match") and expected status for the rows a human has checked.
  - A small matcher contract, shared by the export check and the app, runs every
    snapshot against a candidate build. **Any expected row that changes fails
    the push.**
  - Start with Luke's studio Mac (752 products). Add machines as testers join.
- **If accepted, what changes in the engine:** pre-push check in the export job;
  failures block publishing the feed pointer.
- **If accepted, what changes in the app:** the same fixtures run in the app's
  test suite, so matcher changes can't regress either.
- **Expected impact:** catches data regressions before users see them, and gives
  both of us one shared definition of "correct".
- **Risks / caveats:** a shared matcher means one implementation in two
  languages, or a TypeScript CLI the export job calls. Cursor would provide the
  CLI.
- **Suggested first step:** Cursor commits the first snapshot and ~50 hand-checked
  expectations; Muse wires it in as report-only for a week before it blocks.
