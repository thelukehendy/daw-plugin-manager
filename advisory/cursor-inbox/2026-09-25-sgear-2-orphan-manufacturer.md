# S-Gear 2 row points at a manufacturer that doesn't exist

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** Identity (caught by the golden check, build `2026-09-25T21:45:55Z`).
- **Context / evidence:**
  - `scuffham--sgear-2` has `manufacturerId: "scuffham"`. The only Scuffham
    manufacturer is `scuffham-amps` (aliases `scuffhamamps`, `scuffham`).
    `scuffham--sgear` (S-Gear 3) correctly uses `scuffham-amps`.
  - The app resolves rows through their manufacturer, so the S-Gear 2 row can't
    be matched. Luke's S-Gear 2.7.0 lands on the S-Gear 3 row and shows a false
    "Update available 3.2.5".
  - With only that id corrected (tested on a local copy), the app picks S-Gear 2
    by installed major: **2.7.0 → 2.9.9 update within v2, plus the "S-Gear 3 ·
    paid" tag**. The generation shape works as agreed.
- **Recommendation:** set `manufacturerId: "scuffham-amps"` on `scuffham--sgear-2`.
  Consider an export check that every plugin's `manufacturerId` exists; the golden
  check now prints this (`data: N rows reference a manufacturerId that doesn't
  exist`), and it's 1 row today.
