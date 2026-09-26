# App data guide — what the app needs from the catalog

**Audience:** Muse (catalog operator) and Grok Bot (research assistant).
**Maintainer:** Cursor (app). Living document; changes are announced in `advisory/cursor-inbox/`.
**Roles:** Cursor orchestrates and builds the app. Muse owns the store, research and exports.
Grok Bot researches for Muse. Luke decides product questions.

## 1. What the app does with the catalog

For each installed product the app answers three questions, in order:

1. **Which catalog row is this?** (identity)
2. **What's the newest version we trust?** (latest + confidence)
3. **What should the user do?** (update, open a hub app, paid upgrade, nothing)

Identity comes first because a perfect version on the wrong row is worse than no
version. Every design choice below follows from that.

## 2. Hard requirements (the app relies on these)

| Requirement | Why |
|---|---|
| `catalogSource` starts with `store-export:` | The app refuses any other catalog. |
| `latestVersion` only with `versionConfidence` | Versions without confidence are stripped on load. |
| Every plugin's `manufacturerId` exists in `manufacturers` | Rows with an unknown manufacturer can't be matched at all (S-Gear 2 today). |
| Row `id`s are stable forever | Golden expectations, user feedback and saved libraries reference them. Never rename; retire with `supersededByPluginId`. |
| One row per sellable product generation | Two rows for the same product (Lindell, LTL duplicates) make the app pick the wrong one. |
| `catalog-version.json` pointer published with every export, sha256 matching the pinned file | The app only installs verified builds. |
| `schemaVersion` stays 3 unless the app is told first | Additive optional fields are fine; renames and removals break older installed apps. |

## 3. What breaks the app (please avoid)

- **Cross-generation stamping.** Putting Session 2's version on the Session 1 row, or
  Ivory 3's on the Ivory row, turns into a false "Update available" for every user on
  the older generation. Split generations instead (see §5).
- **Broad `matchPatterns`.** A pattern that's a bare product family (`Ultra Analog`),
  a common word (`Reverb`, `EQ`) or shorter than 4 characters. The app refuses these
  on its own, but they hide the real identity.
- **Desktop-app versions on plugin rows** (Splice 5.4.12 on the plugin row). Separate
  rows for the app and the plugin.
- **Manufacturer splits and alias collisions** (`digidesign` vs `avid`; `avid` alias
  `AIR` colliding with AIR Music Technology). Aliases are global: an alias must name
  only one vendor.
- **Changing a field's meaning silently.** Example: `latestVersion` on a discontinued
  row meaning "final release". Agree a new field (`finalVersion`) instead.
- **Removing fields the app reads** without notice: `identityKind`, `portalApp`,
  `updatePortalUrl`, `generation`, `successorPluginId`, `updateClass`,
  `installedVersionRule`, `identityKeys`.

## 4. What helps most (in order of payoff)

1. **`identityKeys` on rows** (`bundleIds`, `auComponents`; Windows: `vst3ClassIds`,
   `winProductNames`). A bundle-ID match beats any name match. Highest payoff for
   tier-1 vendors and for helper apps / DAWs, where names vary ("PA-InstallationManager").
2. **Manufacturer-level `bundleIdVendorPrefixes` + `auManufacturerCode`.** One field
   fixes wrong-vendor matches for an entire vendor.
3. **`installedVersionRule` on every DAW and helper-app row.** Without it the app
   compares conservatively and can only say "Likely update". An empty rule `{}` means
   "direct comparison is safe".
4. **Generation rows for paid majors** (§5). Turns false updates into honest
   "paid upgrade available".
5. **`portalApp` + `updatePortalUrl` on every manufacturer.** When the app can't give a
   version, it can always send the user to the right place.
6. **`notesForUser`** for anything a user needs to know (upgrade pricing, "update via
   the hub"). Shown verbatim; keep it short and factual.
7. **Freshness on high-traffic rows** (tier 1, DAWs, helper apps). A stale latest makes
   installed look "newer than catalog" (Waves Central 16.7.2 vs 17.0.4 installed).

**Less helpful for the app:** more soundset / expansion rows, long `notes` prose,
KVR-only versions at confidence 60 (they never produce an update alert; a portal link
serves users better), and research on products nobody has installed yet.

## 5. Recommended shapes

**Generation split** (reference: S-Gear, agreed 2026-09-25):

```json
{ "id": "vendor--product-2", "name": "Product 2", "matchPatterns": ["Product"],
  "generation": 2, "latestVersion": "<last 2.x>", "versionConfidence": 90,
  "successorPluginId": "vendor--product", "updateClass": "paid_upgrade",
  "notesForUser": "Product 3 is a paid upgrade: <terms>." }
{ "id": "vendor--product", "name": "Product 3", "matchPatterns": ["Product"],
  "generation": 3, "latestVersion": "3.2.5", "predecessorPluginId": "vendor--product-2" }
```

The app picks the row whose `generation` (or `versionMajors`) equals the installed
major. Keep the existing id on the newest generation.

**DAW / helper app row:**

```json
{ "identityKind": "standalone_app" | "hub_app",
  "identityKeys": { "bundleIds": ["com.cockos.reaper"] },
  "installedVersionRule": { "transforms": ["strip-build-suffix"], "compareSegments": 2 },
  "portalApp": "…", "updatePortalUrl": "…" }
```

Transforms: `strip-build-suffix`, `prefix-year-2000`, `semver-first-3`;
`compareSegments: N` compares the first N numeric segments.

## 6. Organizing the store

- **Identity table separate from version observations.** Identity (row, keys,
  generation, successor) changes rarely and needs review; versions change daily. Keep
  them in separate tables so a version job can never rewrite identity.
- **Manufacturers are canonical entities**; aliases in their own table with a
  uniqueness constraint (one alias → one vendor).
- **Lints that block export:** orphan `manufacturerId`, duplicate identity (same
  manufacturer + normalized name, or same bundle ID on two rows), broad patterns,
  version without confidence, latest on discontinued rows.
- **Golden check in the export job** (`scripts/golden-scan-check.ts`, report-only for
  the agreed first week, then blocking). Add an expectation whenever you fix a data bug,
  with `dataFixedIn` set to the fixing build.
- **Tier by installs, not by fame.** Once feedback scans arrive (Luke-approved, opt-in),
  prioritize rows that real users have installed.

## 7. Research tips (Muse and Grok Bot)

- **Vendor-owned sources first:** release notes, update feeds (Sparkle `appcast.xml`,
  `latest-mac.yml`), download-page installer names, hub-app catalogs. KVR and forums
  are leads, not evidence.
- **Record the evidence URL and the exact string seen**, so a later check can
  re-verify it mechanically.
- **Identity evidence is as valuable as version evidence.** A bundle ID from an
  installer receipt or a user scan settles identity permanently.
- **Check the generation on every version:** does the evidence name the same major as
  the row? If the page says "Product 3", it doesn't belong on the "Product 2" row.
- **Watch for retractions** (vendor pulls a release): keep the previous accepted
  version rather than leaving the row empty.
- **Prefer "portal only" over a weak version.** If only a KVR number exists, a good
  `updatePortalUrl` and `portalApp` help users more.

## 8. How to raise things with Cursor

One issue per file in `advisory/cursor-inbox/` (or verdicts in `advisory/verdicts.md`).
Contract changes (new fields, changed meaning, schema bumps) need a Cursor verdict
before they ship in an export.
