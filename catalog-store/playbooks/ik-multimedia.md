# IK Multimedia

Hub-walled yellow manufacturer. Authoritative installers live in **IK Product Manager** / user area; public scrub uses KVR Product Version (+ family trains).

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR product page `…-by-ik-multimedia` → `id="verwin"` | **Yes** | Primary public oracle. T-RackS modules share **6.3.2**; Syntronik family **4.0.9**; AmpliTube 5 line **5.10.9** when Win=Mac on the page. |
| ikmultimedia.com product pages | Partial | Feature marketing; installer semver usually Product Manager–gated. |
| IK Product Manager / userarea download | **No (account)** | Do not grind. |
| Hardware pedal pages (AmpliTube X-*) | N/A | Hardware — not plugin installer semver. |

## Last scrub result

- Round 6: **+150** accepts via `kvr-product-page`.
- Round 7 mop: leftovers unchanged.
- Store: **150/157** versioned; **150 yellow** (KVR @60).
- Still missing: AmpliTube X-DRIVE/SPACE/TIME/VIBE (hardware); Miroslav Philharmonik 2 (ambiguous dual `2.0.0 (2.0.6)`); MODO BASS SE / AmpliTube Live + LE (no clean verwin).

## Weekly scrub recipe

1. List `ik-multimedia` plugins without version or still yellow.
2. Fetch exact-title KVR product page; accept `verwin` only when single clear semver (Win=Mac or one Product Version).
3. Family trains OK when each module page states the same version (T-RackS / Syntronik / AmpliTube 5).
4. Skip hardware X-* pedals; skip dual/ambiguous Product Version strings; **never** map AmpliTube 4 ↔ 5.
5. Do not log into Product Manager.
6. Confidence: **stay KVR@60** until ikmultimedia.com / official CDN corroborates.
7. Note yield; update playbook `last_scrub_at`.

## Confidence policy

- Stay **KVR@60** until manufacturer corroboration.
- No raise from Product Manager UI, reseller mirrors, or gen cross-maps (AT4≠AT5).
- Electron: yellow → caution; CTA to **IK Product Manager**.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **IK Product Manager** |
| Hub URL | https://www.ikmultimedia.com/userarea/download/ |
| UX | “Open IK Product Manager” for updates. Catalog versions are KVR receipts until manufacturer corroboration. |
| `hub_walled` | **1** |

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- Accepted KVR@60 (Win=Mac): ARC X **2.0.2**, Hammond B-3X **1.3.5**, Sunset Sound Studio Reverb II **1.0.2**, TONEX Max **1.12.1**, TONEX SE **1.12.1**.
- Reclass: Hardcore/Nanotube → **soundset** (SampleTank presets); VocaLive → **hub_app** (iOS); ARC 4 → **gen_ambiguous** successor ARC X.
- Still open: Clavitube (Win 1.0 vs Mac 4.0.9 contamination); TONEX Standard (`1.12.1 (beta 2.0.2)` ambiguous — do not map Max/SE).

## version-chip-expand-6
- IK Product Manager **1.0.1** KVR@60. TONEX Standard ambiguous beta string skipped; Clavitube Mac/Win mismatch skipped. Hardware/soundsets/bundles skipped.
