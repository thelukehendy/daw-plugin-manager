# Waves RN diff algorithm — implementable chip `waves-rn-diff-v1` (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Waves public RN is the highest-yield hub oracle but Incapsula-blocks curl. Browser evidence chip already filed (`waves-browser-rn-evidence-deep`). Muse still needs a **compressed, implementable diff algorithm** — snapshot JSON schema + `generation_bump` vs hotfix rules — as chip **`waves-rn-diff-v1`**. This complements (does not rewrite) the browser evidence file.
- **Context / evidence:**

### Companion sources
| Artifact | Role |
|---|---|
| `/workspace/advisory-deep/hubs/WAVES-DIFF-SPEC.md` | Full fetch + parse + diff spec (compress here) |
| `/workspace/advisory-deep/hubs/WAVES-EXTRACT.md` | Browser DOM extract notes + V17 fixed-in scopes |
| Inbox `2026-09-25-waves-browser-rn-evidence-deep.md` | Fetch path / Incapsula / live quotes |
| Inbox `2026-09-25-waves-incapsula-oracle-deep.md` | WAF failure mode |

### Canonical URLs
- RN: `https://www.waves.com/downloads/release-notes`
- Offline pins: `https://www.waves.com/downloads/latest-offline-installer`

### Fetch gate (must precede parse)
```
PRIMARY: Playwright → networkidle → body_len > 5000 AND "Incapsula"/"SWJIYLWA" not in body
FALLBACK: browser-render WebFetch
FAIL: fetch_degraded=true; keep last good snapshot; NO advisories
NEVER: publish from 212-byte stubs
```

Cadence: hash RN daily; full parse on hash change; offline weekly or on RN change.

---

## Snapshot JSON schema (persist one object per successful fetch)

```json
{
  "schema": "waves-rn-diff-v1",
  "fetched_at": "2026-09-24T18:00:00-07:00",
  "source_url": "https://www.waves.com/downloads/release-notes",
  "content_sha256": "<hex>",
  "fetch_degraded": false,
  "generation_current": 17,
  "generation_events": [
    {
      "date": "2026-06-23",
      "generation": 17,
      "headline": "Across-the-board software update to V17",
      "features": ["…"],
      "bugfixes_narrative": ["…"]
    }
  ],
  "app_builds": {
    "Waves Central": {"version": "17.0.4", "date": "2026-08-02"},
    "eMotion LV1": {"version": "16.5.289.393", "date": "2026-04-27"},
    "SoundGrid Driver": {"version": "16.5.15.119", "date": null},
    "SuperRack": {"version": "15.15.12.23", "date": null},
    "Sync Vx": {"version": "16.8.136.297", "date": "2026-04-14"}
  },
  "new_plugins": {
    "Atlas Reverb": {"date": "2026-07-27"},
    "Curves Resolve": {"date": "2026-01-19"}
  },
  "fixed_in": {
    "2026-06-23": {
      "All Waves plugins": ["Sidechain toggling…"],
      "CR8": ["Global Output is saved correctly with presets."],
      "OVox": ["…"]
    }
  },
  "hotfixes": {
    "L4 Ultramaximizer": {"version": "1.0.1", "date": "2025-11-13"}
  },
  "offline": {
    "last_updated": "2026-06-23",
    "plugin_generation": 17,
    "pins": {
      "Waves Central": "16.7.2",
      "eMotion LV1": "16.5.289.393"
    },
    "plugin_inventory": ["Abbey Road Chambers"]
  }
}
```

**Sentinel / cohort keys (not SKUs):** `All Waves plugins`, `All Instrument plugins`, `Waves Applications`, family scopes like `Curves Series (AQ, Equator, Resolve)`.

---

## Parse algorithm (compressed)

```
text = html_to_visible_text(dom)  # prefer rendered DOM (WAVES-EXTRACT)
sections = split_on_date_headers(text)
  # /^\s*(January|…|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\s*$/

for section in sections:
  date = parse_date(section.header)

  if re.search(r'Across-the-board software update to V(\d+)', body, I):
      record generation_events; update generation_current
      attach "New Features & Improvements in Waves V{N}" / "Bug Fixes…"
         as narrative on the event ONLY
      # DO NOT stamp version=V{N} on every SKU
      # still scan nested Fixed-in / New Plugin in same section

  upsert app_builds from:
    Waves Central v(\d+(?:\.\d+)+)
    eMotion LV1 … v(\d+(?:\.\d+)+)
    SoundGrid Driver V(\d+(?:\.\d+)+)
    SuperRack … V(\d+(?:\.\d+)+)
    Sync Vx \((\d+(?:\.\d+)+)\)
    (+ MyRemote / other APP_PATTERNS allowlist)

  New Plugin:\s*([^\n–-]+) → new_plugins[name]=date

  Fixed in ([^:]+): → fixed_in[date][normalize(product)] = following bullets
    until next header; nested <ul> → direct children only (avoid double count)

  Hotfix Update:\s*(.+?)\s+v(\d+(?:\.\d+)+) → hotfixes[product]
```

