# Teaching Cursor — catalog methods, discoveries, and how to decide

This document teaches the **Electron / Cursor app** how Coding Assistant built and scored the PluginCatalog, so future UI and matching choices stay aligned with the data’s real trust model.

**Repo artifact:** `catalog/catalog.json` (`schemaVersion` 3, `catalogSource: store-export:v4`)  
**Companion docs:** `CURSOR-INSTRUCTIONS.md`, `HANDOFF-FOR-CURSOR.md`, `STATUS.md`, `CONFIDENCE.md` (in store), `SCHEMA-MICRO-MACRO.md`

---

## 1. Absolute zero trust (non-negotiable)

1. **Never trust** prior in-repo scrapers, seed JSON, “verified”, “page-confirmed”, “trusted”, or LLM guesses **outside** this store’s accepted observations.
2. **Policy A versions only:** a plugin’s `latestVersion` in the export comes from an accepted `version_observation` pointed to by `plugin_version_current`.
3. **Missing version ≠ invent one.** Prefer portal CTAs (`portalApp`, `updatePortalUrl`, `notesForUser`).
4. **Mac ≠ Win duals:** if public Mac and Win installers disagree, **do not unilateral-stamp** one platform’s version as global.
5. **Gen contamination:** never stamp a successor product’s version onto a predecessor SKU (e.g. Dent 2 → Dent 1, ShaperBox hub → module, Pumper 3 → Pumper 2).

---

## 2. Two layers: universe vs versions

| Layer | Meaning | App use |
|---|---|---|
| **Universe** | Manufacturer + plugin identity (`id`, `name`, `matchPatterns`, `identityKind`, portals) | Always match installed plugins even with no version |
| **Versions** | Accepted current observation → `latestVersion` + `versionConfidence` | Compare / update UX only when present |

Identity can grow faster than versions. Thousands of `soundset` / `bundle` / `expansion` rows are intentional and often **unversioned**.

---

## 3. Confidence bands (drive UI, not deletion)

| Band | Score | Typical source | App behavior |
|---|---|---|---|
| **Green** | ≥ 85 | Manufacturer page, CDN installer filename, official RN, GitHub release, OAS registry | Normal “up to date” / “update available” |
| **Amber** | 70–84 | Homebrew hub apps, DAW-bundled (Avid stock @70) | Soft caveat OK |
| **Yellow** | &lt; 70 | Almost always **KVR product page @60** | Show version + low-confidence badge; prefer portal; don’t auto-nag |

**Never hide** a Policy A version just because it’s yellow — confidence modulates trust UI only.

---

## 4. What worked for discovery (ranked)

Use these as the mental model when reading `versionEvidence` / sources:

1. **Manufacturer downloads / product pages** with explicit Version labels (FabFilter, Voxengo, Blue Cat, DMG, Neural DSP downloads, Steinberg `o.steinberg.net`, SSL Zendesk, etc.) → green ~88–95  
2. **Official CDN / installer filenames** (Overloud GEM, PSP, KIT Plugins, Softube Central, ujam Standalone Installers) → ~88–92  
3. **Release notes / changelogs / Version History** (Softube RN, Cherry Audio VH, UA help Version History, HoRNet banners, WA Production Update log, Denise legacy-downloads) → ~90–92  
4. **Open registries / GitHub** (Open Audio Stack ~559, LSP/x42/Calf/Dragonfly/Zam, Cardinal, Surge-adjacent) → ~90–95  
5. **Homebrew casks** for hub apps (Splice, Softube Central) → ~80–90 after CDN corroboration  
6. **KVR `verwin` / product Version** — unlocks hub-walled catalogs (Waves, IK, Spitfire, Acustica, UADx…) but stays **yellow @60** until manufacturer corroboration  
7. **DAW-bundled** (Avid Pro Tools stock @70) — use only with public “what’s new” / bundle policy  

### What failed or is hub-walled (don’t grind)

- Waves Central, IK Product Manager, Acustica Aquarius, Slate Activate, Spitfire App, Native Access (partial — some Official update status threads exist), Output Hub, United Plugins Manager (mostly)  
- Account-only download pages, Soft404 marketing pages, CAPTCHA walls  
- Stamping suite/hub versions onto child modules  

---

## 5. `identityKind` — don’t treat everything as an updatable plugin

