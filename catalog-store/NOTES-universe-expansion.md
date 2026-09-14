# NOTES — Universe expansion batch 1 (identity only)

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Actor: coding-assistant (executor)

## Goal

Expand the DAW Plugin Manager **product universe** (manufacturers + plugins identity) far beyond the seed ~816 plugins, using public sources. **No fake versions**: do not set `latestVersion` / do not create `version_observations` unless a crystal-clear public receipt exists in the same pass (this batch is identity-only).

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 100 | 474 | **+374** |
| plugins | 816 | 2827 | **+2011** |
| version_observations | 604 | 604 | 0 (preserved) |
| plugin_version_current | 595 | 595 | 0 (preserved) |
| plugins with accepted current | 595 | 595 | 0 |

Target was **+200 or more**; achieved **+2011** identity rows.

Export: `out/catalog.json` — 474 manufacturers, 2827 plugins, 595 with accepted `latestVersion` (Policy A unchanged).

## Artifacts

| Path | Role |
|---|---|
| `src/import_universe_batch.py` | Upserts manufacturers/plugins from JSON **without wiping** versions |
| `data/universe-expansion-batch1.json` | Batch payload (~2011 plugins, 374 manufacturers) |
| `tmp-fetch/build_universe_batch1.py` | Builder used to assemble the batch from fetched sources |
| `tmp-fetch/oas-slim.json` | Slim extract of Open Audio Stack registry plugins |
| `tmp-fetch/kvr-*.html` | Cached KVR developer pages |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/import_universe_batch.py data/universe-expansion-batch1.json
python3 src/stats.py
python3 src/export_catalog.py
```

`import_universe_batch.py` explicitly ignores `latestVersion` / version evidence fields and never writes `version_observations` or `plugin_version_current`.

## Source methodology

### Researched / fetched

1. **KVR Audio developer listings** (`https://www.kvraudio.com/developer/<slug>`)  
   Parsed “Quick Product Select” product titles + slugs. Used for Waves, Softube, Universal Audio, McDSP, AudioThing, Cableguys, D16, Cherry Audio, Baby Audio, Output, Spitfire, Nugen, Acon, Newfangled, Kazrog, LiquidSonics, Overloud (filtered), IK Multimedia (filtered), SPL, u-he, Xfer, Synchro Arts, Leapwing, Audio Ease, apulSoft, ChowDSP, oeksound.

2. **Softube Flow Complete Suite** public page (`https://www.softube.com/flow-complete-suite`)  
   Extracted product `<h3>` names for Softube identity (plus KVR Softube fill for titles not on that page).

3. **Arturia public collection pages**  
   - FX Collection 6 details → 39 FX titles  
   - V Collection 11 overview → instrument titles  
   Portal: Arturia Software Center FAQ/download activation page.

4. **Open Audio Stack registry** (`https://open-audio-stack.github.io/open-audio-stack-registry/plugins/`)  
   559 FOSS packages as identity rows. Authors become `oas--<author-slug>` manufacturers (or mapped onto existing `chowdsp` / `surge-synthesizer` when known). `identity_source=open-audio-stack-registry-2026-09`. Portal = package project URL from the registry.

5. **PluginHub marketing claims** (`https://www.pluginhubapp.com/`)  
   Public homepage claims **7,136 plugins / 3,710 live-checked / 292 brands** (as of fetch). Vendors table is JS-walled (no usable dump). Used as coverage benchmark only — **not** as a row source.

6. **Curated official pages** (when KVR slug missing/redirected)  
   - Vital (`vital.audio`) → Vital  
   - Toontrack Product Manager ecosystem → Superior Drummer 3, EZdrummer 3, EZkeys 2, EZbass, EZmix 3, Product Manager  
   - Surge Synth Team downloads → Surge XT, Surge XT Effects, Shortcircuit XT  
   - Celemony Capstan product page  
   - oeksound Sculpt / Spiff

### Filters (quality)

- Skip bundles/suites/collections/toolkits (with Softube Flow / Output / Spitfire allowances).  
- Skip hardware (Apollo interfaces, iRig/iLoud/iKlip, etc.).  
- Skip cab IR packs (`NxN` naming) and Overloud BHS/rig packs.  
- Skip Computer Music “CM” editions and Reason Rack Extensions (`… RE`).  
- Skip Kontakt-wrapped / iOS-only titles.  
- IK Multimedia kept to software lines (AmpliTube, T-RackS, SampleTank, Syntronik, etc.).  
- Universal Audio: skip Apollo hardware SKUs.  
- Strip KVR UI junk (“Direct link to this review”).  
- Every new plugin has non-empty `matchPatterns`, `updatePortalUrl` (plugin or manufacturer portal), and `identity_source` provenance.  
- Stable IDs: `{manufacturerId}--{slugified-name}` (OAS uses `oas--{author--package}`).

### identity_source values (batch breakdown, approx.)

| Count | identity_source |
|---:|---|
| 559 | open-audio-stack-registry-2026-09 |
| 240 | kvr-developer-waves-2026-09 |
| 202 | kvr-developer-universal-audio-2026-09 |
| 156 | kvr-developer-ik-multimedia-2026-09 |
| ~163 | softube-flow-complete-suite + kvr-developer-softube |
| 86 | kvr-developer-audiothing-2026-09 |
| 84 | arturia-fx-collection-6 / arturia-v-collection-11 |
| 82 | kvr-developer-spitfire-audio-2026-09 |
| 59 | kvr-developer-u-he-2026-09 |
| 53 | kvr-developer-cherry-audio-2026-09 |
| … | (remaining thin-brand KVR + curated Vital/Toontrack/Surge/oeksound/Celemony) |

## Notable manufacturer deltas (examples)

| Manufacturer | Before | After (approx.) |
|---|---:|---:|
| waves | 4 | 243 |
| softube | 2 | 164 |
| universal-audio | 1 | 202 |
| arturia | 0 (new) | 84 |
| cherry-audio | 0 (new) | 52 |
| audiothing | 1 | 86 |
| mcdsp | 0 | 25 |
| cableguys | 1 | 21 |
| d16-group | 1 | ~34 |
| spitfire-audio | 1 | ~83 |
| ik-multimedia | 1 | ~157 |
| baby-audio | 0 (new) | 26 |
| u-he | 0 (new) | 59 |
| OAS FOSS authors | 0 | 559 plugins across many `oas--*` mfgs |

## What we did **not** do

- Did **not** invent or import `latestVersion`.  
- Did **not** create `version_observations` in this pass.  
- Did **not** wipe existing accepted versions (604 observations / 595 current preserved).  
- Did **not** clone git repos.  
- Did **not** scrape PluginHub’s private/JS vendor DB (walled).  
- Did not treat KVR as a version authority — names/slugs only.

## Follow-ups

- Version receipts pass for high-value new rows (Waves Central, Softube Central, UA Connect, Arturia ASC, Cherry Sync) — still zero-trust.  
- Deduplicate near-duplicates (legacy vs current titles, UAD vs UADx naming) with `supersedes_*` links once verified on disk.  
- HoRNet / EastWest KVR slugs returned empty in this fetch; retry with correct developer URLs.  
- Consider collapsing micro OAS authors later if matching prefers a single `open-audio-stack` umbrella manufacturer.  
- PluginHub’s ~7k claim remains a ceiling benchmark; this batch closes a large identity gap but is not a full mirror.

## Policy reminder

Product universe ≠ verified versions. Matching needs `matchPatterns`; update UX needs accepted observations only.
