# Acustica Audio

## Portal
- **Aquarius** (`portal_app=Aquarius`) — account hub for installs/updates. **Do not grind Aquarius** for versions (HUB_WALLED).

## What worked (2026-09-10 KVR hub-remain chip)
- KVR product pages already linked in `plugins.notes` (`https://www.kvraudio.com/product/{slug}-by-acustica-audio`).
- Parse `id="verwin"` → Product Version; accept with `extract_method=kvr-product-page`, confidence **60** (yellow / crowdsourced).
- **+134 / 134** former plugin gaps accepted this way (Aero, Gold 5, Scarlet 5, Diamond*, Fire The*, etc.).
- Versions are per-SKU Acqua-style builds (e.g. 3.0.5, 2.3.5, 1.4.xxx) — take only the page’s own verwin; do not invent or cross-map gens.

## What failed / avoid
- No public manufacturer per-SKU installer semver outside Aquarius for this set.
- Do not treat Aquarius hub apps (`aquarius`, `n4-player`, `nebula3-server`, `n4-5`) as versioned plugins via KVR unless a clean product page exists.

## Confidence
- KVR only → **60**
- Raise only with manufacturer/Aquarius-public corroboration (not available without portal).

## Cadence
- Weekly KVR scrub of Acustica developer / product pages; re-hash HTML; bump observation when verwin changes.
