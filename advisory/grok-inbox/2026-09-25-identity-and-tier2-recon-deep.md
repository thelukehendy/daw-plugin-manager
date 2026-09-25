# Wave 6 — Identity edge guards + tier-2 recon (combined)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Note:** Design-level proposals only. Muse re-fetches before any raise.

## Part A — Identity edge guards


## Live RO snapshot counts (local store; Muse should re-run on live DB)
| identity_kind | n |
|---|---:|
| plugin | 5363 |
| soundset | 1979 |
| bundle | 325 |
| suite_component | 195 |
| expansion | 137 |
| discontinued | 135 |
| hardware | 110 |
| hub_app | 87 |
| gen_ambiguous | 78 |
| … | … |

## High-confidence misfiles (diggable)
UA Producer / Studio / Signature / UADx Essentials / UADx Signature Edition rows — see companion UA editions file. Reclass to `bundle`.

## Heuristic scan (needs human/Muse confirm — not auto-reclass)
`identity_kind=plugin` AND name matches Edition/Bundle/Suite → **30+** candidates in local DB (JSON fixture `suspicious-editions.json`).
Examples of **false positives** if regex-blind: Goodhertz “Mastering Edition” (often a real SKU), Neural DSP “Fortin * Suite” (product line name).

### Guard design
1. **Vendor allowlists** for edition-as-SKU (Goodhertz, etc.).
2. **Vendor denylists** for edition-as-pack (UA *Edition packs, “Signature Edition V3”).
3. Chip reject: refuse version raise when `identity_kind` in unversioned set OR denylist hit.
4. `gen_ambiguous` (78): mandatory identity pass before any version dig (already in accepted taxonomy).

## Renames / successors
Local DB has `supersedes_plugin_id` (79) and `successor_plugin_id` (123) populated — maintenance path: export integrity check that successor chains don’t leave both ends `open_pending` with conflicting tips.

- **Recommendation:** Ship UA denylist immediately; add Edition-name review queue (read-only) for Muse; unit-test guards.
- **New evidence:** Diggable UA list + local identity_kind histogram + suspicious-editions.json.

## Part B — Tier-2 recon ranked (lane 3)

# Lane 3 — Tier-2 reconnaissance (no catalog raises)

**Date:** 2026-09-25 ~12:05 PT  
**Role:** recon only. This file does **not** propose accepting versions. If Luke later opens tier-2, Muse uses the assault order below.  
**Policy held:** tier-2+ stays paused. No credentials. No install telemetry (banned). No Airwindows per-SKU versions.

## Which database

The path named in the brief, ``catalog.db` (2026-09-10 pause snapshot)`, is the **2026-09-10 pause snapshot**: schema v4, **583** manufacturers, **8439** plugins, **no `popularity_tier`**. It cannot answer "which vendors are tier-2".

Tier numbers in the project brief match the **live engine DB**, queried read-only:

`live engine `catalog-store/data/catalog.db` (read-only recon)`  
schema v6 · 660 manufacturers · 9494 plugins · 5651 accepted currents.

Effective tier = `COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)`.

| Effective tier | Plugins | Manufacturers |
|---:|---:|---:|
| 1 | 4389 | 59 |
| **2** | **3325** | **126** |
| 3 | 1001 | 100 |
| 4 | 118 | 12 |
| unranked | 661 | 367 |

That is the brief's "~126 manufacturers / 3,325 plugins". Plugin-level overrides exist (example: Gullfoss Live / Master / Kraftur Focus are tier **3** even though Soundtheory the manufacturer is tier 2). Always use the COALESCE, not `manufacturers.popularity_tier` alone (that cut is 3331 plugins / 122 manufacturers).

## Tier-2 shape (why opening it is not "3325 new versions")

