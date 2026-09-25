# Cursor app review: index and ship order (2026-09-25)

- **Date:** 2026-09-25
- **Advisor:** Cursor (Electron app agent)
- **Reviewed:** catalog build `2026-09-25T20:39:13Z` (commit `b19253bf`), local app
  on `main`, draft app branch `cursor/app-ui-rewrite-88fb` (PR #3)
- **Method:** read-only plugin scan of Luke's studio Mac (752 products), run through
  the app's current matcher against the published catalog.
  Evidence: `fixtures/2026-09-25/scan-match-findings.json`

## Summary

The catalog's confidence work is solid. The weak link is **identity**: working
out which catalog row an installed plugin actually is. Right now that relies on
fuzzy name matching. On one real machine it produced wrong-vendor matches, and
false "outdated" results caused by product generations sharing match patterns.
It is also slow: matching took 46 s of a 54 s scan.

Accuracy should come before new features. Most of the fix is one shared change:
**deterministic identity keys in the catalog, matched first by the app.**

## Suggestions

| # | File | Owner | Size |
|---|---|---|---|
| 1 | `2026-09-25-deterministic-identity-keys.md` | Muse + Cursor (contract) | Medium |
| 2 | `2026-09-25-misattributed-rows-lindell-reason.md` | Muse | Easy |
| 3 | `2026-09-25-shared-and-generation-colliding-patterns.md` | Muse | Medium |
| 4 | `2026-09-25-discontinued-rows-with-latest-version.md` | Muse + Cursor (contract) | Easy |
| 5 | `2026-09-25-daw-installed-version-normalization.md` | Muse + Cursor (contract) | Medium |
| 6 | `2026-09-25-golden-scan-fixtures-ci.md` | Shared | Easy–Medium |
| 7 | `2026-09-25-app-side-plan-for-muse-review.md` | Cursor (FYI for Muse) | Mixed |

## Proposed ship order

1. **Contract agreement (this round):** verdicts on 1, 4 and 5. These change what
   fields the export carries and how the app reads them.
2. **Quick data fixes:** 2, plus the worst of 3 (generation collisions that cause
   false "outdated" results).
3. **App foundation:** consolidate branches (item 7a), matcher gate and index
   (7b), status rules (7c). Cursor can do these without waiting on data changes.
4. **Golden fixtures in CI (6):** lock in the fixes so regressions fail the build.
5. **Identity keys populated (1):** the export starts carrying keys; the app
   matches on them first.
6. **Then UX and reach:** DAW and helper-app sections, notarized universal build,
   auto-update, and eventually Windows.

## Open questions for Muse

1. Can the store record **bundle IDs and Audio Unit component codes** per row?
   Where would they come from: vendor pages, installer receipts, or submitted
   user scans?
2. For `standalone_app` rows, can the export include how the **installed** app
   reports its version, separately from the marketing version?
3. Should `discontinued` rows ever carry `latestVersion`? If yes, what should the
   app say?
4. Would you accept anonymized user scan submissions as a research input?
   Opt-in only, plugin names/bundle IDs/versions, no paths or usernames.
