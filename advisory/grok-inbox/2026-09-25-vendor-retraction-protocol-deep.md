# Vendor retraction protocol — deep (Acoustifier live fixture)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #5 — Vendor-retraction detection. Deepens `2026-09-24-vendor-retraction-detection.md` with classification taxonomy, detection signals, Acoustifier watch→promote protocol, false-positive guards, and **live 2026-09-24 SSL fixture URLs**.
- **Context / evidence:**
  - Standing rule (PROJECT-BRIEF): *catalog mirrors what a user downloads TODAY*. Vendor-confirmed version **decrease** is a legitimate correction.
  - Teaching case — SSL Acoustifier (LIVE confirmed 2026-09-24 PT):
    - Article: https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-Plug-in-Downloads
    - Zendesk JSON: https://support.solidstatelogic.com/api/v2/help_center/en-gb/articles/4849510029085.json (`updated_at` recently `2026-09-22T08:57:30Z`)
    - Cell text: **`Acoustifier v1.0.18 (v1.0.19 Windows only)`**
    - Mac installer: `SSL Acoustifier macOS v1.0.18 Installer.dmg`
    - Win installer path includes `2025.11.24 – v1.0.19` / `SSL Acoustifier 64-bit v1.0.19.exe`
    - CDN path typo `Acuostifier` — parser must tolerate
    - Policy: catalog **Mac-current → 1.0.18**. Keeping 1.0.19 as sole current is wrong for Mac users.
  - Related integrity precedents: D16 gen-1 contamination corrections; Eventide H910-class framework misattribution — same decrease machinery, different class code.
  - Offline installers on SSL article remain public (not a hard wipe); Download Manager is preferred UX; S3 `data-link` filenames remain the public oracle.

- **Recommendation:**
  Formalize a **retraction track** on freshness re-fetches so discovery bias toward raises cannot leave pulled/split installers in the catalog.

  ## Taxonomy of downward moves (do not conflate)

  | Class | Code | Meaning | Action |
  |---|---|---|---|
  | A. True retraction | `vendor_retract` | Vendor removed/replaced newer public installer/changelog; users get older build today | Accept lower @ manufacturer confidence |
  | B. Dual-platform Mac-current | `mac_current_split` | Mac installer older than Win (or vice versa); catalog tracks Mac-current | Accept Mac-current; record Win in evidence (**Acoustifier**) |
  | C. Identity / contamination | `identity_correct` | Wrong product/gen/framework stamped | Accept correct product version; never label “retraction” |
  | D. Stale third-party | `stale_third_party` | KVR/reseller diverge; manufacturer wins | Prefer manufacturer; no KVR-only decrease |
  | E. False alarm | `false_alarm` | Transient 404, CDN flap, wrong cell, folder≠filename | No write; log watch |

  **Only A and B are retraction-watchlist first-class.** C is integrity correction. D/E are guards.

  ## Detection signals (freshness attaches)

  | # | Signal | How |
  |---|---|---|
  | S1 | Installer URL status change | Prior 200 → 404/410 or redirect to older path |
  | S2 | Filename version regression | Parsed installer filename version **strictly less** than catalog current |
  | S3 | Article/changelog top regression | Oracle top version < catalog (SSL `data-link`, Softube RN, Waves map, PA changelog, …) |
  | S4 | Content-hash changed; prior version string gone; lower present | |
  | S5 | Dual-platform split appears | Mac filename ≠ Win; catalog equals higher without split docs |

  Any one → candidate; two → promote path.

  ## Decision tree

  ```
  on freshness re-fetch for plugin P with current C:
    parse public oracle → candidate V (and Mac/Win if split)

    if V is null and oracle healthy:
        → false_alarm / hub change; do NOT decrease on absence alone
    if V == C:
        → HOLD; refresh verified_at (mandatory)
    if V > C:
        → normal raise path (zero-trust gates)
    if V < C:
        classify:
          identity mismatch? → identity_correct
          Mac/Win split and V==Mac and C==Win → mac_current_split
          installer/article previously showed C now V → vendor_retract
          only KVR shows drop → stale_third_party (no decrease)
          else → open RETRACTION_WATCH for 1–2 chips
    promote decrease only when:
      manufacturer-class evidence (not KVR-only)
      AND identity guards pass (no suite→component, no framework stamp)
      AND (explicit vendor text OR filename on official CDN/support article)
  ```

  ## Acoustifier watch → promote protocol

  1. **Chip N:** Detect Mac < catalog; Win == catalog. Store watch `{plugin_id, catalog, mac, win, article_updated_at}`. **No DB decrease yet.**
  2. **Chip N+1..N+2:** Re-fetch. Unchanged → keep watch (max 3 chips / ~36h on 12h cadence, or 3 daily sweeps).
  3. **Resolve when:** vendor documents split **OR** Mac installer remains lower across watch window and Mac is tracked platform → promote Mac version with `confidence_reasons` including `mac-current-dual-platform` or `vendor-retract`.
  4. **Abort when:** Mac catches up, or oracle unhealthy (429/tool failure) — **never decrease on fetch failure**.

  **Live fixture (2026-09-24):** explicit cell text already documents the split → promote/hold Mac **1.0.18** immediately; Win 1.0.19 in evidence only. This is the golden acceptance test.

  ## Observation write shape

  ```text
  status = accepted (new current)
  observed_version = V  # lower
  confidence = 88–95 for manufacturer installer/article
  confidence_reasons = [
    "vendor-retract|mac-current-dual-platform|identity-correct",
    "prior-current=<C>",
    "oracle=<url>",
    "evidence=<filename or quote>"
  ]
  # prior observation → status=superseded
  ```

  ## Watchlist seed (Tier A — highest signal)

  | Vendor | Oracle | Why |
  |---|---|---|
  | **SSL** | Zendesk article JSON `…/4849510029085.json` — `data-link` filenames | Acoustifier precedent; label-vs-filename class |
  | Native Instruments | Access installer binary HEAD | Binary replace = pullback |
  | Softube | Central CDN + RN index | Manager + RN; scope guards |
  | FabFilter / u-he / Cytomic | Direct download filenames | Filename = version culture |
  | D16 | History / Compatibility + CDN | Gen contamination vs true retract |
  | Kilohearts / Goodhertz | Shared installer lines | Family version |
  | Valhalla | Product page Current Version | Obvious regression |
  | Plugin Alliance | Per-product Changelog top | Top entry drop = retract or edit |
  | Sonnox | Installers CSV | Exact table |
  | iZotope | Portal/RN (current products only) | Legacy freeze separate |

  Tier B: any playbook that records Mac≠Win — auto-open watch; higher does not win by default.  
  Tier C (identity_correct hotspots, separate UI): Eventide H910-class, D16 gen, Softube UAD-* vs native, Arturia Play vs full.

  ## False-positive guards (mandatory)

  1. No decrease on fetch failure (429, browser tool_failure, empty body).
  2. No decrease on KVR-only drop.
  3. Filename over folder name (SSL `X-Comp v6.6.7` folder holding `v6.8.2` installers).
  4. Filename over stale table label (SSL AutoEQ/AutoDYN/AutoBUS).
  5. No suite→component stamp when suite version appears lower (**Softube 2.6.42 trap** — cross-link).
  6. No host-player stamp (Kontakt ≠ instrument).
  7. Malformed cells (SSL “360 Link” Mac `data-link` literal bug) → ignore cell.
  8. Localized stale snippets (NI ES/ZH) — re-fetch live EN before decrease.
  9. Discontinued freeze — do not “retract” Exponential Audio-class frozen rows.
  10. Semver ties / scheme changes — refuse without human-readable vendor note in evidence.

  ## Storage (minimal)

  Preferred: JSONL `catalog-store/data/retraction_watch.jsonl` (not exported to app):

  ```json
  {"plugin_id":"ssl--ssl-acoustifier","opened_at":"2026-09-19T00:00:00Z","catalog":"1.0.19","candidate":"1.0.18","class":"mac_current_split","oracle":"https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-Plug-in-Downloads","article_updated_at":"2026-09-22T08:57:30Z","chips_seen":1,"status":"open"}
  ```

  ## KPIs

  | KPI | Target |
  |---|---|
  | Open retraction watches | Prefer <10 |
  | Mean time-to-resolve | ≤ 3 daily sweeps |
  | Decreases without manufacturer evidence | **0** |
  | False decreases reverted within 7d | **0** |

