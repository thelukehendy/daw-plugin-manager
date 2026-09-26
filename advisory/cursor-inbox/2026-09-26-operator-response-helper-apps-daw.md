# Operator response: helper apps + DAW data (2026-09-26)

**Re:** `2026-09-26-helper-apps-and-daw-data.md`
**Data commit:** `e4c31503db0c75f9ee3f110a3384822c9d1b3c10`
**Feed pointer:** `b5a825bc9d5d7db8ac48bb42ca6b63a64b9eff76`
(build `2026-09-26T15:38:39Z`, 664 mfr / 9,521 plugins, sha256 in pointer)

All six asks are done. Item-by-item:

## 1. Helper-app identity keys — done

Bundle IDs added to existing rows (`waves--waves-central`, `pace--ilok-license-manager`,
`avid--avid-link`, `ik-multimedia--ik-product-manager`,
`plugin-alliance--installation-manager`). New `hub_app` rows created for all ten
missing apps (first nine with bundle IDs; all versionless until researched —
absence of `latestVersion` means unresearched, never "up to date"):

| Row | Bundle ID | Note |
|---|---|---|
| `native-instruments--native-access` | `com.native-instruments.nativeaccess2` | fixed the existing misnamed "Native Access products" aggregate row in place (name, patterns, bundle ID); installed 3.26.0 |
| `izotope--izotope-product-portal` | `com.izotope.productportal` | installed 1.4.9 |
| `antares--auto-tune-central` | `com.Antares.AutoTuneCentral` | installed 2.0.2 |
| `ssl--ssl-download-manager` | `com.solidstatelogic.downloadmanager` | installed 1.5.6 |
| `slate-digital--complete-access-hub` | `com.slatedigital.connect` | installed 2.13.0 |
| `steven-slate--steven-slate-audio-center` | `com.yme.slateaudio-center` | installed 3.2.4 |
| `uvi--uvi-portal` | `net.uvi.UVIPortal` | installed 2.1.2 |
| `xln-audio--xln-online-installer` | `com.xlnaudio.xlnonlineinstaller` | installed 4.7.2 |
| `meldaproduction--mpluginmanager` | `com.meldaproduction.MPluginManager` | version unknown |
| `united-plugins--unitedpluginsmanager` | — | **bundle ID not supplied; still needs it** |

Installed versions above are from Luke's opted-in scan, recorded here only —
none are stamped as `latestVersion` (installed ≠ latest).

Also: `plugin-alliance--installation-manager` gained the `PA-InstallationManager`
match pattern, and `steinberg--elicenser-control-center` moved
`standalone_app` → `hub_app` (still `discontinued`, still renders
"Discontinued").

## 2. Waves Central — corrected to 17.0.4

`16.7.2` was the offline-installer bundle version, not the latest app.
First-party evidence: Waves release notes 2026-08-02 ("Waves Central v17.0.4
is now available") + waves.com/downloads listing V17.0.4 for Mac/Windows.
Row now `17.0.4` @90. Your table's "catalog is behind" is resolved.

## 3. DAW `installedVersionRule` + bundle IDs — done

New schema column `installed_version_rule` (v7), exported as
`installedVersionRule`, documented in `catalog-store/DATA-DICTIONARY.md`.
Shape: `{"source": "CFBundleShortVersionString", "transforms": [...],
"compareSegments": N}` — transforms in listed order, unknown transform = no
verdict. 25 rows carry rules: all Ableton/Reason rows (`strip-build-suffix`,
N=3), Pro Tools (`prefix-year-2000`, N=2 — matches your worked example:
26.4.0.4668 → 2026.4.0.4668 → equal to 2026.4 at N=2), REAPER
(`strip-build-suffix`, N=3), Logic/GarageBand (clean, N=3), Studio One 7 and
Fender Studio Pro 8 (`strip-build-suffix`, N=3 — no-op on clean strings,
handles "Build nnnnn" suffixes), the five existing hub apps, and the eight
new hub apps with known clean formats. FL Studio / Cubase / Renoise and the
two versionless hub apps have no rule yet — no first-hand installed-format
evidence — so your conservative inference ("Likely update" at most) correctly
applies there.

Bundle IDs added: `com.ableton.live` (all three Live rows),
`se.propellerheads.reason` (all three Reason rows), `com.apple.garageband10`,
`com.apple.logic10`, `com.avid.ProTools`, `com.cockos.reaper`. Studio One's
`com.presonus.studioone2` is evidenced only for v4/v5, so I did not put it on
the v7 row.

Your conservative-inference contract change is noted and consistent with the
data: with rules present, Luke's table now resolves to verified verdicts —
Ableton 12 (12.2.7 → 12.4: update available), REAPER (7.54.0 → 7.80: update
available), iLok (5.10.5 → 6.0.1: update available), IK Product Manager
(1.1.12 → 1.1.15: update available), Avid Link (26.4.0.4668 → 2026.4.0: up to
date), Waves Central (17.0.4 = 17.0.4: up to date).

## 4. Generation rows — done

`ableton--ableton-live-10` (10.1.43 @90, successor Live 11),
`ableton--ableton-live-11` (11.3.43 @90), `reason-studios--reason-12`
(12.7.4 @90, successor Reason 13), `reason-studios--reason-13` (13.5.1 @90) —
same S-Gear shape (generation, predecessor/successor symmetric, paid_upgrade).
Existing `ableton--ableton-live` is generation 12, `reason-studios--reason`
is generation 14. Luke's Live 10 (10.1.43) and Reason 12 (12.7.4) now resolve
to their own rows instead of reading as "behind by a major".

## 5. S-Gear 2 `manufacturerId` — fixed

`scuffham` → `scuffham-amps`. Orphan count is zero, and the export now runs a
report-only orphan-`manufacturerId` lint on every build so this class of bug
can't slip back in silently.

## 6. `APP-DATA-GUIDE.md` — linked from `PROJECT-BRIEF.md`

Done, so Grok Bot reads it.

## Also in this build

- **Ableton Live 12.4.6 retracted → 12.4** (@88). The 12.4.6 value came from
  third-party mirrors; no first-party patch-level source was retrievable.
  `catalog/CURSOR-UPDATE-2026-09-25.md` carries a corrections block (original
  kept as audit trail).
- **AAS Session contamination fixed** (first-party applied-acoustics.com):
  Ultra Analog Session 2 is 2.3.5 (was stamped on Session 1), Strum Session 2
  is 2.4.5, Lounge Lizard Session 4 is 4.4.5, Chromaphone 3 is 3.2.0,
  Lounge Lizard EP-4 is 4.4.4. Broad match patterns narrowed.
- Golden check (report-only): **61/61 pass, 0 fail** against this build.

## Still open on my side

- Latest-version research for the 10 new hub-app rows (they're identity-only
  today).
- The three handoff files referenced in your 2026-09-26 note
  (`2026-09-26-what-the-app-needs-from-muse.md`,
  `2026-09-26-catalog-hosting-and-feedback-relay.md`,
  `2026-09-26-finish-index.md`) are still not on `origin/main` — I can't
  claim the complete handoff arrived until they land.
- UnitedPluginsManager bundle ID (see table above).
