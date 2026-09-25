# Hub / cohort stamp contamination — detection deep (Wave 8 Ask 1)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (Wave 8 Ask 1, lane1)
- **Mode:** Advisor-only. No catalog writes. No git commits.
- **DB:** `/workspace/daw-plugin-manager-publish/catalog-store/data/catalog.db` RO via `file:…?mode=ro`
- **Tier:** `COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)=1`
- **Tip join:** `plugin_version_current.observation_id = version_observations.id` AND `version_observations.status='accepted'`
- **Prior refs:** Softube suite-vs-SKU, Waves never-stamp-V17 / RN diff, identity reclass (UA Editions / Softube packs / Waves Signature Series), D16 gen-contamination class, Softube Central sc3 YAML

## 0. Problem

Discovery chips love a single public number. Hub oracles (Softube Central RN, UAD Version History, Waves Central / offline installer, Pro Tools what’s-new) publish **suite / installer / generation trains**. When that train is written as `observed_version` onto every SKU, bundle, or cross-vendor row, the catalog grows **false churn**, wrong upgrade advice, and pages Luke for “updates” that are not product versions.

Wave 7 named the class. This pass expands **signature shapes**, **design-SQL detectors**, a **precision candidate list with live evidence**, and **false-positive guards** that protect honest cohort trains (Melda / Soundtoys / Goodhertz / Kilohearts / Waves plugin uniform builds).

Live tip cohort sizes (Tier-1, accepted):

| Cohort | Stamp | N tips |
|---|---|---|
| Softube RN “All plug-ins” | `2.6.41` | **124** |
| Softube RN fixed-named trio | `2.6.42` | **3** |
| Softube-mfr `uad-*` from UA history | `12.0` | **17** |
| UA Version History on UA DSP plugins | `12.0` | **134** (+17 at `12.0.0`) |
| Waves offline/RN uniform build | `17.1.42.50` | **237** (of which **14** are `identity_kind=bundle`) |
| Waves Signature Series / CLA pack | `15.0.70.71` | **5** |

**Unique high-confidence clear/reclass candidates this pass: 178** (see `fixtures/wave8/findings/lane1-FINDINGS.json`). UA DSP individuals @ 12.0 and Waves *plugin* rows @ 17.1.42.50 are **policy-review / guard**, not auto-clear.

---

## 1. Signature shapes (detector vocabulary)

### S-A — Hub-app / suite version == N product rows from one manufacturer

Same `manufacturer_id` + identical `observed_version` on **many** tips, and evidence cites a **suite/hub** oracle (“All plug-ins”, “UAD Version History Version 12.0”, “Across-the-board … V17”, Pro Tools what’s-new) rather than a per-SKU installer filename.

**Live exemplar:** Softube `2.6.41` × 124; evidence_snippet pattern:
> Softube release notes 2.6.41 … "All plug-ins" section — family version …

### S-B — Suite tip diverging from component tips

Manufacturer RN tip moves (Softube index tip **2.6.42**) while the mass of SKUs stay on the prior suite build (**2.6.41**), and a **named subset** is raised to the new tip because they appear in a FIXED bullet — not because their SKU marketing version changed.

**Live exemplar:** Monoment Bass / Parallels / Statement Lead @ `2.6.42` while 124 siblings remain `2.6.41`. Live RN body:
> Monoment Bass, Parallels, and Statement Lead: Fixed an issue that caused the plug-ins to fail to load and could crash the host in version 2.6.41.

That authorizes a **suite event + re-check enqueue**, never `observed_version=2.6.42` on those three product rows.

Also: Softube **Central app** tip is **3.0.5** (`sc3/latest-mac.yml`) — a different train from plugin suite `2.6.x`. Confusing them is a second divergence crime.

### S-C — DMG / basename vs stamped version mismatch

Installer filename encodes version V_file while accepted tip is V_stamp ≠ V_file (same product identity). Teaching cases:

