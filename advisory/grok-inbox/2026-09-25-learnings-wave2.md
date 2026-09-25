# Advisor learnings — WAVE-2 (2026-09-25)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Meta — WAVE-2 learnings after hubs browser extract + novel digs. Complements `2026-09-25-learnings-deep.md` (pack 1); does not replace it.
- **Context / evidence:**
  - Corpus: `/workspace/advisory-deep/{hubs,novel,integrity}/` + `WAVE2-FIXTURES.json` + notes under novel.
  - Constraint: suggestions only under `advisory/grok-inbox/`; never catalog-store.

- **Recommendation:**
  Fold these **new WAVE-2 learnings** into Muse posture:

  ## New learnings (WAVE-2)

  1. **Waves browser path works** — box desktop Webpage Complete **756 KB** vs curl **212 B** Incapsula. Playwright/WebFetch is mandatory; stub detector is non-negotiable. DOM classes in `WAVES-EXTRACT.md` are the parse guide. **Never stamp V17 onto every SKU.**
  2. **UA / EastWest are curl-friendly wins** — UA Version History ~670 KB / tip **12.0 Sept 8 2026**; EW `/support/updates` ~72 KB / IC **2.0** / Opus **1.6.5**. Prefer these before grinding hubs.
  3. **Softube suite naming trap** — RN **2.6.42** FIXED list (Monoment Bass / Parallels / Statement Lead) ≠ SKU versions. Same class as Waves V17 bulk.
  4. **Softube Central electron-builder** — prefer `softubestorage…/sc3/latest-mac.yml` → **`version: 3.0.5`**. Root `latest-mac.yml` / Homebrew cask **2.2.0** is a **stale pre-sc3 trap**. Do not regress Central with brew livecheck.
  5. **SSL Acoustifier live** — dual-platform cell `v1.0.18 (v1.0.19 Windows only)` → Mac-current **1.0.18**. Retraction/`mac_current_split` is real (integrity / vendor-retraction deep).
  6. **PA `/en/` soft-404** — use `/products/{handle}` not `/en/products/{handle}`; changelog lives in HTML metafield, not `.json` body_html.
  7. **Output Help Center trio** — Arcade **2.16.1** / Co-Producer **1.6.1** / Engines table curl-OK; Hub still for binaries.
  8. **Slate** — VMR Zendesk **2.10.1.3** public; Hub RN **2.19.0 (Sept 21 2026)** hub-only; `slatedigital.com/installers` **404**; Complete Access installers SPA-walled.
  9. **Antares section API** — ~28 RN articles mapped; AutoTune 2026 tip **1.2.1** (`notes/antares-rn-article-map.tsv` under novel). Standing ID enum beats blind scrape.
  10. **oeksound tips live** — soothe2 **1.3.3**; soothe3 **1.0.5**; bloom **1.1.3**; spiff **1.4.4** (per-product changelog URLs).
  11. **Integrity extras** — portal tiering / freshness SLA / synthesis docs under `advisory-deep/integrity/{PORTAL-LIVENESS,FRESHNESS,SYNTHESIS}.md` remain the cross-cut design; WAVE-2 does not reopen catalog writes.
  12. **Fixtures** — treat `advisory-deep/WAVE2-FIXTURES.json` as golden tip quotes for unit tests (Arcade, CoProd, Spitfire app, UA, EW, Waves Central, PA rate, Acoustifier).

  ## Anti-patterns reinforced

  | Trap | Correct |
  |---|---|
  | Incapsula 212 B / SPA Loading as content | Stub/shell detector; keep last good |
  | Waves V17 / Softube 2.6.x / Slate Hub 2.19.0 / EW IC / UAD 12.0 → every SKU | Hub/suite/generation lane only |
  | Homebrew Softube Central 2.2.0 as tip | Prefer **sc3** YAML 3.0.5 |
  | PA `/en/` product URLs | Bare `/products/{handle}` |
  | Guessing Zendesk article IDs | Use REPORT canonicals / section JSON |

  ## WAVE-2 file map (this push)

  | File | Focus |
  |---|---|
  | `2026-09-25-waves-browser-rn-evidence-deep.md` | 756KB browser SUCCESS + no V17 stamp |
  | `2026-09-25-ua-uad-version-history-oracle-deep.md` | `uad-version-history-v1` |
  | `2026-09-25-eastwest-support-updates-oracle-deep.md` | `ew-support-updates-v1` |
  | `2026-09-25-output-help-center-oracles-deep.md` | Arcade / CoProd / Engines chips |
  | `2026-09-25-slate-vmr-zendesk-oracle-deep.md` | VMR RN + Hub 2.19.0 + 404/SPA |
  | `2026-09-25-novel-oracles-softube-antares-oeksound-deep.md` | sc3 Central / Antares / oeksound |
  | `2026-09-25-learnings-wave2.md` | this meta |

  Prior `2026-09-25-*-deep.md` (nine from dfd7c0f) and `2026-09-24-*.md` **kept**.

- **If accepted, what changes in the engine:**
  Muse folds WAVE-2 chips into playbooks after verdicts; learning log stays inbox-only until accepted.

- **Expected impact:**
  Clear fetch-path matrix (browser vs curl), fewer suite-stamp bugs, Softube Central tip corrected to 3.0.5, more Tier-1 greens from UA/EW/Output/Antares/oeksound without hub logins.

- **Risks / caveats:**
  Novel Antares/oeksound tips may already partially exist in playbook — WAVE-2 is confirmation + tip bump, not duplicate grind. Integrity docs are research notes — implement via prior deep suggestions, don’t copy wholesale into catalog-store.

- **Suggested first step:**
  Accept Waves browser + UA + EW chips first (highest yield); land Softube sc3 YAML canary same week; Hub/VMR/Output follow.

- **New evidence since last verdict:**
  Browser 756 KB; WAVE2-FIXTURES.json; novel REPORT Softube sc3 / Antares 1.2.1 / oeksound / Slate Hub 2.19.0; integrity companion paths.
