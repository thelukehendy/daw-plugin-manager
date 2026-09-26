# What the app needs from Muse (requirements, breakage, research)

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Problem:** Luke asked for guidance Muse can use day-to-day: what helps the
  shipped app, what does not, what breaks matching/status, and how to organize
  research. App-side DAW/helper UI shipped in commit `4cda9f0`; catalog fields
  below are still the bottleneck.
- **Context / evidence:** against current `catalog/catalog.json`
  (`catalogSource: store-export:v4`):
  - **0 / 114** `hub_app` + `standalone_app` rows have `installedVersionRule`
  - **0 / 114** have `identityKeys.bundleIds`
  - DAW/helper UI therefore uses **inferred** verdicts only (never a verified
    "Update" without a rule). See also
    `2026-09-25-daw-rows-what-the-app-needs.md`.
  - Helper rows Luke named (row exists unless noted):

    | Installed name (typical) | Catalog row | latestVersion | Gap |
    |---|---|---|---|
    | iLok License Manager | `pace--ilok-license-manager` | 6.0.1 @90 | no bundle ID / rule |
    | Waves Central | `waves--waves-central` | 16.7.2 @90 | same |
    | Avid Link | `avid--avid-link` | 2026.4.0 @88 | same; may need year transform |
    | Plugin Alliance Installation Manager | `plugin-alliance--installation-manager` name **"Installation Manager"** | 1.4.0 @90 | name ≠ installed app; need `matchPatterns` / bundle ID |
    | Arturia Software Center | `arturia--software-center` | **missing** | version + confidence |
    | eLicenser Control Center | `steinberg--elicenser-control-center` | **missing** | discontinued? `finalVersion` + note |
    | Native Access | `native-instruments--native-access` ("Native Access products") | 3.26.0 @92 | name mismatch; bundle ID |

## Helpful (do more of this)

1. **Stable identities before versions.** `id`, manufacturerId, `identityKind`,
   `matchPatterns`, `identityKeys` (bundleIds / AU). A correct unversioned row
   beats a wrong version.
2. **`versionConfidence` with every published `latestVersion`.** App omits or
   softens below Medium; High (≥85) is required for a hard "Update available".
3. **`installedVersionRule` on every DAW and hub_app** once you trust the
   installed ↔ marketing mapping. Empty `{}` is fine when CFBundleShortVersion
   already matches `latestVersion`. Named transforms the app understands today:
   `strip-build-suffix`, `prefix-year-2000`, `semver-first-3`, plus
   `compareSegments`.
4. **`portalApp` / `updatePortalUrl` / `notesForUser`** when there is no safe
   version — the UI shows a portal CTA, not a fake status.
5. **Generation / paid majors** (`generation`, `versionMajors`,
   `successorPluginId`, `updateClass: paid_upgrade`) so Live 10 / Reason 12 /
   Studio One 5 are never "Update to N+2".
6. **`discontinued` + `finalVersion`** (clear `latestVersion`) so old tools like
   eLicenser show Discontinued, not Outdated.
7. **Store-export only.** One published PluginCatalog with
   `catalogSource: store-export:*`. That is the sole version authority the app
   trusts.

## Not helpful (please stop / avoid)

1. Inventing or scraping `latestVersion` without confidence and a manufacturer
   source you would defend.
2. Hub-portal grinding for plugin versions (`HUB_WALLED.md`) — burns time and
   produces fragile stamps the app must ignore.
3. Duplicate rows for the same installable (Lindell / Unfiltered-style
   collisions) — matcher picks one; users see wrong vendors.
4. Orphan `manufacturerId` (e.g. S-Gear 2 → `scuffham`) — row becomes
   unmatchable or mis-grouped.
5. Re-enabling legacy writers (`catalog:refresh`, smart-scrub, Flash/Antigravity
   floors) against the live export.
6. Putting GitHub / CDN / commit URLs into user-facing `notesForUser` or
   `versionSourceUrl` — the app scrubs them, but clean data is better.

## What breaks app functionality

| Muse change | App effect |
|---|---|
| Wrong `manufacturerId` or colliding `matchPatterns` | Cross-vendor false matches (we gate on manufacturer unless identity key hits, but bad patterns still poison candidates) |
| `latestVersion` without `versionConfidence` | Soft / no verdict; looks "broken" to users |
| DAW/hub row with marketing version format ≠ installed, and **no** `installedVersionRule` | Inferred only; Pro Tools 26 vs 2026 stays "check in app" or wrong |
| Hub row name ≠ `.app` name and no bundle ID / patterns | Helper never appears (PA "Installation Manager", "Native Access products") |
| Dropping `identityKind: hub_app` / `standalone_app` | Helpers drown in the plugin list again |
| Publishing non-`store-export` catalogs the app might fetch | Refused / ignored — wasted research |
| Schema fields the app does not know yet | Harmless if additive under schema 3–6; breaking renames need a handoff note |

## How to organize the database (practical)

1. **Universe table** — manufacturers + plugin/app identities (ids, kinds,
   patterns, portals). Grow freely without versions.
2. **Version chips** — `(plugin_id → latestVersion, confidence, verified_at,
   source)`. Only export when confidence is set.
3. **App identities** — DAWs and hub apps in the same export, but always with
   `identityKind`; treat as a small high-priority set (~15 DAWs + ~20 hubs), not
   the long tail.
4. **Generation graph** — paid majors as first-class edges, not notes prose.
5. **Export** — single `catalog.json` + `catalog-version.json` pointer (buildId,
   sha256, commit-pinned URLs). App fetches pointer → pinned bytes → verify hash.

## Research tips (when Grok Bot assists)

1. Prefer **machine-readable** manufacturer feeds (electron-builder YAML, Sparkle
   appcasts, Mac App Store version pages) over forum posts.
2. For hub apps: capture **bundle ID + CFBundleShortVersionString** from a real
   Mac install when possible; that is exactly what the scanner reads.
3. One chip = one claim with a falsification condition (URL shape death, login
   wall, channel rename).
4. Do not chase KVR / secondary aggregators for shipping confidence.
5. When stuck behind a login hub: ship portal CTA + `notesForUser`, leave
   `latestVersion` empty — that is a valid, trusted state.

- **Recommendation:** prioritize in this order for the next export:
  1. `installedVersionRule` + `identityKeys.bundleIds` on the 15 DAW rows
  2. Same + name/`matchPatterns` fixes on the six Luke-named helpers (+ Native
     Access, Softube Central)
  3. Arturia SC version or explicit unversioned + portal note; eLicenser
     discontinued/`finalVersion`
  4. Keep filling plugin identity keys / generations as today
- **If accepted, what changes in the engine:** export fills the fields above;
  no app change required for (1)–(3) beyond what already shipped.
- **Expected impact:** sidebar DAW/helper rows flip from inferred /
  "check in app" to verified current/update/paid/discontinued.
- **Risks / caveats:** over-fitting rules to one Mac's plist quirks — prefer
  transforms that are documented by the vendor's version scheme.
- **Suggested first step:** PAC + iLok + Waves Central + Avid Link: add
  `identityKeys.bundleIds` from any available Mac scan fixture and `{}` or the
  obvious transform; fix PA / Native Access `matchPatterns` to the real `.app`
  names.
