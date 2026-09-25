# Tier-2 top-5 wiring-ready scout (Class A oracles)

- **Date:** 2026-09-25 ~12:20 PT
- **Advisor:** Grok Bot (wave 7 / ask 3 / lane 3)
- **Mode:** SCOUT ONLY — tier-2 research stays paused. No catalog proposals, no observation rows, no confidence writes, no git, no telemetry.
- **Selection:** True top-5 **Class A** by wave-6 formula `score = (fillable_plugin_gaps × q_accept) + (yellows × q_raise × 0.65)` (+×1.15 editorial where documented), from `tier2-recon-ranked.md` + `fixtures/lane345/tier2-mfr-scoreboard.tsv`, verified read-only against live `catalog.db` (COALESCE popularity_tier). Skipped Airwindows (policy) and soundset mountains. Skipped higher-scoring **Class B** (HoRNet, WA Production, DDMF). Dexed already green@90; Blue Cat 33/2 green/yellow (maintenance); Gullfoss/Soundtheory ranks below Madrona on formula → not in this five.

| Rank | Vendor | Score (recon) | Plugins / gaps / yellow | Live oracle class |
|---:|---|---:|---|---|
| 1 | **audiothing** | ~22 | 99 / 1 / 28 | A — update table |
| 2 | **wave-arts** | ~15 | 18 / 18 / 0 | A — version history + S3 filenames |
| 3 | **audiority** | ~8 | 52 / 0 / 13 | A — Plugin Versions table |
| 4 | **denise-audio** | ~4 ×1.15 | 10 / 10 / 0 | A — downloads parentheticals (+ legacy page) |
| 5 | **madrona-labs** | ~3 | 5 / 3 / 0 | A — download link text |

Fixtures: `fixtures/wave7/wave7/tier2/<vendor>/` (HTML + `.meta.json` sha256 + `tips.json`).  
**Wiring-ready after operator re-fetch; scout-only — no catalog action.**

---

## 1. AudioThing — `audiothing`

### Oracle URL(s)
- Primary: `https://www.audiothing.net/plugin-updates/`
- Account portal is **not** an oracle.

### Parse rule + live tip examples (fetched 2026-09-25)
- Rule: HTML table `Product | Version | Latest Update | Compatibility`. Exact product-name match after trim. Confidence candidate 90–92 after Muse re-fetch.
- Live tips (55 data rows): Arguments **1.0** (19 Nov 2024); B00GA **1.0.1** (25 Nov 2025); Environments **1.0** (14 May 2026); Filterjam **1.3.4** (13 Aug 2026); Fog Convolver 2 **2.4**; Speakers **1.3.3** (7 Aug 2026); Things - Bubbles **1.1.1**. Gap **Things - Tilt** not listed.

- Discontinued rows stay labeled "(discontinued)" — parse but do not promote as current if catalog marks discontinued.

### Golden fixtures
- `fixtures/wave7/tier2/audiothing/plugin-updates.html` (+ `.meta.json`, `tips.json`)

### Traps / identity guards
- **expansion ≠ plugin:** never stamp Environments **1.0** onto `Environments - Piscina Mirabilis` / `Environments - Temple of Mercury` (yellow@60, not on table).
- **bundle ≠ SKU:** Drum/Echo/Effect/… Bundle rows are `identity_kind=bundle`.
- **Toys mountain:** 28 yellow Toys/instruments (Bells, Toy Piano, Magical Toy Keyboard, …) are **absent** from this table — leave KVR@60; do not invent.
- **Gap trap:** sole plugin gap `Things - Tilt` is also **absent** from the table (2026-09-25) — this URL cannot fill it.
- Gen rows (Frostbite vs Frostbite 2, Outer Space vs Outer Space 2): match exact table name.

### Expected yield if opened (estimate only)
- **Accepts:** ~0 from this URL (Tilt not listed).
- **Raises:** ~0 of 28 yellow Toys (not on table). Table is a **maintenance canary** for ~55 already-green table-covered SKUs (raise only when table > accepted).
- Still wiring-priority #1: durable Class A surface, largest tier-2 footprint.

### Status
Wiring-ready after operator re-fetch; scout-only — no catalog action.

---

## 2. Wave Arts — `wave-arts`

### Oracle URL(s)
- History: `https://wavearts.com/support/version-history/dialog-2-04` (slug says Dialog; body is **whole line**, newest first)
- Corroboration: `https://wavearts.com/downloads` → `s3.us-east-1.amazonaws.com/wavearts-cms/downloads/...`

