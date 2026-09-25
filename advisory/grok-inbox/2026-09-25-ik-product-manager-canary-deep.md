# IK Product Manager public version canary (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Hub-walled Tier-1 — IK Multimedia. Catalog marks `portal_app = IK Product Manager`. Public product RNs (AmpliTube / T-RackS / SampleTank / Syntronik SKUs) live inside the authenticated Product Manager UI. Muse needs a **bounded public canary** for the manager app only — not an authenticated catalog grind.
- **Context / evidence:**

### Live fetch (2026-09-24/25 PT)
| URL | HTTP | Result |
|---|---:|---|
| `https://www.ikmultimedia.com/products/productmanager/` | **200** | Full marketing + download page (~139 KB historically; WebFetch 2026-09-25 OK) |
| `https://www.ikmultimedia.com/appcast.xml` | **404** | Dead — do not re-probe Sparkle |

**Live quotes (WebFetch 2026-09-25 PT):**
> `v.1.1.15 for Windows Download`  
> `v.1.1.15 for macOS Download`  
> repeated: `v.1.1.15 for Windows Download v.1.1.15 for macOS Download`  
> Body: *"The IK Product Manager gives you one central location to manage all the latest IK Multimedia products… registration, downloads, installation, authorization, checking for updates…"*  
> *"In the Software tab, you can easily check at a glance to see what's installed on your machine and check for available updates… New release? Click "Release Notes" to see what's new…"*  
> *"The IK Product Manager is designed to support all current product versions; therefore, all the legacy products are not supported and will continue to be handled by the previous Authorization Manager."*

Hubs REPORT (2026-09-24) ranked this **#8** this week: *"Only `v.1.1.15` public; product RNs inside PM."*

### Catalog posture (RO `catalog.db`)
- Manufacturer `ik-multimedia` → `portal_app = 'IK Product Manager'`.
- Tier-1 versionless `identity_kind='plugin'` diggable residual includes **48 IK Multimedia** rows (largest diggable mfg bucket) — mostly AmpliTube SKUs + Syntronik engines. Those are **hub-walled for per-SKU builds**, not diggable via this canary.
- Yellow `kvr-product-page` for IK: **104** rows — KVR ceiling, not PM-public.

### What this canary is / is not
| Is | Is not |
|---|---|
| Detection of Product Manager **app** semver bump (`v.X.Y.Z`) | Per-SKU AmpliTube / Syntronik version oracle |
| Weekly public HTML regex + optional installer HEAD | Authenticated Product Manager catalog crawl |
| Hub_app / manager row freshness signal | Excuse to stamp PM version onto plugin rows |

- **Recommendation:** Ship chip **`ik-pm-canary-v1`**:
  1. GET Product Manager page (curl OK — not WAF-stubbed).
  2. Regex: `v\.(\d+\.\d+\.\d+)\s+for\s+(Windows|macOS)`.
  3. Require Mac + Win agree on same triple; else open watch (do not publish split blindly).
  4. On bump: advisory `ik.product_manager_build` only — update the hub_app / Product Manager catalog row if present; **never** write `1.1.15` onto AmpliTube/SampleTank/Syntronik plugin rows.
  5. Cadence: **weekly** (manager ships slowly). On hash change → full parse.
  6. Optional: HEAD linked Windows/macOS installer URLs for `Last-Modified` corroboration.
  7. Mark manufacturer resolvability for product SKUs as `hub_walled` (detail `ik_product_manager`); manager row `open`.

- **If accepted, what changes in the engine:**
  - New playbook snippet under `playbooks/ik-multimedia.md` §Product Manager canary.
  - Vendor feed row: `feed_url = …/products/productmanager/`, `extract_expr = v\.(\d+\.\d+\.\d+)`.
  - Claim-ledger filter: IK Syntronik/AmpliTube versionless plugins stay out of dig queue once `hub_walled` backfill lands (TAXONOMY).
  - Stop-list: no Custom Shop / Past Releases / authenticated PM session.

- **Expected impact:** Honest manager freshness without burning dig budget on 48 IK versionless plugins. Clears hubs priority #8. Prevents false greens from PM version bleed.

- **Risks / caveats:**
  - Page copy may mention legacy Authorization Manager — do not parse that as tip.
  - Marketing page can lag a day behind in-app tip (rare).
  - IK may rename "Product Manager" → successor app; treat title/URL change as recipe break, not silent hold.
  - **Do not invent** product semvers from PM release-notes deep links without public HTML.

