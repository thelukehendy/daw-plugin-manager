# Operator update: catalog hardening pass — schema v8, identity fixes, synthetic fixtures

**Date:** 2026-09-26
**Data commit:** `260bf6716d964558eab400ebfd3a0f5def4802b1`
**Feed pointer:** `b37a430b767a03d8ebc69eb5d6a54898db08437d` (build `2026-09-26T16:17:22Z`)
**Counts:** 664 manufacturers / 9,523 plugins / 5,623 accepted latest versions / 4,465 tier-1

This is a data+schema pass only. No app code changes were made or are required,
but §1 and §6 below need app-side work from you.

## 1. Schema v8: manufacturer-level `installedVersionRule` fallback (NEW — needs your awareness)

New column `manufacturers.default_installed_version_rule`. Export precedence per plugin row:

1. plugin-specific `installed_version_rule` (unchanged, always wins),
2. else the manufacturer's default,
3. else absent → no verdict ("Likely update" at most, per your conservative inference).

**`catalog/catalog.json` stays `schemaVersion: 3`.** The exporter materializes the
fallback into each row's existing `installedVersionRule` field, so you need no new
JSON field and no parser change. Invalid manufacturer-rule JSON is report-only
linted at export and never applied.

14 manufacturers received defaults (all backed by first-party version-shape evidence):
MeldaProduction, Kilohearts, Soundtoys, Softube, FabFilter, Valhalla DSP, u-he,
Oeksound, Sonnox, Eventide, Baby Audio, D16 Group, Arturia, Native Instruments.

Rules: most are `CFBundleShortVersionString` + `semver-first-3`, compare 3 segments.
FabFilter compares 2 segments (raw value, no transform). Arturia and NI apply
`strip-build-suffix` then `semver-first-3`, compare 3. Effect: rows carrying
`installedVersionRule` went from 25 → **1,279**. Rows under all other manufacturers
are unchanged (absent rule → your conservative path).

Deliberately NOT defaulted: Xfer, iZotope, Waves (version shapes too irregular).

## 2. Identity fixes (data only, live in this build)

**Verified bundle IDs added** (each first-hand verified, not from a subagent report):
- Toontrack Product Manager → `com.toontrack.productmanager`
- Aquarius → `com.acustica.Aquarius`
- Arturia Software Center → `com.Arturia.ArturiaSoftwareCenter`
- UA Connect → `com.uaudio.ua-connect`

**`universal-audio--uad-software` renamed in place to "UA Connect"** (precedent: the
Native Access fix). Its old patterns `["UAD", "Universal Audio", "UADx"]` were
over-broad (they collided with real UAD plugin rows) and are replaced by
`["UA Connect"]` + the bundle ID above.

**Six miscategorized `hub_app` rows fixed** (each first-hand verified):
- Vienna Ensemble Pro 7 / 8 / 8V → `standalone_app` (VEP is a standalone app +
  server with a VST/AU connector plugin; the real hub is the separate Vienna
  Assistant row). These were showing "use vendor hub"; they now follow your
  standalone-app path like the DAW rows.
- PlugInGuru Unify → `instrument` (software instrument + standalone, pluginguru.com).
- HOFA SYSTEM → `plugin` (runs as VST3/AU/AAX in the DAW; the HOFA-Plugins Manager
  is the separate hub — hofa-plugins.de).
- MelodyneBridge → `discontinued` (2003-era bridge plugin, dropped in Melodyne 4).

## 3. Synthetic fixtures — 90/93 pass, 0 hard failures

Four fabricated profiles added under `catalog-store/fixtures/scans/` (clearly
labeled synthetic; they are test inputs, not real-machine claims):
`synthetic-win11-flstudio`, `synthetic-mac-cubase-composer`,
`synthetic-mac-bedroom`, `synthetic-win11-studioone`.
`scripts/golden-scan-check.ts` now supports `dawExpectations`, checked through
`dawCatalogInfo()` since DAWs don't appear in plugin report rows.

Latest run against this build: **93 expectations, 90 pass, 0 fail, 3 known issues**
(all three are app-side bugs documented below — the data is correct).

## 4. App bug: Auto-Tune product-line grouping drops exact member names

`synthetic-mac-bedroom` ships Auto-Tune Pro, but the report shows 0 rows for it:
grouping resolves the product line and can pick a sibling (e.g. Auto-Tune Access)
while dropping the exact member name. Suggested fix: include exact member names in
`MatchInput` and prefer an exact member match before sibling/product-line resolution.

## 5. App bug: Splice desktop app matches the old plugin seed

A bare Splice desktop app scan matches `splice--splice` (old plugin seed) instead
of `splice--splice-desktop-app`. Suggested fix: use app/plugin context and
`identityKind` — prefer `standalone_app` for an app-only scan or a matching
desktop bundle ID.

## 6. App bug: DAW generation matching ignores installed major version (NEEDS YOUR FIX)

`dawCatalogInfo()` returns the first bundle-ID match and ignores the installed
major version when several generation rows share one identifier. Reproduced:
- Studio One 5 (installed 5.5.2) → resolves to the Studio One **4** row
- Ableton Live 11 → resolves to the Live **12** row
- Reason 12 → resolves to the Reason **14** row

Suggested fix (mirrors the plugin matcher's `generationCovers()` tie-break): in
`src/main/catalog/dawCatalog.ts`, gather all bundle-ID candidates, then use the
installed major version against `generation` / `versionMajors` before falling back
to newest/current. The new Studio One 4/5 rows (§7) exercise exactly this path —
they will misresolve until this is fixed.

## 7. New rows: Studio One 4 and 5 (evidence caveat — read this)

- `presonus--studio-one-4`: latest 4.6.2, generation 4, successor → Studio One 5
- `presonus--studio-one-5`: latest 5.5.2, generation 5, successor → Studio One Pro
- Both share bundle ID `com.presonus.studioone2`; both carry
  `CFBundleShortVersionString` + `strip-build-suffix`, compare 3. Confidence 75.

**Caveat:** the exact 4.6.2 / 5.5.2 values are corroborated through third-party
material (AudioSEX, Advanced Uninstaller); the PreSonus-hosted v4 release-notes
PDF was found but its searchable text did not visibly expose 4.6.2. Treat these
as inferred/third-party-corroborated, not first-party-confirmed. The v5 row's note
records that Studio One 6 remains an unrepresented intermediate paid generation.
These rows are live so your generation-aware matcher (§6) has something correct
to resolve to.

## 8. What to pull

Fetch the feed pointer `catalog/catalog-version.json` from
`b37a430b767a03d8ebc69eb5d6a54898db08437d`, download via the commit-pinned
jsDelivr URL, verify sha256 `174e9bc25438b2cc414e97b36ce84b71...` before install.
`DATA-DICTIONARY.md` documents the v8 column and the fallback precedence.
