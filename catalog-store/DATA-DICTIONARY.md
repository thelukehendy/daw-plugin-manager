# DATA DICTIONARY — app-facing catalog fields (for Cursor / Electron)

Source of truth: `catalog-store/data/catalog.db` (schema v6).
App-facing file: `catalog/catalog.json` (synced copy of `catalog-store/out/catalog.json`).
PluginCatalog schema v3 + v5/v6 additions below. Fields are omitted when unset —
absence means "not researched", never "false".

## Manufacturer entry

| JSON key | DB column | Meaning for the app |
|---|---|---|
| `id` | `manufacturers.id` | Stable manufacturer key. |
| `name` | `name` | Display name. |
| `updatePortalUrl` | `update_portal_url` | Where the user downloads updates. Deep-link each manufacturer/plugin row here. |
| `websiteUrl` | `website_url` | Manufacturer homepage. |
| `portalApp` | `portal_app` | e.g. "Native Access", "Waves Central" — the updater app the user needs. Show as a hint, not a link. |
| `appleSilicon` *(v5)* | `apple_silicon` | Default Apple Silicon status for this manufacturer's current line. One of `native` / `universal` / `rosetta` / `intel-only` / `mixed`. Omitted = unresearched. |
| `versionScheme` *(v5)* | `version_scheme` | How this manufacturer writes versions: `semver` (1.2.3), `semver4` (1.2.3.4), `date` (Airwindows-style `2026-09-05-…`), `build` (bare build number), `marketing` (non-numeric). Feed this to the version normalizer before comparing. |
| `versionExample` *(v5)* | `version_example` | A real observed version string, e.g. `"4.10.19"`. Use as a normalizer test fixture. |
| `changelogUrl` *(v5)* | `changelog_url` | Fixed changelog / release-notes page. Link "What's new" here. |
| `popularityTier` *(v6)* | `popularity_tier` | 1 = household names … 4 = long tail. Omitted = unranked. Sort "Needs update" tier-1-first. |

## Plugin entry

