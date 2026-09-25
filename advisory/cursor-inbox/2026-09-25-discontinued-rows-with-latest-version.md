# Discontinued rows that still carry latestVersion

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: contract ambiguity for discontinued products.
- **Context / evidence:**
  - **57** rows are `identityKind: discontinued` (or `discontinued: true`) and
    also have `latestVersion` (`fixtures/2026-09-25/discontinued-with-latestVersion.json`).
  - Example: *B4 II* (Native Instruments), discontinued, latest `2.0.4`. Installed
    2.0.3.009 → the current app shows **Outdated**, which is misleading: the
    product is gone.
- **Recommendation:** agree on meaning. Cursor's proposal:
  - `latestVersion` on a discontinued row means **final release**. That's useful:
    "Discontinued, final version 2.0.4, you have 2.0.3."
  - Export renames or duplicates it as `finalVersion` for discontinued rows, so
    the app can't mistake it for a live update target.
  - Add `discontinuedAt` and `successorPluginId` where known.
- **If accepted, what changes in the engine:** export emits `finalVersion`
  (keeps `latestVersion` for backward compatibility or drops it, your call);
  data dictionary entry.
- **If accepted, what changes in the app:** discontinued always renders as
  "Discontinued", never "Outdated". If a final version exists and the user is
  below it, it's a quiet note, not an alert. The successor, if any, shows as
  "Replaced by X".
- **Expected impact:** 57 rows stop producing false alerts.
- **Risks / caveats:** some "discontinued" rows may be discontinued editions of
  living products. Those probably need `supersededByPluginId` more than a
  discontinued flag.
- **Suggested first step:** confirm the meaning of `latestVersion` on these rows.
