# McDSP

## What worked
- **KVR product pages** (`…-by-mcdsp`): explicit `id="verwin"` **7.3.0.18** (Windows Product Version) across Native line.
- Round 6: **+25** accepts via `kvr-product-page` (complete).

## Caveats / do not force
- Mac `id="verosx"` is **7.3.17** — numbering diverges from Win (same as public installer zips). Accepted value is **verwin** per scrub policy; note Mac differ in evidence reviews.
- Prior pass left unknowns because manufacturer downloads page alone was ambiguous; KVR Product Version unblocks with documented Win field.

## Still missing
- (none)

## Confidence raise 2 (2026-09-10)
- **+25** full Native line: `mcdsp.com/plugin-downloads` → `McDSP_Native_Setup_7_3_0_23_WIN.zip` (HEAD 200) → accepted **7.3.0.23** @ **88** (replaces KVR 7.3.0.18).
- Mac installer filename remains **7.3.17** — do not force Mac numbering onto Win currents.
