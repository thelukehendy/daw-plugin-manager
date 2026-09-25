# Plugin Alliance (leftovers)

## What worked (prior + this mission)
- Public `/products/{handle}` Installer v label; Shopify `products.json` for handle discovery.

## Still missing / do not force
- Discontinued or renamed: bx_XL V2, crispscale, MEGA Sampler, Schoeps Double MS / Mono Upmix, The Sauce, SPL Bass/Full/Vox Ranger.
- `vitalizer-mk2-t` handle currently titles **Vitalizer MK3-T** — generation mismatch vs store MK2-T.
- Indent gen-1 404; Indent 2 is `indent-2` v2.4.1 (do not map to gen-1 SKU).

## Round 4 leftovers
- elysia alpha master/mix / xtressor / crispscale / MEGA Sampler / Schoeps / The Sauce / SPL Bass|Full|Vox Ranger: product handles 404 or renamed (alpha compressor V2 ≠ master/mix SKUs). Do not force.

## Round 5
- Leftover 12 unchanged (404/renamed/discontinued). No new accepts. Prefer not to force Wayback onto dead SKUs without live Installer v label.

## Round 7 mop
- **+3** via KVR: MEGA Sampler **1.2.0**, Schoeps Double MS **1.2.0**, Schoeps Mono Upmix (for 1to2 SKU) **1.2.0**.
- Still skip 404/renamed: alpha master/mix, The Sauce, Rangers, crispscale, bx_XL V2 (live is V3), Mono Upmix 1to3.

## Overnight chip-203
- **+1** bx_crispyscale **1.1.0** (companion on crispytuner page). bx_XL V2 marked discontinued→V3. PA 404 leftovers noted.

## Confidence raise 5 (2026-09-10)
- **+2**: Schoeps Double MS + Mono Upmix 1to2 **1.2.0** via official product manual CHANGELOG @90.
- MEGA Sampler manual still lacks matching CHANGELOG Version — left yellow.

## Confidence raise 6 (2026-09-10)
- MEGA Sampler: `…/mega_sampler.html` redirects to Online Sample Player marketing page (no Installer v); manual PDF still lacks CHANGELOG Version **1.2.0** — left yellow.
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- **+74**: twin-copy from canonical accepted SKUs (manufacturer conf 88–90) + KVR Product Version @60 for remaining titles. **No** Alliance Manager / Installation Manager stamp.
- Twins: Opticom, Tantra/Thorn, Kirchhoff/Cenozoix, THE OVEN, BYOME, Wedge Force×4, Vac Attack, Chop Shop, Tape Face, Wavesurfer, ADPTR×5, Schoeps Mono Upmix.
- Gen-ambiguous / discontinued: alpha compressor gen1, DSM, bx_digital V2, bx_console umbrella, Dangerous BAX EQ umbrella, SPL Attacker→Plus, Indent gen1, Eq Rangers Vol.1.
- Still open (no clean KVR verwin this pass): Magnum-K, EQ4 MS, BDE, Needlepoint.

## Version chip PA remain (2026-09-10 ~1:50 AM PT)
- **+54** live PA `/products/{handle}` Installer labels @90 for expand2 universe gaps (Bettermaker×5, Lindell×15, Maag×4, Swivel×5, Unfiltered×14 under `plugin-alliance--unfiltered-audio-*`, plus elysia karacter/museq umbrella, fiedler splat/stage, kiive XTComp, NEOLD RZ062, Shadow Hills Class A alias, SPL Machine Head, LTL Silver Bullet mk2, THX Spatial Creator, Trinity Shaper alias).
- **+1** dearVR Music **1.10.0** KVR @60 (absent from PA catalog).
- **Rejected** concurrent Dent gen1←2.4.1 map; Dent gen1 stays unknown (only Dent 2 public).
- dearVR Pro: KVR PA listing 1.10.0 @60 already current (≠ PRO 2 2.1.0.1).
- Discovery: `collections/all/products.json` (288 handles). No account portal.

## Version chip PA remain (2026-09-10 ~1:50 AM PT)
- **+54** live PA `/products/{handle}` Installer labels @90 for expand2 universe gaps (Bettermaker×5, Lindell×15, Maag×4, Swivel×5, Unfiltered×14 under `plugin-alliance--unfiltered-audio-*`, plus elysia karacter/museq umbrella, fiedler splat/stage, kiive XTComp, NEOLD RZ062, Shadow Hills Class A alias, SPL Machine Head, LTL Silver Bullet mk2, THX Spatial Creator, Trinity Shaper alias).
- **+1** dearVR Music **1.10.0** KVR @60 (absent from PA catalog).
- **Rejected** concurrent Dent gen1←2.4.1 map; Dent gen1 stays unknown (only Dent 2 public).
- dearVR Pro: KVR PA listing 1.10.0 @60 already current (≠ PRO 2 2.1.0.1).
- Discovery: `collections/all/products.json` (288 handles). No account portal.

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- Dent gen1: PA Legacy Installers lists **Unfiltered Audio Dent v1.0** with `unfiltered_audio_dent_*_1_0.zip`. Accepted **1.0** @88. Reclassed `discontinued` → successor `unfiltered-audio--unfiltered-audio-dent-2` (@2.4.1). **Do not** stamp Dent 2 onto Dent gen1 (same policy as Indent).

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- `plugin-alliance--uad-bx-digital` / `uad-engl-e646-vs-limited-edition` reclass **unknown_other** (UAD SKUs misfiled under PA). Canonical versions live on `universal-audio--*` rows. PA native `engl-e646-vs` / `bx-digital-v3` unchanged.

