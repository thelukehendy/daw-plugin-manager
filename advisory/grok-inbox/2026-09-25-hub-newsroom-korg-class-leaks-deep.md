# Hub newsroom / KORG-class leaks — Wave 8 Ask 4 (creative pass 3)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (wave8 asks4+5)
- **Bar:** New evidence or don’t file. **No** re-grind of Product Manager / Software Pass / Cloud Manager / ASC.
- **Class under hunt:** support newsrooms, release-note indexes, press feeds, what’s-new pages, community-manager announcements where **version strings escape hub walls** (KORG Collection news-title tip pattern).
- **Targets:** remaining hub_walled creative vendors (IK, Roland, Arturia, Image-Line, Lexicon, Slate, EastWest, Output, UVI, 8Dio, …).
- **DB RO:** `catalog.db` via sqlite3 `mode=ro`; manufacturer portal/changelog columns inspected via PRAGMA (no invented schema).

## Executive result

**Zero new SKU tip unlocks this pass.**

One KORG-shaped channel was found and **falsified as a primary tip oracle** (Slate Zendesk RN titles — versions in titles + body changelogs, but tips **lag** catalog/KVR). Everything else stays hub_walled with denser negatives than wave7.

KORG Collection news-title poller from wave7 remains the only partial unlock in this class; do not reopen Software Pass default for KORG when news is silent.

---

## Near-miss — Slate Digital Zendesk RN title feed (NEW angle, NOT an unlock)

### What matches the KORG class
Public Help Center API (no login) lists articles whose **titles embed SKU + semver**:

| Product token | Latest RN title tip | Article updated (UTC→PT) | Body confirms? |
|---|---|---|---|
| VMR | **2.10.1.3** | 2026-03-26 | Yes — FG-36A / Classic 87 changelog |
| VBC | 1.3.5.0 | 2024-09-11 | Yes — Apple Silicon / bugs |
| VTM | 1.2.6.0 | 2024-09-11 | Yes — Apple Silicon / bugs |
| VSC | 1.0.8.3 | 2017-07-13 | Stale legacy |
| Repeater | 1.1.2 | 2017-07-13 | Stale legacy |

API: `https://support.slatedigital.com/api/v2/help_center/en-us/articles.json` (410 articles crawled).  
Index fixture: `fixtures/wave8/hub/slate/rn-title-index.json`.  
Body fixture: `fixtures/wave8/hub/slate/rn/article-12998887383315.json`.

### Why it fails as an unlock (catalog cross-check, RO)
| Catalog row | Catalog tip (source) | Zendesk RN tip | Delta |
|---|---|---|---|
| Virtual Mix Rack / VMR | **3.3.10.0** (KVR productPage) | 2.10.1.3 | RN **lags** major |
| Virtual Buss Compressors / VBC | **1.4.2.0** (KVR) | 1.3.5.0 | RN lags |
| Virtual Tape Machines / VTM | **1.3.3.0** (KVR) | 1.2.6.0 | RN lags |
| Repeater (Slate Digital Edition) | **1.2.2** (Sept 2023 RN article already in catalog) | 1.1.2 title | Title frozen |

**Doctrine:** KORG-class *shape* ≠ usable tip. Titles can freeze while Installers / Complete Access Hub ship newer trains. Chip sketch only if Muse later proves title tip == Installers tip for a canary SKU.

### Hub-app footnote (not a SKU unlock)
Complete Access Hub RN body (`article/4402433908755`) has a dated version history ending **2.19.0 (September 21, 2026)** — live hub_app tip. No `slate-digital` `identity_kind=hub_app` plugin row to stamp; do not invent one here. Fixture: `fixtures/wave8/hub/slate/rn/article-hub-rn.json`.

META: `fixtures/wave8/hub/slate/META.json`.

---

## Negatives table (NEW angles vs wave6/7 — tried hard)

