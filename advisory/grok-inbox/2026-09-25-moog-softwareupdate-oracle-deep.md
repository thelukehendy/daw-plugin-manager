# Moog public `softwareUpdate` per-SKU oracle (DIGGABLE CLEAR)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** Lane 1 diggable residual includes 9 Moog Music rows with no accepted version (8× MF-*S + Mariana).
- **Context / evidence:** Live public pages under `https://software.moogmusic.com/softwareUpdate/{slug}` return full HTML with download buttons labeled `… All Formats vX.Y.Z` and dated changelog sections. No login required.

### Live tips (fetched 2026-09-25, fixtures under `advisory/grok-inbox/fixtures/wave6/moog/`)

| plugin_id | slug | tip | Mac/Win |
|---|---|---|---|
| `moog-music--mariana` | `mariana` | **1.2.0** | both All Formats v1.2.0 |
| `moog-music--mf-101s` | `mf-101s` | **1.3.0** | both |
| `moog-music--mf-102s` | `mf-102s` | **1.3.0** | both |
| `moog-music--mf-103s` | `mf-103s` | **1.3.0** | both |
| `moog-music--mf-104s` | `mf-104s` | **1.3.0** | both |
| `moog-music--mf-105s` | `mf-105s` | **1.3.0** | both |
| `moog-music--mf-107s` | `mf-107s` | **1.3.0** | both |
| `moog-music--mf-108s` | `mf-108s` | **1.3.0** | both |
| `moog-music--mf-109s` | `mf-109s` | **1.3.0** | both |

URL pattern is stable and predictable from plugin slug (`mf-101s` …). Soft-404 / wrong slug still returns ~15KB shell — treat missing `All Formats v` button as fetch failure (same class as Waves Incapsula stub detector).

### Parser chip (maintenance path)

1. GET each of 9 URLs (cadence: weekly or on freshness SLA).
2. Extract `All Formats v(?P<ver>\d+\.\d+\.\d+)` from button labels; prefer Mac button if present, else first.
3. Require Mac == Win or apply Mac-current policy if they diverge.
4. Evidence: URL + button text + optional changelog H2 tip.
5. Confidence: manufacturer dated page → green candidate after Muse first-hand re-fetch (≥85).
6. Golden fixtures: committed HTML + `.meta.json` sha256.

### Identity / guards

- Never invent MF-106S (gap in Moog numbering — not in diggable list).
- Mariana tip train is independent of Minifooger 1.3.0 — do not cross-stamp.
- Store page `software.moogmusic.com/store/*` is commerce; oracle is `/softwareUpdate/*`.

### Diggable debt impact

Clears **9/113** open_pending rows with a durable public oracle (not hub-walled).

- **Recommendation:** Chip `moog-softwareupdate-walk-v1`; promote 9 tips after Muse re-fetch; add playbook row under Moog.
- **If accepted, what changes:** New manufacturer recipe; diggable KPI −9; weekly poller 9 URLs.
- **Risks:** Soft-200 empty shells; future slug rename; iOS-only notes on Mariana must not override desktop tip.
- **Suggested first step:** Muse re-fetch all 9; compare fixtures; raise @≥85 with extract_method `moog-softwareupdate-button`.
- **New evidence:** Public URLs + fixtures (auditable in-repo).
