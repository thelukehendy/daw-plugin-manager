# Yellow `kvr-product-page` ceiling — dig vs stop SQL (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** Yellow band is dominated by KVR extractions. Without resolvability, dig chips re-probe the same 1k+ rows. Need **concrete dig vs stop SQL** for `extract_method = kvr-product-page` (count **1119**), backfill rules, and the **~113** tier-1 versionless `plugin` residual that remains diggable.
- **Context / evidence:**

### Live RO distributions (`catalog.db`, 2026-09-25)
| Metric | Count |
|---|---:|
| Accepted currents yellow (`confidence < 70`) with `extract_method = 'kvr-product-page'` | **1119** |
| Yellow KVR-family (`kvr%` OR `kvraudio.com` source) | **1289** |
| Tier-1 versionless by `identity_kind` | soundset 1090 · bundle 188 · **plugin 113** · hardware 66 · discontinued 38 · expansion 34 · gen_ambiguous 29 · suite_component 27 · … |
| Diggable residual (`tier-1` ∧ `identity_kind='plugin'` ∧ no current version) | **113** |

### Top manufacturers inside the 1119 (yellow kvr-product-page)
| Manufacturer | N |
|---|---:|
| Acustica Audio | 132 |
| IK Multimedia | 104 |
| Spitfire Audio | 65 |
| Universal Audio | 56 |
| Antelope Audio | 46 |
| Rob Papen | 35 |
| Heavyocity | 33 |
| Waves | 32 |
| Tracktion | 27 |
| Nugen Audio | 27 |
| AudioThing | 27 |
| Slate Digital | 26 |
| WA Production | 25 |
| Boz Digital Labs | 22 |
| Overloud | 20 |
| Initial Audio | 19 |
| EastWest | 19 |
| Cymatics | 19 |
| ToneBoosters | 16 |
| LANDR | 15 |

Many of these already have **better** manufacturer oracles (Waves RN browser, UA Version History, EastWest updates, Slate Hub/VMR Zendesk, IK PM hub-wall). KVR rows should flip to `kvr_ceiling` or promote to `open` when manufacturer recipe hits — not endless re-KVR.

### TAXONOMY backfill (from integrity/TAXONOMY.md) — first match wins
1. `needs_identity` ← `gen_ambiguous`
2. `discontinued_frozen`
3. `unversioned_by_kind` ← soundset/expansion/bundle/hardware/eurorack/daw_stock_effect
4. `structurally_blocked` ← Spitfire app-gated / UVI portal soundbank / Steinberg DA / DAW-bundled
5. `hub_walled` ← portal_app + no healthy public recipe
6. **`kvr_ceiling`** ← accepted confidence <70 AND (`extract_method` LIKE `kvr%` OR source KVR)
7. `open` ← confidence ≥70 manufacturer-class extract
8. **`open_pending`** ← tier-1 plugin versionless not classified → **the 113**
9. else `unknown`

### Concrete SQL

#### STOP — do not dig for version discovery
```sql
-- After resolvability backfill:
SELECT p.id
FROM plugins p
JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
JOIN version_observations vo ON vo.id = pvc.observation_id
WHERE vo.extract_method = 'kvr-product-page'
  AND vo.confidence < 70
  AND p.resolvability IN (
    'kvr_ceiling',           -- freshness-only / new manufacturer angle only
    'hub_walled',
    'structurally_blocked',
    'unversioned_by_kind',
    'discontinued_frozen',
    'needs_identity'
  );
```

#### Soft posture for kvr_ceiling (allowed work)
```sql
-- Freshness stamp only (re-fetch KVR or hold-refresh verified_at) — NOT new dig angles unless manufacturer URL found
SELECT p.id, m.name, vo.observed_version, vo.verified_at
FROM plugins p
JOIN manufacturers m ON m.id = p.manufacturer_id
JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
JOIN version_observations vo ON vo.id = pvc.observation_id
WHERE p.resolvability = 'kvr_ceiling'
  AND COALESCE(p.popularity_tier, m.popularity_tier) = 1
  AND vo.verified_at < datetime('now', '-' || COALESCE(p.freshness_sla_days, 30) || ' days');
```

