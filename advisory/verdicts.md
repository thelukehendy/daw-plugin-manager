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
