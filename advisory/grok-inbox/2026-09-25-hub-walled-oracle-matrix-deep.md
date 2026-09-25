# Hub-walled oracle matrix — ranked public channels (deep)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — Hub-walled vendor discovery. Deepens `2026-09-24-hub-walled-oracle-priorities.md` with a live-verified per-hub matrix (2026-09-24 PT), Muse priority order, extract methods, confidence ceilings, and DO-NOT-GRIND lists. No credentials; no Luke input.
- **Context / evidence:**
  - Tier-1 yellow/versionless mass is dominated by hub-walled vendors (Waves, NI, IK, Spitfire, UA, Slate, EastWest, Output, 8Dio, UVI) where public per-product versions are scarce or WAF-gated.
  - Live fetch campaign under `advisory-deep/hubs/` (REPORT.md + raw samples): curl vs browser paths, Zendesk articles, status threads, offline pins.
  - DB context: yellow **1346** (kvr-product-page **1119**); portal_app includes PA IM **294**, Softube Central **164**, SSL Download Manager **69**.
  - Softube RN curl-success is a control + separate suite-vs-SKU trap (see softube deep suggestion).
  - Novel dig also restored UA Version History tip **12.0 — Sept 8, 2026** (prior assault decay note looks like false alarm).

- **Recommendation:**
  Execute the following **Muse priority this week** (ordered by advisory yield / autonomy):

  | # | Action | Why |
  |---:|---|---|
  | 1 | Ship Waves Playwright/WebFetch + WAVES-DIFF-SPEC parser | Highest yield; curl dead (Incapsula 212 B) |
  | 2 | UA UAD version-history scraper | Public Zendesk; `Version 12.0 — Sept 8, 2026`; zero login |
  | 3 | EastWest `/support/updates` scraper | `IC 2.0 / Sept 22, 2026`, `Opus 1.6.5 / June 4, 2026` |
  | 4 | Output Help Center trio | Arcade RN + Co-Producer RN + Engines table — curl-friendly |
  | 5 | Slate VMR Zendesk RN discovery | `VMR 2.10.1.3` + versioned download URLs; hub SPA login-walled |
  | 6 | NI Native Access status + installer Last-Modified | Access **3.26.0** public; full Komplete matrix hub-only |
  | 7 | Spitfire app changelog poll | App `v3.4.17` public; library VH uneven |
  | 8 | IK Product Manager version canary | Only `v.1.1.15` public; product RNs inside PM |
  | 9 | UVI Falcon year-string canary | Marketing “Falcon 2026”; builds in Portal |
  | 10 | 8Dio — park | No public RN; Zendesk download 404 |
  | bonus | Softube RN + sc3 YAML | Curl works; suite≠SKU; Central 3.0.5 |

  ## Per-hub oracle table

  | Hub | Public channel? | Best URL(s) | Extract method | Confidence ceiling | Pitfalls |
  |---|---|---|---|---|---|
  | **Waves** | Yes, WAF-gated | `/downloads/release-notes` · `/latest-offline-installer` | Playwright only; generation/app_builds/new_plugins/fixed_in maps | High for Central/LV1/Driver & generation_bump; Med without hotfix | Curl 212 B stub; **never stamp V17 on every SKU** |
  | **IK** | Partial | `/products/productmanager/` | Regex `v\.(\d+\.\d+\.\d+)` | Med PM only; Low for AmpliTube/T-RackS | Product RNs inside authenticated PM |
  | **NI** | Partial | Access page + GCS DMG · Community status (`3.26.0 - 2026-09-10`) · Maschine RN articles | HEAD binaries Last-Modified; scrape status; allowlist product RNs | High Access; Med allowlisted products; Low full Komplete | No public appcast; Service Center XML local-only |
  | **Slate** | Partial | Zendesk VMR `2.10.1.3` RN · How To Update VMR · versioned `app.completeaccess.audio/installers/direct-download?…version=2.10.1.3` | Zendesk crawl; parse 4-part version | High when RN exists; Low silent hub ships | `slatedigital.com/installers/` **404**; Complete Access SPA shell; unauth download falls through to latest; Hub RN **2.19.0** ≠ plugin versions |
  | **UA** | Yes | UAD Version History RN · Archives sibling | Regex `Version\s+(\d+(?:\.\d+)*)\s*[—-]\s*([A-Za-z]+ \d+, \d{4})`; hash HTML daily | High DSP bundle | ~670 KB page; never stamp onto UADx/Spark native; Softube-UAD-* DSP may ride bundle |
  | **Spitfire** | Partial | App changelogs · Product Information · BBCSO VH | Parse `v(\d+\.\d+\.\d+)`; allowlist library VH | Med app; Low–Med libraries | Many libraries only inside Spitfire App; structurally_blocked for app-gated libs |
  | **EastWest** | Yes | `soundsonline.com/support/updates` | Section-split; `^(IC\|Opus\|Spaces\|PLAY)\s*([\d.]+)\s*/\s*(.+)` | High IC/Opus/Spaces/PLAY | Account still required to download; don’t scrape CDN; appcast redirects home |
  | **Output** | Yes (notes) | Arcade RN · Co-Producer RN · Engines versions articles | `Arcade X.Y.Z (Released …)` + engines `Name: vA.B.C[, R###]` | High documented products | Installers via Output Hub; ignore unrelated docs.output.ai / npm |
  | **UVI** | Weak | Falcon marketing · Portal · update how-to · manual PDF | Year-string / “Added in Version 20XX”; optional PDF | Low–Med year; Low numeric builds | Real builds via UVI Portal; soundbanks structurally_blocked |
  | **8Dio** | No | FAQ only | Liveness monitor | Very Low | Zendesk/support download **404**; park `oracle-absent` |
  | **Softube*** | Yes (suite) | softube.com/release-notes · sc3 YAML | Suite train + name signal; Central from YAML | High Central app; Low per-SKU from RN | **Suite ≠ SKU**; Homebrew stale 2.2.0 |

  ## Live verification snapshot (2026-09-24 PT)

  | Vendor | URL class | HTTP | Bytes | Verdict |
  |---|---|---:|---:|---|
  | Waves RN | curl | 200 | **212** | SHELL Incapsula |
  | Waves RN | WebFetch/browser | 200 | full | OK — required path |
  | Waves appcast probes | curl | 200 | 212 | SHELL |
  | IK Product Manager | curl | 200 | ~139 KB | OK — `v.1.1.15` |
  | NI Access + GCS DMG HEAD | 200 | large / ~162 MB | OK — Last-Modified Thu 10 Sep 2026 |
  | NI status thread | 200 | large | OK — `3.26.0 - 2026-09-10` |
  | Slate installers marketing | 404 | — | DEAD |
  | Slate VMR RN Zendesk | 200 | ~21 KB | OK |
  | UA Version History | 200 | ~671 KB | OK — `Version 12.0 — Sept 8, 2026` |
  | Spitfire app changelogs | 200 | ~66 KB | OK — `v3.4.17` / 04 Feb 2026 |
  | EastWest updates | 200 | ~72 KB | OK |
  | Output Arcade / Co-Producer / Engines | 200 | ~89–99 KB | OK — Arcade `2.16.1` Aug 4 2026; engines Analog Strings `v1.0.1`, Portal `v1.2.1, R282`, … |
  | UVI Falcon / Portal | 200 | large | OK marketing / portal CTA |
  | 8Dio FAQ | 200 | ~1 MB | OK but no versions |
  | 8Dio Zendesk download | 404 | — | DEAD |
  | Softube RN | curl | 200 | ~79 KB | OK control — `2.6.42` |

  ## Appcast / Sparkle hunt — closed for these ten

  Blind `appcast.xml` / `updates.xml` / `sparkle/appcast.xml` on vendor roots → Incapsula stubs, SPA HTML, 404s, or homepage redirects. **No Sparkle feed verified.** Re-open only if a managed local install exposes `SUFeedURL` in Info.plist.

  ## Per-vendor DO-NOT-GRIND (summary)

  | Vendor | Forbidden |
  |---|---|
  | Waves | Central login, Creative Access APIs, sample libs, forum-as-oracle, V17 stamp |
  | IK | Authenticated Product Manager catalog, Custom Shop |
  | NI | Native Access login, Native ID tokens, entitlement APIs |
  | Slate | Complete Access Hub session, iLok automation; stamping Hub 2.19.0 onto VMR |
  | UA | UA Connect / LUNA account; stamping DSP onto UADx |
  | Spitfire | App login, library CDN auth, RTO serial APIs; per-library digs on blocked class |
  | EastWest | IC login, ComposerCloud entitlement, auth CDN |
  | Output | Hub login, Arcade content CDN |
  | UVI | Portal login, SonicPass; inventing builds from year string |
  | 8Dio | Account downloader, support-email scraping, Discord-as-oracle |

  ## Resolvability crosswalk

  After taxonomy lands: most per-SKU rows for these hubs → `hub_walled` (or `structurally_blocked` for Spitfire/UVI/Steinberg lists). Hub_app / manager rows → `open` when public oracle healthy (Access 3.26.0, Central sc3 3.0.5, Waves Central app_build, UA DSP 12.0, EastWest IC/Opus, Output Arcade, Slate Hub RN for **hub only**).

