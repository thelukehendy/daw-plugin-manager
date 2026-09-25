# Softube Central sc3 electron-builder YAML — hub_app tip (not plugins)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Softube Central tip is machine-readable via electron-builder YAML under `sc3/`, but Homebrew livecheck and root `latest-mac.yml` still advertise the stale Central **2** channel. Wave-2 combined novel file flagged this; this chip deepens the **canonical feed, trap matrix, and hub_app-only write path**. Complements `2026-09-25-softube-rn-suite-vs-sku-deep.md` (plugin RN) and `2026-09-25-novel-oracles-softube-antares-oeksound-deep.md` (thin overview).
- **Context / evidence:**
  - Dig source: `/workspace/advisory-deep/novel/REPORT.md` §2 + `notes/softube-electron-builder-feeds.txt` + `SOFTUBE-SUITE-TRAP.md`.
  - **LIVE-FETCH 2026-09-24 PT (this pack):**

  | Feed | HTTP | Quote |
  |---|---|---|
  | `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/sc3/latest-mac.yml` | 200 | `version: 3.0.5` · `path: Softube Central-3.0.5-universal-mac.zip` · `releaseDate: '2026-06-24T09:04:22.713Z'` |
  | `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/sc3/latest.yml` | 200 | `version: 3.0.5` · `path: Softube Central Setup 3.0.5.exe` · `releaseDate: '2026-06-24T09:02:24.585Z'` |
  | **TRAP** root `…/softubecentral/latest-mac.yml` (no `sc3/`) | 200 | `version: 2.2.0` · `releaseDate: '2026-04-15T12:37:23.931Z'` — **Central 2 channel** |
  | Root Win `…/softubecentral/latest.yml` | 200 | `version: 3.0.0` — also **behind** sc3 3.0.5 |
  | Homebrew cask livecheck → root Mac YAML | — | formulae still report `"version":"2.2.0"` |

  - Known Issues HTML fallback (still valid): `https://www.softube.com/us/support/known-issues/softube-central-3-known-issues` links same 3.0.5 CDN binaries.
  - Softube plugin RN index tip **2.6.42** is suite/framework — **never** stamp onto plugins from suite RN (existing suite-vs-SKU deep). Central YAML is **orthogonal** to plugin versions.

- **Recommendation:**
  Ship chip **`softube-central-sc3-yaml-v1`**:

  1. Weekly GET `sc3/latest-mac.yml` + `sc3/latest.yml` (browser UA, 15s timeout).
  2. Parse YAML `version:` (prefer PyYAML / ruamel; regex `^version:\s*['\"]?([0-9.]+)` acceptable).
  3. Require Mac and Win tip **equal** before green raise; if split, amber + alert (do not pick higher blindly).
  4. Write observation **only** to Softube Central **hub_app** / portal row (`identity_kind` hub_app / manager).
  5. **Blocklist** as tip sources: root `…/softubecentral/latest-mac.yml`, root `latest.yml`, `formulae.brew.sh/api/cask/softube-central.json`, any non-`sc3/` path.
  6. Optional corroboration: HEAD CDN `Softube%20Central-3.0.5-universal.pkg` / Setup exe; Known Issues HTML if YAML 404.
  7. On hold (same 3.0.5): still bump `verified_at` (freshness SLA).

  Acceptance canary: assert live tip `3.0.5` and assert brew/root Mac would incorrectly yield `2.2.0` — test must **fail** if chip ever reads root.

- **If accepted, what changes in the engine:**
  - Softube Central playbook source flips to `sc3/*.yml` (confidence **95**).
  - Unit fixture: golden sc3 bodies + golden trap bodies under tests.
  - Dashboard/alert if chip ever observes tip from non-sc3 URL.
  - No change to Softube **plugin** rows from this chip.

- **Expected impact:**
  MED-HIGH for Central hub_app freshness; prevents catastrophic **3.0.5 → 2.2.0** Homebrew regression. Zero new plugin greens (correct — plugins stay Central-walled / scoped-RN).

- **Risks / caveats:**
  - Softube may rename `sc3/` → `sc4/` on Central 4 — monitor Known Issues + 404 on sc3; fall back HTML before inventing path.
  - YAML sha512/size fields are integrity for downloaders, not version SoT — ignore for catalog tip.
  - Do not confuse Central `3.0.5` with suite RN `2.6.x`.

- **Suggested first step:**
  One-shot curl both sc3 feeds + root Mac; land chip with hard blocklist; canary in CI against committed trap fixtures.

- **New evidence since last verdict:**
  Live-fetched sc3 3.0.5 + root 2.2.0 / Win root 3.0.0 on 2026-09-24 PT; chip id `softube-central-sc3-yaml-v1`; hub_app-only write rule explicit.