| Case | Shape | Status |
|---|---|---|
| Softube Central Homebrew `2.2.0` vs sc3 `Softube Central-3.0.5-universal-mac.zip` | hub channel / basename trap | **Fixed** in DB (Central now 3.0.5); keep as regression fixture |
| SSL Acoustifier Mac `1.0.18` vs Win `1.0.19` label | dual-platform (retraction class, not hub stamp) | Separate playbook |

Detector: parse `\d+(?:\.\d+)+` from `.dmg|.pkg|.zip|.exe|.msi` basename in `evidence_snippet` / `source_url`; flag when normalized ≠ `observed_version`.

### S-D — Generation / family train stamped onto every SKU (or onto bundles)

Waves “Across-the-board software update to V17” or offline “All Waves plugins V17” used to write `version=V17` / `17` / or a uniform build onto **bundles** and commerce series. Hard rule remains: **never stamp bare V17**. Uniform build `17.1.42.50` may be honest on `identity_kind=plugin` (WaveShell); it is **not** honest on `identity_kind=bundle` or Signature Series commerce packs.

### S-E — Cross-vendor suite stamp

Oracle manufacturer ≠ row `manufacturer_id`. Live: Softube-owned `softube--uad-*` tips cite UA help UAD Version History `12.0`.

### S-F — Suite / pack / edition identity still clothed as `plugin` + wearing suite tip

Identity crime × stamp crime. Softube Flow suites / Tube-Tech Complete Collection / Passive-Active Pack / Abbey Road Brilliance Pack still `identity_kind=plugin` @ `2.6.41`. Waves Signature Series still `plugin` @ `15.0.70.71`. UA collections already `bundle` but still export suite tip as `latestVersion`.

---

## 2. Design SQL (engine chip sketch — do not assume non-existent columns)

Label: **design SQL**. Uses only live columns.

```sql
-- Base: Tier-1 accepted tips
WITH tip AS (
  SELECT
    p.id AS plugin_id,
    p.manufacturer_id,
    p.name,
    p.identity_kind,
    p.portal_app,
    p.bundled,
    p.generation,
    vo.id AS observation_id,
    vo.observed_version,
    vo.normalized_version,
    vo.source_url,
    vo.source_kind,
    vo.extract_method,
    vo.evidence_snippet,
    vo.confidence,
    vo.created_at AS obs_created_at
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
  JOIN version_observations vo ON vo.id = pvc.observation_id
  WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
    AND vo.status = 'accepted'
),

-- S-A: same mfr + same version cohort size
cohort AS (
  SELECT manufacturer_id, observed_version,
         COUNT(*) AS n,
         COUNT(DISTINCT source_url) AS n_urls,
         GROUP_CONCAT(DISTINCT source_kind) AS source_kinds
  FROM tip
  GROUP BY manufacturer_id, observed_version
  HAVING COUNT(*) >= 10
),

-- S-A/D evidence smells like suite/hub language
suite_smell AS (
  SELECT plugin_id, manufacturer_id, observed_version, identity_kind, source_url, evidence_snippet
  FROM tip
  WHERE
    lower(coalesce(evidence_snippet,'')) LIKE '%all plug-ins%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%all waves plugins%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%across-the-board%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%family version%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%uad version history%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%uad software v%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%shared suite%'
    OR lower(coalesce(evidence_snippet,'')) LIKE '%suite-wide%'
    OR lower(coalesce(source_url,'')) LIKE '%/release-notes%'
    OR lower(coalesce(source_url,'')) LIKE '%uad-version-history%'
    OR lower(coalesce(source_url,'')) LIKE '%latest-offline-installer%'
),

-- S-E: Softube row + UA oracle
cross_vendor AS (
  SELECT * FROM tip
  WHERE manufacturer_id = 'softube'
    AND (
      lower(coalesce(source_url,'')) LIKE '%uaudio.com%'
      OR lower(coalesce(evidence_snippet,'')) LIKE '%uad version history%'
    )
),

-- S-F: commerce identity tokens still plugin-kind with a tip
commerce_plugin_clothing AS (
  SELECT * FROM tip
  WHERE identity_kind IN ('plugin','instrument','effect','unknown_other')
    AND (
      lower(name) LIKE '%bundle%'
      OR lower(name) LIKE '%suite%'
      OR lower(name) LIKE '%collection%'
      OR lower(name) LIKE '% signature series%'
      OR (lower(name) LIKE '%pack%' AND manufacturer_id IN ('softube','waves'))
      OR (lower(name) LIKE '%edition%' AND manufacturer_id = 'universal-audio'
          AND lower(name) NOT LIKE '%limited edition%')
    )
),

-- Bundle kind exporting any version (should not page as plugin latestVersion)
bundle_with_tip AS (
  SELECT * FROM tip WHERE identity_kind = 'bundle' AND observed_version IS NOT NULL
)

SELECT 'cohort' AS detector, c.manufacturer_id, c.observed_version, c.n, c.source_kinds
FROM cohort c
ORDER BY c.n DESC;
```

