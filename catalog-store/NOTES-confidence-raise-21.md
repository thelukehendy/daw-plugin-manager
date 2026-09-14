# NOTES — confidence raise 21 (2026-09-10 ~4:36→4:42 AM PT)

Overnight corroboration pass #21. `verified_by=coding-assistant`. Prefer **new observation + set-current** for audit trail. Zero trust; no invented versions; no git clone. Focus: **united-plugins** Manager/product pages if public; **mercurial**; more **NI Official update status** yellows; **WA Update logs**; **steinberg** leftovers; skip mega hubs Waves/IK/Spitfire/Acustica/UADx.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **3** (2 yellow→green + 1 amber→green) |
| **New chip (Official)** | **1** (Traktor Pro hub_app) |
| NI Official update status @92 | **3 raises + 1 chip** |
| Snapshot accepted-current green (≥85) | **3256** |
| Snapshot amber (70–84) | **55** |
| Snapshot yellow (<70) | **1575** (KVR @60) |
| Accepted currents | **4886** (+54 vs expand-7 close: +53 chip-expand-7 +1 Traktor) |

*Live bands at expand-7 close: green **3250** / amber **56** / yellow **1526** / accepted **4832**. After chip-expand-7 + this raise: green **3256** / amber **55** / yellow **1575** / accepted **4886**.*

## Raised-by-mfr

| Manufacturer | Count | Evidence | Conf |
|---|---:|---|---:|
| native-instruments | **3 raises + 1 chip** | Public NI community “Official update status” threads (not Native Access) | **92** |

## Breakdown

### native-instruments (+3 raises, +1 chip)

| plugin_id | version | prior | Evidence URL |
|---|---|---|---|
| `native-instruments--massive` | **1.7.0** | KVR@60 → | discussion/7093 … current version: 1.7.0 |
| `native-instruments--battery` | **4.3.1** | KVR@60 → | discussion/6282 … Battery 4 current 4.3.1 |
| `native-instruments--native-access` | **3.25.2** | brew@80 → | discussion/4823 … Native Access current 3.25.2 |
| `native-instruments--traktor-pro` | **4.5.1** | *(none)* → | discussion/43 … Traktor Pro 4 current 4.5.1 (**new chip**, hub_app) |

## Explicit non-raises / skips (quality)

| Target | Why skipped |
|---|---|
| united-plugins 59 yellow | Live `unitedplugins.com/download` is **UnitedPluginsManager**-only; Manager download URLs session-gated; product pages semver-free. **Do not** stamp manager version onto plugins. Leave KVR@60 |
| mercurial-tones | Shop `products.json` / product pages expose **no installer semver** (v1.5.3 false-positives are theme chrome). KVR only covers Vanguard + Scepter Pro (chipped in expand-7 chip). No manufacturer raise |
| NI Effects Series / FM8 / Super 8 / Raum / Replika / Dirt / Driver / Freak / Solid* / VC* / Transient Master / Supercharger* | API search for “Official update status {title}” — **no matching Official threads**. Leave KVR@60 |
| NI Players (Kontakt/Reaktor/Massive X Player) | Player ≠ full-product Official threads — leave |
| wa-production 49 | Re-used raise-20 Update-log scan: **0 exact** vs KVR. Soft404×12; contaminated `2.10` chrome hits; combustor log **1.2.0** < KVR **1.2.1** (mfr older). No raises |
| steinberg leftovers 15 | Padshop Pro / VST Live Elements ≠ Pro 3; Karlette/mGuitar/Model-E/Neon/VB-1/Sequel/Omnivocal/RND Portico/Yamaha Vintage / V-Stack — legacy/unsupported or no public installer match. Do **not** invent daw-bundled |
| Waves / IK / Spitfire / Acustica / UADx | Skipped per brief (mega hubs) |

## Bands query (after)

```sql
SELECT CASE WHEN vo.confidence>=85 THEN 'green' WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END band, COUNT(*)
FROM plugin_version_current pvc JOIN version_observations vo ON vo.id=pvc.observation_id GROUP BY 1;
```

→ green **3256** / amber **55** / yellow **1575**

## Remaining yellow for focused mfrs

| Manufacturer | Yellow left |
|---|---:|
| united-plugins | 59 |
| wa-production | 49 |
| image-line | 30 |
| native-instruments | 24 |
| steinberg | 15 |
| audiority | 13 |
| mercurial-tones | 2 |

## Playbook / doc updates

- `NOTES-confidence-raise-21.md` (this file)
- `NOTES-version-chip-expand-7.md` (paired chip pass)
- `playbooks/{united-plugins,mercurial-tones,native-instruments,wa-production,steinberg,eventide,voxengo,cableguys,mastering-the-mix}.md`
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md` refreshed
- Export: `out/catalog.json` bands match DB

## STATUS HANDOFF

| Field | Value |
|---|---|
| Snapshot | 2026-09-10 ~4:42 AM PT |
| Manufacturers | **561** |
| Plugins | **7000** |
| Accepted currents | **4886** |
| Raised | **3** (+1 Official chip) |
| Bands | green **3256** / amber **55** / yellow **1575** |
| Non-AW plugin gaps | **51** |
