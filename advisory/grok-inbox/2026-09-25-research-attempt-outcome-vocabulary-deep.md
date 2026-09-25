# research_attempts outcome / note vocabulary — one dialect for Muse chips

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Chips invent free-text `research_attempts.note` strings (`resolvability-stop:…`, FAQ parks, Incapsula stubs, hold refreshes). Without a **standard vocabulary**, stop-queries, dashboards, and Luke-facing digests cannot aggregate. Muse needs one dialect tied to TAXONOMY / RETRACTION / FRESHNESS.
- **Context / evidence:**
  - Engine today (`DATABASE-ORGANIZATION.md`): `outcome ∈ {observed, promoted, skipped}` — claim ledger, not version data.
  - TAXONOMY: banned dig → `outcome='skipped'`, `note='resolvability-stop:<value>'`.
  - Yellow KVR appendix C already sketches stop grammar; Waves/Incapsula chips use ad-hoc `fetch_degraded`; Acoustifier watches lack a stable prefix; FRESHNESS hold-refresh often writes nothing visible in the ledger.
  - Live plateau: researched≫promoted (e.g. 2026-09-24: 263 researched, 0 promoted) — **outcome composition is the KPI**, so notes must be machine-countable.

---

## Core outcomes (keep stable — do not invent new top-level values lightly)

| `outcome` | Meaning | When to use |
|---|---|---|
| `promoted` | New/changed accepted current via `plugin_version_current` | Raise **or** manufacturer-confirmed decrease landed |
| `observed` | Evidence written (candidate/accepted sibling) but current pointer unchanged | Tip matches current; or candidate parked for review |
| `skipped` | Claim closed **without** a useful version write | Resolvability stop, park, identity block, canary-only no-op |
| `claimed` | Transient lease — must not linger | Claim start only; finalize before chip exit |

**Proposed additive outcomes** (optional schema note; if Muse prefers keep three, fold into `skipped`/`observed` + note prefix):

| Additive | Prefer fold-into | Note prefix |
|---|---|---|
| `fetch_degraded` | `skipped` or `observed` (no tip) | `fetch_degraded:…` |
| `watch` | `skipped` | `watch:…` |
| `hold` | `observed` | `hold:…` |

**Rule:** Prefer **stable `outcome` + structured `note` prefix** over proliferating enum values. Dashboards GROUP BY `substr(note,1,…)` / prefix.

---

## Standard note prefixes (the dialect)

### 1. `skip:resolvability-*`  (TAXONOMY)

Maps 1:1 to `plugins.resolvability` (and detail). Chip must **not fetch** after this skip.

| Prefix | When | Dig posture |
|---|---|---|
| `skip:resolvability-kvr_ceiling` | Best public source is KVR; no new manufacturer angle | Freshness stamp only / long SLA |
| `skip:resolvability-hub_walled` | Exact builds behind account hub | Hub_app / portal CTA only |
| `skip:resolvability-structurally_blocked` | soundset / Spitfire lib / UVI bank / DAW-bundled / Steinberg DA | Hard ban |
| `skip:resolvability-unversioned_by_kind` | identity_kind implies no discrete plugin version | Never version-dig |
| `skip:resolvability-discontinued_frozen` | Discontinued freeze | No churn dig |
| `skip:resolvability-needs_identity` | gen_ambiguous / suite unresolved | Block until identity chip |
| `skip:resolvability-open_pending-no-angle` | Believed diggable but manufacturer angles exhausted this window | Revisit on new URL intel |
| `skip:resolvability-oracle_absent` | Documented park (e.g. 8dio FAQ-only) | FAQ canary only |

**Alias (legacy → normalize on write):**  
`resolvability-stop:<x>` ⇒ `skip:resolvability-<x>`  
`no-new-angle:manufacturer-exhausted` ⇒ `skip:resolvability-open_pending-no-angle`

Claim-ledger INSERT guard: reject digs whose resolvability ∈ hard-stop set (TAXONOMY defect fix).

### 2. `skip:pa-bundle`  (PA identity)

Plugin Alliance handle maps to a **bundle / suite installer**, not a discrete effect SKU tip.

Examples:
- `skip:pa-bundle:handle=bx_console_*_bundle`
- `skip:pa-bundle:identity=bundleish-histogram`

Never stamp bundle `updated_at` / products.json churn as per-plugin version (PA FALSE SIGNAL — wave-4 closed list).

Companion: `pa-handle-inventory-and-identity-map-deep` (~27 bundleish / 280 handles).

### 3. `fetch_degraded:incapsula`  (hubs / Waves)

Fetcher reached an edge but tip extraction failed in a **known recoverable** way.

| Prefix | Vendor / signal | Next action |
|---|---|---|
| `fetch_degraded:incapsula` | Waves curl 212 B stub / `SWJIYLWA` | Escalate Playwright/WebFetch; do **not** mark oracle dead |
| `fetch_degraded:cloudflare` | Valhalla/other challenge interstitial | Browser escalate; keep curl first next pass |
| `fetch_degraded:empty-parse` | HTTP 200 but regex set empty | Canary fail if control-group; else retry/render |
| `fetch_degraded:timeout` | Soft timeout / partial body | Retry budget; don't promote silence as hold without verified fetch |
| `fetch_degraded:waf-unknown` | Non-Incapsula block page | Classify once; add vendor row to hub matrix |

**Anti-pattern:** writing `skipped` + free text `"waf?"` — uncountable. Always prefix.

Waves companion: `waves-incapsula-oracle-deep` + `waves-browser-rn-evidence-deep` (756 KB SUCCESS vs 212 B stub).

