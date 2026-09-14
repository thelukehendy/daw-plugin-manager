# NOTES — version chip HoRNet
**When:** 2026-09-10 ~1:30 AM PT (overnight keep-going)
**Path:** `/workspace/daw-plugin-catalog-store`
**Manufacturer:** `hornet` (HoRNet)

## Before / after
| Metric | Before | After |
|---|---:|---:|
| Accepted currents (hornet) | **1** (Corrosion 1.1.2) | **105** / 105 |
| True gaps | **104** | **0** |
| Manufacturer productPage @90–92 | 1 | **47** |
| KVR @60 (no public mfr banner yet / concurrent fill) | 0 | **58** |

Net: **+104** currents for hornet (1→105). Of those, this chip + concurrent work raised manufacturer-primary to **47**; remaining 58 still KVR pending further product-page banners.

## Method
- Public product pages only: `https://www.hornetplugins.com/plugins/{slug}/`.
- Version from page banners (`… is available` / updated / upgraded / released).
- Curl blocked by CleanTalk from this box; used WebFetch + Chrome headless `--dump-dom` + search snippets quoting manufacturer pages.
- Did **not** use HoRNet DoIn / My Account.
- Skipped slug redirects onto successor SKUs (e.g. songkey-mk3 → MK4 page).
- Pages without public semver (ZeroWidth, Spaces MK2, MixComp, TapeLite, H160, …): left as KVR@60 when already filled; did not invent.

## Manufacturer accepts (current)
| plugin_id | version | conf | source |
|---|---|---:|---|
| `hornet--bsharry-side-chainer` | 1.2.2 | 92 | /plugins/bsharry-side-chainer/ |
| `hornet--corrosion` | 1.1.2 | 92 | /plugins/corrosion/ |
| `hornet--hatefish-rhygenerator` | 1.2.3 | 92 | /plugins/hatefish-rhygenerator/ |
| `hornet--hornet-80verb` | 1.0.1 | 92 | /plugins/hornet-80verb/ |
| `hornet--hornet-analogstage-mk2` | 1.0.5 | 92 | /plugins/hornet-analogstage-mk2/ |
| `hornet--hornet-autogain` | 1.4.1 | 92 | /plugins/hornet-autogain/ |
| `hornet--hornet-autogain-pro` | 1.3.2 | 92 | /plugins/hornet-autogain-pro/ |
| `hornet--hornet-autogain-pro-mk2` | 2.1.1 | 90 | /plugins/hornet-autogain-pro-mk2/ |
| `hornet--hornet-balanceq` | 1.1.2 | 92 | /plugins/hornet-balanceq/ |
| `hornet--hornet-butterfly` | 1.0.7 | 90 | /plugins/hornet-butterfly/ |
| `hornet--hornet-channelstrip-mk3` | 3.2.1 | 90 | /plugins/hornet-channelstrip-mk3/ |
| `hornet--hornet-elliptiq` | 1.1.0 | 92 | /plugins/hornet-elliptiq/ |
| `hornet--hornet-elm128-mk2` | 2.2.2 | 92 | /plugins/hornet-elm128-mk2/ |
| `hornet--hornet-filtersolo` | 1.2.0 | 92 | /plugins/hornet-filtersolo/ |
| `hornet--hornet-guitarkit` | 1.3.0 | 92 | /plugins/hornet-guitarkit/ |
| `hornet--hornet-h4k-bus-compressor` | 1.0.1 | 90 | /plugins/hornet-h4k-bus-compressor/ |
| `hornet--hornet-h76` | 1.1.0 | 90 | /plugins/hornet-h76/ |
| `hornet--hornet-harmoniq` | 1.1.4 | 90 | /plugins/hornet-harmoniq/ |
| `hornet--hornet-hdd1` | 1.1.0 | 92 | /plugins/hornet-hdd1/ |
| `hornet--hornet-hts9` | 1.2.0 | 92 | /plugins/hornet-hts9/ |
| `hornet--hornet-magnus-mk3` | 1.1.2 | 92 | /plugins/hornet-magnus-mk3/ |
| `hornet--hornet-mastertool` | 1.1.1 | 92 | /plugins/hornet-mastertool/ |
| `hornet--hornet-multicomp-plus-mk2` | 2.1.3 | 92 | /plugins/hornet-multicomp-plus-mk2/ |
| `hornet--hornet-multifreqs` | 1.1.5 | 92 | /plugins/hornet-multifreqs/ |
| `hornet--hornet-planer` | 1.0.2 | 92 | /plugins/hornet-planer/ |
| `hornet--hornet-samp-spatial-audio-master-processor` | 1.3.0 | 92 | /plugins/hornet-samp/ |
| `hornet--hornet-sleek` | 1.1.4 | 92 | /plugins/hornet-sleek/ |
| `hornet--hornet-songkey-mk4` | 4.0.3 | 92 | /plugins/hornet-songkey-mk4/ |
| `hornet--hornet-spectraduck` | 1.0.1 | 92 | /plugins/hornet-spectraduck/ |
| `hornet--hornet-springverb` | 1.0.4 | 92 | /plugins/hornet-springverb/ |
| `hornet--hornet-sw34eq-mk2` | 2.3.0 | 92 | /plugins/hornet-sw34eq-mk2/ |
| `hornet--hornet-sybilla-pro` | 1.2.0 | 92 | /plugins/hornet-sybilla-pro/ |
| `hornet--hornet-tape-mk2` | 2.1.3 | 92 | /plugins/hornet-tape-mk2/ |
| `hornet--hornet-thenormalizer` | 1.3.5 | 92 | /plugins/hornet-thenormalizer/ |
| `hornet--hornet-thirtyone-mk2` | 2.1.2 | 90 | /plugins/hornet-thirtyone-mk2/ |
| `hornet--hornet-thrust` | 1.0.1 | 90 | /plugins/hornet-thrust/ |
| `hornet--hornet-totaleq-mk2` | 2.0.7 | 92 | /plugins/hornet-totaleq-mk2/ |
| `hornet--hornet-trackutility` | 1.2.0 | 92 | /plugins/hornet-trackutility/ |
| `hornet--hornet-trackutility-mk2` | 2.1.1 | 92 | /plugins/hornet-trackutility-mk2/ |
| `hornet--hornet-valvola` | 1.1.1 | 92 | /plugins/hornet-valvola/ |
| `hornet--hornet-vhs-mk2` | 2.0.5 | 92 | /plugins/hornet-vhs-mk2/ |
| `hornet--hornet-vu-meter-mk4` | 4.2.6 | 92 | /plugins/hornet-vu-meter-mk4/ |
| `hornet--hornet-zerobus` | 1.1.1 | 92 | /plugins/hornet-zerobus/ |
| `hornet--hornet-zerocomp` | 1.0.2 | 92 | /plugins/hornet-zerocomp/ |
| `hornet--hornet-zeroeq` | 1.0.2 | 92 | /plugins/hornet-zeroeq/ |
| `hornet--hornet-zeroloud` | 1.0.1 | 92 | /plugins/hornet-zeroloud/ |
| `hornet--track-coherence` | 1.1.1 | 92 | /plugins/track-coherence/ |

