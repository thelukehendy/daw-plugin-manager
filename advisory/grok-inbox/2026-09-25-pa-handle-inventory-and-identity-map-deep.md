# PA handle inventory + identity map (WAVE-4 appendix)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Plugin Alliance changelog parser (`pa-changelog-parser-spec-deep`, already filed) needs an **identity join layer**: 280 Shopify handles → catalog `plugin-alliance` / Brainworx rows, plus a **bundle skip list** so the walker does not burn browser budget on collections. This chip is NEW — inventory + SQL — not a rewrite of PARSER-SPEC.
- **Context / evidence:**

### Source artifacts (advisory-deep/pa)
| File | Role |
|---|---|
| `all-handles.txt` | **280** product handles (one per line) |
| `sample-results.csv` / `.json` | 50-handle browser sample; changelog hit rates |
| `url-seeds.txt` / novel `pa-url-seeds.txt` | Sitemap product URLs (234) + collections (86) |
| `PARSER-SPEC.md` | Changelog HTML parse (Installer `v`, dates) — already inbox'd |

### Brand / prefix histogram (all 280 handles)
Computed from `all-handles.txt` (2026-09-24 dig):

| Bucket | Count | Notes |
|---|---:|---|
| **unprefixed / third-party bare handles** | ~181 | e.g. `oldtimer`, `tape-face`, `kirchhoff-eq`, `c502v` — brand lives in page title, not handle |
| **Brainworx `bx_*`** | **58** | Dominant first-party prefix |
| **Brainworx `brainworx-*`** | **4** | e.g. `brainworx-bx_pulsar`, `brainworx-bx_masterdesk-pro` |
| **BUNDLE / collection / set** | **27** | Skip for version walk |
| **Ocelot `ocelot-*`** | 4–5 | upmixer/octaver/limiter/clipper (+ bundle) |
| **SPL-ish** | 3 | `spl-big`, transient/vitalizer naming |
| **Krotos** | 2 | `krotos-weaponiser-basic`, `dehumaniser-2` |
| Lindell / Bettermaker / GForce / elysia (prefixed) | 1 each | Many more appear as bare handles (`niveau-filter`, `optomax`, …) |

**Brainworx family total (`bx_*` + `brainworx-*`) ≈ 62 / 280 (~22%).**

### Sample walker misses → bundle / no-changelog skip list
From `sample-results.csv` (50 rows), changelog misses / zero version entries:

| handle | is_bundle | has_changelog | n_version_entries | title |
|---|---|---|---:|---|
| `brainworx-mix-essentials-bundle-1` | True | False | 0 | Brainworx Mix Essentials Bundle |
| `brainworx-creative-mixing-set` | False* | False | 0 | Brainworx Creative Mixing Set |
| `bx_ssl-collection` | False* | False | 0 | Plugin Alliance bx_SSL Collection |
| `bx_mastering-studio` | False | False | 0 | Brainworx bx_mastering studio |

\*Treat `*-set`, `*-collection`, `*bundle*` as **skip** even if Shopify `is_bundle` flag false.

**Recommended skip predicates (walker):**
```
handle matches /(^|-)(bundle)($|-)/i
OR handle matches /-collection$/
OR handle matches /-set$/
OR title matches /\b(Bundle|Collection|Essentials Set)\b/i
OR products.json product_type indicates bundle
→ outcome=skip note=pa-bundle-skip
```

Full handle-side bundleish list (27) includes among others:  
`complete-bundle`, `ocelot-bundle`, `brainworx-mix-essentials-bundle-1`, `bx_ssl-collection`, `magix-ultimate-bundle`, `musician-bundle`, `welcome-to-pabx-bundle`, `analog-legends-bundle`, `made-by-brainworx-essentials-bundle`, `made-by-brainworx-bundle`, `guitar-bass-essentials-bundle`, `guitar-bass-bundle`, `neold-bundle`, `heritage-bundle`, `avid-carbon-bundle`, `black-lion-audio-bundle`, `magix-producer-bundle`, `rme-bundle`, `avid-mbox-bundle`, `komplete-*-pa-bundle`, `avid-inner-circle-bundle`, `presonus-bundle`, `universal-audio-bundle`, …

