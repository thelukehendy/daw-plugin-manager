# NOTES — confidence raise 6 (2026-09-10 ~12:40 AM PT / 2026-09-10T07:40Z UTC)

Overnight corroboration pass #6. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises. Skipped Waves/IK/Spitfire/UADx/Slate/Output/United hubs per brief.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **2** |
| **Priority A peer fixes** | **0** (2 inspected; high-conf peers correctly rejected) |
| Accepted-current green (≥85) | **1867** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **728** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **728** |
| Export | `out/catalog.json` @ 2026-09-10T07:40:02Z → **2026-09-10 12:40 AM PT** |

## Priority A — yellow with another obs @≥85 (count=2)

Inspected both; **no current retarget**.

| plugin_id | cur KVR | hi obs | Decision |
|---|---|---|---|
| `audiothing--environments-piscina-mirabilis` | 1.0 @60 | productPage 1.0 @88 **rejected** | Leave yellow — reject: expansion must not inherit parent `Environments-1.0.dmg` |
| `audiothing--environments-temple-of-mercury` | 1.0 @60 | productPage 1.0 @88 **rejected** | Same — parent Environments installer ≠ expansion SKU |

Same `normalized_version` but evidence targets the wrong SKU. Do **not** point current at rejected parent-installer observations.

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| SIR Audio Tools | **1** | Official downloads + versionHistory paired Mac/Win | **90** |
| Synthogy | **1** | Official `synthogy.com/support/updates` Win installer | **90** |

### SIR Audio Tools (+1)

- **StandardCLIP `1.6.057`** — `https://www.siraudiotools.com/StandardCLIP.php` labels **Windows (v.1.6.057)** with installer filenames `StandardCLIP_Win_Setup_1.6.057_*`; Mac listed **(v.1.6.056)**. Version History documents releases as paired **`v1.6.056/057`** (honest platform policy: Mac/Win off-by-one build numbers as one release). Accept Win/KVR-matching **1.6.057** @90. (LiquidSonics Seventh Heaven Pro still lacks paired VH — remains skip.)

### Synthogy (+1)

- **Ivory `3.0.8`** — `https://synthogy.com/support/updates` hosts `Ivory Update 3.0.8.1.exe` (HEAD 200) matching KVR @90. Mac pages also list newer **3.0.9** (“latest update for Ivory 3”) and special **3.1.0** (MIDI 2.0 Piano Profile / Sonoma) — dual Mac-ahead diverge; corroborate matched Win/KVR **3.0.8** only (do not stamp Mac-only 3.0.9/3.1.0 as universal current).

## Explicit non-raises (quality)

### Priority B singletons / small yellows

| Target | Why skipped |
|---|---|
| **audio-ease Cabinet** | Legacy; no current product/version page (playbook) |
| **eastwest Spaces** | soundsonline only Surfaces **Spaces II**; do not map Spaces↛Spaces II |
| **klanghelm MJUC** | Paid product page downloads = manuals only; installers purchase/user-area; no public semver |
| **leapwing LimitOne** | Product page only; **no** `support/limitone-release-notes/` (404); search → product marketing only |
| **linplug Organ 3** | linplug.com no installer semver matching KVR 3.2.1 |
| **liquidsonics Seventh Heaven Professional** | Still **Mac 1.5.8 vs Win 1.5.9** on public downloads — no paired VH policy like SIR |
| **native-instruments Kontakt** | Native Access gated; no public per-product installer semver |
| **safari-pedals Gorilla Drive** | safariaudio `products.json` (30 SKUs) has **no** Gorilla Drive; marketing pages lack installer semver |
| **scuffham S-Gear** | Site CAPTCHA/HTTP 202 empty — unreachable |
| **surge Shortcircuit XT** | GitHub releases = **Nightly** only; no stable `0.9.245` receipt in public HTML |
| **vital-audio Vital** | vital.audio / account hub; GitHub API rate-limited; releases HTML has no `1.6.x` tag list |
| **con Lurssen Mastering Console** | tonelux.com / lurssen URLs no public plugin semver; PA product 404 |
| **plugin-alliance MEGA Sampler** | `mega_sampler` URL redirects to **Online Sample Player** marketing page (no Installer v); manual PDF has **no** CHANGELOG/`1.2.0` |
| **eiosis (2)** | eiosis.com → Slate ecosystem; no public AirEQ/E2Deesser installer semver |
| **izotope Iris 2 / Trash 2** | Discontinued; Product Portal only |
| **audiomovers (3)** | Public downloads still platform-diverge vs KVR `2.141.*` — skip |

### Priority C creative

| Target | Why skipped |
|---|---|
| **audiothing 27 Toys** | `/toys/` 404; individual toy slugs 404; instruments hub lists live SKUs only (B00ga/Hats/…); plugin-updates has Environments parent **1.0** only (do not stamp onto expansions); GitHub org / search lack per-Toy installer semver |
| **overloud Fuse (+ remaining ~19)** | Product `/products/fuse` live but **no** CDN installer filename; `/products/fuse/getdemo` = form overlay not versioned pkg; 120+ CDN naming variants HEAD **404**; `installation.php` Fuse ids absent; shared Gems user-manual PDF semver-free. Do **not** stamp TH-U **2.0.19** onto edition/rig/IR leftovers |
| **cherry-audio 5 leftovers** | Alternate VH URL sweep (spin / rackmode-for-VM / retro-waves / snow-angel / VM-core-electro) → VH **HTTP 500**, product pages **404** |
| **cableguys 13 modules/Curve** | Known manuals exist (ShaperBox 3 / HalfTime / Snapback / … / Kickstart 2); **no** per-module Manual PDF (`Cableguys-VolumeShaper-*.pdf` etc. 404). Curve product page = Curve 2 marketing without `2.6.3`. Do **not** stamp ShaperBox **3.6.3** onto modules |

## Playbook / doc updates

- `NOTES-confidence-raise-6.md` (this file)
- `STATUS.md` / `HANDOFF-FOR-CURSOR.md`
- `playbooks/sir-audio-tools.md`, `synthogy.md`, `liquidsonics.md`, `overloud.md`, `cableguys.md`, `cherry-audio.md`, `audiothing.md`, `plugin-alliance.md`
