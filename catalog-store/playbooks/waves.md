# Waves

Hub-walled yellow manufacturer. Authoritative installers live in **Waves Central**; public scrub uses KVR Product Version as a receipt only.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR product page `kvraudio.com/product/{slug}-by-waves` → `id="verwin"` | **Yes** | Primary public oracle. Most current plugins share Waves V17 train **17.1.42.50**; older signature-series keep their own Product Version. |
| waves.com product / downloads pages | Partial | Marketing pages; no crystal-clear per-SKU installer matrix without account. |
| Waves Central | **No (account)** | Do not grind. Authoritative installer matrix is hub-gated. |
| Reseller / mirror changelogs | No | Not primary; do not raise confidence from these. |

## Last scrub result

- Round 6: **+238** accepts (`extract_method=kvr-product-page`, `verified_by=coding-assistant`).
- Round 7–8 mop: leftovers unchanged.
- Store: **238/243** versioned; **238 yellow** (all KVR @60).
- Still missing / skip: Drifter, Ignition, WaveShell, Waves StudioRack for OBS (no clean KVR page); PuigChild Hardware Compressor (N/A Product Version / hardware).

## Weekly scrub recipe

1. Enumerate store plugins for `manufacturer_id=waves` lacking accepted current **or** still KVR-60.
2. Resolve KVR slug from exact plugin title (`…-by-waves`); fetch product page; extract `id="verwin"`.
3. Accept only on **exact** title→slug match. Shared V17 train is OK when each product page states that version.
4. Skip hardware / N/A Product Version; skip SKUs with no live KVR product page.
5. Do **not** open Waves Central or invent versions from marketing copy.
6. Confidence: leave at **KVR@60** unless a manufacturer page/CDN filename corroborates the same semver (rare for Waves — expect stay yellow).
7. Record yield in a NOTES scrub chip; refresh `last_scrub_at` on playbook row.

## Confidence policy

- **Stay KVR@60** until manufacturer corroboration (official page / installer filename on waves.com CDN).
- Do not raise from Central screenshots, reseller pages, or suite→component fuzzy maps.
- Electron: yellow band → caution UI; prefer **portalApp** CTA over auto-update trust.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **Waves Central** |
| Hub URL | https://www.waves.com/downloads/central |
| UX | Show “Update via Waves Central” for yellow/hub-walled SKUs. Free micro updates are Central-driven; catalog `latestVersion` is a public receipt only. |
| `hub_walled` | **1** (authoritative matrix) |

## version-chip-expand-6
- WaveShell / StudioRack OBS: no KVR verwin. Bundles/hardware skipped.