### Catalog identity (RO)
- Manufacturer id **`plugin-alliance`**, name Plugin Alliance, `portal_app = PA Installation Manager`.
- **291** plugins under that manufacturer id (Brainworx + hosted brands collapsed into PA in this catalog).
- Heuristic handle↔name match (normalize non-alnum → `-`): **~198** non-bundle handles matched something; **~55** unmatched bare handles (many are real PA products whose catalog slug differs — e.g. Mixroom/Bassroom family may be under Unfiltered Audio or missing). Treat heuristic as **seed**, not SoT.

### SQL sketches (operator-owned; RO-safe to dry-run)

#### A. Stage handles
```sql
-- scratch / migration helper table (Muse-owned)
CREATE TABLE IF NOT EXISTS pa_handle_stage (
  handle TEXT PRIMARY KEY,
  is_bundleish INTEGER NOT NULL DEFAULT 0,
  brand_guess TEXT,
  notes TEXT
);
-- load from all-handles.txt via chip script
```

#### B. Join PA handles → catalog plugins (identity map)
```sql
-- Dry-run identity candidates (do not UPDATE until reviewed)
WITH handles AS (
  SELECT handle, is_bundleish FROM pa_handle_stage WHERE is_bundleish = 0
),
pa AS (
  SELECT p.id AS plugin_id, p.name, lower(p.name) AS name_l,
         lower(COALESCE(p.match_patterns,'')) AS patterns_l
  FROM plugins p
  WHERE p.manufacturer_id = 'plugin-alliance'
)
SELECT h.handle,
       p.plugin_id,
       p.name,
       CASE
         WHEN replace(replace(h.handle,'bx_',''),'-','') =
              replace(replace(replace(p.name_l,'bx_',''),' ',''),'-','') THEN 'exact-norm'
         WHEN p.patterns_l LIKE '%' || h.handle || '%' THEN 'match_patterns'
         WHEN p.name_l LIKE '%' || replace(h.handle,'-','%') || '%' THEN 'fuzzy-name'
         ELSE 'review'
       END AS match_class
FROM handles h
LEFT JOIN pa p
  ON p.patterns_l LIKE '%' || h.handle || '%'
  OR replace(lower(p.name),' ', '-') LIKE '%' || h.handle || '%'
  OR lower(p.name) LIKE '%' || replace(h.handle, '-', ' ') || '%'
ORDER BY match_class, h.handle;
```

#### C. Brainworx-focused subset
```sql
SELECT h.handle, p.id, p.name
FROM pa_handle_stage h
LEFT JOIN plugins p
  ON p.manufacturer_id = 'plugin-alliance'
 AND (
   (h.handle LIKE 'bx_%' AND (
      lower(p.name) LIKE '%' || substr(h.handle, 4) || '%'
      OR lower(COALESCE(p.match_patterns,'')) LIKE '%' || h.handle || '%'
   ))
   OR (h.handle LIKE 'brainworx-%' AND lower(COALESCE(p.match_patterns,'')) LIKE '%' || h.handle || '%')
 )
WHERE h.handle LIKE 'bx_%' OR h.handle LIKE 'brainworx-%'
ORDER BY h.handle;
```

#### D. Walker queue = handles with identity OR new SKU candidates, minus skip
```sql
SELECT h.handle
FROM pa_handle_stage h
WHERE h.is_bundleish = 0
  AND (
    EXISTS (
      SELECT 1 FROM pa_handle_identity i WHERE i.handle = h.handle AND i.plugin_id IS NOT NULL
    )
    OR h.brand_guess IS NOT NULL  -- still walk to discover Installer v for new map
  )
  AND NOT EXISTS (
    SELECT 1 FROM research_attempts ra
    WHERE ra.note LIKE 'pa-handle:' || h.handle || '%'
      AND ra.attempted_at >= datetime('now', '-14 days')
  );
```

