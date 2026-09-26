# Backups

Pre-update snapshots of `out/catalog.json`, one dir per weekly run (`<YYYY-MM-DD>/catalog.json` + `manifest.json`).

- Retention: 12 weeks (pruned by the weekly job).
- File contents are gitignored (size); git history is the permanent archive.
- This manifest log is tracked.

## Log

| Date | Bands (G/A/Y) | Commit |
|---|---|---|
| 2026-09-14 | 3399 / 84 / 1510 | `catalog: daily push 2026-09-14` |
| 2026-09-15 | 3527 / 111 / 1511 | `catalog: daily push 2026-09-15` |
| 2026-09-16 | 3713 / 148 / 1544 | `catalog: daily push 2026-09-16` |
| 2026-09-17 | 3865 / 197 / 1525 | `catalog: daily push 2026-09-17` |
| 2026-09-18 | 3959 / 348 / 1344 | `catalog: daily push 2026-09-18` |
| 2026-09-19 | 3959 / 347 / 1345 | `catalog: daily push 2026-09-19` |
| 2026-09-20 | 3959 / 347 / 1345 | `catalog: daily push 2026-09-20` |
| 2026-09-21 | 3959 / 347 / 1345 | `catalog: daily push 2026-09-21` |
| 2026-09-22 | 3959 / 347 / 1345 | `catalog: daily push 2026-09-22` |
| 2026-09-23 | 3958 / 347 / 1346 | `catalog: daily push 2026-09-23` |

- 2026-09-19: pre-push snapshot of out/catalog.json (bands 3959/347/1345, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-19/; manifest committed
- 2026-09-20: pre-push snapshot of out/catalog.json (bands 3959/347/1345, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-20/; manifest committed
- 2026-09-21: pre-push snapshot of out/catalog.json (bands 3959/347/1345, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-21/; manifest committed
- 2026-09-22: pre-push snapshot of out/catalog.json (bands 3959/347/1345, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-22/; manifest committed
- 2026-09-23: pre-push snapshot of out/catalog.json (bands 3959/347/1345, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-23/; manifest committed

| 2026-09-24 | 3958 / 347 / 1346 | `catalog: daily push 2026-09-24` |

- 2026-09-24: pre-push snapshot of out/catalog.json (bands 3958/347/1346, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-24/; manifest committed

| 2026-09-25 | 3958 / 347 / 1346 | `catalog: daily push 2026-09-25` |

- 2026-09-25: pre-push snapshot of out/catalog.json (bands 3958/347/1346, 660 mfrs, 9494 plugins, 5651 accepted) → backups/2026-09-25/; manifest committed

| 2026-09-26 | 3968 / 352 / 1348 | `catalog: daily push 2026-09-26` |

- 2026-09-26: pre-push snapshot of out/catalog.json (bands 3968/352/1348, 664 mfrs, 9506 plugins, 5668 accepted) → backups/2026-09-26/; manifest committed
