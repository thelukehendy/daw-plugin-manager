# cytomic

## Version chip new-mfrs-1 (2026-09-10 ~1:05 AM PT)
- Method: Homepage publishes trial/full installer filenames with embedded semver (TheGlue_v1.9.3_Mac.dmg etc).
- Primary URLs: https://cytomic.com/, https://cytomic.com/plug-ins/
- Extract: Direct datacenter curl may hit SquidGuard captcha — use browser/WebFetch egress. Filenames The{Glue,Drop,Scream}_vX.Y.Z_{Mac,Win}.*
- Success: High — 3/3 accepted @92 via homepage installer filenames.
- hub_walled: 0

## Maintenance re-check (2026-09-18)
- CHEAP recipe (verified): plain curl of https://cytomic.com/ homepage HTML + grep `The[A-Za-z]*_v[0-9.]*` returns TheGlue_v1.9.3, TheDrop_v1.10.5, TheScream_v1.3.3 — no SquidGuard captcha from datacenter egress on this endpoint, no browser fetch needed. Diff on every 12h pass.
- Search snippets for Cytomic versions are stale/weak third-party only — ignore.
