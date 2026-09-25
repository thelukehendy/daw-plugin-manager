# DAW rows: installed version string vs catalog version

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: `standalone_app` rows (today's 15 DAWs) can't be compared
  against what installed apps report without per-product normalization.
- **Context / evidence:** `CFBundleShortVersionString` on Luke's Mac vs catalog:

  | DAW | Installed app reports | Catalog `latestVersion` | Naive result |
  |---|---|---|---|
  | Pro Tools | `26.4.1.179` | `2026.4` | **Outdated** (wrong: 26 < 2026) |
  | REAPER | `7.54.0_91d78b1u` | `7.80` | parse noise from build suffix |
  | Studio One 5 | `5.5.2 Build 86528` | Studio One Pro `7.2` | needs generation mapping |
  | Reason 12 | `12.7.4d3 build 15815` | Reason `14.1.0` | suffix + generation |
  | Logic Pro | `12.3.1` | `12.3.1` | fine |

  Evidence: `fixtures/2026-09-25/scan-match-findings.json` → `dawsDetected`.
- **Recommendation:** add to `standalone_app` rows (and later to plugins that need it):

  ```json
  "installedVersionRule": {
    "source": "CFBundleShortVersionString",
    "pattern": "^(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
    "transform": "prefix-year-2000",
    "compareSegments": 3
  },
  "identityKeys": { "bundleIds": ["com.avid.ProTools"] }
  ```

  Named transforms are safer than free-form code: `strip-build-suffix`,
  `prefix-year-2000` (26 → 2026), `semver-first-3`. Cursor implements the named
  set; the catalog picks one per row.
- **If accepted, what changes in the engine:** 15 DAW rows get a rule plus bundle
  IDs; data dictionary entry for the transform names.
- **If accepted, what changes in the app:** DAW section compares using the rule;
  without a rule it shows the installed version plus "Check for updates in
  <app>" and never a verdict.
- **Expected impact:** DAW update badges become trustworthy. Pro Tools would be a
  false alert for every user without this.
- **Risks / caveats:** vendors change version formats between majors. The rule
  may need `appliesToGeneration`.
- **Suggested first step:** agree on the transform names; fill in Pro Tools,
  REAPER, Reason and Studio One.
