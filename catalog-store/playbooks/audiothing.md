# AudioThing

Mixed: many **paid plugins** have public demo installer basenames; **instruments / Toys / Environments expansions** often KVR-only or 404. Not fully hub-walled, but yellow long-tail needs careful non-contamination.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| Product-page demo installer basenames (`Product-X.Y.Z.dmg`) | **Yes** | Preferred manufacturer evidence for active plugins (@88). |
| audiothing.net/plugin-updates/ table | **Yes** | Discontinued finals + freeware versions (Outer Verb, Valve*, Speaker, Blindfold EQ, Filterjam, Moon Echo, Alborosie Dub Station). |
| KVR product pages | **Yes** | Instruments/soundware (Round 7 **+27**, mostly **1.0**). Environments use `environments---…` slugs. |
| audiothing.net/account | Account | Not required for weekly public scrub. |
| GitHub / RSS | Weak | Lack per-Toy installer semver (confidence raise 7). |

## Last scrub result

- Round 4: updates-table discontinued/freeware accepts.
- Round 7 mop: **+27** instrument/soundware KVR; still missing Fields / Pong Glockenspiel / Soundscapes Vol.2 (empty verwin); SX1500 (no page).
- Confidence raise 6–7: Environments Piscina Mirabilis + Temple of Mercury — correctly **rejected** attempts to stamp parent Environments installer onto expansion SKUs. Toys longtail still 404.
- Store: **82/86** versioned; **27 yellow**.

## Weekly scrub recipe

1. Active effects: prefer product-page / updates-table installer basenames; corroborate KVR@60 → @88 when match.
2. Instruments/Toys: KVR only if verwin present; do not invent from 404 product slugs.
3. Environments: never stamp parent Environments installer onto expansion SKUs (Piscina / Temple / Soundscapes).
4. Alborosie: updates-table version OK; do not cross-wire from DubFilter basename.
5. Confidence: manufacturer basename → **88**; else **stay KVR@60**.
6. Update NOTES + `last_scrub_at`.

## Confidence policy

- Raise only on official installer basename / updates-table row matching the SKU.
- Stay **KVR@60** for Toys/instruments without manufacturer semver.
- Electron: green when @88+; yellow Toys → link product page; no false “update” from parent suite.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | none required (public demos common); account optional |
| Hub URL | https://www.audiothing.net/account/ |
| UX | Prefer direct product download links when catalog has manufacturer evidence; account for license restore. |
| `hub_walled` | **0** (partial public); Toys/expansions still weak |



## Confidence raise 10
- Non-raise: Toys/Environments expansions still lack per-SKU manufacturer installer semver.

## Confidence raise 17
- Non-raise: Toys/Environments expansions still absent from plugin-updates table per-SKU; Environments parent **1.0** must not stamp onto Piscina/Temple/Soundscapes.

## gaps-mop-expand5 (2026-09-10)

- **Magical Toy Keyboard** `1.0` @60 — KVR Win=Mac. Product page 404; absent from plugin-updates table. Same Toys pattern as Toy Bars/Marimba/Piano.
