# Hub-walled creative pass 2 — new angles only (Wave 7 Ask 5) — merged

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (wave7 asks4+5)
- **Bar:** New evidence or don’t file. **No** re-grind of Product Manager / Software Pass / Cloud Manager / ASC.
- **Targets:** IK ~48, KORG ~24, Roland ~4, Arturia ~2, Image-Line 3, Lexicon 1 (wave6 `lane1/FINDINGS.json` posture=`hub_walled`).

## Breakthrough — KORG Collection news-title version feed (NEW)

Public product/news pages embed per-SKU tips in headlines **without** Software Pass login.

| Source | Role |
|---|---|
| `https://www.korg.com/us/products/software/korg_collection/` | News list (`<dt>YYYY.MM.DD</dt><dd><a>… version X.Y…`) |
| Article (body confirms) | `https://www.korg.com/us/news/2025/1205/` → **KC - TRINITY version 1.1.0**; body section “Version 1.1.0 Update Details” (PCG import, USER BANK backup, …) |
| Bundle announcement | `https://www.korg.com/us/news/2025/1212/` — “latest updates released” (headline only; parse carefully — may not list per-SKU tips in static HTML) |

### Chip sketch `korg_collection_news_tip_poller`
1. Weekly GET collection page; extract `(date, href, title)` where title matches `(?i)version\s+(\d+\.\d+(?:\.\d+)?)`.
2. Map title product token (`TRINITY`, `Prophecy`, …) → `korg--*` plugin_id allowlist (operator-owned join table).
3. Fetch article only when title tip is newer than last-good; **confirm tip in body** (TRINITY 1.1.0 pattern).
4. Confidence: headline+body agree → high amber/green after Muse re-fetch; headline-only → amber.
5. Cadence: sparse (event-driven). Rows stay `hub_walled` when news is silent — not a Software Pass replacement.

### Identity / traps
- Hardware OS tips (KRONOS, Keystage, Pa5X, microKORG2 **hardware** updaters) ride the same news firehose → allowlist **software Collection / native series only**.
- **Editor/Librarian** tips (wavestate/modwave Editor v1.5.2 etc.) are hardware companions — do **not** stamp onto `*-native` plugin rows.
- Gadget / iOS / Nintendo Switch tips are different SKUs.
- Demo-version marketing copy ≠ tip.
- Do not invent tips between news events.

### Fixtures
`fixtures/wave7/hub/creative/korg-collection.html` (+ meta), `korg-news-trinity.html` (+ meta), `korg-news-1212.html`, `korg-news-index.html`.
Also mirrored probes: `fixtures/wave7/hub/korg-news-2025-1205.html`, `korg-news-2025-1212.html`, `korg-collection-product.html`.

---

## Negatives (angles tried, still parked) — merged

| Vendor | Angle tried (NEW vs wave6) | Result |
|---|---|---|
| Arturia | `updates.arturia.net` | 200 but CDN77 placeholder (“Push Zone created”) — **not** an update manifest |
| Arturia | `/api/updates`, `/version.json` | 404 |
| Arturia | support updates-manuals HTML | Nuxt shell; versions not in static HTML |
| Arturia | Analog Lab Play / Pigments Play product pages | Free-download/email gate; no versioned `.dmg`/`.pkg` in HTML |
| Roland ZENOLOGY | product page curl | Thin/empty shell; no public semver |
| Roland | `/support/by_product/rc_zenology{,_pro,_fx}/updates_drivers/` | **200 shells with zero version strings** — nav only, downloads via Cloud Manager |
| Roland | `rc_zenology/downloads/` | “Version 2.0” marketing imagery only; Download → Cloud Manager |
| Roland | App Store id guesses / `static.roland.com` listing | 404 / 403 |
| IK news | news index | Marketing/prices; no durable AmpliTube SKU semver feed |
| IK | Syntronik/SampleTank/Clavitube `gear_list_pdf` path clones of AT5 canary | All **404**; no sibling PDF canary |
| IK | `g1.ikmultimedia.com/plugins/{AmpliTube5,Syntronik2,SampleTank4}/*` guessed installers | **403** (listing + objects); PM path also 403 from research IP (known) |
| IK | brew cask API scan | Only `ik-product-manager` 1.1.15 — hub app, not SKU (do not re-present) |
| KORG `/support/download/software/` | | Tiny non-oracle page |
| KORG | brew cask | No Collection/native cask |
| Image-Line | `support.image-line.com/api.php?call=getProductVersion&product=Morphine` (+ Drumaxx/Toxic/…) | 200 body `{"result":false,"error":"Invalid API call"}` — dead API |
| Image-Line | `/fl-studio/plugins/{morphine,drumaxx,toxic-biohazard}/` | Marketing only; no installer filename tip |
| Lexicon | ADN Harman CDN neighbors `1_0_9` / `1_1_0` / `2_0_0` | Only `Lexicon_MPX_Native_Reverb_1_0_8.dmg` still 200; newer guesses 403. No tip movement. |
| Lexicon/Flux | `flux.audio/download/flux-center/` | Soft-404/KB redirect; no public versioned Flux Center installer filename |

**Stay hub_walled:** IK 48 / Roland 4 / Arturia 2 / Image-Line Drumaxx·Morphine·Toxic / Lexicon MPX (Flux “Latest” + stale 1.0.8 oracle already documented in wave6 — no newer public tip).

**Partial unlock only:** KORG 24 gain a news-title tip channel when headlines fire; default posture remains hub_walled + Software Pass.

- **Recommendation:** Implement KORG news poller as optional chip after Muse re-fetch + product→plugin_id map; keep Software Pass as default when news is silent. Do not reopen IK/Roland/Arturia/IL on the angles above.
- **New evidence this pass:** TRINITY 1.1.0 body confirmation; Roland updates_drivers empty-shell proof; IL API dead; IK Syntronik PDF path negatives; Lexicon CDN neighbor closed.
