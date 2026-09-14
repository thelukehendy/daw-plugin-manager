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
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- Restore DeBuzzer/DeClicker/DeNoiser + Fraunhofer Pro-Codec still **skipped** (Mac≠Win installer versions on public CSV). Do not invent a unified version.

## Small-gaps chip (2026-09-10 ~1:50 AM PT)
- Re-fetched installers CSV (same sheet URL). Restore DeBuzzer/DeClicker/DeNoiser still Mac `3.02.0` vs Win `3.01.0` filenames; Fraunhofer Pro-Codec Mac `4.02.0` vs Win `4.01.0`. **Keep skip** (dual mismatch).

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- Re-checked installers CSV: Restore DeBuzzer/DeClicker/DeNoiser still Mac `3.02.0` vs Win `3.01.0`; Fraunhofer Pro-Codec Mac `4.02.0` vs Win `4.01.0`. **Keep skip** — no paired filenames, no documented Mac-wins policy. portal notes set; next lever vendor feed / lab both platforms.

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- Fraunhofer Pro-Codec + Oxford DeBuzzer/DeClicker/DeNoiser still Mac≠Win on public CSV — portal/dual leave unchanged.
