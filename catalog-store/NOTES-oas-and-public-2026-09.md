# NOTES — OAS registry accept + public downloads (2026-09)

## Starting context
- Brief claimed accepted=611 / OAS=0 accepted; live store already had **1193** accepted current including **559/559 OAS** from a prior pass (older receipt meta: bulk `plugins.json` URL + shared file hash).
- Re-fetched live bulk index → `tmp-fetch/oas-plugins-live.json` (559 packages).

## OAS (primary)
- Script: `src/accept_oas_registry.py`
- Mapping: `plugin_id = "oas--" + slugify(slug)` (matches import; edge cases verified).
- Ran with `--refresh-receipts` so every OAS current observation now uses:
  - `source_kind=vendorFeed`
  - `extract_method=oas-registry-plugins-index`
  - `source_url=…/plugins/{slug}/index.json`
  - `evidence_snippet=OAS registry version field: {ver}`
  - `content_hash=sha256(canonical per-plugin JSON object from bulk index)`
  - `verified_by=coding-assistant`
- Result: **559** receipt refreshes (versions unchanged; all matched live registry). New OAS version accepts this turn: **0** (already current).

## Playbooks seeded/updated
Inserted/upserted: `open-audio-stack`, `newfangled-audio`, `bettermaker`, `sonic-academy`, `splice`.
Updated brew-cask notes on: `softube` (softube-central), `native-instruments` (native-access).
Also created manufacturer row `open-audio-stack` (umbrella; plugin rows remain under `oas--*` author mfr ids).
Note: DB still has ~360 `oas--*` per-author playbook rows from an earlier seed — left untouched.

## Tertiary public downloads
### Accepted (11)
| plugin_id | version | source |
|---|---|---|
| oeksound--soothe3 | 1.0.5 | https://oeksound.com/downloads/ (Mac=Win) |
| oeksound--spiff | 1.4.4 | same |
| apulsoft--opalize | 1.1.1 | https://www.apulsoft.ch/opalize/ Downloads (v…) + mac pkg filename |
| apulsoft--splits | 1.1.3 | …/splits/ |
| apulsoft--apverb | 1.2.4 | …/apverb/ |
| apulsoft--apqualizr2 | 2.7.7 | …/apqualizr2/ |
| apulsoft--apshaper | 1.2.7 | …/apshaper/ |
| apulsoft--apunmask | 1.0.7 | …/apunmask/ |
| xfer-records--ott | 1.37 | https://xferrecords.com/freeware Install_Xfer_OTT_137.{dmg,exe} |
| xfer-records--dimension-expander | 1.24 | Install_Xfer_DimensionExpander_124.{dmg,exe} |
| xfer-records--djmfilter | 1.25 | Install_Xfer_DJMFilter_125.{dmg,exe} |

### Skipped (policy / no clear receipt)
- **oeksound--bloom**: Mac **1.1.2** vs Win **1.1.3** — dual Mac/Win mismatch; do not invent a single version.
- **oeksound--sculpt**: not present on downloads page.
- **apulsoft--aptrigga**: store SKU is apTrigga; public page is **apTrigga3** @ 3.7.4 — generation mismatch; no accept.
- **xfer** Serum 2 / LFOTool / Cthulhu / Nerve: product pages lack clear public installer semver (downloads URL 404; freeware page covers freebies only). Delta Modulator / 8-Bit Shaper: no clear shared semver in installer filenames.
- **u-he**: public support page points to My Licenses (account) for downloads; no clear per-SKU public version list on fetched page. Expansion soundset unknowns remain.
- **celemony Capstan**: product marketing page; no crystal-clear version string.
- **cherry-audio**: products listing fetched; no per-plugin version labels found without deeper per-SKU pages.

## Artifacts
- `tmp-fetch/oas-plugins-live.json`
- `src/accept_oas_registry.py`
- `NOTES-oas-and-public-2026-09.md` (this file)
