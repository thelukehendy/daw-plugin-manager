> **PAUSED 2026-09-10 ~5:40 AM PT** — catalog work and scrub routines stopped per Luke. See `PAUSE-SNAPSHOT.md` + `STATUS.md` for frozen totals (**583** mfrs / **8439** plugins / **4986** accepted).

# HANDOFF — DAW Plugin Catalog Store (for Cursor / Electron)

Luke is asleep. This is the overnight handoff for **Cursor app** work against the catalog store.

**Store root:** `/workspace/daw-plugin-catalog-store`  
Do **not** git-clone `daw-plugin-manager`. Consume the export JSON only.

| Artifact | Path |
|---|---|
| SQLite DB | `data/catalog.db` (`meta.schema_version` = **4**) |
| Electron export | `out/catalog.json` (PluginCatalog **schemaVersion 3**, `catalogSource: store-export:v4`) |
| Canonical DDL | `schema.sql` |
| Scripts | `src/*.py` |
| Playbooks (markdown) | `playbooks/*.md` (playbooks; **513** DB rows) |
| Live one-pager | `STATUS.md` · refresh via `python3 src/status_report.py` |

---

## Latest overnight chip

**confidence raise 25 2026-09-10 ~5:24→5:32 AM PT** (2026-09-10T12:24–12:32Z): Yellow→green **+3** — Audiomodern Filterstep **1.1.3** / Panflow **1.0.1** @90 (`/updates/` CDN zips exact=KVR); Initial Audio SourceLab 2 **2.4.1** @92 (product badge newer than KVR 2.4.0). Also AM green bumps Chordjam **1.5.3** / Freezr **1.0.6** / Loopmix **1.1.8**. Non-raises: ujam **0** yellow; surreal CAPTCHA; UP `/Manuals/`→documentation **0** PDF/semver; WA Update logs **0 exact**; IA leftovers (Sektor older / 808 gen / Soft404). Mega hubs skipped. Headline live: **571 / 8078 / 4978**. Bands: green **3346** / amber **55** / yellow **1577**. Notes: `NOTES-confidence-raise-25.md`.

## Latest overnight chip

**confidence raise 24 2026-09-10 ~5:08→5:19 AM PT** (2026-09-10T12:08–12:19Z): Yellow→green **+2** @92 via Initial Audio public product pages — Slice **1.3.0** (hero `v1.3.0 •`), Difro Melody AI **1.1.0** (Version 1.1.0 newer than KVR 1.0.2). United Plugins: full news corpus `/news?page=1..10` (ids 6–143) + 56 product pages — **0** new exact matches for remaining **57** yellow (stale news older than KVR / Manager-only). rob-papen demos unversioned; tracktion downloads login/marketing-only; Softube **0** yellow; mega hubs skipped. Headline live: **571 / 8078 / 4899**. Bands: green **3273** / amber **55** / yellow **1571**. Notes: `NOTES-confidence-raise-24.md`.

## Latest overnight chip

**confidence raise 23 2026-09-10 ~4:56→5:04 AM PT** (2026-09-10T11:56–12:04Z): Yellow→green **+2** @92 via United Plugins public news — Autoformer **5.0** (`/news/detail/135` “version 5”), Phantomix **1.1** (`/news/detail/133`). Non-raises: UP Manager/legacy/stale news; Wavesfactory **0** yellow; WA Update logs **0 exact**; Hornet marketing/Soft404; Cableguys CM/module Manual PDF **404**; Softube **0** yellow; Cherry VH **500**/404; Overloud Fuse/TH-U leftovers (do not stamp **2.0.19**); mega hubs skipped. Headline: **561 / 7020 / 4893**. Bands: green **3265** / amber **55** / yellow **1573**. Notes: `NOTES-confidence-raise-23.md`.

## Latest overnight chip