### Parse rule + live tip examples (fetched 2026-09-25)
- Rule: extract per-product dotted versions from history headings; **do not semver-normalize** (7.11 stays 7.11; 7.01 stays 7.01). Filename `TrackPlug7-711.dmg` = 7.11. Prefer history tip over Mac/Win filename on disagreement.
- Live tips: TrackPlug **7.11**, MasterVerb **7.03**, FinalPlug **7.06**, MultiDynamics **7.09**, Panorama **7.09** (grouped, 08/20/2025); Convology XT **1.34**; IR Capture **1.9**; Tube Saturator **2.18**; Tube Saturator Vintage **1.11**; Dialog **2.11** (2024-04-23); Power Suite installer **7.01** (`PowerSuite7-701.*`); MR Click **6.10**; MR Gate/Hum **6.09**; Master Restoration Suite installer **6.09**.

- Vendor wording: *"Power Suite version numbers refer to the installer build, and are independent of the included plug-in versions."*

### Golden fixtures
- `fixtures/wave7/tier2/wave-arts/version-history.html`, `downloads.html`, `tips.json`

### Traps / identity guards
- **suite ≠ SKU:** Power Suite 7.01 / Master Restoration Suite 6.09 are installer bundles — do not donate suite build onto TrackPlug/MR Click.
- **Grouped-heading trap:** one date after five products — naive `version+date` regex keeps only Panorama.
- **Mac-filename trap:** Dialog history **2.11**; Mac still `Dialog2-210.dmg`, Win `Dialog2-211.exe`. Blind Mac-current → regress to 2.10.
- **MR siblings:** MR Noise/Hum/Gate need own history/filename hits — do not copy MR Click 6.10 onto them (Noise Win 610 / Mac 609; Gate/Hum 609).

### Expected yield if opened (estimate only)
- **Accepts:** ~14–16 plugin rows (all 18 currently ungapped; 2 suite rows → identity `bundle` first, then optional installer version).
- **Raises:** 0 (no yellows).
- Best new-accept Class A oracle in tier-2.

### Status
Wiring-ready after operator re-fetch; scout-only — no catalog action.

---

## 3. Audiority — `audiority`

### Oracle URL(s)
- Primary: `https://www.audiority.com/plugin-versions/`
- `/downloads/` is a soft shell (not the versions table). User-area is not public.

### Parse rule + live tip examples (fetched 2026-09-25)
- Rule: table `Name | Curr Version | Last Update`. Strip leading `v`. Exact name match including mkII / GR9 / MV2 / VRS23 suffixes.
- Live tips (34): Big Goat **1.3**; GrainSpace **2.6**; PlexiTape **1.4.2** (2026-07-20); Space Station UM282 **1.5.3**; Spatial D320 **1.0.1** (2026-07-21) (**not in catalog**); XenoVerb **1.6**; NeonVerb MV2 **1.0.1**; Distortion 1 mkII **2.1** (catalog name **Distortion 1**); Heavy Pedal mkII **2.2** (catalog **Heavy Pedal**); Green Reaper GR9 **1.2.1** (catalog **Green Reaper**).


### Golden fixtures
- `fixtures/wave7/tier2/audiority/plugin-versions.html`, `tips.json`

### Traps / identity guards
- **soundset ≠ plugin:** Abstract Textures Kontakt/SFZ, Marimbula, Pills, Modular Piano stay `soundset`.
- **edition suffix:** Distortion 1 mkII ≠ Distortion 1; Green Reaper GR9; NeonVerb MV2; VertiVerb VRS23 — exact match only.
- **Table-only SKU:** Spatial D320 is on the public table but **not** in catalog (2026-09-25) — identity add before any version accept.
- **Yellow leftovers not on table:** Dr Drive, Dr Phase, Epic Pig Guiro, Harshness, L12X Solid State Amplifier, Side Filter, TS-1 Transient Shaper, The Bluesman/Driver/Overseer/Shredder/Sword, Tremolan — stay KVR@60.
- **Edition alias:** table mkII/GR9/MV2 suffixes must map to catalog bare names where catalog already collapsed the edition (Distortion 1, Heavy Pedal, Green Reaper) — exact table string ≠ catalog string; maintain an alias table, do not naive-equal.


### Expected yield if opened (estimate only)
- **Accepts:** ~0–1 (Spatial D320 only, after identity row).
- **Raises:** ~0 of 13 yellows from this table (they are absent). Canary for ~33 greens already @92 from this family.
- Wiring still justified: single durable table; leftovers need a different oracle later.

### Status
Wiring-ready after operator re-fetch; scout-only — no catalog action.

---

## 4. Denise Audio — `denise-audio`

### Oracle URL(s)
- Current: `https://www.deniseaudio.com/downloads`
- Legacy: `https://www.deniseaudio.com/legacy-downloads`
- S3 zips (`deniseaudio.s3.amazonaws.com/...`) — **no version in object key**.

