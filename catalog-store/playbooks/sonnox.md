# Sonnox

## What worked
- Public installers widget: `https://sonnox.com/installers`
- Backing oracle = published Google Sheets CSV (`Version Number` column) linked from the page.
- CSV URL pattern: `docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv`
- Accept when Mac + Win installer filenames embed the same semver as `Version Number` (or Mac-only platforms).
- Toolbox titles map: Claro, ListenHub, Voca, VoxDoubler.

## Skip / dual mismatch
- Restore suite (DeBuzzer / DeClicker / DeNoiser): Mac installer `3.02.0` vs Win `3.01.0` in CSV URLs — **skip**.
- Fraunhofer Pro-Codec: Mac `4.02.0` vs Win `4.01.0` — **skip**.
- Bundle marketing SKUs (Enhance/Essential/Live/Mastering/Post/Restore) — no clean per-SKU native installer row; avoid inventing from Live VENUE `1.01.0`.
- Soften — no public product/installer row (404).

## Cadence
- Weekly CSV fetch; hash the CSV body as content_hash.

## Freshness chip 2026-09-19 (10:18 PDT)
- Re-discovered current CSV URL from installers page HTML (sheet id rotated from the 2026-09-10 pass):
  `https://docs.google.com/spreadsheets/d/e/2PACX-1vR-xQQaeJnzlI4TY_FXNA8Uccx5iAGmF78_EELOC1_5ak42VvLtVzjcvu7CaVqL3x7WwmG0IFk6UHaL/pub?gid=0&single=true&output=csv`
- NEW dual-mismatch sighting: Oxford Drum Gate (gen-1) row — Platforms=`macos` (Mac-only product),
  Mac installer embeds `2.05.0` matching the Version Number column, but the Windows Installer URL cell
  embeds a stale `2.04.0`. Treat as Mac-only per the Platforms column — ignore the stale Win cell;
  do NOT raise or lower confidence on the Win cell alone. Stored `2.05.0` verified against Mac.
- New-angle probe (CSV URL re-discovery) succeeded — keep as first step when fetch fails:
  `curl` the installers page and grep for `docs.google.com` before assuming rotation broke the recipe.
- Result: 17 re-checked, 0 raises (all stored versions matched live), 2 keeps (Soften no row;
  Restore components still Mac 3.02.0 vs Win 3.01.0).
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- Restore DeBuzzer/DeClicker/DeNoiser + Fraunhofer Pro-Codec still **skipped** (Mac≠Win installer versions on public CSV). Do not invent a unified version.

## Small-gaps chip (2026-09-10 ~1:50 AM PT)
- Re-fetched installers CSV (same sheet URL). Restore DeBuzzer/DeClicker/DeNoiser still Mac `3.02.0` vs Win `3.01.0` filenames; Fraunhofer Pro-Codec Mac `4.02.0` vs Win `4.01.0`. **Keep skip** (dual mismatch).

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- Re-checked installers CSV: Restore DeBuzzer/DeClicker/DeNoiser still Mac `3.02.0` vs Win `3.01.0`; Fraunhofer Pro-Codec Mac `4.02.0` vs Win `4.01.0`. **Keep skip** — no paired filenames, no documented Mac-wins policy. portal notes set; next lever vendor feed / lab both platforms.

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- Fraunhofer Pro-Codec + Oxford DeBuzzer/DeClicker/DeNoiser still Mac≠Win on public CSV — portal/dual leave unchanged.