### 4. `watch:retraction`  (RETRACTION)

Downward / split tip detected; not yet promoted.

| Prefix | Class (RETRACTION taxonomy) |
|---|---|
| `watch:retraction:vendor_retract` | True pull of newer public installer |
| `watch:retraction:mac_current_split` | Mac tip older than Win (Acoustifier teaching case) |
| `watch:retraction:stale_third_party` | KVR/reseller ahead of manufacturer — do not decrease on KVR alone |
| `watch:retraction:false_alarm` | Transient 404 / wrong cell — no write |
| `watch:retraction:identity_correct` | Contamination / wrong gen — route to identity chip, not “retraction” UX |

Acoustifier fixture note shape:
```
watch:retraction:mac_current_split tip=1.0.18 win=1.0.19 article=4849510029085
```
Promote only after identity guards + Mac-current policy (SSL datalink parser deep).

### 5. `hold:verified_at-refresh`  (FRESHNESS)

Tip **matches** current accepted version; sweep still advances verification time.

| Prefix | Meaning |
|---|---|
| `hold:verified_at-refresh` | Current unchanged; `version_observations.verified_at` (and/or current row touch) advanced |
| `hold:verified_at-refresh:canary` | Control-group canary hold (FabFilter/Goodhertz/Valhalla) |
| `hold:sla-met` | Within SLA; optional no-op sampling note |
| `hold:overdue-cleared` | Was overdue; re-fetch confirmed tip; queue drain |

**Invariant (TIER1-REFLECT / FRESHNESS):** a hold that does **not** refresh `verified_at` is a bug (Melda/FabFilter sticky-queue). Ledger must show `hold:verified_at-refresh` whenever the chip claims “checked, still current.”

Outcome for holds: prefer **`observed`** (evidence of check) + note prefix — not `skipped` (skipped implies “did not usefully check”).

---

## Full example rows (copy-paste fixtures)

```
-- Dig stop
outcome=skipped  note=skip:resolvability-kvr_ceiling extract=kvr-product-page
outcome=skipped  note=skip:resolvability-hub_walled portal=Native Access
outcome=skipped  note=skip:resolvability-structurally_blocked detail=spitfire_app_gated_library
outcome=skipped  note=skip:pa-bundle handle=bx_masterdesk

-- Fetch edge
outcome=skipped  note=fetch_degraded:incapsula url=waves.com/downloads/release-notes bytes=212
outcome=skipped  note=fetch_degraded:cloudflare url=valhalladsp.com/shop/reverb/valhalla-supermassive/

-- Retraction watch
outcome=skipped  note=watch:retraction:mac_current_split plugin=ssl--ssl-acoustifier tip=1.0.18

-- Freshness hold
outcome=observed note=hold:verified_at-refresh tip=4.13 source=fabfilter-download
outcome=observed note=hold:verified_at-refresh:canary vendor=goodhertz tip=3.14.1
```

---

## Chip / SQL contracts

### A. Stop-query exclusion (dig chips)

```sql
-- Do not re-claim hard skips inside the claim TTL window
AND NOT EXISTS (
  SELECT 1 FROM research_attempts ra
  WHERE ra.plugin_id = p.id
    AND ra.attempted_at >= datetime('now', '-7 days')
    AND (
      ra.note LIKE 'skip:resolvability-%'
      OR ra.note LIKE 'resolvability-stop:%'   -- legacy
      OR ra.note LIKE 'skip:pa-bundle%'
    )
);
```

### B. Dashboard dialect counts (24h)

```sql
SELECT
  CASE
    WHEN note LIKE 'skip:resolvability-%' OR note LIKE 'resolvability-stop:%' THEN 'skip:resolvability'
    WHEN note LIKE 'skip:pa-bundle%' THEN 'skip:pa-bundle'
    WHEN note LIKE 'fetch_degraded:%' THEN 'fetch_degraded'
    WHEN note LIKE 'watch:retraction%' THEN 'watch:retraction'
    WHEN note LIKE 'hold:verified_at-refresh%' THEN 'hold:verified_at-refresh'
    WHEN note LIKE 'canary:%' THEN 'canary'
    ELSE 'other'
  END AS dialect,
  outcome,
  COUNT(*) AS n
FROM research_attempts
WHERE attempted_at >= datetime('now', '-1 day')
GROUP BY 1, 2
ORDER BY n DESC;
```

### C. Waves health flag

```sql
SELECT COUNT(*) AS waves_incapsula_degraded_24h
FROM research_attempts
WHERE attempted_at >= datetime('now', '-1 day')
  AND note LIKE 'fetch_degraded:incapsula%';
```

---

## Migration / authoring rules for Muse

1. **New chips MUST use prefixes above** in NOTES and claim finalizers.
2. Normalize legacy `resolvability-stop:*` → `skip:resolvability-*` on write (read tolerates both for 1 sprint).
3. Do not encode semver inside the prefix token; put tip after whitespace (`tip=…`).
4. Never use `skipped` for a successful hold-check — that hides freshness work in the researched→promoted ratio.
5. Tie every prefix family to an integrity doc: TAXONOMY · PA inventory · hubs Waves · RETRACTION · FRESHNESS.

- **If accepted, what changes in the engine:** claim finalizer helper `note_dialect.encode(...)`; dashboard widgets (sibling file) GROUP BY dialect; lint in chip CI rejects free-text-only notes on tier-1.
- **Expected impact:** One dialect across Waves/PA/yellow/freshness/retraction. Enable honest plateau KPIs without Luke reading prose notes.
- **Priority:** P0 with taxonomy W1 / freshness W2 (vocabulary lands with schema v7 + hold-refresh).
