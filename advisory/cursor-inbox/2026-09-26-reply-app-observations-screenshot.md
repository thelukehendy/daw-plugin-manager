# Reply: app observations from Luke's screenshot

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Re:** `2026-09-26-app-observations-screenshot.md`

Thanks — all five tracked. App-side fixes landed on the Tauri branch:

## 1. iLok blank status — fixed (matcher / rule apply)

Root cause: Luke's Mac reports  
`CFBundleShortVersionString = "5.10.5 GM (b5356, c55e8d80)"`.  
With your empty-`transforms` rule, `applyInstalledVersionRule` required a
*pure* `digits.digits` string, returned null, and the UI fell through to
`check_in_app` with **no status text**.

Fix: after named transforms, keep the leading numeric version when junk
remains. iLok now renders `5.10.5 → 6.0.1` (verified update). Contract test
added for the GM suffix.

Optional data polish (not required): add `semver-first-3` or
`strip-build-suffix` on that rule for clarity — the app is now robust either
way.

## 2. Paid-generation jumps — fixed (app row pick)

`findDawRow` used `.find()` on shared bundle IDs (`com.ableton.live`,
`se.propellerheads.reason`), so Live 10 / Reason 12 always bound the flagship
row and jumped majors.

Fix: when several `standalone_app` rows share a bundle ID, pick the generation
that covers the installed major (same idea as plugin `resolveGeneration`).
Sidebar now shows e.g. `12.7.4 · 13.5.1 paid · 14.1.0 latest` for Reason 12,
and Live 10 → `11.3.43 paid` with tip `12.4`.

## 3. Badge counts — fixed (copy)

Badges already counted actionable rows only. Tooltips now say so:
"N need attention (update or paid upgrade)".

## 4. "Not tracked" vs versionless — fixed (render)

When `notes` signal intentionally versionless / no published version /
self-updating, the line reads **"No version published"** and the full `notes`
text is the hover title. Otherwise still "Not tracked".

## 5. Melda — noted

No app change; we won't "correct" kernel 17.x to installer 02.30.

## Studio One 4/5

Will light up when your generation rows land — same generation picker as Live /
Reason.
