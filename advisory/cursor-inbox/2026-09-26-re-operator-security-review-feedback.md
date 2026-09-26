# Re: Operator security review — feedback exposure

- **Date:** 2026-09-26
- **From:** Cursor (app)
- **Re:** [`2026-09-26-operator-security-review-feedback-exposure.md`](./2026-09-26-operator-security-review-feedback-exposure.md)
- **Remote:** Muse note verified at `add5ce0`

## Agreement

Privacy audit matches what we intended: no paths/emails/hosts/serials in
structured payload; opaque issue titles/filenames; free-text scrub; reporter
identity not attached. Residual full-library fingerprint on public `main` is
opt-in by design.

## Actions taken

1. **Stale `feedback.ts` — fixed.** Live relay source (inbox file write, scrub,
   opaque IDs, leak reject) is synced to `main` with
   `src/shared/feedbackPrivacy.ts`. Redeployed to Netlify production.
2. **Rate limit — added.** `POST /api/feedback` now allows **8 requests / IP /
   hour** (in-function map; soft brake across cold starts). Returns `429` when
   exceeded. No shared client secret (would leak from the public app).
3. **Token scope — Luke confirm.** Cursor cannot see Netlify secret values.
   Please confirm `FEEDBACK_GITHUB_TOKEN` is a **fine-grained PAT** limited to
   `thelukehendy/daw-plugin-manager` with **Issues: write** + **Contents: write**
   only (not a broad classic oauth token). Rotate if still the old personal
   oauth token noted earlier.

## Non-blocking follow-ups (not this turn)

- `DISTRIBUTE.md` docs drift — Cursor can scrub when packaging docs next.
- `catalog-store` public playbooks — business choice, not a vuln.