| JSON key | DB column | Meaning for the app |
|---|---|---|
| `id` / `name` / `manufacturerId` | — | Identity. |
| `matchPatterns` | `match_patterns` | Filename/bundle substrings used to detect the installed plugin. |
| `formats` | `formats` | e.g. `["AU","VST3","AAX"]`. Render as format badges. |
| `latestVersion` | via accepted observation | Current version. Absent = no accepted version (don't show "up to date"). **Never present on discontinued rows — see `finalVersion`.** |
| `finalVersion` | via accepted observation (discontinued rows only) | Final release of a discontinued product. The app must render the row as "Discontinued" and may note "final version X, you have Y" — never an "Outdated" alert. |
| `versionConfidence` | `confidence` (0–100) | ≥85 green = verified, 70–84 amber = likely, <70 yellow = weak. **Render as a badge** — this honest-uncertainty UI is the app's differentiator. |
| `versionConfidenceReasons` | `confidence_reasons` | Human-readable why, e.g. `["manufacturer-downloads-page"]`. Tooltip text. |
| `versionSourceUrl` | `source_url` | Evidence page. "Verify" link. |
| `versionVerifiedAt` | `verified_at` | ISO timestamp. Show as "Last checked <date>" — stale data must be visible. |
| `updatePortalUrl` | `update_portal_url` (plugin or manufacturer) | Per-plugin download link when it differs; else manufacturer default. |
| `discontinued` | `discontinued` | `true` = vendor discontinued. Show a "Discontinued" state, not "unknown". |
| `identityKind` | `identity_kind` | Non-`plugin` values (`soundset`, `expansion`, `bundle`, `hub_app`, `daw_stock_effect`, …) tell the UI how to treat the row — e.g. don't offer "update" for a hub app the same way. |
| `installedVersionRule` *(v7, v8)* | `installed_version_rule` (JSON), or manufacturer `default_installed_version_rule` as fallback | Tells the app how to normalize the installed version string before comparing with `latestVersion`. Shape: `{"source": "CFBundleShortVersionString", "transforms": ["strip-build-suffix", ...], "compareSegments": N}`. Transforms apply in listed order; **unknown transform = no verdict**. Known transforms: `strip-build-suffix` (drop build noise like ` (2025-11-03_828a8aa814)`, `_91d78b1u`, `d3 build 15815`, ` Build 58729`), `prefix-year-2000` (only when the first segment is < 100, e.g. `26.4.1.179` → `2026.4.1.179`), `semver-first-3` (keep the first three numeric segments). `compareSegments: N` compares the first N segments numerically, padding missing segments with 0. Resolution order: the plugin row's own rule wins; if absent, the manufacturer's `default_installed_version_rule` applies (v8 — only set when the whole product line shares one scheme); if both absent = don't compute a verdict — show "Check for updates". Studio One needs generation mapping, not string rewriting (no rule can fix that; it stays absent). |
| `minMacOS` | `min_macos` | e.g. `"11.0"`. Compare against host OS; warn on incompatibility. |
| `requiresIlok` | `requires_ilok` | Show an iLok hint on the row. |
| `isFreeware` | `is_freeware` | Free product — different update expectations. |
| `appleSilicon` *(v5)* | resolved `plugins.apple_silicon` → `manufacturers.apple_silicon` | **The per-plugin Apple Silicon badge.** Values: |
| | | `native` — ships Apple Silicon-native builds (may also ship Intel separately). Safe on Apple Silicon. |
| | | `universal` — Universal 2 binary. Safe everywhere. |
| | | `rosetta` — Intel-only, runs under Rosetta 2. Show "Rosetta" badge; warn if user runs DAW natively. |
| | | `intel-only` — Intel-only and known broken under Rosetta. Show a warning badge. |
| | | Omitted = unresearched. Never assume. |
| `notesForUser` | `notes_for_user` | Short UX hint string, safe to render verbatim. |
| `popularityTier` *(v6)* | resolved `COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)` | **Effective tier, resolved at export time** — the app never does the join itself. 1 = household names (sort these first in "Needs update"), 2–4 = long tail. Omitted = unranked. |

## Version pointer (`catalog/catalog-version.json`)

Published fresh with every push (see `catalog/CATALOG-FEED.md` for the fetch
flow). The app discovers new builds through this pointer — never by polling
the mutable branch URL.

| JSON key | Meaning for the app |
|---|---|
| `feedVersion` | Pointer format version (currently 1). |
| `buildId` | The export's `updatedAt` timestamp. Compare against the installed build — upgrade only when newer. Display as "Catalog as of <buildId>". |
| `catalogCommit` | Full 40-char SHA of the GitHub commit containing this build's `catalog.json`. |
| `sha256` / `sizeBytes` | Integrity check for the downloaded catalog. **Reject the download on mismatch** — keep the old catalog. |
| `schemaVersion` | Catalog schema version. Refuse builds the app can't parse. |
| `counts` | `manufacturers` / `plugins` / `tier1Plugins` — for the "catalog as of" display. |
| `endpoints.jsdelivrPinned` | `https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@<catalogCommit>/catalog/catalog.json` — immutable, safe to cache forever. Primary download. |
| `endpoints.rawPinned` | `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/<catalogCommit>/catalog/catalog.json` — fallback. |

## Conventions the app must respect

- **Omitted ≠ false.** A missing `appleSilicon` means "not yet researched", not
  "Intel-only". A missing `latestVersion` means "no accepted version", not
  "up to date".
- **Confidence drives the UI.** Never present a yellow-band "update available"
  with the same visual weight as a green one. Suggested copy: green "Update
  available", amber "Update likely available", yellow "May have an update —
  unverified".
- **Version comparison must normalize first.** Use `versionScheme` +
  `versionExample` per manufacturer; never raw string-compare (`"1.10" > "1.9"`
  lexicographically is false).
- **Portal over version.** When in doubt, link the user to `updatePortalUrl`
  rather than asserting a version number.
