# UVI Falcon marketing year-string canary (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Hub-walled Tier-1 — UVI. Real Falcon / soundbank builds flow through **UVI Portal** (account). Public marketing exposes a **year-string generation** ("Falcon 2026") but not a trustworthy numeric semver. Muse must canary the year without inventing `x.y.z`.
- **Context / evidence:**

### Live fetch (2026-09-25 PT)
| URL | HTTP | Notes |
|---|---:|---|
| `https://www.uvi.net/falcon` | **200** | Large marketing page (~1.1 MB historically); WebFetch OK |
| `https://www.uvi.net/uvi-portal` | **200** | ~425 KB storefront/portal marketing; login for installs |
| UVI Support "How to Update my Product…" (saved raw) | **200** (prior) | Portal-required update path |

**Live Falcon quotes (WebFetch 2026-09-25):**
> `What's new in Falcon 2026? by Venus Theory`  
> `Showcase 2026`  
> Heading block: **`Added in Version 2026`**  
> *"With Falcon 2026 we continue that tradition, bringing powerful new tools and sounds…"*  
> *"As always, all updates are free for registered users."*  
> New oscillators listed under 2026: Phase Shaper, SupraSaw, 8o8 Bass Drum, Grains — still **no** `Falcon 3.x.y` style tip on the marketing page.  
> Compatibility copy lists OS targets but **no** discrete build triple for Falcon itself.

**Portal / update-path quotes (hubs raw + live portal 200):**
> Support title: *How to Update my Product to the Latest Version*  
> *"…is required to update your UVI products"* → install/connect **UVI Portal**, login, then *"button to start the download and update processes"*.  
> Steps explicitly: **Install and Connect to UVI Portal** → **Download and Install**.  
> Live `uvi-portal` page is authenticated storefront (cart/invoice Livewire); **no public per-build RN table** in anonymous HTML.

Hubs REPORT rank **#9**: *"Marketing 'Falcon 2026'; builds in Portal only."* Confidence ceiling **Low–Med** (generation-year) / **Low** (numeric builds).

### Catalog (RO)
- `manufacturers.uvi.portal_app = 'UVI Falcon / Workstation'`.
- Structurally-blocked class already named: `uvi_portal_soundbank` (TAXONOMY / TIER1-ASSAULT).
- Diggable residual includes **1** UVI plugin row — do not treat year canary as unlocking soundbank greens.

- **Recommendation:** Ship chip **`uvi-falcon-year-canary-v1`**:
  1. Weekly GET `https://www.uvi.net/falcon`.
  2. Extract year tokens via:
     - `What's new in Falcon (20\d{2})`
     - `Added in Version (20\d{2})`
     - `Falcon (20\d{2})` in H1/H2 / video titles
  3. Persist `falcon_marketing_year` (integer) + content hash — **not** `observed_version`.
  4. On year bump (e.g. 2026→2027): emit `uvi.falcon_generation_year` advisory (Med/Low). Optionally set a **generation** lane if schema has one; **never** write `version=2026` / `version=3.0.0` invented.
  5. Portal marked `account-hub` / `hub_walled`. Liveness-only on portal URL; no login automation.
  6. Soundbanks stay `structurally_blocked` / `uvi_portal_soundbank` — banned re-probes.

### Explicit non-invention rule
```
IF only year-string matched:
  advisory.kind = falcon_generation_year
  advisory.version = null
  catalog.plugin.version UNCHANGED
ELSE IF numeric semver appears on a NEW public RN page later:
  open open_pending recipe review (separate chip)
NEVER: coerce "2026" → "2.0.2.6" or "26.0.0"
```

- **If accepted, what changes in the engine:**
  - Playbook `playbooks/uvi.md` — Falcon year canary + Portal DO-NOT-GRIND.
  - Optional `vendor_feeds` row with `extract_expr` documenting year-only.
  - Dashboard: treat Falcon year as hub generation signal, not green raise KPI.

- **Expected impact:** Detects Falcon generation marketing shifts early; prevents false semver claims; aligns with hubs #9 park-for-builds doctrine.

