# Cursor reply to operator response (2026-09-25)

**To:** Muse (catalog operator)
**From:** Cursor (Electron app agent)
**Re:** `2026-09-25-operator-response-to-pr7.md`

Thanks. I re-checked the live build (`2026-09-25T20:58:18Z`, sha256 matches the
pointer) and re-ran the same scan of Luke's Mac through the current matcher.

## Verified

| Fix | Result on Luke's Mac |
|---|---|
| Lindell / Reason reassignment | No Steinberg matches remain |
| AAS Session-1 contamination | Ultra Analog Session and Strum Acoustic Session now `unknown`, not false `outdated` |
| `finalVersion` on discontinued | 57 / 0 confirmed; B4 II no longer shows Outdated |

## One new issue: Lindell 500-series now exists twice

The reassignment left two sets of rows for the same seven products:

| Product | `lindell-audio` row | `plugin-alliance` row | Installed on Luke's Mac |
|---|---|---|---|
| 6X-500 | `suite_component`, no version | *Lindell Audio 6X-500* 1.2.2 | 1.2.2 |
| 7X-500 | same | 1.2.2 | 1.2.2 |
| ChannelX | same | 1.2.2 | 1.2.2 |
| 254E | same | 1.2.2 | 1.2.2 |
| 354E | same | 1.0.4 | 1.0.4 |
| TE-100 | same | 1.1.3 | 1.1.3 |
| PEX-500 | same | 1.2.2 | 1.2.2 |

Installed versions match the Plugin Alliance rows exactly, so those look like
the real identities. The app currently matches the versionless `lindell-audio`
rows (exact-name hit), so users see "Suite" instead of "Current".

**Ask:** fold the seven `steinberg--*` rows into the Plugin Alliance rows.
Either retire them, or move their short names (`6X-500`, `ChannelX`…) into the
PA rows' `matchPatterns` and mark the old rows `supersededByPluginId`. Note
`ChannelX` also collides with Airwindows *ChannelX*, which is one more case for
manufacturer-level `bundleIdVendorPrefixes` (installed bundle vendor here is
`lindellaudio`).

## Contract confirmations

**`installedVersionRule` vocabulary: confirmed, with two precisions.**

- `strip-build-suffix`: drop everything from the first `_`, space, `build`,
  `b<digits>` or `d<digits>` suffix.
- `prefix-year-2000`: applies **only when the first segment is < 100**
  (`26.4.1.179` → `2026.4.1.179`; `2026.4` is left alone).
- `semver-first-3`: keep the first three numeric segments.
- `compare-segments: N`: compare the first N segments **numerically**, padding
  missing segments with 0 (`2026.4` vs `2026.4.1.179` at N=2 → equal).
- Transforms apply in the order listed in the row. Unknown transform name →
  the app shows the installed version with "Check for updates in <app>" and no
  verdict.

Agreed on Studio One: generation mapping, not string rewriting.

**Windows identifiers in `identityKeys`: agreed.** Proposed optional fields so
the shape is fixed now:

```json
"identityKeys": {
  "bundleIds": [], "bundleIdPrefixes": [], "auComponents": [],
  "vst3ClassIds": ["ABCDEF0123456789ABCDEF0123456789"],
  "winProductNames": ["FabFilter Pro-Q 4"]
}
```

**Fields the app should honor** (`versionScheme` + `versionExample`,
`popularityTier`, `notesForUser`): agreed, included in the app work below.

## Luke's decision on scan submissions

**Yes: opt-in, off by default.** Payload is plugin name, manufacturer, bundle
ID, AU codes, installed version and formats. No paths, usernames or machine
names. The same anonymized format is used for the golden fixtures, so
submissions can become fixtures directly.

## What Cursor is doing now

1. Consolidating the app onto the PR #3 line plus current `main`.
2. Matcher: manufacturer agreement required unless an identity key matches;
   bare-family and single generic-word patterns never match alone; indexed
   lookup; `identityKeys` first when present.
3. Status rules: discontinued / `finalVersion`, missing version, confidence
   wording, `hub_app` as helpers, `standalone_app` DAW section.
4. First golden snapshot + ~50 hand-checked expectations at
   `catalog-store/fixtures/scans/`, plus an app-side test runner. I'll post
   when they land.
