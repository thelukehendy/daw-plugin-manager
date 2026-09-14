# NOTES — Airwindows + SSL expand-3 chip

Date: **2026-09-10 ~2:49→3:00 AM PT** (2026-09-10T09:49–10:00Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`  
Policy: public pages/installers only; zero invented versions; no STATUS/HANDOFF/export rewrite.

## Baseline → after (this chip)

| metric | before (chip start) | after | Δ |
|---|---:|---:|---:|
| manufacturers | 520 | 520 | 0 |
| plugins | 5960 | 5960 | 0 |
| accepted currents | ~4267 | **4265** | **−2** (cleared weak LMC-1 / X-ISM) |
| version_observations | ~5775 | **5796** | +21 (incl. Consolidated refresh + concurrent) |
| `identity_kind=plugin` without version | ~554 | **554** | 0 net (notes/classify only) |
| airwindows without version | 512 | **512** | 0 (Consolidated already current) |
| ssl without version | 6→ | **8** | +2 cleared discontinued currents |

---

## A) Airwindows — strategy decision

### Public versioning reality

| channel | finding |
|---|---|
| **airwindows.com** | Weekly blog posts; each new algorithm ships as a **date-stamped** standalone AU/VST **zip** (e.g. `FastDistance.zip`). **No per-plugin semver** in manufacturer materials. |
| **Airwindows Consolidated** | Separate multi-FX host (CLAP/AU/VST3/LV2) wrapping the algorithm catalog. Official download = GitHub **`baconpaul/airwin2rack`** rolling tag **`DAWPlugin`** (+ Nightly builds exist, not used here). airwindows.com/consolidated links here. |
| **GitHub `airwindows/airwindows`** | **No Releases** — source/history only. |
| **Homebrew** | **No cask / formula** for Airwindows or Consolidated (`formulae.brew.sh` API scan 2026-09-10). |

### Decision (applied)

1. **Accept ONLY** `airwindows--airwindows-consolidated` from the DAWPlugin release asset/body naming.  
2. **Do NOT** stamp Consolidated’s version onto ~514 individual algorithm SKUs. Individuals remain `identity_kind=plugin` with **no** `latestVersion`.  
3. **Do NOT** mass-reclassify individuals as `suite_component` — standalones are still real AU/VST2 downloads; Consolidated is an alternate host product, not the sole product identity. Matches `NOTES-identity-kind-classify.md` caution against mass reclass unless clearly correct.  
4. Optional UX notes applied to all **512** unversioned airwindows rows (`notes_for_user` explains no per-SKU semver + do-not-stamp rule). `is_freeware=1` set for manufacturer.

### Consolidated accept

| field | value |
|---|---|
| plugin_id | `airwindows--airwindows-consolidated` |
| version | **`2026-09-05-2a6d1c0`** |
| source_url | https://github.com/baconpaul/airwin2rack/releases/tag/DAWPlugin |
| source_kind | `downloadsPage` |
| content_hash | `81adc74a856f7e0c28f49ac627242ae1dd54a4b1a7a65997a404662eecdcad3c` |
| evidence | Release body: “Release updated Sat Sep 5 20:40:18 UTC 2026”; commit `2a6d1c0` “Update to Latest Airwin”; macOS asset name `airwindows-consolidated-macOS-2026-09-05-2a6d1c0.dmg` (assets lazy-loaded via include-fragment; confirmed via WebFetch of same URL) |
| confidence | 92 |
| action | **Refreshed** existing current (same version) with hash + evidence — **net +0 currents** |

### Individuals

- **512** unversioned algorithms: left as gaps; notes only.  
- Prior weak KVR `1.0` currents remain on **`airwindows--softgate`** and **`airwindows--drumslam`** (confidence 60) — **not expanded**; manufacturer site still has no honest per-SKU semver. Documented as low-trust outliers; do not use as pattern for the other 512.  
- No Homebrew path for weekly scrub of individuals.

### identity_kind

**No mass reclass.** Consolidated stays `plugin` (it is a discrete installable host). Algorithms stay `plugin` with explanatory notes.

---

## B) SSL expand-3 fills (~14 ids)

### Already versioned before/during overnight (skip re-accept)

Confirmed against SSL Support offline table  
https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads  
(content_hash `3541a074131d0d101091e7166c27360308e93017a4b3ee74988213053bd6066b`):

| plugin_id | current | downloadsPage label | notes |
|---|---|---|---|
| `ssl--ssl-4k-g` | **1.3.1** | 4K G v1.3.1 | matches |
| `ssl--ssl-autobus` | **1.0.17** | AutoBUS v1.0.17 | matches |
| `ssl--ssl-autodyn` | **1.0.5** | AutoDYN v1.0.5 | matches |
| `ssl--ssl-autoeq` | **1.0.41** | AutoEQ v1.0.41 | matches |
| `ssl--ssl-deess` | **1.4.1** | DeEss v1.4.1 | **near-dupe** of `ssl--ssl-deessentials-deess` @ 1.4.1 (same product; keep both ids, document) |
| `ssl--ssl-x-orcism-ii` | **1.0.4** | separate “X-Orcism2” CTA (no version in main table) | KVR receipt; not re-probed |

### Hardware reclass (5) — not plugins

KVR titles = “500 Series Application / Hardware”; manufacturer product pages are 500-series modules (not on SSL Plug-in Downloads).

| plugin_id | identity_kind | action |
|---|---|---|
| `ssl--ssl-b-series-dynamics` | `hardware` | notes added |
| `ssl--ssl-e-series-dynamics` | `hardware` | notes added |
| `ssl--ssl-six-channel` | `hardware` | notes added |
| `ssl--ssl-ultraviolet-eq` | `hardware` | notes added |
| `ssl--ssl-vhd-pre` | `hardware` | notes added |

**No versions** stamped (hardware ≠ DAW plugin semver).

### Discontinued freeware (2)

| plugin_id | action |
|---|---|
| `ssl--ssl-lmc-1` | `discontinued`; successor → `ssl--ssl-lmc` (LMC+ **1.5.2** on downloads page). Cleared weak KVR `1.0` current. |
| `ssl--ssl-x-ism` | `discontinued` freeware inter-sample meter; not on current/legacy SSL offline tables. Cleared weak KVR `1.1` current. |

### Portal-only skip

| plugin_id | reason |
|---|---|
| `ssl--ssl-meter-pro` | Still **unknown**. Store page = Download Manager CTA only. Offline table has **Meter v1.6.6** only (≠ Meter Pro). Prior reject of Meter→Meter Pro mapping stands. KVR Meter Pro `1.3.7` **not** accepted (manufacturer public installer evidence missing). |

### SSL accepts this chip

**0 new version accepts** (fills already receipted or non-plugin).  
**−2** currents cleared (LMC-1, X-ISM).  
Identity honesty: +notes on hardware; 2→`discontinued`.

---

## Madrona

Left to sibling executor per brief — not touched.

---

## Artifacts

| path | role |
|---|---|
| `NOTES-airwindows-ssl-chip.md` | this file |
| `tmp-fetch/ssl-airwindows/github-DAWPlugin.html` | GitHub DAWPlugin page (hash above) |
| `tmp-fetch/ssl-airwindows/*484951*` | SSL Plug-in Downloads HTML |
| `tmp-fetch/ssl-airwindows/kvr-*.html` | KVR probes for SSL gaps |

## Scrub playbook notes (Airwindows)

- **Consolidated:** weekly check `DAWPlugin` rolling release asset names (`…-YYYY-MM-DD-<shortsha>.dmg`).  
- **Individuals:** no semver scrub target — blog date ≠ product version; leave gaps unless Chris publishes per-SKU versions.  
- **Never** copy Consolidated version onto algorithm SKUs.

