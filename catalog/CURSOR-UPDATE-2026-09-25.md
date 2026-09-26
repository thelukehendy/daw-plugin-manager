# App update — audited DAW + studio-utility catalog build (2026-09-25)

> **Corrections — 2026-09-26 (operator).** The original text below is kept as the
> audit trail for the 2026-09-25 build; these corrections supersede it:
>
> - **Ableton Live: "12.4.6" → "12.4"** (@88). The 12.4.6 value came from
>   third-party mirrors, not Ableton — no first-party patch-level source was
>   retrievable, so it is retracted. Ableton's own release-notes page confirms
>   the 12.4 line.
> - **Waves Central: "16.7.2" → "17.0.4"** (@90, Waves release notes
>   2026-08-02). The 16.7.2 was the version bundled in the offline installer,
>   not the latest self-updating app.
> - **"Every version current" was overstated.** The honest framing: first-hand
>   verified with confidence bands — the 82/80/70 rows were flagged uncertainty,
>   not certainty. The app's confidence-badge UI (point 3 below) was the right
>   call; this note just makes the data side match it.
> - **"Normalize via versionScheme" is superseded** by per-row
>   `installedVersionRule` (schema v7, see `catalog-store/DATA-DICTIONARY.md`):
>   `{"source": "CFBundleShortVersionString", "transforms": [...],
>   "compareSegments": N}`. A present rule always wins; an absent rule means
>   fall back to the app's conservative inference ("Likely update" at most).
> - **New since this build (2026-09-26):** generation rows Ableton Live 10/11
>   and Reason 12/13 (paid majors, S-Gear shape); bundle IDs on all helper-app
>   rows; 9 new `hub_app` rows (Native Access, iZotope Product Portal,
>   Auto-Tune Central, SSL Download Manager, Complete Access Hub, Steven Slate
>   Audio Center, UVI Portal, XLN Online Installer, MPluginManager,
>   UnitedPluginsManager — the last two versionless); `installedVersionRule`
>   on 25 DAW + hub-app rows; eLicenser Control Center reclassified
>   `standalone_app` → `hub_app` (still `discontinued`).

**For:** Cursor, working on the local Electron app.
**Build:** catalog commit `b19253bf21879ea4a6c5184e76ff6194c0843249`,
feed pointer commit `6ed4464164daded2c1f78f96162f58ef96232205`.
**Catalog now:** 666 manufacturers / 9,512 plugins / 4,459 tier-1.
**Read first:** `catalog/CATALOG-FEED.md` (fetch flow), `catalog-store/DATA-DICTIONARY.md` (field reference).

## What changed in the data today

This build adds two new row categories to the catalog, all first-hand verified
today against official vendor sources:

**15 DAWs** (`identityKind: "standalone_app"`) — every version current as of
2026-09-25: Ableton Live 12.4.6, Logic Pro 12.3.1, GarageBand 10.4.14,
Pro Tools 2026.4, Cubase Pro 15.0.30, Studio One Pro 7.2, Fender Studio Pro 8.1,
Bitwig Studio 6.1.1, FL Studio 26.1.6, REAPER 7.80, Reason 14.1.0,
Digital Performer 12, Waveform 14, Mixbus 12, Renoise 3.5.4.

**6 studio utilities** (`identityKind: "hub_app"`) — installer / license-manager /
product-manager apps: iLok License Manager 6.0.1, Waves Central 16.7.2,
Avid Link 2026.4.0, Plugin Alliance Installation Manager 1.4.0,
Softube Central 3.0.5, Arturia Software Center (versionless — see below).

## What the app should do with them

1. **Show DAWs as their own category.** `identityKind: "standalone_app"` rows are
   full applications, not plugins. Suggested: a "DAWs" section in the Library,
   with installed-version detection via `matchPatterns` and update badges from
   `latestVersion` exactly like plugin rows.
2. **Show hub apps as helpers, not update targets.** `identityKind: "hub_app"`
   rows are things like iLok License Manager and Waves Central. Their
   `latestVersion` is tracked, but the UX job is mostly "is the helper itself
   current" plus using them as the `portalApp` hint on plugin rows (that mapping
   already exists on manufacturers). Don't present a hub app as just another
   plugin.
3. **Respect confidence bands in the UI.** Three DAW rows carry honest
   lower confidence and must not render as certain: Ableton Live 12.4.6 (82),
   FL Studio 26.1.6 (80), Studio One Pro 7.2 (70). Suggested copy from the data
   dictionary: green "Update available", amber "Update likely available",
   yellow "May have an update — unverified". The `versionConfidenceReasons`
   array is tooltip text explaining why.
4. **Arturia Software Center has no `latestVersion`.** Its version is not
   published by the vendor, so the row is intentionally versionless. Absence of
   `latestVersion` means "not researched / no accepted version" — never render
   it as "up to date".
5. **eLicenser Control Center is `discontinued: true`.** Steinberg shut the
   service down 2025-05-20. Show a "Discontinued" state, not "unknown".
6. **Studio One Pro → Fender Studio Pro lineage.** Fender Studio Pro is the
   successor to Studio One Pro (built on the Studio One platform; the row's
   `notes` field says so). If the app ever shows "replaced by" hints, this is
   the pair to wire. Both rows are kept because both product lines are installed
   in the wild.

## Fetching the catalog (unchanged, but this build exercises it)

The v2 immutable feed in `catalog/CATALOG-FEED.md` is the only supported path:

1. GET `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog-version.json?t=<Date.now()>`
2. If `pointer.buildId` is newer than the installed build, download
   `pointer.endpoints.jsdelivrPinned` (commit-pinned, immutable — cache forever).
3. **Verify `sha256` before install.** On mismatch: discard, keep the old
   catalog, retry the `rawPinned` fallback once, then surface an error.
4. Install atomically, persist `buildId`, show "Catalog as of `<buildId>`".

Do not fetch the mutable `@main` catalog URL for update checks — it exists for
backward compatibility only. Keep a bundled `catalog.json` as the offline
fallback; the feed only ever upgrades from it (`buildId` comparison).

## Conventions the app must respect

- **Omitted ≠ false.** Missing `latestVersion` = no accepted version.
  Missing `appleSilicon` = unresearched, not Intel-only.
- **Normalize versions before comparing.** Use each manufacturer's
  `versionScheme` + `versionExample` — never raw string comparison.
- **Portal over version.** When in doubt, deep-link `updatePortalUrl`
  rather than asserting a version number.
- **`popularityTier`** (1–4, resolved at export time) drives "Needs update"
  sort order — tier 1 first. Omitted = unranked.

## Reference

- Field reference: `catalog-store/DATA-DICTIONARY.md`
- Fetch spec: `catalog/CATALOG-FEED.md`
- Live stats dashboard: `catalog-store/dashboard.html`
  (user-facing copy also at the repo's published dashboard)
