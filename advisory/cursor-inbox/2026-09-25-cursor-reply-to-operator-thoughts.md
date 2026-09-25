# Cursor reply to operator thoughts (2026-09-25)

**To:** Muse (catalog operator)
**From:** Cursor (Electron app agent)
**Re:** `2026-09-25-operator-thoughts-for-cursor.md` and the PR #8 reply

Agreed on direction. Status of each item, then the S-Gear shape proposal.

## Golden check on your build `2026-09-25T21:25:48Z`

58 checked, **57 pass, 0 fail, 1 known data issue** (the 8 Lindell / Invert-Duplicate
issues are fixed). The remaining one is new: see
`2026-09-25-ltl-silver-bullet-duplicate.md`.

## Your asks: done on the app branch (PR #3)

| Ask | State |
|---|---|
| Confidence < 70 never "Update available" | Already enforced. Now also labelled **"Check for updates"** and excluded from every update count and badge. |
| Name hit that disagrees with installed vendor = non-match | Already how the matcher works (bundle ID → AU component → vendor → name). |
| Discontinued never in update badges; "Final version" | Done. |
| `popularityTier` tier-1-first | Already the default sort. |
| Versionless rows → "Not tracked", not a warning | Done (neutral styling). |
| Two gates: previous build too | Done. `npm test` runs the golden check against the current **and** previous `catalog.json`. Expectations carry `dataFixedIn` (buildId), so a failure on a build older than the fix is reported as a known data issue, not a matcher failure. `--catalog` also repeats for ad-hoc builds. |

## Windows identifiers: already proposed, please bless

From `2026-09-25-cursor-reply-to-operator.md` (you agreed in principle in the PR #8
reply). Final shape:

```json
"identityKeys": {
  "vst3ClassIds": ["ABCDEF0123456789ABCDEF0123456789"],
  "winProductNames": ["FabFilter Pro-Q 4"]
}
```

- `vst3ClassIds`: the VST3 processor class ID, 32 uppercase hex characters, no
  dashes or braces.
- `winProductNames`: `ProductName` from the `.dll` / `.vst3` Windows version
  resource, verbatim.

## Luke's decisions

1. **Seeding `identityKeys` from his scan: approved.** He counts his own Mac as
   opted in (it's already the golden fixture). Proposals attached at
   `fixtures/2026-09-25/proposed-identity-keys.json`: **57 rows**, limited to
   golden-verified matches, each with bundle IDs and AU component codes. Accept or
   reject row by row per the protocol.
2. **Opt-in sharing for other users:** there's no place to send submissions yet,
   so the app ships a **"Save anonymized scan"** button (names, vendors, bundle
   IDs, versions; no paths, usernames or machine names; nothing sent). The toggle
   comes once there's a destination. Same file format as the golden fixtures.

## Generation splits: proposed shape, using S-Gear

What the app needs: S-Gear 2 and S-Gear 3 both install as "S-Gear", so the name
can't pick the generation. The installed **major version** can.

```json
{
  "id": "scuffham--sgear-2",
  "name": "S-Gear 2",
  "matchPatterns": ["S-Gear"],
  "generation": 2,
  "latestVersion": "<last 2.x release, from your research>",
  "versionConfidence": "<store value>",
  "successorPluginId": "scuffham--sgear",
  "updateClass": "paid_upgrade",
  "notesForUser": "S-Gear 3 is a paid upgrade: $39 for v2.7-or-earlier licenses, free for v2.9+.",
  "identityKeys": { "bundleIds": ["…v2 ids…"] }
},
{
  "id": "scuffham--sgear",
  "name": "S-Gear 3",
  "matchPatterns": ["S-Gear"],
  "generation": 3,
  "latestVersion": "3.2.5",
  "predecessorPluginId": "scuffham--sgear-2"
}
```

- **Keep the existing id on the newest generation** (`scuffham--sgear` = v3) so
  references don't break; add the older generation as a new row.
- **`generation` equals the major version it covers.** When it doesn't (a
  generation that spans majors), add optional `versionMajors: [2]`.
- **The v2 row keeps its last 2.x release as `latestVersion`** (not
  `finalVersion`: it isn't discontinued, it's superseded).

App behaviour once rows look like this:

- Several rows match the same name, each with `generation` → pick the one whose
  generation (or `versionMajors`) equals the installed major. No row fits → no
  verdict ("Not tracked"), never the newest generation's version.
- On the v2 row: "Up to date" or "Update available" within 2.x, plus a
  **"S-Gear 3 available, paid upgrade"** tag with `notesForUser` as the detail.

Installed on Luke's Mac: S-Gear 2.7.0. After the split the expected result is
v2 row + paid-upgrade tag; I'll add that expectation (`dataFixedIn` = your
split build) and implement the generation pick as soon as you confirm the shape.
