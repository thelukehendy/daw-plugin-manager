# LiquidSonics

## What worked
- Public downloads hub `https://www.liquidsonics.com/downloads/` embeds `dl/serve.php?link=...` URLs whose object keys encode semver, e.g. `Illusion-v1.4.6-macOS.pkg` / `...-Win.exe`.
- Accept only when **Mac and Win versions match**; hash the downloads HTML.

## Caveats
- Seventh Heaven Professional: Win **1.5.9** vs Mac **1.5.8** this pass — skip (dual mismatch).
- Filtrate / Verbsuite Classics / Mobile Convolution: no clear public installer links found on the downloads page.

## Round 3 leftovers
- Seventh Heaven Professional still Mac **1.5.8** vs Win **1.5.9** — skip.
- Filtrate / Verbsuite Classics / Mobile Convolution still absent from public downloads hub links.

## Confidence raise 3 chip-B (2026-09-10)
- **+1** Filtrate: legacy downloads `Setup_Filtrate_1.120` / OSX pkg → @90 matches KVR.
- Seventh Heaven Professional: Mac CDN **1.5.8** vs Win **1.5.9** — dual Mac/Win skip.

## Confidence raise 5 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-5.md.

## Confidence raise 6 (2026-09-10)
- Non-raise: Seventh Heaven Professional still Mac **1.5.8** vs Win **1.5.9** — unlike SIR, no paired release entry in manufacturer VH. Skip.

## Confidence raise 7 (2026-09-10)
- Seventh Heaven Professional: still Mac **1.5.8** vs Win **1.5.9** on public downloads — dual skip.