#### DIG — only open_pending / unknown plugins
```sql
SELECT p.id, p.name, m.name AS manufacturer
FROM plugins p
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE COALESCE(p.popularity_tier, m.popularity_tier) = 1
  AND p.identity_kind = 'plugin'
  AND COALESCE(p.resolvability, 'unknown') IN ('open_pending', 'unknown')
  AND NOT EXISTS (
    SELECT 1 FROM plugin_version_current pvc WHERE pvc.plugin_id = p.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM research_attempts ra
    WHERE ra.plugin_id = p.id
      AND ra.attempted_at >= datetime('now', '-7 days')
      AND ra.note LIKE '%no-new-angle%'
  );
-- Expect ~113 before backfill labels; after backfill, open_pending ⊆ these
```

#### Pre-backfill proxy for the 1119 (classification preview)
```sql
SELECT
  CASE
    WHEN m.portal_app IS NOT NULL
         AND m.id IN ('waves','ik-multimedia','native-instruments','slate-digital',
                      'universal-audio','spitfire-audio','uvi','softube','plugin-alliance')
      THEN 'likely_hub_or_better_oracle'
    WHEN p.identity_kind IN ('soundset','bundle','expansion','hardware','eurorack')
      THEN 'unversioned_by_kind'
    WHEN p.discontinued = 1 OR p.identity_kind = 'discontinued'
      THEN 'discontinued_frozen'
    ELSE 'kvr_ceiling_candidate'
  END AS preview_class,
  COUNT(*) AS n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status = 'accepted'
  AND vo.confidence < 70
  AND vo.extract_method = 'kvr-product-page'
GROUP BY 1
ORDER BY n DESC;
```

#### Promotion off KVR ceiling
```sql
-- When manufacturer recipe lands @>=70, flip resolvability
-- (pseudocode UPDATE — Muse applies after chip success)
UPDATE plugins
SET resolvability = 'open',
    resolvability_detail = NULL,
    resolvability_set_at = datetime('now'),
    resolvability_set_by = :chip_id
WHERE id = :plugin_id
  AND resolvability = 'kvr_ceiling';
```

### Diggable ~113 by manufacturer (live)
| Manufacturer | Versionless tier-1 plugins |
|---|---:|
| IK Multimedia | 48 |
| KORG | 24 |
| Image-Line | 15 |
| Moog Music | 9 |
| Universal Audio | 5 |
| Sonnox | 4 |
| Roland | 4 |
| Arturia | 2 |
| UVI | 1 |
| Lexicon | 1 |
| **Total** | **113** |

**Interpretation:** Largest buckets are **hub-walled or SKU-matrix** (IK Syntronik/AmpliTube, KORG, FL Studio-adjacent). Dig chips must open **new public angles** or reclassify to `hub_walled` — not KVR spam. UA's 5 should prefer Version History / Connect doctrine (no UADx invention).

### Full diggable residual appendix (113)

