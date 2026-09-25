# Output Help Center oracles — Arcade / Co-Producer / Engines (curl-friendly)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — Output Hub binaries are account-walled, but Help Center RN + Engines version table are public curl-friendly per-product oracles.
- **Context / evidence:**
  - Live verified (2026-09-24→25 PT, REPORT + parent re-verify):
    | Article | HTTP | Size | Tip |
    |---|---:|---:|---|
    | Arcade RN `…/articles/16102145-arcade-release-notes` (also saved `raw/output-arcade-rn.html`) | 200 | ~94 KB | **`Arcade 2.16.1 (Released Aug 4, 2026)`** (page also shows 2.15.0 history) |
    | Co-Producer RN `…/articles/16112647-…` (`raw/output-coproducer-rn.html`) | 200 | ~89 KB | **`Co-Producer 1.6.1`** (+ GUI v1.6.5 / Re-imagine 2.0, Released Sep 16th, 2026) |
    | Engines Latest Versions `…/articles/10297805-Engines-Latest-Versions` (`raw/output-engines-versions.html` / `support.output.com_hc_en-us_articles_10297805-Engines-Latest-Versions.html`) | 200 | ~99 KB | table/list tips below |
  - Engines tips (parsed from saved HTML): Analog Strings **v1.0.1**; Exhale **v1.1.1**; Signal **v1.3.1**; Substance **v1.0.1**; Rev **v1.1.1**; Rev X-Loops **v1.2.0**; Movement **v1.2.1, R268**; Portal **v1.2.1, R282**; Thermal **v1.2.1, R675**.
  - WAVE2-FIXTURES: `arcade: 2.16.1`, `coprod: 1.6.1`.
  - `/appcast.xml` → 404. Ignore unrelated `docs.output.ai` / npm `@outputai/*`. Installers via Output Hub (account).

- **Recommendation:**
  Ship curl-friendly chips:

  | Chip | URL pattern | Parse |
  |---|---|---|
  | `output-arcade-rn-v1` | Arcade RN article | `Arcade\s+(\d+\.\d+\.\d+)\s*\(Released\s+([^)]+)\)` |
  | `output-coprod-rn-v1` | Co-Producer RN | `Co-Producer\s+(\d+\.\d+\.\d+)` (+ optional GUI build) |
  | `output-engines-table-v1` | Engines Latest Versions | lines `Name:\s*v?(\d+\.\d+\.\d+(?:,\s*R\d+)?)` → per-engine SKU |

  Cadence: poll trio **2–3×/week**; set-diff versions; apply only to matching product rows.

- **If accepted, what changes in the engine:**
  - Three Help Center pollers; Engines chip writes one observation per named engine.
  - Arcade/Co-Producer rows get RN tips; Hub login remains DO-NOT-GRIND for binaries/CDN.

- **Expected impact:**
  HIGH for documented Output products without Hub auth. Low cost (~90–100 KB × 3).

- **Risks / caveats:**
  Article IDs are stable today — if Zendesk renumbers, discover via Help Center search and update allowlist. Co-Producer GUI sub-version is not the product tip. Engines “R###” build suffixes should be stored as build metadata when schema allows.

- **Suggested first step:**
  Wire three GETs + fixture asserts Arcade 2.16.1 / Co-Producer 1.6.1 / Movement `1.2.1, R268`.

- **New evidence since last verdict:**
  Live 200s reconfirmed; engines names+versions from saved HTML; WAVE2-FIXTURES tips. If a future fetch 404s, keep REPORT evidence and mark `unverified_live` until restored — do not clear last good.