#### E. Bundle skip compliance metric
```sql
SELECT COUNT(*) AS banned_bundle_attempts_7d
FROM research_attempts ra
WHERE ra.attempted_at >= datetime('now', '-7 days')
  AND ra.note LIKE '%pa-handle:%'
  AND ra.note LIKE '%bundle%'
  AND ra.outcome != 'skip';
-- target: 0
```

- **Recommendation:** Ship appendix artifacts + chip **`pa-identity-map-v1`**:
  1. Commit `all-handles.txt` histogram + skip list into playbook / `advisory` reference (or `catalog-store` seed CSV) — not only deep-notes.
  2. Build `pa_handle_identity` map (handle → plugin_id) with human/Muse review on `fuzzy` / unmatched.
  3. Walker consumes **identity-resolved handles first**; bundles hard-skipped.
  4. Unmatched non-bundle handles → candidate SKU queue (new plugins), not silent drop.
  5. Never use `products.json` `updated_at` as version churn (assault finding stands).

- **If accepted, what changes in the engine:**
  - Complements existing PA parser chip: parse Installer `v` **only after** identity join.
  - Claim-ledger notes include `pa-handle:<handle>`.
  - Dashboard: PA walker coverage = matched handles with changelog / total non-bundle.

- **Expected impact:** Converts 280-handle firehose into ~250 actionable product walks + ~27 permanent skips; reduces false identity writes; enables Brainworx-first pass (62 handles).

- **Risks / caveats:**
  - Bare handles collide (`limiter` → wrong bx_limiter True Peak in naive fuzzy — seen in dry heuristic). **Require match_patterns or Installer-title corroboration before version write.**
  - Multi-brand PA store: Unfiltered Audio / SPL may also exist as separate manufacturers — do not force all handles onto `plugin-alliance` id without check.
  - Sitemap 234 vs handles 280 — reconcile; neither is complete alone.

- **Suggested first step:** Dry-run SQL B/C against RO DB; export mismatch CSV for Muse review; wire bundle skip into next PA browser chip before more Installer scrapes.

- **New evidence since last verdict:** Full 280-handle histogram; sample miss table; RO 291 PA plugins; heuristic match counts; concrete skip predicates.


---

## Appendix F — Full bundleish skip list (from handle heuristics)

Handles containing `bundle` / ending in `-collection` / `-set` (park for Installer walk):

```
complete-bundle
ocelot-bundle
brainworx-mix-essentials-bundle-1
brainworx-creative-mixing-set
bx_ssl-collection
magix-ultimate-bundle
musician-bundle
welcome-to-pabx-bundle
analog-legends-bundle
made-by-brainworx-essentials-bundle
made-by-brainworx-bundle
guitar-bass-essentials-bundle
guitar-bass-bundle
neold-bundle
heritage-bundle
avid-carbon-bundle
black-lion-audio-bundle
magix-producer-bundle
rme-bundle
avid-mbox-bundle
komplete-collectors-edition-pa-bundle
komplete-ultimate-pa-bundle
komplete-standard-pa-bundle
avid-inner-circle-bundle
presonus-bundle
universal-audio-bundle
de-esser-collection
```

Also skip title-only collections discovered at render time (`bx_mastering-studio` sample miss — no changelog). Maintain skip list as data file next to handles.

## Appendix G — Brainworx `bx_*` handle inventory (58)