| Vendor | Angle tried (NEW) | Result | Fixture |
|---|---|---|---|
| **IK** | `/news/`, `/press/`, PR Newswire index | Marketing/price firehose; **no durable per-SKU semver headlines** | `hub/ik/news-index.html`, `press.html`, `prnewswire.html` |
| **IK** | AmpliTube 5 product page paths | `…/GUI/5.10.4/…` + `AmpliTube_5_*_v5.10.4_gear.pdf` — **known AT5 canary** (wave6/7); image dates 20211004; **not new** | `hub/ik/at5-5104-canary-lean.html` |
| **IK** | TONEX product page | Banner paths `main-banner-2.0.3-board/…` — marketing asset train, not tip poller | `hub/ik/tonex-banner-lean.html` |
| **IK** | `/products/…/changelog`, `/blog/`, `/support/updates/`, `news/rss.xml` | Soft-404 twin of product chrome / 404 | (deleted twins; see news-index) |
| **Roland** | `/us/news/`, blog search ZENOLOGY, RSS | 404 | — |
| **Roland** | `rolandcloud.com/blog` | Soft-404 footer shows Cloud app `Version 2.1.0.26786` — **not** ZENOLOGY SKU tip | `hub/roland/cloud-blog.html` |
| **Roland** | ZENOLOGY product “news” + press releases | Marketing “Version 2.0” imagery only (wave7 already parked updates_drivers empty shells) | `hub/roland/cloud-news.html`, `press.html` |
| **Roland** | `…/support/by_product/rc_zenology/` | Nav shell; downloads still Cloud Manager | `hub/roland/zenology-support.html` |
| **Arturia** | `/news`, `/blog`, `/whats-new`, pigments `/release-notes` | Nuxt apology / shell; CSS “versions” only | — |
| **Arturia** | Pigments / V Collection product HTML | `appVersion:"13.12.1"` = **Nuxt framework**, not Pigments tip | `hub/arturia/pigments.html`, `v-collection.html` |
| **Arturia** | Forum board “updates”, `media.arturia.net` changelog guess | 404 | — |
| **Arturia** | Support downloads-manuals | ASC download hub copy only | `hub/arturia/downloads.html` |
| **Image-Line** | FL Studio What’s New + archive (changelog_url) | Rich **DAW** maintenance tips (`FL Studio 2025.2`…). Morphine/Drumaxx/Toxic appear as feature bullets **without plugin semver** | `hub/image-line/whats-new.html`, `whats-new-archive.html` |
| **Image-Line** | Morphine / Drumaxx product pages, `/vst-downloads`, `/news/` | Marketing; no versioned installer filenames (wave7 API already dead) | `hub/image-line/morphine.html`, `drumaxx.html`, `vst-downloads.html` |
| **Lexicon** | News / support / MPX Native product | Still **1.0.8** Legacy (Intel) on product page — wave6 stale oracle, **no tip movement** | `hub/lexicon/mpx-native.html`, `news.html` |
| **Lexicon** | Flux.audio project page, Harman support | Soft-404 / generic | — |
| **Slate** | Blog / press / support home | Blog marketing; press 404; support lists RN titles (see near-miss) | `hub/slate/blog.html`, `support-home.html` |
| **EastWest** | soundsonline news/blog/OPUS/PLAY/downloads/release-notes | Identical SPA shell (~89KB); no static semver | `hub/eastwest/home.html`, `news.html`, `support.html` |
| **EastWest** | eastwestsupport.zendesk.com | 404 | — |
| **Output** | `/blog`, `/arcade`, `/news`, `/releases`, help.output.com | Blog OK but no SKU tips; arcade/home thin SPA; help paths 404 | `hub/output/blog.html`, `home.html`, `support.html` |
| **UVI** | `/news`, `/updates`, `/whats-new`, `/downloads`, Falcon changelog URL | 404 | — |
| **UVI** | Falcon product page | **“Falcon 2026” year branding** + “Previous Updates” marketing carousel — **not semver tip** | `hub/uvi/falcon-version-lean.html` |
| **UVI** | UVI Portal / Workstation / home | Portal marketing; `version: 2.0` noise | `hub/uvi/portal.html` |
| **8Dio** | `/`, `/blogs/news`, `/pages/updates`, collections | Cloudflare **403** from research IP | `hub/8dio/news.html` (403 body) |

---

## Chip sketches (only if Muse overturns a falsification)

### `slate_zendesk_rn_title_poller` — PARKED
1. Weekly GET articles API; filter titles `^(.+?)\s+(\d+\.\d+(?:\.\d+){0,3})\s*[-–]\s*Release Notes$`.
2. Map product token → plugin_id allowlist (VMR/VBC/VTM/… only).
3. **Gate:** refuse to publish tip unless Installers page or Complete Access Hub lists the **same** version for that SKU (canary). Without the gate this chip would stamp stale 2.10.x onto VMR while catalog already has 3.3.x from KVR.
4. Confidence: title+body agree + Installers agree → amber; title-only → reject.

### Do **not** chip
- IK gear-PDF / GUI-path trains (known, stale-prone).
- Roland Cloud footer app version.
- Arturia Nuxt `appVersion`.
- UVI year-branded “Falcon 2026”.
- FL Studio What’s New as Morphine/Drumaxx tip source.

---

## Stay hub_walled (posture unchanged)

IK (~Product Manager), Roland (Cloud Manager), Arturia (ASC), Image-Line Drumaxx·Morphine·Toxic, Lexicon MPX, Slate (Complete Access Hub / RME — SKU tips still hub), EastWest (Sounds Online), Output hub, UVI Portal, 8Dio (account + CDN wall).

KORG: keep wave7 news-title chip as **optional** overlay; Software Pass remains default.

---

## Fixtures (canonical per vendor under `fixtures/wave8/hub/<vendor>/`)

- `slate/` — META + `rn-title-index.json` + RN article JSON bodies + support-home / blog / hub RN HTML
- `ik/` — news/press/PR + AT5/TONEX lean canary proofs
- `roland/` — cloud-news, press, zenology-support, cloud-blog 404
- `arturia/` — home, downloads, pigments, v-collection
- `image-line/` — whats-new (+ archive), morphine, drumaxx, news, vst-downloads
- `lexicon/` — news, mpx-native, support, home
- `eastwest/` — home, news, support
- `output/` — home, blog, support
- `uvi/` — falcon-version-lean, portal, workstation, home
- `8dio/` — 403 news body

---

## Recommendation

1. **Do not ship** a Slate RN-title tip chip without an Installers/Hub equality gate — current evidence shows lag vs catalog.
2. File this pass as **dense negatives**; reopen only on genuinely new public tip movement.
3. Optional follow-up (out of scope): if Muse adds a `slate-digital` hub_app row for Complete Access Hub, the Hub RN body history is already a high-quality tip source (2.19.0 as of 2026-09-21 PT evidence).

- **New evidence this pass:** Slate Zendesk API RN-title corpus + VMR 2.10.1.3 body + Hub RN 2.19.0 body; catalog lag proof; UVI Falcon-2026 year-brand negative; Roland Cloud footer non-SKU version; Arturia Nuxt appVersion trap; IL What’s New ≠ plugin semver; IK TONEX banner-path trap; 8Dio 403 wall.
- **Unlocks:** **0** new SKU tip channels.
