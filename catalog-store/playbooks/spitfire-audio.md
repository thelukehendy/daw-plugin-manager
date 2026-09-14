# Spitfire Audio

Most library versions are account / LABS-app gated for installers; **some** BBCSO / support changelogs are public. Yellow long-tail stays on KVR until support.spitfireaudio.com corroborates.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR product page `…-by-spitfire-audio` → `id="verwin"` | **Yes** | Per-library Product Version; primary bulk oracle. |
| support.spitfireaudio.com plugin changelogs | **Yes (selected)** | BBCSO / Abbey Road Orchestra / ART2 / Eric Whitacre Choir / AIR Studios Reverb / Solar raised to @92 when changelog matches or supersedes KVR. |
| spitfireaudio.com product pages | Partial | Marketing; Installer v often app-gated. |
| Spitfire account / LABS app | **No (account)** | Do not grind. LABS hub shell is hub-walled (`spitfire-audio--labs`). |

## Last scrub result

- Round 6: **+81** KVR accepts.
- Confidence raise 2: **+4** BBCSO Core/Discover/Piano Professional/Professional @92 (support changelogs; product **1.7.0**, Professional plugin build **1.12.14**).
- Confidence raise 3: **+5** @92 — Abbey Road Orchestra plugin **1.4.7** (newer than KVR), ART2 Iconic Strings Pro **1.3.9**, Eric Whitacre Choir **1.7.2**, AIR Studios Reverb **1.4.0**, Solar **1.7.5**.
- Confidence raise 4: non-raise.
- Store: **81/82** versioned; **72 yellow** remaining.
- Skip: Symphony Orchestra year-only `2025`; AIR Reverb Essentials mismatch; do not stamp ARO/Originals suite versions onto section SKUs.

## Weekly scrub recipe

1. Diff yellow Spitfire libraries vs prior NOTES.
2. KVR pass: exact library title → `verwin`; skip non-semver (year-only).
3. Manufacturer pass: search `support.spitfireaudio.com` for `{library} plugin changelog`; accept only when SKU-specific (not suite stamped onto expansions).
4. If mfr newer than KVR → accept mfr @90–92; if exact match → raise @92; if mismatch → leave KVR@60.
5. Never stamp Originals INSTRUMENT / ARO suite build onto per-section 1.0 SKUs.
6. Do not log into Spitfire account / LABS for versions.
7. Record raises vs non-raises; update `last_scrub_at`.

## Confidence policy

- Default **KVR@60** until support.spitfireaudio.com (or other official) corroboration.
- Suite→component contamination is an anti-pattern (see CONFIDENCE.md).
- Electron: green only after mfr raise; else yellow + account CTA.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **Spitfire account** (LABS app for LABS shell) |
| Hub URL | https://www.spitfireaudio.com/account |
| UX | Prefer account/LABS for installs; show catalog version with confidence badge. BBCSO/etc. may be green after changelog corroboration. |
| `hub_walled` | LABS shell **yes**; many libraries **partial** (KVR public, installer gated) |

