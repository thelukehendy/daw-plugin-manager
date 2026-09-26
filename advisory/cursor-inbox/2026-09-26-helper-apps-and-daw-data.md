# Helper apps and DAWs: app shipped, data asks (2026-09-26)

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Context:** Luke asked to see DAW updates and updates to helper apps (iLok License
  Manager, Waves Central, Avid Link, PA Installation Manager, Arturia Software Center,
  eLicenser Control Center). The app now shows both in a sidebar. New living guide for you and
  Grok Bot: `advisory/cursor-inbox/APP-DATA-GUIDE.md` (please link it from
  `PROJECT-BRIEF.md` so Grok Bot reads it).

## Contract change (heads-up)

The DAW rows still have no `installedVersionRule`, so the app now **infers** a
comparison when the rule is missing, conservatively:

- same major and behind → "Likely update" at most (never a verified "Update")
- DAW behind by a major → "newer version, often a paid upgrade"
- helper app behind by a major → "Likely update" (helper majors are free)
- different number formats → only the year scheme (`26` → `2026`, within 5 years)
- a rule, when present, always wins and allows a verified "Update"

Please still fill the rules: they upgrade "Likely" to verified and remove guesswork.

## What Luke's Mac shows now (build `2026-09-26T13:02:55Z`)

| App | Installed | Catalog | Verdict |
|---|---|---|---|
| Ableton Live 12 Suite | 12.2.7 | 12.4.6 (82) | Likely update |
| REAPER | 7.54.0 | 7.80 | Likely update |
| Ableton Live 10 Suite | 10.1.43 | 12.4.6 | Newer major (paid?) — needs a Live 10 generation row |
| Reason 12 | 12.7.4 | 14.1.0 | Newer major (paid?) — needs a Reason 12 generation row |
| Logic / GarageBand / Pro Tools | — | — | Up to date |
| Studio One 4 / 5 | 4.6.2 / 5.5.2 | none | No row (generation mapping, as you flagged) |
| iLok License Manager | 5.10.5 | 6.0.1 | Likely update |
| IK Product Manager | 1.1.12 | 1.1.15 | Likely update |
| Avid Link | 26.4.0 | 2026.4.0 | Up to date |
| Waves Central | **17.0.4** | 16.7.2 | Catalog is behind |

## Data asks

1. **Helper-app identity keys** (from Luke's opted-in scan):

   | App name on disk | Version | Bundle ID | Catalog row today |
   |---|---|---|---|
   | iLok License Manager | 5.10.5 | `com.paceap.eden.iLokLicenseManager` | `pace--ilok-license-manager` |
   | Waves Central | 17.0.4 | `com.WavesAudio.central` | `waves--waves-central` (stale) |
   | Avid Link | 26.4.0.4668 | `com.avid.link` | `avid--avid-link` |
   | IK Product Manager | 1.1.12 | `com.ikmultimedia.productmanager` | `ik-multimedia--ik-product-manager` |
   | PA-InstallationManager | 1.4 | `com.plugin-alliance.plugins.PAInstallationManager` | `plugin-alliance--installation-manager` (name doesn't match) |
   | Native Access | 3.26.0 | `com.native-instruments.nativeaccess2` | none |
   | iZotope Product Portal | 1.4.9 | `com.izotope.productportal` | none |
   | Auto-Tune Central | 2.0.2 | `com.Antares.AutoTuneCentral` | none |
   | SSL Download Manager | 1.5.6 | `com.solidstatelogic.downloadmanager` | none |
   | Complete Access Hub (Slate) | 2.13.0 | `com.slatedigital.connect` | none |
   | Steven Slate Audio Center | 3.2.4 | `com.yme.slateaudio-center` | none |
   | UVI Portal | 2.1.2 | `net.uvi.UVIPortal` | none |
   | XLN Online Installer | 4.7.2 | `com.xlnaudio.xlnonlineinstaller` | none |
   | MPluginManager (Melda) | — | `com.meldaproduction.MPluginManager` | none |
   | UnitedPluginsManager | — | — | none |

   Add `identityKeys.bundleIds` to existing rows, and `hub_app` rows (with
   `installedVersionRule`) for the ones without.
2. **Waves Central latest** is behind (installed 17.0.4 > 16.7.2).
3. **DAW `installedVersionRule` + bundle IDs** (from `2026-09-25-daw-rows-what-the-app-needs.md`).
4. **Generation rows** for Ableton Live 10/11 and Reason 12/13 (paid majors), same shape
   as S-Gear.
5. **S-Gear 2 `manufacturerId`** is still `scuffham` (doesn't exist) — see
   `2026-09-25-sgear-2-orphan-manufacturer.md`.
6. **eLicenser Control Center** is `standalone_app` + `discontinued`; the app shows
   "Discontinued" for it. If it's better modeled as `hub_app`, either works.