**confidence raise 22 + gaps mop expand7-mercurial + universe expand 8 2026-09-10 ~4:44→4:55 AM PT** (2026-09-10T11:44–11:55Z): Yellow→green raises **0** (united/TB/cableguys/acon/hornet/NI leftovers still blocked). New green chips **+7** @92 (Wavesfactory Equalizer **1.0.2**, Trackspacer **2.5.10**, Quantum **1.0.2**, Echo Cat **1.0.2**, Re-Esser **1.0.3**; Audiority Harmonic Maximizer **1.3.1**, Polaris **1.9**). Universe **+20** plugins (Wavesfactory densify + Audiority). Mercurial **7** gaps left Hub-walled (`portal_app` set); Mac≠Win **44** still dual. Softube Central leave dual-channel (yml **2.2.0** vs sc3 **3.0.5**). Headline after: **561 / 7020 / 4893**. Bands: green **3263** / amber **55** / yellow **1575**. Non-AW plugin gaps **52** (+Sharine Soft404). Notes: `NOTES-confidence-raise-22.md`, `NOTES-gaps-mop-expand7-mercurial.md`, `NOTES-universe-expand-8.md`.

## Latest overnight chip

**version-chip expand-7 + confidence raise 21 2026-09-10 ~4:36→4:42 AM PT** (2026-09-10T11:36–11:42Z): Chip **+53** accepted (United commercials **46** KVR@60; Cableguys CM×2; Mercurial Vanguard **1.0.3** + Scepter→Pro **1.2.1**; Eventide Blackhole **3.11.4** @92 twin of H9 Series; Voxengo PSquasher→Polysquasher **3.6** @92; MTM LIMITER **1.0.6**). Bundles/soundsets (FabFilter/sonible/PSP/Soundtoys Academic/Ocelot/MSF Essentials) kept unversioned. Raise **+3** / chip **+1**: NI Official Massive **1.7.0**, Battery **4.3.1**, Native Access **3.25.2**, Traktor Pro **4.5.1** @92. United Manager-only non-raise; WA 0 exact; Steinberg leftovers legacy; mega hubs skipped. Headline after: **561 / 7000 / 4886**. Bands: green **3256** / amber **55** / yellow **1575**. Non-AW plugin gaps **51**. Notes: `NOTES-version-chip-expand-7.md`, `NOTES-confidence-raise-21.md`.

## Latest overnight chip

**gaps mop expand6 + confidence raise 20 2026-09-10 ~4:25→4:32 AM PT** (2026-09-10T11:25–11:32Z): Gaps mop **reclass +6** (Audiority Kontakt soundsets×4; CFA DC-Zero soundset; WARP Ableton expansion) → non-AW true gaps **50→44**. Raise **+9** yellow→green: Steinberg Padshop **2.3.0** / Retrologue **2.5.0** @92 (CDN Version History PDFs + Installer filenames); NI Official update status @92 (Kontakt **8.13.0**, Maschine **3.6.0**, KK **3.5.4**, Guitar Rig Pro **7.0.2**, Reaktor **6.5.0**, Massive X **1.7.0**, Absynth 6 **6.1**). calf/x42/guitarix already green. Audiority Plugin Versions: 0 yellow leftovers on table. WA Update logs: 0 exact. IL: no daw-bundled invent. Mega hubs skipped. Headline after: **559 / 6887 / 4811**. Bands: green **3229** / amber **56** / yellow **1526**. Notes: `NOTES-gaps-mop-expand6.md`, `NOTES-confidence-raise-20.md`.

**Mac≠Win / portal leave (do not unilateral stamp):** remaining **44** non-AW true gaps — Boz×11, IL×5, Audified×4, Line6×4, Sonnox×4, Madrona×3, Accentize×2, Sound Radix×2, IK portal×2, CFA Grip dual, UA C-Max mismatch, WA pumper-stereo-image, portal singles (mpegh / groove-shaper-lite / ssl-meter-pro / pianoteq-demo). Full id list in `NOTES-gaps-mop-expand6.md`.


## Latest overnight chip

