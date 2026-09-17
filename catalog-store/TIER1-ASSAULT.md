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

### Waves (Waves Central hub) — assault complete 2026-09-16 (V17 production line cleared)
- RE-FETCH RECIPE (verified 2026-09-16): (1) Open
  `https://www.waves.com/downloads/latest-offline-installer` — the
  "Includes: All Waves plugins V17 (see full list below)" block (last updated
  2026-06-23) names every product in the current generation installer.
  (2) Open the KVR `/product/<slug>-by-waves` (or `/details`, or the
  `/marketplace/<slug>-by-waves` fallback) — per-product rows give the uniform
  build (currently 17.1.42.50). Waves ships one build per generation across
  the whole line, so KVR per-product + installer-list corroboration is solid.
  (3) `https://www.waves.com/downloads/release-notes` for named per-product
  entries ("Fixed in ReelADT", "Fixed in TG12345", "Fixed in Magma BB Tubes").
- **GATE NOTE — RESOLVED 2026-09-16 (chip tier1-assault-2026-09-16-1318):** both
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
  StealthPedal CS / StealthPlug CS = hardware bundles; their KVR
  "Product, Version" headers are driver/hardware builds — skip class.

### Spitfire Audio (Spitfire app) — assault complete 2026-09-16 (~60 app-gated SKUs are a maintenance-track class)
- Spitfire publishes public release notes / "what's new" per library.
- VI-Control forum has official Spitfire threads.
- **KVR discovery via site: search (verified 2026-09-16):**
  `site:kvraudio.com/product "<exact product name>" spitfire` — direct slug
  probes 404'd 12+; site: search surfaced real pages (ARO suite, marketplace
  entries). The KVR attribution rule still applies: require "The version
  numbers are for <Product>".
- **VI-Control version reports (verified 2026-09-16, 2 of 3 raises):**
  `site:vi-control.net "<product>" update` — users quote Spitfire App
  library versions; Spitfire staff post fix logs there (Albion Legacy 5.2.2
  @60 from a senior-member post; Alternative Solo Strings 1.0.3 @60 from a
  quoted Spitfire fix log — caveat: later silent updates possible).
- **Plugin-vs-library guard:** support.spitfireaudio.com changelog articles
  are Spitfire-owned @90 but PLUGIN-level — never stamp them onto library
  SKUs (BBC SO Discover Piano / Piano Core refused the BBCSO plugin 1.12.1
  stamp 2026-09-16).
- Structural flag: 19 ARO section SKUs (Core/Pro + percussion) are
  app-gated with no public per-library versions — do NOT stamp the shared
  ARO plugin build (KVR suite page 1.3.29) onto sections. Options: track the
  shared plugin as a separate identity, or leave versionless — needs Luke's
  call (flagged 2026-09-16).
- KVR slug rule (verified 2026-09-16): KVR converts em dashes in titles to
  triple hyphens `---` — e.g. `aska-matsumiya---crystal-bowls-by-spitfire-audio`.
- Lead for next chip: VI-Control users report Spitfire App version 2.0.1 for
  Albion ONE vs KVR 1.9.0 — left unraised (needs manufacturer verification).

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

### Universal Audio (UA Connect) — assault complete 2026-09-16 (bundle-version source: archives article 215267203; UADx has no public versions)
- UAD software release notes are public and versioned (UAD v10.x/11.x).
  Per-plugin versions ride the UAD bundle version — record the mapping.
- **CURRENT bundle-version source (verified 2026-09-16, 12 raises @90):**
  `help.uaudio.com/hc/en-us/articles/215267203` "UAD DSP Plugins and Drivers
  - Software Archives" (updated 2026-09-08) — read the "Archived UAD DSP
  Plug-Ins and Driver Direct Downloads" section for the "UAD XX.X.X
  (Current)" line. Re-check each chip. Per-plugin DSP versions ride the
  bundle; record the mapping per row.
- **Old version-history article is DEGRADED** (ends at 8.7.4, 2016) — the
  215267203 archives article replaces it for freshness.
