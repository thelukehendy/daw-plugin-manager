# NOTES — Mid-tails + iZotope / AIR probe

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant  
Method: live GET + SHA-256 of HTML; `accept_observation.py --set-current`; never trust seed.

Starting accepted: **468/816**. Ending: **531/816** (+63 this round).

---

## This round — accepted by manufacturer

| manufacturer | this round | store total after |
|---|---|---|
| xln-audio | **2** | 2/2 |
| applied-acoustics | **3** | 3/3 |
| fiedler-audio | **2** | 2/2 |
| steinberg | **2** | 2/11 |
| izotope | **54** | 54/109 |
| audiomovers | 0 | 0/3 |
| eiosis | 0 | 0/3 |
| air | 0 | 0/26 |
| slate-digital | 0 | 0/26 |
| avid | 0 | 0/54 |
| leftovers (ssl Meter Pro, harrison Vocal*, kiive Xtressor, celemony MelodyneBridge, klanghelm MJUC, adptr) | 0 new | unchanged |

---

## XLN Audio — releaseNotesPage (2/2)

| plugin_id | accepted | source_url | content_hash |
|---|---|---|---|
| xln-audio--rc-20-retro-color | **1.5.1** | https://www.xlnaudio.com/release_notes?filter=rc-20 | `734eae800e9f7d8e568c9ce5bd82a35564e102b85eb35fe363eafb2a06d020cf` |
| xln-audio--ds-10-drum-shaper | **1.3.6** | https://www.xlnaudio.com/release_notes?filter=ds-10 | `1b4be5a31262d838a9083917eb71aa06cfd85f148c215e8af2ead3b4354fb906` |

Evidence: Release Notes table Product \| Version; latest row per filter. Product marketing pages do not publish version strings (account installer).

---

## Applied Acoustics Systems — downloadsPage (3/3)

Source: https://www.applied-acoustics.com/support/  
content_hash: `5aee21bb881bbe8f2ec9f90445d1a0fe74a738976e5e9d0e46050d4d0bcb2fb1`

| plugin_id | accepted | evidence |
|---|---|---|
| applied-acoustics--lounge-lizard-session | **4.4.5** | Support “Latest installers” table: Lounge Lizard Session 4 v4.4.5 |
| applied-acoustics--strum-acoustic-session | **2.4.5** | Table: Strum Session 2 v2.4.5 (store name Strum Acoustic Session) |
| applied-acoustics--ultra-analog-session | **2.3.5** | Table: Ultra Analog Session 2 v2.3.5 |

Session Bundle marketing page also exposes public macOS/Windows installer URLs with version in path (`session-bundle-4-v406` etc.) but support table is the clearer per-SKU oracle.

---

## Fiedler Audio — productPage via Plugin Alliance (2/2)

Fiedler site product/downloads pages do not publish installer semver; distribution is PA.

| plugin_id | accepted | source_url | content_hash |
|---|---|---|---|
| fiedler-audio--fiedler-audio-splat | **1.0.0** | https://www.plugin-alliance.com/products/splat | `6a284e4e9afb450fa5063b8db03671e86ee74566b4113334f62abd4d67f57f07` |
| fiedler-audio--fiedler-audio-stage | **1.2.0** | https://www.plugin-alliance.com/products/stage | `3e95b822bad14d7c9ba0ffd16df91c760b5bdfad27ea55a0dbb88e8e2f51cd0f` |

Evidence: title “fiedler audio splat/stage”; `Installer vX.Y.Z (Mac/Win)`.

---

## Steinberg — downloadsPage (2/11)

Public offline-installer pages only (no Download Assistant login).

| plugin_id | accepted | source_url | content_hash |
|---|---|---|---|
| steinberg--spectralayers | **13.0.20** | https://o.steinberg.net/en/support/downloads/spectralayers_13.html | `51ca77c762245466958e269e9c4d3f510ce6579118973917ef124ca72a94644e` |
| steinberg--wavelab | **13.0.30** | https://o.steinberg.net/en/support/downloads/wavelab_13.html | `d725e233bda640e8406db675d4558b1aff5960cb78457f42f6b80013fec25b1f` |

Left unknown: Lindell 254E/354E/TE-100, 6X/7X/PEX-500, ChannelX, Reason Rack Plugin, SpectraLayers-Bridge (separate manufacturer id). No crystal-clear public per-plugin versions found without account/SDA.

Download Assistant itself publishes **1.40.1** on https://o.steinberg.net/en/support/downloads/steinberg_download_assistant.html — not a store plugin SKU.

---

## iZotope probe — releaseNotesPage (54/109)

**Scope:** public product / release-notes pages only. **No** Native Access / account downloads.

### Accepted

