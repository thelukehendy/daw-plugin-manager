# NOTES — Valhalla DSP + Goodhertz zero-trust verification

Date: 2026-09-09 (PT) / 2026-09-10 UTC  
Verified by: coding-assistant

## Store inventory (before accept)

### valhalla-dsp (8 plugins)
| id | name | match_patterns |
|---|---|---|
| valhalla-dsp--valhalladelay | ValhallaDelay | ["ValhallaDelay"] |
| valhalla-dsp--valhallafreqecho | ValhallaFreqEcho | ["ValhallaFreqEcho"] |
| valhalla-dsp--valhallafutureverb | ValhallaFutureVerb | ["ValhallaFutureVerb"] |
| valhalla-dsp--valhallaplate | ValhallaPlate | ["ValhallaPlate"] |
| valhalla-dsp--valhallaroom | ValhallaRoom | ["ValhallaRoom"] |
| valhalla-dsp--valhallashimmer | ValhallaShimmer | ["ValhallaShimmer"] |
| valhalla-dsp--valhallasupermassive | ValhallaSupermassive | ["ValhallaSupermassive"] |
| valhalla-dsp--valhallavintageverb | ValhallaVintageVerb | ["ValhallaVintageVerb"] |

Portal `https://valhalladsp.com/my-account/downloads/` is login-walled (login/register form only; no version list without auth). Versions taken from public **product pages** (and corroborated on `https://valhalladsp.com/demos-downloads/`).

### goodhertz (14 plugins)
| id | name |
|---|---|
| goodhertz--suite | Goodhertz (suite catch-all) |
| goodhertz--canopenerstudio | Goodhertz CanOpener Studio |
| goodhertz--faradaylimiter | Goodhertz Faraday Limiter |
| goodhertz--gooddither | Goodhertz Good Dither |
| goodhertz--lohi | Goodhertz Lohi |
| goodhertz--lossy | Goodhertz Lossy |
| goodhertz--midside | Goodhertz Midside |
| goodhertz--midsidematrix | Goodhertz Midside Matrix |
| goodhertz--panpot | Goodhertz Panpot |
| goodhertz--tiltshift | Goodhertz Tiltshift |
| goodhertz--tonecontrol | Goodhertz Tone Control |
| goodhertz--tremcontrol | Goodhertz Trem Control |
| goodhertz--vulfcompressor | Goodhertz Vulf Compressor |
| goodhertz--wowcontrol | Goodhertz Wow Control |

Public downloads page `https://goodhertz.com/downloads/` publishes a single suite version for all plugins.

## Accepted (22)

### Valhalla DSP — productPage (8/8)

| plugin_id | accepted | source_url | seed → page delta |
|---|---|---|---|
| valhalla-dsp--valhalladelay | **3.0.5** | https://valhalladsp.com/shop/delay/valhalladelay/ | 28.0 → 3.0.5 |
| valhalla-dsp--valhallaroom | **2.0.5** | https://valhalladsp.com/shop/reverb/valhalla-room/ | 28.0 → 2.0.5 |
| valhalla-dsp--valhallaplate | **1.6.8** (Mac; Win 1.6.3 noted) | https://valhalladsp.com/shop/reverb/valhalla-plate/ | 28.0 → 1.6.8 |
| valhalla-dsp--valhallavintageverb | **4.0.5** | https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/ | 28.0 → 4.0.5 |
| valhalla-dsp--valhallashimmer | **1.3.0** (Mac; Win 1.2.2 noted) | https://valhalladsp.com/shop/reverb/valhalla-shimmer/ | 1.3.0 = match |
| valhalla-dsp--valhallafutureverb | **1.0.2** | https://valhalladsp.com/shop/reverb/valhallafutureverb/ | 28.0 → 1.0.2 |
| valhalla-dsp--valhallasupermassive | **5.0.0** | https://valhalladsp.com/shop/reverb/valhalla-supermassive/ | 3.0.0 → 5.0.0 |
| valhalla-dsp--valhallafreqecho | **1.2.8** (Mac; Win 1.2.0 noted) | https://valhalladsp.com/shop/delay/valhalla-freq-echo/ | 28.0 → 1.2.8 |

Seed `latestVersion` values of `28.0` appear spurious (not present on any public Valhalla page); page “Current Version” preferred. Evidence = page “Current Version …” text; `content_hash` = SHA-256 of fetched HTML body; `verified_by=coding-assistant`.

### Goodhertz — downloadsPage (14/14)

All mapped to suite **3.14.1** from https://goodhertz.com/downloads/  
Evidence: heading “Goodhertz 3.14.1” / “June 30, 2026”; page states one installer for all plugins. Matches seed 3.14.1.  
`content_hash=447b20f213a14e1578a40d2c60ef467281735d8131cb75f761cf8263305ed003`

## Left unknown

None for these two manufacturers. Account portal not used (login required); public product/downloads pages were sufficient.

## Final stats (after export)

- accepted observations total: **78** (was 56; +22)
- plugins with current version: **78**
- by manufacturer (current): kilohearts 39, fabfilter 17, **goodhertz 14**, **valhalla-dsp 8**
- export: `out/catalog.json` — 100 manufacturers, 816 plugins, 78 with accepted latestVersion

## Policy notes

- Did not trust seed `latestVersion` as truth.
- Did not use installer binary URLs alone; used product/downloads HTML receipts.
- Did not clone git repos.
