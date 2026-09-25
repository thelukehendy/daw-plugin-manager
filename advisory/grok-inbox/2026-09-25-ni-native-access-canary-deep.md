# NI Native Access canary — hub_app 3.26.0 (no Komplete matrix grind)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Native Instruments SKUs are Native Access SoT; public surface is Access build + status thread + installer Last-Modified. Full Komplete graph is hub-only — do not grind. Need a tight hub_app canary chip.
- **Context / evidence:**
  - Dig: `/workspace/advisory-deep/hubs/REPORT.md` (rank 6) + raw `ni-access-status.html`, `ni-access-dmg-head.hdr`.
  - **LIVE-FETCH 2026-09-24 PT:**

  | Surface | HTTP | Evidence |
  |---|---|---|
  | Community status thread `https://community.native-instruments.com/discussion/4823/official-update-status-native-access-current-version-3-26-0` | 200 (~1.1 MB) | Title: `Official update status - Native Access (current version: 3.26.0)`; body/meta: **`3.26.0 - 2026-09-10`** |
  | Download landing `https://www.native-instruments.com/pages/native-access` | 200 | CTA links to assets CDN (no reliable semver stamp on page alone) |
  | HEAD `https://assets.native-instruments.com/downloads/Native-Access_2_Mac_M1.dmg` | 200 | **`Last-Modified: Thu, 10 Sep 2026 14:11:52 GMT`** · Content-Length 169761845 |
  | HEAD `https://assets.native-instruments.com/downloads/Native-Access_2.exe` | 200 | **`Last-Modified: Thu, 10 Sep 2026 14:32:01 GMT`** · Content-Length 179877344 |

  - Also available: `Native-Access_2_Mac_Intel.dmg` on same CDN prefix.
  - WAVE2-FIXTURES does not pin Access; hubs REPORT quotes Access **3.26.0 / 2026-09-10**.
  - Optional allowlisted product RNs (Maschine “What's new…”) are separate — **out of scope** for this canary.

- **Recommendation:**
  Chip **`ni-native-access-canary-v1`**:

  1. **Primary tip:** scrape status thread for newest `(\d+\.\d+\.\d+)\s*-\s*(\d{4}-\d{2}-\d{2})` near Native Access (today **3.26.0 - 2026-09-10**). Prefer title `current version: x.y.z` as corroboration.
  2. **Corroboration:** weekly HEAD Mac M1 + Win installers; assert Last-Modified day aligns with tip date (timezone: convert UTC → PT for logs). Drift >7d without thread bump → amber alert (CDN cache / thread lag).
  3. Write **only** Native Access **hub_app** row. Confidence **High (~90–95)** when thread + Last-Modified agree.
  4. Cadence: status thread **daily** (cheap HTML); binary HEAD **weekly**.
  5. Hold → bump `verified_at` (Access churn class warm; SLA 3–7d for binary tip per FRESHNESS seed).

  ### DO-NOT-GRIND
  - Native Access login / Native ID tokens / entitlement APIs
  - Service Center local XML as catalog oracle
  - Full Komplete / Kontakt library matrix from web
  - Stamping Access `3.26.0` onto Maschine / Guitar Rig / library SKUs

- **If accepted, what changes in the engine:**
  - NI playbook: Access hub_app oracle = status thread + CDN HEAD.
  - Content packs / libraries stay `hub` / structurally skipped for per-SKU public dig.
  - Fixture: golden thread excerpt `3.26.0 - 2026-09-10` + Last-Modified headers.

- **Expected impact:**
  HIGH for Native Access build freshness; LOW for Komplete SKUs (honest — still hub-walled). Prevents false “NI is diggable” grind.

- **Risks / caveats:**
  - Thread URL may change when version bumps (slug embeds `3-26-0`) — discover via community search `Official update status - Native Access` or landing deep-link; store durable discussion id `4823` if stable.
  - Meta description still mentions older “3.6.0” prose in one sentence — **parse the dated `3.26.0 - 2026-09-10` line / title**, not the stale “currently available software version is 3.6.0” clause.
  - GCS/CDN may rename assets path — fall back to links scraped from `/pages/native-access`.

- **Suggested first step:**
  Canary: GET discussion 4823 → assert tip 3.26.0; HEAD M1 DMG → assert Last-Modified 2026-09-10; write Access hub_app only in dry-run.

- **New evidence since last verdict:**
  Live status thread + live CDN Last-Modified both confirm 2026-09-10 / 3.26.0; chip `ni-native-access-canary-v1`.
