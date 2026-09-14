# SPL (via Plugin Alliance product pages)

## What worked
- SPL-distributed Plugin Alliance products expose public `Installer vX.Y.Z (Mac…)` / Win on `https://www.plugin-alliance.com/products/<slug>`.
- Hash PA product HTML; accept onto matching `spl--*` universe ids when the PA slug is the same SKU (Mac=Win installer label).

## Accepted this scrub (examples)
- free-ranger / spl-free-ranger 1.19.3, eq-ranger-plus 1.11.3, hawkeye 1.1.0, iron 1.7.0,
  transient-designer(+plus) 1.11.3, drumxchanger 1.16.0, passeq 1.16.0, twintube 1.19.2,
  vitalizer-mk2-t 1.0.0 (also stamped `plugin-alliance--spl-vitalizer-mk2-t`).

## Caveats
- Do **not** stamp non-Plus leftovers (attacker, de-verb, mo-verb) from Attacker/De-Verb/Mo-Verb **Plus** pages — generation mismatch; non-Plus PA slugs 404.
- EQ Rangers Vol. 1 (pre-Plus pack) and UAD Vitalizer SKUs: skip (legacy / UA hub).
- `spl.audio` software-downloads is not a per-plugin semver source for these PA-distributed titles.

## Overnight chip-203
- **+8** legacy Attacker/De-Verb/Mo-Verb/EQ Rangers Vol.1 (+ Bass/Vox/Full Ranger) **1.9** from public `files.plugin-alliance.com` legacy installer filenames; marked discontinued with Plus successors.
