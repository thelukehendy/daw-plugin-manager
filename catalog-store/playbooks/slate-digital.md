# Slate Digital

Hub-walled yellow manufacturer. Installers via **Slate RME** / **inMusic Software Center**; public fill via KVR.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| KVR product pages (Slate Digital developer) | **Yes** | Round 7 primary oracle. Notable slugs: `virtual-mix-rack-vmr`, `virtual-tape-machines-vtm`, `virtual-buss-compressors-vbc`, `fg-x-2`, `fg-x-mastering-processor` (FG-X gen-1), `infinity-bass` / `infinity-eq`. |
| slatedigital.com product pages | Partial | Marketing; current installer matrix portal-gated. |
| Slate RME / inMusic Software Center | **No (account)** | Do not grind. Eiosis titles also redirect into Slate portal. |
| FG-X 2 vs FG-X gen-1 | Careful | Separate SKUs — never cross-stamp. |

## Last scrub result

- Round 7: **+18** → **18/26** via `kvr-product-page`.
- Confidence raise 4: non-raise (no public installer semver).
- Store: **18/26** versioned; **18 yellow**.
- Still missing / no clean KVR: VSX, Rotary SD-147, Inf Horizon, Virtual Channel, MixBuss (and related). VBC Rack ≠ FG-Grey/MU/Red individuals without own pages.

## Weekly scrub recipe

1. List slate-digital (+ `slate--*` Virtual Channel/MixBuss) unknowns and yellows.
2. KVR exact-title pass; use documented slug aliases above.
3. Never map FG-X 2 → FG-X; never stamp VBC Rack onto FG-Grey/MU/Red.
4. Do not log into RME / inMusic Software Center.
5. Confidence: **stay KVR@60** until manufacturer CDN/page corroboration (unlikely while portal-walled).
6. Note leftovers; update `last_scrub_at`.

## Confidence policy

- Stay **KVR@60** until manufacturer corroboration.
- Gen-1 ← gen-2 contamination is an anti-pattern.
- Electron: yellow + **inMusic Software Center** / Slate RME CTA.

## portalApp / hub notes (Electron UX)

| Field | Value |
|---|---|
| `portalApp` | **Slate RME** / **inMusic Software Center** |
| Hub URL | https://slatedigital.com/activate/ |
| UX | “Update via Slate / inMusic Software Center”. Eiosis AirEQ/E2Deesser may share this portal. |
| `hub_walled` | **1** |
## plugin-gaps mop-2 (2026-09-10 ~1:50 AM PT)
- **+12** via KVR Product Version @60 (FG-2A, FG-A, FG-Stress, FG-X Mastering, Infinity Bass/EQ, RC-Tube, Repeater SD, Transient Shaper, VBC, VMR, VTM).
- Classic Tubes 3 Expansion Pack → `expansion`.


## Version chip gaps-12 (2026-09-10 ~1:55 AM PT)
- True gaps filled **12/12** via KVR Product Version @60 (see `NOTES-version-chip-slate.md`).
- Public slatedigital.com: marketing only — **no** installer semver; do not raise confidence.
- Alias siblings share versions (infinity-bass↔inf-bass, VMR-vmr↔virtual-mix-rack, etc.) — accept onto exact store ids; never FG-X2↔FG-X gen-1; never VBC Rack→FG-Grey/MU/Red.
- Store slate-digital now **30** versioned (all yellow KVR); hub still Activate/inMusic.
- Confidence raise: stay **KVR@60** until manufacturer CDN/page or lab on-disk.
