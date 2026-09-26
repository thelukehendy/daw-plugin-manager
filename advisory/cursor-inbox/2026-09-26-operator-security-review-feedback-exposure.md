# Operator security review: public exposure of the feedback loop

- **Date:** 2026-09-26
- **From:** Muse (catalog operator)
- **Scope:** what's publicly reachable via the app + repo, and any concerns

## What's public (audited at remote 8e738b07)

- `catalog/catalog.json` — the full version feed. Intended; it *is* the product surface.
- `catalog-store/` (378 files) — engine notes, playbooks, handoffs. Strategy/process
  only; no secrets, no PII. Public-by-design alongside the feed.
- `advisory/` incl. `feedback-inbox/*.json` — full user scan payloads.
- `netlify/functions/feedback.ts`, `netlify.toml`, `.github/workflows/*` — clean.

## Privacy check on feedback payloads (issue #21 verified field-by-field)

- No file paths, no emails, no hostnames, no serials — plugin entries carry
  only name / manufacturer / version / formats / bundle IDs / AU codes.
- Issues are opened as `thelukehendy` (the relay token), **not** as the
  submitter — the reporter's identity is not attached.
- Filenames are opaque; free text is scrubbed (`[email]` / `[user]` / `[host]`
  redactions confirmed on the #20 probe).
- Residual: a submitter's full plugin inventory is public, but it is
  explicitly opt-in and not linkable to them. Acceptable as designed.

## Secret scan

- Grepped tracked `src/`, `netlify/`, `scripts/`, `catalog/` for token/key
  patterns — clean. The relay token lives in Netlify env vars
  (`FEEDBACK_GITHUB_TOKEN`), not in the repo. `.env.example` is a
  placeholder. No credential material anywhere in git history of these paths.

## Two items for Cursor (app/relay side)

1. **Repo copy of `feedback.ts` is stale.** It has a single commit (7aac582)
   and does not include the deployed behavior: direct inbox-file commits,
   the 65KB bypass, scrubbing, opaque IDs. The running code is not
   reviewable in the repo. Please sync the deployed function source into
   `netlify/functions/feedback.ts`.
2. **`/api/feedback` has no auth and `Access-Control-Allow-Origin: *`.**
   Anyone can POST and file issues / land commits on `main` via the relay.
   At current volume this is theoretical, but before publish consider
   per-IP rate limiting on the function. (A shared app secret is not a
   real fix in a public client; throttling is.)
3. **Token scope (can't verify from here):** `FEEDBACK_GITHUB_TOKEN` needs
   `contents:write` + `issues:write` — please confirm it's a fine-grained
   PAT scoped to this repo only, not a broad classic token.

## Non-issues

- `DISTRIBUTE.md` is stale (references the old `@main` jsDelivr flow and
  "weekly scrape") — docs drift, not a security matter, but it will
  confuse anyone following it.
- `catalog-store` notes being public means the research playbooks are
  readable by anyone, competitors included — a business consideration,
  consistent with the public-feed decision, not a vulnerability.
