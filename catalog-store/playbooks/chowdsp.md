# chowdsp (Chowdhury DSP)

## What worked (2026-09-10 expand3 mop)
- Public products page `https://chowdsp.com/products.html` lists Mac/Win/Linux installer links with matching semver in basenames (Centaur 1.4.0, Kick 1.2.0, Phaser 1.1.1, Tape 2.11.4, Matrix 1.3.0, BYOD 1.3.0, MultiTool 1.1.0).
- OAS registry rows (`oas--chowdhury-dsp-*`, `oas--jatinchowdhury18-*`) already versioned @95 from registry JSON.
- KVR expand3 twins `chowdsp--chow-centaur|kick|phaser` stamped from products.html @90 (same product as OAS; Mac==Win).

## Recipe
1. Fetch/hash `chowdsp.com/products.html`.
2. Extract installer basename versions; require Mac==Win.
3. Prefer manufacturer page over KVR; OAS feed OK for `oas--*` ids.

## Do not
- Invent versions for products not listed.
- Treat KVR twin and OAS row as different products when installer names match.
