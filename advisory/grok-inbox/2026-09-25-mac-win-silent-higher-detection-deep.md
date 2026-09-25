# Mac vs Win silent-higher stamps — detection recipe (Wave 8 Ask 6)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (Wave 8 Ask 6, lane6)
- **Mode:** Advisor-only. No catalog writes. No git commits.
- **DB:** `/workspace/daw-plugin-manager-publish/catalog-store/data/catalog.db` RO
- **Theme:** Database **robustness / accuracy** — wrong OS train stuck as green tip
- **Non-redundant vs:** Ask1 cohort Softube/Waves/UA; Ask2 Acoustifier *protocol*; Ask3 chip death. This pass is **live SQL detection + tier-1 candidates**, not re-deriving Class B.

## 0. Problem

When Mac and Windows ship **different** installer semvers, a chip that takes `max(mac, win)` (or the changelog heading that only applies to one OS) writes a tip that **half the install base cannot download**. Freshness then HOLDs forever (`V == C`). SSL Acoustifier taught the class; Valhalla documented Mac-current correctly; **oeksound bloom is still wrong-higher in live DB**.

Standing convention (RETRACTION / ssl playbook): **catalog tracks Mac-current**; Win alternate lives in evidence. Inverse silent Win-only raises are the same accuracy hole.

## 1. Detection recipe (design-SQL / chip gate)

**Inputs per tip observation** `E = evidence_snippet || confidence_reasons`, tip `V`.

1. Extract version tokens near `mac` / `win` / `windows` windows (±40 chars) from `E`.
2. If Mac-set and Win-set are non-empty and **not equal**:
   - `higher = max(semver)`, `lower = min(semver)` among union.
3. **Documented OK** (negative control — do not alert) iff `E` matches any of:
   - `windows only` / `mac only` / `mac-current` / `mac current` / `dual-platform`
   - `catalog accepts mac` / `windows alternate` / `windows latest … noted`
4. **SILENT-HIGHER** iff tip `V` equals `higher` (or starts with it) **and** documented-OK is false.
5. **SILENT-LOWER / unresolved** iff `V` equals `lower` without documented-OK (rarer; still open watch).
6. Chip gate: refuse `@≥85` accept unless documented-OK; else force `mac_current_split` watch (Ask2 T0) or amber cap ≤70.

**Live probe (2026-09-25 PT)** on tier-1 accepted tips with both `mac` and `win` in evidence:

| Class | N | Examples |
|---|---|---|
| Documented Mac-current | 5 | Valhalla Plate/Shimmer/FreqEcho/SpaceModulator; SSL Acoustifier |
| Silent (no doc language) | 3 | **oeksound--bloom**; ssl autoDYN/autoEQ false positives (same Mac/Win installer, KVR label noise) |

Filter false positives: require Mac-set ∩ Win-set empty (true split), not label-vs-installer noise.

## 2. Tier-1 candidates

### 2.1 LIVE — `oeksound--bloom` (clear SILENT-HIGHER)

| Field | Live value |
|---|---|
| tip | **1.1.3** @**92** accepted |
| source | `https://oeksound.com/changelog/bloom/` `releaseNotesPage` / `headingNewest` |
| verified_at | 2026-09-10T05:23:35Z |
| evidence (verbatim) | `### 1.1.3 Released on November 4, 2025 (Windows GUI resize fix); downloads page Mac still lists 1.1.2` |

**Why wrong:** Evidence itself states 1.1.3 is a **Windows GUI resize fix** and Mac downloads still **1.1.2**. Tip stamped the higher Win-only heading as universal green. Opposite of Acoustifier resolution (Mac-current). User on Mac is told 1.1.3 is current when vendor Mac CTA is 1.1.2.

**Operator action (advisor):** Open `mac_current_split` watch → accept **1.1.2** Mac-current @92; Win 1.1.3 in evidence; reasons `mac-current-dual-platform`. Do not HOLD on changelog heading alone.

Fixture: `fixtures/wave8/explore/oeksound/bloom-tip-live.json`

### 2.2 Resolved teaching case — `ssl--ssl-acoustifier`

tip **1.0.18** @92 (was 1.0.19). Evidence explicit `v1.0.18 (v1.0.19 Windows only)`. Documented-OK. Fixture: `fixtures/wave8/explore/ssl/acoustifier-tip-live.json`.

### 2.3 Negative controls — Valhalla Mac-current cohort

| id | tip | Win alternate in evidence |
|---|---|---|
| valhalla-dsp--valhallaplate | 1.6.8 @92 | 1.6.3 |
| valhalla-dsp--valhallashimmer | 1.3.0 @92 | 1.2.2 |
| valhalla-dsp--valhallafreqecho | 1.2.8 @92 | 1.2.0 |
| valhalla-dsp--valhallaspacemodulator | 1.2.8 @88 | 1.1.6 |
| valhalla-dsp--valhallaubermod | 1.2.8 @88 | 1.1.6 |

All carry “Catalog accepts Mac current…” language → detection must **not** fire. Fixture: `fixtures/wave8/explore/valhalla-dsp/documented-mac-current-tips.json`

### 2.4 Policy skips still correct (no tip = good)

Historical Mac≠Win **skips** (Sonnox Restore/Pro-Codec CSV, LiquidSonics Seventh Heaven Pro, HeadRush ReValver, Audified MultiDrive, …) are accuracy-preserving. Detector is for rows that **escaped** skip and landed accepted.

## 3. Why this matters for robustness / accuracy

- A silent OS pick of `max()` creates a tip that is **false for one platform** while UI shows green ≥85.
- Freshness cannot self-heal: changelog heading stays `V == C` HOLD (same pathology Ask2 named for D16 page contamination).
- Without a mechanical split detector, Acoustifier-class bugs only surface when a vendor *later* edits a label — bloom has been wrong since 2026-09-10 with the contradiction already in `evidence_snippet`.
- Cheap gate: parse evidence you already store; no new hub discovery.

