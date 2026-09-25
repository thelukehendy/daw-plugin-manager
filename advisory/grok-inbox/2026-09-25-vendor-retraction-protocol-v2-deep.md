# Vendor retraction protocol v2 — stress-test + hardened triggers

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (Wave 8 Ask 2)
- **Problem:** Stress-test adopted protocol v1 (`refs/2026-09-25-vendor-retraction-protocol-deep.md` / Acoustifier-centric) against three real integrity incidents. Close gaps with **pre-registered triggers**, **evidence thresholds**, and **exact operator actions**.
- **Verdict up front:** **v1 broke on all three cases.** Acoustifier A/B path still stands. Gaps are: (1) raise-time / gen-scoped identity, (2) URL/oracle poison outside version decreases, (3) bulk generation/suite anti-stamp. v2 keeps v1 taxonomy A–E and adds Classes F–H + trigger registry T0–T12.

---

## 0. What v1 got right (do not throw away)

| Keep | Why |
|---|---|
| Classes A `vendor_retract` / B `mac_current_split` | Acoustifier golden path |
| Manufacturer-only decrease; no KVR-only drop | Prevents third-party vandalism |
| No decrease on fetch failure | CDN flap / 429 / Incapsula stub |
| Filename ≻ folder / stale label | SSL X-Comp / Auto* lessons |
| Suite→component guard (Softube 2.6.42) | Correct class of bug — under-specified |
| Watch→promote consecutive confirm | False-positive brake |
| Separate UI for `identity_correct` vs retract | Metrics honesty |

**v1 failure mode in one line:** it is a **decrease-shaped** procedure that assumes the oracle already speaks for the correct product identity. Two of three incidents are **raise-time / oracle-identity** crimes; one is **URL integrity**, not version at all.

---

## CASE FILE 1 — D16 version contamination (Fazortan / Redoptor / Syntorus / Toraverb)

### Facts (catalog notes + live 2026-09-25 PT)

| Fact | Evidence |
|---|---|
| Incident date | **2026-09-14 PT** — `NOTES-10x-2026-09-14.md` |
| Contaminated SKUs | `d16-group--fazortan`, `--redoptor`, `--syntorus`, `--toraverb` |
| Wrong stamp | Successor-gen **2.2.2** @60 from **KVR** |
| Correct gen-1 final | **1.4.0** @95 from official D16 Products History / Compatibility Chart (compiled 2026-07-22) |
| Classification used | Recorded as **data-integrity correction**, not raise — matches Class C |
| Live gen-1 product URL | `https://d16.pl/fazortan` serves **only** `cdn.d16.pl/installers/Fazortan2/Fazortan2-2.2.2.*` (fixture `fixtures/wave8/retract/d16-fazortan-page-cdn-links.txt`) |
| Live CDN | `Fazortan2-2.2.2.dmg` HEAD 200; `Fazortan/Fazortan-1.4.0.dmg` HEAD 200 (both fixtures) |
| Playbook standing rule | Gen-1 URLs often serve gen-2 installers — only accept onto matching gen-2 store ids (`playbooks/d16-group.md`) |

### Would v1 have caught it?

| Question | Answer |
|---|---|
| **Prevention (before stamp)?** | **NO.** v1 decision tree starts `on freshness re-fetch … if V < C`. The crime is a **raise** of gen-2 onto gen-1. Raise-path identity guards are named ("identity mismatch?") but **not operationalized** — no trigger, no threshold, no refuse-raise action. |
| **Detection after contamination via normal product-page freshness?** | **NO — hard break.** After C=2.2.2, re-fetch `/fazortan` still parses `Fazortan2-2.2.2` → **V == C → HOLD**. S1–S5 never fire. Contamination is **stable-false-green**. |
| **Detection via Products History oracle?** | **Only if** that oracle is wired and gen-scoped. v1 Tier A lists "D16 History / Compatibility + CDN" as watchlist seed text, but S3 says "oracle top version < catalog" without **gen-matching**. A naïve History parse that returns "2.2.2" for the Fazortan *family* would HOLD or raise, not correct. |
| **How fast if human noticed History 1.4.0?** | Manual integrity chip same day (actual path). Protocol automation: **undefined / never**. |
| **Class if somehow V=1.4.0 < C=2.2.2?** | Acceptance test #4 correctly wants `identity_correct` not `vendor_retract`. Decision tree line is vague: "identity mismatch **suspected**" — no suspicion criterion. |

