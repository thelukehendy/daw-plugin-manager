# NOTES — confidence raise 26 (2026-09-13 ~9:44→9:50 PM PT)

First corroboration pass since the 2026-09-10 pause (resumed per Luke). `verified_by=coding-assistant`. Prefer **new observation + --set-current** for audit trail. Zero trust; no invented versions. Three parallel research batches, coordinator-verified: every raise was re-fetched and confirmed from the manufacturer page before insert. 222 yellows researched; **14 raised**, 208 principled skips.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **14** (yellow→green) |
| plogue manufacturer downloads page @92 | **11** (8 exact + 3 mfr-newer bumps) |
| image-line forum release history @90 | **1** (FL Studio Mobile 4.8.5 → **4.10.19**) |
| scaler-music forum threads @91 | **2** (DC Snares 1.0.0 → **1.2**; Scaler EQ **1.1.3** exact) |
| Snapshot accepted-current green (≥85) | **3368** (+14) |
| Snapshot amber (70–84) | **55** |
| Snapshot yellow (<70) | **1563** (−14) |
| Accepted currents | **4986** |

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---|---:|---:|
| plogue | **11** | `plogue.com/downloads.html` per-product "Version, X, Date" labels (Win+Mac) | **92** |
| image-line | **1** | Official forum release-history thread | **90** |
| plugin-boutique (Scaler Music titles) | **2** | Official Scaler Music forum version threads | **91** |

## Breakdown

### plogue (+11 yellow→green — the cleanest single page of the run)

