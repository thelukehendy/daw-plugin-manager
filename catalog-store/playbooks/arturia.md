# Arturia

## What worked
- Public ASC installer on downloads/FAQ: manager-only version (prior).
- **KVR product pages** (`…-by-arturia`): per-instrument/FX `id="verwin"` (often `x.y.z.build`).
- Round 6: **+68** accepts via `kvr-product-page`.

## Caveats / do not force
- Per-plugin versions on arturia.com still require ASC login.
- **Skip generation bumps**: catalog "Mini V" / "CS-80 V" / "ARP2600 V" / "Matrix-12 V" / "Stage-73 V" / "VOX Continental V" / "B-3 V" / "Jup-8 V" / "SEM V" / "Analog Lab V" must not map onto KVR V2/V3/V4 product pages.
- Skip near-name FX renames (Chorus JUN-6 ≠ chorus-jun-6-v; Delay BRIGADE ≠ Delay Memory Brigade) until exact title match.

## Still missing
- Generation-ambiguous classics listed above; Pure Lo-Fi; Delay BRIGADE; Chorus JUN-6.

## Round 7 mop
- **+2**: Delay BRIGADE via KVR `delay-memory-brigade-by-arturia` (title Delay MEMORY-BRIGADE) **1.7.1.6566**; Pure LoFi `pure-lofi-by-arturia` **1.0.1.6372**.
- Still **no** V→V2/V3/V4 maps for Mini/CS-80/ARP2600/Matrix-12/Stage-73/VOX/B-3/Jup-8/SEM/Analog Lab/Piano/Wurli/Solina; Chorus JUN-6 ≠ Chorus JUN-6 V.

## Round 8 final mop
- **+1**: Chorus JUN-6 via `chorus-jun-6-v-by-arturia` (**1.5.1.6566**) — documented trailing-**V** FX alias (same pattern as Delay BRIGADE ↔ MEMORY-BRIGADE).
- Still **no** V→V2/V3/V4 maps for Mini/CS-80/ARP2600/Matrix-12/Stage-73/VOX/B-3/Jup-8/SEM/Analog Lab/Piano/Wurli/Solina (KVR redirects to gen pages).

## Overnight chip-203
- Classic `* V` SKUs: notes updated as generation-ambiguous vs V3/V4 redirects — **no** accept. Not the same product generation.

## Confidence raise 2 (2026-09-10)
- **+71** all remaining KVR-60: public `arturia.com/support/downloads-manuals/product/{slug}` Software Version matches KVR → confidence **92**.
- ASC still not needed for version corroboration. Slug aliases: `comp-fet76`, `comp-tubesta`, `comp-vca65`, `delay-tape201`, `m12-filter`, `mini-filter`, `sem-filter`, `1973-pre`, `trida-pre`, `v76-pre`, `rev-plate140`, `rev-spring636`, `tape-j37`, `pure-lofi`.
- Classic gen-ambiguous `* V` → V2/V3/V4 still not accepted (unchanged).
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- **+16 @92** via public `arturia.com/support/downloads-manuals/product/{slug}` Software Version (Pigments 7, Pure Sub, Rev OCEAN, Mini V4, Jup-8 V4, Augmented PERSIA, Memory V, Modular/Piano/Wurli/SEM V3, Solina/Stage-73/B-3/VOX/Matrix-12 V2).
- Skip gen/edition mismatches: Prophet V→V3 page; SEM V2→V3; Augmented Mallets Play / Strings Intro; CS-80 V4 / ARP2600 V3 / Analog Lab Pro 404.
- Alias rows Chorus JUN-6 V / Delay MEMORY-BRIGADE → `unknown_other` (canonical rows already versioned).
- Legacy Analog Factory / Spark / Storm / Brass → `discontinued`.

## Version chip expand-10 (2026-09-10 ~5:17→5:24 AM PT)
- Public versions stamped where evidence exists; sound libraries intentionally unversioned.
- `verified_by=coding-assistant`
- Analog Lab Play / Pigments Play: email-gated / ASC — **no public installer semver** this pass (left open).
