# Diggable-113 disposition matrix (wave 6)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Collapse open_pending with oracle-or-none postures; stop endless digs.
- **Assumption flag:** Does **not** require the undecided freshness-cadence pivot.

## Summary (research-time; Muse must re-verify tips)

| Bucket | N | Posture | Oracle / action |
|---|---:|---|---|
| Moog MF-*S + Mariana | 9 | **open → raise** | `software.moogmusic.com/softwareUpdate/{slug}` tips 1.3.0 / 1.2.0 |
| Sonnox Restore trio | 3 | **discontinued_frozen** | Farewell article + RN tip 3.01.0 |
| Sonnox Pro-Codec | 1 | **open → raise** | RN tip 4.00.0 |
| UA Editions (5) | 5 | **needs_identity** (bundle/suite) | Not single-plugin SKUs; never stamp UAD 12.0 suite tip |
| IK AmpliTube artist/SKU + Syntronik modules + Clavitube + ST Alternate Keys | 48 | **hub_walled** (PM) pending host-train proof | Public per-SKU semver not found; PM canary only (1.1.15 already accepted). Do **not** trust marketing GUI path versions. |
| KORG Collection + natives | 24 | **hub_walled** (Software Pass) | Product pages lack tip; install via Software Pass login |
| Image-Line FL-coupled | 15 | **structurally_blocked / daw_bundled** | Standalone VST installers discontinued; ship inside FL installer (host 26.1.6.x public) — need Muse policy before any host-stamp |
| Roland ZENOLOGY* | 4 | **hub_walled** (Roland Cloud Manager) | No public tip on product page |
| Arturia *Play | 2 | **needs_identity** or freeware track | Marketing pages; likely freemium / ASC-gated |
| UVI Dual Delay X | 1 | **hub_walled / portal** | Product page no tip (UVI Portal) |
| Lexicon MPX Native | 1 | **hub_walled** (FLUX::Center) | Public label `version Latest, released: May 2025` — **no semver** on Lexicon downloads |

**Cleared with public tip path (pending Muse re-fetch):** 9 Moog + 1 Pro-Codec + 3 Restore freeze = **13** rows out of diggable dig-or-stop ambiguity.
**Reclass / stop dig:** UA 5 + IL 15 + KORG 24 + Roland 4 + most IK 48 + Arturia/UVI/Lexicon ≈ **majority** of remainder after honest hub_wall / identity.

## Engine change
Ship matrix as claim-ledger stop/dig filters after taxonomy backfill; Moog + Sonnox chips first.

## Risks
Over-walling IK if a public host changelog exists — keep recipe-health override.

## Residual hub walls (KORG / Roland / Arturia / UVI / Lexicon)

# Remaining diggable residuals: hub-wall / identity notes

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)

## KORG (24)
- Collection classics + native (modwave/opsix/wavestate/multi-poly) install/update via **KORG Software Pass** (KORG ID login) — support article https://support.korguser.net/hc/en-us/articles/360019156151
- Product marketing pages do not expose tip semver.
- **Posture:** `hub_walled` for all 24 diggable; optional future Software Pass canary only if a **public** tip appears (none found). Do not stamp hardware editor versions onto natives.

## Roland ZENOLOGY quartet (4)
- Product pages under Roland Cloud (`rc_zenology`, `rc_zenology_pro`) — updates via **Roland Cloud Manager** (login).
- No public tip on fetched product HTML.
- **Posture:** `hub_walled`.

## Arturia Analog Lab Play / Pigments Play (2)
- Free/freemium “Play” SKUs; updates via Arturia Software Center.
- Marketing overview pages lack tip semver.
- **Posture:** `needs_identity` (confirm freeware vs ASC-managed) then likely hub_wall / freeware track — not open_pending digs.

## UVI Dual Delay X (1)
- Product page https://www.uvi.net/dual-delay-x — no tip; distribution via UVI Portal / Falcon / Workstation ecosystem.
- **Posture:** `hub_walled` (aligns with accepted UVI Falcon year-canary non-invention rule).

## Lexicon MPX Native Reverb (1)
- Downloads page lists current build as **`version Latest, released: May 2025`** delivered **in FLUX::Center app** — **no public semver**.
- Legacy tips visible: 1.0.8 (Dec 2021), 1.0.6 (Feb 2018).
- **Posture:** `hub_walled` (Flux Center); do not invent a semver from “Latest”; optional Flux Center hub_app canary if Flux publishes a public tip later.

## Combined diggable effect
~24+4+2+1+1 = **32** rows → stop-dig with documented why (oracle_absent / hub_walled / needs_identity), complementing Moog/Sonnox clears and IK/UA/IL matrices.