**version-chip expand-6 2026-09-10 ~4:19→4:25 AM PT** (2026-09-10T11:19–11:25Z): **+142** accepted (115 manufacturer/GitHub @88–92 + 27 KVR@60). Calf **0.90.9**, Guitarix **0.47.0**, x42 per-plugin tags, EQ10Q **2.2**, Audiority Plugin Versions table + KVR leftovers, CFA/NI/UA/Modartt/IK fills. Headline after: **559 / 6887 / 4811**. Bands: green **3220** / amber **56** / yellow **1535**. Notes: `NOTES-version-chip-expand-6.md`.


## Latest overnight chip


**universe expand 6 2026-09-10 ~4:06→4:17 AM PT** (2026-09-10T11:06–11:17Z): **+10** mfrs / **+397** plugins / **+94** FOSS suite versions. New: audiority, cfa-sound, singular-sound, lsp-plugins, x42, calf, dragonfly-reverb, eq10q, zam-audio, guitarix. Fills: Spitfire/NI soundsets, Waves/IK/UA collections, Modartt denser. Chipped LSP **1.2.35**, Dragonfly **3.2.10**, Zam **4.5** @90. Headline after: **559 / 6887 / 4669**. Notes: `NOTES-universe-expand-6.md`.


**confidence raise 19 2026-09-10 ~4:06→4:15 AM PT** (2026-09-10T11:06–11:15Z): **+19** yellow→green corroborations. Steinberg public downloads **+18** @92 (HALion/Sonic **7.5.0**, Sonic SE **3.5.10**, Backbone **1.6.20**, Groove Agent **6.0.30**, Dorico **6.2.30**, Cubase/Nuendo **15.0.30**, SpectraLayers **13.0.20**, WaveLab **13.0.30**, Cast **2.0.50**, VST Connect **5.6.10**, VST Live Pro 3 **3.0.60**); Scaler 2 **2.9.1** @92 (Scaler Music forum CURRENT VERSION). Bands after: green **3011** / amber **56** / yellow **1508** / accepted **4575**. Skips: WA 49 Update-log exhausted; Boz no public CDN; IL no daw-bundled invent; XLN leftover RN gaps; PB exclusives account-only; Modartt portal. Notes: `NOTES-confidence-raise-19.md`.


**confidence raise 18 2026-09-10 ~3:50→4:04 AM PT** (2026-09-10T10:50–11:04Z): **+17** yellow→green corroborations. Neural DSP past-release titles **+7** @92; WaveWarden installers **+2** @88 (Spline 1.1.1, Filter Force Free 1.0.4); AudioRealism product installers **+3** @88 (ABL3 3.3.5.2, ASM1X 1.6.0.1, ReDominator 1.5.2.2); SSL Zendesk downloads **+5** @92 (4K G 1.3.1, DeEss 1.4.1; autoBUS **1.0.18** / autoDYN **1.0.6** / autoEQ **1.0.43** newer than KVR). Bands after: green **2992** / amber **56** / yellow **1527** / accepted **4575**. Skips: initial-audio/overloud/cymatics/toneboosters/landr/acon Studio*/cableguys modules (no matching public semver); ABL2/ADM mfr≠KVR; X-Orcism II store-only. Notes: `NOTES-confidence-raise-18.md`.


**gaps mop expand5 2026-09-10 ~3:50→3:55 AM PT** (2026-09-10T10:50–10:55Z): **+4** accepted → **4575**. Non-AW true gaps **45→41**. Stamped: `surge-synthesizer--monique-monosynth` **1.2.0** @95 (OAS), `surge-synthesizer--b-step-sequencer` **2.1** @60 (KVR), `audiothing--magical-toy-keyboard` **1.0** @60, `headrush--revalver` **5.1.2** @60 (KVR Product Version Win=Mac; AU/VST3 parentheticals ≠ dual). Remaining 41 all documented Mac≠Win/portal leave. Notes: `NOTES-gaps-mop-expand5.md`.

