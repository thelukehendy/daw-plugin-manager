# Chip-ready: IK Product Manager CDN HEAD + Referer

- **Date:** 2026-09-25 (Wave 7 Ask 2)

## Fetch recipe
1. Weekly GET `https://www.ikmultimedia.com/products/productmanager/` → extract `ik_product_manager_(\d+\.\d+\.\d+)\.dmg` CDN URL.
2. HEAD CDN URL **with** `Referer: https://www.ikmultimedia.com/products/productmanager/`.
Live: `https://g1.ikmultimedia.com/plugins/ProductManager/ik_product_manager_1.1.15.dmg` → 200 + LM `Tue, 25 Aug 2026 16:25:00 GMT` with Referer; **403 without**.

## Parse rule
Page: `https?://g1\.ikmultimedia\.com/plugins/ProductManager/ik_product_manager_(?P<ver>\d+\.\d+\.\d+)\.dmg`. Tip field: `ver`. HEAD with required header `Referer: https://www.ikmultimedia.com/products/productmanager/`; record `Last-Modified` on 200.

## Golden / negative
`fixtures/wave7/chips/ik/pm-dmg-referer.hdr` (200 + LM 2026-08-25) vs `pm-dmg-noref.hdr` (403 without Referer) — Referer requirement is the negative control. Wrong version path → 404.

## Identity guard
Product Manager hub_app only. Never AmpliTube/Syntronik/T-RackS SKU stamp. PDF host canary remains separate fragile corroboration.

**Ready for the engine to wire after operator re-fetch.**