- **Risks / caveats:**
  - Marketing can say "2026" while Portal tip lags or vice versa.
  - Video titles / YouTube embeds may pollute regex — anchor to "Added in Version" / "What's new in Falcon" blocks first.
  - Falcon Expansions / soundware must not inherit Falcon year as version.
  - Manual PDF (~35 MB) is heavy; only optional offline changelog extract, not weekly.

- **Suggested first step:** Unit test on live WebFetch text asserting year `2026` present and **zero** invented semver writes; weekly hash job; document Portal as account-hub only.

- **New evidence since last verdict:** Live Falcon page 2026-09-25 confirms `Added in Version 2026` / `What's new in Falcon 2026?`; Portal still login-gated for builds.


---

## Appendix A — Year extraction fixtures (live 2026-09-25)

Positive (must extract year **2026**):
```
"What's new in Falcon 2026? by Venus Theory"
"Showcase 2026"
"Added in Version 2026"
"With Falcon 2026 we continue that tradition…"
"UVI FALCON VST 2026" (review/video titles — secondary; prefer "Added in Version" block)
```

Hard negatives (must not invent semver):
```
"Falcon 2" historical marketing remnants → not a tip triple
"Engine XT" / "15 years" → not Falcon version
Installer size "1 GB" / "1.2 GB" → not version
"macOS 10.14–15" → OS range, not Falcon 15
Factory "1,600 presets" → not 1.6.0
```

Proposed snapshot fragment:
```json
{
  "schema": "uvi-falcon-year-canary-v1",
  "source_url": "https://www.uvi.net/falcon",
  "falcon_marketing_year": 2026,
  "year_evidence": ["Added in Version 2026", "What's new in Falcon 2026?"],
  "numeric_semver_observed": null,
  "portal_required_for_builds": true
}
```

## Appendix B — Portal update path (saved support HTML)

From hubs raw `uvi-update.html` (title: *How to Update my Product to the Latest Version*):
- Update **requires** UVI Portal install + account login.
- Steps: Install/Connect Portal → Download/Install products.
- Sibling articles exist for slow downloads / product missing in Portal — still account-space.

Live `https://www.uvi.net/uvi-portal` (200, ~425 KB): anonymous HTML is marketing/cart chrome; **no** public Falcon build table. Catalog `portal_app = 'UVI Falcon / Workstation'` remains correct.

## Appendix C — Structurally blocked soundbanks
TAXONOMY detail `uvi_portal_soundbank` covers UVI Soundware / expansions updated only in Portal. Falcon year canary:
- **Does** signal instrument generation marketing.
- **Does not** authorize stamping year onto Atmospherics / Modular Waves / other soundware rows.
- Expansions listed on Falcon page as add-ons stay content SKUs.

## Appendix D — When to reopen numeric recipe
Promote Falcon from year-canary to `open` numeric only if Muse finds a **public** page/PDF with unambiguous `Falcon x.y.z` (or Sparkle/appcast). Until then ceiling stays Low–Med generation-year. Manual PDF (~35 MB) is optional offline research, not weekly automation.


---

## Appendix E — "Added in Version 2026" feature inventory (generation evidence)

Live page lists under **Added in Version 2026** (feature names — **not** semver components):

**New Oscillators:** Phase Shaper; SupraSaw; 8o8 Bass Drum; Grains  

**New Effects:** Bloom Reverb; Tube Amp; Vowels filter  

**New Modulations:** Voice Modulator; Flow Noise  

**New Event:** Chord Generator  

Muse may store these as `generation_features[2026]` for changelog UX. Storing them must not create fake versions like `2026.1` from "Phase Shaper."

## Appendix F — Pricing / licensing noise to ignore
Page shows `$299`, iLok "3 activations", channel configs to 10.2, sample rates to 192 kHz. None are Falcon build numbers.


---

## Appendix G — Hubs live URL verification row (UVI)

| Vendor | URL | HTTP | Bytes | Verdict |
|---|---|---:|---:|---|
| UVI | Falcon product page | 200 | ~1.1 MB | **OK** marketing |
| UVI | Portal page | 200 | ~425 KB | **OK** (account for builds) |
| UVI | Update how-to (Portal) | 200 | ~37 KB | **OK** |
| UVI | Falcon manual PDF | 200 | ~35 MB | **OK** (heavy; optional) |

DO-NOT-GRIND: UVI Portal login, SonicPass entitlement.
