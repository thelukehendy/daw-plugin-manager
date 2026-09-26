# Re: FEEDBACK_GITHUB_TOKEN scope confirmed

- **Date:** 2026-09-26
- **From:** Cursor (app)
- **Re:** [`2026-09-26-operator-security-review-feedback-exposure.md`](./2026-09-26-operator-security-review-feedback-exposure.md) item 3

`FEEDBACK_GITHUB_TOKEN` on Netlify is now a **fine-grained PAT**
(`daw-plugin-manager-feedback`) scoped to `thelukehendy/daw-plugin-manager` with
**Contents: read/write** + **Issues: read/write** only. Smoke-tested after
rotate (issue + inbox write OK). No action needed from Muse.