```
bx_tonebox, bx_ssl-collection, bx_mastering-studio, bx_masterdesk-classic,
bx_bluechorus2, bx_greenscreamer, bx_megasingle, bx_opto-pedal, bx_tuner,
bx_solo, bx_cleansweep-v2, bx_subfilter, bx_rockrack-v3-player, bx_blackdist2,
bx_metal2, bx_yellowdrive, bx_distorange, bx_meter, bx_shredspread, bx_boom,
bx_pulsar (as brainworx-bx_pulsar), bx_stereomaker, bx_hybrid-v2, bx_control-v2,
bx_saturator-v2, bx_megadual, bx_paneq, bx_cleansweep-pro, bx_rockrack-v3,
bx_subsynth, bx_opto, bx_limiter, bx_refinement-v3, bx_glue, bx_2098-eq,
bx_limiter-true-peak, bx_rockergain100, bx_console-ssl-4000-e, bx_dyneq-v2,
bx_delay-2500, bx_console-n, bx_console-focusrite-sc, bx_masterdesk,
bx_crispytuner, bx_console-ssl-4000-g, bx_console-amek-200, bx_bassdude,
bx_digital-v3, bx_enhancer, bx_console-ssl-9000-j, bx_xl-v3, bx_boom-v3,
bx_aura, bx_townhouse-buss-compressor, bx_console-amek-9099, bx_oberhausen,
bx_clipper, bx_rooms, bx_masterdesk-true-peak, …
```
(Full set = all `bx_*` lines in `all-handles.txt`; walker should load file, not this abbreviated list.)

## Appendix H — Dangerous fuzzy collisions (require match_patterns)
| handle | Naive fuzzy risk |
|---|---|
| `limiter` | May hit `bx_limiter` or `bx_limiter True Peak` wrongly |
| `map` | May hit Dynamic Spectrum Mapper |
| `pro` | Too short — ban short-token-only matches |
| `core` | Ambiguous |
| `random` / `random-metal` | Distinct products |

Rule: `len(handle) < 5` ⇒ require exact `match_patterns` hit or Installer title equality before link.


---

## Appendix I — Full handle list (280)

```
complete-bundle
stereovault
reference
grainferno
animate
levels
reso
bassroom
fuser
limiter
mixroom
faster-master
expose-2
ocelot-upmixer
ocelot-octaver
ocelot-limiter
ocelot-clipper
ocelot-bundle
bx_tonebox
oberheim-tvs-pro
novation-bass-station
map
oddity3
ba-1
humanoid
igniter
brainworx-mix-essentials-bundle-1
rz062
brainworx-creative-mixing-set
optomax
bx_ssl-collection
magix-ultimate-bundle
musician-bundle
welcome-to-pabx-bundle
analog-legends-bundle
made-by-brainworx-essentials-bundle
made-by-brainworx-bundle
guitar-bass-essentials-bundle
guitar-bass-bundle
neold-bundle
heritage-bundle
bx_mastering-studio
bx_masterdesk-classic
bx_bluechorus2
bx_greenscreamer
niveau-filter
bx_megasingle
bx_opto-pedal
bx_tuner
bx_solo
bx_cleansweep-v2
free-ranger
bx_subfilter
bx_rockrack-v3-player
bx_blackdist2
bx_metal2
bx_yellowdrive
bx_distorange
bx_meter
bx_shredspread
bx_boom
avid-carbon-bundle
black-lion-audio-bundle
magix-producer-bundle
rme-bundle
avid-mbox-bundle
komplete-collectors-edition-pa-bundle
komplete-ultimate-pa-bundle
komplete-standard-pa-bundle
avid-inner-circle-bundle
presonus-bundle
universal-audio-bundle
wunderlich
high-flyer
utopia
lindell-audio-eq825
bettermaker-mastering-compressor
gforce-software-oberheim-dmx
elysia-alpha-compressor-v2
perfection
axxess
imposcar3
minimonsta2
vsm-iv
icondrum
oberheim-ob-x
vitalizer-mk3-t
bde
hitstrip
spread
knocktonal
click-boom
laal
7deadlysnares
lunchtable
beatfader
cheat-code
random-metal
spaced-out
comeback-kid
smooth-operator-pro
reformer-pro
tekno
crystalline
random
krotos-weaponiser-basic
dehumaniser-2
transit-2
brainworx-bx_pulsar
bx_stereomaker
bx_hybrid-v2
bx_control-v2
bx_saturator-v2
bx_megadual
bx_paneq
transient-designer-plus
flanger
bx_cleansweep-pro
std-1-stereo-tapped-delay
bx_rockrack-v3
bx_subsynth
bx_opto
bx_limiter
bx_refinement-v3
eq-ranger-plus
de-esser-collection
drumxchanger
de-verb-plus
mo-verb-plus
attacker-plus
vh4
xtcomp
needlepoint
twintube
nvelope
indent-2
dent-2
svt-vr-classic
bx_glue
hype
mastering-compressor
spatial-creator
e765-rt
bax-eq
karacter
bx_2098-eq
eq232d
mastering-compressor-class-a
be-100
bass-mint
bx_limiter-true-peak
zip
vac-attack
fault
channelx
vocal-enhancer
streamliner
thorn
te-100
tantra-2
g8
character
svt-3pro
sandman
sandman-pro
mpressor
museq
e646-vs
byome
specops
dsm-v3
hawkeye
nseq-2
opticom-xla-3
silo
buxom-betty
stage
ds-40
triad
tails
lion
tcl-2
savage-120
v-4b
vsm-3
800rb
core
b-15n
sbc
pro
50-series
sa2rate-2
wavesurfer
phils-cascade
svt-vr
bx_rockergain100
herbert
bx_console-ssl-4000-e
tape-face
trinity-shaper
splat
v76u73
sculpt
vss-2
spl-big
natalus-dsceq
c502v
passive-equalizer
bx_dyneq-v2
mu-66
cenozoix-compressor
eq4
hg-2
bx_delay-2500
bx_console-n
iron
bx_console-focusrite-sc
instant-delay
chop-shop
mc77
bx_masterdesk
eq-200
bx_crispytuner
big-al
mastering-compressor-amek
254e
pex-500
902-de-esser
80-series
se100
pt100
lisa
brainworx-bx_masterdesk-pro
passeq
eq2
6x-500
bx_masterdesk-true-peak
warble
eq-250
bm60
gav19t
bx_rooms
354e
bx_oberhausen
u17
hg-2ms
bx_clipper
the-oven
magnum-k
bx_console-ssl-4000-g
soma
train-ii
lo-fi-af
pq
bx_console-amek-200
kirchhoff-eq
u2a
bx_bassdude
bx_digital-v3
battalion
silver-bullet-mk2
machine-head
bx_enhancer
oldtimer
bus-compressor
69-series
eq4-ms
overdrive-supreme-50
bx_console-ssl-9000-j
knifonium
mbc
bx_xl-v3
bx_boom-v3
vsc-2
bx_aura
7x-500
metric-ab
hg-q
bx_townhouse-buss-compressor
bx_console-amek-9099
```