| plugin_id | version | prior | Evidence |
|---|---|---|---|
| `plogue--alter-ego` | **1.981** | KVR@60 **1.981** → | downloads.html **Version, 1.981**, June 27th, 2025 (exact) |
| `plogue--bidule` | **0.9792** | KVR@60 **0.9792** → | downloads.html **Version, 0.9792**, May 7th, 2026 (exact) |
| `plogue--chipcrusher` | **2.123** | KVR@60 **2.123** → | downloads.html **Version, 2.123**, Aug 21st, 2025 (exact; KVR's "(CLAP 2.1.2.4)" is format-specific) |
| `plogue--chipsynth-c64` | **1.123** | KVR@60 **1.123** → | downloads.html **Version, 1.123**, Aug 21st, 2025 (exact) |
| `plogue--chipsynth-md` | **1.123** | KVR@60 **1.123** → | same (exact) |
| `plogue--chipsynth-ops7` | **1.123** | KVR@60 **1.123** → | same (exact) |
| `plogue--chipsynth-portafm` | **1.123** | KVR@60 **1.123** → | same (exact) |
| `plogue--chipsynth-sfc` | **1.123** | KVR@60 **1.123** → | same (exact) |
| `plogue--chipsounds` | **1.982** | KVR@60 **1.981** → | downloads.html **Version, 1.982**, April 14th, 2026 (mfr newer) |
| `plogue--chipspeech` | **1.982** | KVR@60 **1.981** → | same (mfr newer) |
| `plogue--sforzando` | **1.982** | KVR@60 **1.981** → | same (mfr newer) |
| `plogue--aria-engine-player` | — | KVR@60 kept | No ARIA section on downloads page (engine ships bundled; no standalone published version) |

Note: plogue.com previously 403'd from this network (raise 17); the downloads page now renders publicly. Worth re-checking other 403-blocked mfrs opportunistically.

### image-line (+1)

| plugin_id | version | prior | Evidence |
|---|---|---|---|
| `image-line--fl-studio-mobile` | **4.10.19** | KVR@60 **4.8.5** → | Official IL forum release-history thread: "FL STUDIO MOBILE 4.10.19 (August 5 2026)"; KVR's 4.8.5 is a real but superseded 2025-06-26 build |

### plugin-boutique / Scaler Music (+2)

| plugin_id | version | prior | Evidence |
|---|---|---|---|
| `plugin-boutique--dc-snares` | **1.2** | KVR@60 **1.0.0** → | Scaler Music forum "DC Snares 1.2 Update" (Mar 7, 2025): "you can update to 1.2" (mfr newer) |
| `plugin-boutique--scaler-eq` | **1.1.3** | KVR@60 **1.1.3** → | Scaler Music forum "Scaler EQ Latest Version / Updates": "CURRENT VERSION: Scaler EQ 1.1.3 (available August 2, 2024)" (exact) |

Watch: Scaler EQ Pro announced Sept 2026 (launches Sept 23) as a **separate paid product** — do not stamp onto the Scaler EQ id.

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| **hornet** **36** yellow | Re-fetched 19 product pages: 15 marketing-only (no semver banner — Angle, Freqs, CompExp, StereoView, 3XOver, Dynamics Control, H160, MixComp, Molla, TreBande, VCA, ZeroWidth, MultiComp, Magnus Lite, TapeLite); 3 gen-1←successor redirects (AnalogStage→MK2 **1.0.5**, ELM128→MK2 **2.2.2**, HDS1→MK2 — NOT stampable). 17 not re-fetched (browser tool failures mid-pass); prior raise 8/9 skips stand. |
| **image-line** other **29** | All discrete plugins ship daw-bundled with the FL Studio installer or behind the account portal; official product pages carry zero version badges (Autogun page fetched and verified); Juice Pack listing renders no version data for any of the 10 constituents. No daw-bundle version stamped onto discrete ids. |
| **landr** **15** | Installers exclusively via account-walled app.landr.com "My Plugins"; landr.com pages are marketing copy with zero version strings (two product pages fetched verbatim); no changelog/release-notes anywhere on landr.com or support.landr.com. Only path forward: authenticated portal session. |
| **cymatics** **19** | Zero version data published on cymatics.fm (all marketing pages); downloads account-walled. Caveat: live fetches failed for this batch, evidence rests on recent cached crawls — skip conclusions still sound, but the old Diablo soft-404 claim could not be re-verified (collection page still lists "Diablo - Drum Enhancer $37" as purchasable; may be a dead legacy URL, not a dead product). |
| **nugen-audio** **27** | Halo Upmix product page fetched live: pure marketing copy, zero version strings; installers behind login-walled My Products / Build Archive. No public corroboration path. |
| **sonible** **14** | help.sonible.com confirms latest versions live only under hub-walled My Account Downloads; legacy pages redirect to successor gens (smart:EQ 4, smart:comp 3, smart:reverb 2, learn:bundle) or Soft404 — none stampable onto legacy ids. |
| **acon-digital** **13** | Walked the entire public `/software/` listing (1,648 lines): zero DeEss/Studio* installer rows; current Studio builds are account-only. |
| **audiority** **13** | Plugin Versions table (37 SKUs) has none of the 13 leftovers; freeware product pages versionless; British Tanks bundle page "Current bundle version: 1.0" is a bundle-level mismatch vs single-SKU KVR 1.0.1 — not stamped. |
| **output** **11** | Thermal owner's manual fetched in full: zero version strings; everything ships via Output Hub or account-gated Downloads tab; product pages are SPA shells. |
| **cableguys** **15** | ShaperBox 3 manual v3.6.3 names module *major gens* in chapter headings only; stamping ShaperBox 3.6.3 onto module lines is a banned anti-pattern. No per-module Manual PDFs exist. |
| **plugin-boutique** other **14** | pluginboutique.com product pages publish no version badges/changelogs (install instructions only; downloads via My Products/Beatport Access). Carbon Electra v1 page now discontinued (redirects to homepage), replaced by Carbon Electra 2 as a separate product — 1.5 uncorroborated. BigKick/StereoSavage 2's actual developer (Credland Audio) publishes no semver; VirtualCZ dev (olilarkin.co.uk) no semver. |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3368** / amber **55** / yellow **1563**

## Universe-expansion lead (from cymatics batch)

cymatics.fm now lists products **not in the store** — candidate universe-expand-12 material: PINCH, SHIFTER, HALO, HOOKLAB, 8BIT, PHANTOM, INVADER Lite, PLINKO, NOVA FX, Key Finder, PULSE, CRT, SPACE CADET, MIDI Shredder, Velvet Lite, Neptune Lite, Mix Link, Neptune, Aurora, Keys. Also: Dark Sky is currently free (was $35).

## Playbook / doc updates

- `NOTES-confidence-raise-26.md` (this file)
- `playbooks/{plogue,image-line,plugin-boutique,hornet,landr,cymatics,nugen-audio,sonible,acon-digital,audiority,output,cableguys}.md` — raise-26 entries
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB (**583 / 8439 / 4986**)

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-13 ~9:50 PM PT |
| Manufacturers | **583** |
| Plugins | **8439** |
| Accepted currents | **4986** |
| Raised | **14** |
| Bands | green **3368** / amber **55** / yellow **1563** |
| verified_by | coding-assistant |
