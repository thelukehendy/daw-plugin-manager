# NOTES — universe expand 10 (2026-09-10 ~5:08→5:16 AM PT)

## STATUS HANDOFF

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Manufacturers | 563 | **571** | **+8** |
| Plugins (universe) | 7262 | **8078** | **+816** |
| Accepted currents | 4895 | **4899** | **+4** chips |

Export: `out/catalog.json` — 571 / 8078 / 4899.

## Goal

Continue exhaustive identity growth after expand9. Prefer **Arturia gaps** + **Cherry full list** + **ujam / orchestra-tools / cinesamples** soundsets + **kilohearts snapin gaps** + **Output Arcade Lines as soundset**. Also 8dio/puremagnetik/audiomodern/surreal-machines + FOSS helm/cardinal. Dedup. Chip easy public versions in-pass. No git clone.

## Artifacts

| Path | Role |
|---|---|
| `data/universe-expansion-expand10.json` | Import batch (+8 mfrs, +816 plugins) |
| `tmp-fetch/build_universe_expand10.py` | Builder |
| `tmp-fetch/expand10/` | Cached Arturia/UJAM/OT/8dio/pure/cine/KVR HTML+JSON |
| `playbooks/ujam.md` | New |
| `playbooks/orchestra-tools.md` | New |
| `playbooks/cinesamples.md` | New |
| `playbooks/8dio.md` | New |
| `playbooks/puremagnetik.md` | New |
| `playbooks/surreal-machines.md` | New |
| `playbooks/helm.md` | New |
| `playbooks/cardinal.md` | New |
| `NOTES-universe-expand-10.md` | This handoff |