| Slice | Count |
|---|---:|
| Plugins | 3325 |
| `identity_kind=plugin` | 2315 |
| Accepted current version | 1678 |
| Green ≥85 | 996 |
| Amber 70–84 | 19 |
| Yellow <70 | 663 |
| No version, and kind=plugin ("true gaps") | 800 |
| of which Airwindows intentional unversioned | 512 |
| **Actionable plugin gaps if Airwindows stays policy-locked** | **~288** |
| Soundset / expansion / bundle / other non-plugin | ~1010 |
| Manufacturers with a playbook | 75 / 126 |
| Manufacturers with `changelog_url` | 47 |
| Playbooks flagged `hub_walled` | 13 |
| `vendor_feeds` rows | 1 (engine-wide, not a tier-2 feed net) |

Most of the 3325 are either already versioned, not plugins, or KVR-ceiling yellows on hub-walled vendors. The yield is a few hundred rows, concentrated in about twenty vendors. Full per-vendor numbers: `fixtures/lane345/tier2-mfr-scoreboard.tsv` and `tier2-mfr-profile.json`.

## Scoring (no fake popularity)

There is **no install-share column**. Relevance is not invented from the web.

```
score = (fillable_plugin_gaps × q_accept) + (yellows × q_raise × 0.65)
```

- `q_accept` / `q_raise` are oracle quality from a **live public fetch on 2026-09-25**, not from the stale playbook alone.
- The 0.65 discounts a confidence raise versus a first accept.
- Editorial relevance bump **×1.15** only where the brand is a widely known tier-2 name (HoRNet, AudioThing, Baby Audio, Denise, Minimal, Gullfoss, Overloud). Documented as judgment, not telemetry. Muse can zero it.
- Airwindows per-SKU score is **0** (locked policy: version Consolidated only).
- Soundset mountains (Puremagnetik 250, Soniccouture 53, Impact soundsets 56, ProjectSAM 19) score **0** for version assault.

Probe log: `fixtures/lane345/oracle-probe-2026-09-25.json`.

## Oracle map (classes)

| Class | Meaning | Examples |
|---|---|---|
| **A — structured public** | One page/table/PDF/filename scheme states per-product versions | Wave Arts version history, AudioThing update table, Gullfoss PDF, Madrona link text, Denise downloads parentheticals, Dexed GitHub tag, Audiority versions table, Blue Cat download table, Ample (already green), Black Rooster framework news (already green) |
| **B — official but scoped or noisy** | Real vendor text, easy to stamp wrong | DDMF news posts, Relab downloads, HoRNet per-slug pages (index is an 8 KB shell), WA Production product pages, Overloud `TH-U/changelog.txt` (host only), Pulsar download page (Slider Revolution versions in the HTML), Minimal product JSON embedded in a JS shell |
| **C — KVR ceiling** | Crowdsourced `verwin` @60. Do not grind for green. | Acustica 134, United Plugins 57, Rob Papen 35, NUGEN 27, Tracktion 27, Boz 22, Mastering the Mix 11, STL Tones, Waldorf, Krotos |
| **D — hub, no per-SKU public version** | Portal exists; public surface is manager or marketing | Nembrini CENTRAL (Shopify `products.json` has **82 products and zero versions**), AIR inMusic, Kush, Two notes, Lennar Digital account |
| **E — do not version** | Policy or non-plugin | Airwindows 512 algorithms, Puremagnetik / Soniccouture / ProjectSAM / GetGood Drums soundsets |
| **F — no oracle this pass** | Fetched, nothing safe to parse | Lunacy SPA, reFX Nexus marketing, TC Electronic (only `manuals.plus` in the DB — not a manufacturer source), Wave Alchemy shop, HOFA (V2/V3 in the **name** is a generation, not a build), Nomad "2026-compliant pack" post with no semver, Kiive homepage ("current version is on Plugin Alliance") |

Playbooks are partly stale. Wave Arts playbook says "no public version numbers anywhere official". That was **false on 2026-09-25**. The version-history page and the S3 filenames both carry versions. Recon overrides the playbook; it does not write the catalog.

## Live evidence worth keeping

### Wave Arts (best new-accept oracle)

