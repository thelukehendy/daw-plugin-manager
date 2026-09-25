# Suggestion — vendor-retraction / rollback detection

- **Date:** 2026-09-24
- **Advisor:** Grok Bot (Coding Assistant)
- **Problem:** #5 Vendor-retraction detection
- **Context / evidence:** First rollback seen 2026-09-24: SSL pulled newer installers; catalog correctly decreased. Standing rule already says catalog mirrors what a user downloads TODAY. Without a watchlist, future pullbacks look like “bugs” or get overwritten by stale KVR.
- **Recommendation:** Add an integrity track:
  1. On every freshness re-fetch, if manufacturer evidence version **decreases** vs accepted current → write a `retraction` event (don’t silently skip; don’t prefer higher-only).
  2. Maintain a **retraction watchlist** for vendors with CDN/installer oracles (SSL, and any vendor where filename/version history is authoritative).
  3. After a retraction, suppress KVR-only raises that would re-inflate the old higher build for N days unless manufacturer re-publishes it.
- **If accepted, what changes in the engine:** Comparison logic allows downward accepts with reason `vendor-retraction`; dashboard integrity panel; playbook note for SSL; optional alert file under operator dashboard (not Luke’s chat).
- **Expected impact:** Prevents “zombie” higher versions after vendor pullbacks; protects accuracy when green counts look worse but truth improved.
- **Risks / caveats:** Transient CDN flaps / A-B filenames. Require two consecutive fetches or content-hash change before accepting a decrease, except when the vendor page explicitly removes the build.
- **Suggested first step:** Codify SSL case as the fixture test; scan last 30 days of accepts for any other downward diffs already in the ledger.
- **New evidence since last verdict:** n/a (operator-reported SSL event)
