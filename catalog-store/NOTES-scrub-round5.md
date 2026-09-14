# NOTES — scrub round 5 (2026-09-10 PT)

Zero-trust version scrub continuation. Start: **1367/2827** accepted. End: **1550/2827** (Δ **+183**). `verified_by=coding-assistant`. No git clone.

Primary creative method this round: **KVR product pages** with explicit `Product Version` / `id="verwin"` field (`source_kind=other`, `extract_method=kvr-product-page`), per Luke policy allowing public KVR receipts when manufacturer pages are hub-walled.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| softube | 1 → 118/164 | **+117** | KVR Product Version (unified plugin family **2.6.41**); Central unchanged |
| cherry-audio | 0 → 46/52 | **+46** | KVR Product Version per instrument/effect |
| baby-audio | 16 → 25/25 | **+9** | KVR fills leftovers absent from trials accordion |
| cableguys | 0 → 7/21 | **+7** | ShaperBox 3.6.3 + standalones; skip module majors |
| klanghelm | 3 → 4/4 | **+1** | MJUC 1.8.1 |
| vital-audio | 0 → 1/1 | **+1** | Vital 1.6.4 |
| xfer-records | 5 → 6/9 | **+1** | Serum 2 **2.1.5** |
| leapwing-audio | 7 → 8/8 | **+1** | LimitOne 1.0.1 |
| plugin-alliance | 163 → 163/175 | +0 | leftovers still 404/renamed |
| acon-digital | 14 → 14/29 | +0 | Studio*/DeEss/Extract:Dialogue 2 unchanged |
| hornet | 1 → 1/1 | +0 | only Corrosion in universe; site spamwalled this run |

## Softube accepts (method)

- Index: `https://www.kvraudio.com/developer/softube` + `versions.php?d=589` timeline.
- Per SKU: `https://www.kvraudio.com/product/{slug}-by-softube` → `verwin` semver (typically **2.6.41**).
- **15 bad round3 fuzzy maps reversed** (suite/component/UAD-edition/hardware mismatches) — see playbook.
- Leftovers (~46): UAD Softube titles, Console 1 hardware, edition packs, TSAR/Trident/EQ spinouts without clean KVR title match.

## Cherry Audio accepts (sample)

| plugin_id | version |
|---|---|
| cherry-audio--sines / miniverse / polymode / galactic-reverb / dreamsynth / … | **1.4.0** (family) |
| cherry-audio--memorymode-2 | **1.0.9** |
| cherry-audio--voltage-modular-nucleus / ignite | **2.9.5** |
| cherry-audio--mercury-6-synthesizer | **1.0.5** |
| cherry-audio--trident-mk-iii | **1.0.17** |
| cherry-audio--gx-80-synthesizer | **1.0.13** |

Leftovers: Synth Stack 6, preset expansions, Novachord+Solovox bundle, VM Core+Electro Drums.

## Baby Audio leftovers → complete

BA-1 FX Strip **1.0**, Baby Comeback **1.0.2**, Beat Slammer **1.2**, Magic Dice/Switch **1.1**, Pitch Drift **1.1**, Warp **1.0**, Smooth Operator **1.6**, Transit **1.2.0** (distinct from Transit 2 **2.2** / Smooth Operator Pro **1.2** on trials).

## Cableguys

Accepted: ShaperBox **3.6.3**, HalfTime **1.1.12**, Snapback **1.1.2**, MidiShaper **1.6.3**, FilterShaper XL **1.0.6**, PanCake **2.3.2**, Curve **2.6.3**.

Skipped: module Shapers (Volume/Pitch/… majors), Kickstart **2** onto Nicky Romero Kickstart gen-1, ShaperBox 2 (no clean gen-2 verwin).

## Other singles

- klanghelm--mjuc **1.8.1**
- vital-audio--vital **1.6.4**
- xfer-records--serum-2 **2.1.5**
- leapwing-audio--limitone **1.0.1**

## Explicit skips

- Softube.com / Softube Central still no public per-plugin installer semver.
- Cherry Sync / downloads page: no per-plugin numbers without account; expansions skipped.
- PA remaining 12; Acon Studio*; IK Product Manager hub; Cableguys module majors; UAD Softube SKUs.
- Skipped hub grinding: Waves / UA / Arturia ASC / Avid / AIR / Slate / Spitfire.

## Playbooks

Updated `playbooks/` + `manufacturer_playbooks` for: softube, cherry-audio, baby-audio, cableguys, vital-audio, klanghelm, xfer-records, leapwing-audio; leftover notes on plugin-alliance, acon-digital.

## Artifacts

- Softube: `tmp-fetch/kvr-softube-dev.html`, `kvr-softube-versions.html`, `kvr-softube-products/*.html`, `softube-kvr-*.json`
- Cherry: `tmp-fetch/kvr-cherry-products/*.html`, `cherry-kvr-parsed.json`
- Misc: `tmp-fetch/kvr-misc/*.html`, `misc-kvr-parsed.json`
- Export: `out/catalog.json` (**1550** with accepted latestVersion)
