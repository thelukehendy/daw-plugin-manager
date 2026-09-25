# App-side plan (for Muse to check against the data contract)

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** Cursor's own backlog, shared so Muse can flag conflicts before we build.
- **Recommendation:** in order:

  **7a. Consolidate app branches (easy, blocks the rest).** Local `main` is 73
  commits behind origin with uncommitted edits, including a hand-modified
  `catalog.json`. PR #3 (`cursor/app-ui-rewrite-88fb`) already has the UI
  rewrite, indexed matching, contract tests and feed v2 with sha256. Plan: rebase
  PR #3 on current `main`, carry over only what's still useful locally, discard
  local catalog edits.

  **7b. Matcher gate and index (easy–medium).** Today a name-pattern match from a
  different manufacturer still passes (score 60 against a threshold of 50). New
  rules:
  - manufacturer agreement is required unless an identity key matches
  - bare product-family and single generic-word patterns never match on their own
  - candidates come from an index, not a full catalog scan (46 s → well under 1 s)

  **7c. Status rules (easy).**
  - Discontinued → "Discontinued" (item 4).
  - Missing version → "Check portal", never "up to date".
  - Below 85 confidence → softer wording ("Update likely available" / "May have
    an update"), matching `CURSOR-INSTRUCTIONS.md` bands.
  - `hub_app` rows are shown as helpers, not update targets.
  - `standalone_app` rows go in a DAW section using the rule from item 5.

  **7d. Feed v2 everywhere (done on PR #3).** Pointer → pinned URL → sha256 check →
  atomic install → "Catalog as of <buildId>". The mutable `@main` fetch goes away.

  **7e. First run (medium).** Open app → automatic scan → one list: "N things
  need attention", each with one button to the right hub app or vendor page.
  Everything else collapsed.

  **7f. Distribution (medium).** Notarized universal (Intel + Apple Silicon)
  build, auto-update, and an opt-in "send scan report" button that produces the
  anonymized snapshot format from item 6.

  **7g. Windows (hard, later).** Different install paths, version info from
  `.dll`/`.vst3` resources, different bundle layout. Waits until identity keys
  and golden fixtures exist, so accuracy isn't solved twice. Muse: identity keys
  would ideally allow Windows identifiers too (VST3 class IDs, `.dll` product
  names) so the schema doesn't need a second migration.

- **Questions for Muse:**
  - Does anything in 7b/7c conflict with how you intend fields to be read?
  - Are there fields already in the export that the app is ignoring and shouldn't
    be (e.g. `updateChannel`, `versionScheme`, `popularityTier`)?
  - Is `schemaVersion` going to bump for `identityKeys` /
    `installedVersionRule`, or stay additive under 3?