### Parse rule + live tip examples (fetched 2026-09-25)
- Rule: product heading + parenthetical `(X.Y)`. Ignore S3 filenames; HEAD Last-Modified is canary only.
- Current page: Bass XXL **(1.3)**; Motion Filter **(1.4)**; Perfect Room 2 **(1.4)**.
- Legacy page: Bad Tape **(1.2)**; Bad Tape 2 **(1.4)**; Bite Harder **(1.3)**; Dragon Fire **(1.3)**; God Mode **(1.3)**; My Crush **(1.1)**; Slappy **(1.1)**; plus non-catalog legacy SKUs (Bass XL, Perfect Room, Noize 2, …).

### Golden fixtures
- `fixtures/wave7/tier2/denise-audio/downloads.html`, `legacy-downloads.html`, `tips.json`

### Traps / identity guards
- **generation ≠ stamp:** Bad Tape ≠ Bad Tape 2; Perfect Room (legacy 1.1) ≠ Perfect Room 2 (current 1.4).
- **name near-miss:** Bass XL (legacy 1.0) ≠ Bass XXL (current 1.3) — never map XL→XXL.
- **S3 filename trap:** `Bass+XXL+Denise+Audio+Mac.zip` carries **no** version — parenthetical is the tip.
- Legacy-only names not in catalog (Poltergate, Sub Generator, The Sweeper, …) are identity candidates, not silent version writes.

### Expected yield if opened (estimate only)
- **Accepts:** ~10/10 catalog plugins if both pages used with generation guards (3 current + 7 legacy matches). Recon's "~3" was current-page-only; legacy expands the safe set.
- **Raises:** 0 (all gaps today).

### Status
Wiring-ready after operator re-fetch; scout-only — no catalog action.

---

## 5. Madrona Labs — `madrona-labs`

### Oracle URL(s)
- Per-SKU: `https://www.madronalabs.com/products/{sumu,aalto,kaivo,virta,aaltoverb}`
- `/products` index 404 — do not use.

### Parse rule + live tip examples (fetched 2026-09-25)
- Rule: download `<a>` text `Name X.Y.Z [VST/AU installer for macOS|VST installer for Windows]`. Require Mac **and** Win. Agree → accept; disagree → **HOLD** (no average, no Mac-wins).
- Live: Sumu Mac=Win **1.3.0** (matches catalog @88); Aaltoverb Mac=Win **2.0.3** (matches @88); **Aalto** Mac **1.9.5** / Win **1.9.4**; **Kaivo** Mac **1.9.5** / Win **1.9.4**; **Virta** Mac **1.9.5** / Win **1.9.3**.

### Golden fixtures
- `fixtures/wave7/tier2/madrona-labs/{sumu,aalto,kaivo,virta,aaltoverb}.html` + `tips.json`

### Traps / identity guards
- **host ≠ module:** Vutu companion versions on Sumu page (0.9.9 / 0.9.10) are not Sumu.
- **Mac/Win split:** Aalto/Kaivo/Virta currently disagree — documented hold; same class as SSL/Dialog lesson.
- Small catalog (5 plugins) — no suite/expansion rows, but do not invent Auro (500 on fetch).

### Expected yield if opened (estimate only)
- **Accepts:** ~0 new (3 gaps are Mac/Win holds; 2 already green — canary only).
- **Raises:** 0.
- Wiring value = durable link-text recipe + codified mismatch guard for the day Win catches up.

### Status
Wiring-ready after operator re-fetch; scout-only — no catalog action.

---

## Cross-cutting (all five)

1. Operator must **re-fetch** before any catalog write — fixtures are scout evidence, not accept authority.
2. Identity guards (lane 5) before version writes: Wave Arts suites, AudioThing expansions/Toys, Denise generations, Audiority soundsets, Madrona Mac/Win.
3. Confidence band for these Class A surfaces after Muse first-hand re-fetch: **90–92** (filename corroboration alone ≤88).
4. Still paused: no `vendor_feeds` insert, no playbook mutation, no observation rows from this scout.
5. Not in this five (formula / policy): Airwindows; Gullfoss (lower score; PDF tip 1.11.9 reserved for `soundtheory--gullfoss` only if later opened); Dexed (already green); Blue Cat (near-complete).

## Recommendation
Keep tier-2 paused. When Luke opens an allowlist, wire parsers in assault order **AudioThing → Wave Arts → Audiority → Denise → Madrona** using the fixture recipes above; expect real accept mass from **Wave Arts + Denise**, canaries from AudioThing/Audiority/Madrona, and zero Toy/Airwindows grinding.
