# Universal Audio (UADx vs UAD DSP)

Two version trains — **never cross-map**.

| Train | What | Typical version shape | Public oracle |
|---|---|---|---|
| **UAD DSP** | UAD-2 / Apollo DSP plugins (often “UAD …” titles) | Shared **UAD Software** suite train (e.g. **12.0**) | help.uaudio.com UAD Version History; KVR per-product often echoes suite |
| **UADx** | Native (non-DSP) UADx plugins | Per-plugin **1.x** semver | KVR per-product; product pages often Connect-gated |
| **UAD Software** hub shell | Manager / suite package | Suite installer | **Hub-walled** (UA Connect) — do not accept onto plugin SKUs |

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR `…-by-universal-audio` → `verwin` | **Yes** | Bulk fill. UAD DSP pages often show suite train; UADx show 1.x. |
| help.uaudio.com UAD Version History | **Yes** | Corroborates / advances **UAD DSP** suite train (confidence raise 2: → **12.0** @90). |
| uaudio.com product pages | Partial | Marketing; installers via UA Connect. |
| UA Connect | **No (account)** | Do not grind. |
| Softube.com RN for Softube-row UAD Softube titles | Softube playbook | Softube-catalogued `UAD-*` SKUs may use UA KVR + UA Version History when title matches exactly. |

## Last scrub result

- Round 6: **+190** KVR accepts.
- Round 8: **+5** UAD bx_* via underscore slugs @ suite train.
- Confidence raise 2: **+134** UAD DSP-train currents → UAD Version History **12.0** @90. Did **not** raise UADx 1.x or Nigel 7.7.
- Store: **195/202** versioned; **61 yellow** (mostly UADx / leftovers).
- Still skip: hardware pedals/amps (ANTI 1992, Dream '65, …), OX, Volt; bare `universal-audio--uad-software` hub shell.

## Weekly scrub recipe

1. Split inventory: `UAD`/`UADx`/`hardware`/`hub` by name + notes.
2. **UAD DSP:** check help.uaudio.com Version History for current suite; if newer than accepted → accept suite version @90 onto DSP SKUs that already track the suite (exact title only). Else KVR refresh.
3. **UADx:** KVR `verwin` only; do not stamp suite **12.x** onto native 1.x.
4. Softube-row UAD Softube: exact-title UA KVR / Version History only (see Softube playbook).
5. Skip hardware + UAD Software manager row.
6. Confidence: DSP may be green after Version History; **UADx stay KVR@60** until per-SKU manufacturer corroboration.
7. Update NOTES + `last_scrub_at`.

## Confidence policy

- UAD DSP: manufacturer Version History can raise to **90**.
- UADx: **stay KVR@60** until native product/CDN evidence.
- Never map UADx ↔ UAD DSP variants onto each other.
- Electron: DSP green OK for suite train; UADx yellow + **UA Connect** CTA.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **UA Connect** |
| Hub URL | https://www.uaudio.com/downloads.html |
| UX | Distinguish badges: “UAD Software suite” vs “UADx native”. Updates via UA Connect. Hub shell `uad-software` is not a plugin update target. |
| `hub_walled` | **1** for Connect / UAD Software package; DSP Version History is public |

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- UADx Electra 88 Vintage Keyboard Studio: KVR `verwin` **1.0.12** @60 accepted. UA Connect still hub-walled for manufacturer corroboration. portalApp=UA Connect.

## version-chip-expand-6
- C-Suite C-Axe / C-Vox **11.8.3** KVR@60. C-Max Mac/Win mismatch skipped. Apollo hardware unversioned. Bundles skipped.
