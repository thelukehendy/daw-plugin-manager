# Operator guidance to the advisor

Dated entries, newest first. This is how the operator steers the advisor
between waves. The advisor should read the latest entry before starting a wave.

---

## Round 4 — 2026-09-25: the hard push — make the database itself harder to fool

Wave 7 went 11/11. At Luke's direction, this round is deliberately harder.
The theme is **database robustness and accuracy**: not new oracles, but
making the catalog resistant to the failure modes we've already seen —
contaminated version stamps, misfiled identities, retraction-worthy claims.
This is the round where you try to break our data, on paper, before reality
does it for us.

**Ask 1 — the contamination hunt.** Wave 7 documented suite-stamp
contamination: Softube Central `2.6.41`, UAD Version History `12.0`, Waves
Central `15.x` stamped onto suite/bundle/edition rows as if they were
product versions. The D16 incident and the Waves V17 rule show this class
bites. Your task: a **detection recipe** for cohort/hub-stamp contamination
across tier 1 — the signature shapes (hub-app version == N product rows
from one manufacturer; suite tip diverging from component tips; DMG
basename vs stamped version mismatch), the SQL-shaped logic an engine chip
could run, a **candidate list with evidence** for every row you can defend,
and explicit **false-positive guards** (real products that genuinely share
a cohort train, e.g. Waves' honest per-product builds). This is the highest-
value ask in the round: it protects data integrity, which is the one thing
that pages Luke.

**Ask 2 — stress-test the retraction protocol.** You gave us the
vendor-retraction decision tree (adopted). Now try to break it. Run it
against three real incidents: the D16 version contamination, the Lindell
expired-domain catch, and the Waves V17 across-every-SKU rule. For each:
would the protocol as written have caught it, how fast, and where is the
protocol vague or wrong? Deliver a **protocol v2** with the gaps closed —
pre-registered triggers, evidence thresholds, and the exact operator action
each trigger demands. If you can't break v1, say so with the case files to
prove it.

**Ask 3 — pre-register falsification for every accepted chip.** For each
accepted wave-6/7 oracle chip (Moog, Sonnox, NI YAML, Waves canary, UA
Connect DMG, IK CDN, Spitfire path, KORG news feed): state the **exact
observations that would force retraction** — the negative control that
must keep passing, the page shape that must not change, the version-string
pattern that would invalidate the parse rule. This is the falsifiability
half of your chip packs. A chip without a stated death condition is a chip
I can't maintain.

**Ask 4 — the KORG template, generalized.** The news-title version feed was
the only true unlock in wave 7. Hunt for the same *class* of leak at other
hub-walled vendors: support newsrooms, release-note indexes, press-release
feeds, "what's new" pages, community-manager announcements — any public
surface where version strings escape the walled garden. KORG proved the
shape exists. Same bar as last round: **new evidence or don't file.**

**Ask 5 — identity classifier v2 + self-verification.** Two parts. (a) Turn
the wave-7 sweep into a **rule-based classifier**: name-pattern rules +
portal-URL-shape rules (Waves `/bundles/` vs `/plugins/`, UA shop
categories, Softube product-page copy patterns), with **precision/recall
measured against your own 18 candidates and 17-item allowlist** — the
allowlist is your test set; show the classifier doesn't eat it. (b)
**Second-source your own 18**: one more independent public source per
candidate (retailer listing, review, manual PDF) so my verification queue
gets shorter, not longer. Adding evidence to your own claims is welcome;
re-verifying my queue for me is still out.

**Ask 6 — open exploration (up to 3 files).** This is the invitation: angles
I haven't named. Surprise me — but the bar is higher here than anywhere:
evidence-backed, tier-1, non-redundant with waves 1–7, and each file must
end with why it matters for robustness or accuracy specifically. If you
can't clear that bar, file fewer.

### Explicitly out of scope for wave 8

- Freshness/portal **implementation** — still gated on the taxonomy landing
  and Luke's pending pivot call. Detection thinking is fine; building the
  prober is not.
- Bulk portal probing of any kind.
- New hub-walled oracles beyond the KORG-template hunt — the map is drawn;
  this round is about the data we already hold.
- Re-verifying my verification queue for me — the trust boundary stands.

### Standing rules (unchanged, plus one nit)

≤12 files · fixtures in-repo with SHA256SUMS · check `verdicts.md` first ·
no pivot assumption · no telemetry · no Luke-input workflows · no
credentialed scraping · nothing becomes catalog data without my re-fetch.
**Nit from wave 7:** don't duplicate vendor dirs under `fixtures/wave8/`
(`ik` + `ik-pm`, `ni` + `ni-electron-updater`…) — one canonical dir per
vendor, please.

---

## Round 3 — 2026-09-25: wave 6 verdicts are in — now make the accepted chips buildable

Wave-6 verdicts are posted in `advisory/verdicts.md`: **12 accepted, 0
rejected.** Round-2 guidance worked — keep the format (≤12 dense files,
in-repo fixtures, explicit non-goals, no pivot assumption).

The bottleneck has moved. Discovery is no longer the constraint;
implementation is. I have a 6-item first-hand verification queue from your
accepted chips, and the engine's chips will work through it. Wave 7 should
not be another discovery sweep — it should make the accepted designs
*buildable*. Note the trust boundary: my re-fetch is mine to do, not yours
to parallelize. What you *can* do is everything around it.

**Ask 1 — close the mf-105s gap.** Your Moog table claims MF-105S 1.3.0 but
no `moog-mf-105s.html` fixture is in the repo. Re-fetch, commit the fixture
+ `.meta.json`, or correct the table. Small, concrete, blocking one raise.

**Ask 2 — chip-ready packs for each accepted wave-6 oracle.** Moog is the
template: exact fetch recipe + parse rule + golden fixture + negative
control (the mf-106s soft-404 was the right instinct). Do the same pack for:
Sonnox RN pages, NI `latest-mac.yml`, Waves `/downloads` canary, UA Connect
DMG basename, IK PM CDN HEAD (with the Referer requirement), Spitfire
CloudFront path. One file per oracle, each ending in "ready for the engine
to wire after operator re-fetch."

**Ask 3 — tier-2 top-5 deep dive (scout only).** Your recon produced a
scored top-20 with a documented formula. Take the top 5 and give each the
Moog treatment: fixture-backed oracle spec, parse rule, traps. Still
scout-only — no catalog proposals, tier-2 research stays paused — but if
Luke ever opens tier 2, these five should be wiring-ready.

**Ask 4 — systematic identity sweep.** The UA Editions reclass was the
template: rows wearing plugin clothing that are actually bundles, suites,
or commerce editions. Sweep tier 1 for more of them — naming patterns
("Collection", "Bundle", "Edition", "Pack", "Suite"), manufacturers with
known bundle lines, rows whose portal URL is a shop page. Concrete
reclass candidates with evidence, not a philosophy essay.

**Ask 5 — second creative pass on the 82 hub_walled residuals, with a
bar.** KORG 24, IK 48, Roland 4 and friends are parked honestly — but
parked is not solved. One more creative pass is welcome *only* where you
have a genuinely new angle (installer filename conventions on public CDNs,
support-article version mentions, community-manager posts). New evidence
or don't file; do not re-grind parked rows with the same queries.

### Explicitly out of scope for wave 7

- Freshness/portal implementation — still gated on the taxonomy landing and
  Luke's pending pivot call.
- Re-verifying my verification queue for me — that's the trust boundary.
- New hub-walled discovery beyond Ask 5's bar — wave 6 covered the map;
  depth now beats breadth.

### Standing rules (unchanged)

≤12 files · fixtures in-repo with SHA256SUMS · check `verdicts.md` first ·
no pivot assumption · no telemetry · no Luke-input workflows · no
credentialed scraping · nothing becomes catalog data without my re-fetch.

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
