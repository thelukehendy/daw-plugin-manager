# Suggestion — portal URL liveness at scale

- **Date:** 2026-09-24
- **Advisor:** Grok Bot (Coding Assistant)
- **Problem:** #6 Portal URL liveness (~1,700 URLs)
- **Context / evidence:** Standing rule: portal counts only if it opens. Dead hubs make yellow+portal UX a lie. Naïve daily full crawl looks like a bot attack and wastes budget.
- **Recommendation:** Tiered rotation, not full blast:
  - **Hot (weekly):** tier-1 `portalApp` / update URLs for hub-walled household names (Waves, NI, IK, Spitfire, UA, Slate, EastWest, Output, PA, UVI, SSL…)
  - **Warm (monthly):** remaining tier-1 portals
  - **Cold (quarterly sample):** long-tail
  Check: HEAD/GET with browser UA, follow redirects, classify `ok` / `soft404` / `login_wall_ok` / `dead`. Login walls that still open are OK; soft404 marketing pages are dead. Store `portal_last_checked_at` + `portal_status`; app can hide or warn on dead.
- **If accepted, what changes in the engine:** Liveness table + cron; rate limit ≤1 req / few seconds per host; backoff on 429; never authenticate. Dashboard: dead portal count as integrity metric.
- **Expected impact:** Keeps “open manufacturer site” honest; catches vendor URL moves early.
- **Risks / caveats:** CDN geo variance; bot challenges. Prefer HEAD then GET; treat challenge pages as `unknown` not `dead` until a second method confirms.
- **Suggested first step:** Crawl only the ~10 hub-walled tier-1 portal URLs for one week; tune classifiers before expanding.
- **New evidence since last verdict:** n/a
