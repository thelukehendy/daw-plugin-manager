# NOTES — universe expand 8 (2026-09-10 ~4:44→4:55 AM PT)

## Delta

| Metric | Before | After |
|---|---:|---:|
| Manufacturers | 561 | **561** |
| Plugins | 7000 | **7020** (+20) |
| Accepted currents | 4886 | **4893** (+7 chips) |

## Sources

- KVR developer Wavesfactory (24 product slugs)
- wavesfactory.com `/audio-plugins/*` changelogs + `/instruments/*` Kontakt pages
- audiority.com/plugin-versions/ (titles missing from store)
- OAS registry re-diff: **0** new (559/559 already present)

## Inserted identities

### Wavesfactory plugins (+5 net after name fix)
Equalizer, Trackspacer, Quantum, Echo Cat, Re-Esser (+ Sharine identity Soft404)

### Wavesfactory soundsets (+12)
Body Percussion, Legacy Drums, Marxophone, Mercury Piano, Mercury Piano Lite, Samba Drums, Strum Guitar, StrumGtr Electric, Clocks, Freelodica, Music Box, Old Tape Drums

### Audiority (+2)
Harmonic Maximizer, Polaris

## In-pass version chips @92

| id | version | source |
|---|---|---|
| wavesfactory--equalizer | 1.0.2 | productPage changelog |
| wavesfactory--trackspacer | 2.5.10 | productPage changelog |
| wavesfactory--quantum | 1.0.2 | productPage changelog |
| wavesfactory--echo-cat | 1.0.2 | productPage changelog |
| wavesfactory--re-esser | 1.0.3 | productPage changelog |
| audiority--harmonic-maximizer | 1.3.1 | Plugin Versions table |
| audiority--polaris | 1.9 | Plugin Versions table |

## Playbooks

- New `playbooks/wavesfactory.md`
- Updated `playbooks/audiority.md`, `playbooks/mercurial-tones.md`, `playbooks/baby-audio.md`
- DB playbook upsert for wavesfactory + mercurial hub_walled

## Import artifact

`data/universe-expansion-expand8.json`
