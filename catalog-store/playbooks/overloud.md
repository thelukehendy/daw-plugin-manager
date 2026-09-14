# Overloud

## What worked
- **KVR product pages** (`…-by-overloud`): per-product `id="verwin"` (GEM modules, TH-U editions, REmatrix, etc.).
- Round 6: **+46** accepts via `kvr-product-page`.

## Caveats / do not force
- Do not map TH-U edition packs onto individual amp/rig libraries or vice versa; exact title match only.
- TH-U Slate had no clean KVR slug match this run.

## Still missing
- TH-U Slate.

## Confidence raise 1 (2026-09-10)
- **+2** TH-U Premium + TH-U Essentials: `download.overloud.com/TH-U/changelog.txt` head **2.0.19** matches KVR → confidence **92**.
- Do not stamp 2.0.19 onto older TH-U edition packs still listed at 1.4.7 without edition-specific evidence.

## Confidence raise 4 (2026-09-10)
- **+22** via official `installation.php?p=N` + `download.overloud.com` installer filenames @ **88**.
- GEM map: p=3000 Comp76, 3001 EQ495, 3002 TAPEDESK, 3003 EQ84, 3004 Dopamine, 3005 Sculptube, 3006 EQ550, 3007 Comp G, 3008 ECHOSON, 3009 Comp670, 3010 OTD-2, 3011 Comp LA; plus Comp160/EQP/Modula CDN HEAD.
- Also: Breverb 2 (p=11), SpringAge (p=5), REmatrix CDN, Mark Studio 1/2 (p=9/14), TH2 Play Brunetti (p=8), TH1 Triode **1.1.17** (p=3, newer than KVR 1.1.16).
- Still skip: Voice/Fuse (no public install URL), REmatrix Player (no separate installer), TH-U editions @1.4.7 / SuperCabinet / TH3 / rig libs (no per-edition public receipt; do not stamp TH-U 2.0.19).

## Confidence raise 5 (2026-09-10)
- **+2**: GEM Voice **1.0.7** (CDN newer than KVR 1.0.6) + REmatrix Player **1.2.12** (CDN folder `REmatrix Player`) installer filenames @88.
- Still skip: Fuse (CDN naming sweep 404), TH-U editions/SuperCabinet/TH3/rig+IR libs (do not stamp TH-U 2.0.19).

## Confidence raise 6 (2026-09-10)
- Non-raise: GEM Fuse product `/products/fuse` live; getdemo = form overlay; CDN naming sweep still 404; no `installation.php` Fuse id. Remaining TH-U edition/rig/IR/TH3/SuperCabinet — do not stamp TH-U 2.0.19.
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- BREVERB 2 Mix Pack + TH-U 60s / Eric Gales / Greg Howe packs → `expansion` (content packs, not standalone plugin installers).

## Confidence raise 9 (2026-09-10 ~2:08 AM PT)
- Non-raise: Fuse / TH-U editions @1.4.7 / SuperCabinet / TH3 / rig+IR — no per-SKU public installer; do not stamp TH-U **2.0.19**. `installation.php` p=15/18/19/22/23 = unrelated stubs/OEMs.


## Confidence raise 10
- Non-raise: Fuse / TH-U edition / SuperCabinet / TH3 / rig+IR leftovers — same as raise 9.

## Confidence raise 15
- Non-raise this pass — see NOTES-confidence-raise-15.md.

## Confidence raise 18 (2026-09-10 ~3:50 AM PT)
- Non-raise: Fuse / TH-U editions / SuperCabinet / TH3 / rig+IR leftovers. SuperCabinet page cites **1.4.26** ≠ KVR **1.4.30**. Do not stamp TH-U **2.0.19**.

## Confidence raise 23
- Non-raise: Fuse shared Gems manual Rev ≠ product semver; SuperCabinet/TH-U edition/TH3/rig+IR — do not stamp TH-U **2.0.19**. installation.php leftovers = OEM stubs.
