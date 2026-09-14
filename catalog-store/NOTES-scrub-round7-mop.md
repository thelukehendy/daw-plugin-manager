# NOTES — scrub round 7 mop (2026-09-09 PT)

Zero-trust version scrub mop. Start: **2348/2827** accepted. End: **2532/2827** (Δ **+184**). `verified_by=coding-assistant`. No git clone.

Primary method: **KVR Audio product pages** with explicit `Product Version` / `id="verwin"` (`source_kind=other`, `extract_method=kvr-product-page`), `evidence_snippet` quoting the verwin line, `content_hash` = SHA-256 of fetched HTML.

Secondary probes (mostly no new accepts): manufacturer public pages, Plugin Alliance `products.json` (leftovers 404/renamed), Homebrew casks for hub apps (Softube Central / Native Access already current; Toontrack Product Manager has no brew cask).

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| audiothing | 55 → 82/86 | **+27** | Instruments/soundware verwin (mostly **1.0**) |
| nugen-audio | 0 → 27/31 | **+27** | Full product line; skip Focus/Modern Mastering/Post/Producer (N/A) |
| slate-digital | 0 → 18/26 | **+18** | VMR/VTM/VBC Rack/Infinity/Meta*/etc.; FG-X via mastering-processor slug |
| acon-digital | 14 → 29/29 | **+15** | Studio* + DeEss/Extract:Dialogue 2 + AudioLiquid **complete** |
| united-plugins | 0 → 13/13 | **+13** | Core editions + Fire*/VoxDucker/Royal/Urban via `*-by-{label}-by-united-plugins` |
| cableguys | 7 → 19/21 | **+12** | Exact module Shaper product pages; skip Kickstart gen / ShaperBox 2 |
| d16-group | 20 → 31/33 | **+11** | Gen-1 pages only (distinct from `*-2-by-d16-group`) |
| output | 0 → 11/11 | **+11** | **complete** incl. Analog Brass & Winds |
| u-he | 23 → 31/58 | **+8** | Zebralette/Zebrify/Zebratron + soundsets with verwin; most packs N/A |
| synchro-arts | 0 → 7/10 | **+7** | RePitch 2 / VocAlign*/Revoice Pro; skip dual VocAlign Pro / alpha Doubler |
| air | 0 → 5/26 | **+5** | Boom/DB-33/Structure/Xpand!2/MiniGrand; AIR* Creative Collection effects have no KVR pages |
| cherry-audio | 46 → 51/52 | **+5** | Expansions + VM Core+Electro Drums; skip Novachord dual `1.0.2 / 1.0.3` |
| kazrog | 12 → 17/17 | **+5** | **complete** |
| plugin-alliance | 163 → 166/175 | **+3** | MEGA Sampler / Schoeps Double MS / Mono Upmix |
| xfer-records | 6 → 9/9 | **+3** | Cthulhu / LFOTool / Nerve — **complete** |
| arturia | 68 → 70/84 | **+2** | Delay BRIGADE (= MEMORY-BRIGADE) + Pure LoFi; **no** V→V2/V3/V4 maps |
| softube | 118 → 120/164 | **+2** | Transient Shaper + TSAR-1R only; no UAD/suite/hardware maps |
| izotope | 105 → 107/109 | **+2** | Iris 2 / Trash 2 |
| eiosis | 0 → 2/3 | **+2** | AirEQ + E²Deesser |
| liquidsonics | 10 → 12/14 | **+2** | Filtrate / Seventh Heaven Professional |
| spectrasonics | 0 → 2/4 | **+2** | Keyscape / Stylus RMX; skip Omnisphere gen ambiguity |
| audio-ease | 3 → 4/11 | **+1** | Cabinet only (others no verwin) |
| native-instruments | 1 → 2/3 | **+1** | Kontakt **8.13.0** |
| waves / UA / IK / Spitfire / Avid | unchanged | +0 | leftovers are hardware / hub shells / gen-ambiguous / no KVR |

## Matching policy applied

- Prefer **exact** catalog name → KVR slug; allow documented aliases (`&`/`and`, United Plugins `*-by-{artist}-by-united-plugins`, Slate `fg-x-mastering-processor`, Arturia Delay BRIGADE ↔ MEMORY-BRIGADE, AIR Mini Grand).
- **Reject** Softube UAD-* → Softube native pages; suite/component/Console-1 hardware; Fix Flanger↔Fix Flanger and Doubler splits.
- **Reject** Arturia generation bumps (Mini V↛V4, etc.); Cableguys Kickstart gen-1 page contaminated with Kickstart 2 marketing/verwin risk; Vacuum→Vacuum Classic; Omnisphere↛Omnisphere 1/3; Nectar 3 Elements↛Nectar 4 Elements; bx_XL V2↛V3.
- **Reject** non-semver / dual strings (`2025`, `2.0.0 (2.0.6)`, `6.1.32 (VST3 …)`, `1.0.2 / 1.0.3`, `N/A`, `alpha`).
- D16: accept gen-1 product pages only when gen-2 has a **separate** `*-2-by-d16-group` slug.
- Cableguys module Shapers: accept **only** when the module has its own KVR product page + verwin (standalone lineage), not by stamping ShaperBox 3.x.

## Explicit skips (true impossibles / policy)

- **Avid** (54): Pro Tools stock plugs — no per-plugin public semver / thin KVR index.
- **AIR** Creative Collection `AIR*` effects (21): no individual KVR product pages.
- **Softube** (~44): UAD Softube titles, Console 1 hardware/editions, suites/components, Active/Passive/Focusing EQ / Trident / TSAR-1 (non-R) — no live KVR product page.
- **Arturia** classics without exact gen slug; hardware UA/IK pedals; Waves shells/hardware; Spitfire SSO year-only `2025`.
- **PA** discontinued/renamed: alpha master/mix, The Sauce, Rangers, crispscale, bx_XL V2.
- u-he soundset packs with `N/A`/empty verwin.

## Playbooks

Updated `playbooks/` + `manufacturer_playbooks` for mopped manufacturers (nugen, united-plugins, slate-digital, acon-digital, cableguys, d16, output, audiothing, synchro-arts, air, softube leftovers, arturia, xfer, kazrog, eiosis, etc.).

## Artifacts

- Match/fetch: `tmp-fetch/kvr-r7/match-plan.json`, `fetch-list.json`, `accepts.json`, `accepts-final.json`, `accepts-wave2.json`, `skips.json`, `deltas-final.json`
- Product HTML: `tmp-fetch/kvr-r7/products/*.html`
- Developer indexes: `tmp-fetch/kvr-r7/dev-*.html`
- Export: `out/catalog.json` (**2532** with accepted latestVersion)
