# Advisory verdicts

Maintained by the catalog operator. Every suggestion in `advisory/grok-inbox/`
gets a verdict here — ACCEPTED (adopted as design; operator implements and
re-verifies), REJECTED (with why), or DEFERRED (with what's missing).

Check before re-proposing: REJECTED items need new evidence to come back.

---

## Messages to the advisor (read first)

1. **The freshness-cadence pivot is NOT decided.** It is pending Luke's verdict
   (brief §4). Several of your files write as if the 12h→daily-freshness-sweep
   switch already happened. It hasn't. Designs that assume it are accepted as
   designs only; nothing here authorizes the switch.
2. **Evidence must be auditable.** You cite `/workspace/advisory-deep/` paths
   (REPORT.md, raw HTML saves, fixtures) that are not in this repo. I cannot
   verify what I cannot read. Future evidence should be public URLs or fixtures
   committed under `advisory/grok-inbox/` — or don't cite it.
3. **Confidence bands:** green ≥85, amber 70–84, yellow <70 (operative
   `catalog-store/CONFIDENCE.md`). The brief's "≥90" was stale; synced.
4. **Discovery credit:** the PA dated-changelog oracle, Waves RN recipe,
   Antares master RN section, oeksound changelogs, Native Access 3.26.0, and
   the SSL rollback rule were operator/engine discoveries. Your contribution is
   implementation depth on them — valuable, but keep the attribution straight.
5. **Acceptances are design-level.** Nothing you wrote authorizes a catalog
   write on its own. Every novel live claim needs a first-hand operator
   re-fetch first (see the verification queue at the bottom).

## Round 1 — waves 1–5 (2026-09-24 → 2026-09-25)

Reviewed 2026-09-25. **ACCEPTED: 33 · REJECTED: 12 · DEFERRED: 2.**

### Problem #1 — Green plateau / freshness

- `2026-09-25-green-plateau-freshness-kpis-deep.md` — **ACCEPTED.** The
  churn×share SLA model and "done = verified-within-SLA" definition match the
  plateau. HOLD→`verified_at` refresh matches the 2026-09-22 rotation fix.
  Caveat: the age histogram is your RO read, not re-verified; and the cadence
  switch it recommends is a design only (see message 1).
- `2026-09-25-freshness-sla-and-overdue-queue-deep.md` — **ACCEPTED.** The
  overdue-queue + hold-refresh chip is the implementable core. Caveat: its SQL
  leans on proposed schema-v7 columns that don't exist — accept the logic, not
  the queries as runnable. Wire to the taxonomy first.
- `2026-09-25-green-plateau-dashboard-widgets-deep.md` — **ACCEPTED.** Leading
  with freshness coverage % and demoting band counts is right for a
  maintenance-phase catalog. The widget SQL is buildable on existing tables;
  treat the list as a build order, not one drop.
- `2026-09-25-control-group-fabfilter-goodhertz-valhalla-deep.md` —
  **ACCEPTED.** Control-group canaries as fetch-pipeline health probes are
  correct zero-trust engineering. Re-fetch tip fixtures first-hand before they
  become golden tests.
- `2026-09-25-goodhertz-fabfilter-valhalla-live-quotes-deep.md` —
  **ACCEPTED** as a fixture-source file. Nothing from its tables enters the
  catalog without a first-hand re-fetch.

### Problem #2 — Hub-walled discovery

- `2026-09-25-hub-walled-oracle-matrix-deep.md` — **ACCEPTED** as the priority
  map (Waves browser → UA → EastWest → Output → Slate → NI → Spitfire → IK →
  UVI → 8Dio park). Confirm each cell first-hand when its chip is built.
- `2026-09-25-waves-incapsula-oracle-deep.md` — **ACCEPTED.** The Incapsula
  failure-mode finding is the most load-bearing in the pack: curl returns
  HTTP 200 with a ~212-byte stub, so any "HTTP 200 = healthy" check on Waves
  is a silent lie. Stub detector + last-good-snapshot retention is the right
  hardening. Re-run the fetch here before wiring the detector.
- `2026-09-25-waves-browser-rn-evidence-deep.md` — **ACCEPTED.** The hard
  rule — never stamp generation V17 onto every SKU — is exactly our
  identity-guard posture. New-plugin names are a parser corpus, not rows.
- `2026-09-25-waves-diff-algorithm-implementable-deep.md` — **ACCEPTED.** The
  most implementation-ready hub file: snapshot schema, generation_bump vs
  hotfix rules, regression fixtures. "V17 bulk → exactly one
  generation_event, zero SKU writes" becomes a unit test.
- `2026-09-25-ua-uad-version-history-oracle-deep.md` — **ACCEPTED**, with a
  blocking verification: re-fetch the article first-hand and confirm the 12.0
  tip before any raise; keep the path marked suspect until then.

### Problem #3 — Plugin Alliance

- `2026-09-25-pa-handle-inventory-and-identity-map-deep.md` — **ACCEPTED.**
  Identity-first posture with the bundle/skip list and the hard rule that
  Installation Manager strings never become `observed_version` — that closes a
  real contamination channel. Re-run the 280-handle inventory first-hand
  before freezing any join/skip list.
- `2026-09-25-pa-changelog-parser-spec-deep.md` — **ACCEPTED** as the parser
  chip spec. Correction: it proposes emitting at confidence ≥ 0.80 — under
  operative bands that's amber-class, not green. Either raise the bar to ≥85
  for greens or label 0.80–0.84 output amber honestly.

### Problem #4 — Yellow resolvability

- `2026-09-25-yellow-resolvability-taxonomy-deep.md` — **ACCEPTED.** The
  orthogonal `resolvability` axis is the conceptual core of the yellow
  cleanup. Operator-owned implementation: dry-run the backfill read-only
  first, make the recipe-health override mandatory, never blank accepted
  currents when backfilling.
- `2026-09-25-yellow-kvr-ceiling-stop-queries-deep.md` — **ACCEPTED.** Every
  headline count verified first-hand against the live DB during review
  (1,119 / 113 / IK 48…). The dig-vs-stop SQL makes "diggable debt" a
  concrete, shrinkable number. Land the schema first.
- `2026-09-25-research-attempt-outcome-vocabulary-deep.md` — **ACCEPTED.** A
  machine-countable note dialect on the existing ledger is the right fix for
  free-text notes. Adopt the prefix discipline; exact strings are an operator
  decision at implementation.

### Problem #5 — Vendor retraction

- `2026-09-25-vendor-retraction-protocol-deep.md` — **ACCEPTED** as doctrine
  codification (the standing rule already existed). The A–E classes stop
  identity corrections and KVR noise from being mislabeled as retractions.
- `2026-09-25-ssl-zendesk-datalink-parser-deep.md` — **ACCEPTED.** The most
  immediately shippable parser: Zendesk article JSON, `data-link` basename
  versions, `Acuostifier` typo alias, Mac-current on splits. Re-fetch the
  article JSON first-hand before wiring; regenerate the "96" fixture count
  from our own fetch.

### Novel oracles

- `2026-09-25-softube-rn-suite-vs-sku-deep.md` — **ACCEPTED.** Critical
  anti-pattern catch (same class as Waves V17, Eventide H910): the suite train
  must never become per-SKU versions. The forbidden-uses table goes in the
  playbook verbatim.
- `2026-09-25-softube-central-sc3-yaml-deep.md` — **ACCEPTED.** The
  `sc3/latest-*.yml` feed is a clean hub_app oracle; the trap matrix prevents
  a 3.0.5 → 2.2.0 regression. Re-fetch both feeds first-hand before any raise.
- `2026-09-25-antares-zendesk-section-rn-deep.md` — **ACCEPTED** as a
  refinement (not new discovery — the master section was found 2026-09-22).
  Section-API enumeration beats blind name search. Re-fetch the 28-article
  map and the 1.2.1 tip before any raise.
- `2026-09-25-oeksound-changelogs-deep.md` — **ACCEPTED** as maintenance
  confirmation of a standing oracle. Re-fetch the four tips before any bump.
- `2026-09-25-slate-vmr-zendesk-oracle-deep.md` — **ACCEPTED.** The VMR-vs-Hub
  separation is the load-bearing insight. Hard-allowlist only after
  first-hand re-fetch; never invent Zendesk article IDs.
- `2026-09-25-eastwest-support-updates-oracle-deep.md` — **ACCEPTED** as a
  bounded hub-app play with the never-stamp-onto-libraries rule. Re-fetch
  tips first-hand.
- `2026-09-25-output-help-center-oracles-deep.md` — **ACCEPTED** as a
  plausible curl-friendly oracle set. Re-fetch all three articles first-hand
  before wiring pollers.
- `2026-09-25-eight-dio-park-deep.md` — **ACCEPTED.** An honest park with an
  explicit `oracle_absent` posture is a deliverable, not surrender.
- `2026-09-25-ik-product-manager-canary-deep.md` — **ACCEPTED** as a bounded
  app-only canary. Re-fetch the 1.1.15 quote before wiring.
- `2026-09-25-ni-native-access-canary-deep.md` — **ACCEPTED** as a
  freshness-canary formalization (3.26.0 was already promoted by the engine).
  Don't hardcode the thread URL — discover via search.
- `2026-09-25-spitfire-app-changelog-deep.md` — **ACCEPTED** for the app row
  only; no per-library greens from the app tip. Re-fetch first-hand.
- `2026-09-25-uvi-falcon-year-canary-deep.md` — **ACCEPTED** for the
  non-invention rule itself: "Falcon 2026" marketing must never become a
  semver triple. Light cadence.

### Meta / process

- `2026-09-25-muse-inbox-index-and-ship-order.md` — **ACCEPTED** as the
  inbox's navigation aid. Rejected in part: its W1–W10 framing assumes the
  undecided cadence — the index is a map, not ship authority.
- `2026-09-25-advisor-implement-order-checklist-deep.md` — **DEFERRED.** Coherent,
  but scheduled on the undecided pivot and unapproved schema work. Becomes the
  build order once (a) Luke rules on the pivot and (b) the taxonomy schema is
  operator-approved.
- `2026-09-25-learnings-wave5-final.md` — **ACCEPTED** as the campaign wrap.
  No implementation follows directly.
- `2026-09-24-advisor-learning-log-and-notes-dir.md` (`advisory/grok-notes/`
  proposal) — **DEFERRED.** Reasonable housekeeping, but the inbox works and
  this loop needs nothing from Luke. Revisit when volume makes it painful.

### Superseded (REJECTED — keep for the record, prefer the deep sibling)

- `2026-09-24-green-plateau-freshness-pivot.md`, `2026-09-24-hub-walled-oracle-priorities.md`,
  `2026-09-24-plugin-alliance-changelog-walk.md`, `2026-09-24-portal-url-liveness.md`,
  `2026-09-24-vendor-retraction-detection.md`, `2026-09-24-yellow-confidence-taxonomy.md`,
  `2026-09-24-learnings.md` — thin wave-1 seeds, superseded by deep versions.
- `2026-09-25-novel-oracles-softube-antares-oeksound-deep.md`,
  `2026-09-25-learnings-deep.md`, `2026-09-25-learnings-wave2.md`,
  `2026-09-25-learnings-wave3.md`, `2026-09-25-learnings-wave4.md` — folded
  into dedicated deeps and the wave-5 final. The doctrine residue (generation
  ≠ version, Mac-current beats higher Win, typo aliasing, park-as-deliverable,
  stop-queries before digs, identity before scrape) survives via accepted files.

### Portal liveness (P2 — accepted as design, gated)

- `2026-09-25-portal-liveness-tiers-deep.md` + `2026-09-25-portal-liveness-dedupe-cadence-deep.md` —
  **ACCEPTED** as one work item. Dedupe-before-sweep at ~120/day with
  `login_wall` = healthy is the only sane shape. Gated: do not start before
  the taxonomy stop-lists exist. New-table design work for the operator;
  start with the T0 pilot.

---

## Verification queue (operator's first-hand re-fetches before any raise)

1. Waves RN via browser: full page (not 212 B stub); sections match quoted Central 17.0.4 / V17 June 2026.
2. UA UAD Version History article: top head 12.0 / Sept 8, 2026.
3. PA `products.json` → 280 handles; spot-check changelog tops; IM-contamination guard.
4. SSL Zendesk article JSON: `updated_at`, link inventory, Acoustifier dual cell.
5. Softube sc3 YAMLs → 3.0.5; root/Homebrew stale-2.2.0 trap; RN index 2.6.42 suite tip.
6. Slate VMR RN 2.10.1.3; Hub 2.19.0; installers 404 / SPA-shell behavior.
7. EastWest `/support/updates`: IC 2.0 / Opus 1.6.5.
8. Output Help Center trio: Arcade 2.16.1 / Co-Producer 1.6.1 / engines table.
9. Antares section API: 28 articles; AutoTune 2026 1.2.1.
10. oeksound four changelog tips (1.3.3 / 1.0.5 / 1.1.3 / 1.4.4).
11. Control group: FabFilter 4.13, Goodhertz 3.14.1, Valhalla Room 2.0.5 tip lines.
12. NI status thread + installer Last-Modified; IK PM v.1.1.15; Spitfire app v3.4.17.
13. Portal seed SQL: distinct CTA count.
14. Freshness age histogram, if the KPI dashboard will quote it.

---

## Round 2 — wave 6 (2026-09-25)

Reviewed 2026-09-25. **ACCEPTED: 12 · REJECTED: 0 · DEFERRED: 0.**

Note: this wave followed the round-2 operator guidance closely — 12 dense
files (the cap), in-repo fixtures with SHA256SUMS instead of scratch paths,
no pivot assumption, explicit non-goals, no redundant re-derivation. The
guidance mechanism works; keep using it.

### Lane 1 — diggable-113 disposition

- `2026-09-25-diggable-113-disposition-matrix-deep.md` — **ACCEPTED.** Full
  113 disposition (82 hub_walled / 13 oracle_found / 12 oracle_absent /
  6 reclass). Converts diggable debt into a concrete matrix. Honest about
  the IK over-walling risk — the recipe-health override stays mandatory.
- `2026-09-25-moog-softwareupdate-oracle-deep.md` — **ACCEPTED, with a
  flag.** `software.moogmusic.com/softwareUpdate/{slug}` is a genuine public
  per-SKU oracle (Mariana 1.2.0; eight MF-*S at 1.3.0). Flag: the
  `moog-mf-105s.html` fixture is missing from the repo while the table claims
  1.3.0 — re-fetch mf-105s first-hand before any raise; the mf-106s fixture
  is correctly the soft-404 negative control.
- `2026-09-25-sonnox-restore-freeze-and-procodec-deep.md` — **ACCEPTED.**
  Farewell article + four dated RN tips (Restore trio 3.01.0 / 2024.05.17;
  Pro-Codec 4.00.0 / 2022.03.09). Verify first-hand; the RN host is a
  BigCommerce store domain reached via Sonnox docs linkage.
- `2026-09-25-ik-amplitube-pdf-canary-and-hub-wall-deep.md` — **ACCEPTED as
  design.** Honest stop on ~48 IK digs. The PDF-filename canary is clever
  but fragile — host-only, corroborate before any green.
- `2026-09-25-ua-editions-identity-reclass-deep.md` — **ACCEPTED.** Five UA
  "Edition" rows are commerce bundles, not plugins — reclass and stop dig.
- `2026-09-25-il-fl-studio-coupled-plugins-deep.md` — **ACCEPTED.** 15
  Image-Line rows to `structurally_blocked`/`daw_bundled` with public
  evidence. Operator to pick the host-canary policy before any stamp.

### Lane 2 — hub-walled angles

- `2026-09-25-ni-electron-updater-yaml-deep.md` — **ACCEPTED.** Novel durable
  transport: `na-update.native-instruments.com/{arm64/}latest-mac.yml` →
  3.26.0, the Softube-sc3 pattern applied to NI. Correctly does not re-claim
  the tip. Re-fetch before wiring.
- `2026-09-25-waves-downloads-central-canary-deep.md` — **ACCEPTED.** Second
  public Central oracle (V17.0.4 | Aug 02, 2026), cheaper than Playwright;
  honest that the URL intermittently stubs. Never-stamp-SKU guard intact.
- `2026-09-25-hub-app-cdn-canaries-ua-ik-spitfire-deep.md` — **ACCEPTED.**
  Three new angles: UA Connect versioned DMG basename (1.10.0 build 3844),
  IK PM CDN HEAD requiring Referer (403 without — good catch), Spitfire
  CloudFront path semver (3.4.17). All hub_app-only.

### Lane 3–5 — recon, enhancements, identity

- `2026-09-25-identity-and-tier2-recon-deep.md` — **ACCEPTED.** The strongest
  file this wave: live-DB tier-2 census, oracle classes A–F from same-day
  public fetches, a scored top-20 assault order with a documented formula,
  and honest traps. A ready entry plan if tier 2 ever opens; zero catalog
  writes proposed. Its counts are labeled local-store RO — re-run on the
  live DB before use. Bonus: it corrected a stale playbook (Wave Arts),
  which is exactly the "surprise me" behavior asked for.
- `2026-09-25-engine-maintainability-paths-deep.md` — **ACCEPTED.** Additive
  designs (generalized `oracle_health`, fixture CI, GitHub releases.atom+ETag
  for OSS, docs-index RN discovery, yml allowlist). Doesn't redo accepted
  docs.
- `2026-09-25-muse-wave6-inbox-index-and-ship-order.md` — **ACCEPTED.** Front
  door with explicit non-goals and the pivot non-assumption. Keep the habit.

### Wave-6 verification queue (first-hand re-fetch before any raise)

1. Moog `softwareUpdate/{slug}` × 9, especially mf-105s (no fixture).
2. Sonnox farewell article + four RN tips.
3. NI `na-update…/{arm64/}latest-mac.yml` → 3.26.0.
4. Waves `/downloads` → Central V17.0.4; DMG Last-Modified.
5. UA Connect DMG 1.10.0 build 3844; IK PM CDN HEAD with Referer; Spitfire
   CloudFront 3.4.17.
6. Tier-2 oracle spot-checks (Wave Arts, AudioThing, Denise, Gullfoss, DDMF,
   Dexed) — scout only, no catalog action.

---

## Round 3 — wave 7 (2026-09-25)

Reviewed 2026-09-25. **ACCEPTED: 11 · REJECTED: 0 · DEFERRED: 0.**

All five round-3 asks graded DONE. No constraint violations, no padding
(line counts tight; the tier-2 file's honest "~0 accepts" estimates for 3 of
5 vendors are anti-padding). One nit: the mf-105s `.meta.json` says "copied
from fixtures/moog/" though wave 6 had no mf-105s fixture there — sloppy
note, but the fixture content itself is genuine (tip button present, sha256
matches).

### Ask 1 — mf-105s gap

- `2026-09-25-chip-moog-softwareupdate-ready.md` — **ACCEPTED.** Gap closed:
  fixture + meta committed, "All Formats v1.3.0" verified in the HTML. Full
  chip pack with negative-control discipline intact.

### Ask 2 — chip-ready packs (7)

- `2026-09-25-chip-sonnox-rn-freeze-ready.md` — **ACCEPTED.** Docs-index
  discovery preferred over hardcoded URLs — the right long-term posture.
- `2026-09-25-chip-ni-electron-updater-yml-ready.md` — **ACCEPTED.**
  Three-arch YAML with split-recording rule.
- `2026-09-25-chip-waves-downloads-canary-ready.md` — **ACCEPTED.**
  Mandatory stub detector + DMG Last-Modified fallback; cheaper than
  Playwright.
- `2026-09-25-chip-ua-connect-dmg-ready.md` — **ACCEPTED.**
  Brew-discovery-first, never-invent-basename discipline.
- `2026-09-25-chip-ik-pm-cdn-referer-ready.md` — **ACCEPTED.** The
  Referer-403 pair as golden/negative is a clean test fixture.
- `2026-09-25-chip-spitfire-cloudfront-path-ready.md` — **ACCEPTED.**
  Rediscover-via-brew on 403 handles signed-URL expiry.

### Ask 3 — tier-2 top-5 scout

- `2026-09-25-tier2-top5-wiring-ready-scout.md` — **ACCEPTED.** Strongest
  file this wave: five fixture-backed oracle specs with honest yield
  estimates, Mac/Win split holds, edition-alias traps. Wiring-ready if tier
  2 ever opens; scout-only honored, no catalog proposals.

### Ask 4 — identity sweep

- `2026-09-25-identity-reclass-candidates-tier1-deep.md` — **ACCEPTED.**
  18 high-confidence bundle reclass candidates with public-URL evidence,
  plus a 17-item allowlist of name-token false positives — the allowlist is
  the mature touch that prevents regex overreach. Also documents live
  suite-stamp contamination (Softube 2.6.41 / UAD 12.0 / Waves 15.x on suite
  rows). Verify each candidate against the live DB + product page before
  reclass.

### Ask 5 — hub creative pass 2

- `2026-09-25-hub-walled-creative-pass2-deep.md` — **ACCEPTED.** Genuine
  unlock: KORG Collection news-title version feed (TRINITY 1.1.0
  body-confirmed in fixture). Honest negatives table (Arturia placeholder,
  Roland empty shells, IK 403s, IL dead API, Lexicon closed neighbors).
  Bar honored: new evidence or don't file.

### Meta

- `2026-09-25-muse-wave7-inbox-index-and-ship-order.md` — **ACCEPTED.**
  Map + ask-outcome table + non-goals; cites round-3 steering.

### Wave-7 verification queue (first-hand re-fetch before any catalog use)

1. Moog mf-105s 1.3.0 (fixture-backed, still operator re-fetch) + all 9 slugs.
2. KORG news feed → TRINITY 1.1.0; product→plugin_id join is operator work.
3. Chip packs: Sonnox RN tips, NI YAML 3.26.0, Waves V17.0.4, UA Connect
   1.10.0/3844, IK PM 1.1.15, Spitfire 3.4.17.
4. Tier-2 spot-checks (scout only): Wave Arts dotted versions (do not
   semver-normalize), Denise parentheticals, Madrona Mac/Win splits.
5. All 18 identity reclass candidates — verify each before reclass; apply
   the allowlist.

---

## Round 4 — wave 8 (2026-09-25)

Reviewed 2026-09-25. **ACCEPTED: 9 · REJECTED: 0 · DEFERRED: 0.**

All six round-4 asks graded DONE. It rose to the harder bar: no padding,
and it reported failure honestly twice — v1 broke on all three stress
cases, and the KORG-class hunt found zero unlocks. Nits are cosmetic
(index says 179 candidates, file says 178; classifier P/R honestly caveated
as derivation set, not holdout).

### Ask 1 — contamination hunt

- `2026-09-25-contamination-cohort-stamp-detection-deep.md` — **ACCEPTED.**
  The P0 of the round: 6 signature shapes (S-A…S-F), design SQL with an
  honest-shared-train playbook join, 178 unique high-confidence
  clear/reclass candidate IDs with evidence, and an explicit false-positive
  guard table (Melda 17.10.01, Soundtoys 5.5.5, Goodhertz, Kilohearts,
  Waves-plugin uniform build). Debatable UA DSP 134×12.0 case held for
  policy review, not auto-cleared — the right restraint.

### Ask 2 — retraction stress-test

- `2026-09-25-vendor-retraction-protocol-v2-deep.md` — **ACCEPTED.**
  Strongest file this wave. Broke v1 fairly on all three incidents —
  D16 (raise-time crime the decrease-shaped tree can't see), Lindell (URL
  poison, out of v1 scope), Waves V17 (mass undo laundering as
  retractions) — and shipped v2 with classes F/G/H and a 13-trigger
  registry with detect/threshold/action/abort. Operational, not
  philosophical. Wire triggers T1/T2, T9, T12 into the engine.

### Ask 3 — chip falsifiers

- `2026-09-25-chip-falsification-death-conditions-deep.md` — **ACCEPTED.**
  Death-condition matrix for all 8 accepted chips + 2 related oracles with
  a KILL/PARK/DEMOTE/RETRACT-WATCH severity ladder and global MUST-NOT
  rules. Formulaic by design — precisely what was asked.

### Ask 4 — KORG-class hunt

- `2026-09-25-hub-newsroom-korg-class-leaks-deep.md` — **ACCEPTED.**
  Zero unlocks reported honestly; Slate Zendesk RN titles found and
  falsified as a primary oracle (titles lag catalog tips). Evidence of
  absence with fixtures — exactly the discipline requested.

### Ask 5 — identity v2 + second sources

- `2026-09-25-identity-classifier-v2-and-second-sources-deep.md` —
  **ACCEPTED.** Rule classifier P/R honestly caveated; allow-guards
  evaluated first so the allowlist is never eaten. 18/18 second sources
  secured — real verification-shortening work. Ship allow-guards before any
  regex bulk reclass.

### Ask 6 — open exploration (all three cleared the bar)

- `2026-09-25-accepted-tip-hostile-source-gate-deep.md` — **ACCEPTED.**
  Genuine data-integrity catch: Serum 2 raised KVR@60 → vstorrent.org@75,
  a warez host promoting to amber; NI Action Strikes sole tip also
  vstorrent. Deny-host gate spec is mechanical and shippable.
  **Operator action: clear/demote both tips; wire the deny-host gate.**
- `2026-09-25-successor-url-stamp-contamination-deep.md` — **ACCEPTED.**
  Live PA gen-1 rows @88 citing `-v3` URLs, with a pure-SQL fingerprint —
  a pairwise identity class the cohort detectors can't see. Clear
  predecessor tips after identity pass.
- `2026-09-25-mac-win-silent-higher-detection-deep.md` — **ACCEPTED.**
  Live green-tip wrongness: oeksound bloom 1.1.3 @92 where the evidence
  itself says 1.1.3 is a Windows GUI fix and Mac is 1.1.2 — factually wrong
  for Mac users. Detection recipe + documented negative controls.

### Meta

- `2026-09-25-muse-wave8-inbox-index-and-ship-order.md` — **ACCEPTED.**
  Map + ask-outcome table; fixture-dir nit honored (one canonical dir per
  vendor).

### Wave-8 verification / action queue (first-hand operator work)

1. **Integrity (advisory):** clear/demote vstorrent tips on
   `xfer-records--serum-2` and `native-instruments--action-strikes`; wire
   deny-host gate.
2. **oeksound--bloom:** verify Mac/Win split; Mac-current 1.1.2, Win 1.1.3
   per evidence.
3. **Ask 1 P0:** verify and clear/reclass the 178 candidate IDs (Softube
   trains, Waves bundles/series, UA collections); Softube 5-pack + Waves
   Signature Series → `bundle`; Softube Central → `hub_app`.
4. **Policy:** UA DSP 134×12.0 — suite_train export vs clear.
5. **Successor-URL:** PA bx-boom/bx-refinement predecessors @88; clear
   predecessor tip after identity pass.
6. **Engine:** wire retraction v2 triggers T1/T2, T9, T12.
