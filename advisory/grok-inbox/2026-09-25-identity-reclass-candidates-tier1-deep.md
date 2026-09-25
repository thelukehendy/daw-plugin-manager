# Tier-1 identity reclass candidates (Wave 7 Ask 4) — merged

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (wave7 asks4+5)
- **Problem:** Rows still wearing `identity_kind=plugin` that are commerce bundles / suites / edition packs / multi-plugin collections — tip-stamp contamination.
- **DB:** `/workspace/daw-plugin-manager-publish/catalog-store/data/catalog.db` RO; `eff_tier = COALESCE(plugins.popularity_tier, manufacturers.popularity_tier) = 1`.

## Method
1. Name ILIKE Edition|Bundle|Suite|Collection|Pack|Complete **plus** Waves `Signature Series` (missed by the token set).
2. Keep plugin-clothing kinds (`plugin` / `instrument` / `effect` / `unknown_other` / `suite_component` / reverse `hardware` misfiles).
3. Split: commerce packs → `bundle`; product-line name tokens → **allow keep plugin**; content packs → `expansion` (review).
4. Strengthen with live public product URLs (this pass).

Parent draft baseline: **7 high / 15 review**. This merge: **18 high / 17 allow / 5 review** (promotions + Waves Series + allowlist with evidence).

---

## High-confidence → `bundle` (18)

| plugin_id | current | proposed | why + public URL |
|---|---|---|---|
| `universal-audio--uad-producer-edition` | plugin | bundle | UA Editions template. Sweetwater: “Native Plug-in Bundle” (16 titles / 22 plugs). https://www.sweetwater.com/store/detail/UADProducerEd--universal-audio-uad-producer-edition-native-plug-in-bundle |
| `universal-audio--uad-studio-edition` | plugin | bundle | UA Editions template; Connect store edition pack. |
| `universal-audio--uad-signature-edition-v3` | plugin | bundle | UA Editions template. |
| `universal-audio--uadx-essentials-edition` | plugin | bundle | UA Editions template; UA chrome lists Essentials alongside Producer/Studio/Signature. |
| `universal-audio--uadx-signature-edition-v2` | plugin | bundle | UA Editions template. |
| `universal-audio--uadx-pultec-passive-eq-collection` | plugin | bundle | **Promoted.** Sibling UAD Pultec already `bundle`. Page: “includes three EQs”. https://www.uaudio.com/products/pultec-passive-eq-collection — fixture `ua-pultec-collection.html`. Tip 1.2.16 is collection train. |
| `softube--tube-tech-complete-collection-2` | plugin | bundle | Page: “includes the following plug-ins”. https://www.softube.com/plug-ins/tube-tech-complete-collection-2 — fixture. Tip **2.6.41** = Softube Central cohort stamp. |
| `softube--flow-mastering-suite` | plugin | bundle | **Promoted.** Subscription suite. https://www.softube.com/flow-mastering-suite — tip 2.6.41 Central stamp. |
| `softube--flow-mixing-suite` | plugin | bundle | **Promoted.** “includes 70+ plug-ins”. https://www.softube.com/flow-mixing-suite — tip 2.6.41. |
| `softube--passive-active-pack` | plugin | bundle | **Promoted.** “3-in-1 collection of EQ plugins”. https://www.softube.com/plug-ins/passive-active-pack |
| `softube--abbey-road-studios-brilliance-pack` | plugin | bundle | **Promoted.** Three EQs (RS127 Rack/Box + RS135). https://www.softube.com/plug-ins/abbey-road-brilliance-pack |
| `softube--uad-softube-amp-room-bundle` | plugin | bundle | Explicit Bundle; Softube Amp Room * Suite siblings already bundle. Softube↔UAD mfr trap. |
| `softube--uad-tube-tech-eq-collection` | plugin | bundle | **Promoted.** Collection under softube mfr; tip **12.0** is UAD Version History suite tip — Softube-UAD stamp crime. |
| `waves--chris-lord-alge-artist-signature-series` | plugin | bundle | **NEW (Series token).** https://www.waves.com/bundles/chris-lord-alge-signature-series — `product-data-type=bundle`; 6 plugins. Tip 15.0.70.71 Waves Central cohort. |
| `waves--eddie-kramer-signature-series` | plugin | bundle | **NEW.** /bundles/ + 5 component rows already in catalog. |
| `waves--jack-joseph-puig-signature-series` | plugin | bundle | **NEW.** /bundles/ `product-data-type=bundle`. |
| `waves--manny-marroquin-signature-series` | plugin | bundle | **NEW.** /bundles/; 6 component plugin rows exist. |
| `waves--tony-maserati-signature-series` | plugin | bundle | **NEW.** /bundles/; 7 component rows (ACG/B72/…). |

