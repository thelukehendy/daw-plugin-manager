# United Plugins

Per-SKU installers are **UnitedPluginsManager**-gated. Marketing/download pages expose manager version only — never stamp onto plugins. Public fill via branded KVR slugs.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR branded slugs `{product}-by-{label}-by-united-plugins` | **Yes** | e.g. `firepresser-by-firesonic-by-united-plugins`, `bassment-core-by-muramasa-by-united-plugins`. Round 7: **13/13**. |
| unitedplugins.com/download | Manager only | Publishes **UnitedPluginsManager** version — **do not** accept as plugin CFBundle. |
| /download/old legacy | Stale | Not current — do not use. |
| UnitedPluginsManager | **No (account/app)** | Do not grind. |

## Last scrub result

- Round 7: **+13** — **13/13 complete** (`kvr-product-page`).
- Confidence raise 4–5: non-raise (product pages semver-free; manager-only public oracle).
- Store: **13/13** versioned; **13 yellow**.

## Weekly scrub recipe

1. Confirm 13 Core/full SKUs still present; refresh KVR `verwin` per branded slug.
2. Match Core SKUs only to `*-core*` / `*core*` slugs — never stamp full-product verwin onto Core.
3. Read /download only to confirm manager still isn’t a plugin oracle; ignore manager semver for plugin rows.
4. Confidence: **stay KVR@60** until manufacturer per-SKU corroboration.
5. Update `last_scrub_at`.

## Confidence policy

- Stay **KVR@60** until manufacturer corroboration.
- Never raise from UnitedPluginsManager version.
- Electron: yellow + **UnitedPluginsManager** CTA.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **UnitedPluginsManager** |
| Hub URL | https://unitedplugins.com/Download/ |
| UX | “Update via UnitedPluginsManager”. Catalog KVR versions are receipts only. |
| `hub_walled` | **1** |


## Confidence raise 15
- Non-raise this pass — see NOTES-confidence-raise-15.md.

## Confidence raise 17
- Product pages live (FirePresser/Bassment Core/Urban Puncher) but semver-free; manager-only oracle — hub skip.

## version-chip-expand-7
- +46 commercials via KVR branded slugs @60 (59/59 versioned). Manager-only public download — stay yellow.

## Confidence raise 21
- Non-raise: UnitedPluginsManager download session-gated; no per-SKU manufacturer semver.

## Confidence raise 23
- **+2** @92 via public news: Autoformer **5.0** (`/news/detail/135` version 5), Phantomix **1.1** (`/news/detail/133`). Remaining **57** yellow: Manager-only / semver-free product pages / stale news older than KVR — leave KVR@60.

## Confidence raise 24
- Systematic `/news?page=1..10` → 120 detail ids (6–143); fetched missing older articles. Strong name+version scan: **0 new** exact matches vs remaining 57 yellow (only Autoformer/Phantomix already raised). All other update posts older than KVR — do not stamp. Product pages still semver-free / Manager-gated.

## Confidence raise 25 (2026-09-10 ~5:32 AM PT)
- Non-raise: `/Manuals/` → `/Product/documentation` HTML only — **0** changelog PDFs, **0** public installer semver. Manager-only download. Remaining **57** yellow stay KVR@60.
