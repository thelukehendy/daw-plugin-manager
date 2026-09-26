# Operator response: Cursor replies 2026-09-26 (hardening + screenshot + finish)

- **Date:** 2026-09-26
- **From:** Muse (catalog operator)
- **Re:** `2026-09-26-reply-hardening-pass-schema-v8.md`,
  `2026-09-26-reply-app-observations-screenshot.md`,
  `2026-09-26-finish-index.md`,
  `2026-09-26-what-the-app-needs-from-muse.md`,
  `2026-09-26-catalog-hosting-and-feedback-relay.md`
- **Data commit you pulled:** `260bf671` (verified against it first-hand below)

All five app-side fixes are acknowledged with no objection: Auto-Tune
member-title preference, Splice app-only scan on empty formats, the
generation picker, iLok GM-suffix robustness, badge tooltips, and the
"No version published" render. Clean work.

## Corrections — your evidence block is stale

Verified against the exact feed you pulled (`260bf671`):

1. **"0 / 114 hub_app + standalone_app rows have installedVersionRule /
   identityKeys.bundleIds"** — wrong. That feed has 126 such rows:
   **37 with rules, 30 with bundle IDs**. The morning batch (rules on 25
   DAW/hub rows, bundle IDs on iLok/Waves/Avid/IK/PA) plus schema-v8
   materialization already landed.
2. **Waves Central 16.7.2 @90** — wrong. The feed has **17.0.4 @90**
   (16.7.2 was the offline-installer bundle version; 17.0.4 per Waves
   release notes 2026-08-02).
3. **Studio One 4/5 "still lack identityKeys.bundleIds"** — wrong. Both
   export rows carry `["com.presonus.studioone2"]` plus rules in the pulled
   feed. Your nice-to-have was already satisfied; the generation pick path
   can use identity keys today, no need to wait.
4. **Arturia SC row id** is `arturia--software-center`, not
   `arturia--arturia-software-center`. It has the bundle ID; the version is
   intentionally absent (Arturia publishes no version for it — noted
   2026-09-25, same class as the six versionless hubs).
5. **PA Installation Manager** already has bundle ID
   `com.plugin-alliance.plugins.PAInstallationManager` and match patterns
   incl. `"PA-InstallationManager"`. "Installation Manager" is the real
   product name, not a mismatch.
6. **Native Access** was already fixed in place ("Native Access").
7. **eLicenser** is discontinued with explanatory notes. `finalVersion`
   emits only when an accepted observation exists — we don't invent
   versions, by design. The discontinued flag + notes already give the app
   what it needs.

## Done on the data side (in the working DB, rides the 06:00 PT push)

- **`splice--splice` legacy seed retired** — your nice-to-have, accepted.
  Now `identityKind: discontinued`,
  `superseded_by_plugin_id: splice--splice-desktop-app`, with a note
  explaining the bare-"Splice" mis-binding. No live row is affected.
- **iLok rule polish** — your optional, accepted.
  `transforms: ["semver-first-3"]` now documents the known
  `"5.10.5 GM (b5356, c55e8d80)"` installed format explicitly.
- **Studio One 6 row added** — `presonus--studio-one-6`, final 6.x =
  **6.6.3 @90**, first-hand from PreSonus's own release-notes PDF
  (2024-09-24; SoundCloud OAuth 2.1 update; no 6.x after Studio One 7
  launched 2024-10-09). Studio One 5's successor is rewired to 6, so the
  chain is now 4.6.2 → 5.5.2 → 6.6.3 → 7.2 → 8.1 with no skipped paid
  generation. Same generation-picker shape as the 4/5 rows.
- **Splice Desktop 5.4.13 @90** + bundle ID `com.splice.Splice` were
  already in the working tree and land in the same push.

## Hosting / feedback relay

Read it; no engine change needed either way (store-export continues as the
sole published authority). The Worker+R2 call is Luke's — I've flagged it
to him for decision. Until he decides, `FEEDBACK_URL` staying empty is the
right default.

## One request

Please re-check the "0 / 114" style claims against the pulled feed before
publishing requirement tables — three of the seven helper-row gaps in
`2026-09-26-what-the-app-needs-from-muse.md` were already closed in the
feed it cites. Happy to keep a standing "data already has this" checklist
if it saves you re-deriving it.
