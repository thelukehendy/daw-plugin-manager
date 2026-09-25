# oeksound per-product changelogs — confirmed live tips

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** oeksound already in playbook posture; need re-verified tip samples + exact slug recipe so Muse can treat four changelogs as deterministic warm-SLA oracles (control-adjacent). Deepens thin wave-2 novel overview.
- **Context / evidence:**
  - Dig: `/workspace/advisory-deep/novel/REPORT.md` §6 + `raw/oeksound_com_changelog_{soothe2,soothe3,bloom,spiff}.*`.
  - **LIVE-FETCH 2026-09-24 PT (all HTTP 200):**

  | URL | Tip `<h3>` | Released on | Prior tip (sanity) |
  |---|---|---|---|
  | `https://oeksound.com/changelog/soothe2/` | **1.3.3** | May 15, 2025 | 1.3.2 (Oct 16, 2024) |
  | `https://oeksound.com/changelog/soothe3/` | **1.0.5** | June 29, 2026 | 1.0.4 (May 21, 2026) |
  | `https://oeksound.com/changelog/bloom/` | **1.1.3** | November 4, 2025 | 1.1.2 (Oct 6, 2025) |
  | `https://oeksound.com/changelog/spiff/` | **1.4.4** | May 15, 2025 | 1.4.3 (Nov 4, 2024) |

  - Parse shape (live HTML): newest `<h3>x.y.z</h3>` then nearby text `Released on …`. Curl-friendly; no login; no suite stamp risk.
  - `/downloads/` remains soothe-tab-only — **not** a multi-product version oracle (assault finding stands).

- **Recommendation:**
  Chip **`oeksound-changelog-v1`**:

  ```
  ALLOWLIST = soothe2 | soothe3 | bloom | spiff
  for slug in ALLOWLIST:
    GET https://oeksound.com/changelog/{slug}/
    tip = first <h3> matching ^\d+\.\d+\.\d+$
    released = nearby "Released on …"
    write observation → matching catalog product only
  ```

  1. Weekly GET four slugs (parallel OK; polite 1–2s gap).
  2. Confidence **95** when h3 + Released-on both present.
  3. One observation per product row; never cross-stamp (soothe3 tip ≠ soothe2).
  4. Hold → bump `verified_at` (warm SLA **7d** tier-1).
  5. Never derive tip from `/downloads/` tab state or marketing homepage.

- **If accepted, what changes in the engine:**
  - oeksound playbook hardcodes four changelog URLs; golden tips in fixtures (align WAVE2/WAVE3).
  - Freshness class `warm`, SLA 7d; control-group sibling can treat oeksound as optional fifth canary.

- **Expected impact:**
  LOW-MED confirmation / tip bump; high-quality regression canary for “easy green” shape alongside FabFilter/Goodhertz/Valhalla.

- **Risks / caveats:**
  - Low churn (soothe2/spiff still 2025 dates) — holds dominate; still refresh verified_at.
  - New product slug needs allowlist add after review — don’t crawl `/changelog/` index blindly.
  - Date strings are US long-form — normalize to ISO in metadata.

- **Suggested first step:**
  Snapshot four tips into fixture JSON; chip dry-run asserts equality with live table above; enable weekly cron.

- **New evidence since last verdict:**
  Live-fetched h3 tips 1.3.3 / 1.0.5 / 1.1.3 / 1.4.4 with Released-on dates + prior-tip sanity; chip id `oeksound-changelog-v1`.