### Where v1 is vague / wrong

1. **"Identity mismatch suspected"** is not a predicate — no CDN-family vs `plugin_id` gen check, no KVR-vs-manufacturer gen gate.
2. **Signals assume same-identity oracle.** Contaminated product pages remain self-consistent at the wrong generation.
3. **No raise-time refuse.** Confidence raise chips repeatedly *skipped* Fazortan gen-1 @2.2.2 (NOTES-confidence-raise-1/3/4/5/8/18/22) — tribal knowledge, not protocol.
4. **Watch protocol is Acoustifier-shaped** (Mac/Win). No `IDENTITY_WATCH` with gen-pair `{gen1_id, gen2_id, forbidden_cdn_prefix}`.

### Case outcome vs v1: **BREAK** (prevention miss + post-stamp silent HOLD)

---

## CASE FILE 2 — Lindell expired-domain / hijack catch

### Facts

| Fact | Evidence |
|---|---|
| First flag | **2026-09-14 PT** — `lindell-audio` `website_url` `www.lindellplugins.com` → parked gambling (`NOTES-10x-2026-09-14.md`) |
| Confirmed + healed | **2026-09-15 PT** — Chinese spam/betting link-farm; domain expired & re-registered; `website_url` re-pointed to `https://www.plugin-alliance.com/collections/lindell-audio` (`NOTES-10x-2026-09-15.md`) |
| Earlier dig note | `lindellplugins.com did not respond from this host` (NOTES-lindell-eventide-etc.md, 2026-09-09) — soft miss before hijack visible |
| Live 2026-09-25 PT | `https://www.lindellplugins.com/` → **301** `https://www.DropCatch.com/domain/lindellplugins.com` (fixture `lindellplugins-head.txt`) |
| Replacement live | PA Lindell collection HTTP 200 (fixture `pa-lindell-collection-head.txt`) |
| Scope | 11 Lindell plugin rows + manufacturer website CTA — **not** a version decrease |

### Would v1 have caught it?

| Question | Answer |
|---|---|
| **In scope of v1?** | **NO.** v1 is version downward-correction. Hijack is **URL / CTA integrity**. |
| **S1 installer URL status?** | Does not apply — `website_url`, not installer CDN. Even if treated as oracle: hijack returns **200/301 with hostile content**, not 404 — Guard #1 "no decrease on fetch failure" does not fire; worse, a version parser on spam HTML could invent garbage tips. |
| **PORTAL-LIVENESS sibling?** | Exists (`advisory-deep/integrity/PORTAL-LIVENESS.md`) with `hard_dead` / `soft_404` — **not wired into retraction protocol v1**. Soft-200 parked/gambling pages need content classifiers v1 never names. |
| **How fast historically?** | Flag day-of chip (~hours once a human opened the URL); heal next chip (~24h). Protocol automation: **absent**. |

### Where v1 is vague / wrong

1. **No Class for oracle/CTA poison** (`portal_poison` / `url_integrity`).
2. **No trigger** for registrant change, DropCatch/Sedo/parkDNS, gambling keywords, language mismatch vs manufacturer locale.
3. **"No decrease on fetch failure"** can be misread as "ignore dead websites" — opposite of needed CTA honesty.
4. Operator action undefined: replace `website_url` / `update_portal_url`, freeze version oracles pointing at host, alert data-integrity (thread-worthy) — none of this is retraction-watch JSONL.

