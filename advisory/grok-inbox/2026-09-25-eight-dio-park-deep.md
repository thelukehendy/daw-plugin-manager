# 8Dio — no public RN; park the grind (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Hub-walled / oracle-absent Tier-1 vendor **8Dio**. Assault and hubs digs found **no public version index**. Chips still risk burning budget on FAQ/support dead ends. Need an explicit **park** chip with FAQ-only posture.
- **Context / evidence:**

### Live URL verification (2026-09-25 PT)
| URL | HTTP | Bytes / note |
|---|---:|---|
| `https://8dio.com/a/faqs` | **200** | ~1.0 MB FAQ — **no version table** |
| `https://8dio.com/support` | **404** | Dead |
| Guessed Zendesk download article paths | **404** | Dead (hubs REPORT) |

Hubs REPORT rank **#10**: *"No public RN index; Zendesk download article 404. **Do not grind.**"* Confidence ceiling **Very Low**.

### Live FAQ quotes (WebFetch 2026-09-25) — update path is account/email, not public RN
> **How do I upgrade my libraries to their latest versions?**  
> *"If you wish to upgrade your libraries, please contact us at support@8dio.com and we can generate you custom upgrade codes, as well as check your account for available upgrades and updates."*

> **Can I automatically update my owned libraries?**  
> *"We do not currently have an automatic updating system. However, this is something we are working on adding as soon as possible."*  
> *"At the moment, all library updates are announced in our newsletter… We also automatically add the latest version of any library to customer accounts when it is released…"*

> **How Do I Download My Libraries**  
> Routes to account **Downloader** tab / download manager login — not a public changelog.

> **Never Received Serial Codes**  
> *"8dio Libraries do not need or use serial codes… downloaded using the 8dio downloader app, which can be installed from your account page."*

FAQ content is rich on Kontakt Player vs Full, batch resave, Soundpaint crossgrades, Prophet hardware — **zero** lines of the form `LibraryName vX.Y.Z (Month DD, YYYY)`.

### Catalog (RO)
- Manufacturer `8dio` exists; `portal_app` **null** (no structured hub_app oracle either).
- Libraries are Kontakt/Soundpaint content — closer to `unversioned_by_kind` / soundset posture than diggable plugin semver.

- **Recommendation:** Ship chip **`8dio-oracle-absent-park-v1`**:
  1. Set vendor posture `oracle_absent` / resolvability `hub_walled` or `structurally_blocked` with detail `8dio_account_updates_only`.
  2. **Quarterly** FAQ + homepage liveness only (HTTP 200 / title hash). Alert on FAQ disappearance or new "Release Notes" / "Changelog" nav item (promotion trigger → `open_pending`).
  3. Hard STOP for version digs, Zendesk guessing, Discord scraping, support-email scraping, account downloader automation.
  4. Newsletter is **not** a structured oracle (unreliable archival).
  5. If automatic updater ships publicly later: reopen recipe; until then park.

### Stop-query (mandatory)
```sql
-- never select 8dio rows for version discovery
WHERE m.id = '8dio'
  AND attempt_kind = 'version_discovery'
--> outcome = 'skip', note = 'resolvability-stop:oracle_absent_8dio_faq_only'
```

- **If accepted, what changes in the engine:**
  - Playbook `playbooks/8dio.md` — single page: park + quarterly liveness + promotion triggers.
  - Claim-ledger / dig queue exclusion for `manufacturer_id='8dio'`.
  - Hubs matrix row stays "No / FAQ only".

- **Expected impact:** Stops wasted dig chips; documents honest absence; frees budget for Waves/UA/EastWest/Output (hubs #1–4).

- **Risks / caveats:**
  - FAQ may add a buried version list someday — quarterly review catches it.
  - Soundpaint engine versions ≠ 8dio library versions — do not cross-stamp.
  - "Latest version added to account" language may tempt account scraping — **forbidden**.

- **Suggested first step:** Add stop-note to research attempts template; quarterly cron HEAD/GET FAQs; mark hubs #10 done-as-parked.

- **New evidence since last verdict:** Live FAQ 2026-09-25 reconfirms email/newsletter/account update path; `/support` 404; FAQs ~1 MB with no semver table.


---

## Appendix A — FAQ themes that look like version oracles (but aren't)

| FAQ theme | Why it is not an RN |
|---|---|
| Upgrade codes via support@8dio.com | Manual entitlement, not public tip |
| Newsletter announces updates | Unstructured; no archival API |
| Account Downloader tab | Auth-gated |
| "Latest version added to customer accounts" | Account-side; scrapable only with login (**forbidden**) |
| Kontakt 5/6/7 compatibility talk | Host engine, not library semver |
| Soundpaint crossgrade tables | Product mapping, not builds |
| Prophet X/XL discontinued hardware | Hardware SKU death ≠ library version |

## Appendix B — Quarterly liveness recipe

```
EVERY 90d:
  GET https://8dio.com/a/faqs
  assert HTTP 200 and body_len > 50_000
  hash title + H2 list
  IF new H2 matches /release notes|changelog|version history/i:
    emit 8dio.oracle_candidate_open_pending
    (human/Muse recipe review — do not auto-scrape yet)
  GET https://8dio.com/support → expect 404 (document if it returns)
NEVER: authenticate downloader; scrape Discord; email-harvest tips
```

## Appendix C — Catalog posture suggestion
| Field | Suggested value |
|---|---|
| `resolvability` | `hub_walled` or `oracle_absent` (if enum extended) / else `structurally_blocked` detail=`8dio_account_updates_only` |
| `portal_app` | leave null **or** set pseudo `8dio Downloader` only if Muse wants CTA honesty — still no version |
| Dig queue | excluded |
| Freshness queue | excluded (no version to refresh) |
| Portal liveness | optional homepage/FAQ URL only |

## Appendix D — Why hubs ranked #10 (park)
Relative to Waves/UA/EastWest/Output, 8dio returns **zero** public tip strings per hour of work. Parking is positive work: it protects dig budget and documents honesty to Luke ("we looked; oracle absent").


---

## Appendix E — Additional live FAQ quotes (download path)

> **Where can I download my libraries manually?**  
> *"All libraries on your account can be downloaded manually from the 'Instruments' tab of your account page."*

> **The New 8dio Downloader App**  
> *"The new 8dio Downloader links directly to your account does not require the use of serial codes."*

> **Can I automatically update my owned libraries?**  
> Reconfirmed: no automatic updating system yet; newsletter + account-side latest file.

These quotes are filed so future chips cannot claim "we never checked for an updater." We checked; it is absent.

## Appendix F — Soundpaint relationship
FAQ explains Kontakt vs Soundpaint engines and crossgrade tables. Soundpaint may have its own public versioning later — that would be a **different manufacturer/oracle chip**, not an 8dio Kontakt-library RN. Do not conflate.


---

## Appendix G — Hubs live URL verification row (8Dio)

| Vendor | URL | HTTP | Bytes | Verdict |
|---|---|---:|---:|---|
| 8Dio | `/a/faqs` | 200 | ~1 MB | **OK** but no versions |
| 8Dio | Zendesk download article | 404 | — | **DEAD** |

Recipe: Quarterly liveness; mark `oracle-absent`. DO-NOT-GRIND: Account downloader, support-email scraping, Discord-as-structured-oracle.