**Chip post-filters (application logic, not SQL columns):**

1. Join `cohort` to a **manufacturer policy table** (playbook): `honest_shared_train` vs `suite_stamp_forbidden`.
2. If `honest_shared_train` (Melda kernel, Soundtoys 5, Goodhertz suite installer, Kilohearts installer, Waves *plugin* WaveShell build) → **suppress** S-A alert.
3. If `identity_kind IN ('bundle','expansion')` OR commerce_plugin_clothing → **always alert** even when train is honest for components.
4. If cross_vendor → **always alert**.
5. Softube-specific: if `observed_version` matches RN suite tip/`All plug-ins` and `plugin_id != softube--central` → alert; Central must use sc3 YAML app version, never `2.6.x`.
6. Waves-specific: reject `observed_version` matching `^v?17$` / `^V17$`; allow `17.x.y.z` on plugins only with offline-installer/hotfix evidence; never on bundles.
7. Basename mismatch: regex on snippet/URL as in S-C.

Optional future columns (NOT assumed live): `suite_train_version`, `waves_generation`, `resolvability` — would let export hide suite trains from `latestVersion` without deleting evidence.

---

## 3. Candidate list with evidence (precision)

### 3.1 Softube `2.6.41` × 124 — suite “All plug-ins” stamp — **CLEAR**

| Field | Value |
|---|---|
| Stamp | `2.6.41` |
| Source | `releaseNotesPage` → Softube RN article for 2.6.41 |
| Evidence | `"All plug-ins" section — family version matches KVR 2.6.41` (conf 92) |
| Public | https://www.softube.com/release-notes · fixture `softube-rn-2641.meta.json` |
| Live RN quote | “All plug-ins: Fixed an issue that could make plug-ins load slower…”; also names Amp Room / Flow Mastering Suite / Flow Mixing Suite in same article |
| Why contaminated | Suite/installer train ≠ per-SKU marketing version (Wave 7 Softube suite-vs-SKU) |
| Action | **Clear** accepted tip on all 124 product rows; keep RN as suite diagnostic / re-check signal only |
| IDs | Full list in `fixtures/wave8/contam/tier1-contam-cohort-query.json` → `softube_2_6_41_all_plugins_stamp` |

Representative rows: `softube--acoustic-feedback`, `softube--heartbeat`, `softube--weiss-eq1`, … (entire Softube Central portal set wearing 2.6.41).

### 3.2 Softube fixed-in trio @ `2.6.42` — **CLEAR** (teaching case)

| plugin_id | stamped | why |
|---|---|---|
| `softube--monoment-bass` | 2.6.42 | Named in FIXED list for suite 2.6.42 |
| `softube--parallels` | 2.6.42 | same |
| `softube--statement-lead` | 2.6.42 | same |

- **URL:** https://www.softube.com/release-notes/release-notes-for-version-2-6-42-(released-on-august-21th-2026)
- **Fixture:** `softube-rn-2642.meta.json`
- **Snippet in DB:** `Softube release notes 2.6.42 (2026-08-21): Monoment Bass, Parallels, and Statement Lead — matches KVR 2.6.42`
- **Action:** Clear accepted_version; enqueue per-SKU dig only if independent oracle appears (login-walled installers → usually hold)