### Case outcome vs v1: **BREAK** (out of scope; poison oracle unhandled)

---

## CASE FILE 3 — Waves V17 across-every-SKU rule

### Facts (refs, 2026-09-24/25 evidence)

| Fact | Evidence |
|---|---|
| Bulk line | `All Waves Plugins: Across-the-board software update to V17` @ **June 23, 2026** |
| Correct emit | Exactly one `waves.generation_bump`; optional `waves_generation=17` lane |
| Forbidden | Iterate catalog `plugin.version = "17"` / `"V17"` |
| Per-SKU version only from | Hotfix lines, named app_builds, offline pins with concrete builds |
| Cohort Fixed-in keys | `All Waves plugins` etc. are **not** SKUs |
| Same-class Softube | Suite **2.6.42** naming Monoment Bass / Parallels / Statement Lead as *fixed* — not SKU versions (`softube-rn-suite-vs-sku-deep`) |
| Surge chip discipline | 2026-09-15 Waves boundary: "V17 generational mentions were NOT stamped as versions (zero-trust held)" |

### Would v1 have caught it?

| Question | Answer |
|---|---|
| **Prevention of mass stamp?** | **NO.** Guard #5 says "No suite→component stamp when suite version appears **lower**" — decrease-path wording. Mass **raise** of V17 onto every SKU is the actual hazard; v1 does not forbid it. |
| **After wrong mass stamp, then undo?** | Partial disaster: hundreds of `V < C` candidates → mass `RETRACTION_WATCH` / false `vendor_retract` metrics. Correct class is **identity / generation-lane abuse**, not vendor pullback. Acoustifier 1–2 chip watch **does not scale** to ~250 Waves SKUs. |
| **S3 article top regression?** | Generation event is not a semver tip; comparing `"17"` to Central `17.0.4` or Sync Vx `16.8…` without lane separation is undefined. |
| **Cross-link to Waves/Softube refs?** | Risks section names Softube trap; **no trigger ID**, no operator "emit generation_bump only". |

### Where v1 is vague / wrong

1. Guard #5 is necessary but **asymmetric** (guards lower, not higher bulk stamps).
2. No pre-registered **bulk-event deny list** (Waves Across-the-board VN, Softube "Release Notes for version X.Y.Z", FLUX:: "All plugins" build lines, etc.).
3. No evidence threshold distinguishing `generation_event` / `suite_train` from `sku_version`.
4. Decrease machinery would **launder** a bulk undo as retractions.

### Case outcome vs v1: **BREAK** (no prevent; misclassify mass undo)

---

## Stress-test summary

| Case | Caught by v1? | Speed if any | Break class |
|---|---|---|---|
| D16 contamination | No (silent HOLD post-stamp; raise-time vague) | Manual only | Gen-oracle identity |
| Lindell domain hijack | No (out of scope) | Manual ~24h heal | URL / CTA poison |
| Waves V17 mass stamp | No prevent; undo misrouted | N/A | Bulk generation lane |

**v1 is not "unbroken."** It is correct for Acoustifier-class A/B and incomplete for the integrity surface that already burned the catalog.

---

## PROTOCOL v2

### Design principles

1. **Raise-time and decrease-time share one trigger registry** — contamination is prevented, not only cleaned.
2. Every trigger has: **ID · detect · evidence threshold · operator action · class · abort**.
3. **Bulk / generation / suite events never write `plugins.latestVersion`.**
4. **URL integrity is first-class** beside version integrity (wire PORTAL-LIVENESS classifiers into the same dashboard).
5. Prefer **refuse / freeze / re-point** over decrease when the tip is identity-wrong or the host is poisoned.
6. Keep Acoustifier watch→promote for true A/B.

### Extended taxonomy (v1 A–E + F–H)

