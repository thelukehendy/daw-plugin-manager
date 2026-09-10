# Version confidence scoring

Store: `/workspace/daw-plugin-catalog-store`  
SQLite: `meta.schema_version=4` (confidence landed in v3; still current)  
Columns: `version_observations.confidence` (INTEGER 0–100), `version_observations.confidence_reasons` (JSON string array).

Export inherits confidence from the **current accepted observation** onto each versioned plugin as:

- `versionConfidence` — integer 0–100  
- `versionConfidenceReasons` — string array  
- `versionEvidence` — unchanged mapping (`manufacturer-feed` / `page-confirmed` / `agent-verified`)

## Rubric (source quality)

| Source class | Typical score | Notes |
|---|---|---|
| Manufacturer official page / feed with clear version | **90–100** | product / downloads / release notes on vendor domain |
| Installer filename on official CDN matching product | **85–95** | e.g. FabFilter `.dmg`, u-he releases, D16 CDN |
| Lab on-disk CFBundle match | **95–100** | agent-verified local binary identity |
| KVR product page only (`verwin`) | **55–70** | crowdsourced — **skeptical default ~60** |
| Homebrew cask for hub apps | **75–85** | useful when vendor hub is walled |
| Wayback-only | **40–60** | historical; may be stale |
| Dual Mac/Win mismatch or suite ambiguity | **cap at 40** | unless mismatch resolved with corroboration |
| Multiple corroborating sources | **raise toward 100** | e.g. page + content hash, feed + installer |

### Backfill defaults (`src/backfill_confidence.py`)

Applied from `extract_method` / `source_kind` / URL:

| Rule | Score |
|---|---|
| `oas-registry*` / `vendorFeed` / manufacturer-feed | **95** |
| page-confirmed manufacturer `downloadsPage` / `productPage` / `releaseNotesPage` | **92** |
| installer-filename on official domain | **88** |
| installer-filename (other domain) | **85** |
| homebrew / `brew-cask*` | **80** |
| `kvr-product-page` / KVR URL | **60** |
| wayback / archive.org | **50** |
| lab on-disk / CFBundle | **98** |
| unmatched → default | **50** |

Reasons are always written as a JSON array of human-readable strings (why this score).

## How Electron should use it

Align with existing app confidence bands:

| Band | Score | UX |
|---|---|---|
| **Green** | **≥ 85** | Show version as trusted / normal “update available” / “up to date” |
| **Amber** | **70–84** | Optional softer styling; still actionable |
| **Yellow** | **&lt; 70** | Caution — show version but badge as lower confidence (KVR / wayback / ambiguous). Prefer linking `versionSourceUrl` and surface `versionConfidenceReasons` in a detail popover |

Recommendations:

1. Never hide a Policy A `latestVersion` solely because confidence is low — identity + version still help matching; confidence only modulates trust UI.
2. Prefer manufacturer portal CTAs (`portalApp`) when confidence is yellow **and** the manufacturer is hub-walled.
3. Do not treat yellow-band KVR versions as authoritative for auto-update prompts without user confirmation.
4. Ignore unknown JSON keys on older builds; `versionConfidence*` is forward-compatible.

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/migrate_v3.py
python3 src/backfill_confidence.py
python3 src/export_catalog.py
```

Re-run `backfill_confidence.py` after bulk observation imports; it overwrites scores idempotently from method/kind/URL.

## Corroboration procedure (KVR → manufacturer)

Goal: raise yellow-band (~60) KVR-only **accepted currents** when a **primary manufacturer** page confirms the same version (or a newer authoritative suite/installer version).

### Steps

1. Select KVR-60 currents (`confidence < 70`, typically `extract_method=kvr-product-page` / kvraudio URL).
2. Fetch a **manufacturer** source (product page, version-history, release notes, CDN installer filename, official changelog/manual). Save HTML/PDF under `tmp-fetch/` and hash when practical.
3. **Match rule (strict):**
   - Prefer exact semver match between manufacturer evidence and the KVR accepted version → insert **new** accepted observation at **88–95** with reasons citing manufacturer URL + “matches KVR …”, then `plugin_version_current` (supersedes prior for audit trail).
   - If manufacturer clearly publishes a **newer** authoritative version (e.g. UAD suite release notes ahead of stale KVR), accept the manufacturer version at **88–95** instead — do not “confirm” the stale KVR number.
   - **Do not raise** on mismatch, dual Mac/Win ambiguity, gen-1←gen-2 contamination, suite→component fuzzy maps, or hub-walled portals.
4. Typical scores after corroboration:
   - Official release notes / version-history / changelog: **90–92**
   - Official CDN / downloads installer filename: **88**
   - Official product manual stating version: **90**
5. Re-export: `python3 src/export_catalog.py`
6. Record counts in `HANDOFF-FOR-CURSOR.md` and a `NOTES-confidence-raise-*.md`.

### Anti-patterns

- Raising confidence from KVR alone or from another crowdsourced mirror.
- Stamping a shared host/suite version onto unrelated SKUs (e.g. ShaperBox manual → module majors; Softube family RN → UAD Softube titles).
- Using gen-2 CDN paths (`Fazortan2-…`) to corroborate gen-1 store ids.
- Treating Wayback / reseller pages as primary without a live manufacturer fetch.
