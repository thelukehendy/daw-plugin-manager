# Image-Line diggable plugins are FL-installer-coupled

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** 15 Image-Line diggable residuals (Morphine, Toxic Biohazard, Drumaxx, DX10, Juice Pack effects, …).

### Public facts
- https://www.image-line.com/vst-downloads — standalone VST/AU installers marked **discontinued**.
- Plugins now deliver via **FL Studio installer**; product pages say demo is inside FL installer; owned unlock via account licenses page (login).
- Public host tips on https://www.image-line.com/fl-studio/download (fetched 2026-09-25):
  - Windows **26.1.6.5639**
  - macOS **26.1.6.5406**
  - Marketing version string **26.1.6** (JSON-LD dateModified 2026-09-07)

### Posture options for Muse (pick one; do not invent per-plugin tips)
1. **`structurally_blocked` / `daw_bundled`:** no independent plugin semver; stop dig; show “updates with FL Studio”.
2. **Host-coupled observation (design only):** optional observation on a synthetic `image-line--fl-studio` hub_app / daw row using 26.1.6 — **never** copy that onto Morphine/Toxic/etc. rows.
3. Account licenses page is login-walled — out of bounds per constraints.

### Diggable impact
Stop 15 futile digs; honest UX for FL-owned plugin users.

- **Recommendation:** Prefer option 1 + optional FL host canary row (option 2) as separate identity.
- **New evidence:** vst-downloads discontinued table; FL download page version fixtures.