| Class | Code | Meaning | Action |
|---|---|---|---|
| A | `vendor_retract` | Vendor removed/replaced newer public installer | Accept lower @ mfr confidence |
| B | `mac_current_split` | Mac installer older than Win (tracked = Mac) | Accept Mac-current; Win in evidence |
| C | `identity_correct` | Wrong product/gen/framework/SKU stamped | Accept correct identity version; **never** label retraction |
| D | `stale_third_party` | KVR/reseller diverge | Prefer manufacturer; no KVR-only decrease |
| E | `false_alarm` | Transient 404, flap, bad cell | No write; log watch |
| **F** | **`portal_poison`** | website/portal/oracle host parked, hijacked, DropCatch, gambling, soft-404 masquerade | **Re-point or blank CTA**; freeze version parses from that host; alert integrity |
| **G** | **`bulk_stamp_forbid`** | Generation/suite/cohort event misused as per-SKU version | **Refuse write**; emit generation/suite advisory only |
| **H** | **`oracle_scope_mismatch`** | Filename/CDN family ≠ store gen / suite≠component / host≠instrument | Refuse raise; open IDENTITY_WATCH; optional decrease only with gen-scoped mfr oracle |

**First-class watchlists:** A, B (retraction); C, H (identity); F (URL); G (parse policy). D/E remain guards.

---

### Pre-registered trigger registry

#### T0 — Acoustifier dual-platform (v1 preserved)

| Field | Spec |
|---|---|
| **Detect** | Mac filename ver ≠ Win; catalog == higher; optional explicit split label |
| **Evidence** | Official support article `data-link` / installer filenames; article `updated_at` |
| **Threshold** | Explicit vendor split text → **promote immediately**. Else Mac < catalog across **≥2** healthy chips (≥24h) |
| **Operator action** | Open/bump `mac_current_split` watch; on resolve accept Mac ver; store Win in evidence; reasons `mac-current-dual-platform` |
| **Abort** | Mac catches up; oracle unhealthy |
| **Class** | B |

#### T1 — Gen-family CDN / URL mismatch (D16 teaching)

| Field | Spec |
|---|---|
| **Detect** | Parsed installer path or product href contains successor marker (`2`, `II`, `Mk2`, `Pro` per playbook map) while `plugin_id` is predecessor gen; OR CDN folder `Family2` used as evidence for `Family` id |
| **Evidence** | Playbook `gen_pairs` table (e.g. fazortan↔fazortan-2); live CDN HEAD; product page link extract |
| **Threshold** | **One** confirmed path mismatch → refuse raise. Decrease only if gen-scoped mfr History/Compat lists predecessor final ver **and** identity guards pass |
| **Operator action** | `skip:identity-gen-mismatch`; open IDENTITY_WATCH `{plugin_id, sibling_id, bad_url, tip}`; never HOLD on contaminated tip as "verified" |
| **Abort** | Sibling id missing → `needs_identity` resolvability, no version write |
| **Class** | H → C when correcting |

**D16 fixture assert:** `/fazortan` → only `Fazortan2-2.2.2.*` ⇒ **refuse** stamp onto `d16-group--fazortan`; tip may apply to `d16-group--fazortan-2` only.

#### T2 — KVR tip > manufacturer gen-final (contamination raise gate)

| Field | Spec |
|---|---|
| **Detect** | Candidate from KVR/crowdsource; manufacturer History/Compat or gen-1 CDN shows lower final for **same** store id |
| **Evidence** | Manufacturer document dated; CDN filename on official host matching **exact** family folder |
| **Threshold** | Manufacturer gen-scoped tip wins @≥90; KVR cannot raise above it for that id |
| **Operator action** | Refuse KVR raise; if catalog already higher → `identity_correct` decrease to mfr final (D16 2.2.2→1.4.0 pattern) |
| **Class** | C (decrease) / refuse-raise |

#### T3 — Suite / generation bulk event (Waves V17 + Softube 2.6.42)

