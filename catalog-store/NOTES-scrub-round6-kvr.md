# NOTES — scrub round 6 (KVR product-page scale) (2026-09-09 PT)

Zero-trust version scrub continuation. Start: **1550/2827** accepted. End: **2348/2827** (Δ **+798**). `verified_by=coding-assistant`. No git clone.

Method (Round-5 proven, scaled): **KVR Audio product pages** with explicit `Product Version` / `id="verwin"` (`source_kind=other`, `extract_method=kvr-product-page`), `evidence_snippet` quoting the verwin line, `content_hash` = SHA-256 of fetched HTML.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| waves | 0 → 238/243 | **+238** | Family train **17.1.42.50** on most; exact slug match |
| universal-audio | 0 → 190/202 | **+190** | UAD titles ~**11.8.3**; UADx per-plugin; skip Hardware |
| ik-multimedia | 0 → 150/157 | **+150** | T-RackS **6.3.2**, Syntronik **4.0.9**, AmpliTube 5 **5.10.9** |
| spitfire-audio | 0 → 81/82 | **+81** | Per-library verwin; skip year-only SSO |
| arturia | 0 → 68/84 | **+68** | Per-product builds; **no** V→V2/V3/V4 maps |
| overloud | 0 → 46/47 | **+46** | GEM / TH-U / REmatrix exact titles |
| mcdsp | 0 → 25/25 | **+25** | verwin **7.3.0.18** (Mac verosx 7.3.17 diverges — documented) |
| softube | 118/164 | +0 | leftovers: suites/UAD/Console1/components |
| cableguys | 7/21 | +0 | module majors / Kickstart gen-1 / ShaperBox 2 |
| cherry-audio | 46/52 | +0 | bundles/expansions |

## Matching policy applied

- Prefer **exact** catalog name → KVR slug (`{normalized-name}-by-{mfr}`).
- **Reject** fuzzy generation bumps (Arturia Mini V↛mini-v4, Matrix-12 V↛v2, Kickstart-class pitfalls).
- **Reject** Hardware KVR pages (UA pedals/OX/Volt; IK AmpliTube X-* pedals).
- **Reject** non-semver / dual strings (`2025`, `2.0.0 (2.0.6)`, `N/A`).
- Do **not** map suite/edition titles onto differently named components (Softube lessons carried forward).
- Waves / UAD / T-RackS unified family versions accepted only when the **same Product Version appears on that SKU’s own KVR page** (Softube Round-5 pattern).

## Explicit skips (samples)

- Waves: Drifter, Ignition, WaveShell, StudioRack for OBS, PuigChild Hardware (N/A).
- UA: hardware pedals/amps, Volt 876, OX; UAD Software; bx_* slug mismatches.
- Arturia: generation-ambiguous classics (Mini/CS-80/ARP2600/Matrix-12/Stage-73/VOX/B-3/Jup-8/SEM/Analog Lab V); Delay BRIGADE; Chorus JUN-6; Pure Lo-Fi.
- IK: X-* pedals; Miroslav Philharmonik 2; MODO BASS SE; AmpliTube Live + LE.
- Spitfire: Symphony Orchestra (`2025`).
- Overloud: TH-U Slate.

## Playbooks

Updated `playbooks/` + `manufacturer_playbooks` for: waves, universal-audio, arturia, ik-multimedia, spitfire-audio, mcdsp, overloud; leftover notes on softube, cableguys, cherry-audio.

## Artifacts

- Match plan: `tmp-fetch/kvr-r6/match-plan.json`, `fetch-list.json`, `accepts.json`, `skips.json`, `deltas.json`
- Product HTML: `tmp-fetch/kvr-r6/products/*.html` (~812 pages)
- Developer indexes (preexisting): `tmp-fetch/kvr-{waves,arturia,ik-multimedia,mcdsp,overloud,spitfire-audio,ua}.html`
- Export: `out/catalog.json` (**2348** with accepted latestVersion)
