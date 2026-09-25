# DAW rows: what the app needs to show DAW updates

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** Luke sees no DAW update notices. The app side is built and
  unit-tested; the DAW rows don't carry the agreed fields yet (0 rows have
  `installedVersionRule`, 0 DAW rows have `identityKeys`).
- **Context / evidence:** the 9 DAWs on Luke's Mac against build `2026-09-25T21:45:55Z`:

  | Installed | Reports | Bundle ID | Catalog row | Why no verdict |
  |---|---|---|---|---|
  | Logic Pro | `12.3.1` | `com.apple.logic10` | `apple--logic-pro` 12.3.1 | no `installedVersionRule` |
  | GarageBand | `10.4.14` | `com.apple.garageband10` | `apple--garageband` 10.4.14 | no rule |
  | Pro Tools | `26.4.1.179` | `com.avid.ProTools` | `avid--pro-tools` 2026.4 | no rule (needs `prefix-year-2000`) |
  | REAPER | `7.54.0_91d78b1u` | `com.cockos.reaper` | `cockos--reaper` 7.80 | no rule (needs `strip-build-suffix`); would show **Update 7.80** |
  | Ableton Live 12 Suite | `12.2.7 (2025-11-03_…)` | `com.ableton.live` | `Ableton Live` 12.4.6 | now matched by name; no rule, no bundle ID |
  | Ableton Live 10 Suite | `10.1.43 (2022-06-16_…)` | `com.ableton.live` | none for Live 10 | same bundle ID as Live 12: needs generation rows |
  | Reason 12 | `12.7.4d3 build 15815` | `se.propellerheads.reason` | `Reason` 14.1.0 | Reason 12 is an older paid major: generation |
  | Studio One 4 / 5 | `4.6.2 Build …` / `5.5.2 Build …` | `com.presonus.studioone2` | Studio One Pro 7.2 / Fender Studio Pro | generation mapping (as you flagged) |

- **Recommendation (in order of payoff):**
  1. `installedVersionRule` on all 15 DAW rows. For DAWs that report a plain
     version, an empty rule `{}` is enough: it tells the app a direct comparison
     is safe. Pro Tools: `{ "transforms": ["prefix-year-2000"], "compareSegments": 2 }`.
     REAPER: `{ "transforms": ["strip-build-suffix"], "compareSegments": 2 }`.
     Ableton Live / Reason: `["strip-build-suffix", "semver-first-3"]`.
  2. `identityKeys.bundleIds` on DAW rows (table above has the ones on Luke's Mac).
  3. Generation rows for paid DAW majors, same shape as S-Gear: `generation`
     = major, `successorPluginId`, `updateClass: paid_upgrade`, upgrade terms in
     `notesForUser`. The app already picks the generation matching the installed
     major, so Live 10 would show "Live 12 · paid" instead of a false update.
- **App behaviour once filled:** Logic / GarageBand "Up to date", Pro Tools "Up to
  date" (26.4.1 = 2026.4), REAPER "Update 7.80" with a link, paid majors tagged.
  No rule → the app keeps saying "check in the app", never a guess.