| Field | Spec |
|---|---|
| **Detect** | Regex/playbook markers: `Across-the-board software update to V(\d+)`; `Release Notes for version (X.Y.Z)`; `All (Waves )?plugins`; Softube fixed-product list under suite train; FLUX:: "All plugins" unified build |
| **Evidence** | Full browser/RN snapshot when WAF; curl OK for Softube |
| **Threshold** | **Any** match → Class G; **zero** SKU `version` writes from that event |
| **Operator action** | Emit `waves.generation_bump` / `softube.suite_signal` / equiv; optional `waves_generation` / `softube_suite_version` diagnostic fields; enqueue named products for **independent** oracle digs only |
| **Abort** | `fetch_degraded` (Incapsula stub) → no emit, keep last good |
| **Class** | G |

#### T4 — Cohort Fixed-in / "New Plugin" ≠ version (Waves)

| Field | Spec |
|---|---|
| **Detect** | `Fixed in <Name>:` / `New Plugin: <Name>` without `Hotfix Update: … vX.Y.Z` |
| **Threshold** | Fixed-in → changelog only; New Plugin → candidate SKU insert without inventing build from generation |
| **Operator action** | Write advisory kinds per Waves diff spec; no mass version |
| **Class** | G (policy) |

#### T5 — Host / framework / player stamp

| Field | Spec |
|---|---|
| **Detect** | Kontakt/SINE/UAD Version History/Central/Play edition tip applied to content SKU without policy |
| **Threshold** | Playbook allowlist only (e.g. UA DSP train onto DSP rows with standing convention) |
| **Operator action** | Refuse; `skip:identity-host-stamp` |
| **Class** | H |

#### T6 — True installer retraction (v1 S1/S2 core)

| Field | Spec |
|---|---|
| **Detect** | Prior manufacturer installer URL 200 → 404/410 **or** filename ver strictly less on same identity |
| **Evidence** | Same product identity; official CDN/support; **not** KVR |
| **Threshold** | ≥2 healthy chips **or** explicit vendor "pulled/replaced" text → promote `vendor_retract` |
| **Operator action** | Open RETRACTION_WATCH; promote decrease with reasons `vendor-retract`, `prior-current`, oracle, evidence |
| **Abort** | Fetch failure; identity mismatch → hand to T1/T2 |
| **Class** | A |

#### T7 — Article/changelog top regression (v1 S3 refined)

| Field | Spec |
|---|---|
| **Detect** | Oracle top tip < catalog for **scoped** row (SSL cell, PA product changelog, Valhalla Current Version) |
| **Threshold** | Manufacturer tip + identity scope match; consecutive confirm unless explicit pull text |
| **Operator action** | Same as T6; if scope mismatch → T1/T8 |
| **Class** | A or H |

#### T8 — Softube / suite→named product (guard #5 hardened)

| Field | Spec |
|---|---|
| **Detect** | RN bullet names products under suite version headline |
| **Threshold** | **Zero** `observed_version=suite_version` on named products from this path |
| **Operator action** | Record suite diagnostic; enqueue re-check list; Central app uses `sc3/*.yml` only |
| **Class** | G |

#### T9 — Portal / website poison (Lindell teaching)

| Field | Spec |
|---|---|
| **Detect** | Final URL host ∈ {dropcatch, sedo, parklogic, parkingcrew, …} OR body hits gambling/pharma/spam keyword set OR registrant/DNS park NS OR title soft-404 OR language/script mismatch vs manufacturer default |
| **Evidence** | HEAD+≤8KiB GET; optional one rendered probe/host/day (PORTAL-LIVENESS ladder) |
| **Threshold** | **≥2** consecutive successful classifications ≥24h apart → `portal_poison` (same dead threshold as PORTAL-LIVENESS); DropCatch/Sedo redirect alone is enough for **immediate** freeze of that host as version oracle |
| **Operator action** | (1) Set `website_url`/`update_portal_url` to verified replacement (PA collection, lindellaudio.com hardware site only if plugins actually live there — prefer distribution partner). (2) `portal_liveness=dead` / notes. (3) **Freeze** any freshness parse whose `source_url` host matches poisoned host. (4) Dashboard **data-integrity** alert (thread-worthy). (5) Do **not** open version RETRACTION_WATCH. |
| **Abort** | `blocked`/WAF only → cool host, not poison |
| **Class** | F |

