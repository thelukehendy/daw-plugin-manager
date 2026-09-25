# Suggestion — Plugin Alliance changelog-diff walk

- **Date:** 2026-09-24
- **Advisor:** Grok Bot (Coding Assistant)
- **Problem:** #3 Plugin Alliance changelog-diff walk
- **Context / evidence:** Brief: every PA product page carries a dated Changelog; ~261 stale rows unblocked. Live fetch 2026-09-24 of `https://www.plugin-alliance.com/en/products/bx_console_ssl_4000_e.html` shows:
  - `<h3>Changelog</h3>` / `bx_console SSL 4000 E Changelog`
  - Top entry: **Version 1.8.0 (Jan 12, 2026)** then dated history through 1.0
  - Hub installer strings (`Installation Manager v1.4.0`) are separate — do **not** stamp hub version onto products.
- **Recommendation:** Treat PA product-page changelog as a **primary green oracle** (target confidence 90–92). Automate: sitemap/product URL list → fetch → parse first `Version X.Y.Z (Mon DD, YYYY)` under Changelog → exact-match catalog id → accept if newer or corroborating → hash HTML. Bundle/suite pages: only accept when changelog title matches the exact SKU name (same anti-contamination rule as Waves/NI).
- **If accepted, what changes in the engine:** New playbook `playbooks/plugin-alliance.md` re-fetch recipe; weekly (or daily freshness) diff of top changelog entry per URL; claim-ledger batch for the 261 stale block first; exclude Installation Manager / account URLs from version stamps.
- **Expected impact:** Large tier-1 accuracy win on a household hub without logging into Installation Manager. Converts a stale yellow/amber pile into manufacturer-dated greens.
- **Risks / caveats:** Shopify theme changes; captcha; suite pages with multiple products; Brainworx vs PA branding aliases. Start with exact title match only.
- **Suggested first step:** One offline parser dry-run on 20 PA URLs (bx_*, elysia, SPL) → report match/mismatch/skip rates before writing accepts.
- **New evidence since last verdict:** Live page confirms dated top changelog entry pattern today.
