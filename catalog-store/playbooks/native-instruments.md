# Native Instruments

## What worked
- Hub app `native-instruments--native-access`: Homebrew cask `native-access` JSON version field (public API). Download URL may be `…-latest.zip` without version in path — still accept from cask `version` + content_hash of JSON.

## What failed
- Kontakt / B4 / Guitar Rig 5 / Reaktor 6: Native Access gated; no public per-product installer semver found without account.

## Confidence raise 6 (2026-09-10)
- Kontakt: still Native Access gated — no public installer semver. Left yellow.

## Confidence raise 7 (2026-09-10)
- Native Access: brew URL still `…-latest.zip` without version; NI pages lack `3.25.2` — leave amber @80.
- Kontakt: still Native Access gated — left yellow.
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- Honest identity: Kontakt libraries → `soundset` (25); Komplete Kontrol Mk3 / Traktor F1 / MX2 → `hardware`; Kontakt/Reaktor/Massive X Players + iMaschine → `hub_app`; Native Access → `hub_app`.
- **+26** remaining instruments/FX via KVR Product Version @60 (Massive, Massive X, Battery, FM8, Absynth 6, Guitar Rig Pro, Reaktor, Raum, Replika*, Dirt/Driver/Freak, VC*/Solid*/Premium Tube*, Transient Master, Super 8, Supercharger*).
- Still Native Access gated for manufacturer corroboration — leave yellow until public installer semver appears.


## KVR hub-remain chip (2026-09-10)
- +24 plugin gaps via KVR `verwin` @ confidence **60** (Absynth 6, Dirt/Driver/Freak/Raum, Guitar Rig Pro 7.0.2, Massive / Massive X, Reaktor 6.5.0, Replika/XT, Solid Mix / Premium Tube / VC / Supercharger family, etc.).
- Skipped dual-string Battery `4.3.1 (VST3 4.3)` and Super 8 `2.1.0 (R26)` here; parallel pass accepted primary tokens.
- Native Access remains hub-walled for authoritative installer semver — KVR is yellow-band only.
- Leftover unknowns are mostly soundset/bundle/discontinued identity rows, not instrument/effect plugins.


## Confidence raise 10
- Non-raise: still Native Access gated for per-title public installer semver.

## gaps-mop-airwindows-policy (2026-09-10 ~3:05 AM PT)
- Accepted `solid-eq-solid-mix-series` **1.4.11** @60 KVR Win=Mac (matches Solid Bus Comp / Solid Dynamics).

## version-chip-expand-6
- Hub apps via KVR@60 (Komplete Kontrol, Kontakt Player, Maschine, Massive X Player, Reaktor Player). Traktor Pro / iMaschine open. Soundsets skipped.

## Confidence raise 20 (2026-09-10 ~4:32 AM PT)
- Public community Official update status (not Native Access) → **+7** @92: Kontakt **8.13.0**, Maschine **3.6.0**, KK **3.5.4**, Guitar Rig Pro **7.0.2**, Reaktor **6.5.0**, Massive X **1.7.0** (mfr supersedes KVR 1.7.1), Absynth 6 **6.1**.
- Players / Effects Series / Battery / FM8 etc. left yellow (no matching public Official thread or Player≠full mismatch).

## Confidence raise 21 (2026-09-10 ~4:42 AM PT)
- Official update status @92: Massive **1.7.0**, Battery **4.3.1**, Native Access **3.25.2** (amber→green); Traktor Pro **4.5.1** new chip.
- Effects Series / FM8 / Super 8 / Players: no matching Official threads — left yellow.


## Universe expand 9 (2026-09-10 ~5:10 AM PT)
- Sounds collection Shopify `collections/sounds/products.json` → **+215 soundset** + **3 bundle** (NI vendor only).
- identity_kind=**soundset** for Expansions / Massive X / Leap / MPC packs (not `expansion`).
- Third-party Image Sounds / Wave Alchemy / Soundiron on that collection skipped.
