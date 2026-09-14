# HoRNet Plugins

## Method (2026-09-10 overnight chip)
- Primary: public product pages at `https://www.hornetplugins.com/plugins/{slug}/`.
- Version banner patterns (plain text in page body / news):
  - "`Name X.Y.Z is available`"
  - "`We have released Name X.Y.Z`"
  - "`has been upgraded/updated to version X.Y.Z`"
  - "`We have updated Name to version X.Y.Z`"
- Slug usually matches catalog id after `hornet--` (e.g. `hornet--hornet-sleek` → `/plugins/hornet-sleek/`).
  Exceptions: `hornet-samp-…` → `/plugins/hornet-samp/`; `hatefish-rhygenerator` → `/plugins/hatefish-rhygenerator/`; `track-coherence` → `/plugins/track-coherence/`; `corrosion` → `/plugins/corrosion/`.
- **Caveat:** some legacy slugs 301/redirect to successor SKUs (e.g. `/plugins/hornet-songkey-mk3/` → SongKey MK4 page; `/plugins/hornet-sw34eq/` → SW34EQ MK2). Do **not** accept redirected successor versions onto the predecessor plugin id.
- curl/simple HTTP from datacenter IPs often CleanTalk-403; use browser/WebFetch/Chrome headless `--dump-dom`.
- Updates also via HoRNet DoIn / My Account — **do not grind portals**.
- Pages without a public semver banner (marketing-only ZeroWidth/Spaces MK2/MixComp/TapeLite/H160 etc.): leave unknown or keep KVR@60 only.

## Confidence
- Manufacturer productPage clear version → **92** (or 90)
- KVR only when no manufacturer public semver → **60**

## Success (this chip)
- Universe: 105 plugins.
- Before chip: **1** accepted (Corrosion 1.1.2) / 104 gaps.
- After: **105**/105 currents (0 true gaps). Manufacturer primary pages: **~47**; remainder KVR@60 pending further product-page upgrades where banners exist.
- portal_app: HoRNet DoIn (account) — hub for installs, not for public version discovery.


## Confidence raise 8 (2026-09-10 ~2:00 AM PT)
- **+17** yellow→green @92 via live product-page banners matching KVR (`manufacturer-product-page-banner`).
- Raised: cassette644, chorus60, clms, deelay, deelay-plus, dyneq, graffio, ha2a, harmonics, harmonics-pro, hcs1, lu-meter-mk2, mbc, spikes, syncpressor, trackshaper, wahwah.
- Explicit skips: gen-1←MK2 redirects (AnalogStage, TotalEQ, VHS, HDS1, ThirtyOne, LU Meter gen-1); homepage Soft404s; Angle/Freqs/CompExp/StereoView/Multicomp without matching banner.
- Remaining yellow: **41**.

## Confidence raise 9 (2026-09-10 ~2:08 AM PT)
- **+5** yellow→green @92 via live product-page banners matching KVR (`manufacturer-product-page-banner`).
- Raised: coherence-meter, hatefish-rhygenerator-one, adda, sybilla, l3012-bass-channel.
- Explicit skips: gen-1←MK2/MK3/MK4 redirects; marketing-only / Soft404 / channelstrip-mk2 404.
- Remaining yellow: **36**.


## Confidence raise 10
- Non-raise: 36 leftovers still redirects / Soft404 / no banner (same quality gate as raise 9).

## Confidence raise 15
- Non-raise this pass — see NOTES-confidence-raise-15.md.

## Confidence raise 17
- Non-raise: Chrome dump of Angle/Freqs/CompExp/StereoView/MultiComp/ZeroWidth — marketing-only (no KVR-matching banners). Remaining redirects/Soft404 same gate as raise-15/16.

## Confidence raise 23
- Non-raise: remaining **36** still marketing-only / Soft404 / redirects / CleanTalk-403. No new matching banners.