Offline companion: `Last updated:` + `All Waves plugins V(\d+)` + Includes pin list + inventory under `Waves plugins V{N}:`.

---

## Diff algorithm (snapshot N-1 → N)

| Diff signal | Advisory kind | Severity | Catalog write rule |
|---|---|---|---|
| New `generation_events` with higher `generation` | **`waves.generation_bump`** | High | Update **bundle/generation** field only; **never** set `plugin.version = "17"` / `"V17"` on every Waves SKU |
| `app_builds[k].version` changed | `waves.app_build` | High (Central/LV1/Driver); Med else | That app row only |
| Key added to `new_plugins` | `waves.new_plugin` | Med | Candidate SKU insert; build often = current generation **label only** |
| `fixed_in[date][product]` new/changed | `waves.fixed_in` | Low–Med | Changelog snippet; **version unchanged** unless hotfix/app_build paired |
| `hotfixes[p].version` changed | **`waves.hotfix`** | Med | **That product's patch version only** |
| Offline pins / last_updated moved | `waves.offline_pin` | Med | Sync pin table |
| Inventory set-diff | `waves.inventory_delta` | Low | Name add/remove; no version from inventory alone |
| `fetch_degraded` | — | — | Suppress all publishes |

### Hard rule — generation_bump vs hotfix

```
ON "Across-the-board software update to V{N}":
  MUST emit exactly one waves.generation_bump {generation:N, date}
  MAY set plugin.waves_generation = N if schema has generation lane
  MUST NOT iterate catalog setting version=V{N}
  Per-SKU version updates ONLY from:
    - explicit Hotfix Update lines
    - product-specific build tuples in app_builds / named sections
    - offline pins that name a concrete build
```

Rationale (DIFF-SPEC): shared WaveShell generation ≠ per-product build (e.g. Sync Vx `16.8.136.297` after V16 day). Stamping gen creates false churn.

### Fixed-in / New Plugin rolling window
Keep **90 days** of `fixed_in` dates in snapshot for stable diffs; archive older. Emit `first_seen` when date key new.

### Confidence ladder
| Level | Condition |
|---|---|
| High | Browser OK + app_build or generation_event with date |
| Med | Browser OK + new_plugin / fixed_in / offline pin |
| Low | Inventory name-only; inferred generation without dated bulk line |
| None | `fetch_degraded` |

---

## Regression fixtures (quote-backed — assert in unit tests)

From WebFetch / browser extract 2026-09-24:

```
GEN: "All Waves Plugins: Across-the-board software update to V17" @ June 23, 2026
APP: "Waves Central v17.0.4 is now available" @ August 2, 2026
APP: "eMotion LV1 … v16.5.289.393" @ April 27, 2026
NEW: "New Plugin: Atlas Reverb" @ July 27, 2026
FIX: "Fixed in CR8:" under V17 Bug Fixes @ June 23, 2026
OFF: "Last updated: June 23rd, 2026" / "Waves Central 16.7.2" / "All Waves plugins V17"
```

V17 fixed-in scopes observed (26+): All Waves plugins; All Instrument plugins; Waves Applications; Curves Series; CLA MixHub; COSMOS; Curves AQ; Doubler; GTR Tool Rack; IDX; Immersive Wrapper; L4; Magma BB Tubes; MultiMod Rack; ReelADT; Waves Harmony; WLM Plus; H-EQ; RChannel; CR8; OVox; Scheps Omni Channel; StudioVerse; Sync Vx; TG12345; …

Parser tests MUST assert:
1. V17 bulk → **exactly one** `generation_event`
2. **Zero** SKU `version` writes from that event
3. Central `17.0.4` in `app_builds`
4. Atlas in `new_plugins`
5. CR8 key in `fixed_in[2026-06-23]`

### DOM pitfalls (from WAVES-EXTRACT)
- Date nodes: `<p class="waves-h4">June 23, 2026</p>`
- Nested `<ul>` under feature/fix items — count direct `<li>` children only
- Older dates may use ordinal suffixes (`June 23rd`)
- 331 date-heading nodes spanning 2026→2020 in full browser save (~757 KB HTML)

---

## DO-NOT-GRIND
- Central login / Creative Access APIs / `.cen` libraries  
- Forum-as-oracle  
- Blind `/appcast.xml` (also Incapsula-stubbed)  
- Catalog-wide `version=V17` stamp  