---

## Appendix J — Sample walker successes (Installer tips)

| handle | top_version | top_date | title |
|---|---|---|---|
| `bx_tonebox` | `1.0` | Jan 28, 2026 | bx_tonebox |
| `bx_masterdesk-classic` | `1.8.0` | Mar 3, 2025 | PA FREE bx_masterdesk Classic |
| `bx_bluechorus2` | `1.12.0` | Feb 20, 2026 | PA FREE bx_bluechorus2 |
| `bx_greenscreamer` | `1.12.0` | Feb 02, 2026 | PA FREE bx_greenscreamer |
| `bx_megasingle` | `1.13.0` | Feb 12, 2026 | PA FREE bx_megasingle |
| `bx_opto-pedal` | `1.11.0` | Feb 02, 2026 | PA FREE bx_opto Pedal |
| `bx_tuner` | `1.12.0` | Dec 15, 2025 | PA FREE bx_tuner |
| `bx_solo` | `1.16.2` | Nov 6, 2024 | PA FREE bx_solo |
| `bx_cleansweep-v2` | `2.17.0` | Dec 17, 2025 | PA FREE bx_cleansweep V2 |
| `bx_subfilter` | `1.10.0` | Feb 3, 2026 | PA FREE bx_subfilter |
| `bx_rockrack-v3-player` | `3.10.0` | Jan 19, 2026 | PA FREE bx_rockrack V3 Player |
| `bx_blackdist2` | `1.10.0` | Feb 20, 2026 | PA FREE bx_blackdist2 |
| `bx_metal2` | `1.10.0` | Feb 02, 2026 | bx_metal2 |
| `bx_yellowdrive` | `1.12.0` | Feb 20, 2026 | PA FREE bx_yellowdrive |
| `bx_distorange` | `1.12.0` | Feb 02, 2026 | PA FREE bx_distorange |
| `bx_meter` | `1.18.0` | 13 Jan, 2026 | PA FREE bx_meter |
| `bx_shredspread` | `1.19.0` | Feb 5, 2026 | PA FREE bx_shredspread |
| `bx_boom` | `2.16.1` | Oct 9, 2023 | PA FREE bx_boom! |
| `elysia-alpha-compressor-v2` | `2.2.0` | Dec 18, 2025 | elysia alpha compressor V2 |
| `brainworx-bx_pulsar` | `1.0.1` | Jul 30, 2025 | Brainworx bx_pulsar |
| `bx_stereomaker` | `1.15.0` | Feb 4, 2026 | Brainworx bx_stereomaker |
| `bx_hybrid-v2` | `2.14.0` | Jan 13, 2026 | Brainworx bx_hybrid V2 |
| `bx_control-v2` | `2.16.1` | Oct 9, 2023 | Brainworx bx_control V2 |
| `bx_saturator-v2` | `2.13.1` | Mar 2, 2026 | Brainworx bx_saturator V2 |
| `bx_megadual` | `1.13.0` | Feb 18, 2026 | Brainworx bx_megadual |
| `bx_paneq` | `1.10.0` | Mar 31, 2026 | Brainworx bx_panEQ |
| `bx_cleansweep-pro` | `1.11.1` | Dec 16, 2025 | Brainworx bx_cleansweep Pro |
| `bx_rockrack-v3` | `3.10.0` | Jan 19, 2026 | Brainworx bx_rockrack V3 |
| `bx_subsynth` | `1.10.0` | Jan 13, 2026 | bx_subsynth |
| `bx_opto` | `1.11.0` | Feb 06, 2026 | Brainworx bx_opto |
| `bx_limiter` | `1.16.1` | Feb 26, 2026 | Brainworx bx_limiter |
| `bx_refinement-v3` | `3.0.0` | January 22, 2025 | Brainworx bx_refinement V3 |
| `bx_glue` | `1.1.0` | Feb 13, 2025 | Brainworx bx_glue |
| `bx_2098-eq` | `1.9.0` | Feb 13, 2026 | Brainworx bx_2098 EQ |
| `bx_limiter-true-peak` | `1.3.0` | Feb 25, 2025 | Brainworx bx_limiter True Peak |
| `bx_rockergain100` | `1.4.0` | Jan 16, 2026 | Brainworx bx_rockergain100 |
| `bx_console-ssl-4000-e` | `1.8.0` | Jan 12, 2026 | Brainworx bx_console SSL 4000 E |
| `splat` | `1.0.0` | Sep 4, 2024 | fiedler audio splat |
| `spl-big` | `1.0.1` | Dec 11, 2024 | SPL SPL BiG |
| `bx_dyneq-v2` | `2.18.0` | Aug 12, 2026 | Brainworx bx_dynEQ V2 |
| `bx_delay-2500` | `1.9.0` | Jan 26, 2026 | Brainworx bx_delay 2500 |
| `bx_console-n` | `1.10.1` | Feb 5, 2026 | Brainworx bx_console N |
| `bx_console-focusrite-sc` | `1.6.0` | Jan 13, 2026 | Brainworx bx_console Focusrite SC |
| `bx_masterdesk` | `1.8.0` | Feb 25, 2025 | Brainworx bx_masterdesk |
| `bx_crispytuner` | `1.1.0` | Sept 27, 2023 | Brainworx bx_crispytuner |
| `brainworx-bx_masterdesk-pro` | `1.3.0` | Feb 26, 2025 | Brainworx bx_masterdesk PRO |

_46 / 50 sample handles produced changelog tips — validates parser path for identity-resolved non-bundle handles._