After reclass: clear / never export `latestVersion` for these rows; UI → portal app (UA Connect / Softube Central / Waves Central), no per-edition chip.

---

## Allow — keep `plugin` (name-token false positives)

| plugin_id | why |
|---|---|
| `goodhertz--vcme-vulf-compressor-mastering-edition` | Real SKU. https://goodhertz.com/vcme/ — “Mastering Edition” branding. Tip 3.14.1 downloadsPage. |
| `slate-digital--verbsuite-classics` | One plugin, many Fusion-IR models (“in one plugin”). Fortin-Suite allowlist class. https://slatedigital.com/verbsuite-classics-digital-reverb-plugin/ |
| `universal-audio--uad-c-suite-c-{axe,max,vox}` | Product-line “C-Suite”; discrete plugs. |
| `universal-audio--uad-engl-e646-vs-limited-edition` | Single amp; Limited Edition = marketing. |
| `slate-digital--repeater-slate-digital-edition` | Real edition of d16 Repeater — **not** a bundle. Dedupe vs `d16-group--repeater-slate-digital-edition` (suite_component). |
| `image-line--il-*-juice-pack` (×10) | “(Juice Pack)” historical line suffix; each is a discrete IL plugin. |

---

## Review (5)

| plugin_id | current → proposed | note |
|---|---|---|
| `presonus--ampire-xt-metal-pack` | plugin → **expansion** | Ampire content pack; tip 1.0 placeholder-ish. |
| `steinberg--yamaha-vintage-stomp-pack` | plugin → bundle? | Pack token; no clean public product URL this pass. |
| `plugin-alliance--nvelope-mastering-edition` | **hardware → plugin** | Reverse misclass (wave6 P0). |
| `plugin-alliance--xfilter-mastering-edition` | **hardware → plugin** | Paired reverse misclass. |
| `plugin-alliance--uad-engl-e646-vs-limited-edition` | unknown_other → delete/alias | Cross-mfr UA contamination under PA. |

**Out of scope (not identity crimes):** Avid `bundled=1` stock plugs (54) — flag correct. Orchestra Tools `/store/` portal hits — SINE store URL false positive.

---

## Fixtures
- `fixtures/wave7/identity/tier1-reclass-high.json` (18)
- `fixtures/wave7/identity/tier1-reclass-allow.json` (17)
- `fixtures/wave7/identity/tier1-reclass-review.json` (5)
- `fixtures/wave7/identity/tier1-reclass-candidates.tsv`
- `fixtures/wave7/identity/tier1-name-pattern-candidates.json` (index)
- Product HTML: `softube-*.html`, `ua-pultec-collection.html`, `waves-{cla,eddie,jjp,manny,tony2}.html`, `goodhertz-vcme.html`, `slate-verbsuite.html`

- **Recommendation:** Ship the 18 high reclasses; apply allowlist guards so regex denylists don’t eat Goodhertz/C-Suite/VerbSuite/Juice Pack; queue tips on Softube Central 2.6.41 / UAD 12.0 / Waves 15.x stamped onto suite rows.
- **New evidence this pass:** Softube/UA/Waves live product pages + Waves Series token gap + Softube 2.6.41 / UAD 12.0 stamp proof on suite rows.
