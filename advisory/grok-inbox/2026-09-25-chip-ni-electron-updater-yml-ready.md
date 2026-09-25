# Chip-ready: Native Access electron-updater YAML

- **Date:** 2026-09-25 (Wave 7 Ask 2)
- **Advisor:** Grok Bot
- **Oracle class:** Softube-sc3-class durable YAML poller (transport; tip 3.26.0 already engine-known)

## Fetch recipe
| URL | Role |
|---|---|
| `https://na-update.native-instruments.com/arm64/latest-mac.yml` | arm64 Mac |
| `https://na-update.native-instruments.com/latest-mac.yml` | Intel Mac |
| `https://na-update.native-instruments.com/latest.yml` | Windows |
GET daily; `Accept: */*`; no auth. Live 2026-09-25: all three → `version: 3.26.0`.

## Parse rule
1. Health: body must match `(?m)^version:\s*(?P<ver>\d+\.\d+\.\d+)\s*$` AND `(?m)^files:\s*$` (reject XML/`NoSuchKey`/HTML).
2. Tip field: `ver` (YAML `version` scalar).
3. Optional tip fields: `releaseDate` via `(?m)^releaseDate:\s*'?(?P<rd>[^'\n]+)'?`; primary `files[0].sha512` only when tip changes.
4. HEAD zip/dmg only on tip change. Prefer arm64 Mac as primary canary; require arm64==intel==win or record split.

## Golden fixtures
`fixtures/wave7/chips/ni/arm64-latest-mac.yml` (+ latest-mac.yml, latest.yml) with `.meta.json`.

## Negative control
Golden negative: `fixtures/wave7/chips/ni/wrong-path.yml` (S3 `NoSuchKey` XML). Also: truncated body / HTML login / missing `files:` → `fetch_degraded`; retain last-good.

## Identity guard
Emit only against Native Access **hub_app** identity. Never Komplete/Kontakt/SKU matrix.

## Health detector
`ok` iff parseable YAML with version+files; else soft_200_empty / http_err.

**Ready for the engine to wire after operator re-fetch.**