### Import command

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/build_universe_expand10.py
python3 src/import_universe_batch.py data/universe-expansion-expand10.json
python3 src/accept_observation.py --plugin-id cardinal--cardinal --version 26.02 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id cardinal--cardinal-mini --version 26.02 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id cardinal--cardinal-fx --version 26.02 ... --set-current --confidence 92
python3 src/accept_observation.py --plugin-id helm--helm --version 0.9.0 ... --set-current --confidence 90
python3 src/export_catalog.py
python3 src/status_report.py
```

## Manufacturers added (+8)

| id | name | identity |
|---|---|---|
| `ujam` | UJAM | Virtual Guitarist/Drummer/Bassist, Beatmaker, Finisher, Usynth, Symphonic Elements |
| `orchestra-tools` | Orchestral Tools | SINE hub + Berlin/Metropolis/etc. collections as soundset |
| `cinesamples` | Cinesamples | Cine* Kontakt libraries + Musio hub + bundles |
| `8dio` | 8Dio | Shopify full catalog as soundset |
| `puremagnetik` | Puremagnetik | Devices/collections (music albums skipped) |
| `surreal-machines` | Surreal Machines | Crack/Impact/Modnetic/Diffuse + bundles |
| `helm` | Helm | FOSS synth (Matt Tytel; archived) |
| `cardinal` | Cardinal | FOSS modular (DISTRHO) |

## Inserted by manufacturer

| manufacturer | +n | notes |
|---|---:|---|
| 8dio | 328 | Shopify `/collections/all/products.json` pages 1–2; gift cards skipped; **soundset** |
| puremagnetik | 250 | Shopify devices/collections; artist music albums + gift cards skipped |
| orchestra-tools | 83 | SINE Player hub_app + Berlin bundle tiers + helpdesk current-versions collections as **soundset** |
| ujam | 70 | Full VG/VD/VB/Beatmaker/Finisher/Usynth/Symphonic Elements matrix + line bundles |
| cinesamples | 47 | Plugin Boutique catalog + site bundles + Musio hub_app |
| output | 10 | Arcade Lines as **soundset** (Shadows/Funk U/Pop Underground/Arps/Drum Sesh/Toys/Field of Sounds/Drum Machinery/After Hours/Vintage Synths) |
| audiomodern | 9 | CHORDJAM/FILTERSTEP/GATELAB/PLAYBEAT/PANFLOW/LOOPMIX/FREEZR/SOUNDBOX + Complete Suite |
| surreal-machines | 8 | Crack/Impact/Modnetic/Diffuse/Microfuse + Dub/Transient Machines bundles |
| arturia | 7 | Analog Lab Play, Pigments Play, V Collection 11 Pro/Intro, FX Collection 6 Pro/Intro, Sound Explorers Collection 2 |
| cardinal | 3 | Cardinal / Mini / FX |
| helm | 1 | Helm |

## Focus checklist

| Focus | Result |
|---|---|
| Arturia product gaps | **+7** Play editions + V11/FX6 collection bundles (instrument/effect SKUs already dense) |
| Cherry full list | Docs + store instruments **0** net (already dense @53) |
| kilohearts snapin gaps | Essentials + premium snapins **0** net (already dense @84 incl. kHs-prefixed) |
| Output Arcade expansions | **+10** curated public Lines as soundset (no static full Line master list; subscription content) |
| ujam | **New** +70 |
| orchestra-tools | **New** +83 (SINE hub + collections) |
| cinesamples | **New** +47 |
| 8dio | **New** +328 soundset |
| audiomodern fill | **+9** (was Riffer-only) |
| surreal-machines | **New** +8 |
| puremagnetik | **New** +250 |
| FOSS helm/cardinal | **New** +1 / +3; chipped |
| vital fill | Already @1.6.4 — no identity add |
| surge dense | Already dense — no identity add |
| baby-audio gaps | Live catalog dense — **0** |
| heavyocity fill | Products page SPA opaque this pass — deferred |
| reason-studios RE | Deferred (careful / account-gated) |
| bitwig / ableton M4L | Deferred (thin public pack lists) |
| loopcloud / noiz / ripple | Not pursued (no clear public plugin SKU matrix) |

## In-pass version chips (+4)

| id | version | conf | source |
|---|---|---:|---|
| cardinal--cardinal | 26.02 | 92 | GitHub Releases tag `26.02` |
| cardinal--cardinal-mini | 26.02 | 92 | same release |
| cardinal--cardinal-fx | 26.02 | 92 | same release |
| helm--helm | 0.9.0 | 90 | GitHub Releases tag `v0.9.0` (upstream archived) |

**Not chipped (not easy / portal-gated):** UJAM commercial portals; OT SINE collections (SINE app gated); 8dio/Cinesamples/Puremagnetik Native Access–style installers; Arturia Play editions (account/ASC); Output Arcade Lines (subscription); Surreal Machines (no public semver on product pages this pass); AudioModern commercial.

## identity_kind honesty

| kind | role this pass |
|---|---|
| `soundset` | 8dio libraries; OT collections; Cinesamples libraries; Puremagnetik devices; Output Arcade Lines; UJAM MIDI Drum Beat Pack |
| `plugin` | UJAM instruments/FX; Audiomodern; Surreal Machines; Arturia Play; Helm; Cardinal variants |
| `bundle` | Arturia V/FX collections; UJAM line bundles; OT Berlin tiers; Cinesamples bundles; Surreal Dub/Transient Machines; AudioModern Complete |
| `hub_app` | OT SINE Player; Cinesamples Musio |
| `discontinued` | Puremagnetik product_type=Discontinued rows |

## Skipped / policy

| Candidate | Action |
|---|---|
| Cherry instrument gaps | Already dense — 0 net |
| Kilohearts Essentials snapins | Already dense (generic + kHs-* rows) — 0 net |
| Output Arcade full Line master list | No official static public list; curated documented Lines only |
| Puremagnetik artist albums (Tapes / `Artist - Album`) | Music releases — skipped |
| 8dio Gift Card | Skipped |
| Reason Studios Rack Extensions | Deferred (careful) |
| Ableton Max for Live packs | Deferred |
| Heavyocity product SPA | Opaque HTML — deferred |
| loopcloud / noiz / ripple | No clear public SKU matrix |
| Jack | Still skipped (expand9 policy) |
| Airwindows per-SKU versions | Policy locked |

## Return counts

**+8 manufacturers · +816 plugins · +4 versions** (accepted currents 4895→4899)
