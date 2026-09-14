# kush-audio

## Version chip new-mfrs-1 (2026-09-10 ~1:05 AM PT)
- Method: Marketing/subscription site (thehouseofkush.com) does not list per-plugin semver publicly.
- Primary URLs: https://www.thehouseofkush.com/
- Extract: KVR verwin fallback until a public changelog appears.
- Success: 19/19 via KVR@60 this pass.
- hub_walled: 1


## Confidence raise 10
- Non-raise: thehouseofkush.com products.json has no public installer semver.


## Confidence raise 13 (2026-09-10 ~2:55 AM PT)
- Method: Official public downloads page `https://thehouseofkush.com/pages/downloads` lists per-SKU Mac/Win version labels + `thedataofkush.com/installers/*_{Mac,Win}.zip`.
- Mac label is authoritative for this macOS catalog; when Mac ≠ Win and Mac > KVR, accept Mac as manufacturer-newer current.
- Raised **13** @**90** (`downloadsPage`).
- Exact match: Clariphonic Mk3 **1.0.1**, Hammer Mk2 **1.0.5**, UBK-2 **1.0.3**, q.632 **1.0.1**.
- Manufacturer Mac newer than KVR: AR-1 **1.1.1**, Blyss **1.2.3**, Electra DSP **1.7.1**, LG Drive **1.1.2**, Novatron **1.2.3**, Omega N **1.2.1**, REDDI **1.1.1**, SILIKA **1.2.2**, Pusher/UBK Pusher **1.2.2**.
- Remaining yellow **5**: Clariphonic DSP MkII, Hammer DSP, Goldplate, Omega A, Omega 458A — Legacy Downloads section lists titles only (no version); do not stamp Omega 2 * successors onto gen-1 Omega rows.
- hub_walled: 0 for downloads page (public demos/installers).
