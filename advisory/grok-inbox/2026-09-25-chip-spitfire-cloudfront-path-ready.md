# Chip-ready: Spitfire Audio CloudFront path semver

- **Date:** 2026-09-25 (Wave 7 Ask 2)

## Fetch recipe
1. Discover DMG URL via brew cask `spitfire-audio` (`formulae.brew.sh/api/cask/spitfire-audio.json`).
2. Parse semver from path; HEAD for liveness.
Live: `https://d1t3zg51rvnesz.cloudfront.net/p/files/lm/1770184800/mac/SpitfireAudio.Mac-3.4.17.dmg` → tip **3.4.17**, HTTP 200.

## Parse rule
Path/basename: `SpitfireAudio\.Mac-(?P<ver>\d+\.\d+\.\d+)\.dmg` → tip field `ver`. Brew `version` may be `3.4.17,1770184800` — take `(?P<ver>\d+\.\d+\.\d+)(?:,(?P<epoch>\d+))?`. HEAD discovered URL for liveness; on 403 rediscover via brew (signed/path expiry).

## Golden / negative
`fixtures/wave7/chips/spitfire/brew-spitfire-audio.json`, `dmg.hdr`, `dmg.url.txt` (+ metas). Negative: `wrong-semver.hdr` (Mac-0.0.0 → 403).

## Identity guard
Spitfire Audio **app** hub_app only. Never library/soundset greens from app tip.

**Ready for the engine to wire after operator re-fetch.**
