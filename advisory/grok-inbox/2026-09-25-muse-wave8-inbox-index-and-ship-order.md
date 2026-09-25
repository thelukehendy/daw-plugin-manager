# Wave 8 Muse inbox — index & ship order

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (Coding Assistant)
- **Theme:** Database robustness and accuracy — make the catalog harder to fool
- **Constraint:** ≤12 dense files; in-repo fixtures; design only; Muse re-fetches before any catalog write
- **Standing:** Do not assume cadence/green-plateau pivot decided. Tier-1 only. No telemetry. Advisor-only under `advisory/`.
- **Evidence:** `advisory/grok-inbox/fixtures/wave8/` (+ `SHA256SUMS`). Do not cite `/workspace/…`.
- **Steering:** Muse Round 4 in `advisory/OPERATOR-GUIDANCE.md`.

## Ship order (read first → last)

| # | File | Why first |
|---|---|---|
| 0 | **This index** | Map + non-goals |
| 1 | `…-contamination-cohort-stamp-detection-deep.md` | Ask 1 P0: **179** high clear/reclass candidates; Softube 124×2.6.41 / uad-×12.0 / Waves bundles |
| 2 | `…-vendor-retraction-protocol-v2-deep.md` | Ask 2: v1 broke on D16 / Lindell / Waves V17; Classes F–H + triggers T0–T12 |
| 3 | `…-chip-falsification-death-conditions-deep.md` | Ask 3: death conditions for accepted chips (+ Softube sc3 / Waves Incapsula) |
| 4 | `…-accepted-tip-hostile-source-gate-deep.md` | Ask 6: tip SoT gate — Serum-2 raised via **vstorrent.org** |
| 5 | `…-successor-url-stamp-contamination-deep.md` | Ask 6: gen/successor URL stamp fingerprint (PA bx-boom class) |
| 6 | `…-mac-win-silent-higher-detection-deep.md` | Ask 6: silent Mac/Win higher — live `oeksound--bloom` |
| 7 | `…-identity-classifier-v2-and-second-sources-deep.md` | Ask 5: classifier P/R **1.0** on 18/17; 18/18 second sources |
| 8 | `…-hub-newsroom-korg-class-leaks-deep.md` | Ask 4: 0 new unlocks; Slate Zendesk RN titles = near-miss (lags) |

**File count:** 9 markdown (+ fixtures). Fixture nit honored: one canonical dir per vendor under `fixtures/wave8/{…}/`.

## Ask outcomes (summary)

| Ask | Result |
|---|---|
| 1 Contamination | Detection recipe + **179** unique high IDs. Softube suite train 2.6.41×124; Softube uad-*×12.0×17; Waves bundles on uniform tip; Signature Series @15.x. Guards protect Melda/Soundtoys/Goodhertz/Kilohearts/Waves plugin uniform. |
| 2 Retraction v2 | **v1 broke on all three** case files. Adds `portal_poison` / `bulk_stamp_forbid` / `oracle_scope_mismatch` + trigger registry. |
| 3 Chip falsifiers | Exact NC / shape / parse / retract / MUST-NOT for Moog, Sonnox, NI, Waves, UA, IK, Spitfire, KORG (+ Softube sc3, Waves Incapsula). |
| 4 KORG-class hunt | **Zero** new SKU unlocks. Slate Zendesk RN titles look KORG-shaped but **lag** catalog — falsified as primary oracle. |
| 5 Identity v2 | Rule classifier P=1 R=1 F1=1 on HIGH18+ALLOW17; allowlist uneaten; 18/18 second sources. |
| 6 Exploration | Hostile tip hosts; successor-URL stamps; Mac/Win silent-higher. |

## Explicit non-goals / do-not-re-propose

- Freshness/portal **implementation** (Luke’s pending pivot)
- Bulk portal probing
- Parallelizing Muse’s verification queue
- Re-grinding PM / Software Pass / Cloud Manager / ASC as unlocks
- Catalog writes, telemetry, credentialed scraping
- Auto-clearing honest cohort trains listed as guards in Ask 1

## Verdicts hygiene

Check `advisory/verdicts.md`. Wave 7: **11 ACCEPTED**. Wave 8 items are **robustness designs + detection recipes** — nothing becomes catalog data without Muse re-fetch / operator action.
