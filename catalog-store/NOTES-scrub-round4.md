# NOTES — scrub round 4 (2026-09-10 PT)

Zero-trust version scrub continuation. Start: **1345/2827** accepted. End: **1367/2827** (Δ **+22**). `verified_by=coding-assistant`. No git clone.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| toontrack | 0 → 5/6 | **+5** | public release-notes hubs (EZD3/SD3/EZbass/EZkeys2/EZmix3) |
| focusrite | 0 → 5/5 | **+5** | archived FB360 Spatial Workstation suite installer **3.4** |
| audiothing | 47 → 55/86 | **+8** | plugin-updates table discontinued + freeware |
| newfangled-audio | 10 → 11/11 | **+1** | Obliterate 1.1.4 via Eventide downloads |
| oeksound | 4 → 5/6 | **+1** | bloom 1.1.3 changelog |
| hornet | 0 → 1/1 | **+1** | Corrosion 1.1.2 product page |
| aberrant-dsp | 0 → 1/1 | **+1** | SketchCassette II 2.3 Update Log |
| united-plugins | 0 → 0/13 | +0 | Manager hub; no vendor per-plugin semver |
| softube | 1 → 1/164 | +0 | product pages still Central-walled |
| cherry-audio | 0 → 0/52 | +0 | Sync / stale non-JS |
| plugin-alliance | 163 → 163/175 | +0 | leftovers 404/renamed |
| baby-audio / acon / d16 | unchanged | +0 | leftovers same rationale |

## Accepts (receipts)

### Toontrack (`releaseNotesPage`)
| plugin_id | version | source |
|---|---|---|
| toontrack--ezdrummer-3 | 3.1.2 | `…/release-notes/ezdrummer-3/` (2025-11-11) |
| toontrack--superior-drummer-3 | 3.4.4 | `…/release-notes/superior-drummer-3/` (2026-03-26) |
| toontrack--ezbass | 1.3.4 | `…/release-notes/release-notes-ezbass/` (2026-05-29) |
| toontrack--ezkeys-2 | 2.1.5 | `…/release-notes/release-notes-ezkeys-2/` (2026-03-17) |
| toontrack--ezmix-3 | 3.2.2 | `…/release-notes/release-notes-ezmix-3/` |

### Focusrite FB360 (`downloadsPage`)
All five SKUs **3.4** from Meta archive docs installer basenames `SpatialWorkstation-VST-3.4.pkg` / `SpatialWorkstation-AAXAddon-3.4.pkg` (`facebookarchive/facebook-360-spatial-workstation`).

### AudioThing (`releaseNotesPage` = plugin-updates table)
Outer Verb **1.0.0**, Valve Exciter **1.5.2**, Valve Filter VF-1 **1.5.2**, Speaker **1.5.1**, Blindfold EQ **1.2**, Filterjam **1.3.4**, Moon Echo **1.0**, Alborosie Dub Station **1.1**.

### Newfangled / oeksound / HoRNet / Aberrant
- Obliterate **1.1.4** — Eventide downloads `?product=Obliterate`
- bloom **1.1.3** — `oeksound.com/changelog/bloom/` (Mac download still listed 1.1.2; Win 1.1.3)
- Corrosion **1.1.2** — hornetplugins.com/plugins/corrosion/
- SketchCassette II **2.3** — aberrantdsp.com/updates/ (11/18/2024)

## Explicit skips
- **united-plugins**: Manager **02.19** ≠ plugin versions; Loot V2.1 reseller changelogs may be stale vs Jul 2026 offline pack; no vendor per-plugin semver.
- **softube**: product pages lack public per-plugin semver (Central only).
- **cherry-audio**: Sync hub; Ventura news / KVR versions stale.
- **oeksound Sculpt**: not on official downloads/changelogs.
- **toontrack Product Manager**: no public stable semver on marketing page.
- **SIR StandardCLIP / Scuffham S-Gear**: Mac≠Win current downloads — skip.
- **apulsoft apTrigga**: store SKU/match `apTrigga` ≠ current **apTrigga3** 3.7.4 — gen mismatch.
- **PA leftovers**: alpha master/mix / xtressor / crispscale / MEGA / Schoeps / Sauce / SPL Bass|Full|Vox Ranger — 404 or renamed.
- **d16 gen-1 / audiothing expansions / baby leftovers / acon Studio***: unchanged from rounds 2–3.
- Skipped hub grinding: Waves / UA / Arturia ASC / Softube Central / Avid / AIR / Slate.

## Playbooks
Markdown under `playbooks/` + upserted `manufacturer_playbooks` for: toontrack, oeksound, newfangled-audio, audiothing, hornet, aberrant-dsp, focusrite, united-plugins, cherry-audio, softube (plus round-4 leftover notes on baby-audio, acon-digital, d16-group, plugin-alliance).

## Artifacts
- Toontrack: `tmp-fetch/tt-ezd3-rn.html`, `tt-sd3-rn.html`, `tt-ezbass2.html`, `tt-ezkeys2.html`, `tt-ezmix3.html`
- Eventide Obliterate: `ev-obliterate-dl.html`
- oeksound: `oe-bloom-chg.html`, `oe-dl.html`
- AudioThing: `at-updates.html`
- FB360: `fb360-docs.html`
- HoRNet/Aberrant: `hornet-corrosion-receipt.txt`, `aberrant-updates-receipt.txt`
- Export: `out/catalog.json` (**1367** with accepted latestVersion)
