# Wave 7 Muse inbox — index & ship order

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (Coding Assistant)
- **Constraint:** ≤12 dense files; novelty over volume; design proposals only; Muse re-fetches before any raise
- **Standing:** Do not assume cadence/green-plateau pivot decided. Tier-1 only. No telemetry. Advisor-only under `advisory/`.
- **Evidence:** In-repo fixtures under `advisory/grok-inbox/fixtures/wave7/` (sha256 in `fixtures/wave7/SHA256SUMS`). Do not cite `/workspace/…`.
- **Steering:** Muse Round 3 in `advisory/OPERATOR-GUIDANCE.md` (make accepted chips buildable).

## Ship order (read first → last)

| # | File | Why first |
|---|---|---|
| 0 | **This index** | Map + non-goals |
| 1 | `…-chip-moog-softwareupdate-ready.md` | Ask 1+2: MF-105S gap closed (tip **1.3.0**, fixture present) + full Moog chip pack |
| 2 | `…-chip-sonnox-rn-freeze-ready.md` | Sonnox Restore **3.01.0** / Pro-Codec **4.00.0** RN freeze chip |
| 3 | `…-chip-ni-electron-updater-yml-ready.md` | NI `latest-mac.yml` → Native Access **3.26.0** |
| 4 | `…-chip-waves-downloads-canary-ready.md` | Waves Central downloads canary **V17.0.4** + Incapsula stub |
| 5 | `…-chip-ua-connect-dmg-ready.md` | UA Connect DMG **1.10.0/3844** (Connect ≠ UAD suite) |
| 6 | `…-chip-ik-pm-cdn-referer-ready.md` | IK Product Manager CDN HEAD + Referer → **1.1.15** |
| 7 | `…-chip-spitfire-cloudfront-path-ready.md` | Spitfire CloudFront path **3.4.17** (app only) |
| 8 | `…-tier2-top5-wiring-ready-scout.md` | Ask 3: Class A top-5 scout wiring specs (paused — no catalog action) |
| 9 | `…-identity-reclass-candidates-tier1-deep.md` | Ask 4: **18 high** / 17 allow / 5 review reclass candidates |
| 10 | `…-hub-walled-creative-pass2-deep.md` | Ask 5: KORG news-title tip channel (TRINITY **1.1.0**) + negatives |

**File count:** 11 markdown (+ fixtures). Standalone mf-105s gap note folded into Moog chip.

## Ask outcomes (summary)

| Ask | Result |
|---|---|
| 1 MF-105S | Gap was fixture-only. Live tip **1.3.0**; golden `fixtures/wave7/chips/moog/moog-mf-105s.html` (+ meta, sha256 `89f1eab5…`). |
| 2 Chip packs | Seven ready packs with golden + negatives + parse recipes. Live tips observed 2026-09-25 in `fixtures/wave7/chips/FINDINGS.json`. |
| 3 Tier-2 top-5 | AudioThing → Wave Arts → Audiority → Denise → Madrona. Scout-only; best new-accept mass = Wave Arts + Denise. |
| 4 Identity | Promoted Softube Flow/packs + UADx Pultec + Softube UAD Tube-Tech + Waves Signature Series ×5. Tip traps: Softube Central **2.6.41**, UAD **12.0**, Waves Central **15.x**. |
| 5 Hub creative | **NEW:** KORG Collection news-title version feed. Negatives: Roland empty `updates_drivers`, IK Syntronik PDF/g1 403, IL dead `getProductVersion`, Lexicon CDN neighbors closed, Arturia Play email-gate. |

## Explicit non-goals / do-not-re-propose

- Freshness/portal implementation (still Luke’s pivot call)
- Parallelizing Muse’s first-hand verification queue
- Re-grinding Product Manager / Software Pass / Cloud Manager / ASC as “new” hub unlocks
- Catalog writes, telemetry, credentialed scraping, Luke-login workflows
- Opening tier-2 research (scout specs only; still paused)
- Stamping hub/app/generation tips onto plugin SKUs

## Verdicts hygiene

Check `advisory/verdicts.md` before raising. Wave 6: **12 ACCEPTED**. Wave 7 items are **buildable chip packs + scout/identity/hub evidence** — nothing becomes catalog data without Muse re-fetch.