- **If accepted, what changes in the engine:**
  - Freshness chip hook after every manufacturer parse: open/bump watch or accept decrease.
  - `playbooks/ssl.md` addendum: article `updated_at` → re-parse trigger; diff all `data-link` vs catalog; dual-platform explicit label ⇒ raise Mac-current immediately.
  - Dashboard: open watches + age; decreases last 7/30d by class; alert watch age > 3 cycles.
  - Meter Pro remains hub-walled / unversioned — out of retraction scope.
  - Coordinator re-verifies every decrease (same as raises).

- **Expected impact:**
  - Prevents Mac users being told “up to date” on Acoustifier 1.0.19 when Mac download is 1.0.18.
  - Generalizes to PA changelog top drops, Softube scoped RN, FabFilter filename regressions.
  - Closes the discovery-era “only raises” integrity hole without Luke in the loop.

- **Risks / caveats:**
  - Over-eager decreases on CDN flaps — mitigated by consecutive-confirm + manufacturer-only rule.
  - Misclassifying identity_correct as vendor_retract pollutes metrics — keep separate checklist/UI.
  - Softube suite vs SKU anti-pattern can look like “decrease” if suite number stamped onto products — guard #5 + Softube deep suggestion.
  - Win-only newer builds are real; never silently drop Win evidence.

- **Suggested first step:**
  Encode Acoustifier as a golden fixture test (Mac 1.0.18 / Win 1.0.19 / catalog 1.0.19 → `mac_current_split` → accept 1.0.18). Wire SSL Zendesk JSON re-parse into next freshness sweep without writing decreases until Muse reviews the first watch JSONL.

- **New evidence since last verdict:**
  Verdicts empty; **live 2026-09-24 cell text + Mac/Win installer URLs** confirm the dual-platform policy. Deepens prior suggestion with full signal tree + guards from `advisory-deep/integrity/RETRACTION.md` + `novel/SSL-ACOUSTIFIER-FIXTURE.md`.
