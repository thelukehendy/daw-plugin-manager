# Wavesfactory

Spanish house (wavesfactory.com). Dense plugin + Kontakt instrument catalog.

## Discovery methods

| Source | Works publicly? | Notes |
|---|---|---|
| Product-page changelog (`# Version X.Y.Z` newest-first) | **Yes** | Preferred @92 for plugins under `/audio-plugins/{slug}` |
| Blog changelog index | **Yes** | https://www.wavesfactory.com/blog/posts/changelog-and-updates/ (prior 6 already green) |
| KVR developer listing | **Yes** | Identity densify; versions only when manufacturer matches |
| Kontakt instruments `/instruments/` | Identity | Treat as **soundset** — no installer semver expected |

## Confidence raise / expand-8 (2026-09-10 ~4:44–4:55 AM PT)

New chips @92 from product-page changelogs:
- Equalizer **1.0.2**, Trackspacer **2.5.10**, Quantum **1.0.2**, Echo Cat **1.0.2**, Re-Esser **1.0.3**
Prior greens (Cassette/Spectre/Flash/SK10/SnareBuzz/Cassette Transport) already matched blog changelog @92.
`wavesfactory--sharine`: KVR identity only; product page Soft404 — leave unversioned.

## Soundsets added (expand8)

Body Percussion, Legacy Drums, Marxophone, Mercury Piano(+Lite), Samba Drums, Strum Guitar, StrumGtr Electric, Clocks, Freelodica, Music Box, Old Tape Drums — identity_kind=soundset.

## Weekly scrub

1. Hit `/audio-plugins/{slug}` changelog headers for active plugins.
2. Do not stamp Kontakt library “versions” onto soundset rows.
3. Confidence: manufacturer changelog → **92**; KVR-only → **60**.

## Confidence raise 23
- Yellow leftovers **0** (all currents already @92). No raises.
