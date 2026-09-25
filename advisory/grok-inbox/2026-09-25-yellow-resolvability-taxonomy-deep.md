# Yellow resolvability taxonomy — deep schema + stop-queries

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Advisory backlog #4 — Confidence taxonomy. Yellow mixes “no public version exists” with “haven’t found it yet.” Deepens `2026-09-24-yellow-confidence-taxonomy.md` with a full `resolvability` enum, migration SQL, stop-query rules, and dashboard widgets.
- **Context / evidence:**
  - Live RO bands (2026-09-24): accepted currents **green 3,958 / amber 347 / yellow 1,346**.
  - Yellow extract_method concentration: **kvr-product-page ≈ 1,119** (brief) / family KVR ≈ 1,223 of 1,346 — mostly hub-walled or crowdsourced ceiling, not dig debt.
  - Tier-1: 4,389 plugins; versioned 2,777 (green 1,939 / amber 308 / yellow 530); versionless 1,612 — of which intentional kinds dominate (soundset 1,090 · bundle 188 · **plugin 113 diggable** · hardware 66 · discontinued 38 · …).
  - PROJECT-BRIEF: confidence answers trust in the number; it does **not** answer discoverability. CONFIDENCE.md operational bands green ≥85 / amber 70–84 / yellow <70 (brief’s “≥90” is aspiration — **do not retune scores** in this proposal).
  - Structurally blocked classes already named in TIER1-ASSAULT: Spitfire app-gated libraries, UVI Portal soundbanks, Steinberg DA libraries, DAW-bundled components.

- **Recommendation:**
  Add orthogonal axis **`resolvability`** on `plugins`. Keep confidence bands unchanged. Use resolvability to gate dig vs freshness vs hard-skip so chips stop re-trying dead ends and the dashboard stops treating yellow count as backlog.

  ## Enum

  | Value | Meaning | Chip posture |
  |---|---|---|
  | `open` | Public oracle + durable recipe | Freshness only |
  | `open_pending` | Public evidence believed; no durable recipe yet | **Dig / new-angle** |
  | `kvr_ceiling` | Best public source is KVR | Dig only on new manufacturer angle; else KVR stamp freshness |
  | `hub_walled` | Exact builds behind account hub | No per-product dig; portal CTA; hub_app oracle only |
  | `structurally_blocked` | Banned classes (4 subclasses) | Public re-probes banned |
  | `unversioned_by_kind` | identity_kind implies no discrete plugin version | Skip version research |
  | `discontinued_frozen` | Discontinued | Freeze last observed |
  | `needs_identity` | gen_ambiguous / unresolved suite | Block versioning until identity fixed |
  | `unknown` | Migration default | Taxonomy backfill only |

  Subclasses → `resolvability_detail`:
  1. `spitfire_app_gated_library`
  2. `uvi_portal_soundbank`
  3. `steinberg_da_library`
  4. `daw_bundled_component`

  **Invariant:** If a durable public recipe is healthy, prefer `open` even when a hub app also exists (Waves RN, Softube RN, SSL Zendesk, NI installer binary, PA changelog).

  ## Columns (schema_version 6 → 7)

  ```sql
  BEGIN;
  ALTER TABLE plugins ADD COLUMN resolvability TEXT NOT NULL DEFAULT 'unknown';
  ALTER TABLE plugins ADD COLUMN resolvability_detail TEXT;
  ALTER TABLE plugins ADD COLUMN resolvability_set_at TEXT;
  ALTER TABLE plugins ADD COLUMN resolvability_set_by TEXT;
  ALTER TABLE plugins ADD COLUMN resolvability_review_after TEXT;
  UPDATE meta SET value = '7' WHERE key = 'schema_version';
  INSERT OR REPLACE INTO meta(key, value)
    VALUES ('schema_v7_resolvability_at', datetime('now'));
  COMMIT;
  ```

  Export (DATA-DICTIONARY): `resolvability` / `resolvabilityDetail` — omit when `unknown`; app may ignore until Cursor wires UI.

  ## Backfill order (first match wins)

  1. `needs_identity` — `identity_kind = 'gen_ambiguous'`
  2. `discontinued_frozen` — `discontinued = 1` OR kind discontinued
  3. `unversioned_by_kind` — soundset/expansion/bundle/hardware/eurorack/daw_stock_effect (detail = kind). If an accepted current already exists, classify from observation path instead of forcing unversioned.
  4. `structurally_blocked` — TIER1-ASSAULT list membership
  5. `hub_walled` — `portal_app` non-null **AND** no healthy public per-product recipe **AND** (no accepted version OR yellow KVR-only). Seed hubs: Native Access, Waves Central, IK Product Manager, UA Connect, Spitfire, UVI, Softube Central (164), PA Installation Manager (294), SSL Download Manager (69), Steinberg DA, Avid Link, Slate RME, …
     - **Override → `open`:** playbook produced confidence ≥ 70 within last 30 days.
  6. `kvr_ceiling` — accepted current confidence < 70 AND (`extract_method` LIKE `kvr%` OR source_url kvraudio)
  7. `open` — confidence ≥ 70 with manufacturer-class extract OR healthy playbook
  8. `open_pending` — tier-1 `identity_kind='plugin'`, no `plugin_version_current`, not classified above → the diggable **~113**
  9. else `unknown`

  Expected tier-1 versionless split: ~1,400 `unversioned_by_kind` · blocked lists · ≤113 `open_pending` · remainder hub/discontinued/identity.

  ## Stop-query rules (mandatory)

  Dig YES:

  ```sql
  SELECT p.id
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
    AND p.resolvability IN ('open_pending', 'unknown')
    AND p.identity_kind = 'plugin'
    AND NOT EXISTS (
      SELECT 1 FROM research_attempts ra
      WHERE ra.plugin_id = p.id
        AND ra.attempted_at >= datetime('now', '-7 days')
        AND ra.note LIKE '%no-new-angle%'
    );
  ```

  Freshness YES:

  ```sql
  SELECT p.id, m.id AS manufacturer_id, vo.verified_at, vo.confidence
  FROM plugins p
  JOIN manufacturers m ON m.id = p.manufacturer_id
  JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
  JOIN version_observations vo ON vo.id = pvc.observation_id
  WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
    AND p.resolvability IN ('open', 'kvr_ceiling')
    AND vo.verified_at < datetime('now', '-7 days');  -- replace 7 with per-vendor SLA
  ```

  Hard STOP (never select for version discovery):

  ```sql
  p.resolvability IN (
    'structurally_blocked','unversioned_by_kind',
    'discontinued_frozen','needs_identity'
  )
  ```

  Soft STOP `hub_walled`: forbid per-product public semver grind; allow hub_app oracle, portal liveness, identity fixes, documented new public angle (promote to `open_pending` → `open`).

  Banned-class attempt → `research_attempts.outcome='skipped'`, `note='resolvability-stop:<value>'`, no fetch.

  ## Promotion / demotion

  | Event | New value |
  |---|---|
  | Manufacturer confirms @≥85 | `open` |
  | Only KVR after failed dig | `kvr_ceiling`; review_after = now+90d |
  | Assault closes as portal-only | `hub_walled`; review_after = now+180d |
  | identity_kind → soundset/… | `unversioned_by_kind` |
  | New public angle for hub_walled | `open_pending` then `open` |
  | Blocked-list membership | `structurally_blocked` |

  ## Dashboard widgets (honest UI)

  Demote raw yellow as hero.

  | Widget | Definition |
  |---|---|
  | A. Resolvability stack (T1) | Counts per enum; headline **diggable debt = open_pending + unknown (plugin)** |
  | B. Yellow composition | Among conf<70: % kvr_ceiling / hub_walled / misfiled open; yellow leaders (Acustica 134, IK 106, Spitfire 68, …) |
  | C. Versionless composition | unversioned vs blocked vs **open_pending** vs hub |
  | D. Chip efficiency | promoted/researched; stop-skips/researched (plateau-healthy: promotions≈0, stops high) |
  | E. Stop-query compliance | 24h attempts on banned resolvability → **0** |