#### T10 — Filename ≻ folder / stale label (v1 guards 3–4)

Unchanged; class E if would-be decrease; never promote on folder alone.

#### T11 — Semver scheme change / non-comparable

Refuse decrease/raise without human-readable vendor note in evidence (v1 guard 10).

#### T12 — Mass undo detector

| Field | Spec |
|---|---|
| **Detect** | Single chip would open >N (default **15**) retraction watches for one manufacturer OR same `candidate` tip shared across >N SKUs from one oracle event |
| **Threshold** | Any |
| **Operator action** | **Halt auto-promote**; classify as G or C; require coordinator; likely generation/suite undo not vendor_retract |
| **Class** | G / C |

---

### Evidence thresholds (global)

| Write type | Min evidence |
|---|---|
| Raise | Manufacturer-class oracle + identity scope match (T1/T5/T8 pass) |
| Decrease A/B | Manufacturer + (explicit text **or** filename on official CDN/article) + consecutive confirm unless explicit split/pull text |
| Decrease C | Gen-scoped manufacturer History/Compat **or** own-page trail proving wrong stamp; never KVR-only |
| URL replace F | Live replacement URL 2xx + product-line visible; poisoned host classified |
| Generation/suite G | Snapshot hash + dated headline; **zero** SKU version writes |

**Confidence:** manufacturer installer/article 88–95; identity_correct decreases cite `identity-correct` + `prior-current` + oracle; never reuse `vendor-retract` for C/F/G/H.

---

### Decision tree v2 (replaces v1)

```
on ANY parse (raise OR freshness) for plugin P, catalog C, tip V, evidence E:

  # --- URL / fetch gate ---
  if E.host classified portal_poison (T9):
      freeze parses from host; re-point CTA; DO NOT compare V,C
  if fetch_degraded / unhealthy:
      false_alarm; never decrease; never raise

  # --- Bulk / scope gates (before semver compare) ---
  if E matches bulk generation/suite markers (T3/T4/T8):
      emit advisory only (G); V := null for SKU version purposes
  if E fails identity scope (T1/T5/H):
      refuse raise; IDENTITY_WATCH; if C was contaminated and mfr gen-final U < C (T2):
          accept U as identity_correct (C)
      stop

  # --- Comparable SKU tip ---
  if V is null: HOLD or false_alarm (no absence decrease)
  if V == C: HOLD; refresh verified_at
  if V > C: normal raise iff T1/T5/T8/T9 gates pass
  if V < C:
      if mac/win split (T0): B path
      else if prior oracle showed C now V same identity (T6/T7): A path / watch
      else if identity contamination: C path
      else if KVR-only: D — no decrease
      else: RETRACTION_WATCH (max 3 cycles)
      if watch_count_for_mfr > 15 (T12): halt; coordinator

  never label C/F/G/H as vendor_retract in metrics
```

---

### Watch record shapes (JSONL)

