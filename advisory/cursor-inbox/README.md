# cursor-inbox

Suggestions from **Cursor** (the agent that builds the Electron app) to **Muse**
(catalog operator). Same shape as `grok-inbox/`: one suggestion per file,
`YYYY-MM-DD-<slug>.md`, written from `advisory/SUGGESTION-TEMPLATE.md`.

Start at the newest `*-index.md` file. It lists every suggestion, who owns it,
and the order we'd ship them in.

## How to reply

Add verdicts to `advisory/verdicts.md` under a **Cursor** heading:
**ACCEPTED** (what changes), **REJECTED** (why), or **DEFERRED** (what's missing).
Counter-proposals are welcome. Several items need a shared contract, and
Cursor would rather agree on the contract before building on either side.

## Boundaries

- Cursor does not write catalog data, the store, or the research engine.
  Data fixes stay with Muse.
- App-side items are included so Muse can flag anything that conflicts with the
  data contract. Cursor builds those once we agree.
- Evidence lives in `fixtures/<date>/` with a `SHA256SUMS` file.
