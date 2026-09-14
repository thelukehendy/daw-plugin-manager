# NOTES — version chip Slate Digital (true gaps 12)
**When:** 2026-09-10 ~1:45–2:00 AM PT (overnight keep-going)
**Path:** `/workspace/daw-plugin-catalog-store`
**Manufacturer:** `slate-digital`
**verified_by:** coding-assistant

## Goal
Fill 12 true gaps (no `plugin_version_current`) without grinding Slate Activate / inMusic Software Center.

## Method order tried
1. **Public slatedigital.com product pages** — marketing only; no installer semver / version matrix (hub CTA to Activate / Connect). Confirmed via WebSearch + product pages (FG-2A, Infinity EQ, VMR 3.0, March 2025 update article lists titles without build numbers).
2. **KVR product pages** — all 12 had clean Product Version → accepted @60.
3. **Wayback installer filenames** — not needed after KVR hit; manufacturer CDN/public installers remain portal-gated.

## Result
| Metric | Value |
|---|---|
| **Accepted this chip** | **12 / 12** |
| Still unknown (of the 12) | **0** |
| Confidence | **KVR@60** (yellow) — no manufacturer corroboration |
| Hub | Still **Activate / inMusic Software Center** |

## Accepts (all `kvr-product-page` @60, `--set-current`)

| plugin_id | version | KVR slug |
|---|---|---|
| `slate-digital--fg-2a` | 2.5.2.1 | fg-2a-by-slate-digital |
| `slate-digital--fg-a-vintage-eq` | 1.0.6.0 | fg-a-vintage-eq-by-slate-digital |
| `slate-digital--fg-stress-compressor` | 2.3.1.2 | fg-stress-compressor-by-slate-digital |
| `slate-digital--fg-x-mastering-processor` | 1.4.0.4 | fg-x-mastering-processor-by-slate-digital |
| `slate-digital--infinity-bass` | 1.1.2.0 | infinity-bass-by-slate-digital |
| `slate-digital--infinity-eq` | 2.0.13.0 | infinity-eq-by-slate-digital |
| `slate-digital--rc-tube` | 2.0 | rc-tube-by-slate-digital |
| `slate-digital--repeater-slate-digital-edition` | 1.1.4 | repeater-slate-digital-edition-by-slate-digital |
| `slate-digital--transient-shaper` | 1.0.6.0 | transient-shaper-by-slate-digital |
| `slate-digital--virtual-buss-compressors-vbc` | 1.4.2.0 | virtual-buss-compressors-vbc-by-slate-digital |
| `slate-digital--virtual-mix-rack-vmr` | 3.3.10.0 | virtual-mix-rack-vmr-by-slate-digital |
| `slate-digital--virtual-tape-machines-vtm` | 1.3.3.0 | virtual-tape-machines-vtm-by-slate-digital |

HTML receipts under `tmp-fetch/slate/`.

## Naming / sibling notes (do not merge)
Several store ids are **aliases / alternate slugs** of already-versioned siblings (same KVR numbers):
- `infinity-bass` ↔ `inf-bass` (1.1.2.0)
- `infinity-eq` ↔ `inf-eq` (2.0.13.0)
- `fg-x-mastering-processor` ↔ `slate-digital-fg-x` (1.4.0.4)
- `virtual-buss-compressors-vbc` ↔ `vbc-rack` (1.4.2.0)
- `virtual-mix-rack-vmr` ↔ `virtual-mix-rack` (3.3.10.0)
- `virtual-tape-machines-vtm` ↔ `virtual-tape-machines` (1.3.3.0)

Accepted onto the **exact** gap ids; did **not** cross-stamp FG-X 2 ↔ FG-X gen-1; did not stamp VBC Rack onto FG-Grey/MU/Red.

## Manufacturer / confidence
- Public slate pages: **no** raise path (hub-walled installers).
- Stay **KVR@60** until manufacturer CDN/page corroboration or lab on-disk.
- Electron UX: yellow + **inMusic Software Center / Slate RME** CTA.

## Playbook
Updated `playbooks/slate-digital.md`.
