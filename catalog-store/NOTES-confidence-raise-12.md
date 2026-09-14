# NOTES — confidence raise 12 (2026-09-10 ~2:46 AM PT)

Overnight corroboration pass #12. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Focus: Analog Obsession leftovers (installer CDN / Patreon), Audified RN PDFs from portfolio, plus probes of Antelope / denise / Tracktion / HoRNet / Rob Papen / LANDR / Heavyocity / ToneBoosters yellows. Zero trust; no git clone. Skip Waves/IK/Spitfire/Acustica/UADx/Slate/Nugen hubs. True gaps left alone.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **43** (yellow→green) |
| Official CDN installer filename @88 | **25** (Analog Obsession) |
| Manufacturer RN PDF @92 | **18** (Audified) |
| Snapshot accepted-current green (≥85) | **2737** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1257** (all KVR @60) |
| Accepted currents | **4050** (unchanged) |
| Export | `out/catalog.json` @ 2026-09-10T09:46:52Z → **2026-09-10 2:46 AM PT** |

*This run’s own corroboration delta is **+43 green / −43 yellow** (2694→2737 / 1300→1257).*

Starting bands (brief): green **2694** / amber **56** / yellow **1300**. After this raise: green **2737** / amber **56** / yellow **1257**.

*Note: Concurrent universe import grew manufacturers/plugins (508→520 / 5091→5960) and inflated unversioned `identity_kind=plugin` unknowns; **not** caused by this raise. Accepted currents stayed **4050**. Raise-12 did not touch gaps.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| Analog Obsession | **25** | Official `analogobsession.com/wp-content/uploads/…/{Name}_{ver}.pkg` (Patreon-linked or public CDN) matching KVR | **88** |
| Audified | **18** | Official `audified.com/wp-content/uploads/2023/08/*-Release-Notes.pdf` latest heading | **92** |

## Breakdown of raises

### Analog Obsession (+25)

Public Patreon posts → official CDN installer basenames (HEAD 200). Exact / trailing-zero–normalized match to KVR only.

Raised (slug → kept version): ahead 1.0, blackvibe 2.0.0, britchannel 7.0.0, britpre 2.0.0, britpressor 3.0.0, combox 6.0.0, fetdrive 3.0.0, fetish 6.0.0, fetsnap 3.0.0, frank 3.0, frank-cs 2.0, kabin 3.0.0, kolin 5.1.0, kolinmb 1.0, konsol 3.0, merica 4.0.0, pedalz 2.0.0, rare 1.0.0, room041 2.0, specomp 2.0.0, sweet-drums 4.0.0, sweetvox 4.0, thebus 1.0.0, tuba 3.0.0, tupre 3.0.0.

AO yellow remaining: **7** — amper, channev, chopa, dynasaur, predd (no public CDN/Patreon VERSION found this pass); rarese (CDN `RB_RareSE_1.0` ≠ KVR **5.0.0**); tilta (Patreon VERSION **1.0** ≠ KVR **2.0.0**).

### Audified (+18)

Portfolio page `audified.com/portfolio/` lists public Release Notes PDFs under `/wp-content/uploads/2023/08/`. Latest RN heading; when RN is `X.Y.Z` and KVR is `X.Y.Z.build`, keep KVR build.

- STA Preamp / Delay **2.2.0.20** (RN 2.2.0); STA Effects **2.2.0** (manufacturer newer than KVR 2.1.0)
- VocalMint Compressor **1.0.1.3** (RN 1.0.1)
- ToneSpot Acoustic/Bass/Drum/Electric/Voice Pro + Drum/Electric/Voice Express **1.4.0.19** (RN 1.4.0)
- Peridot Pro/LE + Sphene Pro/LE **1.1.0.7** (Peridot/Sphene RN 1.1.0)
- RecAll **1.2.1**; inValve Effects **2.1.0**

Audified yellow remaining: **11** — amplion-pro (AmpLion **2** Rock Essentials RN ≠ ampLion Pro), effect-pedals / intone-2 / sceneflow / tnt-voice-executor (no RN), linda-ironverb + ToneKnob×4 (RN≠KVR, same as raise 11), tonespot-computermusic (no RN PDF).

## Explicit non-raises (quality)

| Target | Why skipped |
|---|---|
| Antelope Audio 46 | Software store / FPGA-AFX — no discrete public per-plug semver |
| denise 23 | Downloads page only Perfect Room 2 / Bass XXL / Motion Filter (already green); legacy Collection Plan — no public installer semver |
| Tracktion 28 | Product/marketing pages (BioTek etc.) — no public installer receipt matching KVR |
| HoRNet 36 leftovers | Product pages marketing-only or Soft404 homepage (no matching version banner); gen-1←MK redirects same gate |
| Rob Papen 35 | downloads.html product-select / My Products — hub-walled, no public per-title semver |
| LANDR 15 | Marketing / account FX — no public installer semver matching KVR |
| Heavyocity 4 | FURY product page + Portal hub — no public 1.1.5 receipt |
| ToneBoosters 16 v3 | Legacy freeware installer **v1.6.0** is shared host, **not** per-SKU 3.1.8 — do not stamp |
| AO RareSE / TILTA | Manufacturer version ≠ KVR |
| Waves / IK / Spitfire / Acustica / UADx / Slate / Nugen | Skipped per brief |

## Export

`python3 src/export_catalog.py` → `out/catalog.json` (4050 with latestVersion / versionConfidence).

## Playbook / doc updates

- `NOTES-confidence-raise-12.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/{analog-obsession,audified}.md`