- **UADx guard:** UA publishes NO public per-plugin UADx versions — stamping
  the DSP bundle version onto UADx native rows is an INVENTED version
  (per official UA forum, uadforum.com thread 65335: "We currently do not do
  release notes for UAC or UADx native plugins."). 12 UADx rows skipped
  2026-09-16. Lead: inspect builds.uaudio.com app manifests
  (UAD_12_0_0_602.pkg pattern) for UADx builds.
- LUNA is a separate version family — LUNA bundles (LUNA Pro Bundle 2)
  track LUNA (3.0 / renamed LUNA Studio 2026-09-14), never the DSP bundle.
- Lead: the archives article's "Related Articles -> UAD Version History &
  Release Notes" links to a www.uaudio.com redirect — resolving it should
  reveal where v9+ release notes live (needs a browser-task click).
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

### EastWest (Installation Center) — assault complete 2026-09-16 (engines-only versioning; bundles terminal skip)
- EastWest version history partly public; press covers major bumps.
- **Decisive manufacturer-negative (verified 2026-09-16):**
  soundsonline.com/support/updates versions engines ONLY (Installation
  Center, OPUS, Spaces II); libraries receive unversioned instrument
  updates — settle bundle/legacy skips against this page.
- **Bundles = terminal skip class** (8 logged 2026-09-16 — Hollywood
  Orchestra/Choires/Fantasy/Solo bundles, Hybrid Super Bundle): bundles
  receive no discrete product versions; OPUS/component versions must never be
  stamped onto them.
- **KVR 1.0 bundle headers = initial-release bookkeeping** (verified
  2026-09-16, Synth Super Bundle): not a maintained version; keep the
  terminal skip class.
- Legacy EWQL-era editions (SO Gold/Platinum Plus/Silver, SC Gold/Platinum):
  no discrete public version; never cross-map Hollywood Orchestra/Choirs
  successors onto them.
- Legacy fallback: when the Internet Archive is back, Wayback CDX the archived
  EWQLSO-era soundsonline.com update pages to close the historical avenue.

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

### Slate Digital — 0 remaining (hold with freshness checks)
- Slate publishes release notes publicly for VMR/modules.

### Output (Output Hub) — 0 remaining, cracked 2026-09-16
- RE-FETCH RECIPE (verified 2026-09-16, weekly): open the Help Center
  collection page → follow the "Release Notes" article → parse the first H2
  newest-first, of form `## <Product> X.Y.Z *(Released ...)*`.
  Arcade: `support.output.com/en/collections/10910185-arcade` →
  `.../articles/16102145-arcade-release-notes` (2.16.1, 2026-08-04).
  Co-Producer: `support.output.com/en/collections/12085399-co-producer` →
  `.../articles/16112647-co-producer-release-notes` (1.6.1, 2026-08-04).
- FX (Portal, Movement, Thermal) and Kontakt engines have NO vendor-published
  versions — the FX Help Center collection has no release-notes article.
  KVR product pages are the only public signal (Portal/Movement 1.3.0 @65);
  treat as floor, re-confirm against a future KB article before promoting.
  KVR lags the vendor (listed Arcade 2.15.0 while 2.16.1 was current).
- Arcade Lines and the Expansions meta-entry: no version exists or will —
  permanent SKIP class.
- Failed (verified 2026-09-16): appcast/Sparkle/updates.xml searches (nothing —
  updates ship through the signed-in Hub only); Wayback CDX (no artifacts);
  PluginBoutique pages (no version fields); press (no version numbers).

### Steinberg (Download Assistant) — assault complete 2026-09-16 (17 raises from official PDFs; Download Assistant libraries are a maintenance-track class)
- Steinberg has public version-history PDFs per product — gold.
- **Legacy fallback (verified 2026-09-16):** RND Portico pair, Padshop Pro,
  Neon have no public download page — KVR @60 is the working fallback
  (1.2.1.2 / 1.2.20 / 1.2, all exact-match existing currents). Steinberg-
  forums "no longer on website / no licensing port" thread (Nov 2023) is good
  discontinued-status evidence for RND Portico.
- Omnivocal is identity-ambiguous (Yamaha's product, Steinberg's
  distribution; Cubase 15 stock component, Download Assistant-only) — stays
  versionless unless a public standalone installer appears.

### 8Dio (Soundpaint hub) — assault complete 2026-09-16 (ledger frozen May 2022; Download Manager API probe is the next angle)
- **VI-Control update ledger (discovered 2026-09-16):**
  `https://vi-control.net/community/threads/latest-8dio-library-updates.124714/`
  — the opening post lists `<Library> <version>` pairs. Forum-sourced: needs
  corroboration or enters at yellow with the full chain in notes.
  **LEDGER IS STALE: OP last edited May 2022**; 8Dio's own updates page out
  of date (summer 2021). Do NOT budget KVR for 8Dio (no product DB coverage
  for 8Dio Kontakt instruments — only forum/video pages).
- **Official corroboration path (verified 2026-09-16):** 8dio.com product
  pages carry explicit "2.0"-generation branding in marketing copy —
  re-fetch recipe: search "<Product>" site 8dio.com/products → open →
  scan for "New in 2.0" / "<Product> 2.0 is the…". Verified: Century
  Sordino Strings ("Century Sordino Strings 2.0 is the largest and most
  advanced upgrade…"), Century Solo Trombone ("Century Brass 2.0 raises the
  bar…"). Next dig: run the branding sweep across all Century pages + search
  VI-Control for NEWER 8Dio update-report threads.
- **Suite→component guard (enforced 2026-09-16):** ledger lines like
  "Century Ensemble Brass 2.1 (Lite stays V2.0)" are SERIES-level — stamping
  2.1 onto individual section instruments (French Horns / Trombones /
  Trumpets) was REJECTED. Explicit per-edition entries ("Lite stays V2.0")
  are the exception.
- **Mixed-version bundle guard (enforced 2026-09-16):** Century Ensemble
  Brass BUNDLE 2.1 propose REJECTED — the VI-Control entry described the
  Ensemble component (2.1) while the Lite component remained 2.0. Never stamp
  a component version onto a bundle.
- Soundsets and bundles = terminal skip class: no discrete public version;
  account/installer gated.
- Blendstrument products are Kontakt instruments, not Soundpaint products.

### Freshness-path notes — already-green vendors (from 2026-09-16 green re-checks)
- **iZotope legacy freeze:** the release-notes URL is now a legacy-downloads
  page with NO version numbers; iZotope support confirms R2 / R2 Surround / R4
  discontinued (superseded by Stratus/Symphony). FREEZE discontinued
  Exponential Audio products at last observed version — stop re-digging them.
- **Plugin Alliance:** plugin-alliance.com text fetch is automation-blocked —
  route Installer-version reads via an alternate source (never the blocked
  fetch); vendor stopped for the chip per rate-limit rule.
- **Arturia:** pace fetches (arturia.com 429 observed 2026-09-16); product
  pages sometimes render manual-only (no Software section) — require the
  Software Version block before raising; verify slug aliases
  (chorus-dimension-d / chorus-jun-6 never fetched cleanly).
- **Softube:** RN index shows 2.6.42 (2026-08-21) but no article links are
  exposed — CONSTRUCT the article URL from the version/date slug
  (…/release-notes-for-version-2-6-42-(released-on-august-21th-2026)) and
  ALWAYS inspect article scope before ANY raise: 2.6.42 applied ONLY to
  "Monoment Bass, Parallels, and Statement Lead" — no "All plug-ins" scope,
  so the other targets stayed at 2.6.41. Family convention (2.6.x) is not a
  per-product version.
- **Arturia:** pace fetches (arturia.com 429 observed on prior chip; paced
  SEQUENTIAL requests had zero 429s this chip); product pages sometimes
  render manual-only (no Software section) — require the Software Version
  block before raising; next angle is render-wait or an Arturia Software
  Center data path; verify slug aliases
  (chorus-dimension-d / chorus-jun-6 never fetched cleanly).
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
  inside the product folder.
- **MeldaProduction:** kernel page ("kernel version: 17.10.01") + MPluginManager
  installer (02.30) are healthy re-fetch paths; installer version is NEVER
  mapped onto plugins.
- **Eventide:** installer-row versions can run AHEAD of the release-notes
  page (H910: stored 3.12.4 from installer row vs notes topping at 2.5.11).
  Kept under unverified≠disproven — do NOT downgrade on the notes page
  alone; verify via the installer row or Wayback before changing.
- **Voxengo:** official per-product user-guide PDFs carry exact versions
  (voxengo.com/files/userguides/Voxengo<Product>_en.pdf pattern — verified
  for Elephant 5.8, GlissEQ 3.19, SPAN 3.24, TEOTE 1.16, Voxformer 2.23);
  product pages carry NO version. CurveEQ's EN guide is not search-indexed —
  search the exact filename, never guess the URL.
- **sonible:** blog user-guides are NOT a version source — smart:comp 3,
  smart:gate, smart:reverb 2 guides have NO changelog section; smart:limit
  guide is STALE (tops at 1.1.0 vs real 1.1.5); EN manual PDFs use x.x.x
  placeholders. Next angle: help.sonible.com release notes (not yet located
  — open research question).
- **Compat re-verify failures:** Klanghelm (klanghelm.com JS-gated) and TAL
  (statement page not directly addressable) could not be re-verified this
  chip — values KEPT per unverified≠disproven (prior-day vendor quotes on
  record), flagged for JS-rendered browser-task re-confirmation. Cableguys
  and Xfer kept on product-scoped vendor evidence with the line-wide caveat
  documented in notes.
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
  Eventide installer rows (now JS-hidden; H910 conflict unresolved), PSP
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