**Prior — version-chip expand 5 2026-09-10 ~3:42→3:49 AM PT** (2026-09-10T10:42–10:49Z): **+74** accepted currents → **4571**. Manufacturer greens @92: Ignite **11**, XLN release_notes **6**, Fractal editors/Cab-Lab **5**. KVR@60: Plugin Boutique **17**, ML Sound Lab **9**, STL **6**, Modartt **5**, XLN SKUs **5**, Sample Magic **4**, WaveWarden **2**, Two notes **2**, Garritan ARIA **1**, Ignite PTEq-1a **1**. HeadRush ReValver later re-evaluated in expand5 mop. Hardware identities untouched. Notes: `NOTES-version-chip-expand-5.md`.


## What this store is

- **Universe** = manufacturers + plugins (ids, names, `matchPatterns`, identity). Always exported so the app can match installed plugins.
- **Versions** = Policy A only: accepted `version_observations` + `plugin_version_current`. Never trust seed `latestVersion`.
- **SQLite schema_version 4** = confidence + micro/macro + `identity_kind` + helpful app fields (`portalApp`, iLok, freeware, notes, bundled).
- **Export** stays PluginCatalog **schemaVersion 3** with optional forward-compatible keys (older Electron builds ignore unknowns).

Related docs:

- `CONFIDENCE.md` — scoring rubric + green/amber/yellow bands  
- `SCHEMA-MICRO-MACRO.md` — free micro update vs paid macro successor  
- `HUB_WALLED.md` — do not grind account portals  
- `NOTES-last-16-gaps.md` — how the last 4 true gaps were established  
- `NOTES-identity-kind-classify.md` — v4 classify pass  

---

## Current stats (verify live)

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/status_report.py   # preferred one-pager numbers
python3 src/stats.py           # shorter counts
```

Snapshot at handoff (2026-09-10 ~4:32 AM PT / 2026-09-10T11:32Z) — after gaps mop expand6 + confidence raise 20:

| Metric | Value |
|---|---|
| Manufacturers | **559** |
| Plugins | **6887** |
| Accepted currents | **4811** |
| Without version | **2076** |
| Of those: `identity_kind=plugin` | **556** (**512** Airwindows intentional + **44** non-AW) |
| Confidence green (≥85) | **3229** |
| Confidence amber (70–84) | **56** |
| Confidence yellow (<70) | **1526** (all KVR @ 60) |
| Playbooks (DB) | **513** |
| Observations | see live `status_report.py` |



## How to run common ops

```bash
cd /workspace/daw-plugin-catalog-store

# Export for Electron (Policy A)
python3 src/export_catalog.py
# → out/catalog.json

# Weekly OAS accept (Open Audio Stack registry → oas--* plugins)
python3 src/accept_oas_registry.py              # fetch live + accept new/changed
python3 src/accept_oas_registry.py --dry-run
python3 src/accept_oas_registry.py --from-file tmp-fetch/oas-plugins-live.json
python3 src/accept_oas_registry.py --refresh-receipts   # rewrite receipts even if version matches

# Import universe identity ONLY (no versions from seed)
python3 src/import_universe.py                  # /tmp/dpm_catalog.json or GitHub raw
# Batch expansion helper (when used):
python3 src/import_universe_batch.py --help

# Accept a single verified version
python3 src/accept_observation.py --help
# (public product page / changelog / installer filename only; verified_by=coding-assistant for assistant accepts)

