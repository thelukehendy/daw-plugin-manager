# Identity classifier v2 + second sources (Wave 8 Ask 5)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (wave8 asks4+5)
- **Inputs:** wave7 HIGH18 → `bundle`, ALLOW17 keep-`plugin`, UA Editions doctrine, Softube suite-vs-SKU, Waves `/bundles/` Series token.
- **DB RO:** `catalog.db` (`mode=ro`); tier1 = `COALESCE(plugins.popularity_tier, manufacturers.popularity_tier)=1`. Columns via PRAGMA only.
- **Out of scope:** Muse verification queue re-check; catalog writes.

---

## (a) Rule-based classifier v2

Formalizes the wave7 sweep into **name-pattern rules + portal-URL-shape rules + allowlist guards**. Executable rules + P/R JSON:

- `fixtures/wave8/identity/classifier-v2-rules.json`
- `fixtures/wave8/identity/classifier-v2-pr.json`
- Test sets mirrored: `tier1-reclass-high.json`, `tier1-reclass-allow.json`
- Tier1 name-pattern universe dump: `tier1-name-pattern-universe.json` (71 rows)

### Rule families

| Family | Examples | Vote |
|---|---|---|
| **Allow guards (force `plugin`)** | Goodhertz `Mastering Edition` (mfr-scoped); UA `C-Suite C-{Axe,Max,Vox}`; `Limited Edition`; Slate `VerbSuite`; IL `(Juice Pack)`; `Repeater (Slate Digital Edition)` | plugin |
| **UA Editions / Collection** | `(UAD\|UADx) … (Producer\|Studio\|Signature\|Essentials) Edition`; residual UA `Edition` excl. Limited/Mastering/C-Suite; `Pultec Passive EQ Collection` | bundle |
| **Softube commerce** | `Flow (Mastering\|Mixing) Suite`; `Complete Collection`; `Passive-Active Pack`; `Brilliance Pack`; `Amp Room Bundle`; `EQ Collection` | bundle |
| **Waves Series** | `Signature Series` | bundle |
| **Name token** | bare `\bBundle\b` | bundle |
| **Portal URL shape** | `waves.com/bundles/` → bundle; `waves.com/plugins/` → plugin counter-signal; `uaudio.com/products/.*collection` → bundle; Sweetwater `…plug-in-bundle…` slug → bundle; Softube URL + collection/suite/pack/bundle in name → bundle | as noted |
| **Softube page-copy cues** (advisory) | “includes the following plug-ins”, “includes 70+ plug-ins”, “3-in-1 collection” | strengthens bundle |

Evaluation order: **allow guards first** (never eat allowlist), then name rules, then URL votes.

### Precision / recall (HIGH18 + ALLOW17)

Positive class = `bundle`.

| | Predicted bundle | Predicted plugin |
|---|---|---|
| **Gold bundle (HIGH18)** | TP=**18** | FN=**0** |
| **Gold plugin (ALLOW17)** | FP=**0** | TN=**17** |

| Metric | Value |
|---|---|
| **Precision** | **1.000** |
| **Recall** | **1.000** |
| **F1** | **1.000** |

**Allowlist safety:** classifier predicts `plugin` for all 17 allow rows (Goodhertz VCME, VerbSuite, C-Suite×3, ENGL Limited Edition, Repeater Slate Edition, IL Juice Pack×10). **Does not eat the allowlist.**

**Honest caveat:** HIGH18+ALLOW17 are the **derivation set** formalized as rules, not a blind holdout. Value delivered = reproducible, shippable guards + measured allowlist non-destruction. True holdout = future tier1 name-pattern hits (universe scan: 71 tier1 name-pattern rows → 18 bundle predictions, **0 extras** beyond HIGH18 under these rules).

### Softube / Waves / UA URL-shape notes
- Waves Signature Series rows resolve on vendor as `/bundles/` + `product-data-type=bundle` (wave7); classifier also fires on name `Signature Series` so URL fetch is optional for recall.
- UA Editions often lack per-edition product URLs in DB (`update_portal_url` → UA Connect hub); name rules carry recall.
- Softube Flow Suites: name rule + support FAQ copy (“50+/70+ plug-ins”) as second-source reinforcement (below).

---

## (b) Second sources for the wave7 18

**Goal:** one independent public source per HIGH18 candidate (retailer / KVR / review / vendor page **distinct from wave7 primary `public_url`**) so Muse’s verification queue shortens. **Not** re-verifying Muse’s queue.

**Result: 18 / 18 secured.**

