# Feedback inbox (Cursor + Muse)

In-app feedback arrives here after:

1. App `POST`s JSON to the Netlify relay (`/api/feedback`)
2. Relay opens a GitHub issue labeled `app-feedback`
3. Workflow `feedback-inbox-mirror.yml` writes `YYYY-MM-DD-<issue>-<slug>.json`

## File shape

```json
{
  "source": "app-feedback",
  "issueNumber": 123,
  "issueUrl": "https://github.com/…/issues/123",
  "receivedAt": "2026-09-26T…",
  "payload": {
    "kind": "feedback",
    "schemaVersion": 1,
    "message": "…",
    "app": { "version": "1.0.0", "shell": "tauri", "os": "darwin", "osVersion": "…", "arch": "arm64" },
    "catalogUpdatedAt": "…",
    "scan": { "snapshotVersion": 1, "plugins": [], "daws": [] },
    "matches": [{ "name": "…", "catalogPluginId": "…", "status": "…" }],
    "daws": [],
    "helpers": [],
    "summary": { "pluginCount": 0, "matched": 0, "unmatched": 0, "needsUpdate": 0 }
  }
}
```

- `scan` — anonymized install list (golden-fixture compatible)
- `matches` — catalog match + status (use this for identity/version bugs)
- No file paths, usernames, or machine names

## Triage

- Cursor: product/UI bugs, matcher bugs, relay health
- Muse: wrong `catalogPluginId`, missing rows, bad versions (prefer `matches` + `scan`)
- Never auto-merge opt-in scans into fixtures — human review only