| family | version | source | content_hash | plugins |
|---|---|---|---|---|
| Neutron 5 (+ 11 modules) | **5.2.0** | https://www.izotope.com/pages/release-notes/neutron | `94bb0358a644bc97b136a488bd6b48f1fb4928ee02ba1ca72b2ffd478fbe3807` | 12 |
| Ozone 11 (+ 17 modules) | **11.3.0** | https://www.izotope.com/pages/release-notes/ozone-standard | `5938cd6a574cc17f6f5b861bfefec1f02e65240dd3937e035b86a61ee817a300` | 18 |
| RX 11 modules | **11.4.0** | https://www.izotope.com/pages/release-notes/rx-standard | `2d979bf05c66d624911e5737b1e0ecda2dc2aa039a1869173459bc7354243ce8` | 20 |
| Trash (reimagined) | **1.3.0** | …/release-notes/trash | `17545b629e16244abfeb65a98e3e2da4cb5aca5c45e8228fc5788238fac63b0e` | 1 |
| Vinyl | **1.13.0** | …/release-notes/vinyl | `59770f650e674c50897fffc3be18b63aff2b9a70ed169364bda8fc03b6672126` | 1 |
| Vocal Doubler | **1.4.0** | …/release-notes/vocal-doubler | `5f38011be67334f243f8d07f89800f8da9ab95078bbc8dbff9d8513e586553d4` | 1 |
| Tonal Balance Control 2 | **2.10.0** | …/release-notes/tonal-balance-control | `30d5302c2de4b65940701e5ee98bbc980a9634e6e742dc2689f865f413ff5a10` | 1 |

Evidence pattern: `<h2>Version X.Y.Z released …</h2>` as latest for that generation.

**Generation notes (important):**
- Ozone Standard RN page is titled **Ozone 12**; latest headline is 12.1.0. Store universe is **Ozone 11** / **Ozone 9** only — accepted **11.3.0** as last documented 11.x in that history (not 12.1.0).
- RX Standard RN page tracks **RX 12** (12.0.0) then prior 11.x — accepted **11.4.0** for store RX 11 modules only.
- TBC RN page is **Tonal Balance Control 3** (latest 3.2.0); accepted **2.10.0** as last TBC 2.x for store `tonal-balance-control-2`.

### Left unknown (55)

- Ozone 9 (+ modules), Neutron 3 Elements, Nectar 3 Elements  
- RX 8 / RX 9 modules, generic `izotope--rx`  
- Iris 2 (RN URL 404), Trash 2, Relay (RN page present but no Version headings)  
- No public crystal-clear mapping from Ozone 12 / RX 12 / TBC 3 onto store SKUs that are named for older generations

Product marketing pages (Vinyl/Trash storefront) do not publish installer semver; RN pages do.

---

## Audiomovers — probed, 0 accepted

https://audiomovers.com/downloads/ (live HTML, sha `d5a60ae4fdc524d4852ce83f5739559004ad8ca1644830453e3381063b8112e8`) publishes multiple concurrent “Plugin Version” labels (e.g. LISTENTO **v2.102** Mac vs **v2.137** Win) plus older archive installers. No single crystal-clear unified current plugin version for Listento / Listento-MIDI / Listento-Receiver → left unknown.

---

## AIR Music Technology — probed, 0 accepted

- https://www.airmusictech.com/downloads/ pushes updates through **inMusic Software Center** (no public per-plugin semver table).  
- https://support.airmusictech.com/ — install/activation/compatibility articles only.  
All 26 AIR SKUs remain unknown.

---

## Eiosis — probed, 0 accepted

eiosis.com redirects to Slate Digital. AirEQ / E2Deesser product URLs on slatedigital.com and PA returned 404 / home. No public installer version found → 0/3.

---

## Slate Digital / Avid — light probe, 0 accepted

- Slate home markets “Virtual Mix Rack 3.0” etc. but no per-plugin installer semver; install path is portal/Central-class.  
- Avid plugins marketing page; account downloads 404 without auth; versions expected via Avid Link / account.  
Do not force.

---

## Leftover mid-tails (still unknown)

| plugin | note |
|---|---|
| ssl--ssl-meter-pro | Not on SSL/Harrison offline installer article |
| harrison--harrison-vocalflow / vocalintensityprocessor | Not on same SSL/Harrison downloads article |
| kiive--xtressor | PA slug redirects/home; no Installer v label |
| celemony--melodyne-bridge | Still no public version oracle |
| klanghelm--mjuc | Paid; user-area only |

adptr remains 5/5 from prior run.

---

## Export

`python3 src/export_catalog.py` → `out/catalog.json`  
**100 manufacturers, 816 plugins, 531 with accepted latestVersion.**
