# Deterministic identity keys (bundle IDs / AU component codes)

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: identity resolution between installed plugins and catalog rows.
- **Context / evidence:**
  - Every catalog row has `matchPatterns`, which are display names only. No row
    carries a machine identifier.
  - **276** match patterns are shared across different manufacturers, including
    generic words: `reverb`, `compressor`, `eq`, `chorus`, `flanger`, `limiter`,
    `gate`, `tape`, `delay`, `strings`, `drums`
    (`fixtures/2026-09-25/shared-match-patterns.json`).
  - **778** patterns are 5 characters or fewer (`air`, `amb`, `adt`, `1178`…).
  - The app's scanner already reads each plugin's `Info.plist`: `CFBundleIdentifier`,
    `CFBundleShortVersionString`, and for AUs the `AudioComponents`
    manufacturer/type/subtype codes. These identifiers are unique per product
    and don't depend on display names.
  - Real result: 7 Lindell Audio plugins and Reason Rack matched Steinberg rows
    (see `2026-09-25-misattributed-rows-lindell-reason.md`).
- **Recommendation:** Add optional identity fields to plugin rows:

  ```json
  "identityKeys": {
    "bundleIds": ["com.fabfilter.Pro-Q.4", "com.fabfilter.Pro-Q.AU.4"],
    "bundleIdPrefixes": ["com.fabfilter.Pro-Q"],
    "auComponents": [{ "manufacturer": "FabF", "subtype": "FQ4p" }]
  }
  ```

  - All fields optional; omitted means unresearched (same rule as elsewhere).
  - `bundleIdPrefixes` covers vendors that append format or version suffixes.
  - Manufacturer rows could carry `bundleIdVendorPrefixes` (e.g. `com.lindell`,
    `com.plugin-alliance`) and a 4-character AU manufacturer code. That alone
    would fix wrong-vendor matches, even before per-plugin keys exist.
- **If accepted, what changes in the engine:** export adds `identityKeys`. Sources,
  in order of trust: vendor-published IDs, installer receipts/pkg manifests,
  opt-in user scan submissions (see index, question 4). `DATA-DICTIONARY.md` gets
  the field.
- **If accepted, what changes in the app:** match order becomes (1) exact bundle
  ID, (2) AU component, (3) bundle prefix plus manufacturer, (4) name pattern
  **with** manufacturer agreement, (5) no match, meaning "Check portal". The app
  never guesses across vendors.
- **Expected impact:** removes the wrong-vendor matches entirely. Removes most
  generation mix-ups (Session vs Session 2 have different bundle IDs). Makes
  matching near-instant.
- **Risks / caveats:** coverage starts near zero, so name matching stays as the
  fallback for a long time. Some vendors reuse one bundle ID across major
  versions; `generation` still matters.
- **Suggested first step:** manufacturer-level `bundleIdVendorPrefixes` for tier-1
  vendors. Cheap, and it fixes the worst class of error.
