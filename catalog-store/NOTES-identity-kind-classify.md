# NOTES — identity_kind classify (remaining unknowns)

**When:** 2026-09-10 UTC / **2026-09-09 ~11:24 PM PT**  
**Scope:** Classify **183** plugins without accepted `latestVersion` for Electron UX.  
**Policy:** Do **not** invent versions. `verified_by` not required (non-version writes). No git clone.

## Schema

- Added `plugins.identity_kind TEXT DEFAULT 'plugin'` via `src/migrate_v4.py` (SQLite `schema_version` **4**).
- Allowed values: `plugin | soundset | expansion | hardware | eurorack | bundle | suite_component | daw_stock_effect | hub_app | gen_ambiguous | discontinued | unknown_other`
- Export (`src/export_catalog.py`): emits `identityKind` **only when not** `'plugin'`. `catalogSource` = `store-export:v4` (JSON `schemaVersion` remains **3** for forward-compat).

## Counts by identity_kind (among 183 remaining unknowns)

| count | identity_kind |
|---:|---|
| 47 | `suite_component` |
| 24 | `soundset` |
| 20 | `gen_ambiguous` |
| 20 | `unknown_other` |
| 18 | `discontinued` |
| 16 | `plugin` (true version gaps — yellow unknown still OK) |
| 13 | `hardware` |
| 10 | `bundle` |
| 7 | `hub_app` |
| 5 | `expansion` |
| 2 | `eurorack` |
| 1 | `daw_stock_effect` |
| **183** | **total** |

Exported non-default `identityKind`: **167**.

## Classification highlights

- **soundset (24):** all listed u-he soundsets/expansions — preset packs, not plugin installers.
- **expansion (5):** AudioThing soundware (4) + Spitfire Symphony Orchestra (year-only verwin).
- **hardware (13):** UA pedals/amps/OX/Volt; IK AmpliTube X-* pedals; Softube Console 1 Compact / Fader Mk III; Waves PuigChild hardware.
- **eurorack (2):** u-he CVilization, Melt.
- **hub_app (7):** Toontrack Product Manager; UAD Software; WaveShell; StudioRack OBS; UVIWorkstationAAX; MelodyneBridge; SpectraLayers Bridge.
- **suite_component (47):** AIR Creative Collection FX (20); Softube component splits / Model 72/77/84 / Console 1 edition packs; Slate VBC FG-* + Virtual Channel/MixBuss; Steinberg 500/Lindell/ChannelX/PEX; etc.
- **bundle (10):** NUGEN bundles (4); Softube Amp Room *Suites + Console 1 Core Mixing Suite; Cherry Novachord+Solovox; iZotope RX umbrella.
- **gen_ambiguous (20):** Arturia classic “V” SKUs (13); Omnisphere / FX-Omnisphere; AIR Vacuum; ShaperBox 2; Nectar 3 Elements; Miroslav Philharmonik 2; Trigger_2.
- **discontinued (18):** PA bx_XL V2, elysia alpha master/mix, Schoeps 1to3, The Sauce; Audio Ease legacy (7); Guitar Rig 5; B4 II; Reaktor 6 line; Plasticlicks; Mobile Convolution; Eiosis AirEQ 5.1.
- **daw_stock_effect (1):** Apple Spatial Audio (`apple--asaf`).
- **unknown_other (20):** Bazille Cookbook docs; misfiled `spl--uad-spl-vitalizer-*`; manufacturer/title mismatches; residual empty-verwin hard cases (Capstan, Sculpt, VocAlign Pro, Waves Drifter/Ignition, etc.).
- **plugin (16):** still real plugins lacking a public accept (ERA, SansAmp Rack, Pink, Origin, SSL Meter Pro, Xtressor, …) — keep yellow unknown.

Each classified row has an updated `notes_for_user` explaining why there is no `latestVersion`.

## PA / SPL successor links

| SKU | action |
|---|---|
| `plugin-alliance--bx-xl-v2` | already `discontinued` → `plugin-alliance--bx-xl-v3` |
| `plugin-alliance--elysia-alpha-master` | `discontinued` → `plugin-alliance--elysia-alpha-compressor-v2` |
| `plugin-alliance--elysia-alpha-mix` | `discontinued` → `plugin-alliance--elysia-alpha-compressor-v2` |
| `plugin-alliance--schoeps-mono-upmix-1to3` | `discontinued` (no successor in DB) |
| `plugin-alliance--swivel-audio-the-sauce` | `discontinued` (no successor receipt) |
| `plugin-alliance--spl-*-plus` | `predecessor_plugin_id` set from legacy `spl--attacker` / `de-verb` / `mo-verb` / `eq-rangers-vol-1` |

`spl--uad-spl-vitalizer-mk2-t` / `mk3-t` left as `unknown_other` (misfiled under SPL; canonical UA SKUs already versioned under `universal-audio--`).

## Artifacts

- `src/migrate_v4.py`
- `src/classify_identity_kind.py` (idempotent re-run)
- `schema.sql` (v4 DDL comment + column)
- `out/catalog.json` re-exported
- `HANDOFF-FOR-CURSOR.md` updated for Electron identity UX

## Totals unchanged (versions)

| metric | value |
|---|---:|
| universe | 2827 |
| accepted | 2644 |
| unknown (no version) | 183 |
| Δ accepted this pass | **0** (classify-only) |

---

## Follow-on (2026-09-10 ~1:20 AM PT) — AAS / Blue Cat / UVI / Arturia

See **`NOTES-identity-and-aas-chip.md`** and `src/classify_identity_aas_bluecat_uvi_arturia.py`.

Additional rules:
- AAS sound packs / legacy gens → `soundset` / `discontinued` / `gen_ambiguous`; core instruments versioned from support table.
- Blue Cat `*Pack` / `*Series` → `bundle`; vault widening/digital-peak variants → `discontinued`.
- UVI `*for Falcon` → `expansion` (prefer over `soundset` for Falcon-host content).
- Arturia MiniBrute / MiniFuse / MicroLab / MiniLab / PolyBrute / Freak hardware SKUs → `hardware`.
