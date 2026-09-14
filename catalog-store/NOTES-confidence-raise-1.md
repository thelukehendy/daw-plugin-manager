# NOTES — confidence raise 1 (2026-09-09 PT / 2026-09-10 UTC)

Overnight corroboration pass: raise KVR-only accepted currents against **primary manufacturer** sources. `verified_by=coding-assistant`. Prefer **new observation + plugin_version_current** for audit trail. Quality over fake raises.

## Result

| Metric | Value |
|---|---|
| **Raised this run** | **177** |
| Accepted-current green (≥85) | **1560** |
| Accepted-current amber (70–84) | **58** |
| Accepted-current yellow (<70) | **1026** (all remaining @60, KVR-sourced) |
| Remaining KVR-60 | **1026** |
| Export | `out/catalog.json` @ 2026-09-10T06:20:02Z → **2026-09-09 11:20 PM PT** |

## Breakdown of raises

| Manufacturer | Count | Manufacturer evidence | Confidence |
|---|---|---|---|
| Softube (native family) | **119** | softube.com release notes **2.6.41** (“All plug-ins”) + **2.6.42** (Monoment Bass / Parallels / Statement Lead only) | 92 |
| Softube UAD-* titles | **17** | UA help UAD Version History — suite **12.0** (2026-09-08); replaced stale KVR 11.8.x | 90 |
| Cherry Audio | **28** | cherryaudio.com `/products/{slug}/version-history` latest matches KVR | 92 |
| D16 Group (gen-1) | **7** | `cdn.d16.pl/installers/{Family}/{Family}-{ver}.dmg` HEAD 200; filename encodes KVR ver | 88 |
| u-he | **3** | `dl.u-he.com/releases/` `Zebra_Legacy_294_*` → 2.9.4 (Zebralette / Zebrify / The Dark Zebra) | 88 |
| Overloud | **2** | `download.overloud.com/TH-U/changelog.txt` head **2.0.19** (TH-U Premium + Essentials) | 92 |
| Cableguys | **1** | `downloads.cableguys.com/Cableguys-ShaperBox-3-Manual.pdf` “Manual v3.6.3” | 90 |

## Examples

- Softube Tape / Saturation Knob / FET Compressor Mk II: KVR 2.6.41 → softube.com RN 2.6.41 @92.
- Softube Parallels: KVR 2.6.42 → softube.com RN 2.6.42 (named products) @92.
- Softube UAD Marshall Plexi: KVR 11.8.3 → UA suite **12.0** @90 (not a fake confirm of 11.8.3).
- Cherry Sines / Miniverse / Voltage Modular Ignite: version-history latest equals KVR → @92.
- D16 Drumazon gen-1: CDN `Drumazon-1.6.2.dmg` matches KVR 1.6.2 → @88.
- Cableguys ShaperBox: official manual v3.6.3 matches KVR → @90.

## Explicit non-raises (quality)

- **Waves** (~238): public waves.com pages still do not expose per-plugin semver; left at 60.
- **Cherry** leftovers (~23): many `/version-history` URLs 500; **GX-80** manufacturer VH latest **1.0.9** ≠ KVR **1.0.13** (mismatch — skipped).
- **D16** Fazortan/Redoptor/Syntorus/Toraverb gen-1 @ KVR 2.2.2: only gen-2 CDN paths (`Fazortan2-…`) exist — do not stamp onto gen-1 ids.
- **Baby Audio** gen-1 Smooth Operator / Transit / Magic* etc.: not on current babyaud.io/downloads accordion (Pro/2 lines only).
- **AudioThing** instruments @1.0: no installer semver on public product pages this pass.
- **Softube family RN** not applied to Softube **UAD-*** SKUs (different UA suite train).
- Priority playbook mfrs already green (FabFilter, Kilohearts, Soundtoys, Melda, Valhalla, Goodhertz, SSL, Antares, Toontrack, most iZotope/PA/Leapwing) — nothing left at KVR-60 to re-verify except tiny leftovers (Iris 2 / Trash 2 dual Mac-Win; PA discontinued; LimitOne no RN).

## Playbook / doc updates

- `CONFIDENCE.md` — added Corroboration procedure.
- `HANDOFF-FOR-CURSOR.md` — green/amber/yellow counts refreshed.
- Softube / Cherry / D16 playbooks — scrub notes for this raise.
