# Chip-ready: Sonnox Restore freeze + Pro-Codec RN

- **Date:** 2026-09-25 (Wave 7 Ask 2)
- **Advisor:** Grok Bot

## Fetch recipe
1. Index: GET `https://sonnox.com/docs` → extract “View Release Notes” hrefs (BigCommerce store host).
2. Farewell (discontinued posture): `https://sonnox.com/articles/a-farewell-to-three-sonnox-classics/`
3. Per-product RN (live 2026-09-25):
   - `…/Oxford_DeBuzzer_Release_Notes.html` → tip **3.01.0**
   - `…/Oxford_DeClicker_Release_Notes.html` → **3.01.0**
   - `…/Oxford_DeNoiser_Release_Notes.html` → **3.01.0**
   - `…/SonnoxFPCRel.html` (Fraunhofer Pro-Codec) → **4.00.0**

Base: `https://store-8pfrvbtcba.mybigcommerce.com/content/plugins/release-notes/`

## Parse rule
1. Docs index: `href="(?P<rn_url>[^"]+/release-notes/[^"]+\.html)"` near product name (discovery).
2. RN tip: first `<h2[^>]*>\s*(?P<ver>\d+\.\d+(?:\.\d+)?)\s*</h2>` after the product “Release Notes” `<h3>` (tip fields: `ver`, optional nearby `YYYY.MM.DD`).
3. Farewell posture: body contains retire language for DeBuzzer/DeClicker/DeNoiser → `discontinued_frozen` (do not invent if farewell 404).
Prefer docs-index discovery over hardcoding RN URLs long-term.

## Posture
Restore trio → `discontinued_frozen` (farewell) + freeze tip for users who still own them. Pro-Codec remains open raise candidate after Muse re-fetch.

## Golden / negative
Fixtures under `fixtures/wave7/chips/sonnox/`: `farewell.html`, `docs.html`, `Oxford_DeBuzzer_Release_Notes.html`, `Oxford_DeClicker_Release_Notes.html`, `Oxford_DeNoiser_Release_Notes.html`, `SonnoxFPCRel.html` (+ metas; tips 3.01.0 / 4.00.0). Negative: `wrong-rn.html` (storefront shell, no tip H2); docs without “View Release Notes”; farewell 404 → do not invent discontinued.

## Identity guard
One RN → one plugin_id. Never stamp Restore tip onto Pro-Codec or Oxford EQ/etc.

**Ready for the engine to wire after operator re-fetch.**
