# Softube

## What worked
- Softube Central via Homebrew cask (manager app) — Central **2.2.0** (prior).
- **KVR product pages** (`kvraudio.com/product/{slug}-by-softube`): explicit `id="verwin"` **Product Version** field (crowdsourced/public). Softube plugins share a unified installer family version (most at **2.6.41** as of this scrub).
- Supporting index: `https://www.kvraudio.com/versions.php?d=589` (change timeline; prefer per-product Product Version for accepts).
- Round 5: **+117** plugin accepts via `source_kind=other`, `extract_method=kvr-product-page`, `verified_by=coding-assistant`.

## Caveats / do not force
- Do **not** map suite/component/Console-1-edition/UAD-branded SKUs onto a differently titled KVR product (reversed round5 bad maps: Amp Room *Suite→Amp Room, British Class A *parts→British Class A, Dyna-mite Gate/Slam→Dyna-mite, Overstayer Extended→MAS, Tonelux Tilt Live→Tilt, Fix Flanger→Fix Flanger and Doubler, Console 1 Core Mixing Suite→Channel Mk III, hardware Compact/Fader Mk III @ 1.0).
- UAD Softube titles are Universal Audio distributions — leave unknown unless UA/KVR page matches that SKU.
- Softube.com product pages remain Central-walled for installer semver.
- Central app version ≠ plugin family version.

## Still missing (examples)
- Active/Passive/Focusing EQ, Fix Doubler/Flanger, TSAR-1*, Transient Shaper, Trident A-Range, Model 72/77/84 FX spinouts, Console 1 hardware SKUs, UAD-* Softube titles, Console-1 edition packs.

## Round 6
- Leftovers unchanged (suites/components/UAD Softube/Console 1 hardware/edition packs) — still no clean exact KVR title match without suite→component risk.

## Round 7 mop
- **+2**: Transient Shaper (**2.6.41**), TSAR-1R True Stereo Algorithmic Reverb (**2.6.41**).
- Still skip: UAD Softube SKUs, Console 1 hardware/edition packs, Amp Room *Suites, British Class A *parts, Dyna-mite Gate/Slam, Overstayer Extended, Tonelux Tilt Live, Fix Flanger/Doubler splits, Active/Passive/Focusing EQ / Trident / TSAR-1 (no live KVR product page).

## Round 8 final mop
- **+17**: Softube-catalogued **UAD-*** SKUs accepted from **exact-title** Universal Audio KVR pages (`uad-…-by-universal-audio`), family **11.8.3** (Amp Room Bundle **11.8.0**).
- Still skip: Passive-Active Pack ≠ Active/Passive/Focusing EQ; Amp Room *Suites; British Class A *parts; Fix Flanger/Doubler splits; Dyna-mite Gate/Slam; Overstayer Extended; Tonelux Tilt Live; Console 1 hardware/edition packs; Model 72/77/84 FX spinouts; Trident A-Range / TSAR-1 (no individual live KVR product page — pack/suite only).

## Confidence raise 1 (2026-09-10)
- **+119** native Softube family: manufacturer release notes `softube.com/release-notes/…2-6-41…` (“All plug-ins”) and `…2-6-42…` (Monoment Bass / Parallels / Statement Lead only) → confidence **92**.
- **+17** Softube-catalogued **UAD-*** titles: UA help UAD Version History current suite **12.0** (replaced stale KVR 11.8.x) → confidence **90**.
- Softube.com product pages remain Central-walled for per-SKU installers; RN family version is the public receipt.

## Overnight chip-203
- **+8** Passive/Active/Focusing EQ, Fix Doubler/Flanger, Trident A-Range, TSAR-1 (+ alias) via Softube RN **2.6.41** All plug-ins (+ KVR pack corroboration).
- Still skip: Amp Room *Suites, British Class A parts, Dyna-mite Gate/Slam, Overstayer Extended, Tonelux Tilt Live, Model 72/77/84 spinouts, Console 1 hardware/edition packs.

## Confidence raise 7 (2026-09-10)
- Softube Central **2.2.0**: manufacturer CDN `Softube Central-2.2.0-universal.pkg` HEAD 200 → confidence **90** (amber→green). Plugin family RN pages remain 2.6.x-only (no Central RN article).

## Confidence raise 17
- Softube yellow count **0** (all currents green 90–92). Public RN at softube.com/release-notes is Softube Central suite line — no yellow leftovers to denser-raise.

## Confidence raise 23
- Yellow count still **0** (145 green). Nothing to raise.

## Confidence raise 24
- **0** yellow — skip (already dense green).
