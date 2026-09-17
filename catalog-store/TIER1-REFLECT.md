# TIER-1 REFLECT LOG — research → reflect → refine → dig (repeat)

Standing order (Luke, 2026-09-16): every chip ends with a structured
reflection; refinements are applied to TIER1-ASSAULT.md in the same chip.
Never run the same failed path twice without a new angle.

## 2026-09-16 — directive issued (~09:20 PDT), engine rewired
- True tier-1 remaining: **1,565 plugins**. Top gaps: NI 397, 8Dio 282,
  Spitfire 184, Waves 173, UVI 162, IK 148, UA 70, Orchestral Tools 59,
  Steinberg 43, EastWest 24, Heavyocity 23.
- Observation: the biggest wins aren't yellows — they're NEVER-RESEARCHED
  piles (NI 397 remaining vs only 31 yellows; 8Dio 282). First-pass research
  on untouched tier-1 catalogs outranks re-assaulting known yellows.
- Observation: Waves (237 yellows, 1.2% green) and IK (133 yellows) are the
  biggest yellow piles — hub-walled but with public release-notes pages.
- Refinement applied: research cron body → tier-1-only scope, quotas
  reallocated (150 yellow / 60 boundary-assault / 60 green / 30 compat),
  reflect loop made mandatory, TIER1-ASSAULT.md created as the living playbook.
- Highest-leverage dig for next chips: (1) NI flagship first-pass
  (Kontakt/Massive X/Guitar Rig/Battery) via public release notes + KVR;
  (2) Waves yellow pile via public release notes + reseller version-in-title;
  (3) IK Product Manager page re-fetch recipe extended to all IK products.

## 2026-09-16 — first TIER-1 ASSAULT chip (~09:22 PDT), 100 claims, 3 workers
**Result:** 60 observed / 40 skipped / 0 open. Tier-1 remaining 2,581 → 2,539 (−42).
Waves yellow pile cracked (−39 yellows catalog-wide): KVR per-product builds
(17.1.42.50) + Waves official V17 installer page as generation corroboration.
Output cracked open: Help Center release-notes articles carry exact versions
(Arcade 2.16.1, Co-Producer 1.6.1 @95). NI: 12 raises, mostly Players +
discontinued finals; 28 skips — NI's remaining pile is dominated by content
packs / Leap Expansions / Expansions with NO discrete public version (NI pages
expose only host requirements). That skip class is terminal; stop re-digging it.

**Methods tried — what worked (exact paths):**
- Output Help Center: `support.output.com/en/articles/16102145-arcade-release-notes`
  and `.../16112647-co-producer-release-notes` — first H2 newest-first
  `## <Product> X.Y.Z *(Released ...)*`. Weekly re-fetch. (NEW playbook path)
