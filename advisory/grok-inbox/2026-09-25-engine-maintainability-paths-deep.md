# Engine maintainability paths after discovery breakthroughs (wave 6)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Lane 4 — make the catalog cheap to keep accurate once oracles exist. Does **not** assume the undecided 12h→daily freshness pivot.

## Tools / paths (new; don’t redo accepted KPI/SLA docs)

### 1. Oracle health probes (generalize Waves stub detector)
- Pattern: HTTP 200 ≠ healthy.
- Cases: Waves RN Incapsula ~212B stub (accepted); Moog wrong-slug ~15KB shell without `All Formats v` button; IK PDF probe 404 vs 200.
- Implement shared `oracle_health` result: `ok | soft_200_empty | blocked | http_err` + bytes + content_hash.
- Retain **last-good snapshot** on failure (accepted Waves idea → make generic).

### 2. Golden fixtures as CI
- Commit minimal HTML/PDF/JSON under `advisory/grok-inbox/fixtures/…` (or operator `catalog-store/fixtures/` when Muse adopts).
- Unit tests: parser extracts expected tip; generation_bump emits zero SKU writes; Mac-current on splits.

### 3. GitHub Releases / Atom for OSS manufacturers (tier-2 ready)
- For Airwindows / x42 / Surge-class: poll `releases.atom` or ETag-conditional Releases API (unauthenticated API rate-limits easily — prefer Atom).
- Map `tag_name` → normalized_version with manufacturer playbook.
- Recon only until Luke opens tier-2 for raises.

### 4. Docs-index RN discovery (Sonnox pattern)
- Don’t hardcode article URLs; scrape `sonnox.com/docs` “View Release Notes” table as the oracle index, then fetch each RN.
- Reuse for any vendor with a central docs matrix.

### 5. Filename / CDN tip probes
- IK `AmpliTube_5_v{ver}_comparison.pdf` existence probe.
- Softube-style `latest-mac.yml` already accepted — keep a **registry of probe URLs** per manufacturer playbook.

### 6. Identity-guard unit tests (lane 5 crossover)
- Fixture cases: Waves V17 bulk → one generation_event; Softube suite RN ≠ SKU; UA Edition pack ≠ plugin tip; IL FL host ≠ Morphine tip; Moog Mariana ≠ MF-101S cross-stamp.

### 7. Retraction / freeze hooks
- Sonnox farewell article class → `discontinued_frozen` watcher (annual re-fetch of farewell + RN tip).
- SSL installer rollback class already standing — add watchlist table design (operator-owned).

### 8. Diggable debt KPI
- Dashboard number: count(`open_pending` tier-1 plugins) — shrinks as Moog/Sonnox clear and hub_walls land.
- Independent of band-count vanity metrics; compatible with either cadence strategy.

- **Recommendation:** Implement shared oracle_health + fixture CI first; then Moog/Sonnox chips; then diggable stop-filters.
- **Risks:** Fixture sprawl — keep only tip-bearing excerpts when HTML is huge.
