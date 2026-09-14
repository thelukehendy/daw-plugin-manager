# Cherry Audio

## What worked
- **KVR product pages** with explicit Product Version (`verwin`) — Round 5 accepted **46/52**.
- Examples: Sines/Miniverse/Polymode/Galactic/Dreamsynth family often **1.4.0**; newer titles have distinct builds (Memorymode 2 **1.0.9**, Voltage Modular **2.9.5**, Trident Mk III **1.0.17**, etc.).
- Manufacturer Sync version-history exists for Sync manager (not a store plugin SKU). Product `/version-history` pages exist for some titles (e.g. Mercury-6) but site often Cloudflare/JS gated — KVR used as public receipt per Luke round5 policy.

## Still missing / skip
- Bundles/expansions: Synth Stack 6, Novachord+Solovox bundle, Rackmode for Voltage Modular, Retro Waves for Elka-X, Snow Angel for Mercury-6, Voltage Modular Core + Electro Drums.
- Prefer manufacturer version-history when publicly hashable; Sync hub still does not expose per-plugin semver without account.

## Round 6
- Bundle/expansion leftovers unchanged (Synth Stack 6, preset packs, VM Core+Electro Drums, Novachord+Solovox).

## Round 7 mop
- **+5**: Rackmode-for-VM, Retro Waves for Elka-X, Snow Angel for Mercury-6, Synth Stack 6, Voltage Modular Core + Electro Drums (`…-and-…` slug).
- Skip Novachord + Solovox dual Product Version `1.0.2 / 1.0.3`.

## Confidence raise 1 (2026-09-10)
- **+28** via live `cherryaudio.com/products/{slug}/version-history` latest matching KVR → confidence **92**.
- Skipped: VH HTTP 500s (Atomika/Blue3/Trident/Yellowjacket/…); **GX-80** mfr latest **1.0.9** ≠ KVR **1.0.13**; expansions/bundles without clean VH.
- Prefer per-product version-history over the 2023 Ventura news blast (stale for Voltage Modular).

## Confidence raise 3 (2026-09-10)
- **+16** via live `cherryaudio.com/products/{correct-slug}/version-history` latest matching KVR → **92**.
- Slug fixes vs raise-1: `atomika-synthesizer`, `blue3-tonewheel-organ`, `ds-2-synthesizer`, `spirit-synthesizer`, `esq-1-synthesizer`, `filtomika-filter`, `galactic-reverb`, `memorymode-v2`, `odc-2800-synthesizer`, `polymode-synthesizer`, `chroma`, `sh-max-synthesizer`, `trident-synthesizer`, `wurlybird140b`, `yellowjacket-synthesizer` (+ rackmode).
- Still skip: **GX-80** mfr **1.0.9** ≠ KVR **1.0.13**; Spin / Synth Stack 6 / preset packs / VM Core+Electro.

## Confidence raise 3 chip-B (2026-09-10)
- **+2**: GX-80 VH latest is **Version 1.0.13, Build 147** (1.0.9 was Initial Release — prior mismatch note corrected); Synth Stack 6 VH **Version 6.0**.
- Still skip: Spin VH HTTP 500; preset packs / VM Core+Electro 404/500.

## Confidence raise 4 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-4.md.

## Confidence raise 5 (2026-09-10)
- Non-raise this pass — see NOTES-confidence-raise-5.md.

## Confidence raise 6 (2026-09-10)
- Non-raise: Spin / preset packs / VM Core+Electro — alternate VH URL sweep still HTTP 500 / product 404.

## Confidence raise 9 (2026-09-10 ~2:08 AM PT)
- Non-raise: Spin VH still HTTP **500**; Cloudflare on WebFetch; preset packs / VM Core+Electro unchanged.

## Confidence raise 23
- Non-raise: Spin / preset packs / VM Core+Electro — VH **500** / product **404** unchanged.