# Migrations / scoring / classify (idempotent)
python3 src/migrate_v2.py
python3 src/migrate_v3.py
python3 src/migrate_v4.py
python3 src/backfill_confidence.py
python3 src/classify_identity_kind.py
python3 src/seed_playbooks_from_notes.py
```

**Policy reminders**

- Public product page / changelog / installer filename only for new accepts.  
- Never invent versions; dual Mac/Win mismatch → skip.  
- Do **not** grind hub portals (Native Access, Waves Central, Avid Link, Softube Central, UA Connect, etc.) — see `HUB_WALLED.md`.  
- KVR is crowdsourced → confidence ~60 (yellow). Prefer manufacturer corroboration to raise (see `CONFIDENCE.md`).

---

## PluginCatalog export fields (schemaVersion 3 + extensions)

Base (always when applicable): `id`, `manufacturerId`, `name`, `matchPatterns`, optional `formats`, `productLine`, `bundled`, `minMacOS`, `updatePortalUrl`, `discontinued`, `notes`.

Version fields **only** when an accepted current observation exists:

| JSON key | Source |
|---|---|
| `latestVersion` | observation `observed_version` |
| `versionSourceUrl` | `source_url` |
| `versionVerifiedAt` | `verified_at` |
| `versionEvidence` | mapped from `source_kind` (`manufacturer-feed` / `page-confirmed` / `agent-verified`) |
| `versionConfidence` | observation `confidence` (0–100) |
| `versionConfidenceReasons` | JSON string array |

Micro/macro (omit when null / omit `updateClass: "unknown"`):

| JSON key | Meaning |
|---|---|
| `generation` / `generationRank` | SKU generation label + order |
| `updateClass` | `free_current` \| `paid_upgrade` \| `discontinued` \| `bundled` |
| `successorPluginId` | paid next-gen SKU |
| `predecessorPluginId` / `supersedesPluginId` / `supersededByPluginId` | gen links |

Helpful / identity (emit when set; `identityKind` **only when ≠ `plugin`**):

| JSON key | Meaning |
|---|---|
| `identityKind` | `soundset` / `expansion` / `hardware` / `eurorack` / `hub_app` / `bundle` / `suite_component` / `daw_stock_effect` / `gen_ambiguous` / `discontinued` / `unknown_other` |
| `portalApp` | hub deep-link label (Waves Central, Native Access, Avid Link, …) |
| `updateChannel` | optional plugin override |
| `requiresIlok` | boolean |
| `isFreeware` | boolean |
| `notesForUser` | short UX explanation |
| `bundled` | boolean (e.g. Avid stock with Pro Tools) |

Manufacturers may also carry `portalApp` / `updateChannel` / `notes`.

---

## How Electron should interpret

### 1. Missing `latestVersion` + `identityKind` ≠ plugin → **not** a version problem

Do **not** show yellow “unknown version” for non-plugin identities. Branch UI on `identityKind`:

| `identityKind` | UX hint |
|---|---|
| `soundset` / `expansion` | Content pack — no plugin semver |
| `hardware` / `eurorack` | Physical / modular — not a DAW plugin update |
| `hub_app` | Manager / shell / bridge |
| `bundle` / `suite_component` | No single installer semver |
| `daw_stock_effect` | OS/DAW stock feature |
| `gen_ambiguous` | Generation mismatch — don’t invent / don’t map Vn→V |
| `discontinued` | Successor links / discontinued badge |
| `unknown_other` | Docs / misfiles — neutral, not “needs version” |
| _(omit / `plugin`)_ | True plugin still missing public version → yellow unknown OK |

`notesForUser` explains why there is no `latestVersion`.

### 2. Confidence bands

| Band | Score | UX |
|---|---|---|
| **Green** | **≥ 85** | Trusted version; normal up-to-date / update-available |
| **Amber** | **70–84** | Softer styling; still actionable |
| **Yellow** | **&lt; 70** | Caution (typically KVR). Show version but badge lower confidence; surface `versionConfidenceReasons` + `versionSourceUrl` in detail |

Never hide a Policy A `latestVersion` solely because confidence is low. Prefer `portalApp` CTAs when yellow **and** hub-walled.

### 3. Micro outdated vs macro paid upgrade

- **`outdated` / free update available** = installed version **&lt;** this row’s `latestVersion` (same plugin id / generation).  
- **`successorPluginId` set** → separate **“Paid upgrade available” / “Next generation”** badge — **not** a free-update CTA.  
- Example: Pro-Q 3 current on micros → up to date; still show Pro-Q 4 as optional paid upgrade.  
- See `SCHEMA-MICRO-MACRO.md`.

### 4. `portalApp` deep links for hub vendors

When `portalApp` is set (plugin or manufacturer), deep-link / CTA to that hub instead of scraping:

Examples in-store: Waves Central, UA Connect, PA Installation Manager, Softube Central, IK Product Manager, iZotope Product Portal, Arturia Software Center, Avid Link, SSL Download Manager, Cherry Audio Sync, …

### 5. Avid stock = bundled with Pro Tools version

Avid stock effects (`bundled: true`, `updateClass: "bundled"`, ~54 rows) track the **host Pro Tools** release (currently **2026.4.1**), not an independent plugin installer. UX: show as bundled with PT; update via **Avid Link** / Pro Tools installer. `notesForUser` states this explicitly.

---

## Confidence rubric (summary)

| Source class | Typical score |
|---|---|
| Manufacturer official page / feed | 90–100 |
| Official CDN installer filename | 85–95 |
| Lab on-disk CFBundle | 95–100 |
| Homebrew cask (hub apps) | 75–85 |
| KVR product page only | ~60 (yellow) |
| Wayback-only | 40–60 |
| Dual Mac/Win or suite ambiguity | cap 40 unless resolved |

Backfill defaults live in `src/backfill_confidence.py`. Full rubric + corroboration procedure: **`CONFIDENCE.md`**.

---

## Airwindows + remaining true plugin gaps

### Airwindows (512 — intentional, not a chip backlog)

Individual algorithms ship as date-stamped freeware AU/VST zips **without per-SKU semver**. Policy:

1. **Never invent** `latestVersion` for an Airwindows algorithm from Consolidated’s date-shortsha.  
2. Show **`airwindows--airwindows-consolidated`** current (**`2026-09-05-2a6d1c0`**) + `isFreeware` + `notesForUser`.  
3. Keep individuals as `identityKind=plugin` with notes (standalone installs exist) — do **not** mass-reclass `suite_component` unless a title is clearly Consolidated-only.  
4. SoftGate / DrumSlam weak KVR `1.0` outliers exist — do not expand that pattern.

### Actionable true plugin gaps (**41**) — after gaps mop expand5

Source: `NOTES-gaps-mop-expand5.md` (prior leave list: expand4). Distinct from the 512 intentional Airwindows rows. All 41 are Mac≠Win dual or portal — no unilateral stamps.

### Electron UX rules (do not invent versions)

1. **Never invent / guess `latestVersion`.** If the store export omits `latestVersion`, the app must not fabricate one from KVR scrape, filename heuristics, or sibling SKUs (e.g. do not map TONEX Max → TONEX Standard; do not map Consolidated → individual Airwindows).  
2. **Portal-only → portal CTA only.** When stuck reason is hub/portal (Avid Link, SSL Download Manager, Product Manager, etc.), show **`portalApp` / update-portal CTA** — not a yellow “unknown version” chase.  
3. **Mac ≠ Win dual → skip stamp / dual badge.** When public receipts disagree by platform, leave `latestVersion` absent. UX: “Platform versions differ — check vendor downloads”; **do not** pick Mac or Win unilaterally.  
4. **Ambiguous KVR / contaminated rows → no stamp.**  
5. **Bundled Lite / host-tied** → host portal CTA (Groove Shaper Lite).  
6. **Airwindows individuals** → Consolidated CTA / freeware notes; not “needs version”.

| Stuck class | plugin_ids |
|---|---|
| Mac≠Win dual | `boz-digital--big-clipper-2`, `le-snappet`, `manic-compressor`, `mongoose-2`, `pan-knob-2`, `panipulator`, `panther-stereo-manipulation`, `recoil`, `t-bone-2`, `the-hoser-xt-2`, `width-knob`; `accentize--dialogueenhance`, `prefet`; `image-line--drumaxx`, `morphine`, `toxic-biohazard`; `audified--multi-drive-pedal`, `multidrive-pedal-le`, `multidrive-pedal-pro`, `toneknob-sssniper`; `line-6--metallurgy-{modern,thrash,doom}`, `pod-farm`; `madrona-labs--{aalto,kaivo,virta}`; `sonnox--fraunhofer-pro-codec`, `oxford-debuzzer`, `oxford-declicker`, `oxford-denoiser`; `sound-radix--drum-leveler`, `surfereq-2`; `wa-production--pumper-stereo-image` |
| No clean verwin / no daw-bundled invent | `image-line--dx10`, `simsynth-live` |
| Portal / hub | `mpegh--mpeg-h-renderer` (Avid Link); `pitchinnovations--groove-shaper-lite` (Avid Link); `ssl--ssl-meter-pro` (SSL DM); `ik-multimedia--clavitube`, `tonex-standard` (IK Product Manager) |



---

## Weekly scrub routine (intent)

1. **OAS:** `python3 src/accept_oas_registry.py` (then export).  
2. **Public manufacturers:** walk playbooks with `cadence_hint=weekly` / recent `last_scrub_at`; accept only clear public receipts.  
3. **Confidence raise:** corroborate yellow KVR currents against manufacturer pages (`CONFIDENCE.md` corroboration section).  
4. **Do not** grind hub portals — leave hub-walled unknowns with `portalApp` + `notesForUser`.  
5. Update playbook `last_scrub_at` / NOTES after each pass.  
6. `python3 src/export_catalog.py` + `python3 src/status_report.py` → refresh `STATUS.md` numbers if shipping a handoff.

---

## Suggested next **app** work (Electron / Cursor)

1. **Confidence UI** — green / amber / yellow badges from `versionConfidence`; popover for `versionConfidenceReasons` + source URL.  
2. **Successor upgrades** — separate paid-upgrade badge when `successorPluginId` / `updateClass=paid_upgrade`; keep free micro outdated distinct.  
3. **Identity kinds** — suppress yellow-unknown for non-`plugin` `identityKind`; use `notesForUser` copy.  
4. **Hub CTAs** — prefer `portalApp` deep links for hub-walled manufacturers.  
5. **Bundled / Avid stock** — treat `bundled` + PT-tracked version as host-tied, not independent plugin updates.  
6. Optional: wire catalog refresh to pull `out/catalog.json` from this store path (no git clone of manager).

---

## File map

| Path | Role |
|---|---|
| `schema.sql` | Canonical DDL (v4) |
| `data/catalog.db` | SQLite store |
| `out/catalog.json` | Electron catalog export |
| `STATUS.md` | One-page live snapshot |
| `CONFIDENCE.md` | Rubric + Electron bands |
| `SCHEMA-MICRO-MACRO.md` | Free micro vs paid macro |
| `HUB_WALLED.md` | Account-gated unknowns |
| `REMAINING-UNKNOWNS.md` | Broader gap inventory |
| `NOTES-last-16-gaps.md` | Final 4 true gaps |
| `src/export_catalog.py` | JSON export |
| `src/accept_oas_registry.py` | Weekly OAS accept |
| `src/import_universe.py` | Identity-only import |
| `src/accept_observation.py` | Single version accept |
| `src/status_report.py` | STATUS numbers |
| `src/stats.py` | Short counts |
| `src/backfill_confidence.py` | Confidence scoring |
| `src/classify_identity_kind.py` | Unknown classify |
| `playbooks/*.md` | Per-manufacturer scrub notes |


## Version chip expand-3 (2026-09-10 ~3:05 AM PT)
- NOTES: `NOTES-version-chip-expand-3.md`
- +217 accepted → **4267** currents; bands green **2772** / amber **56** / yellow **1439**
- Airwindows: freeware=1; Consolidated `2026-09-05-2a6d1c0` only; no global algorithm pack version
- SSL 500-series rows reclassed hardware; Meter Pro still open

## Gaps mop + Airwindows policy (2026-09-10 ~3:02 AM PT)
- NOTES: `NOTES-gaps-mop-airwindows-policy.md`
- +2 accepted → **4270**; true plugin gaps **535** (512 Airwindows intentional + **23** actionable)
- Reclass 13: WA soundset×11, OMNYSS expansion, BIAS Amp 2 discontinued
- Airwindows policy locked in STATUS + this handoff for Electron
