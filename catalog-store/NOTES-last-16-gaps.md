# NOTES — last 16 true plugin version gaps (2026-09-09 PT)

Exhaustive public-avenue pass over the **16** remaining `identity_kind=plugin` unknowns after identity-kind classify.

Start: **2644/2827** accepted · **183** unknown · **16** true plugin gaps.  
End: **2653/2827** accepted · **174** unknown · **4** true plugin gaps.  
Δ versions **+9** · Δ discontinued classify **+3** (Xtressor, Indent gen-1, ERA).  
`verified_by=coding-assistant`. No git clone.

## Avenues used (every SKU)

WebSearch · manufacturer product/downloads pages · Plugin Alliance `products.json` (288 products, pages 1–2) · KVR product pages · CDN installer filenames · press/support articles · Wayback CDX (TLS often failed this pass) · Internet Archive mentions.

## Accepted (+9)

| plugin_id | version | conf | source | receipt |
|---|---|---:|---|---|
| `louder-than-liftoff--ltl-chop-shop-eq` | **1.4.1** | 88 | PA product | `Installer v1.4.1` — https://www.plugin-alliance.com/products/chop-shop |
| `karanyi--karanyi-sounds-wavesurfer` | **1.0.0** | 88 | PA product | `Installer v1.0.0` — https://www.plugin-alliance.com/products/wavesurfer |
| `thx--thx-spatial-creator` | **1.1.0** | 88 | PA product | `Installer v1.1.0` — https://www.plugin-alliance.com/products/spatial-creator |
| `credland--pink` | **1.1.1** | 90 | Credland downloads | `Install Pink 1.1.1 Mac.pkg` / Windows.exe — https://www.credland.net/pink.html |
| `cymatics--origin` | **1.0.0** | 90 | Cymatics CDN | `Mac/Win Cymatics Origin 1.0.0.zip` — thank-you page CDN |
| `wa-production--heat2` | **2.1.0** | 85 | WA update log | `New Features in version 2.1.0 - 17th April 2024` — waproduction.com (KVR 2.2.1 **not** corroborated → skipped) |
| `harrison--harrison-vocalintensityprocessor` | **2.0.0** | 88 | Harrison downloads | CDN `Harrison_VocalIntensityProcessor_v2.0.0.39457821-osx.pkg` (page label v2.1.0 mismatched; **filename wins**) |
| `audiopunks--ap-sansamp-rack` | **1.0.1** | 90 | Audiopunks downloads | `SansAmp Rack-v1.0.1.pkg` on audiopunks.b-cdn.net — https://audiopunks.com/downloads/ |
| `con--lurssen-mastering-console` | **1.2.0** | 60 | KVR | `verwin` 1.2.0 — IK Multimedia product (**not** on PA). Catalog `manufacturer_id=con` is a misfile; twin row `ik-multimedia--lurssen-mastering-console` already @ 1.2.0 |

Artifacts under `tmp-fetch/last16/` (HTML + `pa-products-p*.json`).

## Discontinued / successor (no version mapped onto legacy SKU)

| plugin_id | action |
|---|---|
| `kiive--xtressor` | `identity_kind=discontinued` → successor `kiive--kiive-xtcomp` (**already @ 1.0.4** PA). Rename/reskin (Distress or IP). PA products.json has `xtcomp` only; Reddit/PA confirm Xtressor→XTComp. |
| `unfiltered--indent` | `identity_kind=discontinued` → successor `unfiltered-audio--unfiltered-audio-indent-2` (**already @ 2.4.1** PA `indent-2`). Gen-1 not public on PA. |
| `accusonus--era` | `identity_kind=discontinued`. Meta acquisition 2022 sunset; ERA 6 abandonware/IA free bundle; not a live iZotope Product Portal SKU. Cleared misleading `portal_app`. |

## Still unknown (true plugin gaps = 4)

| plugin_id | last probes |
|---|---|
| `ssl--ssl-meter-pro` | store.solidstatelogic.com/plug-ins/meter-pro — no installer semver. SSL+Harrison downloads lists **Meter v1.6.6** only (not Meter Pro). User guide / press (May 2025 announce) have no build. Offline-installers FAQ URL 404. Hub: SSL Download Manager. |
| `mpegh--mpeg-h-renderer` | Fraunhofer/Avid PT 2026.4 integration; installer only via Avid Link / MyAvid. What’s New PDF documents install, **no public semver**. Not on PA / KVR. |
| `pitchinnovations--groove-shaper-lite` | Pro Tools–bundled MIDI FX Lite (2024.3+). Full Groove Shaper has retail installers (v1.2.0+ for expansions); **Lite has no standalone public installer semver**. |
| `soundspot--propane` | No live manufacturer product page with version. KVR slug redirects to newest-plugins. Plugin Boutique page has no version. Wayback CDX TLS failed this pass. Pirate mirrors claim 1.0 — **rejected**. |

## PA products.json notes

- Queried `https://www.plugin-alliance.com/products.json?limit=250&page={1..}` → **288** products.
- Hits used: `xtcomp`, `indent-2`, `chop-shop`, `wavesurfer`, `spatial-creator`, `silver-bullet-mk2`.
- **No** Lurssen, SansAmp, ERA, Propane, Meter Pro, MPEG-H.

## Totals

| metric | before | after |
|---|---:|---:|
| universe | 2827 | 2827 |
| accepted currents | 2644 | **2653** |
| unknown (no version) | 183 | **174** |
| true `identity_kind=plugin` gaps | 16 | **4** |
| exported `identityKind` non-default | 167 | **170** (+3 discontinued) |

Export: `out/catalog.json` (`store-export:v4`).