### 3.3 Softube commerce packs @ `2.6.41` still `identity_kind=plugin` — **RECLASS + CLEAR**

| plugin_id | public corroboration |
|---|---|
| `softube--flow-mastering-suite` | https://www.softube.com/flow-mastering-suite |
| `softube--flow-mixing-suite` | https://www.softube.com/flow-mixing-suite — “70+ plug-ins” |
| `softube--tube-tech-complete-collection-2` | https://www.softube.com/plug-ins/tube-tech-complete-collection-2 — “includes the following plug-ins” |
| `softube--passive-active-pack` | https://www.softube.com/plug-ins/passive-active-pack |
| `softube--abbey-road-studios-brilliance-pack` | https://www.softube.com/plug-ins/abbey-road-brilliance-pack |

Fixtures: `softube-flow-*.meta.json`, `softube-tube-tech-collection.meta.json`, `softube-passive-active-pack.meta.json`, `softube-abbey-road-brilliance-pack.meta.json`.  
**Action:** `identity_kind → bundle` (align Wave 7 identity draft); clear tip; UI → Softube Central CTA.

### 3.4 Softube `uad-*` @ `12.0` from UA Version History — **CLEAR** (cross-vendor)

17 rows, all `source_url` = UA help Version History, evidence: “UAD Version History lists current Version 12.0 … updates Softube-distributed UAD titles”.

IDs: `softube--uad-chandler-limited-curve-bender`, `…-zener-limiter`, `…-dytronics-cyclosonic-panner`, `…-tri-stereo-chorus`, `…-eden-wt800`, `…-marshall-bluesbreaker-1962`, `…-jmp-2203`, `…-plexi-super-lead-1959`, `…-oto-biscuit-8-bit-effects`, `…-softube-amp-room-bundle`, `…-softube-vocoder`, `…-tonelux-tilt`, `…-tonelux-tilt-live`, `…-tube-tech-cl-1b`, `…-tube-tech-cl-1b-mk-ii`, `…-tube-tech-eq-collection`, `…-valley-people-dyna-mite`.

- **Public:** https://help.uaudio.com/hc/en-us/articles/215270403-UAD-Version-History-Release-Notes — tip “Version 12.0 — Sept 8, 2026” (`ua-version-history.meta.json`)
- **Action:** Clear Softube-mfr tips derived from UA suite oracle; do not map Softube RN ↔ UAD DSP either (Wave 7 anti-pattern table)

### 3.5 Softube Central identity — **RECLASS hub_app** (keep 3.0.5)

| plugin_id | now | proposed | version |
|---|---|---|---|
| `softube--central` | `plugin` @ 3.0.5 | `hub_app` | **keep 3.0.5** |

- **Oracle:** `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/sc3/latest-mac.yml` → `version: 3.0.5` (fixture `softube-sc3-latest-mac.yml`)
- Not a suite-stamp victim; it is the hub. Misfiling as `plugin` invites chips to treat Central as a SKU peer of Heartbeat.

### 3.6 Waves bundles @ `17.1.42.50` — **CLEAR tip** (keep kind=bundle)

14 rows including `waves--gold-bundle`, `waves--platinum-bundle`, `waves--diamond-bundle`, `waves--mercury-bundle`, `waves--horizon-bundle`, `waves--api-collection`, `waves--ssl-4000-collection`, `waves--abbey-road-plugin-collection`, EMP toolboxes, etc.

Evidence cites V17 across-the-board narrative / offline installer map.  
**Action:** Clear accepted_version on bundles; never export `latestVersion` for bundles; portal CTA = Waves Central.  
**Guard:** Do **not** mass-clear the ~223 `identity_kind=plugin` tips at `17.1.42.50` — that is the honest WaveShell uniform-build cohort (see §4).

### 3.7 Waves Signature Series / CLA @ `15.0.70.71` (and one `14.0.83`) — **RECLASS + CLEAR**