- Waves: `waves.com/downloads/latest-offline-installer` ("Includes: All Waves
  plugins V17", updated 2026-06-23) names every product in the V17 installer —
  per-product generation corroboration; KVR `/product/<slug>-by-waves` and
  `/marketplace/<slug>-by-waves` give the uniform build 17.1.42.50. (NEW)
- KVR disclaimer parsing rule: only trust "Product, Version, X" when the page
  also carries "The version numbers are for <Exact Product>" — host (Kontakt
  Player 8.0.0) vs product versions are otherwise confusable. (NEW rule)
- NI discontinued-activation list parenthetical bounds: "Akoustik Piano
  (before 1.1.0)" bounds the final version without a changelog. (NEW)
- Co-developer corroboration: Sonuscore's shop page confirmed Action
  Strings 2 1.2.0 @82 — co-developers are a strong second source for NI libs.

**What failed and why:**
- Output appcast/Sparkle/updates.xml searches: nothing — updates ship through
  the signed-in Hub only. Output FX collection has NO release-notes article;
  FX versions are not published by Output at all (KVR is the only public
  signal, sub-70, treat as floor).
- Waves: 5 products (Abbey Road Saturator, CLA Effects/Epic/MixHub/Unplugged)
  have no per-product numeric source anywhere — generation-consistent only.
  CLA Classic Compressors: bundle ambiguity, unresolvable without inference.
- NI: browser_open failed terminally for the worker; KVR snippets via search
  still worked. NI product pages for libraries expose host requirements only.
- 20+ NI skips are a permanent class (Leap/Expansions/MPC packs): never run
  the same dig again without a new angle.

**Integrity:** coordinator gate caught a predecessor-version stamp (B4 1.13
onto catalog entry "B4 II") — rejected, skipped. Zero contamination written.

**Refinements applied to TIER1-ASSAULT.md:** Output + Waves + NI playbooks
rewritten with exact re-fetch recipes; KVR disclaimer rule added to the
method catalog; NI skip-class terminal ruling added.

**Highest-leverage next dig:** (1) Slate Digital + EastWest creative assault
(untouched this chip); (2) Waves remaining ~197 yellows via the same
KVR+installer recipe — it's now a production line; (3) NI flagship second
pass: 8Dio/Spitfire/UVI are bigger untouched piles, but NI's remaining ~383
are mostly the terminal skip class — re-triage NI remaining by product type
(content pack vs real instrument) before spending more chips there.

## 2026-09-16 — first assault chip post-mortem (09:22–09:29 PDT)
- Chip reported "tier-1 remaining 2,581 → 2,539 (−42)" — WRONG METRIC. It used
  the query WITHOUT the research_attempts exclusion. True stop-query numbers:
  1,565 → 1,544 (−21). The cron body already carries the correct query; the
  coordinator measured with the wrong one. Correction logged; future chips must
  use the body's exact query.
- DEDUP BREACH: 79 of the 100 claimed plugins already had research_attempts
  rows >= surge_start from earlier chips. Target selection violated the
  MUST-exclude contract — only 21 claims were genuinely new queue work. That
  is why remaining moved only −21 despite 100 finalized claims.
- Nuance: the breach still produced 60 real raises (Waves 39 → V17 17.1.42.50,
  Output 9 incl. Arcade 2.16.1 @95 via the new Help Center path, NI 12) and 5
  new playbook paths. Some re-digs were legitimate new-angle cracks of
  previously-skipped plugins (Output Help Center). But unjustified re-digs
  redo settled triage and stall the stop-query — the exact failure the ledger
  exists to prevent.
- REFINEMENT (applied to cron body same day): deliberate re-digs of
  already-attempted plugins are allowed ONLY with a logged new-angle
  justification in this file; otherwise the attempted_at >= surge_start
  exclusion is absolute. Coordinators must verify the exclusion with the
  exact query before claiming, not by assumption.
- Highest-leverage next digs: Slate Digital + EastWest creative assault
  (untouched); Waves remaining ~200 yellows via the V17 production-line
  recipe; NI re-triage by product type (content-pack skip class is terminal).

## 2026-09-16 — tier-1 assault chip `tier1-assault-2026-09-16-1018` post-mortem (Coordinator Y, 210 claims, ~10:18–10:55 PDT)
- Stop query: 1,544 → 1,397 (−147; includes Coordinator X's ~59 finalized claims).
- YIELD: 25 promoted / 78 observed / 107 skipped. Writes: 11 NI @92 (FM8 1.4.6, Freak 1.3.7, Raum 1.3.7, RC 48 1.4.11, Replika 1.6.7, Solid Bus Comp/Dynamics/EQ 1.4.11, Supercharger GT 1.4.11, Transient Master 1.4.11, VC 160 1.4.11) via the NEW NI demo-page manifest path; 10 OT @90 via the NEW OT "Current Versions" helpdesk path; 2 Heavyocity @60; 2 UVI @88 (Drum Replacer 1.1 via MusicPlayers verbatim UVI release, Glass Orchestra 1.0 via official S3 manual header).
- The UVI/NI/OT paths share one pattern worth naming: **manufacturer pages that embed version fields for a different purpose** (demo-download manifests, support-ledger tables, PDF manual headers) — they aren't changelogs and nobody watches them, so they survive redesigns. Future digs should search vendor domains for these field types, not for release notes.
- INTEGRITY GATE: 3 catches this chip. (1) Replika XT 1.3.1 propose REJECTED — worker's evidence was a stale localized snippet; NI's current EN demo page says 1.3.7 = existing current; writing it would have REGRESSED the catalog. (2) 8Dio Century Ensemble Brass bundle 2.1 REJECTED — VI-Control entry described the Ensemble component (2.1) while the Lite component stayed 2.0; stamping a component version onto a bundle violates suite→component. (3) OT berlin-woodwinds-additional-instruments 2.0 → CORRECTED to 2.1 — worker mapped the SINE "Berlin Woodwinds Additions" row onto the Kontakt-edition claim; SINE vs Kontakt editions are separate catalog claims. Every catch came from checking identity BEFORE version — the gate order matters.
- Waves disappointment, honestly logged: worker's 37 proposals were all exact matches of existing @60 currents; the @65–90 confidence raises rested on the official V17 convention (installer "All Waves plugins V17" build 17.1.42.50 + 2026-06-23 release notes) but the worker's report contained NO official URL and the coordinator could not independently locate the official page — only third-party V17 announcements (Sonic State, ProSoundWeb) corroborating. No raises written. **Finding the official waves.com V17 release-notes/installer URL is the single highest-leverage unlock for ~130 remaining Waves yellows** — it would raise ~300 plugins to ~65–90 in one pass.
- Zero-raise tracks (8Dio 0/40, Spitfire 0/30, IK 0/25, Waves 0/40, Steinberg 0/5) are legitimate outcomes, not misses: terminal skip classes (soundsets, bundles, legacy pages) and exact-match currents.
- New paths logged (refinements applied to TIER1-ASSAULT.md): UVI S3 manual-header recipe; 8Dio VI-Control update-ledger + mixed-version bundle guard; Spitfire/KVR em-dash → `---` slug rule; NI demo-manifest recipe + localized-page retention caveat; OT helpdesk ledger + edition-identity guard; Heavyocity KVR version probe + attribution-note rule; Steinberg legacy fallback; IK demodownload DEMOTED (JS-rendered, no per-product versions this chip).
- Next digs: (1) Waves V17 official URL hunt; (2) NI remaining 361 — triage by product type first (content-pack skip class is terminal); (3) 8Dio 242 — VI-Control ledger covers more than the 40 attempted; (4) UVI 132 — S3 manual-header recipe scales; (5) Slate Digital creative assault still untouched.

## 2026-09-16 — Coordinator G re-dig justifications (chip tier1-assault-2026-09-16-1318)
- Arturia x6 (bus-peak, cmi-v, cp-70-v, cz-v, chorus-dimension-d, chorus-jun-6) and UA DSP x8 (uad-ampex-atr-102, uad-ams-dmx-15-80-s, uad-ams-neve-dfc, uad-ams-rmx16, uad-antares-auto-tune-realtime-advanced, uad-api-2500, uad-api-preamp, uad-avalon-vt-737) were claimed last chip (tier1-assault-2026-09-16-1018) and finalized SKIPPED — but those skips were caused by an arturia.com 429 event that disabled browser.open mid-chip (infra failure), NOT content triage. The 6 Arturia pages were never content-resolved (manual-only renders / unfetched / slug-alias unverified); the official UA version-history URL was located but never fetched. New angles this chip: (1) paced arturia.com fetches after cooldown, requiring the Software Version block before any read; (2) first-ever fetch of the located official UA version-history article (help.uaudio.com/hc/en-us/articles/215270403-UAD-Version-History-Release-Notes). This is not running the same failed path twice — the official-page path never completed.

## 2026-09-16 — tier-1 assault chip `tier1-assault-2026-09-16-1318` post-mortem (Coordinator Y, 210 claims, ~13:20–13:45 PDT)
- Stop query: 1,334 → 1,124 (−210; another track finalized 77 rows on the same chip_id in parallel — no collisions with my 210 after the owner's LIKE-pattern repair).
- YIELD: 55 promoted / 15 observed / 140 skipped. All 70 raises written via accept_observation.py --set-current, verified_by=research-engine-10x; all 70 currents re-verified to point at the intended accepted observation.
- WORKED (each with the exact path, now in TIER1-ASSAULT.md): NI fileadmin manual recipe (20 raises, all from official PDFs or exact-attribution KVR pages); UVI two-domain manual search S3+cdn.uvi.net (12 of 13 raises; earlier 429 was transient); UA Software Archives article 215267203 as the bundle-version source (12 raises @90); OT helpdesk ledger (8 @90, coordinator-verified); 8dio.com "New in 2.0" marketing-copy corroboration; IK KVR @60 with the hub-stamp detector; Heavyocity KVR version-probe discriminator; Spitfire VI-Control version/fix-log search + KVR attribution rule.
- FAILED / gated: 8Dio French Horns/Trombones/Trumpets 2.1 (suite→component inference); NI Premier Upright (identity conflation); 5x IK 4.0.9 hub-stamps; Spitfire BBCSO plugin 1.12.1 → library SKU stamps; 12 UADx native (no public versions — invented stamp); OT Bösendorfer Staccatos (SINE 2.0 vs Kontakt 1.1, identical spelling — edition unresolvable); EW StormDrum 2 (bundle→product stamp); Spitfire BT Phobos (dead-image forum thread). Every rejection came from identity-before-version.
- New principle: **manufacturer pages that embed version fields for a different purpose** (demo manifests, support ledgers, PDF manual headers, news "Sound Library Update" posts) out-survive redesigns — search vendor domains for field types, not changelogs.
- New principle: **ledger/playbook decay is a first-class fact** — 8Dio ledger frozen May 2022, OT ledger going date-only post-2024. A working path is not a permanent path; freshness re-checks must re-verify the PATH, and every raise gets a staleness caveat in its confidence reason.
- Integrity: LIKE-pattern UPDATE incident (owner's UA track flipped 13 of Y's claims) — repaired before my finalize; I finalized by exact plugin_id lists only. accept_observation.py takes --version, not --observed-version (no data corrupted).
- Highest-leverage next digs: (1) Waves production line NOW UNLOCKED (V17 URLs verified in hand 2026-09-16 — official installer list + release-notes + provenance split all recorded) — run installer-membership + KVR-build across the remaining 133 Waves yellows; (2) 8Dio "New in 2.0" branding sweep across Century pages + newer VI-Control threads; (3) UVI two-domain manual re-run on remaining yellows; (4) NI Icon Bass manual (fileadmin/.../manuals/Icon_Bass/); (5) IK "Sound Library Update" news crawl; (6) OT fresher source hunt.
- Flags to Luke: OT Bösendorfer Staccatos edition ambiguity; Spitfire ARO 19 section SKUs (track shared plugin version as separate identity, or leave versionless); NI Premier Upright possible catalog identity conflation.

## 2026-09-16 — chip `tier1-assault-2026-09-16-1318` close (owner, ~13:18–13:56 PDT)
- Stop query (body's exact): **1,334 → 1,124 (−210)**. Breakdown now: NI 326, 8Dio 197, Waves 133, Spitfire 119, UVI 107, IK 98, UA 45, OT 39, Steinberg 38, Heavyocity 11, EW 11. Surge age ~1.7d; hard expiry 2026-09-21 ~20:30 PT. Not complete.
- Chip totals: **287 claims, 0 open — 55 promoted / 72 observed / 160 skipped.** Y: 210 (55 promoted incl. NI 20, UVI 13, UA 12 @90, OT 8 @90, 8Dio 6, IK 6, Spitfire 3, Heavyocity 2; 15 observed @60; 140 skipped). G: 77 (57 observed / 20 skipped / 0 raises — freshness re-checks confirmed currents, incl. Softube 2.6.41 hold vs 2.6.42 article-scope rule, Eventide H910 conflict kept unraised).
- **Breakthrough:** Waves V17 gate UNLOCKED — official installer list + release-notes URLs verified in hand this chip (gate note already recorded in TIER1-ASSAULT.md). The 133 Waves yellows are now a production line (installer-membership + KVR-build). This was last chip's single highest-leverage dig and it delivered.
- **Ledger incident (owner error, repaired):** the parallel G track's broad `LIKE 'universal-audio--uad-%'` finalize UPDATE flipped 13 of Y's claims to skipped. G detected it, restored all 13 to claimed/note=NULL before Y finalized, and Y finalized by exact plugin_id lists. Zero data loss; independently verified: 287 claims = 210 + 77 with exact attribution. **Rule now codified in TIER1-ASSAULT.md:** never finalize claims by LIKE-pattern UPDATE — exact plugin_id lists only, verify counts before/after every batch write. Parallel coordinators on one chip_id are fine ONLY under this rule.
- WORKED beyond the paths: the version-fields-for-other-purposes pattern keeps delivering (NI fileadmin PDFs, UVI two-domain manual headers, UA archives article) — these pages survive redesigns because nobody watches them. Ledger decay is now a first-class fact: 8Dio ledger frozen May 2022, OT ledger date-only post-2024, UA version-history article degraded oldest-first — freshness re-checks must re-verify the PATH, and staleness caveats go in confidence reasons.
- FAILED: sonible is version-dead (blog guides no/stale changelogs, manuals x.x.x placeholders — help.sonible.com release notes not located, open question); Klanghelm/TAL re-verify blocked by JS-gating (kept per unverified≠disproven); 12 UADx native invented-stamp proposals rejected (UADx has no public versions).
- Refinements applied to TIER1-ASSAULT.md this chip (verified present): target board → post-chip numbers + Waves unlocked; Waves gate note resolved; UA bundle-version source = archives article 215267203 + UADx no-public-versions guard; NI fileadmin-manual recipe; UVI two-domain (S3 + cdn.uvi.net) recipe; IK hub-stamp detector + "Sound Library Update" news lead; 8Dio "New in 2.0" branding lead; Softube article-URL construction + mandatory scope check; u-he `dl.u-he.com/releases/` > public archive; Voxengo guide-PDF source; Eventide installer-row-ahead-of-notes pattern; sonible dead ends; changelog_url zero-trust rule; ledger safety rule.
- Flags for Luke (structural, not critical): OT Bösendorfer Staccatos edition ambiguity (SINE 2.0 vs Kontakt 1.1, identical spelling); Spitfire ARO 19 section SKUs app-gated (track shared plugin version as separate identity or leave versionless); NI Premier Upright possible catalog identity conflation. In notes; thread not pinged.
- Highest-leverage dig for next chip: **run the unlocked Waves V17 production line across the 133 Waves yellows** (installer-membership + KVR per-product build) — this alone can clear ~12% of the remaining tier-1 backlog in one pass.

## Chip tier1-assault-2026-09-16-1618 — Coordinator M scope (30 mixed-vendor: 11 EW / 11 Heavyocity / 8 IK)
- Discovery methods: KVR version-probe discriminator (snippet "Product, Version, N" + attribution line), live KVR page re-fetch by coordinator, EastWest official updates page (manufacturer-negative), App Store presence check (iTunes Search API), Wayback CDX (blocked — Archive offline).
- What WORKED: KVR probe + attribution line again delivered 6 Heavyocity raises @60 (coordinator live re-verify of all 6 confirmed headers/attribution); EastWest updates-page fetch is decisive manufacturer-negative evidence for the whole bundle/legacy set (engines-only versioning).
- What FAILED: (a) T-RackS 6 Max/Pro KVR bundle pages render NO version header across 4 fetches — edition-identity strict confirmation impossible; held 6.3.2 via family unanimity (not a raise candidate). New angle next time: IK Product Manager manifest read-only GET for the 6.3.2 echo, or IK news changelog. (b) Wayback offline — retry the EWQLSO-era archived update pages later. (c) Vocalise 1.1.0 warez NKS-integration claim is plausible but unusable; trusted corroboration path: NI NKS partner listing or Heavyocity portal changelog.
- Playbook refinements applied to TIER1-ASSAULT.md: (Heavyocity) add Symphonic Destruction Redux as separate successor identity — never stamp between it and Symphonic Destruction; VAST Impulse Engine noted as native plugin (not soundset) with unpublished version — future maintenance via Wayback on heavyocity.com/products/vast or trusted press post-launch-update mention. (EastWest) soundsonline.com/support/updates logged as the decisive engines-only negative source; Synth Super Bundle KVR 1.0 = initial-release bookkeeping, not a maintained version. (IK) T-RackS 6 Max/Pro KVR pages confirmed version-header-less — strict edition-identity check fails; hold via family unanimity only.
- Highest-leverage dig for next chip: Vocalise 1.1.0 corroboration (NKS partner listing / Heavyocity changelog) — would be the first manufacturer-corroborated Heavyocity raise above @60; and the IK PM manifest probe for T-RackS 6 Max/Pro to close the edition-identity gap.

## 2026-09-16 — tier-1 assault chip `tier1-assault-2026-09-16-2218` (owner, ~22:18–23:00 PDT) — TIER1_COMPLETE
**Result:** 419 claims finalized, 0 open — **56 promoted / 129 observed / 234 skipped.**
Stop query (body's exact): **350 → 0. "Thoroughly worked" as defined: every tier-1 plugin (4,385 total) now either has an accepted observation with confidence >= 70 (2,004) or a research_attempts row with attempted_at >= surge_start (the rest).** Not a hard-expiry path — the backlog is genuinely worked. Per the body: owner reports TIER1_COMPLETE prominently; schedule revert is the owner's (main-agent) action, not done here.
- Coordinator Y (tracks 1+2, 350/350 finalized): 55 promoted (UVI 34, Steinberg 17, 8Dio 3, Spitfire 1), 77 observed (IK 67, Spitfire 6, Steinberg 4), 218 skipped (all principled). Coordinator verified every raise against live pages; integrity_check ok.
- Coordinator G (tracks 3+4, 68/68 finalized): 1 promoted (D16 phoscyon-2), 52 observed, 16 skipped. Track 3 freshness: 0 raises — every CONFIRMED version matched stored exactly. Compat: D16 unknown→native (helpdesk.d16.pl article 170); TAL stays native (re-verified); TDL×3, Sonnox×3, Cytomic×2 stay unknown (no citable manufacturer-owned statement).

**What WORKED (exact paths, applied to TIER1-ASSAULT.md):**
- UVI windfall (34 promotions): NEW UVISC CDN manual family (`cdn.uvi.net/UVISC<nn>_<slug>/manuals/<date>/...` — 5 raises incl. Shade 1.2) + UVIFCX Falcon-expansion manuals (`uvi.s3.amazonaws.com/FCX<nn>-<Slug>/<slug>_manual.pdf` and cdn.uvi.net/UVIFCX<nn>_<slug>/manuals/ — 6 raises). All PDF headers personally verified by coordinator via pdftotext. Strongest granular: UVX-3P 1.2.1, Vector Pro 1.4, Soul Bass 1.5, Synthox 1.5, UltraMini 1.5, Sparkverb 1.5.
- Steinberg 17 promotions from official PDFs/helpcenter tables (+ 5 careful @60 yellows, coordinator re-verified).
- IK fully covered: all 68 researched, zero raises — currents held (T-RackS 6.3.2, TONEX 1.12.1 pinned against the 2.0 beta that would have overwritten it).
- D16 compat via helpdesk article; KVR "Product, Version" fields as fresh secondary source for version-hiding vendors (UVI, PSP, Sugar Bytes, Sonnox, Eventide H949); threebodytech.com on-page installer version strings (new vendor path).
- Freshness confirmation is a real outcome: 52 observed = currents verified live against re-fetch recipes.

**What FAILED / gated (why + new angle):**
- Spitfire: ~60 app-gated library SKUs structurally blocked — no public per-library version channel exists (only one genuine raise: Ronroco 2.0). New angle: NONE public — this is a maintenance-track class, not a research problem. Same for UVI Portal-only soundbanks, Steinberg Download Assistant libraries, DAW-bundled components — Y recommends these four classes be scheduled as explicit maintenance tracks rather than re-probed publicly.
- support.uvi.net terminally unreachable this chip — the official soundbank-skip citation lacks the verbatim sentence; retry via search-cache or fresh session.
- 8Dio 3/78 raises only — the VI-Control ledger is frozen May 2022 and "New in 2.0" branding corroboration has exhausted the easy Century surface. New angle: product-level version strings in 8Dio Download Manager API? (read-only probe only), or per-product Wayback snapshots of download pages.
- Kirchhoff-EQ 1.7.4→1.7.5 raise PROPOSED but NOT written — coordinator could not independently verify (browser_open tool failure); gate held. PRIORITY re-check next chip.
- MiniFreak V: official free 5.0 update shipped ~2026-09-15/16 (Arturia YouTube/musictech/gearnews) but NO official plugin build number — no raise; PRIORITY re-check for the build number.
- Eventide installer rows now JS-hidden (H910 conflict unresolved); PSP version pages decayed; Spitfire legacy library pages decayed; Plugin Alliance vendor fetch automation-blocked. Decay logged; freshness re-checks must keep verifying path health.
- browser_open failed terminally early in G's turn (tool-side); work continued search-only. No 429s or blocks anywhere.

**Gate calls:** Steinberg LM-4 1.1 rejected at the KVR attribution gate; IK TONEX 2.0 beta contamination avoided (current pinned 1.12.1); Spitfire plugin→library stamps held (ARO sections untouched); Y's self-caught Spitfire plugin-ID typo matched zero claims, corrected before close.

**Refinements applied to TIER1-ASSAULT.md this chip:** (1) target board → TIER1_COMPLETE; (2) UVI playbook: UVISC CDN + UVIFCX Falcon-expansion manual recipes as permanent re-fetch routes; support.uvi.net unreachable caveat; (3) future-maintenance: four structurally-blocked classes moved to explicit maintenance tracks (public re-probes banned); (4) decayed paths flagged (Eventide installer rows, PSP version pages, Spitfire legacy library pages, PA vendor fetch); (5) KVR "Product, Version" secondary-source rule + threebodytech installer-string path; (6) priority re-check list (Kirchhoff-EQ 1.7.5, MiniFreak V 5.0 build number, NI Native Access 3.26.0 vs official).

**Integrity:** 0 orphaned claims; both coordinators finalized by exact plugin_id lists only; Y + G reconciled shared chip_id without touching each other's rows. integrity_check ok. Note for the record: the previous chip (1918) died mid-flight with 138 orphaned claims (zero research survived); owner deleted them per the 1618 precedent so this chip re-claimed them cleanly.

**Highest-leverage next dig:** assault work is DONE — the maintenance regime starts: (a) execute the four structurally-blocked classes as scheduled maintenance tracks; (b) priority re-checks Kirchhoff-EQ 1.7.5 + MiniFreak V 5.0; (c) green freshness continues on playbook recipes; (d) Luke decides when/if tier 2+ reopens.
