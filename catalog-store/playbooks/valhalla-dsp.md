# Valhalla DSP

## What worked
- Public product pages “Current Version: …” for Delay/Room/Plate/VintageVerb/Shimmer/FutureVerb/Supermassive/FreqEcho.
- Demos page corroborates installer filenames.
- Dual Mac/Win: when page publishes both, accept **Mac** current and note Win in evidence (Plate 1.6.8/1.6.3, Shimmer, FreqEcho, SpaceModulator, ÜberMod) @88–92.

## Maintenance re-checks (2026-09-18)
- **"Current Version" line position varies per page:** Plate L117, VintageVerb L205, Delay L261 (below the fold there). Do NOT read from a fixed line_start — always browser.find "Current Version" after opening.
- **valhalladsp.com is fetch-service-flaky, not vendor-blocked:** 2026-09-17 worker block died 0/10; 2026-09-18 worker block died 0/10 (same browser-service failure pattern); parent single sequential fetches succeeded for Delay, Plate, VintageVerb (all stored values held). Recipe: retry individually with a pause between, NOT in parallel bursts; a stalled page = skip + re-queue, never churn the whole block.
- **SpaceModulator / ÜberMod canonical page URLs RESOLVED 2026-09-19** (search-engine discovery; never fetch-confirmed first-hand yet — fetch-service died on this chip):
  - https://valhalladsp.com/shop/modulation/valhalla-space-modulator/ (lives under **shop/modulation/**, not shop/reverb or shop/delay — this is why it wasn't in the main shop flow)
  - https://valhalladsp.com/shop/delay/valhalla-uber-mod/
- **Search-cache fallback (2026-09-19):** when browser.open dies for the domain, `browser.search` for `"Valhalla<ProductName>" "Current Version" site:valhalladsp.com` surfaces the vendor page's "Current Version" line in the snippet, and the "Last Crawl" timestamp (1 day – 9 days typical) gives freshness context. 2026-09-19 chip: all 7 rows' stored values were corroborated this way (Room 2.0.5 "Updated to version 2.0.5! New Space and Lo Cut controls." + Cakewalk-forum 2.0.5 announcement; Shimmer "Current Version 1.3.0 (Mac) / 1.2.2 (Windows)"; Supermassive "Current Version: 5.0.0 (Updated November 26th, 2025)" corroborated by Homebrew cask formulae.brew.sh "Current version: 5.0.0"; FutureVerb "Current Version: 1.0.2 (updated November 22nd, 2025)", cache 6h old; FreqEcho "Current Version: 1.2.8"; SpaceModulator "Current Version: 1.2.8 (Mac), 1.1.6 (Windows)"; ÜberMod "Current Version: 1.2.8 (Mac)/ 1.1.6 (Windows)"). Zero raises, zero DB writes — nothing changed. This is sanctioned corroboration (vendor page text as cached), NOT a substitute for the first-hand re-fetch — the direct-fetch re-check remains queued; but it closes the "unverified since 2026-09-10" gap to search-cache-fresh instead of fully stale. Do NOT keep hammering: if browser.open fails 1-2x, stop the browser route per no-hammer rule (alternate-egress urllib is pre-authorized in the task body but exec tool policy forbids re-attempting a failed tool via exec — respect the stop).
- **2026-09-19 chip (2218):** browser.open for valhalladsp.com FAILED on the first single sequential fetch — 5th consecutive chip of fetch-service failure (browser tool hard-terminated, terminal for the turn). Search-cache fallback corroborated all 10: Room 2.0.5 (crawl 3h), Shimmer 1.3.0 (crawl 3h), Supermassive 5.0.0 (crawl 11d), FutureVerb 1.0.2 (crawl 3h), FreqEcho 1.2.8 (crawl 3h), SpaceMod 1.2.8 (crawl 3h), ÜberMod 1.2.8 (crawl 53d), Delay 3.0.5 (crawl 2d), VintageVerb 4.0.5 (crawl 4h), Plate 1.6.8/1.6.3 (crawl 53d). Zero raises.
- **Canonical product-page URLs (confirmed via search full URLs, not yet fetch-confirmed):** FreqEcho `valhalladsp.com/shop/delay/valhalla-freq-echo/`, Delay `valhalladsp.com/shop/delay/valhalladelay/`, VintageVerb `valhalladsp.com/shop/reverb/valhalla-vintage-verb/`, Plate `valhalladsp.com/shop/reverb/valhalla-plate/` (add to the existing SpaceMod/ÜberMod pair).

## Small-gaps chip (2026-09-10 ~1:50 AM PT)
- ValhallaSpaceModulator (free): Current Version **1.2.8 (Mac), 1.1.6 (Windows)** → accepted Mac **1.2.8** @88.
- ValhallaÜberMod (paid $50, still live — not discontinued): same Mac **1.2.8** / Win 1.1.6 → accepted Mac **1.2.8** @88.
- Account portal remains login-walled; public product + demos pages suffice.
