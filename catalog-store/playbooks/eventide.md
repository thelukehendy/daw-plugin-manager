# Eventide

## What worked
- Per-product downloads: `https://www.eventideaudio.com/downloads/?product=NAME`
- Trademark encodings required for some titles: `Blackhole%C2%AE`, `CrushStation%C2%AE`, `H949+Harmonizer%C2%AE` (bare names return empty downloads).
- Evidence: `Installer (Mac 64-bit) Version X.Y.Z` and matching Win row — accept @92 when Mac/Win agree.
- Chip eventide-tdr-sonnox: Blackhole 3.11.4, CrushStation 1.4.4, H949 3.12.4.

## Caveats
- H9 Series Blackhole may be classified suite_component vs main Blackhole® — version still from Blackhole® downloads.
- H9/H90 pedals → hardware (skip).
- Anthology XI/XII → bundle (public 2.7.14 / 1.5.5 observed; skip true-plugin chips).
- Parallel KVR stamps can race manufacturer accepts — re-set-current manufacturer @92 if overwritten.

## version-chip-expand-7
- Blackhole standalone stamped **3.11.4** @92 (Eventide downloads Blackhole® + KVR twin of H9 Series: Blackhole). ≠ Immersive 1.4.4.
