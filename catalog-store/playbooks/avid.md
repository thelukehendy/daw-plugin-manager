# Avid

## Status
- Overnight (2026-09-09 PT): **55/55** Pro Tools stock/bundled plugs (+ digidesign Invert-Duplicate) accepted.
- Strategy: public Pro Tools host version as proxy — stock plugs have **no independent public installer semver**.

## What worked
- Public receipts:
  - `https://www.avid.com/pro-tools/whats-new` — "PRO TOOLS 2026.4.1 (JULY 2026)"
  - `https://kb.avid.com/pkb/articles/en_US/Knowledge/en355241` — support table row `7/9/2026 | 2026.4.1`
- Accept: `observed_version=2026.4.1`, `source_kind=other`, `extract_method=daw-bundled-version`,
  evidence "ships with Pro Tools 2026.4.1; no independent plugin semver", `verified_by=coding-assistant`.
- Plugin flags: `update_class=bundled`, `bundled=1`, `notes_for_user` explaining host-version tracking / Avid Link.
- Confidence: **70** (host-version proxy; not per-plugin installer).

## What still fails / skip
- Per-plugin KVR pages / Avid.com marketing pages still lack independent plugin installer semver (unchanged).
- Avid Link remains hub-walled for live per-SKU receipts.
- Do **not** invent independent semver; refresh host version when Avid publishes a newer Pro Tools release and re-stamp stock plugs.

## Recipe
1. Confirm current Pro Tools version on avid.com what's-new + KB support table.
2. Accept all stock/bundled Avid (+ digidesign Invert-Duplicate) unknowns with that host version.
3. Set `update_class=bundled` / `bundled=1` / user note; confidence ~70 via daw-bundled rule.