| plugin_id | manufacturer | name |
|---|---|---|
| `arturia--analog-lab-play` | Arturia | Analog Lab Play |
| `arturia--pigments-play` | Arturia | Pigments Play |
| `ik-multimedia--amplitube-brian-may` | IK Multimedia | AmpliTube Brian May |
| `ik-multimedia--amplitube-deluxe` | IK Multimedia | AmpliTube Deluxe |
| `ik-multimedia--amplitube-electric-gypsy` | IK Multimedia | AmpliTube Electric Gypsy |
| `ik-multimedia--amplitube-fender` | IK Multimedia | AmpliTube Fender |
| `ik-multimedia--amplitube-fulltone` | IK Multimedia | AmpliTube Fulltone |
| `ik-multimedia--amplitube-joe-satriani` | IK Multimedia | AmpliTube Joe Satriani |
| `ik-multimedia--amplitube-l-a-rocker` | IK Multimedia | AmpliTube L.A. Rocker |
| `ik-multimedia--amplitube-mesa-boogie` | IK Multimedia | AmpliTube MESA/Boogie |
| `ik-multimedia--amplitube-metal` | IK Multimedia | AmpliTube Metal |
| `ik-multimedia--amplitube-orange` | IK Multimedia | AmpliTube Orange |
| `ik-multimedia--amplitube-svx` | IK Multimedia | AmpliTube SVX |
| `ik-multimedia--amplitube-svx-2` | IK Multimedia | AmpliTube SVX 2 |
| `ik-multimedia--clavitube` | IK Multimedia | Clavitube |
| `ik-multimedia--sampletank-4-alternate-keys` | IK Multimedia | SampleTank 4 Alternate Keys |
| `ik-multimedia--syntronik-99` | IK Multimedia | Syntronik - 99 |
| `ik-multimedia--syntronik-blau` | IK Multimedia | Syntronik - Blau |
| `ik-multimedia--syntronik-bully` | IK Multimedia | Syntronik - Bully |
| `ik-multimedia--syntronik-dco-x` | IK Multimedia | Syntronik - DCO-X |
| `ik-multimedia--syntronik-galaxy` | IK Multimedia | Syntronik - Galaxy |
| `ik-multimedia--syntronik-harpy-260` | IK Multimedia | Syntronik - Harpy 260 |
| `ik-multimedia--syntronik-j-60` | IK Multimedia | Syntronik - J-60 |
| `ik-multimedia--syntronik-modulum` | IK Multimedia | Syntronik - Modulum |
| `ik-multimedia--syntronik-noir` | IK Multimedia | Syntronik - Noir |
| `ik-multimedia--syntronik-oxa` | IK Multimedia | Syntronik - OXa |
| `ik-multimedia--syntronik-polymorph` | IK Multimedia | Syntronik - Polymorph |
| `ik-multimedia--syntronik-pro-v` | IK Multimedia | Syntronik - Pro-V |
| `ik-multimedia--syntronik-sam` | IK Multimedia | Syntronik - SAM |
| `ik-multimedia--syntronik-sh-v` | IK Multimedia | Syntronik - SH-V |
| `ik-multimedia--syntronik-string-box` | IK Multimedia | Syntronik - String Box |
| `ik-multimedia--syntronik-t-03` | IK Multimedia | Syntronik - T-03 |
| `ik-multimedia--syntronik-v-80` | IK Multimedia | Syntronik - V-80 |
| `ik-multimedia--syntronik-vcf3` | IK Multimedia | Syntronik - VCF3 |
| `ik-multimedia--syntronik-cato` | IK Multimedia | Syntronik Cato |
| `ik-multimedia--syntronik-deluxe` | IK Multimedia | Syntronik Deluxe |
| `ik-multimedia--syntronik-gs-v` | IK Multimedia | Syntronik GS-V |
| `ik-multimedia--syntronik-j-8` | IK Multimedia | Syntronik J-8 |
| `ik-multimedia--syntronik-kw-8000` | IK Multimedia | Syntronik KW 8000 |
| `ik-multimedia--syntronik-m-12` | IK Multimedia | Syntronik M-12 |
| `ik-multimedia--syntronik-m-poly` | IK Multimedia | Syntronik M-Poly |
| `ik-multimedia--syntronik-megawave` | IK Multimedia | Syntronik Megawave |
| `ik-multimedia--syntronik-memory-v` | IK Multimedia | Syntronik Memory-V |
| `ik-multimedia--syntronik-minimod` | IK Multimedia | Syntronik Minimod |
| `ik-multimedia--syntronik-osc-v` | IK Multimedia | Syntronik OSC-V |
| `ik-multimedia--syntronik-obie-one` | IK Multimedia | Syntronik Obie One |
| `ik-multimedia--syntronik-pro-vs` | IK Multimedia | Syntronik Pro-VS |
| `ik-multimedia--syntronik-sorcerer` | IK Multimedia | Syntronik Sorcerer |
| `ik-multimedia--syntronik-syner-v` | IK Multimedia | Syntronik Syner-V |
| `ik-multimedia--syntronik-triptych` | IK Multimedia | Syntronik Triptych |
| `image-line--dx10` | Image-Line | DX10 |
| `image-line--drumaxx` | Image-Line | Drumaxx |
| `image-line--il-delay-juice-pack` | Image-Line | IL Delay (Juice Pack) |
| `image-line--il-delay-bank-juice-pack` | Image-Line | IL Delay Bank (Juice Pack) |
| `image-line--il-equo-juice-pack` | Image-Line | IL EQUO (Juice Pack) |
| `image-line--il-flangus-juice-pack` | Image-Line | IL Flangus (Juice Pack) |
| `image-line--il-multiband-compressor-juice-pack` | Image-Line | IL Multiband Compressor (Juice Pack) |
| `image-line--il-parametric-eq-juice-pack` | Image-Line | IL Parametric EQ (Juice Pack) |
| `image-line--il-spectroman-juice-pack` | Image-Line | IL Spectroman (Juice Pack) |
| `image-line--il-stereo-enhancer-juice-pack` | Image-Line | IL Stereo Enhancer (Juice Pack) |
| `image-line--il-vocoder-juice-pack` | Image-Line | IL Vocoder (Juice Pack) |
| `image-line--il-waveshaper-juice-pack` | Image-Line | IL WaveShaper (Juice Pack) |
| `image-line--morphine` | Image-Line | Morphine |
| `image-line--simsynth-live` | Image-Line | SimSynth Live |
| `image-line--toxic-biohazard` | Image-Line | Toxic Biohazard |
| `korg--arp-2600` | KORG | ARP 2600 |
| `korg--arp-odyssey` | KORG | ARP ODYSSEY |
| `korg--electribe-r` | KORG | ELECTRIBE-R |
| `korg--ep-1` | KORG | EP-1 |
| `korg--filter-ark` | KORG | Filter Ark |
| `korg--kaoss-pad` | KORG | KAOSS PAD |
| `korg--m1` | KORG | M1 |
| `korg--mde-x` | KORG | MDE-X |
| `korg--ms-20` | KORG | MS-20 |
| `korg--mono-poly` | KORG | Mono/Poly |
| `korg--ps-3300` | KORG | PS-3300 |
| `korg--polysix` | KORG | Polysix |
| `korg--prophecy` | KORG | Prophecy |
| `korg--sgx-2` | KORG | SGX-2 |
| `korg--trinity` | KORG | TRINITY |
| `korg--triton` | KORG | TRITON / TRITON Extreme |
| `korg--vox-super-continental` | KORG | VOX Super Continental |
| `korg--wavestation` | KORG | WAVESTATION |
| `korg--microkorg` | KORG | microKORG |
| `korg--minikorg` | KORG | miniKORG 700S |
| `korg--modwave-native` | KORG | modwave native |
| `korg--multipoly-native` | KORG | multi/poly native |
| `korg--opsix-native` | KORG | opsix native |
| `korg--wavestate-native` | KORG | wavestate native |
| `lexicon--mpx-native-reverb` | Lexicon | MPX Native Reverb Plug-in |
| `moog-music--mf-101s` | Moog Music | MF-101S Lowpass Filter |
| `moog-music--mf-102s` | Moog Music | MF-102S Ring Modulator |
| `moog-music--mf-103s` | Moog Music | MF-103S 12-Stage Phaser |
| `moog-music--mf-104s` | Moog Music | MF-104S Analog Delay |
| `moog-music--mf-105s` | Moog Music | MF-105S MuRF |
| `moog-music--mf-107s` | Moog Music | MF-107S FreqBox |
| `moog-music--mf-108s` | Moog Music | MF-108S Cluster Flux |
| `moog-music--mf-109s` | Moog Music | MF-109S Saturator |
| `moog-music--mariana` | Moog Music | Mariana |
| `roland--zenology` | Roland | ZENOLOGY |
| `roland--zenology-fx` | Roland | ZENOLOGY FX |
| `roland--zenology-gx` | Roland | ZENOLOGY GX |
| `roland--zenology-pro` | Roland | ZENOLOGY Pro |
| `sonnox--fraunhofer-pro-codec` | Sonnox | Fraunhofer Pro-Codec |
| `sonnox--oxford-debuzzer` | Sonnox | Oxford DeBuzzer |
| `sonnox--oxford-declicker` | Sonnox | Oxford DeClicker |
| `sonnox--oxford-denoiser` | Sonnox | Oxford DeNoiser |
| `uvi--dual-delay-x` | UVI | Dual Delay X |
| `universal-audio--uad-producer-edition` | Universal Audio | UAD Producer Edition |
| `universal-audio--uad-signature-edition-v3` | Universal Audio | UAD Signature Edition V3 |
| `universal-audio--uad-studio-edition` | Universal Audio | UAD Studio Edition |
| `universal-audio--uadx-essentials-edition` | Universal Audio | UADx Essentials Edition |
| `universal-audio--uadx-signature-edition-v2` | Universal Audio | UADx Signature Edition V2 |

