# NOTES — confidence raise 13 (2026-09-10 ~2:55 AM PT)

Overnight corroboration pass #13. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Focus: leftover KVR@60 yellows with possible public manufacturer evidence (PSP, Kush, United Plugins, Cableguys, TAL freeware, Output, Xhun expansions, AO leftovers, Audified leftovers). Zero trust; no invented versions. Wrapped early per parent steer — no further manufacturer probes after wrap.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **14** (yellow→green) |
| Official downloads page Mac/Win labels @90 | **13** (Kush Audio) |
| Manufacturer product-page Downloads-v @92 | **1** (TAL-Elek7ro) |
| Snapshot accepted-current green (≥85) | **2807** |
| Snapshot amber (70–84) | **56** |
| Snapshot yellow (<70) | **1405** (mostly KVR @60; universe growth also inflated yellows) |

*This run’s own corroboration delta is **+14 green / −14 yellow** for the touched currents. Concurrent universe/identity activity can change absolute yellow totals independently of this raise.*

Starting bands (raise-13 open): green **2771** / amber **56** / yellow **1257**. After this raise (+ concurrent catalog growth): green **2807** / amber **56** / yellow **1405**.

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| Kush Audio | **13** | `thehouseofkush.com/pages/downloads` per-SKU Mac/Win version + `thedataofkush.com/installers/*` | **90** |
| TAL Software | **1** | `tal-software.com/products/tal-elek7ro` **Downloads v 2.7** | **92** |

## Breakdown of raises

### Kush Audio (+13)

Public downloads page lists Mac • Win version labels beside each live SKU. For this macOS catalog, **Mac** is authoritative. Exact match kept; when Mac > KVR (KVR often tracked Win), accept manufacturer Mac as newer current.

| plugin_id | Accepted | vs KVR | Notes |
|---|---|---|---|
| clariphonic-mk3 | 1.0.1 | = | exact |
| hammer-mk2 | 1.0.5 | = | exact |
| ubk-2 | 1.0.3 | = | exact |
| q-632-analog-phased-eq | 1.0.1 | = | exact |
| ar-1 | 1.1.1 | KVR 1.0.7 | Mac newer (Win 1.0.7) |
| blyss | 1.2.3 | KVR 1.1.0 | Mac newer (Win 1.1.0) |
| electra-dsp | 1.7.1 | KVR 1.6.0 | Mac newer (Win 1.6.0) |
| lg-drive | 1.1.2 | KVR 1.0.0 | Mac newer (Win 1.0.0) |
| novatron | 1.2.3 | KVR 1.1.0 | Mac newer (Win 1.1.0) |
| omega-n | 1.2.1 | KVR 1.1.0 | Mac newer (Win 1.1.0) |
| reddi | 1.1.1 | KVR 1.0.3 | Mac newer (Win 1.0.3) |
| silika | 1.2.2 | KVR 1.1.0 | Mac newer (Win 1.1.0) |
| ubk-pusher | 1.2.2 | KVR 1.1.4 | Pusher Mac 1.2.2 (Win 1.1.2); Mac authoritative |

Kush yellow remaining: **5** — clariphonic-dsp-mkii, goldplate, hammer-dsp, omega-a, omega-458a (Legacy Downloads titles only; no version; do not stamp Omega 2 458a/A **1.0.0** onto gen-1 Omega rows).

### TAL Software (+1)

- `tal-software--tal-elek7ro` **2.7** — product page `Downloads v 2.7` exact match @92.
- Remaining yellow **7**: bassline / dub / dub-ii / dub-iii / reverb-iii / u-no-62 / useq — freeware archive pages without semver labels (or uncorroborated before wrap).

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| PSP Audioware 15 | Product pages live for some SKUs but **no public installer/dmg semver** on page (freemium/account pattern); CDN naming sweep not completed before wrap / prior raise-10 HEAD 404s. Leave yellow. |
| United Plugins 13 Core | Still manager-only public oracle (`UnitedPluginsManager`); no per-SKU installer/changelog match. Do not raise from manager version. |
| Cableguys 13 modules/Curve | No per-module Manual PDF / installer receipt; do not stamp ShaperBox suite version onto modules. Not re-probed after wrap. |
| Output 11 | Hub/account-oriented; no public product-page semver corroboration this pass. Skip hub. |
| Xhun Audio 8 | Download trials page lists main plugins only; Big Steps / Electro Punks / … expansions + SmartRig Pro **not** versioned there. Do not invent expansion **1.0**. |
| Analog Obsession leftovers 7 | amper/channev/chopa/dynasaur/predd — no new CDN/Patreon VERSION before wrap; rarese/tilta still manufacturer≠KVR (skip). |
| Audified leftovers 11 | No new RN PDFs found before wrap; prior mismatch/no-RN set unchanged. |
| Kush legacy 5 | Legacy Downloads list without versions; Omega 2 ≠ Omega gen-1. |
| TAL freeware 7 | Archive zip filenames without Downloads-v semver. |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **2807** / amber **56** / yellow **1405**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| psp-audioware | 15 |
| kush-audio | 5 |
| united-plugins | 13 |
| cableguys | 13 |
| tal-software | 7 |
| output | 11 |
| xhun-audio | 8 |
| analog-obsession | 7 |
| audified | 11 |

## Playbook / doc updates

- `NOTES-confidence-raise-13.md` (this file)
- `playbooks/kush-audio.md` — downloads-page Mac/Win method + raise-13 results
- `playbooks/tal-software.md` — Elek7ro Downloads-v raise; freeware no-semver note

**Not** rewritten (parent): `STATUS.md` / `HANDOFF-FOR-CURSOR.md` / `out/catalog.json` export.
