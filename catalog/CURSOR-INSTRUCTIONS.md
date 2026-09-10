# Paste into Cursor — DAW Plugin Catalog handoff

## Goal
Wire **DAW Plugin Manager** (Electron) to consume the curated PluginCatalog JSON from this catalog store. Discovery/scraping stays out of the app. Updates only open manufacturer portals (never installers).

## Primary artifact
- File: `out/catalog.json`
- Format: PluginCatalog **schemaVersion 3**
- Marker: `catalogSource: "store-export:v4"`
- Frozen pause snapshot (~2026-09-10): ~**583** manufacturers, ~**8439** plugins, ~**4986** with accepted `latestVersion`

Also useful: `HANDOFF-FOR-CURSOR.md`, `STATUS.md`, `CONFIDENCE.md`, `SCHEMA-MICRO-MACRO.md`, optional `data/catalog.db`.

## How to interpret the data (zero trust)

1. **Universe vs versions**
   - Every plugin identity may appear even without a version (so matching still works).
   - `latestVersion` is Policy A only: accepted store observations — never trust older seed/scraper stamps.

2. **`versionConfidence` (0–100)**
   - **≥ 85 (green):** manufacturer page / CDN / installer / public RN — treat as trustworthy current.
   - **70–84 (amber):** weaker but usable (e.g. DAW-bundled).
   - **&lt; 70 (yellow):** usually KVR-only @60 — show the number but UI should mark low confidence / “verify on manufacturer site”.
   - **Missing `latestVersion`:** do not invent. Use portal CTA.

3. **Helpful app fields** (optional keys; ignore if unknown to older builds)
   - `portalApp` — hub to open (Waves Central, IK Product Manager, Aquarius, etc.)
   - `updatePortalUrl` — manufacturer update page
   - `requiresIlok`, `isFreeware`, `notesForUser`
   - `identityKind` — `plugin` | `soundset` | `hub_app` | `hardware` | `bundle` | `expansion` | `discontinued` | …
   - Prefer not nagging “update available” for non-`plugin` kinds the same way.

4. **Micro vs macro upgrades**
   - `successorPluginId` / `predecessorPluginId` / `updateClass` / `generation`
   - Micro = free within-generation latest; macro = paid successor (e.g. soothe → soothe2 → soothe3).
   - UI should distinguish “stay current on what you own” vs “paid upgrade path”.

5. **Known special cases**
   - **Airwindows:** version only Consolidated (`2026-09-05-2a6d1c0`). ~512 algorithms intentionally unversioned — show Consolidated + freeware notes, do not invent per-SKU versions.
   - **Hub-walled yellows** (Waves, IK, Acustica, Spitfire, UADx, Slate, Nugen…): version may exist at KVR@60 only; open `portalApp`.
   - **Mac≠Win dual gaps** (Madrona Aalto/Kaivo/Virta, Sound Radix Drum Leveler/SurferEQ 2, Sonnox Restore, Boz×11, etc.): no unilateral stamp — portal / per-platform notes.
   - **Portal-only** (SSL Meter Pro, MPEG-H Renderer, Groove Shaper LITE, …): CTA only.

## App wiring (suggested)
1. Fetch `catalog/catalog.json` (or release asset / raw URL) on launch or daily.
2. Match installed plugins via `matchPatterns` + manufacturer.
3. Compare installed version → `latestVersion` only when confidence policy allows.
4. Update button → open `portalApp` or `updatePortalUrl` in browser — never download/run installers.
5. Surface confidence + `notesForUser` in detail UI.

## Do not
- Re-scrape or trust prior “verified/page-confirmed” stamps outside this store.
- Invent versions to fill gaps.
- Bundle installers or auto-update plugins.
