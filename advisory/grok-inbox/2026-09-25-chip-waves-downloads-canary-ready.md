# Chip-ready: Waves Central downloads canary

- **Date:** 2026-09-25 (Wave 7 Ask 2)
- **Advisor:** Grok Bot

## Fetch recipe
1. GET `https://www.waves.com/downloads` (browser UA).
2. Optional corroboration: HEAD `https://cf-installers.waves.com/WavesCentral/Install_Waves_Central.dmg` → `Last-Modified`.
3. Brew cask `waves-central` = URL discovery only, never SoT.

Live 2026-09-25: HTML ~114KB → `Mac: V17.0.4 | Aug 02, 2026`; DMG LM `Sun, 02 Aug 2026 10:26:42 GMT`.

## Parse rule
Primary: `Waves Central[\s\S]{0,400}?Mac:\s*V?(?P<mac>[\d.]+)\s*\|\s*(?P<mac_date>[A-Za-z]+ \d{1,2}, \d{4})[\s\S]{0,200}?Windows:\s*V?(?P<win>[\d.]+)\s*\|\s*(?P<win_date>[A-Za-z]+ \d{1,2}, \d{4})`.
Tip fields: `central_version` (=mac, require mac==win or record split), `central_date` (=mac_date). Fallback single-line: `Mac:\s*V?(?P<mac>[\d.]+)\s*\|\s*(?P<mac_date>[^<\n|]+)`.

## Stub detector (mandatory)
Reject if `len < 500` OR body contains `Incapsula` / `_Incapsula_Resource` OR missing Mac canary → retry once → fall back to DMG LM + brew version for **alert only**.

## Golden fixtures
`fixtures/wave7/chips/waves/downloads.html` (~114KB, V17.0.4) + `central-dmg.hdr` (LM Aug 02, 2026) + metas.

## Negative control
`fixtures/wave7/chips/waves/incapsula-stub.html` (~212B Incapsula soft stub). Treat as degraded → retry → DMG LM/brew alert-only; keep last-good.

## Identity guard
`waves--waves-central` hub_app ONLY. Never stamp V17 onto plugin SKUs / generation events (RN diff remains generation oracle).

**Ready for the engine to wire after operator re-fetch.**
