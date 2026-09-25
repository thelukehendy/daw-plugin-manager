# Control-group LIVE quotes — FabFilter / Goodhertz / Valhalla product×version table

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Control-group canary (`control-group-fabfilter-goodhertz-valhalla-deep`) already names tip shapes. Muse still needs a **multi-product LIVE quote table** (≥8 rows) with exact Current Version / download lines so parsers and golden fixtures do not invent strings. This is a freshness **health probe** pack, not discovery.
- **Context / evidence:**
  - Companion: `2026-09-25-control-group-fabfilter-goodhertz-valhalla-deep.md`
  - Doctrine: FRESHNESS hold→`verified_at`; SYNTHESIS plateau canaries.
  - **LIVE-FETCH window:** 2026-09-24 → 2026-09-25 PT (this file). FabFilter + Goodhertz via WebFetch HTTP 200; Valhalla shop via curl/`Current Version:` grep (Cloudflare intermittent on some SKUs — demos page used as cross-check).

---

## FabFilter — `https://www.fabfilter.com/download` (LIVE 200)

Quote pattern under each `## Download FabFilter <Name>` block:  
`VERSION — Mon DD, YYYY` (em dash / HTML entity `&mdash;`).

| # | Product | Exact tip line (LIVE) | macOS dl size noted |
|---:|---|---|---|
| 1 | Pro-Q 4 | **`4.13 — Jun 25, 2026`** | 27.8 MB |
| 2 | Pro-C 3 | **`3.02 — Apr 16, 2026`** | 25.5 MB |
| 3 | Pro-L 2 | **`2.26 — Apr 16, 2026`** | 17.1 MB |
| 4 | Pro-R 2 | **`2.06 — Apr 16, 2026`** | 24 MB |
| 5 | Pro-MB | **`1.33 — Apr 16, 2026`** | 16.4 MB |
| 6 | Pro-DS | **`1.32 — Apr 16, 2026`** | 16.1 MB |
| 7 | Pro-G | **`1.42 — Apr 16, 2026`** | 17.8 MB |
| 8 | Saturn 2 | **`2.13 — Apr 16, 2026`** | 19.3 MB |
| 9 | Timeless 3 | **`3.10 — Apr 16, 2026`** | 21 MB |
| 10 | Volcano 3 | **`3.09 — Apr 16, 2026`** | 19 MB |
| 11 | Twin 3 | **`3.07 — Apr 16, 2026`** | 24 MB |
| 12 | One | **`3.52 — Apr 16, 2026`** | 15.6 MB |
| 13 | Simplon | **`1.42 — Apr 16, 2026`** | 11 MB |
| 14 | Micro | **`1.32 — Apr 16, 2026`** | 10.2 MB |

**Bundle canary (same page):**  
`## Download FabFilter Total bundle` → copy **`All FabFilter plug-ins in one download Jun 25, 2026`** (date aligned with Pro-Q 4 tip — useful cross-check, do **not** stamp bundle date as a per-SKU version).

**Parser recipe (stable):**
```
GET https://www.fabfilter.com/download
For each h2 matching /^Download FabFilter (.+)$/:
  capture next version line matching
    ([0-9]+\.[0-9]+)\s*[—\-–]\s*([A-Za-z]+ [0-9]+, [0-9]{4})
```
Confidence **95**. On empty set → **fail the freshness job** (fetcher regression), do not silently hold other vendors.

---

## Goodhertz — `https://goodhertz.com/downloads/` (LIVE 200)

Shared installer for **all** plugins. Exact live quotes:

| Field | Exact LIVE text |
|---|---|
| Bundle heading | **`Goodhertz 3.14.1`** |
| Date heading | **`June 30, 2026`** |
| Installer note | *“This is the installer for all Goodhertz plugins (both trials and purchased plugins, all versions). No other installer is required.”* |
| Platforms | Windows AAX/VST/VST3 · Mac AAX/AU/VST/VST3 |

**RN bullets present on page (evidence only — do not parse as per-SKU versions):** latency compensation in Vulf Compressor / Faraday Limiter; Loudness crest-factor dB option; VCME playback / high-SR / Chino-mode fixes; Pro Tools GR meter bypass behavior; UI scaling / AAX page tables / offline auth improvements.

**Recipe:** parse `Goodhertz X.Y.Z` + month date; stamp **shared** `3.14.1` onto all Goodhertz plugin rows on hold/raise. `/changelog` remains dead — **do not use**. Confidence **95**. Missing heading → sweep abort (canary fail).

---

## Valhalla DSP — shop `Current Version:` lines (LIVE curl 2026-09-25 PT)

