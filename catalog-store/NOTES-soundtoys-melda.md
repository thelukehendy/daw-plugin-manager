# NOTES — Soundtoys + MeldaProduction (+ United Plugins attempt) zero-trust verification

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant

## Store inventory (before accept)

### soundtoys (23 plugins)
| id | name |
|---|---|
| soundtoys--crystallizer | Crystallizer |
| soundtoys--decapitator | Decapitator |
| soundtoys--devilloc | DevilLoc |
| soundtoys--devillocdeluxe | DevilLocDeluxe |
| soundtoys--echoboy | EchoBoy |
| soundtoys--echoboyjr | EchoBoyJr |
| soundtoys--effectrack | EffectRack |
| soundtoys--filterfreak1 | FilterFreak1 |
| soundtoys--filterfreak2 | FilterFreak2 |
| soundtoys--littlealterboy | LittleAlterBoy |
| soundtoys--littlemicroshift | LittleMicroShift |
| soundtoys--littleplate | LittlePlate |
| soundtoys--littleprimaltap | LittlePrimalTap |
| soundtoys--littleradiator | LittleRadiator |
| soundtoys--microshift | MicroShift |
| soundtoys--panman | PanMan |
| soundtoys--phasemistress | PhaseMistress |
| soundtoys--primaltap | PrimalTap |
| soundtoys--radiator | Radiator |
| soundtoys--sieq | SieQ |
| soundtoys--spaceblender | SpaceBlender |
| soundtoys--superplate | SuperPlate |
| soundtoys--tremolator | Tremolator |

Portal `https://www.soundtoys.com/downloads/` is effectively login-walled for installer binaries (“Please click here to access our latest installer(s).” → account). Versions taken from public **release log**.

### meldaproduction (42 plugins)
MAGC, MAnalyzer, MAutoAlign, MAutoPitch, MAutopan, MBandPass, MBitFun, MCCGenerator, MChannelMatrix, MCharmVerb, MComb, MCompressor, MConvolutionEZ, MDelay, MEqualizer, MFlanger, MFreeformPhase, MFreqShifter, MLoudnessAnalyzer, MMetronome, MNoiseGenerator, MNotepad, MOscillator, MOscilloscope, MPhaser, MRatio, MRatioMB, MRecorder, MRingModulator, MSaturator, MSpectralPan, MStereoExpander, MStereoScope, MTransient, MTremolo, MTuner, MTurboDelay, MTurboDelayMB, MUtility, MVibrato, MWaveFolder, MWaveShaper.

Seed portal `https://www.meldaproduction.com/download` returned **403 Forbidden** from this fetch network; public page that works is `https://www.meldaproduction.com/downloads` (also linked from Melda nav).

### united-plugins (13 plugins) — attempted
BassmentCore, CyberdriveCore, ElectrumCore, FireCharger, FirePresser, HyperspaceCore, OrbitronCore, QuickVoxCore, RetronautCore, RoyalCompressor, TrapTuneCore, UrbanPuncher, VoxDucker.

Canonical public downloads URL is lowercase `https://unitedplugins.com/download/` (seed/portal `…/Download/` returns Page Not Found).

## Accepted

### Soundtoys — releaseNotesPage (23/23) @ **5.5.5**

| field | value |
|---|---|
| source_url | https://www.soundtoys.com/release-log/ |
| source_kind | releaseNotesPage |
| content_hash | `ecc330dbd62c24bbd1a188a1f116027bded2850c24873c644473f508d7673061` |
| evidence | Heading **“Soundtoys 5.5.5 Update”**, date **July 7, 2026**; suite-wide notes referencing PanMan, EchoBoy, Effect Rack, etc. |
| seed delta | seed `5.5.5` → page `5.5.5` (**match**) |

Shared suite version applied to all 23 store plugins (Soundtoys ships one 5.x installer family; release log titles updates as “Soundtoys 5.x.x Update”).

### MeldaProduction — downloadsPage (42/42) @ **17.10.01** (kernel)

| field | value |
|---|---|
| source_url | https://www.meldaproduction.com/downloads |
| source_kind | downloadsPage |
| content_hash | `9a8bcafb123cca2f946f8f444cd0a74b5f3c5e28fe19500fc146d5f5f04c4e02` |
| evidence | Page text **“installer version: 02.30 · kernel version: 17.10.01”**. Corroboration on https://www.meldaproduction.com/changes/ : **“Please note that we use kernel version numbers, therefore all plugins have the same version number.”** + section **“17.10 changes”**. |
| seed delta | seed `17.09` → page kernel `17.10.01` (**delta**) |

**Version choice:** Preferred **kernel `17.10.01`** (CFBundle-style / shared plugin version) over MPluginManager installer `02.30`. Page states all Melda plugins install only via MPluginManager and share one kernel number.

## Left unknown

### united-plugins (13/13 unknown)

| why | detail |
|---|---|
| Ambiguous public version | `https://unitedplugins.com/download/` publishes **UnitedPluginsManager “Current version: 02.19”** only (hash `aea3d66379e965949877fef5e009772806a4ae2f6a68b406f2c6922146b32c10`). That is the **manager/installer**, not proven CFBundle/plugin version. |
| Seed not trusted | Seed `latestVersion=02.19` matches manager, not necessarily plugins. |
| Legacy ≠ current | `https://unitedplugins.com/download/old` lists **older per-plugin** versions (e.g. Bassment Core v1.6, Electrum Core v2.3, FireCharger v3.0, FirePresser v3.1, Hyperspace v2.9, Orbitron v1.9, …) explicitly as legacy 32-bit-era installers — not accepted as current. |
| No public kernel split | Unlike Melda, United does not publish a separate public “kernel version” next to the manager version. |

No United observations inserted.

## Final stats (after export)

- accepted observations total: **143** (was 78; +65 = 23 Soundtoys + 42 Melda)
- plugins with current version: **143**
- by manufacturer (current): **meldaproduction 42 @ 17.10.01**, kilohearts 39 @ 2.4.6, **soundtoys 23 @ 5.5.5**, fabfilter 17, goodhertz 14 @ 3.14.1, valhalla-dsp 8
- united-plugins: **0** accepted
- export: `out/catalog.json` — 100 manufacturers, 816 plugins, 143 with accepted latestVersion

## Policy notes

- Did not trust seed `latestVersion` as truth (Soundtoys matched; Melda advanced 17.09→17.10.01; United seed rejected as manager-only).
- Soundtoys downloads portal not used for version (login-gated binaries); release log used.
- Melda `/download` 403 from this network; `/downloads` used.
- United `/Download/` 404; lowercase `/download/` used; still insufficient for per-plugin accept.
- Did not clone git repos.
