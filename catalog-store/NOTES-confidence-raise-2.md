# NOTES — confidence raise 2 (2026-09-09 PT / 2026-09-10 UTC)

Overnight corroboration pass #2: raise KVR-only accepted currents against **primary manufacturer** sources. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **234** |
| Accepted-current green (≥85) | **1802** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **793** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **793** |
| Export | `out/catalog.json` @ 2026-09-10T06:33:18Z → **2026-09-09 11:33 PM PT** |

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Universal Audio (UAD DSP train) | **134** | help.uaudio.com UAD Version History — **Version 12.0** (2026-09-08); replaced stale KVR 11.8.x / 11.9.0 / 12.0.0 | 90 |
| Arturia | **71** | arturia.com `/support/downloads-manuals/product/{slug}` Software Version equals KVR (ASC not required) | 92 |
| McDSP | **25** | mcdsp.com/plugin-downloads → `McDSP_Native_Setup_7_3_0_23_WIN.zip` (HEAD 200) → **7.3.0.23** (newer than KVR 7.3.0.18) | 88 |
| Spitfire Audio (BBCSO) | **4** | support.spitfireaudio.com BBCSO plugin changelogs — product **1.7.0** / plugin **1.12.14** | 92 |

## Examples

- Arturia Acid V / MiniFreak V / Comp FET-76: downloads-manuals Software Version matches KVR build (e.g. 1.1.5.6367 / 4.0.2.6369 / 1.7.1.6566) → @92.
- Arturia slug aliases used when store id ≠ download slug (`comp-fet76`, `1973-pre`, `mini-filter`, `rev-plate140`, `tape-j37`, `pure-lofi`, …).
- McDSP Native line: KVR 7.3.0.18 → manufacturer Win installer **7.3.0.23** @88 (Mac installer remains 7.3.17 — platform numbering diverge; Win train accepted).
- UA UAD 4K Buss / Boss CE-1 / suite peers: KVR 11.8.3 / 11.8.0 → UA suite **12.0** @90 (not a fake confirm of 11.8.x).
- Spitfire BBCSO Core/Discover/Piano Pro: product version remains **1.7.0** per changelog → @92; Professional KVR **1.12.14** matches plugin v1.12.14 → @92.

## Explicit non-raises (quality)

- **IK Multimedia** (~150): Product Manager hub-walled; public amplitube5 page snippets show **5.10.4** while KVR currents are **5.10.9** — mismatch, skip. No public per-module changelog this pass.
- **Spitfire** leftovers (~77): product marketing pages do not expose library semver; app-gated. Only BBCSO support changelog used.
- **Plugin Alliance** KVR-60 leftovers (3): MEGA Sampler / Schoeps Double MS / Schoeps Mono Upmix — live product handles **404** / absent from `products.json`; do not force.
- **Overloud** leftovers (44): public `/downloads` is DEMO-only (no Installer v); no per-GEM `download.overloud.com/*/changelog.txt` (unlike TH-U). Do not stamp TH-U **2.0.19** onto edition packs @1.4.7 or GEM modules.
- **Universal Audio** UADx / native 1.x (~60) + Nigel 7.7: not on UAD DSP suite train — left at 60 pending per-title manufacturer pages.
- **Antares / SSL**: none remaining at KVR-60.
- **iZotope** Iris 2 / Trash 2: dual Mac-Win ambiguity — skip.
- **Sample Waves**: no yellow currents / no public page.
- **Waves** (~238): still no public per-plugin semver.

## Playbook / doc updates

- `HANDOFF-FOR-CURSOR.md` — green/amber/yellow + export refreshed.
- `playbooks/arturia.md`, `mcdsp.md`, `universal-audio.md`, `spitfire-audio.md` — scrub notes for this raise.
