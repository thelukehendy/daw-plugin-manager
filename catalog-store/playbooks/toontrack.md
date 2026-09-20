# Toontrack

## What worked
- Public release-notes hubs under `toontrack.com/release-notes/…` list newest version as first "Release notes for PRODUCT X.Y.Z" / "PRODUCT X.Y.Z is now available via Product Manager".
- Accepted: EZdrummer 3 **3.1.2**, Superior Drummer 3 **3.4.4**, EZbass **1.3.4**, EZkeys 2 **2.1.5**, EZmix 3 **3.2.2**.

## Caveats
- Installers themselves are behind Product Manager / My Products account — version receipts are the public RN pages only.
- Product Manager app version is not published as a stable public semver on the marketing page (auto-updates; skip).

## Hub URL resolution (2026-09-19)
- Hub slug is NOT always the plain product name. EZdrummer 3 and Superior Drummer 3 live at `/release-notes/ezdrummer-3/` and `/release-notes/superior-drummer-3/`, but EZbass / EZkeys 2 / EZmix 3 use the doubled form `/release-notes/release-notes-ezbass/`, `/release-notes/release-notes-ezkeys-2/`, `/release-notes/release-notes-ezmix-3/`. Resolve the exact hub URL via a web search per product before fetching — do not guess the slug.
- The master index at https://www.toontrack.com/release-notes/ lists all products with release-note counts — the reliable way to discover hub URLs and detect whether a new product hub exists.
