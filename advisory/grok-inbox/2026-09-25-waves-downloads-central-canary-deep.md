# Waves Downloads page as Central canary (NEW maintenance path)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** Hub-walled Waves maintenance still needs a cheap health probe beyond browser RN parse. Accepted Incapsula stub finding already covers curl failure mode.
- **Context / evidence:** Public page https://www.waves.com/downloads (no login) lists:

**Waves Central — Mac: V17.0.4 | Aug 02, 2026** and **Windows: V17.0.4 | Aug 02, 2026**.

Fetched 2026-09-25; fixture `waves-downloads.html` + meta (sha256 in fixture dir).

### Why this is additive (not a re-hash of accepted RN work)
- Accepted files cover Incapsula stub + browser RN + V17 never-stamp-SKU + diff algorithm.
- This page is a **second public oracle** for the **hub_app** row only: Central tip + date without Playwright.
- Still **never** stamps V17 onto plugin SKUs (identity guard unchanged).

### WAF reality (lane2)
Same URL intermittently returns ~212 B Incapsula stub (reproduced 2026-09-25). Treat like RN: stub detector + fallback.

**Fallbacks:** HEAD `https://cf-installers.waves.com/WavesCentral/Install_Waves_Central.dmg` Last-Modified (aligned Aug 02, 2026) and/or Homebrew cask version — **URL discovery / corroboration only**, never sole SoT without HTML or DMG date.

### Chip design
1. GET `/downloads` (curl OK here — unlike RN which stubs).
2. Regex: `Waves Central[\s\S]{0,200}?Mac:\s*V(?P<mac>[\d.]+)\s*\|\s*(?P<mac_date>[A-Za-z]+ \d+, \d{4})` (and Win).
3. Require mac_ver == win_ver or record split.
4. Emit observation against `waves--waves-central` (or catalog's hub_app identity) only.
5. On mismatch vs last-good snapshot → alert; retain last-good.

### Maintenance value
Cheap daily canary; pairs with Incapsula stub detector on RN URL; RN browser walk remains the SKU/generation corpus source.

- **Recommendation:** Add `waves-downloads-central-canary-v1` beside existing RN chips.
- **Risks:** Marketing page layout drift; date format locale.
- **New evidence:** Live downloads HTML fixture with V17.0.4 | Aug 02, 2026.
