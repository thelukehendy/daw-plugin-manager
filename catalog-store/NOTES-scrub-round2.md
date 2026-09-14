# NOTES — scrub round 2 (2026-09-10 PT)

Zero-trust version scrub continuation. Start: **1268/2827** accepted. End: **1322/2827** (Δ **+54**). `verified_by=coding-assistant`. No git clone.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| baby-audio | 0 → 16/25 | **+16** | `babyaud.io/downloads` accordion `vX.Y` labels |
| acon-digital | 0 → 14/29 | **+14** | public `acondigital.com/software/` versioned installers (HEAD 200) |
| kazrog | 1 → 12/17 | **+11** | March Maintenance Updates version table (True Iron was already 1.4.6) |
| liquidsonics | 1 → 10/14 | **+9** | downloads hub installer filenames; Mac=Win only |
| audiothing | 43 → 47/86 | **+4** | Fog Convolver / Noises / Orbita / Speakers demo DMGs |
| u-he | 23 → 23/58 | +0 | releases listing unchanged; leftovers = soundsets/hardware |
| d16-group | 20 → 20/33 | +0 | leftovers = gen-1 SKUs / Plasticlicks / Slate Repeater |
| nugen-audio | 0 → 0/31 | +0 | account My Products only |
| cableguys | 0 → 0/21 | +0 | JS/Nuxt; marketing “3.6” ≠ installer receipt |

## Accepts (receipts)

### Baby Audio (`downloadsPage`, hash of `babyaud.io/downloads`)
Atoms 1.2, BA-1 1.7, Comeback Kid 1.6, Crystalline 1.8, Grainferno 1.2, Humanoid 1.2.2, I Heart NY 1.4, IHNY-2 1.5, Parallel Aggressor 1.5, Smooth Operator Pro 1.2, Spaced Out 1.7, SubCulture 1.0.3, Super VHS 1.6, TAIP 1.6, Tekno 1.1.1, Transit 2 2.2.

### Kazrog (`releaseNotesPage`, March Maintenance Updates table)
Airline V15 1.0.5, AmpCraft 1992 1.1.6, Avalon VT-747SP 1.0.8, KClip 3.6.7, KClip Zero 3.6.7, MHB Green 1.0.3, MHB Red 1.0.0, Retro Sta-Level 1.0.3, Synth Warmer 1.2.6, True 252 1.1.7, True Dynamics 1.2.6, True Iron 1.4.6 (receipt refresh).

### Acon Digital (`downloadsPage`, public installer filename + HEAD)
Acoustica / Acoustica Premium 7.7.8 (shared installer), AudioLava 2.1.4, DeBleed:Drums 1.0.1, DeFilter 1.2.1, DeVerberate 3.0.4, Equalize 2.1.1, Multiply 1.3.1, Remix 1.0.5, Remix:Drums 1.0.1, Restoration 2.1.2, Verberate 2.2.1, Verberate Basic 2.2.1, Verberate Immersive 2.2.10.

### LiquidSonics (`downloadsPage`, Mac=Win installer filenames)
Cinematic Rooms Professional 1.3.9, Seventh Heaven 1.5.8, Lustrous Plates Surround 1.3.7, Illusion 1.4.6, Reverberate 3 3.4.6, Tai Chi / Tai Chi Lite 1.6.2, HD Cart 1.3.8, M7 Link 1.2.8.

### AudioThing (`productPage`, demo installer basename)
Fog Convolver 2.4, Noises 1.3, Orbita 1.0, Speakers 1.3.3.

## Explicit skips
- **u-he**: soundsets/expansions/eurorack; Beatzille mirror; Zoyd `ZoydUB.zip` no semver.
- **audiothing**: Alborosie page → DubFilter (cross-wire); Blindfold EQ / Filterjam / Moon Echo email-gated; toys/expansions 404 or no installer; Environments expansions not stamped.
- **d16-group**: gen-1 ids must not take gen-2 installers; Plasticlicks; Repeater Slate Digital Edition.
- **nugen-audio**: login wall.
- **cableguys**: no non-JS installer/changelog semver.
- **acon**: Extract:Dialogue **2** store SKU vs public ExtractDialogue **1.5.0**; Studio* / DeEss missing public files.
- **liquidsonics**: Seventh Heaven Professional Mac **1.5.8** vs Win **1.5.9**; Filtrate / Verbsuite / Mobile Convolution no clear public links.
- Skipped hub grinding: Waves / UA / Arturia ASC / Softube Central / Avid / AIR / Slate.

## Playbooks
Markdown under `playbooks/` + upserted `manufacturer_playbooks` for: baby-audio, kazrog, acon-digital, liquidsonics, nugen-audio, audiothing, u-he, d16-group, cableguys.

## Artifacts
- `tmp-fetch/baby-dl-live.html`, `kazrog-march.html`, `acon-software.html`, `ls-dl.html`, `uhe-releases.html`, AT product HTML, `acon-proof-*.txt`
- Export: `out/catalog.json` (1322 with accepted latestVersion)
