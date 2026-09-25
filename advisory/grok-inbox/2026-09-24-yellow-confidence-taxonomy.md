# Suggestion — yellow-band confidence taxonomy

- **Date:** 2026-09-24
- **Advisor:** Grok Bot (Coding Assistant)
- **Problem:** #4 Confidence taxonomy (yellow band honesty)
- **Context / evidence:** ~1,346 yellows; brief notes ~2/3 of tier-1 yellows are KVR-only on hub-walled vendors. Today’s chips re-try rows that cannot gain a public manufacturer build. CONFIDENCE.md still treats yellow mostly as “source quality,” not “resolvability.” Dashboard then looks like unfinished work when much of it is structural.
- **Recommendation:** Split yellow (and versionless) into explicit **resolvability classes** stored on the observation or plugin row:
  1. `public_pending` — public page likely exists; keep hunting / freshness
  2. `hub_walled_kvr_floor` — KVR@~60 + working portal; honest floor until oracle
  3. `structurally_unversioned` — soundsets, bundles, hardware, DAW-bundled, Spitfire/UVI/Steinberg library classes already ruled terminal in TIER1-ASSAULT
  4. `mac_win_dual_blocked` — Mac≠Win mismatch; never unilateral stamp
  5. `generation_only` — official gen (e.g. Waves V17 membership) without per-product build; provenance split required
  Chips must skip classes 3–4 by default; class 2 only when a *new* oracle angle appears.
- **If accepted, what changes in the engine:** Add `resolvability` (or equivalent) to schema + export; stop-query excludes 3–4; dashboard shows yellow breakdown; research_attempts reason codes align. App UX: class 2 → portal CTA primary; class 3 → no update nag.
- **Expected impact:** Ends wasted chips on dead ends; honest UI; green-plateau narrative becomes credible because yellow is no longer one lump.
- **Risks / caveats:** Misclassifying a `public_pending` as structural blocks a real raise. Require reflect-log + human/operator override path before promoting anything to structural.
- **Suggested first step:** Tag the four TIER1-ASSAULT structurally-blocked classes + Mac≠Win notes in one migration; measure how many yellows leave the research queue overnight.
- **New evidence since last verdict:** n/a
