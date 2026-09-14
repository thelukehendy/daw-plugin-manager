# NOTES — Version chip universe-expand-5 manufacturers

Date: 2026-09-10 ~3:49 AM PT (2026-09-10T10:49Z UTC)  
Actor: coding-assistant (executor)  
`verified_by=coding-assistant`

## Goal

Stamp Policy A `latestVersion` for universe-expand-5 manufacturers (+ XLN/EastWest/Spitfire fills already identity-complete). Prefer manufacturer pages **88–95**; KVR **@60** when manufacturer silent/walled. Careful **fractal-audio / headrush / two-notes** hardware vs software `identity_kind`. Zero trust. No git clone.

## Counts

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| manufacturers | 549 | **549** | 0 |
| plugins (universe) | 6490 | **6490** | 0 |
| accepted currents | 4497 | **4571** | **+74** |
| without version | 1993 | **1919** | −74 |
| without version + identity_kind=plugin | 623 | **557** | −66 |
| of which non-Airwindows plugin gaps | ~111 | **45** | ~−66 |

### Confidence bands (accepted currents)

| Band | Before (STATUS) | After | Δ |
|---|---:|---:|---:|
| Green ≥85 | 2952 | **2974** | **+22** |
| Amber 70–84 | 56 | **56** | 0 |
| Yellow <70 (KVR@60) | 1489 | **1541** | **+52** |

Export: `out/catalog.json` — 549 mfrs, 6490 plugins, **4571** with accepted `latestVersion`.

This-pass stamped currents: **+74** (22 manufacturer @92 + 52 KVR@60). Green Δ (+22) matches manufacturer greens exactly (raise-17 baseline green 2952).

## Accepted new versions by manufacturer (+74)

| manufacturer | new accepted | source class | conf |
|---|---:|---|---|
| **plugin-boutique** | **17** | KVR exclusives (Scaler 2 **2.9.1**, Carbon Electra, BigKick, …) | 60 |
| **ignite-amps** | **12** | 11 homepage download table + PTEq-1a KVR | 92 / 60 |
| **xln-audio** | **11** | 6 release_notes (AD2/Keys/Trigger/XO/Life/DB-30) + 5 KVR SKUs | 92 / 60 |
| **ml-sound-lab** | **9** | KVR Amped/MIKKO/Wavebreaker | 60 |
| **stl-tones** | **6** | KVR ToneHub/AmpHub/ControlHub/Tonality | 60 |
| **modartt** | **5** | KVR Pianoteq Stage/Standard/Pro **9.2.4**, Organteq **2.1.2**, Syngular **1.0** | 60 |
| **fractal-audio** | **5** | manufacturer editor/Cab-Lab download pages | 92 |
| **sample-magic** | **4** | KVR Boost/Boost Pro/Klip/Magic AB | 60 |
| **two-notes** | **2** | KVR GENOME **2.1.0**, Wall of Sound **4.4.4** | 60 |
| **thewavewarden** | **2** | KVR Filter Force / Spline (Odin2 already GitHub) | 60 |
| **garritan** | **1** | KVR ARIA Engine/Player (Plogue) | 60 |
| **headrush** | **0** | ReValver Mac≠Win KVR skip; boards hardware | — |
| **FOSS leftovers** | **0** | Helm/Odin2/Tunefish/Dexed/Cardinal/ADLplug already chipped in expand5 | — |
| **TOTAL** | **74** | | |

## Method highlights

1. **Ignite Amps** — homepage freeware download table: Libra **1.3.0**, Emissary **2.0.2**, NadIR **2.0.2**, ProF.E.T. **1.0.0**, NRR-1 **3.0.0**, Anvil **3.0.0**, TPA-1 **1.0.1**, SHB-1 **1.0.0**, PTEq-X **1.1.1**, TSB-1 **1.0.1**, TS-999 **1.5.2** @92. PTEq-1a absent from table → KVR **1.0.2** @60.
2. **XLN Audio** — public `release_notes` (paginated): Addictive Drums 2 **2.9.1**, Keys **1.7.3**, Trigger **1.3.10**, XO **1.8.10**, Life **1.3.4**, DB-30 **1.1.1** @92. AD1 **1.5.6**, AD2 Custom/XL **2.1.12**, XO Lite **1.1**, Life DAW Recorder **1.3.3** → KVR@60 (SKU/legacy not on latest RN rows). RC-20/DS-10 prior currents kept. Expansions/bundles/soundsets skipped.
3. **Fractal Audio** — software only: Axe-Edit III **1.14.34**, FM3-Edit **1.07.16**, FM9-Edit **1.03.21**, Fractal-Bot **3.00.24**, Cab Lab 4 **1.01.01** from product download pages @92. Axe-Fx III / FM3 / FM9 remain `hardware`.
4. **Modartt** — portal walled; marketing “Pianoteq 9” only. Forum admin confirmed 9.2.1 (Jun 2026). Stamp KVR Win=Mac **9.2.4** for Stage/Standard/Pro @60. Organteq/Syngular KVR. Packs stay `soundset`.
5. **STL / ML / PB / Sample Magic / Garritan ARIA / WaveWarden leftovers** — manufacturer silent or account-walled → KVR@60; skip Mac/Win mismatch and non-plugin identities.
6. **Two notes** — site markets GENOME without patch semver; KVR GENOME **2.1.0** + WoS **4.4.4** @60. Torpedo Remote no verwin (open). Hardware Captor/Reload stay `hardware`.
7. **HeadRush** — boards `hardware`. ReValver KVR Mac/Win mismatch → **skipped**.

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/chip-expand5/` | HTML caches, queues, KVR product pages |
| `tmp-fetch/chip-expand5/build_and_apply.py` | Apply script |
| `tmp-fetch/chip-expand5/accept-queue-manufacturer.json` | Manufacturer accepts |
| `tmp-fetch/chip-expand5/accept-queue-kvr.json` | KVR accepts |
| `tmp-fetch/chip-expand5/accepted-summary.json` | Pre-audit summary |
| `playbooks/{modartt,ignite-amps,xln-audio,…}.md` | 12 playbooks (+ DB upserts) |
| `out/catalog.json` | Re-exported |

## Still open (notable, expand-5 scope)

- two-notes--torpedo-remote (no KVR verwin / site silent)
- headrush--revalver (Mac≠Win KVR mismatch)
- EastWest / Spitfire fills remain soundset/bundle/expansion (intentional — no version stamp)
- Airwindows 512 intentional unversioned (unchanged policy)

## Identity honesty this pass

| kind | action |
|---|---|
| `plugin` | Versioned via manufacturer or KVR |
| `hub_app` | Fractal editors / GENOME / Life / ARIA when verwin |
| `soundset` / `expansion` / `bundle` / `discontinued` / `hardware` | skipped for version stamp |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 tmp-fetch/chip-expand5/build_and_apply.py   # already applied
python3 src/export_catalog.py
python3 src/status_report.py
```

## Policy reminder

Manufacturer primary 88–95; KVR 60 yellow. Dual Mac/Win mismatch → skip. Never invent. Hub portals not ground. Hardware identities (Fractal units, HeadRush boards, Two notes Captor/Reload) stay unversioned.