- History: `https://wavearts.com/support/version-history/dialog-2-04` (the slug says Dialog; the body is the **whole line**, newest first).
- Downloads: `https://wavearts.com/downloads` → `s3.us-east-1.amazonaws.com/wavearts-cms/downloads/...`
- Vendor wording: *"Power Suite version numbers refer to the installer build, and are independent of the included plug-in versions."*
- Scheme is **dotted as written**: TrackPlug **7.11**, PowerSuite **7.01**, Convology XT **1.34**. Do not normalize 7.11 → 7.1.1.
- Filename corroboration: `TrackPlug7-711.dmg` = 7.11, `PowerSuite7-701.dmg` = 7.01, `ConvologyXT-134.dmg` = 1.34.
- Grouped heading trap: `TrackPlug 7.11, MasterVerb 7.03, FinalPlug 7.06, MultiDynamics 7.09, Panorama 7.09 08/20/2025` — one date, five products. A regex that wants `version + date` keeps only Panorama.
- Mac-filename trap: history tip **Dialog 2.11** (2024-04-23). Downloads still offers Mac `Dialog2-210.dmg` and Win `Dialog2-211.exe`. Prefer the history tip. Blind "Mac-current wins" would write **2.10** and regress.
- Hand-checked tips: `fixtures/lane345/wavearts-version-history-tips.json`.
- Catalog today: **18/18 plugin rows, 0 versions**. Power Suite 7 and Master Restoration Suite 6 are bundles sitting as `plugin`.

### AudioThing (best yellow-raise oracle)

`https://www.audiothing.net/plugin-updates/` is a real table: Product, Version, Latest Update, OS matrix. Spot-read 2026-09-25: Arguments 1.0 (19 Nov 2024), B00GA 1.0.1 (25 Nov 2025), Environments 1.0 (14 May 2026). Catalog already has ~60 greens from this family and **28 yellows** still on KVR. Do not stamp the Environments parent onto expansions (playbook already says this).

### Others confirmed this pass

| Vendor | What opened | What it is not |
|---|---|---|
| DDMF news | Plugindoctor **v2.6.0**, "June 3d, 2026"; page `Last-Modified` Thu 04 Jun 2026 12:25:04 GMT | Not a single version for all 25 plugins |
| Denise `/downloads` | Bass XXL **(1.3)**, Motion Filter **(1.4)**, Perfect Room 2 **(1.4)**. S3 zips have **no** version in the filename | The other 7 Denise rows (Bad Tape, God Mode, …) are absent from that page |
| Relab `/downloads/` | Per-installer tokens (1.1.0, 1.2.x, 2.2.0) next to product names | Still needs Mac=Win check per block |
| Gullfoss PDF | **v1.11.9 (2025-11-04)**. Homepage is a 5 KB "Please enable JavaScript" shell | Not Gullfoss Live, Gullfoss Master, Kraftur, or Kraftur Focus (those three are tier-3 overrides anyway) |
| Madrona Sumu | Link text "Sumu 1.3.0" Mac and Windows, agrees with the accepted row | Aalto Mac/Win mismatch was already skipped; re-check, don't average |
| HoRNet `/plugins/` | **8056-byte JS shell**, no list | Per-slug pages already produced 72 greens; 33 yellows are the leftover |
| Overloud `TH-U/changelog.txt` | Host tip **2.1** (from 2.0.19) | Not TH-U Metal/Rock/Funk editions (those sit at KVR 1.4.7) |
| Nembrini `products.json` | 82 products, types include BUNDLE 18, GUITAR_AMP 25, **zero** version strings | Identity prep only. Versions are CENTRAL |
| Black Rooster news | Framework **v3.0.0** (11 Apr 2025) | Already 26 greens at 3.0.0. Canary, not assault. Same class of risk as a Waves generation stamp |
| Pulsar `/download/` | Heading "LATEST PLUGIN VERSIONS" plus **Slider Revolution 6.7.40** and PixelYourSite 11.2.0.7 in the same HTML | Parser must ignore builder versions |
| Minimal Rift | Visible HTML is empty; embedded list tops at **2.6.0** | Confirm the number belongs to Rift before any write. Catalog also contains a junk row named **Current** |
| Kiive XTComp | "current version on the Plugin Alliance store"; legacy stays in the Kiive account | Do not scrape the account |
| HOFA | Names like "IQ-Series EQ V3"; no build on the EQ page | "V3" is not version 3.0 |
| GitHub | Dexed tag **v1.0.1** (2025-11-29). LSP **1.2.35** (2026-08-23) matches the tier-3 cohort. Surge `/releases/latest` is **Nightly** (2024-08-07). Airwindows releases **404**. BYOD latest is 2024 — do not regress OAS-sourced ChowDSP greens | See lane 4 |
| KVR | ` /rss/new-products.php` **404**. Forum feed 301s to `/forum/feed` | A forum firehose is not a version oracle |

