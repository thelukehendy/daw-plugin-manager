# NOTES — Plugin Alliance remaining version chip (universe expand2 gaps)

Date: 2026-09-10 ~1:46–2:00 AM PT
Verified by: coding-assistant

## Scope
- 57 listed gap ids (KVR expand2 duplicates / short Unfiltered names under `plugin-alliance--`).
- Public PA product pages + `products.json` handle discovery only (no Installation Manager / account portal).
- Do **not** export `catalog.json`.

## Method
1. Refresh `https://www.plugin-alliance.com/collections/all/products.json` (288 products, 2 pages).
2. Live GET `/products/{handle}` → extract `Installer vX.Y.Z (Mac…)` + sha256 HTML.
3. KVR Product Version @60 only when no PA public Installer (dearVR Music).
4. Never map gen2 Installer onto gen1 SKU (Dent / Indent policy).

## Accepted this chip

| plugin_id | ver | conf | method |
|---|---|---|---|
| `plugin-alliance--bettermaker-bus-compressor` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--bettermaker-c502v` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--bettermaker-eq232d` | **1.1.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--bettermaker-mastering-compressor` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--bettermaker-passive-equalizer` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--dearvr-music` | **1.10.0** | 60 | kvr-product-page |
| `plugin-alliance--dearvr-pro` | **1.10.0** | 60 | kvr-product-page |
| `plugin-alliance--elysia-karacter` | **1.11.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--elysia-museq` | **1.15.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--fiedler-audio-splat` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--fiedler-audio-stage` | **1.2.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--kiive-xt-comp` | **1.0.4** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-69` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-902-de-esser` | **1.0.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-254e` | **1.2.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-354e` | **1.0.4** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-50-series` | **1.0.4** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-6x-500` | **1.2.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-7x-500` | **1.2.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-80-series` | **1.0.6** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-channelx` | **1.2.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-eq825` | **1.0.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-mbc` | **1.0.4** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-pex-500` | **1.2.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-sbc` | **1.0.4** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-audio-te-100` | **1.1.3** | 90 | pa-product-page-installer-label |
| `plugin-alliance--lindell-mu-66` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--ltl-silver-bullet-mk2` | **1.1.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--maag-audio-eq2` | **1.12.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--maag-audio-eq4` | **1.16.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--maag-audio-eq4-ms` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--maag-audio-magnum-k` | **1.7.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--neold-rz062` | **1.2.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--shadow-hills-mastering-compressor-class-a` | **1.5.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--spl-machine-head` | **1.0.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--swivel-audio-bde-big-distortion-engine` | **1.2.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--swivel-audio-click-boom` | **1.1.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--swivel-audio-hitstrip` | **1.3.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--swivel-audio-knocktonal` | **1.2.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--swivel-audio-spread` | **1.3.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--three-body-technology-trinity-shaper` | **1.1.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--thx-spatial-creator` | **1.1.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-bass-mint` | **1.1.7** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-battalion` | **1.2.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-fault` | **1.4.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-g8` | **1.6.2** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-instant-delay` | **1.3.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-lion` | **1.5.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-lo-fi-af` | **1.1.11** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-needlepoint` | **1.0.7** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-sandman` | **1.4.1** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-silo` | **1.1.7** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-specops` | **1.4.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-tails` | **1.1.0** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-triad` | **1.3.5** | 90 | pa-product-page-installer-label |
| `plugin-alliance--unfiltered-audio-zip` | **1.4.2** | 90 | pa-product-page-installer-label |

**Accepted with current: 56** / 57 unique resolved targets. Still unknown in this set: **1**.

### Notable accepts (samples)
- `plugin-alliance--bettermaker-eq232d` **1.1.0** ← `https://www.plugin-alliance.com/products/eq232d`
- `plugin-alliance--lindell-audio-te-100` **1.1.3** ← `https://www.plugin-alliance.com/products/te-100`
- `plugin-alliance--neold-rz062` **1.2.0** ← `https://www.plugin-alliance.com/products/rz062`
- `plugin-alliance--spl-machine-head` **1.0.0** ← `https://www.plugin-alliance.com/products/machine-head`
- `plugin-alliance--ltl-silver-bullet-mk2` **1.1.0** ← `https://www.plugin-alliance.com/products/silver-bullet-mk2`
- `plugin-alliance--thx-spatial-creator` **1.1.0** ← `https://www.plugin-alliance.com/products/spatial-creator`
- `plugin-alliance--fiedler-audio-stage` **1.2.0** ← `https://www.plugin-alliance.com/products/stage`
- `plugin-alliance--kiive-xt-comp` **1.0.4** ← `https://www.plugin-alliance.com/products/xtcomp`

### Suite / alias notes
- `elysia-karacter` / `elysia-museq` (umbrella) share Installer with existing master/mix seed SKUs (`karacter` 1.11.0, `museq` 1.15.0).
- Swivel BDE/Click Boom/HitStrip/Knocktonal/Spread match prior `*-pa` seed accepts.
- Maag `maag-audio-*` expand2 ids match prior `maag-*` seed accepts on same handles.
- Shadow Hills Class A expand2 id matches prior `shadow-hills-class-a-mastering-comp` **1.5.0**.
- Trinity Shaper expand2 id matches prior `tbtech-trinity-shaper` **1.1.2**.
- Unfiltered expand2 ids under `plugin-alliance--unfiltered-audio-*` match prior `unfiltered-audio--*` accepts on same PA handles.
- Short list names (`battalion`, `fault`, …) are **not** store ids; resolved to `plugin-alliance--unfiltered-audio-{name}`.

## Skipped / left unknown

| plugin_id | reason |
|---|---|
| `plugin-alliance--unfiltered-audio-dent` | PA `/products/dent` **404**; live Installer **2.4.1** is **Dent 2** only (`/products/dent-2`). Concurrent KVR accept of 2.4.1 onto Dent gen1 **rejected** (gen mismatch). |
| `plugin-alliance--unfiltered-audio-indent` | Same family; Indent gen1 still 404 (Indent 2 separate). Not in original 57 short list as indent but remains PA unknown. |

### dearVR
- **Music**: no PA handle in `products.json` / 404 on slug guesses. Accepted **1.10.0** via KVR `dearvr-music-by-dear-reality` (Product Version 1.10 / reviewed 1.10.0) @60.
- **Pro**: no PA page. Concurrent mop already set **1.10.0** via KVR `dearvr-pro-by-plugin-alliance` @60 (distinct from Dear Reality **PRO 2** @ 2.1.0.1). Left as-is; manufacturer site redirects to Sennheiser marketing (no semver).

## PA manufacturer rollup
- Accepted with current: **247/264**; still unknown: **17** (legacy/renamed/discontinued long-tail — alpha master/mix, bx_XL V2, The Sauce, Indent gen1, Dent gen1, etc.).

## Artifacts
- `tmp-fetch/pa-remain/products-page*.json`, `handle-index.json`, `{handle}.html`, `extract-results.json`, `accept-summary.json`
- Playbooks: `playbooks/plugin-alliance.md`, `playbooks/bettermaker.md` updated.

