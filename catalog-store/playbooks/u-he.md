# u-he

## What worked
- **Public releases index** `https://dl.u-he.com/releases/` — Apache directory listing of current installers.
- Filename pattern `Product_XYZ_build_{Mac,Win,Linux}.{zip,tar.xz}` encodes semver **X.Y.Z** (e.g. `Diva_148_16519_Mac.zip` → **1.4.8**; corroborated on product page download links / “v1.4.8”).
- Product pages under `u-he.com/products/...` mirror the same installer URLs (good secondary receipt).
- Support hub points to releases + `https://dl.u-he.com/release-archive/` for older builds.
- Shared installer: **Filterscape** (FX / VA / Q6 / 1.5 line) → one version for component SKUs.

## What failed / skip
- `u-he.com/downloads/` is a parked/sedo page — use `/support/#downloads` or `dl.u-he.com/releases/`.
- KVR-expanded identity includes many **soundsets** (Blue Flamingo, Sugar & Spice, etc.) — not plugin installers; no version accept.
- **Beatzille**: downloads redirect to plugins-samples.com; no clear installer on dl.u-he.com/releases.
- **CVilization / MELT / Wiretap**: eurorack hardware, not DAW plugins.
- **TyrellN6**: current public file is `*_public_beta_*` (accepted as 3.0.0 with beta note).

## Recipe
1. Fetch `https://dl.u-he.com/releases/`
2. Parse filenames → product → max (version digits, build)
3. Map to store plugin ids; accept with SHA-256 of listing HTML + evidence snippet naming the file
4. Skip soundsets / hardware / unclear freeware mirrors

## Round2 (2026-09)
- Re-fetched `dl.u-he.com/releases/`: still only core instruments/FX already accepted; no new filenames for remaining unknowns.
- Remaining unknowns are soundsets/expansions/hardware (Arena, Atmos, Hive Science, Sugar & Spice, CVilization/MELT, Beatzille, cookbook, etc.) or Zoyd archive `ZoydUB.zip` (no semver) — no accepts.

## Round 8 final mop
- Remaining unknowns are still soundsets/expansions (Arena/Atmos/Hive Science/…), eurorack hardware (CVilization/MELT), and The Bazille Cookbook — not DAW plugin installers. No new filenames on `dl.u-he.com/releases/`. No accepts.

## Confidence raise 1 (2026-09-10)
- **+3** Zebralette / Zebrify / The Dark Zebra: `dl.u-he.com/releases/` `Zebra_Legacy_294_*` → **2.9.4** matches KVR → confidence **88**.
- Soundsets / Beatzille / hardware still no installer on releases index.

## Overnight chip-203
- Soundsets/expansions/eurorack/cookbook: set `notes_for_user` (non-plugin) — left unknown, no fake versions. dl.u-he.com/releases/ unchanged (core only).

## Confidence raise 3 chip-B (2026-09-10)
- **+1** Beatzille: product page “Beatzille **1.0.2** (revision 12092)” / “NEW in v1.0.2” → @92.
- Soundsets (Blue Flamingo / Repercussion / Zebratron / Bazille Strobos) still no live installer on CDN (301→404).

## Confidence raise 4 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-4.md.

## Confidence raise 5 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-5.md.


## Universe expand 9
- +BazilleCM; Everything/All Effects + Bazille/Diva/Hive/Repro Soundset Bundles; Wiretap + CEN2RION eurorack. Individual soundsets already dense — not re-added.
