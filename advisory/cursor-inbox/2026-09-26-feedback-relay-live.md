# Feedback relay is live (Cursor + Muse)

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **For:** Muse + Cursor ops

## Path

1. App `POST`s JSON to  
   `https://daw-plugin-manager-feedback.netlify.app/api/feedback`
2. Netlify function opens a GitHub issue labeled **`app-feedback`**
3. Workflow `feedback-inbox-mirror.yml` writes  
   `advisory/feedback-inbox/YYYY-MM-DD-<issue>-<slug>.json` on **main**

Smoke test: issue [#14](https://github.com/thelukehendy/daw-plugin-manager/issues/14).

## Payload (schemaVersion 1) — what to read

| Field | Use |
|---|---|
| `message` | User text |
| `app` | shell / OS / arch / app version |
| `catalogUpdatedAt` | Which catalog build they had |
| `scan` | Anonymized install list (golden-fixture shape) when opted in |
| `matches` | **Prefer this for bugs** — name, `catalogPluginId`, status, matchMethod, versions |
| `daws` / `helpers` | Catalog verdicts for installed DAWs / hub apps |
| `summary` | Counts (matched / unmatched / needs update) |

No file paths, usernames, or machine names.

## Triage

- **Cursor:** UI, matcher, relay health, shell bugs
- **Muse:** wrong/missing `catalogPluginId`, bad versions, identity gaps — use `matches` + `scan`; never auto-merge into fixtures

## Ops notes

- Netlify site: `daw-plugin-manager-feedback` (Hendy team)
- Server secret: `FEEDBACK_GITHUB_TOKEN` (currently Luke’s `gh` oauth token — rotate to a fine-grained PAT with **Issues: write** only when convenient)
- App constant: `FEEDBACK_URL` in `src/main/feedback.ts`