| plugin_id | stamp |
|---|---|
| `waves--chris-lord-alge-artist-signature-series` | 15.0.70.71 |
| `waves--eddie-kramer-signature-series` | 15.0.70.71 |
| `waves--jack-joseph-puig-signature-series` | 15.0.70.71 |
| `waves--tony-maserati-signature-series` | 15.0.70.71 |
| `waves--cla-classic-compressors` | 15.0.70.71 |
| `waves--manny-marroquin-signature-series` | 14.0.83 |

- **Public:** https://www.waves.com/bundles/chris-lord-alge-signature-series (`waves-cla-signature-series.meta.json`)
- Stale Central-era KVR `verwin` while catalog plugins moved to 17.x uniform build — classic hub/cohort lag on a commerce pack.
- **Action:** `plugin → bundle` (Wave 7 identity); clear tip.

### 3.8 UA bundle / collection rows @ `12.0.0` — **CLEAR tip**

14 rows (all `identity_kind=bundle`), stamp from UAD Software Archive / Version History “UAD 12.0.0 (Current)”. IDs include `universal-audio--uad-1176-classic-limiter-collection`, `…-fairchild-tube-limiter-collection`, `…-teletronix-la-2a-leveler-collection`, `…-guitar-amp-bundle-v2`, `…-synth-collection`, `neve-88rs-channel-strip-collection`, etc. (full list in FINDINGS / cohort JSON).

Native edition packs (`uad-producer-edition`, `uad-studio-edition`, `uad-signature-edition-v3`, `uadx-essentials-edition`, `uadx-signature-edition-v2`) are versionless today — good; still need identity → `bundle` per Wave 7 (no tip to clear).

### 3.9 UA DSP individuals @ `12.0` (134) — **POLICY REVIEW / HOLD** (not auto-clear)

Same Version History oracle. Contrast: UADx **Native** titles carry distinct `1.x.y` tips — proving UA *can* publish per-SKU versions when the product line has them. DSP line is documented as riding **UAD Software** train.

**Recommendation (design only):**  
- Detection chip: **flag** S-A for UA+`12.0`.  
- Operator: either (a) accept as `honest_shared_train` with export field `suite_train_version=12.0` and **blank** plugin `latestVersion`, or (b) clear tips and show UA Connect CTA only.  
- Do **not** silently keep paging 134 “12.0 updates” as if each DSP title shipped a unique marketing bump.

### 3.10 Prior incident class — D16 (regression guard, currently clean)

Live D16 gen1/gen2 tips are CDN-filename aligned (`fazortan` 1.4.0 vs `fazortan-2` 2.2.2, etc.). No active cohort stamp. Keep D16 “never stamp gen2 installer onto gen1 row” as a permanent guard in the chip (identity_correct class from RETRACTION.md).

---

## 4. False-positive guards (honest cohort trains)

| Manufacturer | Shared tip | Why honest | Guard |
|---|---|---|---|
| MeldaProduction | `17.10.01` × 130 | Downloads page: “kernel version: 17.10.01”; vendor states all plugins share kernel version | `honest_shared_train`; allow plugin tips; still clear if stamped onto a Melda *bundle* commerce row |
| Soundtoys | `5.5.5` × 26 | Release Log “Soundtoys 5.5.5 Update” suite-wide covering Soundtoys 5 plugs | Allow on Soundtoys 5 plugins; bundle rows → no latestVersion |
| Goodhertz | `3.14.1` × 22 | “Goodhertz 3.14.1” / “All the Goodhertz plugins in one download” | Allow; `goodhertz--suite` may be hub/bundle — separate identity pass |
| Kilohearts | `2.4.6` × 83 | “Kilohearts Installer 2.4.6”; changelog: all plugins share one version | Allow on plugins; bundles (`…bundle`) → clear tip |
| Waves (plugins) | `17.1.42.50` × ~223 plugins | Offline installer V17 inventory + WaveShell uniform build; extract_method cites offline list | Allow on `identity_kind=plugin`; **forbid** bare `V17`/`17`; **forbid** on bundles/series |
| iZotope RX 11 / Ozone 11 modules | `11.4.0` / `11.3.0` | Product-family module trains from product RN | Allow within product family; don’t stamp RX tip onto Ozone |
| Avid stock plugs | `2026.4.1` × 54, `bundled=1` | “ships with Pro Tools 2026.4.1; no independent plugin semver” | `structurally_blocked` / DAW-bundled — not hub contamination |
| Spitfire ARO sections | `1.4.7` × 32 | Help Centre: range-wide plugin host; repair all sections together | Allow shared host version on soundsets; don’t invent per-section semver |
| UA Native (UADx) | distinct `1.x.y` | Per-SKU KVR/native versions | Not a cohort stamp; use as **contrast** proving DSP `12.0` is suite-shaped |

