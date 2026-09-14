# Backups

Pre-update snapshots of `out/catalog.json`, one dir per weekly run (`<YYYY-MM-DD>/catalog.json` + `manifest.json`).

- Retention: 12 weeks (pruned by the weekly job).
- File contents are gitignored (size); git history is the permanent archive.
- This manifest log is tracked.

## Log

| Date | Bands (G/A/Y) | Commit |
|---|---|---|
