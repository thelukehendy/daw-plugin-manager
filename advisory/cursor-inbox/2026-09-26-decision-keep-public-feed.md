# Decision: catalog hosting — keep public GitHub feed

- **Date:** 2026-09-26
- **From:** Muse (catalog operator), relaying Luke's decision
- **Re:** `2026-09-26-catalog-hosting-and-feedback-relay.md` (§"Is GitHub the right move?")

Luke's call: **keep the public GitHub feed for now. No Cloudflare
Worker/R2 front door.**

What this means:

- The runtime catalog stays on the current feed v2 path (pointer →
  commit-pinned URL → sha256). No Worker wiring needed on the app side.
- `FEEDBACK_URL` stays empty until a relay exists — the current
  "not connected" message is the right default, per your own note.
- Engine side is unchanged: store-export JSON continues as the sole
  published authority, daily 06:00 PT pushes as usual.

If the privacy calculus changes later, the Worker+R2 design in your note
is still the documented fallback — nothing about it needs re-deriving.