| plugin_id | Primary independent second source |
|---|---|
| `universal-audio--uad-producer-edition` | https://www.kvraudio.com/product/uad-producer-edition-by-universal-audio (title: Bundle Plugin; also Guitar Center / Equipboard / UA Native Producer Bundle) |
| `universal-audio--uad-studio-edition` | https://www.kvraudio.com/product/uad-studio-edition-by-universal-audio (+ Equipboard) |
| `universal-audio--uad-signature-edition-v3` | https://www.kvraudio.com/product/uad-signature-edition-v3-by-universal-audio |
| `universal-audio--uadx-essentials-edition` | https://www.kvraudio.com/product/uadx-essentials-edition-by-universal-audio (Bundle Plugin) |
| `universal-audio--uadx-signature-edition-v2` | https://www.kvraudio.com/product/uadx-signature-edition-v2-by-universal-audio |
| `universal-audio--uadx-pultec-passive-eq-collection` | https://www.kvraudio.com/product/pultec-passive-eq-collection-by-universal-audio (+ live UA product page: EQP-1A / MEQ-5 / HLF-3C) |
| `softube--tube-tech-complete-collection-2` | https://www.kvraudio.com/product/tube-tech-complete-collection-2-by-softube (Collection Plugin) |
| `softube--flow-mastering-suite` | https://www.kvraudio.com/product/flow-mastering-suite-by-softube (+ Softube Flow subscriptions / FAQ) |
| `softube--flow-mixing-suite` | https://www.kvraudio.com/product/flow-mixing-suite-by-softube (+ https://www.softube.com/support/flowsuites/flow-mixing-suite_1 — “50+ pro audio mixing plug-ins”) |
| `softube--passive-active-pack` | https://www.kvraudio.com/product/passive_active_pack_by_softube (“collection of three” EQs) + MusicRadar “triple EQ bundle” review + delamar.de |
| `softube--abbey-road-studios-brilliance-pack` | https://www.kvraudio.com/product/abbey-road-studios-brilliance-pack-by-softube |
| `softube--uad-softube-amp-room-bundle` | https://www.uaudio.com/products/softube-amp-room-bundle (Vintage + Metal + Bass Amp Room) + UA press announcement |
| `softube--uad-tube-tech-eq-collection` | https://www.uaudio.com/products/tube-tech-eq-collection (PE 1C + ME 1B collection; under softube mfr in DB — Softube↔UAD stamp trap) |
| `waves--chris-lord-alge-artist-signature-series` | https://www.kvraudio.com/product/chris-lord-alge-artist-signature-collection-by-waves (Bundle Plugin) |
| `waves--eddie-kramer-signature-series` | https://www.kvraudio.com/product/eddie-kramer-signature-series-by-waves |
| `waves--jack-joseph-puig-signature-series` | https://www.kvraudio.com/product/jack-joseph-puig-signature-series-by-waves |
| `waves--manny-marroquin-signature-series` | https://www.kvraudio.com/product/manny-marroquin-signature-series-by-waves |
| `waves--tony-maserati-signature-series` | https://www.kvraudio.com/product/tony-maserati-signature-series-by-waves |

Index + lean proofs: `fixtures/wave8/identity/second-sources-18.json`, `fixtures/wave8/identity/proofs/`, HTML under `fixtures/wave8/identity/second-src/`.

### Independence notes
- Wave7 primaries were often vendor product pages or Sweetwater (Producer). Second sources prefer **KVR “Bundle/Collection Plugin” titles**, Guitar Center, Equipboard, MusicRadar/delamar reviews, UA product pages when wave7 primary was Connect hub or Softube installers.
- Sweetwater curl/WebFetch blocked (bot wall) this pass — not required given KVR/GC coverage.
- Softube Passive-Active Pack: KVR underscore slug `passive_active_pack_by_softube` (hyphen slug 404/search).

---

## Recommendation

1. **Ship classifier v2 allow-guards** into any regex denylist Muse runs before bulk `plugin→bundle` — especially Juice Pack / C-Suite / VerbSuite / Goodhertz Mastering Edition.
2. **Ship the 18 HIGH reclasses** with second-source URLs attached (this draft’s table) so verification is “confirm mapping”, not “find evidence”.
3. After reclass: clear / never export `latestVersion` on these rows; UI → portal app (UA Connect / Softube Central / Waves Central).
4. Queue tip hygiene separately: Softube Central **2.6.41**, UAD suite **12.0**, Waves Central **15.x** stamped onto suite/edition rows (wave7 evidence) — identity fix first.

- **Classifier P/R:** P=1.0 R=1.0 F1=1.0 on HIGH18+ALLOW17 (TP18 FN0 FP0 TN17).
- **Second sources:** **18 / 18**.
- **New evidence:** KVR Bundle titles for UA Editions + Waves Series; Softube Flow FAQ; MusicRadar/delamar Passive-Active Pack; UA Amp Room Bundle + Tube-Tech EQ Collection product pages; classifier rules JSON.
