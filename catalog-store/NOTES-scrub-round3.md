# NOTES — scrub round 3 (2026-09-10 PT)

Zero-trust version scrub continuation. Start: **1322/2827** accepted. End: **1345/2827** (Δ **+23**). `verified_by=coding-assistant`. No git clone.

## Per-manufacturer deltas

| manufacturer | before → after | Δ | notes |
|---|---|---|---|
| leapwing-audio | 0 → 7/8 | **+7** | public support release-notes Version headings |
| audio-ease | 0 → 3/11 | **+3** | product-page version history (Altiverb/Snapper/Speakerphone) |
| spl | 1 → 13/20 | **+12** | PA product `Installer vX.Y.Z` on matching spl--* SKUs |
| plugin-alliance | 162 → 163/175 | **+1** | vitalizer-mk2-t 1.0.0 (found while doing SPL) |
| baby-audio | 16 → 16/25 | +0 | leftovers still off trials accordion / legacy `v1` too weak |
| acon-digital | 14 → 14/29 | +0 | Studio/DeEss/ExtractDialogue2 still no public gen-matched files |
| liquidsonics | 10 → 10/14 | +0 | Seventh Heaven Pro Mac≠Win; Filtrate/Verbsuite/Mobile Convolution missing |
| kazrog | 12 → 12/17 | +0 | Recabinet/Thermionik/ValvEQ/masterDither/PluginUpdate not in public tables |
| synchro-arts | 0 → 0/10 | +0 | downloads = My Account only; legacy Zendesk ≠ current gens |
| output | 0 → 0/11 | +0 | Output Hub / account; legacy FX versions are old |
| mcdsp | 0 → 0/25 | +0 | public v7 installers but Mac **7.3.17** ≠ Win **7.3.0.23** |

## Accepts (receipts)

### Leapwing Audio (`releaseNotesPage`)
DynOne **3.12.6**, CenterOne **2.14.9**, StageOne 2 **2.0.5**, RootOne **1.10.4**, Al Schmitt **1.4**, UltraVox **2.0.0**, Joe Chiccarelli Signature Plugin **1.2.1** — from `…/support/<product>-release-notes/` newest `Version X.Y.Z – date` heading.

### Audio Ease (`releaseNotesPage` / `downloadsPage`)
- Altiverb **8.2.7** — `audioease.com/altiverb/` “Altiverb 8.2.7 for macOS & Windows - released Dec 18, 2025”
- Snapper **3.1.6** — `audioease.com/snapper/` + `Snapper-3.1.6.dmg.zip`
- Speakerphone **3.1.5** — `audioease.com/speakerphone/` “Speakerphone 3.1.5 Windows - released Dec 4, 2025” (Mac latest listed 3.1.4)

### SPL via Plugin Alliance (`productPage`)
| plugin_id | version | PA slug |
|---|---|---|
| spl--spl-eq-ranger-plus | 1.11.3 | eq-ranger-plus |
| spl--spl-free-ranger / spl--free-ranger | 1.19.3 | free-ranger |
| spl--spl-hawkeye | 1.1.0 | hawkeye |
| spl--spl-iron | 1.7.0 | iron |
| spl--spl-transient-designer-plus / spl--spl-transient-designer / spl--transient-designer | 1.11.3 | transient-designer-plus |
| spl--drumxchanger | 1.16.0 | drumxchanger |
| spl--passeq | 1.16.0 | passeq |
| spl--twintube | 1.19.2 | twintube |
| spl--vitalizer-mk2-t (+ plugin-alliance--spl-vitalizer-mk2-t) | 1.0.0 | vitalizer-mk2-t |

## Explicit skips
- **leapwing LimitOne**: product page only; no public release-notes article (404).
- **audio-ease legacy**: Cabinet/Roger/Orbit/Follo/RiverRun/PeriScope/Deep Phase Nine/VST Wrapper — no current public version pages; `/download` email-gated; old Altiverb downloads.php 404.
- **synchro-arts**: current installers behind `app.synchroarts.com/my-plugins`; Zendesk legacy Ver must not stamp VocAlign 6 / RePitch 2 / Revoice Pro 5 / Titan / Doubler.
- **output**: Hub/account; support legacy Movement 1.1.0 / Portal 1.0.4 / Thermal 1.0.1 are not current.
- **mcdsp**: public plugin-downloads exist, but Mac Native `7_3_17` vs Win `7_3_0_23` — no single latestVersion.
- **spl leftovers**: attacker / de-verb / mo-verb / spl-attacker (non-Plus vs Plus pages); eq-rangers-vol-1; UAD Vitalizer SKUs.
- **baby/acon/liquidsonics/kazrog leftovers**: unchanged from round 2 rationale.
- Skipped hub grinding: NUGEN / Cableguys / Slate / AIR (per brief).

## Playbooks
Markdown under `playbooks/` + upserted `manufacturer_playbooks` for: audio-ease, leapwing-audio, synchro-arts, output, mcdsp, spl (plus round-3 leftover notes on baby-audio, acon-digital, liquidsonics, kazrog).

## Artifacts
- Leapwing: `tmp-fetch/lw-rn-*-release-notes.html`
- Audio Ease: `ae-altiverb.html`, `ae-snapper.html`, `ae-speakerphone.html`
- SPL/PA: `tmp-fetch/pa-*.html` (eq-ranger-plus, free-ranger, hawkeye, iron, …)
- McDSP: `mcdsp-plugin-dl.html` (dual-version evidence)
- Synchro/Output: downloads/legacy HTML for hub-wall documentation
- Export: `out/catalog.json` (**1345** with accepted latestVersion)
