# NOTES — micro/macro overnight (paid gen successors)

Date: 2026-09-10 ~1:00 AM PT / 2026-09-10T07:51:48Z  
Store: `/workspace/daw-plugin-catalog-store`  
Policy: high-confidence mappings only; no version invention; no guesses; both naming styles set (`successor`/`predecessor` + legacy `supersedes*`).

## Summary

| Metric | Value |
|---|---|
| `successor_plugin_id` before | **70** |
| `successor_plugin_id` after | **93** |
| Delta | **+23** |
| Pairs touched this run | **23** |

## Links added / affirmed

### D16 Group (gen1 → gen2)
Paid major upgrades; gen-1 and gen-2 are separate store SKUs (CDN folders differ — see `playbooks/d16-group.md`).

| Predecessor | Successor |
|---|---|
| `d16-group--drumazon` | `d16-group--drumazon-2` |
| `d16-group--fazortan` | `d16-group--fazortan-2` |
| `d16-group--nepheton` | `d16-group--nepheton-2` |
| `d16-group--nithonat` | `d16-group--nithonat-2` |
| `d16-group--phoscyon` | `d16-group--phoscyon-2` |
| `d16-group--punchbox` | `d16-group--punchbox-2` |
| `d16-group--redoptor` | `d16-group--redoptor-2` |
| `d16-group--sigmund` | `d16-group--sigmund-2` |
| `d16-group--syntorus` | `d16-group--syntorus-2` |
| `d16-group--toraverb` | `d16-group--toraverb-2` |
| `d16-group--lush-101` | `d16-group--lush-2` |

Not linked: Decimort/Devastor gen-1 absent from universe (only gen-2 rows). Repeater Slate Digital Edition ≠ D16 Repeater.

### Baby Audio
| Predecessor | Successor | Notes |
|---|---|---|
| `baby-audio--i-heart-ny` | `baby-audio--ihny-2` | Renamed gen2 |
| `baby-audio--transit` | `baby-audio--transit-2` | Paid gen2 |
| `baby-audio--smooth-operator` | `baby-audio--smooth-operator-pro` | Paid Pro edition |

Skipped: Comeback Kid ≠ Baby Comeback (distinct products per playbook).

### oeksound soothe chain
`soothe` → `soothe2` → `soothe3` (ranks 1/2/3). Middle row keeps both predecessor and successor.

### Cableguys
| Predecessor | Successor |
|---|---|
| `cableguys--shaperbox` | `cableguys--shaperbox-2` |
| `cableguys--filtershaper` | `cableguys--filtershaper-xl` |

Note: site may market ShaperBox 3; not in universe — no invent. FilterShaper Core left unlinked (edition/SKU ambiguity).

### u-he
| Predecessor | Successor |
|---|---|
| `u-he--zebra-legacy-zebra2` | `u-he--zebra-3` |
| `u-he--zebralette` | `u-he--zebralette-3` |
| `u-he--hive-science` | `u-he--hive-science-2` |

### Synchro Arts
| Predecessor | Successor | Notes |
|---|---|---|
| `synchro-arts--vocalign-pro-old` | `synchro-arts--vocalign-pro` | Explicit “(old)” → current Pro |

**Not** linked: VocAlign Project / Standard / Ultra — concurrent edition tiers, not sequential generations. RePitch 2 Elements/Standard likewise concurrent.

### Plugin Alliance / SPL
| Predecessor | Successor |
|---|---|
| `plugin-alliance--spl-transient-designer` | `plugin-alliance--spl-transient-designer-plus` |

## Explicit non-links (documented)

| Candidate | Why skipped |
|---|---|
| FabFilter Pro-Q 2 → Q3 | Pro-Q 2 **not in universe** (Q3→Q4 already linked by migrate_v2) |
| FabFilter Pro-L / Saturn / Timeless / Twin / Volcano gen-1 | Gen-1 SKUs absent; only current gens present |
| Valhalla DSP products | Single-SKU lines — no paid gen successors in-catalog (`SCHEMA-MICRO-MACRO.md`) |
| Xfer Serum → Serum 2 | Serum gen-1 absent |
| VocAlign Project↔Standard↔Ultra | Concurrent editions, not macro gens |
| Soundtoys Little* ↔ full | Concurrent product tiers / spinouts, not gens |

## Playbooks strengthened (markdown + DB)

`playbooks/waves.md`, `ik-multimedia.md`, `spitfire-audio.md`, `universal-audio.md` (UADx vs UAD DSP), `slate-digital.md`, `output.md`, `united-plugins.md`, `nugen-audio.md`, `audiothing.md`.

Each now has: discovery methods (public vs gated), last scrub result, weekly scrub recipe, confidence policy (stay KVR@60 until mfr corroboration), portalApp / Electron hub notes. DB `manufacturer_playbooks` rows upserted (`cadence_hint=weekly`).

## Commands

```bash
cd /workspace/daw-plugin-catalog-store
python3 src/export_catalog.py
python3 src/status_report.py
```
