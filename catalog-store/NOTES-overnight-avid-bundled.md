# NOTES — overnight Avid bundled + creative leftovers (2026-09-09 PT)

Zero-trust overnight pass while Luke asleep. Start: **2569/2827** accepted · **258** unknown.
End: **2624/2827** accepted · **203** unknown (Δ **+55**). `verified_by=coding-assistant`. No git clone.

## A — Avid stock / daw-bundled strategy (**+55**)

**Public Pro Tools version proven:** **2026.4.1**

| Source | Evidence |
|---|---|
| https://www.avid.com/pro-tools/whats-new | Heading **"PRO TOOLS 2026.4.1 (JULY 2026)"**; page states 2026.4.1 is now available |
| https://kb.avid.com/pkb/articles/en_US/Knowledge/en355241 | Support table: **7/9/2026 | 2026.4.1 | Bug Fixes** (current top row) |

**Accept fields (all 54 `avid--*` unknowns + `digidesign--invert-duplicate`):**

| field | value |
|---|---|
| observed_version / latestVersion | `2026.4.1` |
| source_url | `https://www.avid.com/pro-tools/whats-new` |
| source_kind | `other` |
| extract_method | `daw-bundled-version` |
| evidence_snippet | ships with Pro Tools 2026.4.1; no independent plugin semver (+ KB corroboration) |
| content_hash | SHA-256 of fetched what's-new HTML |
| update_class / bundled | `bundled` / `1` |
| notes_for_user | host-version tracking; update via Avid Link / Pro Tools installer |
| confidence | **70** (host proxy; rubric patched in `backfill_confidence.py`) |

Rationale: these are Pro Tools stock plugs with no public per-plugin installer semver (prior KVR/Avid marketing probes failed). Host DAW version is the responsible public receipt.

Artifacts: `tmp-fetch/overnight-avid/avid-whats-new.html`, `avid-kb-support.html`, `avid-bundled-accepts.json`.

## A2 — Creative leftovers (re-probed, **+0** accepts)

| bucket | probe result |
|---|---|
| **Softube (~27)** | Individual KVR pages for Active/Passive/Focusing EQ, TSAR-1, Trident, Fix Doubler/Flanger, Model 72/77/84 → login wall or newest-plugins redirect. softube.com product URLs **404**. Pack-only policy still blocks mapping Passive-Active Pack **2.6.41** → component EQ SKUs; Amp Room Suites / British Class A parts / Dyna-mite Gate·Slam / Console 1 hardware·editions unchanged. |
| **Arturia gen (13)** | Classic `*-v` slugs still redirect to `*V4`/`Vn` (e.g. Mini V → Mini V4 **4.0.4.6366**). Generation-ambiguous policy — **no accept**. |
| **AIR Creative Collection (20+Vacuum)** | No individual live KVR product pages (login/redirect). Not stamped with Pro Tools host version (separate inMusic AIR Effects Bundle; prior year-only reject). |
| **PA / SPL 404s** | `bx_crispyscale` 404; leftovers discontinued/renamed. Live **bx_XL V3** page exists but catalog SKU is **V2** — gen mismatch skip. `products.json` 404 this probe. |
| **u-he (27)** | Re-fetched `dl.u-he.com/releases/` — only core instruments/FX already accepted (Diva/Hive/Zebra3/…). Remaining are soundsets/expansions, eurorack (CVilization/MELT), cookbook — skipped per playbook. |
| **Steinberg (8+Reason Rack)** | KVR ChannelX/PEX → login/redirect; no public per-SKU semver. Reason Rack Plugin remains manufacturer-mismatch skip. |
| **Slate scraps** | VSX / VBC components / Inf Horizon / Rotary / Trigger_2 / Virtual Channel·MixBuss — no clean individual verwin. |
| **Audiomovers Listento-MIDI** | LISTENTO + Receiver already **2.141.20260225**; MIDI SKU still no public KVR/product receipt (timeouts / thin vendor site). |

## B — Confidence columns

`migrate_v3` / `backfill_confidence` completed in parallel (`schema_version=3`). Confidence columns **exist**. daw-bundled rows set to **70** with explicit reasons; `backfill_confidence.py` patched so re-runs keep the daw-bundled rule (does not invent higher scores from avid.com URL alone).

## C — Artifacts

- Notes: this file
- Playbook: `playbooks/avid.md` updated
- Remaining: `REMAINING-UNKNOWNS.md` + `tmp-fetch/overnight-avid/remaining-structured.json`
- Export: `out/catalog.json` (**2624** with accepted latestVersion)
- Stats: manufacturers 475 · plugins 2827 · accepted current 2624 · without 203

## Totals

| metric | before | after |
|---|---:|---:|
| accepted | 2569 | **2624** |
| unknown | 258 | **203** |
| Δ accepted | | **+55** (all Avid daw-bundled) |
