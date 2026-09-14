# voxengo

## Version chip new-mfrs-1 (2026-09-10 ~1:05 AM PT)
- Method: Public products page lists each plugin with "Version X.Y, Month Day, Year" on product cards.
- Primary URLs: https://www.voxengo.com/products/
- Extract: Parse v3-product-card-descr "Version N.N, date". Map product/slug/ to plugin_id. Legacy/discontinued SKUs (Analogflux, Pristine Space, etc.) absent from current products page — leave unversioned or KVR-only.
- Success: High — 50/73 current catalog products accepted @92 (2026-09-10 chip).
- hub_walled: 0
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- Remaining 10 legacy titles (Analogflux*, Pristine Space Light, EssEQ, MarvelEQ, Lampthruster, Audio/Sample Delay, Clock Jitter) → `discontinued` (absent from current products page; no invent).


## Confidence raise 8 (2026-09-10 ~2:00 AM PT)
- **+4** via official user-guide PDFs (`Version` header matches KVR) @90: BMS 2.7, CRTIV Chorus 1.5, CRTIV Reverb 2.4, CRTIV Shumovick 1.3.
- Leftover yellows: discontinued / missing guides (Pristine Space, Analogflux, Radio, Redunoise, Impulse Modeler, Sonic Finalizer, Transmodder, Vintage Modulator) — leave KVR@60.

## version-chip-expand-7
- PSquasher id is short-name twin of Polysquasher; same `/product/psquasher/` → **3.6** @92.