| # | Product | Shop URL | Exact LIVE tip |
|---:|---|---|---|
| 1 | ValhallaRoom | `https://valhalladsp.com/shop/reverb/valhalla-room/` | **`Current Version: 2.0.5 (Updated March 15, 2024)`** |
| 2 | ValhallaVintageVerb | `https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/` | **`Current Version: 4.0.5 (updated March 15, 2024)`** |
| 3 | ValhallaDelay | `https://valhalladsp.com/shop/delay/valhalladelay/` | **`Current Version: 3.0.5 (updated May 20th, 2025)`** |
| 4 | ValhallaSupermassive | `https://valhalladsp.com/shop/reverb/valhalla-supermassive/` | **`Current Version: 5.0.0 (Updated November 26th, 2025)`** |
| 5 | ValhallaPlate | `https://valhalladsp.com/shop/reverb/valhalla-plate/` | **`Current Version: 1.6.8 (Mac) / 1.6.3 (Windows)`** |
| 6 | ValhallaSpaceModulator | `https://valhalladsp.com/shop/modulation/valhalla-space-modulator/` | **`Current Version: 1.2.8 (Mac), 1.1.6 (Windows)`** |

**Demos & Downloads cross-check** (`https://valhalladsp.com/demos-downloads/`):

| Product | Demo button / label (LIVE) |
|---|---|
| VintageVerb | `Version 4.0.5: Updated 3/15/2024` |
| Room | `Version 2.0.5: Updated 3/15/2024` |
| Delay | `Version 3.0.5: Updated 5/20/2025` |
| Supermassive | `Latest: Version 5.0.0: Updated 11/26/2025` |
| FreqEcho (free) | `Version 1.0.2: Updated 11/22/2025` |

**Mac/Win split rule (Plate + Space Modulator):** catalog tracks **Mac-current** when shop documents dual tips (same doctrine as SSL Acoustifier). Record Win tip in evidence; do not prefer higher Win as sole current.

**Fetch posture:** curl first; if Cloudflare challenge page (seen intermittently on Supermassive/Plate via WebFetch) → mark attempt `fetch_degraded:cloudflare` / escalate browser; **not** `dead`. Snippet/cache interim ≠ first-hand `verified_at` refresh.

---

## Product × version canary table (≥8 rows — golden fixtures)

Use this table as the **control-group regression fixture** for `control-group-canary-v1`:

| vendor | product_key | tip_version | tip_date_or_note | source_url | extract_method | confidence |
|---|---|---|---|---|---|---:|
| fabfilter | pro-q-4 | 4.13 | Jun 25, 2026 | fabfilter.com/download | downloadsPage | 95 |
| fabfilter | pro-c-3 | 3.02 | Apr 16, 2026 | fabfilter.com/download | downloadsPage | 95 |
| fabfilter | pro-l-2 | 2.26 | Apr 16, 2026 | fabfilter.com/download | downloadsPage | 95 |
| fabfilter | saturn-2 | 2.13 | Apr 16, 2026 | fabfilter.com/download | downloadsPage | 95 |
| goodhertz | *(all SKUs)* | 3.14.1 | June 30, 2026 | goodhertz.com/downloads/ | downloadsPage-bundle | 95 |
| valhalla | valhalla-room | 2.0.5 | Mar 15, 2024 | …/valhalla-room/ | productPage | 95 |
| valhalla | valhalla-vintage-verb | 4.0.5 | Mar 15, 2024 | …/valhalla-vintage-verb/ | productPage | 95 |
| valhalla | valhalla-delay | 3.0.5 | May 20, 2025 | …/valhalladelay/ | productPage | 95 |
| valhalla | valhalla-supermassive | 5.0.0 | Nov 26, 2025 | …/valhalla-supermassive/ | productPage | 95 |
| valhalla | valhalla-plate | 1.6.8 | Mac-current (Win 1.6.3) | …/valhalla-plate/ | productPage-split | 95 |

---

## Chip wiring

Chip id: **`control-group-live-quotes-v1`** (extends `control-group-canary-v1`).

1. Run at start **and** end of every freshness sweep.
2. Assert ≥ N tip extractions (FabFilter ≥10 products; Goodhertz bundle present; Valhalla ≥4 shop tips).
3. On hold: advance `verified_at` (FRESHNESS acceptance — kills sticky-queue).
4. On parser empty / Incapsula-class stub for FabFilter or Goodhertz → **abort sweep** (alert), do not burn Melda/PA budget on a dead fetcher.
5. Valhalla Cloudflare flake → `fetch_degraded` per SKU; continue other canaries.

- **If accepted, what changes in the engine:** golden fixture JSON under playbooks; dashboard boolean `control_canary_ok`; research_attempts notes use `canary:ok` / `canary:fail:<vendor>`.
- **Expected impact:** BASELINE integrity. Catches broken fetch/parse before hub grind. Documents the tip shape plateau greens must keep matching.
- **Priority:** P0 (this week — W2 freshness / W10 dashboard canary boolean).