- **Recommendation:** Ship chip **`yellow-kvr-stop-queries-v1`** paired with TAXONOMY backfill:
  1. Backfill `resolvability` (schema v7).
  2. Default the 1119 → `kvr_ceiling` unless preview_class says otherwise.
  3. Dig budget **only** for `open_pending` (≤113, then shrink as reclassified).
  4. Manufacturer-oracle chips (Waves/UA/EastWest/…) **promote** out of kvr_ceiling on success.
  5. Dashboard: yellow composition % = kvr_ceiling vs hub_walled vs misfiled open (SYNTHESIS §5).

- **If accepted, what changes in the engine:**
  - Claim-ledger INSERT filters (TAXONOMY stop-query).
  - Dig chip SQL replaced with open_pending query above.
  - Freshness SLA for kvr_ceiling (longer than `open` — see FRESHNESS.md).
  - research_attempts note `resolvability-stop:kvr_ceiling` on banned digs.

- **Expected impact:** Stops ~1000 useless KVR re-digs; focuses Muse on ≤113 true unknowns; makes yellow KPI honest.

- **Risks / caveats:**
  - Over-walling vendors that still have public PDF/demo tips — recipe-health override → `open`.
  - Acustica 132 may need dedicated playbook, not blanket hub_walled.
  - Diggable IK 48 will mostly become hub_walled after PM canary doctrine — expect open_pending to fall toward <50 (SYNTHESIS risk register).