- **If accepted, what changes in the engine:**
  1. Schema v7 + `backfill_resolvability.py` (operator applies).
  2. Claim-ledger INSERT filters ban list + versionless identity sweep.
  3. Dashboard hero metrics switch; band counts secondary.
  4. Export optional `resolvability*`.
  5. Playbooks: one-line `resolvability_default:` per manufacturer.
  6. No confidence rubric change; no Luke input; no telemetry.

- **Expected impact:**
  - Diggable debt collapses from “1,346 yellow + 1,612 versionless” narrative to ~**113** honest plugin digs.
  - Stops burning chips on Spitfire/UVI/Steinberg/soundset rows (stop-query compliance).
  - Makes green-plateau pivot measurable (freshness covers `open`/`kvr_ceiling` only).

- **Risks / caveats:**
  - Manufacturer-level `portal_app` can over-wall vendors that later gain public recipes — **recipe-health override is mandatory** (PA changelog, Softube RN, SSL Zendesk, Waves browser RN).
  - Suite components (~135 yellow globally) may need post-backfill refinement (`needs_identity` vs `kvr_ceiling`).
  - Drive tier-1 `unknown` to <50 within one classification chip or enum is too vague.
  - Do not blank existing accepted versions when setting `unversioned_by_kind`.

- **Suggested first step:**
  RO dry-run backfill script printing counts per enum (no DDL); Muse verifies diggable debt ≈113 ±20 and banned classes → 0 in dig query; then apply schema v7.

- **New evidence since last verdict:**
  Verdicts empty; deepens 2026-09-24 taxonomy with live yellow kvr-product-page **1119**, portal_app counts (PA IM 294 / Softube Central 164 / SSL DM 69), and full SQL stop-query pack from `advisory-deep/integrity/TAXONOMY.md`.
