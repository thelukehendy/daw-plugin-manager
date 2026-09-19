# TIER-1 ASSAULT — creative version discovery for hub-walled vendors

**Standing order (Luke, 2026-09-16):** every research chip works ONLY tier 1 —
the household names ~80–95% of app users have installed. Tier 2+ is paused.
"If we can't improve tier 1, what's the point of this project?"

**Doctrine:** go hard, frequent, unrelenting. When a vendor walls versions
behind an account portal, do NOT mark it settled — dig: alternate methods,
forums, feeds, leaks, archives. And never settle for one-time discovery:
every working path must be recorded here as an exact re-fetch recipe so
future maintenance is re-fetch/parse/diff, not rediscovery.

**Loop (mandatory, every chip):** research → reflect → refine → dig deeper →
reflect → refine. Log each cycle in `TIER1-REFLECT.md`; apply refinements here
in the same chip. Never run the same failed path twice without a new angle.

## Target board — TIER1_COMPLETE (2026-09-16 ~23:00 PDT; chip `tier1-assault-2026-09-16-2218` closed 350 → 0, −350)

**The tier-1 assault backlog is thoroughly worked.** Every tier-1 plugin (4,385
total) now either has an accepted observation with confidence >= 70 (2,004)
or a research_attempts row with attempted_at >= surge_start (2026-09-15
03:30:53 UTC). Stop query (body's exact) = 0. The engine's tier-1 posture is
now **maintenance**: green freshness checks on playbook re-fetch recipes, the
four structurally-blocked classes below as explicit maintenance tracks, and
the priority re-check list. Tier 2+ research remains PAUSED until Luke says
otherwise. Public re-probes of structurally-blocked classes are banned —
they can't move them.

Structurally-blocked classes (maintenance tracks, not research targets):
- Spitfire app-gated library SKUs (~60) — no public per-library version channel exists
- UVI Portal-only soundbanks — versions visible only inside UVI Workstation/Falcon
- Steinberg Download Assistant libraries — public pages carry no per-library versions
- DAW-bundled components (Cubase/Logic bundled content) — versioned with the DAW, not the plugin

Priority re-checks (next chip): Kirchhoff-EQ 1.7.4→1.7.5 (proposed but
unwritten — needs independent verification), MiniFreak V 5.0 official free
update (shipped ~2026-09-15/16, no official plugin build number yet),
NI Native Access 3.26.0 vs official page, support.uvi.net retry via
search-cache or fresh session (was terminally unreachable 2026-09-16).

Historical board (last non-zero state, 1318): NI 326, 8Dio 197, Waves 133,
Spitfire 119, UVI 107, IK 98, UA 45, OT 39, Steinberg 38, Heavyocity 11,
EastWest 11 — all worked to zero by the 1918/2218 chips.

## Creative method catalog (vendor-agnostic — try in this order)

1. **Sparkle / appcast update feeds.** Many desktop hub apps and plugins ship
   with a Sparkle-style XML feed (`updates.xml`, `appcast.xml`, SUFeedURL).
   These are public XML with exact version numbers + dates. Search the vendor
   domain for `appcast`, `sparkle`, `updates.xml`, `feed`.
2. **Hub-app update manifests (pre-login).** Hub apps (Native Access, ASC,
   Waves Central…) usually fetch a product/version manifest BEFORE login —
   often unauthenticated JSON on a CDN or API host. Find the endpoint via the
   vendor's public support docs, JS bundles on their site, or documented
   community reverse-engineering. Read-only GET of a public manifest is fair
   game; never authenticate, never POST.
3. **KVR Audio.** Product pages carry version + date + changelog; the KVR
   forums have official vendor release threads. `kvraudio.com/product/...`
   KVR DISCLAIMER RULE (mandatory): on Kontakt-instrument pages only trust
   "Product, Version, X" when the page also carries "The version numbers are
   for <Exact Product>" — otherwise you may be reading the HOST's version
   (e.g. Kontakt Player 8.0.0) instead of the instrument's. Ignore version
   numbers under Soundware/related-product sections and second version fields.
4. **Wayback Machine.** Snapshots of `/downloads`, `/release-notes`,
   `/support/latest-versions`, legacy version-history pages. Query the CDX API
   for `vendor.com/*download*`, `*release*`, `*changelog*`, `*version*`.
5. **Reseller listings.** PluginBoutique, Sweetwater, Thomann, JRRShop put the
   current version in the title/specs ("Version 2.5") or "new in vX" copy, and
   update listings on release day.
6. **Installer / CDN filename leaks.** Predictable CDN hosts (`cdn.vendor.com`,
   S3 buckets, `downloads.vendor.com`) with versioned filenames. Search
   GitHub / forums / Google for `site:cdn.vendor.com` or the installer naming
   pattern; a filename IS version evidence when corroborated.
7. **Vendor support KB "latest version" articles.** Many vendors publish
   public "What is the latest version of X?" KB entries even when downloads
   are walled.
8. **Press release posts.** Rekkerd, Bedroom Producers Blog, Synth Anatomy,
   Gearnews, MusicRadar, Ask.Audio — release posts always state the version
   number and date. Search `<product> <vendor> "version" site:rekkerd.org` etc.
9. **Forum archaeology.** VI-Control, Gearspace, KVR forums, r/audioengineering —
   vendor announcements and user "just updated to x.y" threads date versions.
10. **YouTube release videos** (descriptions sometimes carry versions) — weak,
    last resort, needs corroboration.
11. **Cross-corroboration rule.** Any single weak source (press, forum, reseller)
    must be corroborated by a second independent source before acceptance, or
    enter at yellow with the source chain in notes. Zero trust never relaxes.

## Per-vendor playbooks (living — refined by the reflect loop)

### Waves (Waves Central hub) — assault complete 2026-09-16 (V17 production line cleared); release-notes chip 2026-09-17 (204 promoted, 53 skipped)
- RE-FETCH RECIPE (verified 2026-09-16, hardened 2026-09-17 — Luke's CLA-76/release-notes model): (1) Fetch the STATIC release-notes page `https://www.waves.com/downloads/release-notes` ONCE (it renders fully as static text; ~11.7k lines). Read the v9–v17 tab structure — the embedded tab JSON defines Version 17 down through Version 9. (2) Parse ALL dated product-specific version entries into a normalized product → newest-dated exact-version map (strip browser link markers, keep exact names/builds/dates/tabs; distinguish plugins from apps/drivers/firmware/bundles/hardware). (3) Exact-match map entries against catalog rows — aliases only with explicit evidence (BB Tubes = Magma BB Tubes rename, StudioRack = StudioVerse Audio Effects rename); never map bundle/suite names to component builds or vice versa. (4) For products with no exact dated entry: confirm membership on the official installer V17 list at `https://www.waves.com/downloads/latest-offline-installer` ("Includes: All Waves plugins V17", last updated 2026-06-23) — membership is manufacturer-published V17 evidence. (5) Take the exact uniform build ONLY from KVR per-product pages (currently 17.1.42.50; re-verified 2026-09-17) and ALWAYS record the provenance split in confidence-reason: official pages prove V17 membership; the four-part build is third-party. KVR verbatim oddities (17.1.42, 17.1.42.51, 17.1.42.52) are preserved exactly, never normalized. (6) Diff the parsed map on EVERY future maintenance pass — new products (Atlas Reverb 2026-07-27, TRACT Measure/SPL Meter 2026-09-07) and new exact builds surface here first.
- CAUTION CLASS (do NOT infer from the 2026-06-23 V17 entry alone): the RN's new-preset-menu rollout explicitly EXCLUDES Q-Clone, Curves Equator, Curves Resolve, IR1 Series (IR1/IR360/IR-L/IR-Live), GTR Series (GTR3/GTR Solo), Tune Real-Time, X-Noise, Z-Noise. These need explicit per-product version entries or they stay on their existing (usually KVR-only) versions.
- ALSO NOT V17-INFERABLE (verified 2026-09-17 by matching 212 candidate rows against the installer V17 list): CLA Nx, DTS Neural Mono2Stereo/DownMix/UpMix, JJP Analog Legends, OneKnob Series, Spherix Immersive Compressor & Limiter, V-Series — absent from the official V17 list; keep existing versions. Clarix LB also absent (live-broadcast plugin, no V17 build evidence).
- UNIDENTIFIED RN MENTIONS (follow-up leads, not in catalog as of 2026-09-17): "PSE" ("New in PSE: 5Hz Frequency Shift", V17 tab) and "REQ" ("New in REQ: Real-time spectrum analyzer", V17 tab) — identity unestablished; do not invent rows.
- CONFIDENCE LADDER (2026-09-17 production run): exact official product release-note build → 90–95 (ILLUGEN 2.0 @90); product explicitly named in RN V17 content + installer membership + KVR build → @88; installer membership + KVR build → @82; V17-era new product with no per-product build → 17.1.42.50 @60 with "generation-consistent only" reason; official generation-only evidence must NEVER be written as a fabricated decimal build.
- GATE NOTE — RESOLVED 2026-09-16 (chip tier1-assault-2026-09-16-1318): both
  official V17 URLs VERIFIED IN HAND via independent live fetches (coordinator
  + worker, same chip):
  `https://www.waves.com/downloads/latest-offline-installer` carries the block
  "Includes: All Waves plugins V17 (see full list below)" (**Last updated:
  June 23rd, 2026**) plus a full product list naming every V17 plugin
  (including "Magma BB Tubes" — BB Tubes renamed);
  `https://www.waves.com/downloads/release-notes` carries the dated entry
  "June 23, 2026 — **All Waves Plugins: Across-the-board software update to
  V17**" with named per-product fix entries ("Fixed in Magma BB Tubes",
  "Fixed in CLA MixHub", "Fixed in ReelADT", "Fixed in TG12345"). Bonus
  official page: `https://www.waves.com/v17` ("V17 – Timeless Tools, Refined
  for Better Workflow"). RN page also shows post-V17 activity: eMotion LV1 v17,
  Dugan Speech v17, MyMon/MyFOH v17, Waves Central v17.0.4 (2026-08-02), new
  Atlas Reverb plugin (2026-07-27).
  **PROVENANCE SPLIT (record in every confidence-reason):** the official pages
  prove "all plugins are V17" but publish NO per-product build number — the
  string `17.1.42.50` appears ONLY on third-party KVR pages (in-page find on
  the official release-notes returned zero matches). KVR verbatim oddities
  (17.1.42, 17.1.42.52) must be preserved exactly, never normalized.
  **Production-line recipe for the remaining 133 yellows:** (1) confirm the
  plugin is on the official installer V17 list (membership); (2) take the
  uniform per-product build from the KVR `/product/<slug>-by-waves` page
  (currently 17.1.42.50); (3) raise to @65–90 with confidence-reason citing
  installer membership + RN V17 event + KVR build provenance.
- If KVR has no per-product numeric metadata: generation-consistent value at
  ≤70 with the derivation documented in confidence-reason (done 5x on
  2026-09-16 — Abbey Road Saturator, CLA Effects/Epic/MixHub/Unplugged).
- BB Tubes is listed as "Magma BB Tubes" in V17 — same product, renamed.
- Cadence: Waves does across-the-board generation bumps; re-check the
  installer page monthly for a V18 line.

### Arturia — release-notes chip 2026-09-17 (47 rows: 9 promoted / 8 observed / 30 skipped; bands 88 green / 0 amber / 12 yellow / 35 none → 91 / 1 / 13 / 30)
- RE-FETCH RECIPE (verified 2026-09-17): (1) arturia.com product pages carry a "Software" section with exact builds ("Version X.Y.Z.build | size | date") — but NOT on all pages; some render manual-only, so REQUIRE the Software Version block before raising. (2) Resources pages (`/products/<family>/<slug>/resources`) carry Firmware sections with exact versions + dates (MiniLab 3: "Version 1.2.0 | 356.65 KB | 12/19/2024") AND bundled Software sections — Analog Lab V 5.12.5.6878 (2026-09-16) was found on the MiniLab 3 resources page. (3) support.arturia.com hosts firmware articles (MicroFreak Firmware V5). (4) PACE: SEQUENTIAL fetches with 3–5s gaps, 1 concurrent max; 429s observed 2026-09-16, ZERO 429s with pacing on 2026-09-17. On 429: stop arturia.com for the chip, fall back to KVR/forums/press. (5) Exact software builds live behind Arturia Software Center (auth-walled) — public pages expose marketing generations only for some products; KVR remains the exact-build fallback at the @60 ceiling, never the sole source above 60.
- OLD-GENERATION RESOLUTION (applied 2026-09-17, 14 rows — set superseded_by_plugin_id + discontinued=1 + note): ARP2600 V→ARP 2600 V3, B-3 V→B-3 V2, CS-80 V→CS-80 V4, Jup-8 V→Jup-8 V 4, Matrix-12 V→Matrix 12 V2, Mini V→Mini V4, Piano V→Piano V3, SEM V→SEM V2→SEM V3 (chained through the direct next generation), Solina V→Solina V2, Stage-73 V→Stage-73 V2, VOX Continental V→VOX Continental V2, Wurli V→Wurli V3, Delay Memory Brigade→Delay Brigade (FX Collection 3 rename, same product per CDM). Prophet V: discontinued-SPLIT (Prophet-5 V + Prophet-VS V in V Collection 9) — do NOT collapse to a single successor.
- DUPLICATE/ALIAS ROWS: arturia--chorus-jun-6-v → probable misnamed duplicate of arturia--chorus-jun-6 (no standalone "Chorus JUN-6 V" product exists anywhere; manual titled "Chorus Jun-6"); linked via superseded_by, recoverable. arturia--analog-lab-pro → EDITION ALIAS of arturia--analog-lab-v (Arturia support: "the software application and plugins are still named Analog Lab V"); superseded_by, NEVER versioned independently.
- FREE EDITIONS (skip class — distinct products, independent 1.x versioning, exact builds not public): Analog Lab Play, Augmented Mallets Play, Augmented Strings Intro, Pigments Play. NEVER stamp the full product's build onto a Play edition. Play-edition manual filenames (dl.arturia.net `..._Manual_1_0_1_EN.pdf`) are NOT version evidence.
- BUNDLES: version = generation integer from the official bundle page — V Collection 11 Pro/Intro → "11", FX Collection 6 Pro/Intro → "6", Sound Explorers Collection 2 → "2" (@60; FX Collection 6 Pro "6.0" @60 KVR → "6" @65 official = source-quality raise + normalization).
- FIRMWARE ROWS (all verified 2026-09-17): MicroBrute 1.0.4.114 (terminal, nothing since 2017), MicroFreak 5.0 (official support article), MiniFreak 5.0 (announced ~2026-09-16, official tutorial page), MiniLab 3 1.2.0 (official resources page), MiniFuse 1/2 1.5 (press; explicitly scoped to MF1+MF2, excludes MF4). Hardware-only rows with no firmware tracking (MiniBrute, MiniBrute 2 Noir, Microlab Mk3, MiniFuse 2 OTG, MiniFuse 4) = skip class per chip scope.
- LEGACY DISCONTINUED (discontinued=1): Analog Factory, Brass, Storm, Spark Vintage — absent from all current lineups; no formal EOL announcements exist for some, verdict rests on 20+ year absence + historical sources.
- OPEN IDENTITY CAVEATS: Spark 1 1.7.2 (Arturia staff legacy-forum post) vs Spark Vintage mapping unproven; MiniFreak Vocoder row = Vocoder Edition hardware (4.0 firmware documented in existing observation), no standalone plugin binary — future merge candidate with the MiniFreak row.
- CONFIDENCE LADDER: official Arturia page exact build → @85–88; official firmware generation (major.minor, no build) → @80; official bundle generation → @60–65; KVR-only exact build → @60 ceiling; warez/torrent mirrors BANNED outright (refuse + record rejected observation).
- Next angle for exact builds: render-wait on product pages or an Arturia Software Center data path (never auth/POST).

### Native Instruments (Native Access) — assault complete 2026-09-16 (content packs are a skip class)
- RE-FETCH RECIPE for real instruments/Players (verified 2026-09-16):
  KVR `https://www.kvraudio.com/product/<slug>-by-native-instruments` with the
  KVR DISCLAIMER RULE; press release posts for Player introductions
  (Massive X Player 1.6.0 = the build that introduced the Player license);
  co-developer sites as second sources (Sonuscore shop page for Action
  Strings 2).
- **NI-hosted manual recipe (verified 2026-09-16, 20 raises this chip):**
  `native-instruments.com/fileadmin/ni_media/downloads/manuals/<Product>/<PRODUCT>_Manual_*.pdf`
  — the header states "Software version: X" (Ethereal Earth 2.0, Glaze 1.0,
  Pharlight 1.0, Jacob Collier Audience Choir 1.0 @90 — coordinator verified
  Jacob Collier live on official host 2026-09-16). Official NI PDFs @90.
- `docs.native-instruments.com/ni-tech-manuals` portal mirrors the PDF
  version lines — use it as the search/discovery surface, then confirm the
  fileadmin PDF.
- Search-title mislabel trap: "Icon Bass Manual" queries returned Upright
  Bass manual content with a wrong title — verify the PDF URL AND the
  "WELCOME TO <PRODUCT>" header before raising.
- Deluxe-edition guard: Electric Sunburst Deluxe / Acoustic Sunburst Deluxe
  are DISTINCT products — never stamp Deluxe versioning on the originals.
- Lead: Session Bassist – Icon Bass — manua.ls hosts a 32-page English
  manual; the NI-hosted equivalent is likely under
  `fileadmin/ni_media/downloads/manuals/Icon_Bass/` — top unresolved NI item.
- **NI demo-page manifest (verified 2026-09-16, 11 raises @92):** NI's public
  demo-download pages carry per-product "Version X.Y.Z" fields —
  `native-instruments.com/<locale>/products/komplete/<family>/<product>/download-demo/`
  (works on current EN render AND indexed localized variants; /es//zh//fr//jp
  variants retain the version lines even when the EN live render drops them —
  RC 48 raised @92 from an ES index, FM8 @92 from a ZH index). Family pages
  (Crush Pack, Solid Mix Series, Vintage Compressors) carry separate named
  per-module sections — read the section for YOUR product only.
- Sibling-version inference REFUSED: RC 24 ≠ RC 48, VC 76 (1.4.12) ≠ VC 160,
  Supercharger ≠ Supercharger GT, Enhanced EQ ≠ Vari Comp/Passive EQ.
- Stale-localized-snippet guard: Replika XT 1.3.1 propose rejected 2026-09-16 —
  current EN demo page said 1.3.7 = existing current; writing the stale number
  would have REGRESSED the catalog. Re-fetch the live page before any
  localized-snippet raise.
- Discontinued products: NI's discontinued-activation list uses parenthetical
  bounds like "Akoustik Piano (before 1.1.0)" — that bounds the final version
  without a changelog (verified for Akoustik Piano 1.1 R2, Kore Player 2.1.1).
- TERMINAL SKIP CLASS (do not re-dig without a new angle): Kontakt content
  packs, Leap Expansions, NI Expansions, MPC editions, preset packs — NI pages
  expose only host requirements; no discrete public version exists. ~20 such
  skips logged 2026-09-16. Next NI work must first re-triage the remaining
  pile by product type (real instrument vs content pack).
- Identity guard: Players ≠ full products; original B4 ≠ B4 II (coordinator
  rejected a predecessor-version stamp 2026-09-16).

#### NI chip 2026-09-17 (tier1-ni-releasenotes-2026-09-17) — 340 rows, 5 promotions, assault closed
- Bands: 386 yellow / 7 amber / 41 green → 383 yellow / 10 amber / 41 green (434 effective tier-1 NI rows).
- Promotions: B4 II 2.0.4 @70 (KVR news quoting NI; discontinued w/ Komplete 6, terminal);
  Abbey Road 70s Drummer 1.3.1 @65 (KVR; confidence raise, KVR disclaims OS/format icons are Kontakt Player's);
  Rudiments 1.0 @80 + Homage 1.0 @80 (official NI fileadmin PDFs, "Software version: 1.0 (08/2023)/(9/2023)"
  with Welcome headers, coordinator-verified; no 2.x on any source incl. mirrors);
  Super*Saw (SuperStarSaw) 1.0.0 @60 (KVR Product|Version row, coordinator live-verified; launched 2026-07-16).
- **Demo-page manifest recipe DEAD (verified 2026-09-17):** redesigned NI site — `/products/<slug>/download-demo/`
  returns 200 but renders via JS and requires login; no "Version X.Y.Z" in HTML on EN/ES/ZH/FR; old
  `/en/products/komplete/<family>/<product>/download-demo/` path 404s. Do NOT use; needs re-derivation.
- **Manual recipe refined:** fileadmin PDFs still valid version source (Rudiments/Homage @80). BUT the new
  public GCS bucket HTML manuals (`storage.googleapis.com/ni-tech-manuals`, browsed via
  `docs.native-instruments.com/ni-tech-manuals`, 121 product dirs) do NOT carry "Software version" headers
  (checked 19 manuals) — bucket HTML is discovery-only, never a version source. Legacy fileadmin PDFs are not guessable.
- **KVR version field is sparse:** only ~2 of 31 NI product pages fetched carried one. KVR-alone stays 55-65.
  Monark 1.3.2 was worker-reported from KVR but coordinator's live re-fetch showed NO version row and no
  corroboration — NOT written; flagged for re-check (possible worker misread or KVR render variance).
- **Banned-source rule (warez/torrent mirrors are NEVER version sources):** Melted Vibes / Ignition Keys / Sway /
  Feel It "2.0.0" and Butch Vig Drums "1.1.0" exist ONLY on pirate mirrors (detailed NI-styled changelogs,
  mirror consensus, official Kontakt-7.6+ generation corroboration — still refused). Rejected observations recorded
  so future workers don't re-propose. Consistency held across all five.
- **Publisher-level pack finding:** ~147 NI rows confirmed as Expansions / Massive X preset packs / Leap kits /
  MPC Editions / WAV variants — NI publishes contents, price, size, host requirements but NO discrete per-pack
  version field. Never stamp host (Kontakt/Massive X/MPC OS) versions on packs. Candidates for `not-version-tracked`.
- **36 genuine instruments are version-opaque:** Abbey Road 50s/80s/Modern Drummer, The Giant/Grandeur/Gentleman/Maverick,
  Claire, Erosia, Guarneri Violin, Kolor, LCO, Molekular, Mysteria, Odes, Psyche Delay, Scene: Bloodplant, Tape Wobble,
  Dynamo, Hypha, Playbox, Thrill, Emotive Strings, Symphony Essentials x4, discontinued Guitar Combos/Intakt/Kompakt/
  Kore/NI-Spektral Delay/Pro-53/Vokator — full-effort research, no public per-product version anywhere. Real coverage
  gap; needs a NEW discovery path (demo manifest dead). Do NOT re-dig without one.
- **Shopify identity surface (new, no versions):** `/products/<slug>.js` (title, vendor, tags) and
  `/search/suggest.json` — high-value for product-type triage and vendor verification; no version fields.
- **Identity flags (pending Luke ruling):** Dopamine = Drumasonic, VEA = iZotope (NI store API vendor fields —
  recommend re-tag/exclude); Crumbs = identity unconfirmable (no store listing, no KVR, no manual — flagged, not
  cataloged); Scarbee Funk Guitarist NI SKU defunct since Sep 2022; "Alchemy Soft Cell" has no verifiable NI identity.
  2026-09-18 portal-audit flags: `leotokarev` manufacturer row likely misattributed — its only plugin "GainMatch" is a
  LetiMix product (letimix.com/products/gainmatch), row may not deserve to exist; `spectralayers-bridge` looks like a
  bogus manufacturer identity — "SpectraLayers Bridge" is Steinberg's Pro Tools AudioSuite bridge plug-in, not a vendor;
  `unfilteredaudio` row holds "LTL SILVER BULLET mk2" (that's Louder Than Liftoff, not Unfiltered Audio) — misattributed,
  do not merge into `unfiltered-audio` without review; `con`, `digidesign`, `mpegh` are single-plugin legacy rows whose
  portal URLs were google-search placeholders — identity review needed.
- Amplified Funk 2.0.0 @58 REMOVED from current — sole source was a warez mirror; catalog integrity correction.
- Wayback is a hard stop for NI (429 on archive.org availability API).
- NI community "previous versions" thread is a stale-value oracle: Amati Viola 1.2.0, Analog Dreams 2.0.3,
  MODULAR ICONS 1.2.2.3, 40's Very Own Drums 1.0 are explicitly PREVIOUS installers, not current versions.

### IK Multimedia (IK Product Manager) — assault complete 2026-09-16 (vendor fully covered, currents held)
- `ikmultimedia.com/demodownload/` **DEMOTED 2026-09-16**: worker test found it
  JS-rendered — fetched text shows only "Product Download" + IK Product
  Manager v1.1.15, no per-product versions. Do NOT treat as a working oracle;
  needs re-verification before any future use. KVR product pages are the
  working source @60 (verified 6x this chip — SampleTron 2 2.0.5, Sonik
  Synth 2.1.1, Pianoverse 1.0.11, ReSing 1.1.2, NY Grand S274 1.0, Royal
  Upright Y5 1.0).
- **HUB-STAMP DETECTOR (verified 2026-09-16):** any KVR library page showing
  a version identical to the host's + host sys reqs = auto-refuse as
  hub-stamped. Clincher: The Grid (a SampleTank 3-era Beats Series library)
  shows identical 4.0.9 on its KVR page — a ST3-era library cannot be at ST4's
  version. 5 such pages refused this chip (Indie Dance, Minimal, NRG,
  Nanotube, Power Up). Look for "Product, Version, 4.0.9" + "SampleTank 4
  SE/4/MAX" sys-reqs on the same page.
- **Lead: IK "Sound Library Update" news crawl** — ikmultimedia.com/news for
  "Sound Library Update" items (proven: "Sound Library Update 1.5 for all
  SampleTank 4 users" alongside ST 4.0.6) — the outside-the-box path for the
  IK library long tail + future maintenance re-check.
- KVR triage signal: related-products pages expose "No Longer Available"
  (Sonik Synth free case — dead page, edition cross-map refused).
- Original SampleTron refused: KVR page mixes 2.0.4 (SampleTron-2-generation
  contamination) and 1.0.2 — never cross-map generations.
- KVR marketplace fallback: `kvraudio.com/marketplace/<slug>` shows an
  "Operating System | Latest Version" table even when the product-page fetch
  drops the version header (verified: Sunset Sound Studio Reverb II 1.0.2).
- KVR fetch intermittency: the "Product, Version" header line is sometimes
  dropped by browser fetches (M-Poly, 2 Max, SE, T-Racks 5 Deluxe, SampleTank
  3) — absence in one fetch ≠ absence on the page; re-check with a
  `"slug" "Product, Version"` search.
- **NEW oracle (verified 2026-09-16, UNO Synth Editor → 1.1.0 @80):**
  `ikmultimedia.com/news/?id=catalinaschedule` (Catalina compatibility
  list) pins exact versions for editors/apps: UNO Synth Editor 1.1.0b, UNO
  Drum Editor 1.1.0b, MODO BASS 1.5.1b, SampleTank 4 4.0.9, T-RackS 5 5.2.2b,
  AmpliTube 4 4.9.0b, Miroslav Philharmonik 2 2.0.6, Syntronik 1.2.0b,
  Hammond B-3X 1.1.1, Lurssen 1.1.0b, MODO DRUM 1.1.0, UNO Drum Anthology
  Libraries 1.0.0. CAVEAT: Catalina-era (~2019), mostly beta stamps —
  corroborate with KVR/press before raising. The same page's versionless
  library enumeration is the principled basis for skipping the library long
  tail (Techno/Trance/The Grid/Terry Bozzio/NRG/Deep House/Beats Series/
  Elektronika Series). Beware the Autodafe third-party "UNO Synth Editor"
  (0.9 beta, different vendor) — never cross-map.
- **Terminal classes (codified 2026-09-16 1918):** hardware (Tonex pedals,
  UNO synths, Z-Tone — firmware/driver builds are not software versions);
  discontinued iOS apps (VocaLive — no App Store presence); bundles
  (Total Studio / Total VI Max — no per-bundle public version identity);
  sound libraries with no standalone version identity (hub-stamp detector
  refuses 4.0.9 stamps on ST3-era libraries).
- Generation cross-map refused (Miroslav Philharmonik 1 → MP2 2.0.6);
  edition cross-map refused (T-RackS 5 Deluxe ≠ MAX v2's 5.10.4); third-party
  "3.7.3" claims for SampleTank 3 family come from dubious download sites —
  refused.
- **T-RackS 6 Max/Pro edition-identity gap (verified 2026-09-16):** KVR bundle
  pages render NO version header (4 fetches) — strict own-page confirmation
  impossible; 6.3.2 is held via family unanimity only (base 6 page + modules +
  Bass ONE all 6.3.2, nothing newer anywhere), never a raise candidate.
  Close it via a read-only IK Product Manager manifest GET or an IK
  changelog/news item.
- iRing/iRing Music Maker = discontinued iOS apps (no App Store presence);
  KVR "1.0" on the iRing page is the hardware ring — skip class.

### IK Multimedia — release-notes chip 2026-09-17 (257 rows: 11 promoted / 106 observed / 140 skipped)
Bands 252 yellow / 2 amber / 3 green → 243 yellow / 11 amber / 3 green.
- **IK news URL structure (verified):** `ikmultimedia.com/news/?item_id=NNNN`
  renders server-side ONLY with the `&L=JP` locale param (EN default
  JS-renders to the generic news listing — the item is unreachable without
  the locale). Slug form `?id=<slug>` also renders server-side. Verified
  items: item_id=12366 (MODO DRUM 1.5, 2022-02-24), `?id=hammondb3x13update`
  (B-3X 1.3), `news/index.php?id=SunsetSound2Release`.
- **Catalina schedule upgraded from corroboration-only:** explicit full-product
  listings now support raises when corroborated — Miroslav Philharmonik 2
  (2.0.6) → @85 with KVR CE corroboration; Syntronik (1.2.0b) → 1.2 @70.
  Its versionless library enumeration remains the principled skip basis
  (American Acoustic listed under "SampleTank / SampleTank MAX Instrument
  LIbraries" with NO version → 4.0.9 hub-stamp REJECTED).
- **Edition-lock PROVEN by official sources (not inference):**
  MODO BASS 2 User Manual Ch.14 "Versions and Custom Shop": "If you own
  MODO BASS 2 CS or MODO BASS 2 SE you can upgrade anytime... locked model
  or feature inside the application" — SE is an in-app entitlement of the
  ONE binary. Same pattern: MODO DRUM 1.5 news ("editions differ only in
  kit count; all share the 1.5 app"), TONEX (KVR announcement: "same exact
  features, different Tone Model counts" + IK forum Aug/Sep 2026 naming
  1.12.1 as THE installed stable → Standard raised 1.10.0→1.12.1 @70),
  Syntronik 2 SE / Max V2 → track app 2.1.3 @70.
  RULE: IK edition tiers (SE/CS/MAX/Standard) track the host app build;
  never treat an edition as a separate product.
- **Hub-stamp detector extended (25 rejections this chip):**
  AmpliTube gear collections — KVR stamps 5.10.9 byte-identical (Mac+Win) to
  the AT5 host page; IK's own collection pages frame them as gear playable
  inside AT5/Custom Shop; IK's "AmpliTube 5 MAX v2" SKU copy enumerates them
  as bundle contents → 12 rejected (Brian May, Deluxe, Electric Gypsy,
  Fender, Fulltone, Satriani, L.A. Rocker, MESA/Boogie, Metal, Orange,
  SVX, SVX 2).
  Syntronik single instruments — KVR stamps the APP GENERATION (1.0/1.2 =
  Syntronik 1, 2.0 = Syntronik 2); sibling instruments in the same family
  are versionless → 13 rejected.
  T-RackS SE re-homed 6.3.2→5.10.4 (it is TR5 SE; no TR6 SE edition exists —
  TR6 tiers are Intro/6/Pro/MAX). Alternate Keys 4.1.4 rejected (ST4
  expansion library per IK's ?id=st4cs page).
- **Syntronik 1 TERMINAL (verified):** IK notice republished on Cakewalk
  forum — "Only Syntronik 2 CS will receive updates moving forward.
  Syntronik 1 will receive no further updates." 1.2 @70 stands final.
- **AmpliTube 5 MAX v2 = bundle SKU, not a generation** (retailer copy of
  IK's SKU: 435 gear models on the 5.10.x host). AmpliTube 4 terminal:
  KVR forum Oct 2021 (IK support: "AT4 is discontinued"); IK auto-upgraded
  post-Oct-15-2020 AT4 purchases to AT5 SE. AmpliTube 4 MAX identity caveat:
  no IK-official product of that exact name (IK's AT4 bundle is "AmpliTube
  MAX"); 4.10.0.b held from KVR with caveat, never cross-mapped.
- **TONEX 2.0 is PUBLIC BETA (2.0.1/2.0.2/2.0.3, Aug–Sep 2026; full ~Oct
  2026)** — refused as current stable. Stable = 1.12.1 all editions.
- **ARC 4: no public exact build exists** (KVR page exposes no version
  field; only warez mirrors carry a build — refused). IK Product Manager
  only. ARC X supersedes for iLoud Precision/MTmkII users (KVR news).
- **Resolved identities:** Clavitube = ST4 expansion library (IK ?id=st4cs);
  SampleMoog = SampleTank-engine instrument (mixonline); VocaLive last
  major = VocaLive 3 (May 2016, MacTech/SonicState) → legacy-mobile skip.
- **T-RackS/SampleTank public ceiling (worker B):** NO public IK per-build
  changelog exists for TR 6.3.2 / ST 4.2.6 / newer — KVR + family unanimity
  is the ceiling. Do not burn digs looking for an IK changelog that isn't
  published.
- **Banned mirrors refused this chip:** filecr, vstorrent, looptorrent,
  plugintorrent, gfxtra31, goaudio, magesy.blog, tokopedia
  (piracy-adjacent). Warez MixBox 1.5.2 (06.2025) and ARC 4 v4.0.1 listings
  were consistent-but-unusable.
- **Write-count reconciliation (lesson):** a transposed UUID in the
  hub-stamp batch silently missed one row; caught by reconciling the
  rejected-count against the expected 12+12. Always assert match counts on
  batch UPDATEs.
  StealthPedal CS / StealthPlug CS = hardware bundles; their KVR
  "Product, Version" headers are driver/hardware builds — skip class.

### Spitfire Audio (Spitfire app) — Help Centre breakthrough 2026-09-17 (chip `tier1-spitfire-releasenotes-2026-09-17`: 225 researched, 41 promoted, 8 observed, 176 skipped; bands 10g/2a/73y/140n → 43g/6a/68y/108n)
- **Help Centre per-plugin changelog crawl (NEW 2026-09-17, 41 raises @82–@88):**
  `support.spitfireaudio.com/en/articles/<id>-<slug>-changelogs` — Spitfire-owned,
  per-PLUGIN changelogs with version + release date. Verified live articles:
  - BBCSO Plugin `1.12.14` (13 Jul 2026) — `/13169200-bbc-symphony-orchestra-plugin-changelogs`
  - Abbey Road Orchestra Plugin `1.4.7` (13 Jul 2026) — `/15921364-abbey-road-orchestra-changelogs`
  - AR Two Iconic Strings Pro `1.3.9` (5 Feb 2026) — `/13560438-abbey-road-two-iconic-strings-professional-changelogs`
  - AIR Studios Reverb `1.4.0` (29 Jan 2026) — `/11816026-air-studios-reverb-changelogs`
  - AIR Studios Reverb Essentials `1.2.2` (30 Jan 2026) — `/13598280-air-studios-reverb-essentials-changelogs`
  - Eric Whitacre Choir `1.7.2` (5 Feb 2026) — `/12579081-eric-whitacre-choir-changelogs`
  - Ensemble Plugin `1.3.18` (7 Nov 2025) — `/12781236-ensemble-plugin-changelogs` (explicitly names Shakespeare's Church Organ, Château Piano, Mervyn Warren Choir)
  - Solar Plugin `1.7.5` (29 Jan 2026) — `/13561322-solar-plugin-changelogs`
  - Originals → INSTRUMENT platform `2.3.5` (9 Jul 2026) — `/15841957-originals-changelogs`
  Companion "Version History" articles give per-LIBRARY product versions
  (e.g. BBCSO product `1.7.0`, 2023-06-29 — `/11815926-version-history-bbc-symphony-orchestra`).
  Maintenance: re-fetch the article list per plugin; the version + date sit in
  the article body ("Change Log <date>"); diff against stored.
- **Plugin-vs-library guard REFINED 2026-09-17 (overrides 2026-09-16 guard):**
  The 2026-09-16 "never stamp plugin-level changelogs onto library SKUs" rule
  is superseded. Rationale: the catalog's accepted rows already track PLUGIN
  versions (BBCSO Pro `1.12.14` @92, ARO main `1.4.7` @92), and a DAW scan sees
  the plugin binary, not the library content pack. For shared-plugin families
  the manufacturer explicitly instructs repairing "all installed sections of
  your [BBCSO/ARO] product in the same repair session" — one binary, one
  version. So: BBCSO Core/Discover/Piano rows ← `1.12.14`; all 31 ARO Core/Pro
  section rows ← `1.4.7` (4 non-suffixed SKUs at @82 — may predate the
  Core/Pro split, possible Core duplicates, flagged); Ensemble trio ← `1.3.18`.
  The guard NOW means: never stamp (a) library *content* versions where the
  row tracks the plugin binary (BBCSO product `1.7.0` ≠ plugin `1.12.14` —
  keep them distinct), (b) host-platform versions (INSTRUMENT `2.3.5`, Spitfire
  App builds) onto library rows, (c) suite/bundle versions onto independently
  versioned components.
- **Solar-hosting pattern (NEW 2026-09-17):** Spitfire FAQ: "Why can't I see a
  'Mercury' plugin in my DAW? This library is housed in our new Solar plugin,
  so instead of seeing a 'Mercury' plugin, you will need to select the 'Solar'
  plugin." → Mercury row ← Solar `1.7.5` @88. Jupiter "hosted in our eDNA synth
  engine Solar" (stated on Spitfire's Mercury page) → `1.7.5` @82. Watch for
  more Solar-hosted libraries; the FAQ phrasing is the trigger.
- **Originals INSTRUMENT migration (2026-09-17):** 23 Originals rows skipped —
  `2.3.5` is the INSTRUMENT platform version, not per-library. 4 new Originals
  (Emotional Cello, Intimate Brass, Intimate Woodwinds, Crystal Keys, 9 Jul 2026)
  + 17 upgraded titles per Splice announcement; all already in catalog.
- **LABS lead (unverified):** FileHorse lists "Spitfire Audio LABS 3.4.18 LATEST"
  but the same page references a 3.4.13 installer — internally inconsistent,
  not written. LABS is migrating into Splice INSTRUMENT (plugin "operating well
  into 2026"). Needs manufacturer or installer-filename confirmation.
- **AIR Essentials integrity fix:** prior `1.2.14` @60 had no manufacturer source
  (likely contamination) — corrected to official `1.2.2` @88.
- Older verified paths (kept): KVR discovery via `site:kvraudio.com/product`
  (KVR attribution rule still applies); VI-Control version reports @60
  (Albion Legacy 5.2.2, Alternative Solo Strings 1.0.3); KVR slug rule (em dash
  → `---`). KVR sweep 2026-09-17: 9 probes, then PAUSED after 2 consecutive
  fetch failures — do not hammer; KVR remains @60-only.
- **Library-changelog surface probe NEGATIVE 2026-09-17 (chip `tier1-spitfire-library-changelog-2026-09-17`: 147 app-gated rows probed, 0 promoted, 147 skipped):** the "Library Version" changelog section does NOT exist on live product pages. Evidence: (a) live `www.spitfireaudio.com/abbey-road-one-orchestral-foundations` fetched — marketing content only, no changelog section; (b) Shopify product JSON (`/products/<handle>.js`) carries commerce fields only, no version data; (c) `site:spitfireaudio.com "Library Version"` search — the ONLY changelog-bearing page is the `admin-new.spitfireaudio.com` staging snapshot (last crawled ~343 days ago); all live pages (crawled within hours) show no changelog sections; (d) the staging URL is unreachable (fetch fails). The ~108 app-gated rows REMAIN app-gated by design; Help Centre plugin changelogs + Version History articles remain the only public per-product surface. Do not re-probe this surface without evidence the live site gained a changelog section.
- Remaining app-gated class (~108 rows, no public channel): niche libraries,
  AR Two non-Pro, LABS packs — maintenance track, no public re-probes without
  a new angle.
- **LEAD — official product-page library changelogs (2026-09-17, untested at
  scale):** `admin-new.spitfireaudio.com/<product-slug>` served "Orchestral
  Foundations Library Version v1.0.11 (January 2024)" @90 (AROne Foundations).
  Direct re-fetch failed 2026-09-17 (staging domain may be gated) — next chip:
  probe the LIVE www.spitfireaudio.com product pages and search snippets for
  "Library Version" sections. If systematic, this collapses the app-gated
  class. Watch the library-vs-plugin version-line split (AROne: library 1.0.11
  vs plugin 1.2.0 — track separately, never merge).

### UVI (UVI Portal) — assault complete 2026-09-16 (maintenance via recipes below)
- UVI version history is partly public per product page.
- **Official manual-header recipe, THREE DOMAIN FAMILIES (verified 2026-09-16,
  34 raises):** search `UVI <Product> manual site:uvi.s3.amazonaws.com`, then
  `site:cdn.uvi.net` — official PDFs carry "Software Version X" headers.
  Always search all three families; verify PDF headers with pdftotext.
  - `uvi.s3.amazonaws.com/Manuals/<slug>_manual.pdf`
  - `uvi.s3.amazonaws.com/FCX<nn>-<Slug>/<slug>_manual.pdf` (Falcon expansions, NEW 2026-09-16 — 6 raises)
  - `cdn.uvi.net/UVIFCX<nn>_<slug>/manuals/<date>/...` (e.g. `cdn.uvi.net/UVISC120_Hx-20/manuals/20250603_145829/HX-20_manual_en.pdf`; UVISC family NEW 2026-09-16 — 5 raises incl. Shade 1.2)
- Music-press verbatim releases work @88 when the number is unambiguous
  ("UVI update Drum Replacer to version 1.1"); Mayhem of Loops 1.5 @85 via
  KVR press 2015 + product-title corroboration (coordinator verified
  2026-09-16). Ignore untrusted download-site version claims (Meteor
  "1.1.4/1.1.5" refused — manual says 1.1).
- Mosaiq 26 rule: a "version 26" generation identifier is NOT a granular
  downloadable version — no stamp.
- **Soundbank versions are visible only inside UVI Workstation/Falcon and
  updated via UVI Portal** (per official UVI support KB
  `support.uvi.net/hc/en-us/articles/115002295609`) — soundbanks with no
  manual/download version are a maintenance-track class, not a research
  target (28 documented 2026-09-16). NOTE 2026-09-16: support.uvi.net was
  terminally unreachable — the official soundbank-skip citation still lacks
  the verbatim support sentence; retry via search-cache or fresh session.
- Blendstrument products are Kontakt instruments, not Soundpaint products.
- `cdn.uvi.net` returned 429 this chip — dropped for that provider/chip.
- **FIRST-PARTY S3 CHANGELOG RECIPE (verified 2026-09-17, chip
  tier1-uvi-releasenotes-2026-09-17 — 6 raises @90):** UVI hosts per-product
  changelogs at `https://uvi.s3.amazonaws.com/Release_Notes/<product>_changelog.pdf`
  (static PDF, latest entry on top). Proven filenames: `shade`, `plate`,
  `sparkverb`, `rotary`, `relayer`, `phasor`. Filename convention is NOT fully
  predictable (`drumreplacer_changelog.pdf` 404'd — try `drum_replacer_` style
  variants; `dual_delay_x_changelog.pdf` also 404'd). Maintenance: re-fetch
  known-good URLs, diff the top entry. Shade 1.2.5 / Plate 1.0.10 / Sparkverb
  1.5.0 / Rotary 1.0.6 / Relayer 1.5.8 / Phasor 1.0.1 all raised @90 from this
  surface; Drum Replacer 1.3.2 came from KVR marketplace @65 (no S3 changelog
  found). Relayer-vs-Phasor caution: Relayer 1.5.0 added a "Phasor" FX *inside*
  Relayer — that is a feature, not the standalone Phasor plugin (own changelog,
  1.0.1). Never cross-map.
- **Falcon generation rule (2026-09-17):** UVI markets year generations
  ("Falcon 2026", Oct 2025 press) — the catalog tracks the generation name @88.
  KVR-news floor build 26.0.7 (third-party library requirement, Aug 2026) was
  NOT stamped: KVR-class evidence, stated as "or higher", may not be latest.
  Record granular builds as candidates; keep the manufacturer generation as
  current until UVI names a newer one.
- **UVI Workstation 4.0.9** re-verified current 2026-09-17 via KVR version field.
- **Dual Delay X caution:** 1.1.5 converges only on warez/unofficial mirrors
  (first seen ~Oct 2023) — refused per banned-source rule; stays versionless
  until a citable source appears.
- **Identity-tag debt (flagged, not fixed 2026-09-17):** Sparkverb, Plate,
  Relayer, Shade, Dual Delay X, Drum Replacer, Rotary, Phasor are real VST/AU
  plugins but tagged `identity_kind='soundset'` in the catalog. Version
  research treats them as software; the tag itself needs a catalog-level fix.

### Universal Audio (UA Connect) — re-audited 2026-09-17 (chip tier1-ua-releasenotes-2026-09-17; 82 researched: 2 promoted / 55 observed / 25 skipped; +1 new row)
- UAD software release notes are public and versioned (UAD v10.x/11.x/12.x).
  Per-plugin versions ride the UAD bundle version — record the mapping.
- **CURRENT bundle-version source (re-verified 2026-09-17, still UAD 12.0.0):**
  `help.uaudio.com/hc/en-us/articles/215267203` "UAD DSP Plugins and Drivers
  - Software Archives" (updated 2026-09-08) — read the "Archived UAD DSP
  Plug-Ins and Driver Direct Downloads" section for the "UAD XX.X.X
  (Current)" line. Re-check each chip. Per-plugin DSP versions ride the
  bundle; record the mapping per row. 2026-09-17: C-Suite C-Max added as a
  DSP row (UA product page: requires Apollo/UAD-2, runs on onboard DSP) →
  12.0.0 @90.
- **UAD-1 terminal rule (new 2026-09-17):** UAD-1-only plugins (Nigel) max at
  the terminal UAD-1 installer **v6.1.0** — archives article: "UAD-1 Devices |
  Discontinued | v6.1.0 and lower". Nigel set 6.1.0 @80; the old 7.7 claim
  was spurious (7.7 was a UAD-2-era release).
- **UADx verdict (hypothesis re-tested 2026-09-17 — CONFIRMED for official
  channels):** UA publishes NO public per-plugin UADx versions. Evidence:
  uadforum.com thread 65335 ("We currently do not do release notes for UAC
  or UADx native plugins"); `www.uaudio.com/support/uad/versions.html`
  (resolved 2026-09-17 from the archives article's "UAD Version History &
  Release Notes" link) contains ZERO "UADx" mentions and its static text
  tops out at v8.7.4 — v9+ notes are DSP-only; official UADx product pages
  carry no version/build data (tech-specs = formats/OS/SKUs only);
  builds.uaudio.com CDN is flaky/unusable from research env (HTTP 400,
  CloudFront/S3); retailers/forums cite no per-plugin builds. **KVR is the
  ONLY public source of UADx per-plugin versions** (55 rows held @60,
  re-verified stable 2026-09-17 — stability confirms freshness of the KVR
  record, not truth; do NOT raise above 60 on KVR alone per CONFIDENCE.md
  anti-patterns). Stamping the DSP bundle version onto UADx native rows
  remains an INVENTED version. Maintenance: re-fetch KVR UADx product pages
  and diff the "Product, Version" field; watch for any official UA release
  note that breaks the embargo.
- **New row 2026-09-17:** UADx Pultec Passive EQ Collection (was missing;
  KVR 1.2.16 @60). KVR also lists "UADx Teletronix LA-2A Leveler Collection"
  (1.3.16) — distinct from the single "Tube Compressor" row (1.0.8); pin
  row identity to the single-plugin product.
- **Edition bundles are versionless:** bare KVR "1.0"/"2.0" is NOT a version
  statement (5 bogus observations rejected 2026-09-17: Producer, Studio,
  Signature V3, UADx Essentials, UADx Signature V2); "V2"/"V3" are edition
  names. License bundles (SSL 4000, API Vision, Analog Classics Pro, Bill
  Putnam, Neve 1073/Dynamics, Pultec collections) have no public per-bundle
  version — UA store sells them version-less. Principled skips.
- **Hardware rows** (Apollo x4/x6/x8/x16/x16D/Solo, Volt 876, OX, UAFX pedals
  ANTI/Dream '65/Enigmatic '82/Lion '68) are principled skips; UAFX pedal
  rows are distinct from their UADx native plugin counterparts.
- **UAD Software row** = hub/installer app; UA publishes no public UA
  Connect app version (only legacy "1.6.2" documented). Principled skip.
- LUNA is a separate version family — LUNA bundles (LUNA Pro Bundle 2)
  track LUNA (3.0 / renamed LUNA Studio 2026-09-14), never the DSP bundle.
- Resolved 2026-09-17: the archives article's "UAD Version History &
  Release Notes" link goes to `www.uaudio.com/support/uad/versions.html` —
  DSP release notes only (zero "UADx" mentions; static text tops out at
  v8.7.4). No UADx per-plugin versions there.
- Release-date: not on archives article; watch sonicstate/prosoundweb UA
  announcements.
- Never use the unofficial GitHub UAD mirror for raises.

### Orchestral Tools (SINE) — assault complete 2026-09-16 (helpdesk ledger decayed date-only post-2024 — fresher source wanted)
- SINE update notes published publicly per library.
- **Official "Current Versions" helpdesk ledger (verified 2026-09-16, 8
  raises @90):** `orchestraltools.helpscoutdocs.com/article/289-current-versions`
  (page last updated 2024-09-25 — note the staleness in confidence-reason).
  SINEplayer table: version = parenthesized value after the date.
  Kontakt table: version = Collection column.
- **PLAYBOOK DECAY WARNING:** the ledger is 2 years stale; post-2024 rows are
  going date-only (Grimm: "April 2024", no version). Find a FRESHER source
  before assuming coverage — do not treat absence from the ledger as
  terminal without trying KVR press, SINEplayer KB, and the
  `orchestraltools.com` per-library update notes.
- **Edition-identity guard:** SINE vs Kontakt editions are SEPARATE catalog
  claims — e.g. `berlin-woodwinds-additions` (SINE "Berlin Woodwinds
  Additions", 2.0) vs `berlin-woodwinds-additional-instruments` (Kontakt
  "Berlin Woodwinds - Additional Instruments", 2.1). A worker mis-mapped
  these 2026-09-16; the coordinator corrected 2.0 → 2.1 before writing.
  Match the manufacturer row's exact spelling to the catalog row's name.
- **Edition-identical-twin SKIP class (codified 2026-09-16 1918 chip, 8 plugins):**
  when SINE and Kontakt ledger rows are IDENTICALLY spelled but carry
  different versions (majestic-horn SINE 2.0 / Kontakt 1.1; metropolis-ark-1
  SINE 2.0 / Kontakt 1.2; MA2 SINE 2.0 / Kontakt 1.1; MA3 SINE 2.0 /
  Kontakt 1.1; MA4 SINE 2.0 / Kontakt 1.0; MA5 SINE 2.0 / Kontakt 1.0;
  time-macro SINE 2.0 / Kontakt 1.0; time-micro SINE 2.0 / Kontakt 1.0;
  plus Bösendorfer Staccatos) — stamping either edition is banned.
  Real fix is catalog-side: split rows by edition or pin the maintained
  SINE line (Luke's decision; flagged). Terminal skip, do not re-dig.
- **KVR probe for post-ledger products (verified 2026-09-16, Miroire +
  Monolith → 1.0 @60):** recipe: fetch
  `kvraudio.com/product/<slug>-by-orchestral-tools`, confirm the page
  carries "The version numbers are for **<Exact Product>**", read the
  Product Version block. Maintenance: revisit the URL, confirm the
  attribution phrase unchanged, re-read Product Version. Caveat:
  KVR-only, @60 ceiling; KVR 1.0 may be launch bookkeeping.
- **Sterile path (don't re-dig):** per-library helpscout "notes" articles
  (e.g. `/article/424-metropolis-ark-5-notes`) carry hotfix/patch lists
  only, never version numbers.

### EastWest (Installation Center) — re-audit complete 2026-09-17 (engine page + named library releases; KVR exact-page fallback)
- **Primary surface (static HTML, re-fetch recipe):** `https://www.soundsonline.com/support/updates`
  lists dated, versioned entries for Installation Center (1.6.1, Jan 8 2026),
  OPUS (1.6.5, Jun 4 2026 — full changelog back to 1.3.4), Spaces II (2.5.3,
  May 7 2024), NKS Support for Opus, and a Legacy section. Maintenance:
  re-fetch, read the top entry of each section, diff against current
  observations. No login, no JS required. Low concurrency; never POST.
- **REVISED verdict (2026-09-17): the 2026-09-16 "engines-only" verdict was
  premature.** The Opus changelog names NUMBERED library releases: Opus 1.6.2
  (Dec 22 2025) → "Support for HW Orchestra Opus Edition 1.5 - (Movie Mixes)";
  Opus 1.6.0 (Oct 16 2025) → "Support for HW Strings 2 update (Movie Mixes,
  Alternative Tunings, programming improvements)" (no number given — do not
  invent one). So current flagship libraries DO carry public versions; the
  page is the maintenance oracle for both engines and named library releases.
- **Opus Edition 1.5 rule (verified 2026-09-17):** "HW Orchestra Opus Edition
  1.5" is EW's official library version (marketed as "Hollywood Orchestra 2026
  Update"). Applies to the Diamond AND Gold edition rows (one product, two
  mic-position SKUs). Never apply to pre-Opus-Edition originals, legacy
  Play-era section rows, or bundles. Confidence @85 (official, named inside
  the engine changelog rather than a dedicated library page).
- **Engine-vs-library split (hard rule):** Opus/Play/Installation Center
  versions are never library versions. Play 6.1.9 is TERMINAL (page: "Legacy
  software (no longer supported, replaced by OPUS)") — do not re-poll.
- **Kompakt 1.0.8 engine-patch trap (verified 2026-09-17):** KVR news
  `eastwest_ni_kompakt_v1_08_updates_available_3743` is the Kompakt PLAYER
  v1.0.8 patch naming recipient products (Colossus, Stormdrum, Vapor,
  Stormbreakz, Hardcore Bass XP, Percussive Adventures 2, Bösendorfer 290,
  RA, Symphonic Choirs, EWQLSO editions, Drumkit From Hell 2). Do NOT stamp
  1.0.8 as a library version from this article alone — engine-version
  stamping. Accept 1.0.8 for a row ONLY with KVR exact-page product
  attribution ("The version numbers are for <Product>").
- **KVR exact-page fallback (@60 ceiling):** KVR `Product, Version` field WITH
  the exact-attribution phrase is acceptable per-product evidence. KVR 1.0 on
  a product page may be launch bookkeeping — record the caveat in the
  confidence reason. KVR 1.0 on BUNDLE headers is not a version (verified
  2026-09-16, Synth Super Bundle).
- **KVR news articles quoting EW (also @60):**
  `eastwest-updates-many-play-powered-products-17622` names per-product
  instrument updates (Pianos Gold 1.0.5, Gypsy 1.0.4, RA 1.0.4, Voices of
  Passion 1.0.7, StormDrum2 1.0.5, Symphonic Orchestra Platinum 1.0.5,
  Symphonic Choirs 1.0.6, The Dark Side 1.0.2, HW Strings Gold+Diamond 2.0.1).
  Edition discipline: 2.0.1 named Gold+Diamond → both rows; 2.0.3 named Gold
  only → Gold row only, never cross-map to Diamond.
- **Bundles = terminal skip class** (Hollywood Orchestra/Choirs/Fantasy/Solo
  bundles, Hybrid Super Bundle, Symphonic Choirs Bundle Gold/Platinum):
  bundles receive no discrete product versions; OPUS/component versions must
  never be stamped onto them.
- Legacy EWQL-era editions (SO Gold/Platinum Plus/Silver): no discrete public
  version; never cross-map Hollywood Orchestra/Choirs successors onto them.
- Watch items: TONEX-style — none; but re-check the updates page for any new
  "Support for <Library> <version>" phrasing each cycle, and retry the KVR
  Spaces (v1) product page (transient fetch failure 2026-09-17).

### Heavyocity — assault complete 2026-09-16 (KVR version probe works)
- **KVR version probe (verified 2026-09-16, 2 raises @60):** KVR search
  snippets render the literal text "Product, Version, N" ONLY on versioned
  entries — a cheap discriminator. Entries may add "The version numbers are
  for <Product>", confirming exact attribution (required by the Kontakt-
  instrument disclaimer rule). If absent across search snippet AND page →
  principled soundset skip.
- heavyocity.com product pages and public manual PDFs expose specs/content
  ONLY — no per-product versions or changelogs anywhere (verified: Punish,
  Oblivion Drums, Ostinato Textures). Punish manual states release notes ship
  locally with the plugin.
- Warez-mirror numbers (Punish "1.0.2" on Go AudiO/PluginTorrent/VSTorrent)
  rejected under zero trust.
- **Soundsets = terminal skip class** (Natural Forces, Novo Essentials, Novo
  Modern Strings, Ostinato Textures — no discrete public version).
- **Redux guard (2026-09-16):** "Symphonic Destruction Redux" is a distinct
  successor product (heavyocity.com/products/symphonic-destruction-redux,
  Kontakt 7) — never stamp between it and Symphonic Destruction.
- VAST Impulse Engine is a native plugin (not a soundset) with an unpublished
  version — future maintenance angle: Wayback CDX on
  heavyocity.com/products/vast or a trusted press post-launch-update mention.
- Vocalise 1.1.0 (KVR-only @60): plausible NKS-integration update; corroborate
  via NI NKS partner listing or Heavyocity portal changelog before any raise.

### Heavyocity — re-audited 2026-09-17 (chip tier1-heavyocity-releasenotes-2026-09-17): 72 rows, 22 promoted / 8 observed / 42 skipped
- **Portal-gated verdict (confirmed):** Heavyocity Zendesk says the Portal
  "provides instant access to your products and updates" but the Portal is
  auth-walled; public support pages expose no systematic release notes or
  version map. Product pages carry marketing/specs only (verified first-hand:
  Damage 2, Gravity 2, Evolve, Punish, FURY, MicroFX Refiner). Current builds
  are genuinely Portal-gated; KVR is the primary public fallback.
- **KVR probe payoff:** the 2026-09-16 probe scaled to 22 promotions @60 +
  8 observed (KVR confirmed already-current: Evolve Mutations 2 1.2.0, FURY
  1.1.5, Calc-U-Synth 1.0, Scoring Guitars 2 1.0, Scoring Bass 1.0, Solo
  Textures 1.0, Sonara 1.0, Uncharted 88 1.0). Coordinator verified 8 pages
  first-hand (Evolve Mutations 1.2.0, Gravity 1.1.0, Gravity 2 1.0.0, AEON
  Rhythmic 1.2.0, MicroFX Shimmer 1.1.1, FORZO 1.0, DAMAGE Drum Kit 1.0) and
  corroborated 4 more via search-index attribution ("The version numbers are
  for <Product>"); worker extract-confirmed the rest. New @60s: Mosaic series
  ×5, Analog Hybrid Drums, Brickwall Drums, Intimate Textures, Ostinato
  Textures, FOUNDATIONS ×3, ASCEND, ASPIRE.
- **Ostinato Textures correction:** the 2026-09-16 "terminal soundset" label
  was wrong — KVR shows an explicit product version 1.0 (7.10.5 is the Kontakt
  requirement, NOT the product version). → 1.0 @60. Never stamp Kontakt 5/6/7/8
  requirement numbers onto Heavyocity libraries — the Kontakt-engine
  contamination guard is now the #1 Heavyocity integrity rule.
- **Evolve 1.5 @65 (press exception):** the only dated public Heavyocity
  version announcement found in ~16 years — Rekkerd (2010-08-02), SonicScoop,
  AudioFanzine all name Evolve 1.5; KVR agrees. Multi-source press beats
  KVR-only → @65, still below the official-release-notes bar.
- **Stale-snippet trap:** a search snippet once showed "MicroFX Refiner —
  Change Log — Version 1.0.0"; that section is ABSENT from the live product
  page. Never treat a stale snippet as a current public oracle without
  live-page confirmation.
- **Unresolved:** Damage Machina (KVR found, direct fetch failed — terminal
  for this turn, retry next cycle); NOVO Essentials (KVR lead unverified).
  **Probe resolution 2026-09-17 (maintenance chip):** KVR search index
  shows NO "Product, Version, N" entry for Damage Machina (no dedicated
  product page — release news article only, 2025-05-16, confirming the
  2026-09-15 assault note) and the NOVO Essentials product page carries NO
  version field. Under the KVR version-probe discriminator rule this is a
  NEGATIVE probe, not a fetch failure — do NOT re-queue these as fetch
  retries. Both remain principled skips (Kontakt content / soundset class,
  no discrete public version).
  Warez-refused: Damage 2 1.1.0 changelog details, Symphonic Destruction
  1.1.0, FORZO 1.1.0.
- **Identity guards:** Damage ≠ Damage 2; Gravity ≠ Gravity 2; Gravity Packs
  ≠ Gravity host version; bundles give no component versions.
- **Maintenance:** re-probe Heavyocity surface only if a live public
  changelog/version surface launches. KVR remains the fallback at the @60
  ceiling; official notes are the raise path if they ever go public.

### Slate Digital — re-audited 2026-09-17 (chip tier1-slate-releasenotes-2026-09-17): 39 rows, 1 promoted / 18 observed / 20 skipped. Surface fully mapped; maintenance mode.
- RE-FETCH RECIPE (verified 2026-09-17): official release notes live on **support.slatedigital.com** (Zendesk), NOT slatedigital.com. Monthly rollup: `/hc/en-us/articles/19356738119955-September-2023-Release-Notes` (best official version map, but STALE — last updated ~Apr 2025). Per-version articles exist (e.g. `.../12998887383315-VMR-2-10-1-3-Release-Notes`, `.../33303974771475-VBC-1-3-5-0-Release-Notes`, `.../33303375763347-VTM-1-2-6-0-Release-Notes`). Global update wave (no builds, confirms which products changed): `.../39691099088915-March-2025-Announcement-New-Plugin-Updates-Machine-Based-License-Activation`. **CRITICAL:** per-product CURRENT versions exist only inside the Complete Access Hub app (⋯ → Release Notes), per official article `.../41670869343507-Where-to-Find-A-Plugin-Version-Number` — not web-reachable. Never stamp the Hub app version (2.18.0, Sept 7 2026) onto products.
- The public official surface LAGS the KVR-sourced catalog versions for nearly every product (verified 2026-09-17: official notes older than catalog on VTM, VBC, VMR, FG-X 2, Fresh Air, Infinity EQ, MO-TT, MetaTune, Murda Melodies, Storch Filter, VerbSuite). KVR remains the version signal at the @60 ceiling; official notes are the raise path when they name a NEWER build (Repeater 1.1.4 @60 → 1.2.2 @90, Sept 2023 notes, Jan 30 2023 entry).
- **Rack-vs-module rule:** VMR rack version ≠ module versions. FG-2A, FG-A, FG-Stress are VMR rack modules (also standalone "Virtual Modules" in staggered rollout from Sept 2025); VBC FG-Grey/FG-MU/FG-Red are VBC Rack modules — no standalone module builds are published anywhere; NEVER transfer the rack/bundle version (VBC 1.4.2.0) onto module rows.
- **FG-X identity:** FG-X 2 is a DIFFERENT product from legacy FG-X (official FAQ). "FG-X Mastering Processor" ≡ "Slate Digital FG-X" (same legacy product — duplicate rows, flagged 2026-09-17, not merged unilaterally). Legacy FG-X discontinued (end of support Nov 25 2022); official legacy installer offers 1.3.2 vs catalog 1.4.0.4 @82 (Gearspace) — no churn without positive evidence; watch item.
- **VCC components:** Virtual Channel / Virtual MixBuss are Virtual Console Collection components, not independently versioned. RC-Tube 2.0 belongs to the RC-Tube package (RC Tube Channel / RC Tube Mixbuss) — never apply to VCC rows.
- **Content class:** Classic Tubes 3 Expansion Pack = VMS mic-model content (FG-49/67 MKII/37A/44/47 MKII), no independent version by design.
- **VSX attribution:** KVR attributes VSX to Steven Slate (separate company), not Slate Digital — manufacturer attribution flagged for review 2026-09-17.
- **Corroboration sources that worked:** advanceduninstaller.com installer DBs (MetaTune max 1.2.3.0, FG-X 2 max 1.0.15.0, Stellar Echo SD-201 max 1.0.13.0 — all matched catalog). KVR staleness note: Heatwave KVR 1.0.3 < catalog 1.1.1 — never downgrade on stale KVR.
- **No-churn rule:** do not demote existing @60-65s on re-audit without positive evidence of error (MO-TT 1.1.18.0 kept despite official notes referencing a 1.1.6.0 preset update — ambiguous version line).

### Output (Output Hub) — re-audited 2026-09-17 (chip tier1-output-releasenotes-2026-09-17): 22 rows, 0 promoted / 11 observed / 11 skipped. Surface fully mapped; maintenance mode.
- RE-FETCH RECIPE (verified 2026-09-17, weekly): open the Help Center
  collection page → follow the "Release Notes" article → parse the first H2
  newest-first, of form `## <Product> X.Y.Z *(Released ...)*`.
  Arcade: `support.output.com/en/collections/10910185-arcade` →
  `.../articles/16102145-arcade-release-notes` (2.16.1, 2026-08-04 —
  re-verified current 2026-09-17, @95).
  Co-Producer: `support.output.com/en/collections/12085399-co-producer` →
  `.../articles/16112647-co-producer-release-notes` (1.6.1, re-verified
  2026-09-17, @95). CAUTION: newest H2 reads "Co-Producer 1.6.1 + GUI v1.6.5:
  Re-imagine 2.0 (Released Sep 16th, 2026)" — "Re-imagine 2.0" is the FEATURE
  name, GUI v1.6.5 is a sub-component; product version stays 1.6.1. Never
  stamp the feature name as the version.
- FX (Portal, Movement, Thermal) and Kontakt engines (Substance, Exhale, Rev,
  Signal, Analog Strings, Analog Brass & Winds) have NO vendor-published
  versions — the FX Help Center collection (10910220-fx, 37 articles, checked
  2026-09-17) has no release-notes article; the "Installing, Activating, and
  Updating" KB article names no versions; output.com product pages name no
  versions. KVR product pages are the only public signal — per CONFIDENCE.md
  rubric KVR-only scores 55–70 (skeptical default ~60); do NOT churn existing
  @65s down on re-audit without positive evidence of error.
- Kontakt Player version trap: KVR pages pair the instrument version with the
  Kontakt Player version (Exhale "1.1.1 / 5.0.0", Rev "1.1.1 / 8.0.0") with the
  note "The OS and Format icons below are for the latest version of Kontakt
  Player. The version numbers are for [Instrument]." Never stamp the Player
  version onto the instrument.
- Expansion-pack trap: Substance expansions (Dystopia, Booty Bass), Exhale
  "Barely Vocals", REV X-Loops are separate content/products — never stamp
  onto the instrument.
- KVR Mac/Win stale-field note: Thermal KVR shows 1.3.0 / 1.2.1 across the
  two OS fields — stale KVR-side field; first field + catalog agree on 1.3.0.
- KVR orphan-version rule: Analog Strings KVR showed an uncorroborated "1.2.0"
  alongside 1.0.1 (2026-09-17) — REFUSED without independent corroboration;
  watch item for future runs.
- Arcade Lines and the Expansions meta-entry: no version exists or will —
  permanent SKIP class (re-verified 2026-09-17: official release notes version
  the engine only).
- Failed (verified 2026-09-16, re-confirmed 2026-09-17): appcast/Sparkle/
  updates.xml searches (nothing — updates ship through the signed-in Hub
  only); Wayback CDX (no artifacts); PluginBoutique pages (no version fields);
  press (no version numbers for FX/engines).

### Steinberg — re-audited 2026-09-17 (official surface fully mined; 17 raises)
- Steinberg has public version-history PDFs per product — gold. Re-fetch recipe:
  current products → `o.steinberg.net/en/support/downloads/<product>.html`;
  legacy → `o.steinberg.net/en/support/unsupported_software/<product>.html`;
  HSO-style libraries → `download.steinberg.net/downloads_software/<path>/<ver>/<Product>_VersionHistory.pdf`;
  quick registry → Help Center article `helpcenter.steinberg.de/hc/en-us/articles/360007633160`
  (VST Plug-ins / VST Instruments tables, updated 2024-06-18 — lists RND Portico 1.2.1,
  Padshop Pro 1.2.20). No 429s observed at ≤2 parallel fetches.
- **Legacy soundset rule (established 2026-09-17):** o.steinberg.net download pages DO name
  per-product versions for the 2012 installer line (Dark Planet 1.1, Hypnotic Dance 1.1,
  Triebwerk 1.1, HSO VST-SIS 1.1.1) — but every page states newer content versions are
  Download Assistant-only. Public installer version = last PUBLIC version; do not claim it
  as the current content version. HSO generation guard: legacy HALion-engine HSO 1.5 (2009)
  ≠ VST Sound Instrument Set line 1.1.1 — never cross-map.
- **Steinberg Classics Collection (Aug 4, 2026):** free VST3 re-releases of Neon, Karlette,
  VB-1, CS-40, LM7 — official product page `steinberg.net/vst-instruments/steinberg-classics`
  + press-release PDFs on `ocl-steinberg-live.steinberg.net`. Steinberg publishes NO numeric
  versions for collection components; KVR lists them at unchanged versions (Neon 1.2,
  Karlette 1.0). Do not invent a "1.0.0" for the collection.
- **Identity guards (all verified 2026-09-17):** CS-40 ≠ Model-E (press confusion);
  LM7 ≠ LM-4 MarkII; Electric Bass (HALion-era) ≠ VB-1; Neo Soul Keys / Neon Drifts ≠ Neon;
  Padshop Pro ≠ Padshop 2; SpectraLayers Pro 8 ≠ SpectraLayers 13.
- **Discontinued (official evidence):** RND Portico 5033/5043 (delisted from steinberg.net,
  no Steinberg Licensing port, last update Dec 2020) and Padshop Pro (Steinberg PR Nov 2019
  "will be discontinued") are now `discontinued=1`.
- **Legacy fallback (verified 2026-09-16, re-confirmed 2026-09-17):** RND Portico pair,
  Padshop Pro, Neon had no public download page at chip time — the Help Center article and
  unsupported-software pages have since closed that gap. KVR @60 remains the floor for
  VB-1 / Model-E / MGuitar / SpectraLayers Pro 8 (forum-user reproduction only).
- Omnivocal is identity-ambiguous (KVR lists "by Yamaha"; Steinberg's distribution; Cubase 15
  stock component, Download Assistant-only) — stays @60 unless a public standalone installer
  appears. Nanologue: App Store mirror (AppBrain) is authoritative over KVR (1.0.2 > KVR 1.0.1).
- Cubasis 3: App Store Version History is the primary but apps.apple.com is unfetchable from
  our browser service (2026-09-17) — Steinberg staff forum announcements + trade press are the
  working substitute (3.8.6, Sept 4 2026, still sold, no Cubasis 4).

### 8Dio (Soundpaint hub) — re-audited 2026-09-17 (official timeline oracle found; Download Manager API probe NEGATIVE)
- **OFFICIAL TIMELINE ORACLE (discovered 2026-09-17):** `https://8dio.com/pages/company`
  carries a manufacturer-owned, dated release timeline (2011 → Feb 2026) with explicit
  versioned entries — the best 8Dio maintenance oracle. Re-fetch recipe: fetch the page,
  extract dated entries under "History", respect the `(Soundpaint)` / `(8Dio)` platform
  tags on every entry. Versioned yields so far: "Majestica 2.0" (Aug 2021), "The New
  Century Strings 2.0 Edition Sordino" + "The New Century Strings 2.0 Bundle" (Nov 2020),
  "Intimate Studio Strings V1.3" (Jul 2019), "Anthology Strings 1.3" (Jul 2019),
  "Liberis Angelic Choir 2.0" (Jan 2017). Entries without version numbers are release
  announcements, not version claims.
- **PLATFORM GUARD (enforced 2026-09-17):** timeline entries tagged `(Soundpaint)` are a
  DIFFERENT version line — never stamp them on Kontakt rows. Sep–Nov 2024 "(Soundpaint)"
  V2.0 entries (Epic Toms Ensemble, Everwave, Estonica Grand Piano, Epic Frame Drums
  Ensemble, Supercluster, Epic Dhol Ensemble, 1975 Soul Guitar V2.0) are Soundpaint-platform
  re-releases. Soundpaint ENGINE versions (1.0 Oct 2021 → 2.0 Nov 2022 → 2.5 Jun 2023 →
  3.0 Jan 2024 → 4.0 Mar 2025) are published on soundpaint.com news — hub-app version
  line, not library versions. No Soundpaint manufacturer exists in the catalog yet; if one
  is added, engine versions go there.
- **Download Manager API probe (2026-09-17): NEGATIVE.** No public unauthenticated endpoint
  exposing per-library versions exists. The Download Manager requires a per-product serial
  code (every manual states this); 8dio.com account download links are login-gated; no
  public manifest/version.json/appcast found via search. The serial-code-per-product
  entitlement architecture (Continuata-era) makes a public manifest unlikely to ever exist.
  Do not re-probe without new evidence of a public endpoint.
- **VI-Control ledger: exhausted (2026-09-17).** The update-ledger thread
  (`.../latest-8dio-library-updates.124714/`) has exactly 35 posts / 2 pages, all May 2022 —
  later posts add zero new version reports. No newer VI-Control 8Dio update threads exist
  (multiple query angles). Ledger remains usable at yellow with the full chain in notes;
  treat every entry as potentially superseded.
- **Official corroboration path (verified 2026-09-16, re-swept 2026-09-17):** 8dio.com product
  pages carry explicit "2.0"-generation branding in marketing copy — re-fetch recipe:
  search "<Product>" site 8dio.com/products → open → scan for "New in 2.0" /
  "<Product> 2.0 is the…".
- **Suite→component guard (enforced 2026-09-16):** "Century Ensemble Brass 2.1
  (Lite stays V2.0)" is SERIES-level — stamping 2.1 onto section instruments
  (French Horns / Trombones / Trumpets) was REJECTED, and no standalone "Century Ensemble
  Brass" (non-Lite, non-bundle) row exists, so 2.1 has no attachable row. Explicit
  per-edition entries ("Lite stays V2.0") are the exception.
- **Mixed-version bundle guard (enforced 2026-09-16):** never stamp a component version
  onto a bundle.
- **New-product watch list (no public versions; do NOT add versionless rows):** Majestica Pro
  + Majestica Ultra (Nov 2023, 8Dio), Lacrimosa Pro (Sep 2024, 8Dio). Timeline-confirmed as
  real 8Dio releases; no version numbers published anywhere. Re-check on the maintenance
  loop via the timeline oracle.
- Do NOT budget KVR for 8Dio (no product DB coverage for 8Dio Kontakt instruments — only
  forum/video pages). Facebook page fetch is login-walled; press yields nothing post-2022
  for Kontakt library versions.
- Soundsets and bundles = terminal skip class: no discrete public version; account/installer gated.
- Blendstrument products are Kontakt instruments, not Soundpaint products.
### Freshness-path notes — already-green vendors (from 2026-09-16 green re-checks)
- **Kilohearts (maintenance recipe verified 2026-09-17):** ONE fetch of
  https://kilohearts.com/download covers EVERY Kilohearts row — the page
  states verbatim "All Kilohearts plugins share a code base and therefore
  they all have the same version number at any given time", and carries a
  dated changelog (top entry = latest). Read the installer version
  ("Kilohearts Installer X.Y.Z for Windows/Mac") + changelog top entry;
  diff both on every 12h pass. Any single re-check row re-verified = all
  rows re-verified. Individual per-product builds do not exist by design —
  never invent one from a generation.
- **FabFilter (maintenance recipe verified 2026-09-17):** ONE fetch of
  https://www.fabfilter.com/download covers the whole line — per-plugin
  "version — release date" entries ("Download FabFilter Pro-Q 4 … 4.13 —
  Jun 25, 2026"). Diff the version column on every 12h pass. Legacy line
  (Pro-C 2 etc.) lives at /support/downloads: "Legacy plug-ins are
  superseded by newer plug-in versions, but we still keep them up-to-date" —
  re-check for exact newer builds before any raise; do NOT stamp the
  current-generation version onto legacy rows.
- **Cytomic (HTML-grep recipe verified 2026-09-18):** installer filenames
  live in the homepage HTML even though the download buttons are
  JS-triggered — plain curl of https://cytomic.com/ + grep
  `The[A-Za-z]*_v[0-9.]*` returns TheGlue_vX.Y.Z / TheDrop_vX.Y.Z /
  TheScream_vX.Y.Z (verified 1.9.3 / 1.10.5 / 1.3.3, zero churn). No
  SquidGuard captcha hit from datacenter egress on this endpoint. Diff the
  three filenames on every 12h pass — no browser fetch needed. Search
  snippets for Cytomic versions are stale/weak third-party only; ignore.
- **Klanghelm (rendered-session recipe verified 2026-09-18):** klanghelm.com
  is JS-gated for fetch-service text extraction but FULLY browsable in a
  rendered browser session. Download labels on product pages carry exact
  versions: klanghelm.com/contents/products/DC1A ("Download DC1A:
  (version X.Y.Z)"), /IVGI, /TENSjr (verified DC1A3 3.5.0, IVGI2 2.5.0,
  TENSjr 1.0.7). Diff the labels on every 12h pass. **MJUC is a permanent
  vendor-unconfirmable class:** the vendor publishes NO MJUC version number
  (product page shows none, demo downloads login-walled, news page last
  numbered release 1.4.2 Feb 2020; 2021/2023 maintenance updates unnumbered).
  On each pass check the news page (contents/common/news.html) for a
  numbered MJUC release; without one, keep MJUC yellow — never re-raise on
  third-party installer filenames alone (see 2026-09-18 demote @70→@60).
- **Goodhertz (one-fetch recipe verified 2026-09-17):** the whole line is ONE
  shared bundle — "This is the installer for all Goodhertz plugins (both
  trials and purchased plugins, all versions). No other installer is
  required." ONE fetch of http://goodhertz.com/downloads/ covers ALL rows:
  read the "Latest Bundle Release / All the Goodhertz plugins" heading for
  `Goodhertz X.Y.Z` + date (verified 3.14.1, June 30 2026). Per-product
  release-note items (Vulf, Faraday, Loudness, VCME) all sit under the one
  bundle heading — no product-specific version strings exist. Hard ban
  respected in practice: rows legitimately share the bundle build per the
  vendor's own model. NOTE: goodhertz.com/changelog is dead — never route
  the check there.
- **Valhalla DSP (per-product recipe; pointer only in this file — full
  recipe lives in playbooks/valhalla-dsp.md):** fetch each product page at
  valhalladsp.com/shop/<reverb|delay>/<slug>/ and find the "Current
  Version: …" line — do NOT assume its position: it sits at L117 on Plate,
  L205 on VintageVerb, L261 on Delay (below the fold there). Use
  browser.find for "Current Version" instead of reading from a fixed
  line_start. Known URLs (verified 2026-09-10):
  shop/reverb/valhalla-room/, shop/reverb/valhalla-plate/,
  shop/reverb/valhalla-vintage-verb/, shop/reverb/valhalla-shimmer/,
  shop/reverb/valhalla-supermassive/, shop/reverb/valhallafutureverb/,
  shop/delay/valhalladelay/, shop/delay/valhalla-freq-echo/ —
  SpaceModulator and ÜberMod page URLs were never written down (record them
  on next fetch; they're not in the main shop flow — try the plugin index
  pages or search-engine discovery). Dual Mac/Win: accept the Mac current,
  note Win in evidence (Plate 1.6.8/1.6.3, Shimmer/FreqEcho/SpaceModulator/ÜberMod @88–92).
  demos-downloads/ installer filenames corroborate. /my-account/downloads/
  is login-walled and unnecessary. 2026-09-17: Valhalla freshness block
  (10 rows) could not run — browser-service fetch infra failure, 0/10 pages;
  values NOT re-confirmed; RE-QUEUE on the 12h loop. 2026-09-18: worker
  block failed AGAIN (0/10, same pattern); parent single-fetch recovery
  confirmed 3 rows first-hand (Delay 3.0.5, Plate 1.6.8/1.6.3,
  VintageVerb 4.0.5 — all stored values held). **valhalladsp.com reads as
  fetch-service-flaky, not vendor-blocked:** parallel batches die, single
  sequential fetches sometimes succeed. Recipe: retry individually with a
  pause, not in parallel bursts; if a page 404s/stalls, mark skipped and
  re-queue — do not churn the whole block. Remaining 7 (Room, Shimmer,
  Supermassive, FutureVerb, FreqEcho, SpaceModulator, ÜberMod) re-queued
  for the next 12h pass. 2026-09-18 2218 chip: THIRD consecutive chip with
  valhalladsp.com fetch-service failure (first single sequential fetch died
  before any result; block stopped per no-hammer rule) — 7 rows remain
  unverified since 2026-09-10, the oldest unverified tier-1 values in the
  catalog. Consider a CDN-fronted or alternate-egress fetch if a 4th chip
  fails; do NOT route around via unauthenticated scraping tricks.
- **Image-Line legacy VSTs (legacy recipe verified 2026-09-17):** IL
  publishes NO public version data for legacy VSTs — VST SKUs discontinued
  (only sold as part of the discontinued FL Studio + ALL Plugins Bundle),
  current shop sells "FL Studio Only" native versions, legacy installers sit
  behind the My Account sign-in. @60 KVR ceiling HOLDS for these rows.
  IL-direct promotion is possible ONLY through pre-discontinuation official
  announcements — e.g. image-line.com/fl-studio-news/toxiciii-updated-to-v1-41/
  ("ToxicIII updated to v1.41") promoted Toxic III 1.41 to @90 (identity
  guard: Toxic III ≠ Toxic Biohazard). Corroboration oracles, in order:
  KVR news announcement threads quoting IL → KVR product-page "Product,
  Version" text → IL forum threads. Future leads: archive.org "Image-Line
  Plugin Installers" collection (installer filenames may carry versions),
  forum.image-line.com version-history posts. Open anomalies: Sawer 1.1.2
  (catalog) vs a 2015 KVR-forum user report of "Sawer v1.2.2 64bit" — single
  weak user report, needs an installer-level check, not a raise; Wasp 2.0.17
  remains single-source KVR (uncorroborated anywhere).
- **iZotope legacy freeze:** the release-notes URL is now a legacy-downloads
  page with NO version numbers; iZotope support confirms R2 / R2 Surround / R4
  discontinued (superseded by Stratus/Symphony). FREEZE discontinued
  Exponential Audio products at last observed version — stop re-digging them.
- **Plugin Alliance:** plugin-alliance.com text fetch is automation-blocked —
  route Installer-version reads via an alternate source (never the blocked
  fetch); vendor stopped for the chip per rate-limit rule.
- **Softube:** RN index shows 2.6.42 (2026-08-21) but no article links are
  exposed — CONSTRUCT the article URL from the version/date slug
  (…/release-notes-for-version-2-6-42-(released-on-august-21th-2026)) and
  ALWAYS inspect article scope before ANY raise: 2.6.42 applied ONLY to
  "Monoment Bass, Parallels, and Statement Lead" — no "All plug-ins" scope,
  so the other targets stayed at 2.6.41. Family convention (2.6.x) is not a
  per-product version.
- **Universal Audio:** official version-history article is DEGRADED — renders
  oldest-first, tops out at 8.7.4 (2016); v9–v12 entries absent in fetched
  text. Do NOT use it for freshness until a working render is confirmed.
  Replacement angle: official UA software-download page version stamp or
  another UA-owned current-release endpoint. Never use the unofficial GitHub
  UAD mirror.
- **u-he:** dl.u-he.com/releases/ is FRESHER than the public
  u-he.com/downloads/release-archive/ index — the archive LAGS (Zebra 3:
  3.0.1/build 22165 in archive vs 3.0.2/build 22175 on dl.u-he.com).
  Check dl.u-he.com/releases/ first. Exact-filename decode rule:
  `<Product>_<ver>_<rev>_*` (148→1.4.8, 212→2.1.2, 301→3.0.1);
  disambiguate Hive 1.x vs 2.x and Repro-1 vs Repro bundle by filename stem
  inside the product folder. **Re-fetch recipe (2026-09-17 chip):** fetch the
  index, take the highest `<ver>` per product stem across Mac/Win/Linux rows
  (ignore `_20250812`-style dupes); `Uhbik_<ver>` folder = Uhbik 2;
  `Zebra_Legacy_<ver>` = the whole Zebra2 family line (Zebra Legacy,
  Zebralette, Zebrify, The Dark Zebra share the binary line — but keep
  rows separate); `Filterscape_<ver>` covers all four Filterscape rows.
  **Beta-stamp trap (caught 2026-09-17):** `TyrellN6_300_public_beta` files
  are PUBLIC BETAS, not stable — never decode a `public_beta` filename into
  a stable version. Last stable Tyrell N6 is v3.0 (Apr 2013); u-he.com's
  TyrellN6 page is literally titled "TyrellN6 Beta". **Freebie-soundset trap:**
  Bazille Strobos, Blue Flamingo, RePercussion, Zebratron are preset
  SOUNDSETS (paid except Zebratron), not plugins — KVR lists them as
  "Soundware". Tag soundset; their KVR "Product, Version" is the soundset
  release, not a plugin build. **Skip classes:** 24 soundsets + 6 bundles
  (versionless by design); 4 eurorack rows are HARDWARE (CEN2RION,
  CVilization, Melt, Wiretap); The Bazille Cookbook is a publication.
  Beatzille (Beat-magazine freebie) is not on the releases index — keep per
  unverified≠disproven.
- **MeldaProduction:** kernel page ("kernel version: 17.10.01") + MPluginManager
  installer (02.30) are healthy re-fetch paths; installer version is NEVER
  mapped onto plugins.
- **Eventide (H910 conflict RESOLVED 2026-09-17 — it was misattribution, not
  a genuine 3.12.4):** the stored 3.12.4 on `eventide--h910-harmonizer`
  (2026-09-10, bare "Version 3.12.4" snippet, no product attribution) was a
  grab from the 3.12.x installer-string family (H949 Harmonizer and
  Omnipressor are GENUINELY 3.12.4 — corroborated live; Blackhole and
  UltraReverb are genuinely 3.11.4). The H910 product's OWN downloads page
  tops at 2.5.11 with a full 2.x trail and no 3.x anywhere — corrected to
  2.5.11 @92. **Zero-trust rule (Eventide-specific):** bare "Version X.Y.Z"
  installer snippets are unsafe for Eventide — the shared
  installer-framework change text ("Added initial screen reader support to
  the installer", iLok Licensing Components) ships under different numbers
  per product line (3.12.x vs 3.11.x vs 2.5.x). Only accept installer rows
  with EXPLICIT product attribution ("<Product> Installer (Mac 64-bit)
  Version X.Y.Z"). **Wayback is NOT a fallback:** archive.org availability
  API returns no snapshots for `eventideaudio.com/downloads/?product=*`
  (checked 2024–2026; whole query-URL family unarchived), and
  web.archive.org snapshot fetches fail through the browser service
  (infra, not rate-limiting). Installer rows remain JS-hidden in direct
  fetches; the product-scoped Release Notes section on each
  `downloads/?product=<Name>` page is the working freshness oracle.
- **Voxengo:** official per-product user-guide PDFs carry exact versions
  (voxengo.com/files/userguides/Voxengo<Product>_en.pdf pattern — verified
  for Elephant 5.8, GlissEQ 3.19, SPAN 3.24, TEOTE 1.16, Voxformer 2.23);
  product pages carry NO version. CurveEQ's EN guide is not search-indexed —
  search the exact filename, never guess the URL.
- **sonible:** blog user-guides are NOT a version source — smart:comp 3,
  smart:gate, smart:reverb 2 guides have NO changelog section; smart:limit
  guide is STALE (tops at 1.1.0 vs real 1.1.5); EN manual PDFs use x.x.x
  placeholders. **help.sonible.com release-notes question — ANSWERED
  NEGATIVE 2026-09-17:** the Zendesk help center has no release-notes
  article in the search index (only "How can I update my plug-in to the
  latest version?", which routes to the auth-walled "Downloads in My
  Account"); `site:help.sonible.com` changelog/release-notes queries
  return zero help-center hits. **Working oracle (verified 2026-09-17):**
  per-product pages' specs table carries a "latest version" line —
  `sonible.com/<slug>/` (e.g. smartlimit → "latest version 1.1.5").
  The line lives in the raw HTML specs grid and is MISSED by browser text
  extraction — grep the page HTML for "latest version". smart:limit KVR
  1.1.6 vs manufacturer-page 1.1.5: manufacturer page wins, KVR
  uncorroborated. No public Sparkle/appcast feed found.
- **Newfangled Audio (snippet-fallback recipe verified 2026-09-18):**
  per-product release-notes pages at
  newfangledaudio.com/<slug>-release-notes; the Eventide downloads portal
  mirrors versions for free/distributed titles
  (eventideaudio.com/downloads/?product=<Name>) — prefer Eventide downloads
  / RN, marketing free-download DMGs can lag. **Fallback when page fetch
  fails:** search-engine snippets of the RN pages reliably surface the
  newest "X.Y.Z (M/D/YYYY)" heading when the query names the exact page
  (e.g. "newfangledaudio.com generate release notes latest version") —
  viable and cheaper than full fetches for unchanged products. Snippet-only
  confirms = observed (exact match to stored); never raise from a snippet
  alone.
- **Compat re-verify failures:** Klanghelm (klanghelm.com JS-gated) and TAL
  (statement page not directly addressable) could not be re-verified this
  chip — values KEPT per unverified≠disproven (prior-day vendor quotes on
  record), flagged for JS-rendered browser-task re-confirmation. Cableguys
  and Xfer kept on product-scoped vendor evidence with the line-wide caveat
  documented in notes. **2026-09-18 KVR-mirror probe (Klanghelm):** KVR
  product pages found for MJUC and TENS jr but neither snippet surfaced an
  explicit "Product, Version" value; no KVR product-page URL surfaced for
  DC1A3 or IVGI2. Probe RESOLVED NEGATIVE for this cycle — the KVR mirror
  is not a working oracle for Klanghelm. Next angle stays the JS-rendered
  browser-task route; klanghelm.com/downloads page is the target.
- **changelog_url zero-trust:** must be a FIXED vendor-wide changelog page —
  cleared Antares (antarestech.com/blog is a blog, not a changelog) and
  Sugar Bytes (per-product Looperator URL). Per-product release notes go in
  manufacturer notes as re-fetch recipes, never in changelog_url.
- **Ledger safety:** NEVER finalize claims with a broad LIKE-pattern UPDATE
  (2026-09-16: `plugin_id LIKE 'universal-audio--uad-%'` wrongly flipped 13
  of Coordinator Y's claims to skipped). Finalize by exact plugin_id lists
  only; verify counts before/after every batch write.

## Future-maintenance design

- Every vendor playbook above must converge on a **re-fetch recipe**: exact
  URL(s), what to parse, expected cadence, what "newer" looks like. Green
  freshness checks execute the recipe; they never rediscover.
- Playbooks decay (vendors redesign sites) — the reflect loop re-verifies
  PATH HEALTH, not just versions. A dead path gets a replacement path logged
  here before the old one is dropped.
- **Decayed paths (logged 2026-09-16 — do not run without a new angle):**
  Eventide installer rows (JS-hidden; Wayback NOT viable for
  downloads/?product=* — availability-API negative 2024–2026; H910
  misattribution corrected 2026-09-17, use the attribution rule), PSP
  version pages, Spitfire legacy library pages, Plugin Alliance vendor fetch
  (automation-blocked).
- **Secondary sources proven this assault (2026-09-16):** KVR "Product,
  Version" fields as a version-hiding-vendor source (UVI, PSP, Sugar Bytes,
  Sonnox, Eventide H949 — always demand the attribution line); Music-press
  verbatim releases @88 when unambiguous; threebodytech.com on-page installer
  version strings.
- **Structurally-blocked maintenance classes (public re-probes banned — they
  can't move them):** Spitfire app-gated library SKUs (~60, no public
  per-library version channel), UVI Portal-only soundbanks (versions inside
  UVI Workstation/Falcon only), Steinberg Download Assistant libraries
  (no public per-library versions), DAW-bundled components (versioned with
  the DAW). Schedule these as explicit maintenance tracks when app
  telemetry (Info.plist CFBundleVersion / VST3 version resources) is
  available.
- **8Dio long lead:** the VI-Control ledger is frozen at May 2022 and the
  "New in 2.0" branding corroboration has exhausted the easy Century surface.
  Next angle: read-only probe of the 8Dio Download Manager API, or
  per-product Wayback snapshots of download pages.
- Long-term: the DAW Plugin Manager app itself scans installed plugin binaries
  (Info.plist CFBundleVersion, VST3 version resources). That installed base is
  the future crowdsourced ground truth for maintenance — catalog work should
  record bundle-version ↔ marketing-version mappings whenever found, so app
  telemetry can be joined later.

## Integrity rules (unchanged)

No invented versions. Exact product identity. Banned: successor-generation,
suite→component, hub-version stamping, DAW-bundle→plugin, guessed values.
Coordinator re-verifies every raise. No sign-ins, no purchases, no outreach.
On 429/block: stop that provider for the chip, log, continue elsewhere.
