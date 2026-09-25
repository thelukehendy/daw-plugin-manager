# Wave 6 — Identity edge guards + tier-2 recon (combined)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Note:** Design-level proposals only. Muse re-fetches before any raise.

## Part A — Identity edge guards


## Live RO snapshot counts (local store; Muse should re-run on live DB)
| identity_kind | n |
|---|---:|
| plugin | 5363 |
| soundset | 1979 |
| bundle | 325 |
| suite_component | 195 |
| expansion | 137 |
| discontinued | 135 |
| hardware | 110 |
| hub_app | 87 |
| gen_ambiguous | 78 |
| … | … |

## High-confidence misfiles (diggable)
UA Producer / Studio / Signature / UADx Essentials / UADx Signature Edition rows — see companion UA editions file. Reclass to `bundle`.

## Heuristic scan (needs human/Muse confirm — not auto-reclass)
`identity_kind=plugin` AND name matches Edition/Bundle/Suite → **30+** candidates in local DB (JSON fixture `suspicious-editions.json`).
Examples of **false positives** if regex-blind: Goodhertz “Mastering Edition” (often a real SKU), Neural DSP “Fortin * Suite” (product line name).

### Guard design
1. **Vendor allowlists** for edition-as-SKU (Goodhertz, etc.).
2. **Vendor denylists** for edition-as-pack (UA *Edition packs, “Signature Edition V3”).
3. Chip reject: refuse version raise when `identity_kind` in unversioned set OR denylist hit.
4. `gen_ambiguous` (78): mandatory identity pass before any version dig (already in accepted taxonomy).

## Renames / successors
Local DB has `supersedes_plugin_id` (79) and `successor_plugin_id` (123) populated — maintenance path: export integrity check that successor chains don’t leave both ends `open_pending` with conflicting tips.

- **Recommendation:** Ship UA denylist immediately; add Edition-name review queue (read-only) for Muse; unit-test guards.
- **New evidence:** Diggable UA list + local identity_kind histogram + suspicious-editions.json.

## Part B — Tier-2 recon ranked


## Method
Rank by: public_oracle_quality × plugin_count × update_churn_guess. Local DB lacks `popularity_tier` (stale snapshot) — Muse should re-rank on live tier flags.

## Tier-A entry candidates (public oracles likely)
1. **GitHub-release OSS** — Airwindows, x42, Surge, Calf, etc.: Releases/Atom tips; high automation, low drama.
2. **Manufacturer changelog HTML** — vendors already green-friendly in tier-1 playbooks’ long tail cousins (Valhalla-class sites).
3. **Sparkle / electron-updater / latest.yml** — any hub_app with public YAML (Softube-class pattern, accepted).
4. **Zendesk RN matrices** — Sonnox docs-index pattern; SSL data-link pattern (accepted).

## Tier-B (mixed / thin)
- KVR-only long tail: freshness only after `kvr_ceiling` taxonomy (accepted design).
- Shop pages with “Latest” and no semver (Lexicon/Flux class) — hub_wall.

## Tier-C (park)
- Login-only portals without public canary.
- Sample libraries / soundsets (unversioned_by_kind).

## Suggested assault order IF Luke opens tier-2
1. OSS GitHub/Atom batch (fast wins, fixture CI).
2. Changelog-HTML manufacturers with >20 plugins.
3. Sparkle/YAML hub apps.
4. Docs-index RN vendors.
5. Explicit parks with `oracle_absent`.

## Standing constraint
Recon markdown only until Luke unpauses tier-2. Engine may store scout notes; no raises.

- **Recommendation:** Keep this as the entry plan; Muse fills live counts when ready.
- **Caveat:** Exact 126/3325 figures from brief — re-verify on live DB.