- **If accepted, what changes in the engine:**
  - Update `HUB_WALLED.md` / TIER1-ASSAULT with this matrix + live URLs + priority order.
  - Schedule chips 1–5 first (Waves, UA, EastWest, Output, Slate VMR); NI Access binary as hub_app; park 8Dio.
  - Wire resolvability defaults per manufacturer from table.
  - Re-enable UA Version History freshness recipe (path health restored).
  - Reflect: Softube as curl control + suite trap; Waves as WAF-gated public.

- **Expected impact:**
  - Converts “hub-walled = give up” into a concrete public-oracle backlog with confidence ceilings.
  - Multiple high-confidence hub_app / bundle greens without credentials.
  - Stops wasting dig budget on 8Dio / full Komplete / Spitfire libraries.

- **Risks / caveats:**
  - Public RN health can decay (UA prior false alarm) — hash + tip-version canaries weekly.
  - Slate/Output/EastWest still require hubs to *download*; catalog versions are informational CTAs — portal liveness still required.
  - VMR unauth direct-download “falls through to latest” — do not treat as pinned version proof without RN article corroboration.
  - Novel Antares section API (28 RN articles, AutoTune 2026 **1.2.1**) is adjacent Tier-1 win — not hub-walled; track in assault playbook separately.

- **Suggested first step:**
  Muse accepts priority order; implement Waves stub-safe fetcher + UA Version History tip parse as two chips; publish matrix into playbooks without catalog mass writes until first snapshots reviewed.

- **New evidence since last verdict:**
  Verdicts empty; full live URL table + bytes/verdicts from `advisory-deep/hubs/REPORT.md`; UA 12.0 restored; Output engines quotes; Slate Hub 2.19.0; Softube control; 8Dio park confirmed.
