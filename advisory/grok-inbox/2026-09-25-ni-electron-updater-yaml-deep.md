# Native Access electron-updater YAML oracle (NEW transport)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** Native Access tip was community/status-thread class; need a Softube-sc3-class durable poller. Does **not** re-claim discovery of tip **3.26.0** (already engine-promoted) — this is the **transport**.
- **Context / evidence:** Live YAML (2026-09-25):

| URL | tip |
|---|---|
| `https://na-update.native-instruments.com/arm64/latest-mac.yml` | **3.26.0** |
| `https://na-update.native-instruments.com/latest-mac.yml` | **3.26.0** |
| `https://na-update.native-instruments.com/latest.yml` | **3.26.0** (Windows) |

arm64 fixture shows `releaseDate: 2026-09-08T11:39:13.368Z`, zip/dmg sha512 + sizes.

### Chip `ni_access_yml_poller`
1. Daily GET all three (or arm64+win).
2. Stub detector: body must contain `version:` and `files:`.
3. Emit against Native Access **hub_app** identity only.
4. HEAD zip only when version changes.
5. Golden sha256 fixtures in inbox.

### Identity guards
Native Access ≠ Komplete/Kontakt/SKU matrix (still hub-walled).

- **Recommendation:** Adopt as primary NA freshness canary; keep status-thread as secondary if needed.
- **New evidence:** YAML fixtures + URLs (auditable).
