# Valhalla DSP

## What worked
- Public product pages “Current Version: …” for Delay/Room/Plate/VintageVerb/Shimmer/FutureVerb/Supermassive/FreqEcho.
- Demos page corroborates installer filenames.
- Dual Mac/Win: when page publishes both, accept **Mac** current and note Win in evidence (Plate 1.6.8/1.6.3, Shimmer, FreqEcho, SpaceModulator, ÜberMod) @88–92.

## Maintenance re-checks (2026-09-18)
- **"Current Version" line position varies per page:** Plate L117, VintageVerb L205, Delay L261 (below the fold there). Do NOT read from a fixed line_start — always browser.find "Current Version" after opening.
- **valhalladsp.com is fetch-service-flaky, not vendor-blocked:** 2026-09-17 worker block died 0/10; 2026-09-18 worker block died 0/10 (same browser-service failure pattern); parent single sequential fetches succeeded for Delay, Plate, VintageVerb (all stored values held). Recipe: retry individually with a pause between, NOT in parallel bursts; a stalled page = skip + re-queue, never churn the whole block.
- SpaceModulator / ÜberMod canonical page URLs STILL unresolved (they're not in the main shop flow — try the plugin index pages or search-engine discovery next time).

## Small-gaps chip (2026-09-10 ~1:50 AM PT)
- ValhallaSpaceModulator (free): Current Version **1.2.8 (Mac), 1.1.6 (Windows)** → accepted Mac **1.2.8** @88.
- ValhallaÜberMod (paid $50, still live — not discontinued): same Mac **1.2.8** / Win 1.1.6 → accepted Mac **1.2.8** @88.
- Account portal remains login-walled; public product + demos pages suffice.
