# Operator notes for Cursor — app observations from Luke's 2026-09-26 screenshot

**Data build in screenshot:** pointer `915abad2` (build `2026-09-26T15:50:23Z`).
These are app-side observations; data-side context included where it helps.

## 1. iLok License Manager shows no status at all (possible matcher bug)

Row reads `5.10.5` with **no status text** — no "→ 6.0.1", no "Up to date", no
"Not tracked". Every other row in both lists has one. The catalog row
(`pace--ilok-license-manager`) has `latestVersion` 6.0.1 and an
`installedVersionRule` (`CFBundleShortVersionString`, no transforms,
`compareSegments` 3), so the expected render is `5.10.5 → 6.0.1`. Worth
checking whether the row failed to match or the comparison bailed silently.

## 2. Paid-generation jumps skip the intermediate step

- Reason 12 renders `12.7.4 → 14.1.0`, skipping generation 13 (13.5.1, paid).
- Ableton Live 10 renders `10.1.43 → 12.4`, skipping generation 11 (11.3.43, paid).

The generation rows and `successorPluginId` / `predecessorPluginId` chains are
all in the catalog (`reason-studios--reason-12` → `reason-studios--reason-13`
→ `reason-studios--reason`, same shape for Live 10 → 11 → 12). Suggest the
row name the next paid step, e.g. "13.5.1 paid upgrade available · 14.1.0
latest", rather than jumping two paid majors in one arrow.

## 3. Sidebar badge counts aren't self-evident

`DAWS 4` sits above 9 DAW rows; `HELPER APPS 1` above 15 helper-app rows.
If the badges count "needs attention", a tooltip stating that would help —
right now the numbers don't visibly correspond to anything in the lists.

## 4. "Not tracked" could distinguish *why*

Of the 9 previously "Not tracked" helper apps in this build, 3 now have real
versions (Complete Access Hub **2.19.0**, XLN Online Installer **5.0.0**,
MPluginManager **17.10.01** — each with `installedVersionRule`). The other 6
are **intentionally versionless**: their vendors publish no version number
(self-updating apps / versionless downloads), and each row's `notes` field
now says so, dated 2026-09-26. Two rendering options:

- Surface the row's `notes` as tooltip text on "Not tracked" rows, or
- Render intentionally-versionless rows as "No version published" instead of
  "Not tracked" (less "broken" looking; the `notes` field is the signal).

## 5. Melda nuance (data-side, for the record)

`meldaproduction--mpluginmanager` tracks the **kernel** line (17.10.01),
not Melda's separate "installer version" (02.30) — Luke's scan detects
17.09, which is the kernel number. The row's `notes` records this. No app
change needed; just don't "correct" it to 02.30.

## Coming from my side

Studio One 4/5 generation rows (Luke's scan shows 4.6.2 and 5.5.2 with no
status — same treatment as the Live 10/11 and Reason 12/13 rows). Will land
in a later data build; no app work needed.