Softube contrast: `softube.com/release-notes` returns full HTML to plain curl (`2.6.42`) — Waves block is vendor WAF, not egress failure.

- **Recommendation:** Implement chip **`waves-rn-diff-v1`** as the Muse job behind Playwright fetch; store snapshots; emit advisory kinds above; wire generation lane separately from `version`.

- **If accepted, what changes in the engine:**
  - `playbooks/waves.md` — point primary oracle at browser fetch + this schema.
  - Snapshot store (JSONL or table) keyed by `content_sha256`.
  - Advisory publisher maps kinds → claim-ledger / version_observations rules.
  - Dashboard: Waves generation current + Central tip — not "all plugins V17 green."

- **Expected impact:** Highest hubs priority (#1) becomes shippable without false V17 mass raises; Fixed-in/New Plugin become structured channels.

- **Risks / caveats:**
  - Playwright flake → degraded mode must not clear snapshot.
  - Offline Central pin (`16.7.2`) can lag RN Central (`17.0.4`) — treat as distinct pins, don't force reconcile.
  - New Plugin names ≠ always first-ever release (historical archive noise).

- **Suggested first step:** Codify schema + fixture tests against saved `waves-rn-browser.html`; land Playwright job with degraded guard; disable any mass V17 writer if present.

- **New evidence since last verdict:** Compressed from WAVES-DIFF-SPEC + EXTRACT; complements existing browser/Incapsula inbox chips without duplicating fetch narrative.


---

## Appendix A — Advisory record shape (downstream)

```json
{
  "kind": "waves.generation_bump",
  "generation": 17,
  "date": "2026-06-23",
  "headline": "Across-the-board software update to V17",
  "source_url": "https://www.waves.com/downloads/release-notes",
  "content_sha256": "…",
  "confidence": 90,
  "catalog_writes": [
    {"field": "waves_generation", "value": 17, "scope": "all_waves_skus_optional"},
    {"field": "version", "value": null, "scope": "forbidden_mass_write"}
  ]
}
```

```json
{
  "kind": "waves.hotfix",
  "product": "L4 Ultramaximizer",
  "version": "1.0.1",
  "date": "2025-11-13",
  "catalog_writes": [
    {"field": "version", "value": "1.0.1", "scope": "plugin_id_matched_only"}
  ]
}
```

## Appendix B — Pseudocode Muse job

```
def waves_rn_job():
  html, meta = playwright_fetch(RN_URL)
  if degraded(html):
    alert("waves_oracle_blocked"); return
  snap = parse_waves_rn(html, fetched_at=now())
  off = parse_waves_offline(playwright_fetch(OFFLINE_URL))
  snap["offline"] = off
  prev = load_last_snapshot("waves-rn-diff-v1")
  save_snapshot(snap)
  if prev is None: return
  for adv in diff_waves(prev, snap):
    publish_advisory(adv)
```

## Appendix C — Interaction with yellow KVR Waves rows
~32 yellow `kvr-product-page` Waves rows should **not** dig via KVR once this oracle ships. Promotion path: manufacturer RN evidence @≥70 → `resolvability=open` (or keep generation lane separate). Fixed-in-only mentions still do not raise per-SKU version without hotfix/app_build.


---

## Appendix D — Historical `New Plugin:` name fixtures (from browser EXTRACT)

Use as parser recognition corpus (not all are 2026 tips):

Atlas Reverb; Curves Resolve; Magma StressBox; L4 Ultramaximizer; Clarix LB; InTrigger; Curves AQ; Sync Vx; Immersive Wrapper; IDX Intelligent Dynamics; Curves Equator; Space Rider; Feedback Hunter; Silk Vocal; Magma Springs; Key Detector; Clarity Vx DeReverb; Clarity Vx DeReverb Pro; Voltage Amps; Magma Tube Channel Strip; BB Tubes; Lil Tube; Waves Harmony; Nx Germano Studios New York; Clarity Vx; Clarity Vx Pro; CR8 Creative Sampler; COSMOS AI-Powered Sample Finder; Retro Fi; Lofi Space; SSL EV2; CLA Nx; Vocal Bender.

Parser should capture `New Plugin: <name>` into `new_plugins` map keyed by cleaned name. Diff emits only **first seen** relative to previous snapshot (90-day / full-history per Muse storage choice). Do not backfill catalog versions for historical names on first snapshot load — first run is baseline.

## Appendix E — Softube calibration one-liner
Same-week Softube RN curl success (`2.6.42` Aug 21, 2026) proves Waves Incapsula is vendor-specific. Do not "fix egress" by disabling Waves browser path when Softube works.