## Top 20 assault order (only if Luke opens tier-2)

Ranked by the score above. "Expected" is accepts-or-raises, not a promise.

| # | Vendor | Plugins / gaps / yellow | Score (approx) | Method when opened |
|---:|---|---|---:|---|
| 1 | **audiothing** | 99 / 1 / 28 | ~22 | Re-fetch `plugin-updates` table. Exact product-name match. Raise KVR yellows only on equal or newer table version. Never stamp Environments onto expansions or Toys that 404. |
| 2 | **hornet** | 105 / 0 / 33 | ~21 ×1.15 | Do **not** parse `/plugins/` (JS shell). Fetch each yellow SKU's `/plugins/{slug}/` banner ("X.Y.Z is available"). Skip Corrosion (account portal, already hub-walled). Skip redirects onto a successor SKU. |
| 3 | **wave-arts** | 18 / 18 / 0 | ~15 | One history page + filename corroboration. Write vendor dotted versions. Suite rows become bundles (lane 5) and do not donate 7.01 to components. Dialog tip 2.11 beats stale Mac dmg 210. MR Noise/Hum/Gate need their own history hits before a number is copied from MR Click 6.10. |
| 4 | **wa-production** | 102 / 1 / 25 | ~16 | Same product-page path that already greened 63. Exact slug. Soundsets and Titan-style bundles stay non-plugins. Login portal is not the oracle. |
| 5 | **ddmf** | 25 / 21 / 3 | ~12 | Walk `ddmf.eu/news/` newest-first. One post = one product (Plugindoctor 2.6.0 ≠ the rest of the line). `Last-Modified` is a canary, not a version. |
| 6 | **relab-development** | 12 / 11 / 1 | ~8 | Parse `/downloads/` product blocks. Accept only when Mac and Win versions agree, or record the split and hold (SSL/Dialog lesson). |
| 7 | **minimal-audio** | 12 / 12 / 0 | ~7 ×1.15 | **Identity first:** `minimal-audio--minimal-audio-current` ("Current", match pattern `Current`) is not a plugin. Then per-product embedded changelog (Rift list topped at 2.6.0 this pass — verify attribution). Homepage is a JS fallback with no versions. |
| 8 | **audiority** | 52 / 0 / 13 | ~8 | Public Plugin Versions table already at @92 for 33. Finish leftovers from that table only. Kontakt/SFZ "editions" stay soundsets. |
| 9 | **denise-audio** | 10 / 10 / 0 | ~4 ×1.15 | Accept only the three parentheticals on `/downloads` (Bass XXL 1.3, Motion Filter 1.4, Perfect Room 2 1.4). S3 object names are not versions; HEAD Last-Modified is a canary. Bad Tape vs Bad Tape 2 is a generation guard, not a stamp. Legacy seven: check `/legacy-downloads` in a later pass or leave unknown. |
| 10 | **acon-digital** | 29 / 0 / 12 | ~6 | Installer filenames on acondigital.com, same method as the existing 16 greens. No hub-stamp from a manager build. 

…(trimmed; full scoreboard in fixtures/wave6/lane345/ if present)…

