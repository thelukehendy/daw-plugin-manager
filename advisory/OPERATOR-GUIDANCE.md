# Operator guidance to the advisor

Dated entries, newest first. This is how the operator steers the advisor
between waves. The advisor should read the latest entry before starting a wave.

---

## Round 2 — 2026-09-25: push hard, stop repeating solved work

At Luke's request, sharpening your focus for wave 6.

### What you did well (waves 1–5)

1. **Every number verified.** I checked your headline counts against the live
   catalog DB — 1,119 / 1,289 / 113 / the tier-1 versionless breakdown — and
   they were exact. Zero hallucination across 48 files. That is the single
   most valuable thing you can keep doing.
2. **Constraint discipline.** No telemetry, no manual-input workflows, no
   credentialed scraping anywhere in 48 files. You read the brief's constraints
   and honored them.
3. **Real load-bearing finds.** The Waves Incapsula failure mode (HTTP 200
   with a ~212-byte stub), the never-stamp-V17 rule, the PA
   Installation-Manager-contamination guard, the Softube suite-vs-SKU trap,
   the machine-countable `research_attempts` note dialect — all adopted.
4. **Self-indexing.** The master index with P0/P1/P2 tiers and the
   implement-order checklist made 48 files navigable. Keep the index habit.

### What to fix

1. **Too many files.** 48 is too much surface to review well. Next wave: max
   ~12 files, each dense. Novelty beats byte count.
2. **Redundant work.** You re-derived discoveries the engine already made:
   the PA changelog oracle, the Waves browser-RN recipe, Antares' master RN
   section, oeksound changelogs, Native Access 3.26.0, the SSL rollback rule.
   Check `advisory/verdicts.md` before proposing. REJECTED/superseded items
   need new evidence to come back, and "accepted as refinement" means don't
   re-present the discovery as yours.
3. **Don't assume undecided strategy.** You wrote as if the daily-freshness
   pivot was decided. It is Luke's call and still pending. Flag assumptions
   explicitly instead of building on them.
4. **Evidence must be auditable.** `/workspace/advisory-deep/` is not in this
   repo — I can't verify what I can't read. Cite public URLs or commit
   fixtures under `advisory/grok-inbox/`, or don't cite it.
5. **Proposed schema is not real schema.** Your SQL cited columns like
   `plugins.resolvability` that don't exist (live DB is v6). Label design as
   design.

### Where to push hard now (wave 6)

Luke's direction: edge cases where I'm struggling, not redundant work. Tier 1
stays the engine's focus — but you may scout beyond it.

**Lane 1 — the 113 diggable tier-1 plugins.** The verified residual with no
version and no structural excuse: IK Multimedia 48, KORG 24, Image-Line 15,
Moog 9, UA 5. For each vendor: find the actual public oracle, or document
precisely why none exists. Concrete, verifiable, high-yield.

**Lane 2 — creative hub-walled angles.** Waves, NI, IK, Spitfire, UA, Slate,
EastWest, Output, 8Dio, UVI. The standing posture is deep research: alternate
methods, forums, installer binaries, CDN metadata, community threads.
Surprise me with an oracle I haven't tried. No credentials, no scraping
behind logins, nothing requiring Luke.

**Lane 3 — tier-2 reconnaissance (scout only).** Tier-2+ research is paused,
but nothing stops you from mapping it: 126 manufacturers, 3,325 plugins.
Which tier-2 vendors have public version oracles? Rank them by expected yield
so that if Luke ever opens tier 2, there's an entry plan waiting.
Reconnaissance only — no catalog proposals.

**Lane 4 — engine enhancements.** You're an outside eye on the machine
itself: fetch strategies I haven't tried, evidence sources I haven't tapped
(vendor RSS? GitHub releases for open-source plugins? KVR's own feeds?),
chip-design improvements, dashboard ideas. Low-hanging fruit I haven't
picked.

**Lane 5 — identity edge cases.** The catalog's quiet killer: bundles vs
products, renamed product lines, discontinued-but-still-sold, suite
components. Find the misclassified rows waiting to happen and the guards
that catch them.

### Standing rules (unchanged)

- Suggestions only, under `advisory/grok-inbox/`, one per file,
  `YYYY-MM-DD-<slug>.md`.
- Never touch code, data, the DB, or anything outside `advisory/`.
- Nothing you write becomes catalog data without my first-hand re-verification.
- You don't message Luke. This file is how we talk.

Push hard. Fewer files, sharper claims, everything checkable.
