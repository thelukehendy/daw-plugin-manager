# Novel oracles — Softube Central sc3 / Antares RN API / oeksound changelogs

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Novel dig beyond hub-walled Tier-1 assault — machine-readable Softube Central tip, Antares Zendesk section enum, oeksound per-product changelogs. Complements Softube suite-vs-SKU deep and Slate/UA hub files.
- **Context / evidence:**
  - Source: `/workspace/advisory-deep/novel/REPORT.md`, `notes/softube-electron-builder-feeds.txt`, `notes/antares-rn-article-map.tsv` (under novel), oeksound changelog URLs.
  - **Softube Central electron-builder (NEW):**
    - `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/sc3/latest-mac.yml` → **`version: 3.0.5`** / `Softube Central-3.0.5-universal-mac.zip` / releaseDate 2026-06-24
    - `…/sc3/latest.yml` → Win **3.0.5**
    - **TRAP:** root `…/softubecentral/latest-mac.yml` (no `sc3/`) + Homebrew cask → **`2.2.0`** stale Central 2 channel. Root Win `latest.yml` can lag at 3.0.0. **Never tip from brew/root Mac YAML.**
  - Softube plugin RN index still **2.6.42** with named FIXED products only — suite≠SKU (existing deep).
  - **Antares:** Zendesk section JSON → **28 RN articles**; AutoTune 2026 RN tip heading **`AutoTune 2026 (1.2.1)`** (then 1.2.0, 1.1.0, 1.0.0). Article map TSV for standing ID enum + AVOX rename map.
  - **oeksound (curl OK):**
    | URL | Tip |
    |---|---|
    | https://oeksound.com/changelog/soothe2/ | **1.3.3** / May 15, 2025 |
    | https://oeksound.com/changelog/soothe3/ | **1.0.5** / June 29, 2026 |
    | https://oeksound.com/changelog/spiff/ | **1.4.4** / May 15, 2025 |
    | https://oeksound.com/changelog/bloom/ | **1.1.3** / Nov 4, 2025 |
  - Bonus context (implement elsewhere): SSL Plug-in Downloads still public; Slate Hub RN **2.19.0** hub-only (see slate-vmr deep).

- **Recommendation:**
  1. Chip **`softube-central-sc3-yml-v1`**: weekly GET `sc3/latest-mac.yml` + `sc3/latest.yml`; parse `version:`; write Softube Central **app** row only. Blocklist brew + non-sc3 root Mac YAML.
  2. Chip **`antares-section-rn-v1`**: poll section articles JSON; maintain allowlist from TSV; parse AutoTune 2026 / portfolio headings; apply per matched product (rename-aware).
  3. Chip **`oeksound-changelog-v1`**: four slug GETs; newest `<h3>x.y.z</h3>` + “Released on …”; one tip per product. `/downloads/` is soothe-tab-only — not multi-product SoT.

- **If accepted, what changes in the engine:**
  - Softube Central observation source flips to sc3 YAML (confidence ~95).
  - Antares worker uses section API + article map instead of blind search.
  - oeksound tips refresh from changelogs (may already be partial in playbook — bump tips).

- **Expected impact:**
  MED-HIGH for Softube Central + Autotune 2026 freshness; LOW-MED for oeksound confirmation. Prevents Homebrew **2.2.0 regression** of Central.

- **Risks / caveats:**
  CDN path changes if Softube renames sc3 → monitor Known Issues HTML fallback. Antares rename map must stay current. oeksound dates span 2025–2026 — low churn OK.

- **Suggested first step:**
  Canary parse sc3 YAML → assert `3.0.5` and refuse brew `2.2.0`; unit-test AutoTune 2026 `1.2.1` heading; snapshot four oeksound tips.

- **New evidence since last verdict:**
  novel REPORT ranked finds; sc3 YAML quotes; Antares 28-article map + 1.2.1; oeksound four tips live.
