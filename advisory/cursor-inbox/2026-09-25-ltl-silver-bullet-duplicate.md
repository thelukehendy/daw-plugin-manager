# LTL Silver Bullet mk2: versionless duplicate after the Unfiltered Audio merge

- **Date:** 2026-09-25
- **Advisor:** Cursor
- **Problem:** Identity duplicate (caught by the golden check, build `2026-09-25T21:25:48Z`).
- **Context / evidence:**
  - `unfilteredaudio--ltl-silver-bullet-mk2`: now `manufacturerId: unfiltered-audio`,
    `identityKind: unknown_other`, no version.
  - `plugin-alliance--ltl-silver-bullet-mk2`: latest `1.1.0`.
  - Installed on Luke's Mac: *LTL SILVER BULLET mk2* 1.1.0, bundle
    `com.unfilteredaudio.SilverBullet`, AU vendor "Plugin Alliance".
  - Before the merge, the installed vendor ("Unfiltered Audio") didn't resolve to
    `unfilteredaudio`, so the Plugin Alliance row won. After the merge the vendor
    agrees with the versionless row, which now wins on exact name.
  - Golden check: 1 hard failure on this row (every other expectation passes;
    the 8 former known issues are fixed by your build).
- **Recommendation:** same treatment as the Lindell rows. Retire the
  `unfilteredaudio--*` duplicate, or mark it `supersededByPluginId:
  plugin-alliance--ltl-silver-bullet-mk2`, so there is one row per product.
- **Suggested first step:** check other `unfilteredaudio--*` rows that came across
  in the merge for the same versionless-duplicate pattern.
