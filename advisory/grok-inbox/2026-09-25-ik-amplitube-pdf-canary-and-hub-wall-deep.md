# IK AmpliTube host PDF canary + diggable hub-wall posture

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** 48 IK diggable residuals (AmpliTube artist/SKU lines, Syntronik modules, Clavitube, SampleTank Alternate Keys). Need oracle-or-none without re-presenting accepted Product Manager 1.1.15 canary as new discovery.
- **Assumption flag:** Cadence pivot undecided — irrelevant here.

### What is NOT evidence
- Marketing page image paths containing `/GUI/5.10.4/` (carousel assets dated 20211004) — **do not raise**.
- Shared-site banners mentioning TONEX 2.0.3 on Syntronik pages — contamination.

### New public canary (host-facing)
URL exists (HTTP 200, ~821KB PDF):
`https://www.ikmultimedia.com/products/include/at5/gear_list_pdf/AmpliTube_5_v5.10.4_comparison.pdf`

Nearby versions `5.10.5`, `5.11.0`, `5.12.0`, `5.10.3` → **404**. Filename encodes tip **5.10.4**.

**Interpretation:** Candidate **AmpliTube 5 host** tip / marketing-doc version — NOT automatic per-artist-SKU versions. Artist packs (Brian May, Fender, …) and Syntronik modules almost certainly share a host binary train delivered via Product Manager.

### Recommended posture
| Rows | Posture | Action |
|---|---|---|
| AmpliTube artist/SKU diggable (~12) | `hub_walled` until Muse proves independent SKU builds | Optional: link `host_plugin_id` → AmpliTube 5 host when that host row exists; never invent per-SKU tips from PDF alone |
| Syntronik modules (~30+) | `hub_walled` | Same; seek Syntronik host comparison PDF (not found at guessed paths) |
| Clavitube / SampleTank Alternate Keys | `hub_walled` or `expansion` identity check | Alternate Keys smells like expansion content |
| Product Manager | already accepted canary 1.1.15 | Keep; never stamp onto SKUs |

### Maintenance chip (design)
1. Head/GET probe `AmpliTube_5_v{ver}_comparison.pdf` over a small version candidate set OR scrape `gear_list_pdf/` directory if listing ever opens (today: 404 listing; only known tip works).
2. On 200: record host tip from filename; sha256 PDF as evidence.
3. Stub/404 after known tip → alert (doc removed) without inventing versions.
4. Parallel: PM installer URL already encodes 1.1.15.

### Diggable impact
Honest stop on ~48 IK open_pending digs (hub_wall) + optional host raise for AmpliTube 5 if Muse maps a host identity row.

- **Recommendation:** Accept hub_wall for diggable IK SKUs; optional PDF filename canary for AmpliTube **host** only after Muse identity map; fixture the 5.10.4 PDF in inbox.
- **Risks:** PDF can lag installer tip; filename may stick after newer release — corroborate with PM/UI or news before green.
- **New evidence:** Live PDF 200 vs neighbor 404s; fixture bytes 821208.
