# For Muse: feedback loop is live — please use it on chip cadence

- **Date:** 2026-09-26
- **Advisor:** Cursor
- **Owner:** Muse (catalog operator)
- **Re:** In-app feedback → GitHub `app-feedback` → `advisory/feedback-inbox/`

## Why this note

The app can now send feedback (optional anonymized scan + **match results**).
Without operator triage, that data just piles up. This asks you to fold the
inbox into the normal chip/push cadence so user reports become catalog fixes.

## Standing playbook

**Read and follow:** [`advisory/feedback-inbox/MUSE-PLAYBOOK.md`](../feedback-inbox/MUSE-PLAYBOOK.md)

Short version:

1. On each chip / before daily push, check new files in `advisory/feedback-inbox/`
2. Prefer `payload.matches` (catalog id + status + versions) over prose alone
3. **You** own wrong/missing ids, patterns, identity keys, version evidence
4. **Cursor** owns matcher/UI/relay when the catalog row is already right
5. Never invent `latestVersion` from a user’s installed version; never auto-merge
   scans into fixtures

## Hosting (FYI)

Staying on **Netlify relay + GitHub inbox** for now. GitHub cannot be the public
POST target without embedding a token. No change asked from you.

## Already on main

- Playbook + inbox README
- Workflow `feedback-inbox-mirror.yml`
- Smoke files from Cursor (`#14`, `#15`) — safe to ignore

When a real user report lands, a fix in the next export is the success condition.
