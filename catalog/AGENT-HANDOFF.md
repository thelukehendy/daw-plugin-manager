# AGENT HANDOFF — DAW Plugin Manager catalog

**Read this first** if you are picking up catalog / version work for [thelukehendy/daw-plugin-manager](https://github.com/thelukehendy/daw-plugin-manager).

This repo holds both the Electron app and the **accuracy-first catalog library**. The app consumes a published JSON; the library that *builds* that JSON lives under `catalog-store/`.

| What | Where |
|---|---|
| **Start here (agents)** | `catalog/AGENT-HANDOFF.md` (this file) |
| **App teaching / UX** | `catalog/TEACHING-CURSOR.md` |
| **App integration** | `catalog/HANDOFF-FOR-CURSOR.md`, `catalog/CURSOR-INSTRUCTIONS.md` |
| **Live export the app fetches** | `catalog/catalog.json` (PluginCatalog **schemaVersion 3**, `catalogSource: store-export:v4`) |
| **Source of truth (SQLite + tooling)** | `catalog-store/` |
| **Pause snapshot** | `catalog-store/PAUSE-SNAPSHOT.md`, `catalog-store/STATUS.md` |

**Raw URL (stable):**  
`https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json`

---

## 1. What this project is

**DAW Plugin Manager** is a read-only macOS Electron app that:

1. Inventories installed DAWs / plugins on the machine  
2. Matches them to a curated **PluginCatalog** JSON  
3. Shows update / compatibility status  
4. **Never installs** — update actions only open manufacturer portals / hubs  

**Catalog ownership split:**

- **Electron / Cursor app work:** matching UI, portals, confidence badges, micro vs macro CTAs  
- **Catalog library (this handoff):** exhaustive universe + accurate `latestVersion` + evidence + confidence, exported as schemaVersion 3 JSON  

Prior in-repo Gemini / “page-confirmed” / smart-scrub pipelines under `catalog/*.json` workflows are **abandoned as authority**. Do not treat `page-confirmed`, `agent-verified`, seed scrapers, or LLM stamps as truth. Absolute **zero trust** outside accepted store observations.

---

## 2. Library layout (`catalog-store/`)

```text
catalog-store/
  data/catalog.db          # SQLite SoT (schema v4)
  out/catalog.json         # same export as catalog/catalog.json (at last publish)
  schema.sql               # DDL
  src/                     # Python: init, import, accept, export, migrate, stats…
  playbooks/               # ~185 per-manufacturer scrub recipes (what to hit weekly)
  NOTES-*.md               # overnight pass logs (chips, raises, expands, gap mops)
  HANDOFF-FOR-CURSOR.md
  STATUS.md
  PAUSE-SNAPSHOT.md
  CONFIDENCE.md
  SCHEMA-MICRO-MACRO.md
  HUB_WALLED.md
  MILESTONE-hub-walled.md
```

### Schema mental model

1. **Universe** — manufacturers + plugin identities (`id`, name, matchPatterns, `identityKind`, portals). Can grow without versions.  
2. **Observations** — `version_observations` with source URL, extract method, confidence, `verified_by`.  
3. **Current pointer** — `plugin_version_current` → one accepted observation → export `latestVersion` + `versionConfidence`.  

**Policy A:** export versions only from accepted current observations. Missing version → portal / notes, never invent.

### Key scripts

| Script | Role |
|---|---|
| `src/init_db.py` / `migrate_v*.py` | Schema |
| `src/import_universe.py` / `import_universe_batch.py` | Add identities |
| `src/accept_observation.py` | Stamp a version observation + current |
| `src/export_catalog.py` | Write `out/catalog.json` (schemaVersion 3) |
| `src/stats.py` / `status_report.py` | Counts / gaps |
| `src/classify_identity_kind.py` | Drop false “plugin gaps” |
| `src/backfill_confidence.py` | Confidence backfills |

After any store change that should ship to the app: export, then **copy `out/catalog.json` → `catalog/catalog.json`** and push so the raw GitHub URL stays current.

---

## 3. Numbers at pause (2026-09-10 ~5:40 AM PT)

| Metric | Value |
|---|---|
| Manufacturers | **583** |
| Plugins (universe) | **8439** |
| Accepted current versions | **4986** |
| Green (≥85) | **3354** |
| Amber (70–84) | **55** |
| Yellow (<70, mostly KVR@60) | **1577** |
| Airwindows intentional unversioned | **512** |
| True plugin gaps (non-Airwindows) | **~74** |

Discovery routines were **paused** at Luke’s request. Do not resume mass overnight expands unless he asks.

---

## 4. Efficiencies that worked (use these)

Ranked discovery sources:

1. **Manufacturer downloads / product pages** with explicit Version (FabFilter, Voxengo, Blue Cat, DMG, Neural DSP, Steinberg `o.steinberg.net`, SSL Zendesk, …) → confidence ~88–95  
2. **CDN / installer filenames** (Overloud GEM, PSP, KIT, Softube Central, ujam Standalone Installers) → ~88–92  
3. **Release notes / changelogs / Version History** (Softube RN, Cherry Audio VH, UA help VH, HoRNet, WA Production, Denise legacy-downloads) → ~90–92  
4. **Open registries / GitHub** (Open Audio Stack ~559, LSP/x42/Calf/Dragonfly/Zam, Cardinal, …) → ~90–95  
5. **Homebrew casks** for hub apps (after CDN corroboration) → ~80–90  
6. **KVR product `verwin`** — fills hub-walled catalogs fast, but stay **yellow @60** until manufacturer corroborates  
7. **DAW-bundled** (Avid Pro Tools stock @70) only with public “what’s new” / bundle policy  

**Workflow efficiencies:**

- Expand **universe first**, chip versions second (identity without version is still useful).  
- **Raise** yellow→green when manufacturer page matches normalized KVR version (don’t re-scrape blindly).  
- Keep **per-manufacturer playbooks** (`playbooks/*.md`) — weekly scrub = re-run playbooks, not reinvent sources.  
- Reclassify with `identityKind` (`soundset`, `hub_app`, `hardware`, `bundle`, `discontinued`, `gen_ambiguous`) to remove fake gaps.  
- Publish one stable `catalog/catalog.json`; app should ignore unknown keys (forward compatible).  
- Micro vs macro fields (`successorPluginId`, `updateClass`, …) so UI can separate “free stay current” vs “paid next gen”.

---

## 5. Roadblocks / do-not-grind (critical)

### Hub-walled (no reliable public per-SKU semver)

Do **not** burn cycles on account-only hubs as primary truth:

- Waves Central  
- IK Product Manager  
- Acustica Aquarius  
- Slate Activate  
- Spitfire App  
- Output Hub  
- United Plugins Manager (mostly)  
- Native Access (partial — some public threads exist; still careful)  

For these: KVR@60 yellow + `portalApp` CTA is the honest state until a public manufacturer page corroborates.

### Never stamp these patterns

- **Mac ≠ Win duals** as one global version (Madrona Aalto/Kaivo/Virta; Sound Radix Drum Leveler / SurferEQ 2; Sonnox Restore + Fraunhofer; Line 6 POD Farm / Metallurgy; many Boz leftovers). Prefer notes + portal.  
- **Gen contamination** (Dent2→Dent1, suite→module, Pumper3→Pumper2, ShaperBox hub→child).  
- **Airwindows per-algorithm versions** — only version `airwindows--airwindows-consolidated` (`2026-09-05-2a6d1c0`). ~512 algorithms stay intentionally unversioned.  
- Soft404 marketing pages, CAPTCHA walls, inventing versions “because the app needs a number”.  
- Trusting labels: verified / trusted / page-confirmed / prior scrapers / LLM guesses outside this store.

### Known true gaps (don’t “fix” by inventing)

Examples (see STATUS / NOTES / TEACHING-CURSOR): SSL Meter Pro; IK TONEX Standard / Clavitube; MPEG-H Renderer; Groove Shaper LITE; Mercurial×7 hub; portal leftovers above. Yellow-but-present household names (Waves, IK, Acustica, Spitfire, UADx, Slate, Nugen) are **not** gaps — they have KVR@60.

---

## 6. Confidence bands (drive UI, not deletion)

| Band | Score | Typical source | App behavior |
|---|---|---|---|
| Green | ≥ 85 | Manufacturer / CDN / RN / GitHub / OAS | Normal update UX |
| Amber | 70–84 | Homebrew hubs, Avid bundled @70 | Soft caveat |
| Yellow | < 70 | Almost always KVR @60 | Show version + low-confidence; prefer portal |

Never hide a Policy A version because it’s yellow.

---

## 7. How to resume work (when Luke asks)

1. Read `catalog-store/STATUS.md` + latest `NOTES-*.md` + relevant `playbooks/`.  
2. Work in SQLite via `src/*` — not by hand-editing `catalog/catalog.json` as SoT.  
3. Accept observations with evidence URLs; raise confidence only on corroboration.  
4. `python3 src/export_catalog.py` → copy to `catalog/catalog.json`.  
5. Refresh `TEACHING-CURSOR.md` / this handoff if methods changed.  
6. Push so the raw URL updates.  
7. Weekly scrub = playbook-driven manufacturer passes, not resurrecting Gemini smart-scrub as authority.

---

## 8. Conflict with older `catalog/README.md` content

Older README text described Gemini Flash / sticky-reverify / “page-confirmed” Actions pipelines. That was an **earlier approach**. **Authoritative truth is `catalog-store` + `store-export:v4`.** Teaching docs and this handoff supersede those scraper narratives for version accuracy.

In-repo files like `gap-queue.json`, `known-sources.json`, `flash-escalation.json` may still exist for historical/app pipeline code — treat them as **non-authoritative** for latestVersion.

---

## 9. Owner preferences (Luke Hendrickson)

- Absolute zero trust on versions.  
- Exhaustive universe; confidence skeptical→raised via corroboration.  
- Micro (free within gen) vs macro (paid successor).  
- Per-manufacturer discovery methods for efficient weekly scrubs.  
- Handoff = data + interpretation instructions for Cursor/Electron.  
- When the store updates, **always republish** `catalog/catalog.json` to this GitHub repo.

---

## 10. Quick verification commands

```bash
# From catalog-store/
python3 src/stats.py
python3 src/status_report.py
python3 src/export_catalog.py
# Then ensure catalog/catalog.json matches out/catalog.json before publish
```

SQLite peek:

```bash
sqlite3 data/catalog.db "SELECT COUNT(*) FROM manufacturers; SELECT COUNT(*) FROM plugins; SELECT COUNT(*) FROM plugin_version_current;"
```

---

*Packaged for successor agents 2026-09-13. Catalog discovery paused 2026-09-10; this publish adds the full library + notes to the repo so a clone is self-sufficient.*