# Plugin Alliance (BEATSURFING fill)

## version-chip-expand-4 (2026-09-10)
- BEATSURFING +6 identity rows → KVR@60 (PA hub; no per-SKU public installer on PA storefront).

## Maintenance chip 2026-09-24 ~10:18 PT — CHANGELOG-TOP-ENTRY ORACLE (block unblocked)
- **New recipe:** every PA per-product page (`/products/{handle}`) carries a full dated **"Changelog"** section; the TOP entry is the current version (e.g. 800rb → "Version 1.4.0 (Jan 27, 2026)"; attacker-plus → "Version 1.10.1 (Mar 20, 2026)"). First-hand, no auth, strictly better than the Installer v label (dated + full history on one page).
- **The 2026-09-23 text-fetch automation block is GONE** — both probe pages fetched fine via the text path today. Lesson: vendor blocks are TRANSIENT; re-probe blocked paths periodically instead of treating one block as permanent.
- Rendered-browser route also healthy (loaded both pages, no bot check) — text-fetch is the primary path (cheaper), rendered-browser the fallback.
- Verified 2026-09-24: 800rb changelog-top 1.4.0 = stored 1.4.0 (MATCH); attacker-plus changelog-top 1.10.1 = stored 1.10.1 (MATCH). Both rows held.
- **Next:** enumerate the ~261 stale PA rows by walking the products.json handle list (dedupe to catalog rows), diffing each changelog top entry against stored. Low-rate sequential fetches; stop on any 429/block and log it.
- **Caution (2026-09-24, resolved):** a first browser-task read of the attacker-plus OLDER changelog entries initially disagreed with the parent's text-fetch read — but the steered re-read matched the parent's list, so that first read was the outlier. Top entries agree across all three reads. Use ONLY the top changelog entry as the version oracle; never diff or trust older entries.
- products.json bulk-sync caveat still stands (uniform updated_at = trap, not signal) — use it ONLY for handle discovery, never as a version oracle.
- **Identity note (2026-09-24 2218 chip):** `/products/bx_boom` now serves **"PA FREE bx_boom!"** (free-version product identity) — it is NOT the paid bx_boom row's page. The catalog row `plugin-alliance--bx-boom` is sourced from `/products/bx_boom-v3` ("Installer v3.0.0"). Never map a free-repurposed handle onto a paid row; when a handle's page identity diverges from the row's source URL, treat as identity mismatch, not a version signal.

## Maintenance chip 2026-09-24 ~22:18 PT — changelog-top enumeration slice 1 (in progress)
- Enumeration of the ~261-row stale PA block started, oldest-verified first, handles from each row's `verifiedPublic:` source URL in notes (never from memory — the operator caught a hand-typed handle list diverging from the DB in this chip: fabricated "stored" values produced phantom DIFFERs; the worker's actual page-top reads all agreed with true stored values).
- Batch 1 (worker): 14 rows read — 8 MATCH (b-15n 1.6.0, be-100 1.5.0, bm60 1.0.1, bx_pulsar 1.0.1, buxom-betty 1.3.0, bx_2098-eq 1.9.0, bx_aura 1.1.0, bx_bassdude 1.12.0), 6 page-top reads confirming current (bx_blackdist2 1.10.0, bx_bluechorus2 1.12.0, bx_clipper 1.1.0, bx_console-ssl-9000-j 1.5.0, bx_control-v2 2.16.1 — all = stored), 1 UNFETCHABLE-then-ambiguous (bx_closer; bx_boom read was the free-repurposed handle — excluded, see identity note). No raises; all confirmed rows refreshed verified_at.
- **Batch 2 (worker): 34 rows, all fetched cleanly, 31 MATCH, 3 DIFFER → all resolved as HOLDS, 0 raises:**
  - **Changelog-lag class (standing rule):** when the page's changelog top trails the stored installer-label version with no newer evidence anywhere, HOLD — do not downgrade. The installer label is the operative download version; PA changelogs lag it. Cases: click-boom (stored 1.1.1 installer-label vs changelog single entry 1.1.0), cenozoix-compressor (stored 1.1.3 vs changelog top 1.1.2), bx_clipper precedent (1.1.1 vs 1.1.0). Downgrade only with vendor corroboration that the higher build never shipped.
  - **Identity catch:** `plugin-alliance--tbtech-cenozoix-compressor`'s seed notes pointed `verifiedPublic:` at `/products/mpressor` (Elysia mpressor — a different product) with 1.17.0. First-hand check of BOTH pages confirmed the row is the Cenozoix Compressor; the mpressor 1.17.0 read was REJECTED for this row. Seed notes corrected to `verifiedPublic:1.1.3@.../cenozoix-compressor`. Never stamp a cross-product read onto a row even when the notes suggest the handle — verify the page title matches the row identity first.