- **Suggested first step:** Run preview_class SQL; land schema + backfill-v1; wire dig chip to open_pending only; publish diggable debt KPI.

- **New evidence since last verdict:** Live counts 1119 / 1289 / 113; top-20 mfg table; full 113-row appendix from RO DB.


---

## Appendix B — Worked example queues (pseudocode counts)

Assuming backfill-v1 applied on current RO snapshot:

| Queue | Approx size | Action |
|---|---:|---|
| Dig `open_pending` plugins | ≤113 (then ↓) | New manufacturer angles only |
| Freshness `open` | thousands of greens/ambers | SLA re-fetch |
| Freshness `kvr_ceiling` | ~1119 yellow kvr-product-page + other KVR | Long SLA; stamp verified_at; dig only on new angle |
| Hard stop | soundset/bundle/… versionless ~1500 | Never version-dig |
| Hub wall | IK/NI/Spitfire/UVI/… | Manager canaries only |

## Appendix C — research_attempts note grammar
```
resolvability-stop:kvr_ceiling
resolvability-stop:hub_walled
resolvability-stop:structurally_blocked
resolvability-stop:unversioned_by_kind
resolvability-stop:oracle_absent_8dio_faq_only
no-new-angle:manufacturer-exhausted
```
Claim-ledger tools should reject INSERTs that would dig hard-stop classes (fixes recurring sweep defect noted in TAXONOMY).


---

## Appendix D — Yellow composition dashboard SQL

```sql
SELECT
  CASE
    WHEN vo.extract_method = 'kvr-product-page' THEN 'kvr-product-page'
    WHEN vo.extract_method LIKE 'kvr%' THEN 'kvr-other'
    WHEN vo.source_url LIKE '%kvraudio.com%' THEN 'kvr-source-url'
    ELSE 'non-kvr-yellow'
  END AS bucket,
  COUNT(*) AS n
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
WHERE vo.status = 'accepted' AND vo.confidence < 70
GROUP BY 1
ORDER BY n DESC;
```

Post-taxonomy, replace extract_method bucketing with `plugins.resolvability` composition (SYNTHESIS widget #4).

## Appendix E — Diggable residual manufacturer share
IK 48/113 ≈ 42% of diggable debt. After hub_wall backfill, expect diggable debt KPI to collapse toward KORG/Image-Line/Moog/Sonnox/Roland public-angle work — or further hub_wall if those are also matrix-gated. Track weekly.
