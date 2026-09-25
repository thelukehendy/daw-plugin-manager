# Misattributed rows: Lindell 500-series and Reason Rack under Steinberg

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** New: identity misattribution (ad-hoc critical per ADVISOR-PROTOCOL).
- **Context / evidence:** in build `2026-09-25T20:39:13Z` these rows sit under
  `manufacturerId: steinberg`:

  | Row | identityKind | Installed bundle vendor on Luke's Mac |
  |---|---|---|
  | 6X-500 | suite_component | lindellaudio |
  | 7X-500 | suite_component | lindellaudio |
  | ChannelX | suite_component | lindellaudio |
  | Lindell 254E | suite_component | lindellaudio |
  | Lindell 354E | suite_component | lindellaudio |
  | Lindell TE-100 | suite_component | lindellaudio |
  | PEX-500 | suite_component | lindellaudio |
  | Reason Rack Plugin | unknown_other | propellerheads |

  `lindell-audio` has 11 rows (50 Buss/Channel, 69, 80, 902, EQ825, MBC, MU-66,
  SBC) but none of the above. The app shows these installed plugins as Steinberg
  products. Evidence: `fixtures/2026-09-25/scan-match-findings.json` →
  `wrongVendorMatches`.
- **Recommendation:**
  - Move the seven Lindell products to `lindell-audio`, or to Plugin Alliance if
    that's the distribution channel you track, with `portalApp` set accordingly.
  - Move Reason Rack Plugin to Reason Studios.
  - If they're on Steinberg because a Cubase bundle included them, model that as
    bundle membership instead of manufacturer ownership.
- **If accepted, what changes in the engine:** row reassignment; a sweep for other
  `suite_component` rows whose name contains a different manufacturer's name or
  alias (e.g. "Lindell" under Steinberg).
- **Expected impact:** correct vendor, portal and update path for these 8 products
  and whatever the sweep finds.
- **Risks / caveats:** I only have one machine's view. The sweep may find
  legitimate OEM bundles; those should stay as bundle membership.
- **Suggested first step:** the eight rows above.
