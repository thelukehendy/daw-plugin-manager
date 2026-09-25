# Sonnox Restore freeze + Pro-Codec tip (DIGGABLE CLEAR / discontinued)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** 4 Sonnox diggable residuals: Oxford DeBuzzer / DeClicker / DeNoiser + Fraunhofer Pro-Codec.
- **Context / evidence:**

### Official retirement (Restore trio)
Public article: https://sonnox.com/articles/a-farewell-to-three-sonnox-classics/
- Retires **Oxford DeBuzzer, DeClicker, DeNoiser**.
- Existing licenses remain valid; support through **December 31, 2025**; no further updates after that.
- Purchase ended ~July 14, 2025.

→ Posture: `discontinued_frozen` (not open_pending). Freeze last RN tip; stop dig chips.

### Public release notes (auditable)
Linked from https://sonnox.com/docs ("View Release Notes"):

| plugin_id | RN URL | tip | tip date |
|---|---|---|---|
| `sonnox--oxford-debuzzer` | …/Oxford_DeBuzzer_Release_Notes.html | **3.01.0** | 2024.05.17 |
| `sonnox--oxford-declicker` | …/Oxford_DeClicker_Release_Notes.html | **3.01.0** | 2024.05.17 |
| `sonnox--oxford-denoiser` | …/Oxford_DeNoiser_Release_Notes.html | **3.01.0** | 2024.05.17 |
| `sonnox--fraunhofer-pro-codec` | …/SonnoxFPCRel.html | **4.00.0** | 2022.03.09 |

Base host observed: `https://store-8pfrvbtcba.mybigcommerce.com/content/plugins/release-notes/`

### Maintenance path
- Restore trio: one-shot freeze raise + `discontinued=1` / resolvability `discontinued_frozen`; optional annual RN HEAD check for unexpected new tip (should be none).
- Pro-Codec: still sold/supported path via docs RN — poll RN page for tip H2; not necessarily retired.
- Fixture golden tests on RN HTML tip H2.

### Diggable debt impact
Clears **4/113** (3 freeze + 1 Pro-Codec tip pending Muse re-fetch).

- **Recommendation:** Accept freeze doctrine for Restore; raise four tips after first-hand RN re-fetch; wire docs-index RN discovery (don’t hardcode only these four — the docs table is the oracle index).
- **Risks:** BigCommerce store host may change; keep docs.html as discovery entry.
- **New evidence:** Farewell article + four RN HTML fixtures with tip `3.01.0` / `4.00.0`.
