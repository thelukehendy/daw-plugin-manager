# ssl

## Stubborn-gaps-final (2026-09-10 ~2:06 AM PT)
- Meter Pro: store page + SSL Download Manager / Complete Access Hub only. Offline Plug-in Downloads FAQ lists **Meter v1.6.6** (not Meter Pro). User guide has no build number. Leave unknown; portalApp=SSL Download Manager. Next lever: Download Manager release notes / lab Mac.

## Gaps mop expand-2 (2026-09-10 ~2:36 AM PT)
- SSL Meter Pro still Download Manager / Complete Access only — leave portal-only.

# ssl

## universe-expand-3 version chip (2026-09-10 ~2:50 AM PT (expand-3 version chip))
- New expand3 SKUs: KVR@60 where Win=Mac (4K G, autoSeries, DeEss, X-Orcism II, LMC-1, X-ISM).
- **Reclassified hardware (500 Series Application on KVR):** UltraViolet EQ, B-Series Dynamics, E-Series Dynamics, SiX Channel, VHD+ Pre — leave unversioned.

## Maintenance recipe (verified 2026-09-19)
- **Cheapest oracle:** the Zendesk public API — `https://support.solidstatelogic.com/api/v2/help_center/en-gb/articles/4849510029085.json` (no auth, read-only) returns the article body HTML including the `data-link` installer attributes per table cell. Parse per `<tr>`: label cell + both platform cells' data-links → exact installer filenames (Mac `.dmg` / Win `.exe`) + folder date prefixes. The article `updated_at` is the freshness signal (was 2026-09-14T15:53:19Z on 2026-09-19). NOTE: article slug changed from `...-SSL-and-Harrison-Plug-in-Downloads` to `...-SSL-Plug-in-Downloads` (old URL 301s).
- **Rules:** prefer installer filename over table label when they diverge (table labels go stale — AutoEQ 1.0.41/ AutoDYN 1.0.5/ AutoBUS 1.0.17 labels vs installers 1.0.43/1.0.6/1.0.18); folder paths carry date-version prefixes (`2026.09.01 - v1.3.1`) but legacy folders keep stale names (`X-Comp v6.6.7` folder holds v6.8.2 installers) — always read the FILENAME, not the folder.
- **Identity:** the 360° table carries BOTH base rows (4K B 1.9.8 / 4K E 1.6.8 / 4K G 1.2.7) and "(sonible add-on)" rows (4K B 1.10.2 / 4K E 1.7.1 / 4K G 1.3.1). Catalog mapping: 4K G row = sonible add-on (installer-confirmed), 4K B/E rows = base. NEVER stamp an add-on version onto a base row.
- **Dual-mismatch watch (2026-09-19):** Acoustifier Mac installer v1.0.18 (old-layout cell) vs Win v1.0.19 + table label v1.0.19 — stored 1.0.19 kept per no-churn-without-positive-evidence; re-check whether the Mac cell updates. **2026-09-19 re-check:** Mac cell STILL v1.0.18 (article updated_at unchanged 2026-09-14); mismatch persists, watch continues.
- **Page bug (2026-09-19):** the "360 Link v1.4.8" Mac cell's data-link is the literal string "data-link" (malformed); Win installer confirms 1.4.8.
- Meter Pro still SSL Download Manager / Complete Access only (do not map to Meter 1.6.6).

## Confidence raise 18 (2026-09-10 ~3:50 AM PT)
- **+5** via support article [SSL Plug-in Downloads](https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads):
  - Exact: 4K G **1.3.1**, DeEss **1.4.1**
  - Newer installer filenames superseding stale KVR/table labels: autoBUS **1.0.18**, autoDYN **1.0.6**, autoEQ **1.0.43**
- Prefer **installer filename** over stale table label when they diverge.
- Still yellow: X-Orcism II — article redirects to store marketing; no public semver.
