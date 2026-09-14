# NOTES — stubborn gaps final creative pass

**When:** 2026-09-10 ~2:06 AM PT (2026-09-10T09:06Z UTC)  
**Path:** `/workspace/daw-plugin-catalog-store`  
**Actor:** coding-assistant (executor) · `verified_by=coding-assistant`  
**Policy:** Public product / downloads / CDN filename / KVR Product Version only. Zero trust. No git clone. No Alliance Manager / Aquarius / Native Access / ASC / UA Connect / Avid Link / SSL DM stamps.

## Headline

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Accepted currents | 3587 | **3593** | **+6** |
| True plugin gaps | **21** | **7** | **−14** |
| Green ≥85 | 2416 | **2421** | **+5** |
| Amber 70–84 | 56 | 56 | 0 |
| Yellow &lt;70 | 1115 | **1116** | +1 (Electra KVR) |
| discontinued (unknowns) | 68 | **75** | +7 |
| gen_ambiguous | 73 | **74** | +1 |

Export: `out/catalog.json` — 488 mfrs / 4367 plugins / **3593** with `latestVersion`.

## Accepts (+6)

| plugin_id | version | conf | source | receipt |
|---|---|---:|---|---|
| `uvi--uvi-workstation` | **4.0.9** | 88 | downloadsPage CDN path | `https://www.uvi.net/download-uvi-workstation/mac` → `cdn.uvi.net/.../files/4.0.9/soft/UVI_Workstation.dmg` (+ Win `.exe` paired) |
| `plugin-alliance--unfiltered-audio-dent` | **1.0** | 88 | PA Legacy Installers | `Unfiltered Audio Dent v1.0` + `unfiltered_audio_dent_*_1_0.zip` — **not** Dent 2 |
| `universal-audio--uadx-electra-88-vintage-keyboard-studio` | **1.0.12** | 60 | KVR verwin | `uadx-electra-88-vintage-keyboard-studio-by-universal-audio` |
| `psp-audioware--psp-hertzrider` | **1.0.3** | 88 | PSP CDN | `PSP_HertzRider_1.0.3.dmg` + `.exe` paired |
| `psp-audioware--psp-lotary` | **1.0.3** | 88 | PSP CDN | `PSP_Lotary_1.0.3.dmg` + `.exe` paired |
| `psp-audioware--psp-masterq` | **1.5.2** | 88 | PSP CDN native | `PSP_MasterQ_1.5.2.dmg` + `.exe` paired |

## Reclass (no invented versions)

| plugin_id | identity_kind | successor / note |
|---|---|---|
| `plugin-alliance--unfiltered-audio-dent` | **discontinued** | → `unfiltered-audio--unfiltered-audio-dent-2` (@2.4.1). Last gen1 **1.0** also accepted. |
| `psp-audioware--psp-hertzrider` | **discontinued** | → `psp-hertzrider2` (@2.0.4); last gen1 **1.0.3** accepted |
| `psp-audioware--psp-lotary` | **discontinued** | → `psp-lotary2` (@2.2.0); last gen1 **1.0.3** accepted |
| `psp-audioware--psp-masterq` | **discontinued** | → `psp-masterq2` (@2.1.5); last gen1 **1.5.2** accepted |
| `psp-audioware--psp-vintagewarmer` | **discontinued** | → `psp-vintagewarmer2` (@2.11.0). No gen1 CDN folder (404). |
| `psp-audioware--psp-infinistrip` | **gen_ambiguous** | → `psp-infinistrip-earth` (@1.4.1). Product page now EARTH; FIRE/WIND edition trains on CDN — do not stamp EARTH here. |
| `psp-mixbass` / `mixgate` / `mixpressor` / `mixsaturator` / `mixsync` / `mixtreble` | **discontinued** | MixPack gen-1 modules; live bundle `psp-mixpack-2` @2.1.0 ships Mix*2. No per-SKU CDN. |

## Remaining true plugin gaps (**7**) — status + next lever

| # | plugin_id | status | next lever |
|---|---|---|---|
| 1 | `mpegh--mpeg-h-renderer` | **unknown** — Avid Link / MyAvid only; PT 2026.4+ What’s New has install steps, **no** public semver. `bundled=1`, portal Avid Link. | **Avid account / lab Mac** installer filename; vendor Fraunhofer feed if ever public |
| 2 | `pitchinnovations--groove-shaper-lite` | **unknown** — PT-bundled MIDI FX Lite (2024.3+); full Groove Shaper is separate retail. `bundled=1`. | **Avid Link deep-link** / lab Mac; Pitch Innovations account if Lite build published |
| 3 | `sonnox--fraunhofer-pro-codec` | **unknown** — CSV Version Number **4.02.0** but Mac pkg `v4.02.0` ≠ Win exe `v4.01.0` (dual mismatch; playbook skip) | **Vendor feed** with unified build, or documented Mac-wins policy; lab both platforms |
| 4 | `sonnox--oxford-debuzzer` | **unknown** — Restore Mac `3.02.0` ≠ Win `3.01.0` | same as above |
| 5 | `sonnox--oxford-declicker` | **unknown** — same Restore dual | same |
| 6 | `sonnox--oxford-denoiser` | **unknown** — same Restore dual | same |
| 7 | `ssl--ssl-meter-pro` | **unknown** — SSL Download Manager / Complete Access only. Offline FAQ lists **Meter v1.6.6** ≠ Meter Pro. UG no build. | **SSL Download Manager** release notes / offline Meter Pro filename; lab Mac |

## Explicitly not accepted / not reclassed further

- **Dent 2 → Dent gen1:** rejected (prior) and not re-tried; gen1 **1.0** from Legacy only.
- **InfiniStrip EARTH 1.4.1 → bare InfiniStrip:** rejected; reclass gen_ambiguous instead.
- **Sonnox Mac-only train:** no documented policy → keep skip (CONFIDENCE dual-cap).
- **MixPack2 2.1.0 → Mix* individuals:** do not invent per-module versions from bundle.
- **mpegh / groove-shaper-lite / ssl-meter-pro:** still real plugins → left `identity_kind=plugin` with portal-only `notes_for_user` (prefer notes over fake versions).

## Creative avenues that paid off

1. **UVI download redirects** — page itself has no semver; `curl -I` Location embeds `/files/4.0.9/`.
2. **PA Legacy Installers** — Dent v1.0 still listed with `*_1_0.zip`.
3. **PSP open CDN index** (`download-eu2.pspaudioware.net`) — gen1 HertzRider / L'otary / MasterQ archives with paired Mac+Win filenames (product pages 404 / gen2-only).

## Artifacts

| Path | Role |
|---|---|
| `tmp-fetch/stubborn21/` | PA legacy, KVR Electra, UVI WS, SSL store/UG/downloads, UVI receipt, PSP CDN listings |
| `tmp-fetch/chip-small-gaps/sonnox.csv` | re-checked dual mismatch (unchanged) |
| `NOTES-stubborn-gaps-final.md` | this file |
| `playbooks/{psp-audioware,plugin-alliance,uvi,universal-audio,sonnox,ssl}.md` | appends |
| `out/catalog.json` | re-exported |
| `STATUS.md` / `HANDOFF-FOR-CURSOR.md` | refreshed |

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/status_report.py
python3 src/export_catalog.py
```