| Kind | Meaning | Update UX |
|---|---|---|
| `plugin` | Normal instrument/effect | Full version compare when present |
| `soundset` / `expansion` | Libraries / expansions | Usually no plugin semver; library/player portal |
| `hub_app` | Central / Manager / SINE / Consolidated host | Version the hub; children may differ |
| `hardware` | Pedals, 500-series, Profilers | Don’t pretend software update |
| `bundle` / `suite_component` | Marketing suites / Aqua components | Avoid false “outdated” |
| `discontinued` / `gen_ambiguous` | Dead SKUs / unclear gen | Prefer successor links |

**Airwindows special case:** version **only** `airwindows--airwindows-consolidated` (`2026-09-05-2a6d1c0`). ~512 algorithms are **intentionally unversioned** (no per-SKU semver on site zips). Show Consolidated + freeware; never invent algorithm versions.

---

## 6. Micro vs macro (free stay-current vs paid upgrade)

Fields: `successorPluginId`, `predecessorPluginId`, `updateClass`, `generation`, `generationRank`.

- **Micro:** newer free build within the same commercial generation (what the user already owns).  
- **Macro:** paid successor (soothe → soothe2 → soothe3; D16 Drumazon → Drumazon 2; Baby Audio IHNY → IHNY-2; u-he Zebra2 → Zebra3).  

**App:** “You’re current on gen N” vs “Paid upgrade to gen N+1 exists” should be separate CTAs. Don’t conflate them into one scary update badge.

---

## 7. Popular gaps Cursor should not “fix”

These are **known** missing / non-stamped for good reasons (portal or Mac≠Win). Do **not** invent:

- Madrona **Aalto / Kaivo / Virta** (Mac≠Win)  
- Sound Radix **Drum Leveler**, **SurferEQ 2** (Mac≠Win)  
- Sonnox Restore trio + **Fraunhofer Pro-Codec** (Mac≠Win)  
- **SSL Meter Pro** (Download Manager; public “Meter” ≠ Meter Pro)  
- IK **TONEX Standard**, **Clavitube** (hub / ambiguous)  
- Line 6 **POD Farm** + Metallurgy trio (Mac≠Win)  
- **MPEG-H Renderer**, **Groove Shaper LITE** (Avid portal / bundled Lite)  
- Mercurial Tones SKUs (Hub-walled)  
- Boz Digital ×11 Mac≠Win leftovers  

Yellow-but-present (KVR@60) household names: **Waves**, **IK**, **Acustica**, **Spitfire**, **UADx**, **Slate**, **Nugen** — show low confidence + open `portalApp`.

---

## 8. Matching & UX recommendations

1. Match on `matchPatterns` + manufacturer first; version is secondary.  
2. If `identityKind != plugin`, soften or skip “plugin update available”.  
3. If yellow confidence **and** `portalApp` set → primary CTA is the hub.  
4. If `notesForUser` present → surface in detail pane (often explains Mac≠Win / portal / Airwindows).  
5. `successorPluginId` → optional “Upgrade available” distinct from “Update available”.  
6. Prefer raw URL:  
   `https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`  
7. Older app builds: ignore unknown JSON keys (forward-compatible).

---

## 9. How the store was built (for future human/agent collaborators)

Pipeline shape:

1. Import universe (identities only) — KVR listings, manufacturer product lists, OAS, expansions.  
2. Chip versions from public sources; accept observations with `verified_by` + confidence.  
3. Raise yellow→green when manufacturer corroborates same normalized version.  
4. Reclassify non-plugins via `identityKind`.  
5. Export schemaVersion 3 JSON; publish to `catalog/catalog.json`.  

**Do not** revive abandoned in-repo scrapers as authoritative. Weekly scrub (when resumed) should re-run manufacturer playbooks and **re-publish** this file.

---

## 10. Pause state (2026-09-10)

Discovery routines paused at Luke’s request. Published snapshot: manufacturers **583**, plugins **8439**, accepted versions **4986**, green **~3354**, amber **55**, yellow **~1577**. See `STATUS.md` / store `PAUSE-SNAPSHOT.md`.

When discovery resumes, Coding Assistant should push an updated `catalog/catalog.json` to this repo so the Electron app keeps pulling one stable URL.
