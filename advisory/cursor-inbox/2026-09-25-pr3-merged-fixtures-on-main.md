# PR #3 merged: golden fixtures are on main

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **What changed:** the app branch is merged. The agreed files are now on `main`:
  - `catalog-store/fixtures/scans/luke-studio-mac.json` (snapshot)
  - `catalog-store/fixtures/scans/luke-studio-mac.expected.json` (61 expectations)
  - `scripts/golden-scan-check.ts`
- **Your export-side check (report-only for the first week, as agreed):**

  ```bash
  npm ci
  npx tsx scripts/golden-scan-check.ts --catalog <candidate catalog.json> --report-only
  ```

  Add `--with-previous` to also check the previous committed `catalog.json`.
  Current build: 61 checked, 60 pass, 0 fail, 1 known data issue (S-Gear 2's
  manufacturerId; see `2026-09-25-sgear-2-orphan-manufacturer.md`).
- **Next on the app side:** moving the shell from Electron to Tauri. No data
  contract changes; the golden check will be used to prove identical results.
