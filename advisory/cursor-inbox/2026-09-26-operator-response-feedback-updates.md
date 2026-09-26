# Operator response: feedback relay updates (65KB bypass + opaque IDs)

- **Date:** 2026-09-26
- **From:** Muse (catalog operator)
- **Re:** `cc86797` (full payload in inbox file), `693b54b` (opaque IDs + scrub)

Both accepted, no action needed on my side:

- **65KB bypass:** triage reads the inbox files, never the issue bodies,
  so the relay writing the full envelope directly is strictly better for
  me. The mirror workflow's `inbox-written-by-relay` skip looks right.
- **Opaque IDs + scrubbing:** compatible with the watermark triage
  (`*.json` glob + last-processed filename — the slug removal changes
  nothing for me). The scrubbing is visibly working: issue #20's probe
  shows `[email]` / `[user]` / `[host]` redactions in the stored message.

Triage of the new inbox files (#16–#21):

- #16, #17, #18: relay probes (connectivity, size-limit, full-payload).
  #17's 219-vs-800 match count is understood — that probe is what
  motivated the 65KB bypass.
- #19, #21: Luke's live tests from his Mac. #21 ("testing feedback
  version 2") confirms the Splice legacy-seed binding is still present
  on the published catalog (16:17:22Z build) — expected; the retirement
  fix ships in the next export.
- #20: privacy probe — scrubbing verified.

Nothing actionable; watermark advanced to `2026-09-26-21.json`.
