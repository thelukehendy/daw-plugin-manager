# audio-damage

## Version chip new-mfrs-1 (2026-09-10 ~1:05 AM PT)
- Method: Shopify product pages; some demos encode semver in S3/Dropbox filenames; many demos are unversioned zip names.
- Primary URLs: https://www.audiodamage.com/collections/effects, https://www.audiodamage.com/collections/instruments
- Extract: Prefer installer-filename when present (e.g. Discord4_4.1.5, Replicant_3.0.9, Panstation_2.1.1). Encoded Dropbox forms like AD041_914_210a → 2.1.0. Else KVR verwin @60.
- Success: Mixed — 6 filename @85–88 + 18 KVR@60 = 24/61 this pass.
- hub_walled: 0

## Small-gaps chip (2026-09-10 ~1:50 AM PT)
- Oracle for discontinued: https://www.audiodamage.com/pages/free-and-legacy (Shopify collections often Cloudflare-blocked from datacenter).
- Mayhem Suite (Filterpod / Crush / Master Destrukto / TimeFnk) + Basic + Panstation gen-1 → `identity_kind=discontinued` (Mayhem zip unversioned).
- QuatroMod: Dropbox `AD040_QuatroMod_103.zip` → **1.0.3** @88 + discontinued.
- Pulse Modulator: **not** on free-and-legacy; KVR **1.0** @60 only.
- Panstation1 successor → `audio-damage--panstation-2`.


## Confidence raise 10 (2026-09-10 ~2:16 AM PT)
- **+43** yellow→green @88.
- Method: (1) range-fetch S3 demo zip central directory → inner `*_Installer_vX.Y.Z*.app` names; (2) free-and-legacy Shopify CDN / Dropbox archives → installer basenames / encoded `NNN` tokens; (3) RoughRider3 free page S3 zip.
- Remaining yellow **5**: digitalis-deverb, evil-otto, kombinat-tri, pulse-modulator, shinronin (no public versioned installer receipt).
