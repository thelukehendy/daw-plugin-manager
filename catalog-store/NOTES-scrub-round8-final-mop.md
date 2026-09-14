# NOTES — scrub round 8 final mop (2026-09-09 PT)

Zero-trust version scrub final mop. Start: **2532/2827** accepted. End: **2569/2827** (Δ **+37**). `verified_by=coding-assistant`. No git clone.

Primary method: **KVR Audio product pages** with explicit `Product Version` / `id="verwin"` (`source_kind=other`, `extract_method=kvr-product-page`), `evidence_snippet` quoting the verwin line, `content_hash` = SHA-256 of fetched HTML.

Secondary probes (mostly no new accepts): Softube.com product URLs (404 for Active/Passive/Focusing/Trident/TSAR-1), Avid.com plugin marketing pages (no per-plugin installer semver), PA Shopify `products.json` first page only / leftovers still 404-renamed, Homebrew cask API (`softube-central` only; no Toontrack Product Manager cask), Wayback CDX for Softube Active EQ (unusable), manufacturer indexes.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| softube | 120 → 137/164 | **+17** | Softube-catalogued **UAD-*** SKUs via exact-title UA KVR pages (**11.8.3**, Amp Room Bundle **11.8.0**) |
| universal-audio | 190 → 195/202 | **+5** | UAD bx_* via underscore slugs `uad-bx_*` (**11.8.3**) |
| arturia | 70 → 71/84 | **+1** | Chorus JUN-6 ↔ `chorus-jun-6-v-by-arturia` (**1.5.1.6566**) |
| audiomovers | 0 → 2/3 | **+2** | LISTENTO + Receiver (**2.141.20260225**) |
| cableguys | 19 → 20/21 | **+1** | Nicky Romero Kickstart (**2.0.9**) exact title |
| black-salt-audio | 0 → 1/1 | **+1** | Silencer **1.1.4** — **complete** |
| audiomodern | 0 → 1/1 | **+1** | Riffer **3.1.2** — **complete** |
| apulsoft | 0 → 1/1 | **+1** | apTrigga **3.7.4** — **complete** |
| supertone | 0 → 1/1 | **+1** | Clear **1.1.6** — **complete** |
| safari-pedals | 0 → 1/1 | **+1** | Gorilla Drive **2.1.0** (KVR Safari Audio = Safari Pedals) — **complete** |
| scuffham-amps | 0 → 1/1 | **+1** | S-Gear **3.2.4** — **complete** |
| sir-audio-tools | 0 → 1/1 | **+1** | StandardCLIP **1.6.057** — **complete** |
| synthogy | 0 → 1/1 | **+1** | Ivory **3.0.8** — **complete** |
| eastwest | 0 → 1/1 | **+1** | Spaces **1.1.26** (not Spaces II) |
| linplug | 0 → 1/1 | **+1** | Organ 3 **3.2.1** — **complete** |
| surge-synthesizer | 0 → 1/1 | **+1** | Shortcircuit XT **0.9.245** — **complete** |
| avid / air / u-he / PA / Arturia gens / Softube native leftovers | unchanged | +0 | see REMAINING-UNKNOWNS.md |

## Matching policy applied

- Prefer **exact** catalog name → KVR slug/title; allow documented aliases (`Chorus JUN-6` ↔ `Chorus JUN-6 V`; Safari Pedals ↔ Safari Audio; Softube-row UAD-* ↔ UA KVR page when **h1 exact**).
- Softube UAD-* under manufacturer `softube`: accept **only** when Universal Audio KVR product page title matches the catalog SKU exactly (playbook: “unless UA/KVR page matches that SKU”).
- **Reject** Softube suite→component (Passive-Active Pack ↛ Active/Passive/Focusing EQ; Amp Room ↛ *Suite; British Class A ↛ parts; Fix Flanger and Doubler ↛ splits; Dyna-mite ↛ Gate/Slam; Overstayer M-A-S ↛ Extended; Tonelux Tilt ↛ Tilt Live; Console 1 editions/hardware).
- **Reject** Arturia generation bumps (Mini V↛V4, etc.); Omnisphere gen; Vacuum↛Classic/Pro; Spaces↛Spaces II; Reason Rack Plugin manufacturer mismatch (Steinberg vs Reason Studios); ConvologyXT Wave Arts vs Impulse Record; EON Arp ≠ EON-Arp MIDI; AIR Creative Collection year-only `2024`; VocAlign Pro dual string; Miroslav `2.0.0 (2.0.6)`.
- Avid Pro Tools stock plugs: no individual KVR product pages (developer index is DAW/Sibelius only; slug probes → login wall or newest-plugins redirect). Avid.com marketing pages lack installer semver.

## Explicit skips (true impossibles / policy)

- **Avid** (54) + digidesign Invert-Duplicate: stock/bundled — no public per-plugin semver.
- **AIR** Creative Collection `AIR*` effects (20) + Vacuum gen ambiguity (1).
- **Softube** (~27): Passive-Active pack-only EQs, suites/components, Console 1 hardware/editions, Model 72/77/84 FX spinouts, Trident/TSAR-1 (no live individual product page).
- **u-he** (27): soundsets/expansions + eurorack hardware (CVilization/MELT) + cookbook — not DAW plugin installers.
- **Arturia** (13): classics without exact gen slug (V→Vn redirects).
- **PA/SPL** discontinued/renamed Rangers/Sauce/alpha/crispyscale/bx_XL V2/Attacker lineage.
- UA hardware pedals/OX/Volt; Waves shells/hardware; Spitfire SSO year-only; hubs (Toontrack TPM, UAD Software).

## Playbooks

Updated `playbooks/` for: softube, universal-audio, arturia, audiomovers, cableguys, avid, air, u-he, and newly completed long-tails (silencer/riffer/aptrigga/clear/gorilla/s-gear/standardclip/ivory/spaces/organ-3/shortcircuit).

## Artifacts

- Accepts: `tmp-fetch/kvr-r8/accepts-r8.json` (37), `softube-uad-accepts.json`
- Product HTML: `tmp-fetch/kvr-r8/products/*.html`
- Remaining inventory: `REMAINING-UNKNOWNS.md` + `tmp-fetch/kvr-r8/remaining-structured.json`
- Export: `out/catalog.json` (**2569** with accepted latestVersion)
