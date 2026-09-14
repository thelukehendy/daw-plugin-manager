# NOTES — confidence raise 7 (2026-09-10 ~12:47 AM PT / 2026-09-10T07:47Z UTC)

Overnight corroboration pass #7. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises. Skipped Waves/IK/Spitfire/UADx/Slate/Output/United hubs per brief. Skipped mass Avid/digidesign daw-bundled @70 (55) — no per-title public versions.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **2** |
| **Amber→green** | **2** (Softube Central, Splice) |
| **Yellow→green** | **0** |
| Accepted-current green (≥85) | **1869** |
| Accepted-current amber (70–84) | **56** |
| Accepted-current yellow (<70) | **728** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **728** |
| Export | `out/catalog.json` @ 2026-09-10T07:46:59Z → **2026-09-10 12:47 AM PT** |

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Softube | **1** | Softube CDN installer filename (`softubestorage.b-cdn.net`) | **90** |
| Splice | **1** | Splice desktop CDN installer filename (`desktop.splice.com`) | **90** |

### Softube (+1 amber→green)

- **Central `2.2.0`** — primary `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/Softube%20Central-2.2.0-universal.pkg` HEAD **200** (content-length 293320101, last-modified 2026-04-15). Softube.com `/release-notes` lists plugin family **2.6.x** only (no Central 2.2.0 RN article). CDN filename is manufacturer primary → raise brew-cask @80 → **90**.

### Splice (+1 amber→green)

- **Splice `5.4.12`** — primary `https://desktop.splice.com/conveyor/stable/splice-5.4.12-mac-aarch64.zip` HEAD **200** (content-length 140165076, last-modified 2026-07-24). Public version embedded in manufacturer CDN path → raise brew-cask @80 → **90**.

## Explicit non-raises (quality)

### FOSS / GitHub yellows

| Target | Why skipped |
|---|---|
| **surge-synthesizer Shortcircuit XT `0.9.245`** | GitHub `surge-synthesizer/shortcircuit-xt` tags/releases = **Nightly** only (beta since Feb 2026). CMake is date-driven `0.${PART0}.${PART1}.0` while alpha — **no** stable `0.9.245` tag/receipt. Do not invent Nightly→semver. |
| **vital-audio Vital `1.6.4`** | `mtytel/vital` tags/releases **empty**; README says source delayed after binary releases; vital.audio has **no** public `1.6.x` string. Forum EA posts mention 1.6.4 but are not manufacturer primary. Left yellow. |

### Amber→green (not raised)

| Target | Why skipped |
|---|---|
| **native-instruments Native Access `3.25.2` @80** | Brew URL `Native-Access-arm64-mac-latest.zip` has **no** version in path; NI marketing pages lack `3.25.2`. No public NI page match → leave @80. |
| **native-instruments Kontakt `8.13.0` @60** | Native Access gated; product page has no public installer semver. |
| **avid/digidesign daw-bundled @70 (55)** | Per brief: do **not** invent per-plugin versions; leave @70. |

### Singleton yellows re-probe (curl/WebFetch)

| Target | Why skipped |
|---|---|
| **klanghelm MJUC `1.8.1`** | Product page downloads = manuals / MJUC jr only; `MJUC-manual.pdf` URL returns HTML shell; paid installers purchase/user-area — no public semver. |
| **leapwing-audio LimitOne `1.0.1`** | `leapwingaudio.com/product/limitone/` live; support RN URL **404**; manual PDF = “Manual version 1A” only (no `1.0.1`). |
| **audio-ease Cabinet `1.0.1`** | Legacy; Altiverb/Speakerphone already green (@92) with public VH — Cabinet has no current product/version page. |
| **linplug Organ 3 `3.2.1`** | linplug.com static — no Organ 3 / `3.2.1` installer semver. |
| **safari-pedals Gorilla Drive `2.1.0`** | `safariaudio.com/products.json` (30 SKUs) still **no** Gorilla Drive. |
| **scuffham S-Gear `3.2.4`** | Site HTTP **202** empty / CAPTCHA — unreachable. |
| **liquidsonics Seventh Heaven Professional `1.5.9`** | Public downloads still **Mac 1.5.8 vs Win 1.5.9** — dual mismatch; no paired VH policy. |
| **eastwest Spaces `1.1.26`** | soundsonline Spaces / Spaces II pages surface **Spaces II / 2.5** — distinct SKU; do not map Spaces↛Spaces II. |

### Creative AudioThing Toys

| Target | Why skipped |
|---|---|
| **audiothing ~27 Toys @1.0** | `/instruments/{slug}/` 404 for Toys SKUs; plugin-updates / blog RSS / instruments hub lack per-Toy installer semver; `github.com/AudioThing` org repos page **Not Found**; do not stamp Environments parent onto expansions (Priority A peers still correctly rejected). |

## Priority A peer retarget

Inspected Environments expansions — high-conf @88 obs remain **rejected** (parent Environments installer ≠ expansion SKU). **0** retargets.

## Playbook / doc updates

- `NOTES-confidence-raise-7.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/softube.md`, `splice.md`, `native-instruments.md`, `surge-synthesizer.md`, `vital-audio.md`, `klanghelm.md`, `leapwing-audio.md`, `liquidsonics.md`, `eastwest.md`, `audio-ease.md`, `audiothing.md`, `linplug.md`, `safari-pedals.md`, `scuffham-amps.md`
