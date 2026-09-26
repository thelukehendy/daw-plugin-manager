# Reply: hardening pass — schema v8 + synthetic known issues

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Re:** `2026-09-26-hardening-pass-schema-v8.md`
- **Data commit pulled:** `260bf6716d964558eab400ebfd3a0f5def4802b1`
- **Pointer:** `b37a430b` / build `2026-09-26T16:17:22Z` (sha256 verified)

## Schema v8 (§1)

No app parser change. Exporter materializes manufacturer
`default_installed_version_rule` into each row’s existing `installedVersionRule`.
Bundled catalog now has 1,279 rules; Melda/Kilohearts/Soundtoys/etc. take the
rule path instead of conservative inference. Thanks.

## Identity / hubs (§2)

Pulled as-is. UA Connect rename + hub→standalone/instrument fixes land with the
feed; no app work.

## Synthetic fixtures (§3)

App now expects **93/93 hard pass** on the four synthetics (Auto-Tune, Splice,
Studio One 5 known flags cleared).

## §4 Auto-Tune Pro — fixed (app)

Root cause: `PRODUCT_LINE_PATTERNS` collapsed the display name to `"Auto-Tune"`,
and `MatchInput` only carried that line name, so fuzzy scoring could pick Access.

Fix:
1. `MatchInput.memberNames` + `formats` from the group’s installed members.
2. Matcher prefers exact member-title hits over siblings.
3. Single-SKU groups keep the real family title (`Auto-Tune Pro`) instead of the
   line label.

## §5 Splice Desktop — fixed (app)

Root cause: bare `"Splice"` with empty formats exact-matched the versionless
plugin seed (`splice--splice` @220) over `splice--splice-desktop-app`
(patterns only `"Splice Desktop"`).

Fix: empty `formats` ⇒ app-only scan. Candidate set includes standalone/hub
rows whose name starts with the install name; those score above demoted plugin
seeds. Plugin-format scans still bind the plugin seed.

## §6 DAW generation / shared bundle IDs — fixed (app)

`dawCatalog.ts` already picks among shared-bundle candidates with
`pickGenerationRow` (installed major × `generation` / `versionMajors`), same
idea as the plugin matcher. Covered by Ableton Live 10/11/12 contract tests.
Studio One 4/5 synthetic now asserts both rows (name match also works today
because the v4/v5 export rows still lack `identityKeys.bundleIds` — when those
land, the generation pick path is ready).

## §7 Studio One 4/5 rows

Live in the pulled feed. Treated as third-party-corroborated per your caveat;
app does not invent versions.

## Nice-to-haves (optional, your call)

- Stamp `identityKeys.bundleIds: ["com.presonus.studioone2"]` on Studio One 4/5
  (and `com.splice.Splice` on the desktop-app row) so identity-key matching can
  short-circuit name heuristics.
- Retire or discontinue `splice--splice` if it is only a legacy seed.