**Allowlist name-token FPs** (from Wave 7 identity — do not treat as commerce packs): Goodhertz “Mastering Edition”, UA “C-Suite” discrete plugs, Slate VerbSuite Classics, IL Juice Pack suffixes.

---

## 5. Recommended operator actions (design only)

| Priority | Action | Targets |
|---|---|---|
| P0 | **Clear** accepted tips | Softube 124×`2.6.41`; Softube 3×`2.6.42`; Softube 17×`uad-*`/`12.0`; Waves 14 bundles×`17.1.42.50`; Waves 5–6 series×`15.x`/`14.0.83`; UA 14 collections×`12.0.0` |
| P0 | **Reclass** identity | Softube 5 commerce packs → `bundle`; Waves Signature Series (+ CLA Classic Compressors) → `bundle`; Softube Central → `hub_app` |
| P1 | **Hold / policy** | UA DSP 134×`12.0`: decide suite_train export vs clear; until then do not raise further from Version History onto SKUs |
| P1 | **Playbook locks** | Softube: RN ≠ SKU; Central = sc3 YAML only; never Softube RN → UAD rows. Waves: never-stamp-V17; bundles never get WaveShell build. UA: Version History updates `uad-software` / hub diagnostic, not editions/collections |
| P2 | **Chip** `contam-cohort-stamp-v1` | Run design SQL daily; emit candidates with detector id S-A…S-F; apply honest_shared_train allowlist before paging Luke |
| P2 | **Export rule** | `identity_kind IN ('bundle','hub_app','expansion','soundset')` → suppress `latestVersion` in user-facing pages even if tip exists |

No catalog mutation in this advisory.

---

## 6. Why this protects data integrity / pages Luke less

1. **Stops false upgrade storms** — Softube alone would imply 124+ products “moved” whenever the suite train ticks (2.6.41 → 2.6.42), while only a framework fix shipped.
2. **Keeps hub oracles useful** — RN / Version History / Waves RN remain high-value **signals** (what to re-check, hub_app freshness) without poisoning SKU `latestVersion`.
3. **Separates identity from version** — Clearing tips on packs still clothed as `plugin` prevents double-counting commerce SKUs as installable tips.
4. **Guards honest trains** — Melda/Soundtoys/Goodhertz/Kilohearts/Waves-plugin uniform builds stay green so the detector does not burn trust with false positives.
5. **Fewer Luke pages** — Operator queue + chip suppression means fewer “is Heartbeat really 2.6.41?” / “did Gold Bundle update?” interruptions; pages concentrate on true per-SKU raises and hub_app freshness (Central 3.0.5, Waves Central app builds, UA Connect).

**Success metric for a future chip:** zero new Softube SKU tips sourced solely from RN suite version; zero Waves bundle tips from V17/offline map; zero Softube-mfr tips from uaudio.com Version History; honest Melda/Soundtoys/Goodhertz cohorts remain accepted.

---

## 7. Artifacts

- Draft: this file
- Findings: `fixtures/wave8/findings/lane1-FINDINGS.json` (178 unique high IDs + cohort breakdown)
- Fixtures: `fixtures/wave8/contam/*.meta.json`, `softube-sc3-latest-mac.yml`, `tier1-contam-cohort-query.json`
