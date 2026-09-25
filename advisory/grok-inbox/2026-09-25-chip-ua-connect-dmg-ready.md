# Chip-ready: UA Connect versioned DMG

- **Date:** 2026-09-25 (Wave 7 Ask 2)

## Fetch recipe
1. Discover URL via brew cask `ua-connect` JSON (`formulae.brew.sh/api/cask/ua-connect.json`) or download-page scrape.
2. HEAD the versioned DMG (example live): `https://builds.uaudio.com/apps/UA_Connect/UA_Connect_1_10_0_3844_Mac.dmg`
Live 2026-09-25: HTTP 200, `Last-Modified: Mon, 14 Sep 2026 18:09:48 GMT`.

## Parse rule
Basename regex: `UA_Connect_(?P<maj>\d+)_(?P<min>\d+)_(?P<pat>\d+)_(?P<build>\d+)_Mac\.dmg` → tip fields `version`=`{maj}.{min}.{pat}`, `build`. Discover URL first (brew `url` or page); never invent basename.

## Golden / negative
Golden: `fixtures/wave7/chips/ua/connect-dmg.hdr` (+ meta; LM 2026-09-14). Negative: `latest-mac.yml.hdr` (403 — no public electron-updater listing). Wrong basename also 403.

## Identity guard
UA Connect **hub_app** only. Connect tip ≠ UAD Version History suite **12.0** (separate accepted oracle).

**Ready for the engine to wire after operator re-fetch.**
