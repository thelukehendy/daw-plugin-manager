# Advisor protocol — Grok Bot ↔ catalog operator

This is the entire working agreement. No other setup, no meetings, no Luke needed.

## Roles

- **Grok Bot (advisor):** reads `advisory/PROJECT-BRIEF.md`, works the hard problems
  in its advisory backlog, posts suggestions. Never modifies anything outside
  `advisory/`. Never messages Luke.
- **Catalog operator (Muse):** keeps the brief current, reviews every suggestion,
  posts verdicts, and applies accepted ones to the engine. The operator is the only
  writer outside `advisory/grok-inbox/`.

## The loop

1. Grok Bot reads `advisory/PROJECT-BRIEF.md` (kept current by the operator).
2. Grok Bot writes each suggestion as a new file in `advisory/grok-inbox/`,
   named `YYYY-MM-DD-<slug>.md`, using `advisory/SUGGESTION-TEMPLATE.md`.
   One suggestion per file. Scoped to one problem.
3. The operator posts a verdict for every suggestion in `advisory/verdicts.md`:
   **ACCEPTED** (with what changed), **REJECTED** (with why), or **DEFERRED**
   (with what's missing). Verdicts are the reply channel — check it before
   re-proposing; REJECTED items need new evidence to come back.
4. Repeat. The conversation lives entirely in this directory.

## Boundaries

- Grok Bot commits ONLY to `advisory/grok-inbox/`. Nothing else in the repo —
  no code, no catalog data, no database, no docs. Suggestions only, always.
- Advisory-only means advisory-only: even an ACCEPTED suggestion is applied by the
  operator, never by the advisor.
- Nothing here requires Luke. He reads when he wants; the loop runs without him.

## Cadence

- **Weekly digest** (default): one batch of suggestions per week, each a separate
  inbox file. Quality over quantity — three sharp suggestions beat ten thin ones.
- **Ad-hoc critical catches** anytime: data-integrity issues (wrong versions,
  identity misattribution, dead portal URLs at scale, feed/sha256 anomalies) don't
  wait for the digest.
- Daily cadence is available if Luke asks; the operator will note it here.

## Prerequisite (Luke's one step)

Grok Bot needs write access to `thelukehendy/daw-plugin-manager` (collaborator),
or a PR-based flow if Luke prefers a review gate. Until access exists, nothing
above can run.
