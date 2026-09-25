# Slate VMR Zendesk oracle — Hub SPA walled; installers 404

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #2 — Slate Complete Access Hub is login-walled for installers, but VMR (and Hub) Zendesk RNs are public. Separate Hub tip from VMR tip; never stamp Hub onto plugins.
- **Context / evidence:**
  - **VMR 2.10.1.3 RN** (canonical from saved page): https://support.slatedigital.com/hc/en-us/articles/12998887383315-VMR-2-10-1-3-Release-Notes — HTTP 200 ~21 KB (`raw/slate-vmr-21013.html`). Quote title: `VMR 2.10.1.3 - Release Notes` (Mar 26, 2026). Related historical RNs: 2.7.3.1 / 2.6.4.0 / 2.5.7.0.
  - How To Update VMR: https://support.slatedigital.com/hc/en-us/articles/115010631688-How-To-Update-Virtual-Mix-Rack (~21 KB).
  - Versioned direct-download pattern: `app.completeaccess.audio/installers/direct-download?deployableId=vmr&platform=MAC_OS&version=2.10.1.3` — unauth response is SPA shell / falls through to **latest** (RN footnote). Treat as pointer only, not authenticated SoT.
  - **`slatedigital.com/installers/` → 404** (DEAD). `app.completeaccess.audio/installers` → 200 ~3.7 KB SPA “Loading…” without login (**SHELL**). Fake `/appcast.xml` is HTML SPA.
  - **Hub RN 2.19.0 (September 21, 2026)** — separate article under Release Notes section (often the only section article): Hub/manager tip only. **Never** stamp `2.19.0` onto VMR / FG-X / etc. (novel REPORT).
  - Guessed alternate VMR article IDs may timeout — prefer URLs from REPORT / saved canonicals above.

- **Recommendation:**
  Ship `slate-vmr-zendesk-v1`:

  ```
  Discover: Zendesk search/section crawl for /VMR\s+(\d+\.\d+\.\d+\.\d+)/
  Parse RN Changes + named version; optional how-to article liveness
  Apply tip to Virtual Mix Rack product row ONLY
  Parallel (optional): slate-hub-rn-v1 for Complete Access Hub app row → 2.19.0 tip
  NEVER: Hub version → plugin SKUs; unauth direct-download body as version proof
  DO-NOT-GRIND: Complete Access Hub session, iLok automation
  ```

- **If accepted, what changes in the engine:**
  - Zendesk allowlist for VMR RN articles + Hub RN article.
  - Resolvability: most Slate plugins remain hub_walled; VMR can be `open` when RN article exists.
  - Portal liveness: mark `slatedigital.com/installers` dead; Complete Access installers URL as SPA-shell tier.

- **Expected impact:**
  HIGH when VMR RN article exists; LOW for silent hub-only module ships. Hub 2.19.0 keeps manager row fresh without plugin false churn.

- **Risks / caveats:**
  Unauth download always “latest” — don’t trust version query param as fetched artifact proof. Module ships without RN stay KVR-ceiling. Article ID discovery must not invent IDs (timeouts observed on guesses).

- **Suggested first step:**
  Hard-allowlist VMR 2.10.1.3 + Hub 2.19.0 article URLs; parse headings; write two observations (VMR vs Hub).

- **New evidence since last verdict:**
  REPORT verification table; saved Zendesk HTML + canonical URLs; installers 404; SPA shell; Hub 2.19.0 Sept 21 2026 from novel dig.
