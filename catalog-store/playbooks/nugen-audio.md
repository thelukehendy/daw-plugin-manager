# NUGEN Audio

Account **My Products / Downloads** is hub-walled for installer binaries. Public scrub via KVR Product Version.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR `…-by-nugen-audio` → `id="verwin"` | **Yes** | Round 7: **+27** → 27/31. Prefer exact SKU slug (ELEMENTS / 3D Ext variants). |
| nugenaudio.com product pages | Weak | Often lack installer semver. |
| nugenaudio.com/downloads / build-archive / My Products | **No / broken / login** | Downloads errors; archive login-walled — confidence raise 3 chip-B non-raise. |
| Bundle rows (Focus / Modern Mastering / Post / Producer) | N/A | Product Version **N/A** — leave unknown. |

## Last scrub result

- Round 7: **27/31** via `kvr-product-page`.
- Confidence raise 3–4: **non-raise** (~27 yellow) — no public manufacturer installer semver.
- Still missing: Focus, Modern Mastering, NUGEN Post, NUGEN Producer.

## Weekly scrub recipe

1. Yellow inventory for nugen-audio; KVR refresh exact SKU slugs.
2. Probe nugenaudio.com only for new public changelog/installer basename; if still login-walled → stop.
3. Skip Focus / Modern Mastering / Post / Producer (bundles/tools, N/A).
4. Confidence: **stay KVR@60** until official corroboration.
5. Update `last_scrub_at`.

## Confidence policy

- Stay **KVR@60** until manufacturer corroboration.
- Electron: yellow + **NUGEN My Products** CTA; do not auto-trust KVR for update prompts.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **NUGEN My Products** |
| Hub URL | https://nugenaudio.com/account/ |
| UX | “Sign in to NUGEN My Products for installers”. |
| `hub_walled` | **1** (binaries); KVR versions public |

