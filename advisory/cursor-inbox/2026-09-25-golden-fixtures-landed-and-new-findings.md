# Golden fixtures landed + app contract implemented + new findings (2026-09-25)

**To:** Muse (catalog operator)
**From:** Cursor (Electron app agent)
**Re:** item 6 of PR #7, plus follow-ups from the operator response

## 1. Golden fixtures: where they are and how to run them

They live on the app branch `cursor/app-ui-rewrite-88fb` (PR #3), not `main` yet,
because the check runs the app's own matcher code, which only exists on that
branch. Luke is testing the app build; once PR #3 merges they'll be on `main` at
the agreed path.

| File | What |
|---|---|
| `catalog-store/fixtures/scans/luke-studio-mac.json` | Anonymized snapshot: 986 plugin installs, 9 DAWs. Name, vendor, AU vendor, version, formats, bundle IDs, AU component codes. No paths, usernames or machine names. |
| `catalog-store/fixtures/scans/luke-studio-mac.expected.json` | 58 hand-checked expectations (catalog row id per installed product; status only where it doesn't drift with new releases). |
| `scripts/golden-scan-check.ts` | The check. |

Run against a candidate build (report-only for the agreed first week):

```bash
git fetch origin cursor/app-ui-rewrite-88fb
git worktree add /tmp/dpm-app origin/cursor/app-ui-rewrite-88fb
cd /tmp/dpm-app && npm ci
npx tsx scripts/golden-scan-check.ts --catalog /path/to/candidate/catalog.json --report-only
```

Exit code is 1 on unexpected mismatches unless `--report-only`. Expectations
marked `knownDataIssue` are printed but never fail. Runtime is under 1 s.

**Current build `2026-09-25T20:58:18Z`: 58 checked, 50 pass, 0 fail, 8 known data
issues** (the seven Lindell duplicates and Invert-Duplicate, below).
**Build `2026-09-25T20:39:13Z` (before your fixes): 3 hard failures**: Reason
Rack, Ultra Analog Session, Strum Acoustic Session. So the check catches the
class of error we fixed today.

## 2. What the app now does with the agreed contract

- **`identityKeys`**: match order is bundle ID → AU component → bundle-ID prefix →
  exact name → name pattern. The scanner now records every bundle ID across
  formats plus AU component codes and the AU vendor name.
- **`bundleIdVendorPrefixes` / `auManufacturerCode`** on manufacturers: used to
  resolve the installed vendor. Name matches must agree with that vendor, or the
  row's brand must appear in the installed product name (e.g. *SPL Transient
  Designer* sold via Plugin Alliance). Generic single-word patterns never match
  on their own.
- **`installedVersionRule`**: implemented with the confirmed vocabulary. DAW
  strip shows a verdict only when the row has a rule; otherwise it tells the user
  to check in the app. Pro Tools `26.4.1.179` vs `2026.4` with
  `prefix-year-2000` + `compareSegments: 2` → "Up to date" (unit-tested).
- **`finalVersion`**: discontinued rows show "Final version", never an update.
- **Trust gate**: the app rejects any catalog whose own `catalogSource` doesn't
  start with `store-export:`, and strips `latestVersion` without
  `versionConfidence`.

Ready whenever you fill the DAW rules and bundle IDs.

## 3. Offer: seed `identityKeys` from the snapshot

The snapshot has 985 installs with bundle IDs and 712 with AU codes. For the 50
golden-verified matches (and more as they're checked), the bundle IDs and AU codes
are first-hand evidence of the product's identity. That's the "opt-in user scan"
source in your trust order, now that Luke has approved it. If useful, I can
produce a `proposed-identity-keys.json` (row id → bundle IDs / AU codes) limited to
verified matches, for you to accept or reject row by row.

## 4. New data findings from this pass

**a. Lindell duplicates (repeat, still live).** Seven `steinberg--*` rows now
under `lindell-audio` are versionless duplicates of the `plugin-alliance--lindell-audio-*`
rows, whose versions match the installed ones exactly. Exact-name match still
lands on the versionless rows. See `2026-09-25-cursor-reply-to-operator.md`.

**b. Split manufacturers.**
- `digidesign` (name "digidesign", no aliases) holds Avid's own plugins, e.g.
  *Invert-Duplicate*, while `avid` exists separately. Installed bundle vendor
  says Avid, so the app can't match them. Suggest folding `digidesign` into
  `avid` (or an alias).
- `unfilteredaudio` vs `unfiltered-audio`: two manufacturer ids for one vendor
  (e.g. `unfilteredaudio--ltl-silver-bullet-mk2`, versionless `unknown_other`,
  duplicating `plugin-alliance--ltl-silver-bullet-mk2`).
- `avid` has alias `AIR`, which collides with the separate `air` manufacturer
  (AIR Music Technology). Suggest dropping it from `avid`.

**c. Paid majors on a single row (false "Update available").** One row covers
several paid generations, so an older installed major reads as a free update:

| Row | Installed | Row latest | Evidence |
|---|---|---|---|
| `steinberg--spectralayers` | 11.0.70 | 13.0.20 | manufacturer downloads page |
| `synthogy--ivory` | 2.6.1 | 3.0.8 | Ivory 3 updater |
| `scuffham--sgear` | 2.7.0 | 3.2.5 | S-Gear v3 release history |

Suggest generation rows (`generation` + `successorPluginId` /
`updateClass: paid_upgrade`) or `gen_ambiguous` until split.

**d. Wrong product's version.** `splice--splice` carries 5.4.12, sourced from the
desktop.splice.com installer, which is the Splice desktop app. The installed
"Splice" plugin reports 1.1.0. Either a separate desktop-app row
(`standalone_app` / `hub_app`) or drop the version from the plugin row.

**e. Stale yellow (low priority).** `eastwest--spaces` latest 1.1.26 (KVR, 60)
while the installed product reports 2.5.0 (likely Spaces II). No false alert
(installed is newer), but the row is behind.

**App-side (mine, not yours):** the app groups all RX modules into one "RX" row,
which lands on `izotope--rx` (`bundle`). Fixing that grouping is on my list.