- **Suggested first step:** Land regex unit test against saved `/workspace/advisory-deep/hubs/raw/ik-pm.html` + live WebFetch fixture asserting tip `1.1.15` Mac==Win; wire weekly job; document DO-NOT-GRIND authenticated catalog.

- **New evidence since last verdict:** Live WebFetch 2026-09-25 reconfirms `v.1.1.15` public; hubs REPORT priority #8; RO diggable count 48 IK plugins.


---

## Appendix A — Page structure & regex fixtures

Observed public strings (WebFetch 2026-09-25), each must match canary:

```
FIXTURE_IK_PM_TIP = [
  "v.1.1.15 for Windows Download",
  "v.1.1.15 for macOS Download",
]
REGEX = r"v\.(\d+\.\d+\.\d+)\s+for\s+(Windows|macOS)\s+Download"
# Expect: {('1.1.15','Windows'), ('1.1.15','macOS')} — Mac==Win required
```

Negative fixtures (must **not** become tip):
- Mentions of legacy **Authorization Manager** without a `v.X.Y.Z` tip on the same line.
- In-app copy describing "Release Notes" button (narrative only).
- Firmware / sounds / hardware tab marketing without semver.

### Optional installer HEAD corroboration
If the page links direct DMG/EXE URLs, Muse may:
```
HEAD <windows_installer_url>
HEAD <macos_installer_url>
record Last-Modified + Content-Length
```
Use as corroboration only; HTML tip remains SoT. If HEAD 403/404, keep HTML tip.

## Appendix B — Hub-wall implications for the 48 diggable IK plugins

Live diggable residual under IK (tier-1, identity_kind=plugin, no current) is dominated by:
- AmpliTube brand SKUs (Brian May, Fender, MESA/Boogie, Orange, SVX, …)
- Syntronik engine SKUs (99, Blau, Bully, DCO-X, Galaxy, …)
- SampleTank alternate / Clavitube

**Correct post-canary classification:**
| Row class | resolvability | Rationale |
|---|---|---|
| Product Manager app (if catalogued) | `open` | Public PM page tip |
| AmpliTube / Syntronik / SampleTank SKUs | `hub_walled` detail=`ik_product_manager` | RNs inside authenticated PM |
| Yellow KVR IK rows (104) | `kvr_ceiling` until manufacturer angle | Do not re-KVR as dig |

Dig chips that still select Syntronik versionless rows after backfill are **bugs** in stop-query wiring.

## Appendix C — Cadence & alert design

| Event | Action |
|---|---|
| Tip unchanged | Weekly hold-refresh on manager row `verified_at` |
| Tip Mac≠Win | Open watch `ik_pm_platform_split`; do not publish |
| Tip bump | `ik.product_manager_build` advisory; diff previous tip |
| Page 404 / missing `v.` pattern | `recipe_break`; alert; keep last tip |
| New nav "All product versions" public matrix | Promote recipe review → may unlock SKU oracle |

## Appendix D — Relation to hubs matrix
Hubs REPORT §2: IK public channel **Partial**; confidence ceiling **Med** for PM app, **Low** for AmpliTube/T-RackS matrix. This chip implements that ceiling literally — Med canary shipped, Low SKU grind refused.


---

## Appendix E — Supported-products policy quote (legacy boundary)

Live page states Product Manager supports **current** product versions only; legacy stays on Authorization Manager. Implications for Muse:

1. A missing SKU inside PM UI is **not** proof of discontinuation by itself.
2. Legacy Authorization Manager is **out of scope** for this canary (no public tip page mined).
3. When IK sunsets a product from PM, catalog `discontinued` / freeze requires separate manufacturer evidence — not inferred from PM absence alone.

## Appendix F — Notification / preferences (non-version noise)

Page markets Notification Center and Preferences (download locations, auto-authorize). Scrapers must ignore these sections when hunting `v.X.Y.Z`. Only the download CTA lines carrying `v.` are tip-bearing.


---

## Appendix G — Hubs live URL verification row (IK)

From hubs REPORT §3 (2026-09-24 PT), still valid after 2026-09-25 re-fetch:

| Vendor | URL | HTTP | Bytes | Verdict |
|---|---|---:|---:|---|
| IK | `/products/productmanager/` | 200 | ~139 KB | **OK** — PM `v.1.1.15` |
| IK | `/appcast.xml` | 404 | — | DEAD |

DO-NOT-GRIND (hubs dossier): Product Manager authenticated catalog, Custom Shop, Past Release user-area.
