# D16 Group

## What worked
- Product pages (`https://d16.pl/{slug}`) include public demo installer links on `cdn.d16.pl/installers/{Family}/{Family}-{X.Y.Z}.*`.
- Semver is in the filename; hash the product page HTML as evidence.

## Caveats
- Gen-1 URLs (`/drumazon`, `/lush-101`, …) often serve **gen-2** installers — only accept onto matching gen-2 store ids (`drumazon-2`, `lush-2`, …).
- Plasticlicks: no `cdn.d16.pl/installers` link found.
- Repeater Slate Digital Edition ≠ D16 Repeater product page.

## Round2 (2026-09)
- Leftover unknowns remain gen-1 SKUs (Drumazon, LuSH-101, …) whose product URLs serve gen-2 installers — still do not accept onto gen-1 ids. Plasticlicks / Repeater Slate Digital Edition unchanged.

## Round 4 leftovers
- Unchanged: gen-1 SKUs must not take gen-2 CDN installers; Plasticlicks; Repeater Slate Digital Edition.

## Round 7 mop
- **+11** gen-1 KVR product pages (Drumazon/Nepheton/Nithonat/Phoscyon/LuSH-101/PunchBOX/Sigmund/Fazortan/Redoptor/Syntorus/Toraverb).
- Gen-2 exists as separate `*-2-by-d16-group` slugs — never stamp gen-2 verwin onto gen-1 SKUs.
- Still missing: Plasticlicks (no verwin), Repeater (Slate Digital Edition) ≠ Repeater.

## Confidence raise 1 (2026-09-10)
- **+7** gen-1 CDN corroboration: `cdn.d16.pl/installers/{Family}/{Family}-{ver}.dmg` HEAD 200 matching KVR (Drumazon/LuSH-101/Nepheton/Nithonat/Phoscyon/Sigmund/PunchBox) → confidence **88**.
- Still skip Fazortan/Redoptor/Syntorus/Toraverb gen-1 @ KVR 2.2.2 — only **gen-2** CDN folders (`Fazortan2` etc.) exist; do not stamp onto gen-1 ids.

## Confidence raise 4 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-4.md.

## Confidence raise 5 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-5.md.


## Universe expand 9
- +4 sound expansions (Ripple/Pulse/Aurora/Lure) + Total/Classic Boxes/SilverLine bundles from d16.pl/products.
