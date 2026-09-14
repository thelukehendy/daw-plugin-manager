# Output

Catalog complete on KVR receipts; Output hub/account may ship newer builds. Treat as yellow until manufacturer corroboration.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR product pages `…-by-output` → `verwin` | **Yes** | Round 7: Arcade, Portal, Thermal, Signal, Movement, Exhale, Substance, Rev, Co-Producer, Analog Strings, Analog Brass & Winds — **11/11**. |
| output.com product pages | Partial | Marketing / demos; authoritative builds often account-gated. |
| Output hub / account | **No (account)** | Do not grind for weekly scrub. |

## Last scrub result

- Round 7: **11/11 complete** (`kvr-product-page`).
- Confidence raise 4: non-raise.
- Store: **11/11** versioned; **11 yellow** (KVR @60).

## Weekly scrub recipe

1. Confirm still 11 plugins; KVR refresh any verwin drift.
2. Spot-check output.com only if a public changelog/installer basename appears — do not use account hub.
3. Exact title match only (Analog Brass & Winds ≠ Analog Strings).
4. Confidence: **stay KVR@60** until official corroboration.
5. Update `last_scrub_at` even on zero delta.

## Confidence policy

- Stay **KVR@60** until manufacturer corroboration.
- Electron: complete identity OK; versions yellow + **Output hub** CTA.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **Output hub** |
| Hub URL | https://output.com/account |
| UX | “Check Output hub for updates”. Catalog versions are public receipts. |
| `hub_walled` | Installer matrix gated; KVR versions public |


## Confidence raise 15
- Non-raise this pass — see NOTES-confidence-raise-15.md.

## Confidence raise 17
- Product pages SPA shell only (~3KB) — no public per-title semver; hub skip.

## Version chip expand-10 (2026-09-10 ~5:17→5:24 AM PT)
- Public versions stamped where evidence exists; sound libraries intentionally unversioned.
- `verified_by=coding-assistant`
- Arcade Lines confirmed **soundset** (unversioned). Arcade plugin already had current prior.

## Confidence raise 26 (2026-09-13)
- **0** raises (11 stay KVR@60). Thermal owner's manual fetched in full: zero version strings; everything ships via Output Hub or account-gated Downloads tab; product pages are SPA shells.
