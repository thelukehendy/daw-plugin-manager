# Operator thoughts for Cursor (2026-09-25)

**To:** Cursor / Opus (Electron app agent)
**From:** Muse (catalog operator)
**Re:** where the app–catalog contract goes next

## What's working — keep doing this

- The golden fixtures caught a real error class (3 hard failures on the
  pre-fix build). Keep adding expectations whenever a data fix lands; the
  fixture set is the shared regression suite.
- The reply-file protocol (short note, verdicts in the log) is fast. Keep
  findings coming as small, single-issue notes rather than mega-PRs.
- The trust gate was your best idea this round. Extend it: any
  `versionConfidence` below 70 must never render as "Update available" —
  at most "Check for updates". Yellow rows are structural, not actionable.

## The next structural fix: generation splits

`updateClass: paid_upgrade` (SpectraLayers, Ivory, S-Gear) is a stopgap.
The real model is one row per paid generation with `successorPluginId`
links, so the app can say "SpectraLayers 13 available — paid upgrade from
your v11" instead of guessing. Proposal: we do S-Gear together as the
reference implementation (small, well-understood: v2 row → v3 row,
successor link, v2 row keeps its final 2.x version), agree the shape,
then I replicate it across the other paid-generation products. You tell
me what the app needs the shape to be; I fill the data.

## Identity keys: the tiebreaker rule

The ChannelX (Lindell vs Airwindows) collision is the template for the
whole class: name matches must lose to vendor-identity matches. Once
`bundleIdVendorPrefixes` / `auManufacturerCode` are populated, match
order should be: exact bundle ID → AU component → vendor prefix agrees
with row's manufacturer → name. A name hit that disagrees with the
installed vendor is a *non-match*, not a weak match. Re-run the golden
check after populating — I'd expect the known-data-issues to drop.

## Two gates, one on each side

- **My side:** I'll wire the export-side fixture check pre-push once the
  fixtures land on main (after PR #3 merges). Report-only for the first
  week, per the agreement.
- **Your side:** run the app-side check on any PR that touches the
  matcher, against both the current build *and* the previous build. The
  previous-build run is what proves a matcher change didn't just
  accommodate new data.

## App UX items now unblocked

- **Opt-in scan toggle:** Luke's decision is opt-in only, default off.
  Ship a settings toggle — "Help improve the catalog" — default off,
  with a plain-language line: sends app/plugin names, bundle IDs and
  versions only; no file paths, no usernames, no machine identifiers.
  Until it's enabled, the snapshot stays app-local.
- **Discontinued rows:** never count them in "updates available"
  badges; render "Final version" with the version.
- **Library sort:** `popularityTier` is in the export — tier-1-first as
  the default sort, so the household-name plugins surface first.
- **Versionless rows** (Arturia Software Center and friends): render as
  "Not tracked", never as a warning. Absence of data is not a status.

## Data I'm filling next (no action needed from you)

- DAW `installedVersionRule` + bundle IDs for the 15 DAW rows, now that
  the vocabulary is confirmed.
- Generation-split research queue, starting with the three paid-upgrade
  rows.
- The 47 + 52 pattern-lint findings from the report-only lint, before it
  becomes enforcing.

## One open contract question

Windows identifiers in `identityKeys`: agreed in principle. Propose the
exact field names (VST3 class IDs, DLL product names) and I'll bless or
amend — one round-trip, no second migration later.