```json
{"type":"retraction_watch","plugin_id":"ssl--ssl-acoustifier","class":"mac_current_split","catalog":"1.0.19","candidate":"1.0.18","trigger":"T0","status":"open"}
{"type":"identity_watch","plugin_id":"d16-group--fazortan","sibling_id":"d16-group--fazortan-2","class":"oracle_scope_mismatch","bad_tip":"2.2.2","bad_url":"https://cdn.d16.pl/installers/Fazortan2/Fazortan2-2.2.2.dmg","trigger":"T1","status":"open"}
{"type":"portal_poison","host":"lindellplugins.com","manufacturer_id":"lindell-audio","final_url":"https://www.DropCatch.com/domain/lindellplugins.com","replacement":"https://www.plugin-alliance.com/collections/lindell-audio","trigger":"T9","status":"healed"}
{"type":"bulk_forbid_event","vendor":"waves","marker":"Across-the-board software update to V17","date":"2026-06-23","sku_version_writes":0,"trigger":"T3","status":"emitted"}
```

---

### Acceptance tests (must pass)

1. **Acoustifier** — unchanged golden: Mac 1.0.18 / Win 1.0.19 / catalog 1.0.19 → B → accept 1.0.18.
2. **D16 live** — `/fazortan` CDN links all `Fazortan2-*` → T1 refuse on `d16-group--fazortan`; no HOLD-as-verified at 2.2.2.
3. **D16 correct** — History gen-1 final 1.4.0 with catalog 2.2.2 → C decrease; reasons include `identity-correct` not `vendor-retract`.
4. **Lindell** — 301 DropCatch on lindellplugins.com → T9 freeze + re-point; **zero** version watches.
5. **Waves V17** — bulk line → one `generation_bump`; **zero** SKU version writes; T12 fires if a buggy chip tries mass V17 undo as retract.
6. **Softube 2.6.42** — named products in Fixed list → enqueue only; zero SKU stamps.
7. **KVR-only drop** — still no decrease (D).
8. **404 single chip** — watch/retry; no decrease (E).

---

### KPIs (additions to v1)

| KPI | Target |
|---|---|
| Decreases without manufacturer evidence | **0** |
| SKU version writes from bulk/generation events | **0** |
| Contaminated HOLD (V==C on scope-mismatched oracle) | **0** |
| Poisoned hosts still used as version oracle | **0** |
| Open retraction watches | Prefer <10 |
| Open identity watches | Track separately; D16-class cleared ≤7d |
| Portal poison MTTR (detect→re-point) | ≤ 2 daily sweeps |

---

### Engine / playbook changes if accepted

- Freshness **and** raise chips call shared `evaluate_triggers(E,P,C,V)` before write.
- `playbooks/d16-group.md`: machine-readable `gen_pairs` + T1 assert fixtures.
- `playbooks/waves.md` / Softube: T3/T4/T8 hard-wired to diff chips.
- Portal liveness job emits T9 events into same integrity dashboard as retraction watches.
- Metrics split: retraction vs identity vs poison vs bulk-forbid.

---

### Risks / caveats

- Over-eager T9 on transient parking pages — require consecutive classify except DropCatch/Sedo-class redirects.
- Gen-pair tables need maintenance (Baby Audio, Cableguys Kickstart, Initial Audio 808 Studio, …).
- Some vendors intentionally redirect gen-1 URLs to gen-2 marketing — that is **H**, not A; users of gen-1 still need History final or discontinued_frozen.
- Waves offline pin Central 16.7.2 vs RN Central 17.0.4 remain distinct surfaces (do not "retract" RN tip against offline).

---

### Suggested first step

1. Land fixtures under `fixtures/wave8/retract/` as unit tests (already captured this ask).
2. Implement T1+T3+T9 before generalizing watch JSONL — these three close the broken cases.
3. Keep Acoustifier T0 as regression; do not ship decrease automation until Muse reviews one IDENTITY_WATCH + one PORTAL_POISON event.

---

### New evidence since v1

- Live D16 `/fazortan` → only Fazortan2 2.2.2 installers; both gen CDN objects HEAD 200.
- Live lindellplugins.com → DropCatch 301; PA collection 200.
- Catalog NOTES-10x-2026-09-14/15 primary incident records.
- Waves/Softube refs confirming bulk anti-stamp (Incapsula / browser RN / suite-vs-SKU).