## Remaining KVR @60 (upgrade candidates)
Still on KVR product pages — many lack a public manufacturer version banner or need another fetch pass:

- `hornet--channelstrip-mk2` 2.1.1
- `hornet--coherence-meter` 1.1.0
- `hornet--hatefish-rhygenerator-one` 1.1.0
- `hornet--hornet-3xover` 1.0.4
- `hornet--hornet-adda` 1.0.4
- `hornet--hornet-analogstage` 1.2.0
- `hornet--hornet-angle` 1.0.1
- `hornet--hornet-cassette644` 1.0.3
- `hornet--hornet-chorus60` 1.2.0
- `hornet--hornet-clms` 1.1.0
- `hornet--hornet-compexp` 1.0.1
- `hornet--hornet-deelay` 1.4.0
- `hornet--hornet-deelay-plus` 1.3.1
- `hornet--hornet-dynamics-control` 1.0.1
- `hornet--hornet-dyneq` 1.1.1
- `hornet--hornet-elm128` 1.2.0
- `hornet--hornet-freqs` 1.0.0
- `hornet--hornet-graffio` 1.2.0
- `hornet--hornet-h160` 1.0.0
- `hornet--hornet-ha2a` 1.1.3
- `hornet--hornet-harmonics` 1.1.0
- `hornet--hornet-harmonics-pro` 1.0.1
- `hornet--hornet-hcs1` 1.1.0
- `hornet--hornet-hds1` 1.2.0
- `hornet--hornet-hds1-mk2` 2.0.0
- `hornet--hornet-jamming-rock` 1.0.2
- `hornet--hornet-l3012-bass-channel` 1.0.1
- `hornet--hornet-lu-meter` 1.2.1
- `hornet--hornet-lu-meter-mk2` 2.1.2
- `hornet--hornet-magnus` 1.2.0
- `hornet--hornet-magnus-lite` 1.0.0
- `hornet--hornet-magnus-mk2` 2.1.0
- `hornet--hornet-mbc` 1.0.4
- `hornet--hornet-mixcomp` 1.0.0
- `hornet--hornet-molla` 1.0.0
- `hornet--hornet-multicomp` 1.4.1
- `hornet--hornet-multicomp-plus` 1.2.0
- `hornet--hornet-songkey` 1.0.3
- `hornet--hornet-songkey-mk3` 3.1.0
- `hornet--hornet-spaces` 1.2.0
- `hornet--hornet-spaces-mk2` 2.0.0
- `hornet--hornet-spikes` 1.1.0
- `hornet--hornet-stereoview` 1.0.2
- `hornet--hornet-sw34eq` 1.2.1
- `hornet--hornet-sybilla` 1.4.0
- `hornet--hornet-syncpressor` 1.0.1
- `hornet--hornet-tape` 1.2.1
- `hornet--hornet-tapelite` 1.0.0
- `hornet--hornet-thirtyone` 1.2.5
- `hornet--hornet-total-eq` 1.3.4
- `hornet--hornet-trackshaper` 1.2.0
- `hornet--hornet-trebande` 1.0.0
- `hornet--hornet-vca` 1.1.0
- `hornet--hornet-vhs-virtual-headphones-system` 1.5.1
- `hornet--hornet-vu-meter` 2.3.2
- `hornet--hornet-vu-meter-mk3` 3.0.10
- `hornet--hornet-wahwah` 1.3.1
- `hornet--hornet-zerowidth` 1.0.0

## Artifacts
- `playbooks/hornet.md` (updated)
- `manufacturer_playbooks` row `hornet` upserted
- `tmp-fetch/chip-hornet/` HTML receipts
- Export: `python3 src/export_catalog.py`
- Status: `python3 src/status_report.py` → `STATUS.md`
