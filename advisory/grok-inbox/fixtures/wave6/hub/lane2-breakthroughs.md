# Wave 6 Lane 2 — Creative hub-walled breakthroughs

**Date:** 2026-09-25 PT  
**Scope:** Waves · NI · IK · Spitfire · UA · Slate · EastWest · Output · 8Dio · UVI  
**Constraint:** public oracles only; fixtures under `fixtures/lane2/`; no commits; no login walls  
**Identity law:** hub/generation/app version ≠ plugin SKU stamp

Already-accepted oracles are **not** re-presented as new. This pack adds *new* angles and cheap maintenance paths beyond them.

---

## Ranked breakthroughs (implement first → later)

| Rank | Confidence | Vendor | Breakthrough | Why Muse first |
|---:|:---:|---|---|---|
| **1** | **0.93** | Waves | **Downloads canary** `Mac/Win: V17.0.4 \| Aug 02, 2026` on `https://www.waves.com/downloads` + DMG `Last-Modified` corroboration | Cheaper than RN parse; Central-only chip; stub detector required |
| **2** | **0.95** | Native Instruments | **electron-updater YAML** `https://na-update.native-instruments.com/arm64/latest-mac.yml` → `version: 3.26.0` | Softube-sc3-class durable poller; no browser; Native Access app only |
| **3** | **0.90** | IK Multimedia | **CDN filename + Referer HEAD** `ik_product_manager_1.1.15.dmg` on `g1.ikmultimedia.com` (`Last-Modified: Tue, 25 Aug 2026`) | Version in URL; page scrape → HEAD; PM app canary only |
| **4** | **0.88** | Universal Audio | **Versioned UA Connect DMG** `UA_Connect_1_10_0_3844_Mac.dmg` (`Last-Modified: Mon, 14 Sep 2026`) via brew URL discovery | Connect app ≠ UAD suite 12.0 history |
| **5** | **0.87** | Spitfire | **CloudFront path embeds app semver** `SpitfireAudio.Mac-3.4.17.dmg` (brew-tracked URL) | App canary; libraries still Intercom/app-gated |
| **6** | **0.84** | Moog *(pattern)* | **`softwareUpdate/{slug}` public tip HTML** (e.g. Mariana `1.2.0`) | Template for hunting tip pages on other hubs |
| **7** | **0.80** | Softube *(control)* | **sc3 YAML `3.0.5` vs root YAML `2.2.0` vs stale brew** | Teaches path discipline + brew lag guards |
| **8** | **0.72** | Multi-hub | **Homebrew cask JSON as URL discovery**, never SoT | Cheap pointer to CDN tips; always verify HEAD/YAML |
| **9** | **0.55** | Lane4 OSS | **GitHub `releases.atom` + ETag** (x42 works; airwindows empty; API RL) | Maintenance design for Airwindows/x42/Surge class |
| — | low | Output / UVI / Slate / EW / 8Dio | No *new* durable CDN/yml beyond accepted help/support oracles | Park novel digs; keep accepted pollers |

---

## 1. Waves — Downloads Central canary (NEW)

**URLs**
- HTML: `https://www.waves.com/downloads`
- DMG: `https://cf-installers.waves.com/WavesCentral/Install_Waves_Central.dmg`
- EXE: same prefix `Install_Waves_Central.exe`

**Live proof (fixture `waves-downloads.body`, 114 127 B)**  
Visible card text:

> Mac: **V17.0.4** | **Aug 02, 2026**  
> Windows: **V17.0.4** | **Aug 02, 2026**

DMG HEAD: `Last-Modified: Sun, 02 Aug 2026 10:26:42 GMT` (date-aligns with canary).  
Homebrew cask `waves-central` reports `17.0.4` + same DMG URL.

**WAF reality:** same URL intermittently returns **~212 B Incapsula stub** (reproduced afternoon PT 2026-09-25). RN HTML also fluctuates between stub and full document.

**Engine chip:** `waves_central_canary_poller`  
1. GET downloads HTML  
2. **Stub detector** — reject if `len < 500` OR body contains `Incapsula` / `_Incapsula_Resource` OR missing `Mac:\s*V?\d`  
3. Regex canary → emit observation on identity `waves--waves-central` (hub app) only  
4. Optional corroboration: HEAD DMG `Last-Modified` / brew version  
5. Golden fixture: `fixtures/lane2/waves-downloads.body` + `waves-downloads-canary.json`

**Identity guards**
- Central `V17.0.4` ≠ stamp onto plugin SKUs / generation-wide V17  
- Generation bump still needs RN diff (accepted browser path) — this canary only tracks **Central app tip**

**Cheap maintenance:** poll 2–4×/day; on stub → retry once → fall back to DMG Last-Modified + brew; alert if canary date moves without RN generation event.

---

## 2. Native Instruments — electron-updater YAML (NEW)

**URLs (all 200, `application/yaml`)**
- `https://na-update.native-instruments.com/arm64/latest-mac.yml` → **3.26.0** (arm64)
- `https://na-update.native-instruments.com/latest-mac.yml` → **3.26.0** (x64 mac)
- `https://na-update.native-instruments.com/latest.yml` → **3.26.0** (win exe)

Fixture: `ni-arm64-latest-mac.yml` (`releaseDate: 2026-09-08T…`).  
Zip HEAD Last-Modified ≈ **Thu, 10 Sep 2026**. Matches accepted community tip **3.26.0** but is a **new durable transport** (Softube-sc3 class).

**Engine chip:** `ni_access_yml_poller`  
- Daily GET YAML; parse `version:`  
- Stub detector: must start with `version:` and include `files:`  
- Golden sha256 of YAML body  
- HEAD zip only when version changes (bandwidth)

**Identity guards:** Native Access app ≠ Komplete/Kontakt SKU matrix (still hub-walled).

---

## 3. IK Multimedia — CDN filename + Referer (NEW)

**Page:** `https://www.ikmultimedia.com/products/productmanager/` embeds  
`https://g1.ikmultimedia.com/plugins/ProductManager/ik_product_manager_1.1.15.dmg`

**HEAD with `Referer: https://www.ikmultimedia.com/products/productmanager/` → 200**  
`Last-Modified: Tue, 25 Aug 2026 16:25:00 GMT` · `Content-Length ≈ 157 328 057`  
Without Referer → **403**.

**Engine chip:** `ik_pm_cdn_head_poller`  
1. Weekly scrape PM page for `ik_product_manager_(\d+\.\d+\.\d+)\.dmg`  
2. HEAD CDN URL with Referer  
3. Accept PM app version only (`ik--product-manager`)

**Identity guards:** PM `1.1.15` ≠ AmpliTube / T-RackS SKU versions.

---

## 4. UA Connect — versioned DMG (NEW angle)

Accepted: UAD Version History suite tip **12.0 — Sept 8, 2026**.  
**New:** Connect *app* binary tip via brew-discovered URL:

`https://builds.uaudio.com/apps/UA_Connect/UA_Connect_1_10_0_3844_Mac.dmg`  
→ version **1.10.0** build **3844** · `Last-Modified: Mon, 14 Sep 2026 18:09:48 GMT`

No public `latest-mac.yml` (403 listing). Discovery = brew cask `ua-connect` JSON or download-page scrape, then HEAD.

**Engine chip:** `ua_connect_brew_url_head_poller`  
**Identity guards:** Connect app ≠ UAD DSP suite stamp; Softube-on-UAD SKUs stay on suite history oracle.

---

## 5. Spitfire — CloudFront versioned app DMG (NEW angle)

Accepted: Intercom app changelog **v3.4.17**.  
**New:** durable binary URL with semver in path (brew `spitfire-audio`):

`…/SpitfireAudio.Mac-3.4.17.dmg` · path epoch `1770184800` · HEAD 200 with Last-Modified.

**Engine chip:** `spitfire_app_brew_url_head_poller`  
**Identity guards:** app ≠ BBCSO / library SKUs (still structurally_blocked / Intercom allowlist).

---

## 6. Moog `softwareUpdate/*` tips (pattern oracle)

`https://software.moogmusic.com/softwareUpdate/{slug}` public HTML.  
Mariana tip versions include **1.2.0** (fixture `moog-mariana.html`). Sibling tips: `mf-102s`, `mf-103s`, `mf-bundle`.

Not a Lane2 hub target, but the **tip-page pattern** is what Muse should hunt for on Output / UVI / Slate when SPA shells block YAML.

**Engine chip:** `moog_softwareUpdate_tip_poller` (Lane1/adjacent); Lane2 action = replicate pattern search.

---

## 7. Softube path discipline (control / anti-pattern)

| Feed | Version | Role |
|---|---|---|
| `…/sc3/latest-mac.yml` | **3.0.5** | Current Central 3 train (accepted related) |
| `…/latest-mac.yml` (root) | **2.2.0** | Legacy Central 2 — do not prefer |
| Homebrew `softube-central` | **2.2.0** | **STALE** vs sc3 |

**Lesson:** brew is a URL discovery aid, never tip SoT; always pin exact CDN path.

---

## 8. Homebrew cask JSON — discovery only

Working casks observed:

| Cask | version | Use |
|---|---|---|
| `native-access` | 3.26.0 | Confirms NI YAML |
| `waves-central` | 17.0.4 | Confirms Waves canary |
| `ik-product-manager` | 1.1.15 | CDN URL template |
| `ua-connect` | 1.10.0,3844 | Versioned DMG |
| `spitfire-audio` | 3.4.17,… | CloudFront DMG |
| `softube-central` | 2.2.0 | **Lagging** — negative control |

Missing / error JSON: Output Hub, UVI Portal, Slate, EastWest IC, Complete Access.

---

## 9. Lane4 maintenance path — GitHub Releases (OSS)

For **Airwindows / x42 / Surge-class** manufacturers (Lane4, documented here for cross-lane maintenance):

**Problem:** unauthenticated `api.github.com` is rate-limited from this egress.

**Design (cheap):**
1. Prefer `https://github.com/{owner}/{repo}/releases.atom`
2. Conditional poll: send `If-None-Match: <etag>`; treat **304** as no-op
3. Parse Atom `<entry><title>` for tip tags; allowlist semver / `v*` 
4. Golden fixtures of Atom XML; stub if `entry` count = 0
5. Fallback: sparse conditional `GET /repos/.../releases/latest` with ETag only when Atom is empty/noisy

**Observed 2026-09-25 PT**
- `x42/sisco.lv2/releases.atom` — OK, tip **v0.9.14** (fixture saved)
- `airwindows/airwindows/releases.atom` — **empty feed** (532 B shell); do not invent tip
- `surge-synthesizer/surge/releases.atom` — noisy (`Nightly`, `last_cpp17`); needs tag allowlist

**Engine chip:** `oss_github_releases_atom_etag_poller`

---

## Negative / park (no new breakthrough)

| Vendor | Result |
|---|---|
| **Output** | Hub page SPA shell; no public `latest-mac.yml`; keep accepted Help Center trio |
| **UVI** | Portal marketing only; Falcon year canary still weak; no new CDN tip |
| **Slate** | Complete Access SPA; keep accepted VMR Zendesk RN; Hub version ≠ VMR |
| **EastWest** | `/support/updates` still best (IC 2.0 / Opus 1.6.5); no new appcast |
| **8Dio** | Still `oracle_absent`; FAQ only |
| Blind `*/latest-mac.yml` on hub roots | 404 / SPA / AccessDenied (except NI + Softube sc3) |
| iTunes Search | No desktop hub apps as Mac App Store tips |

---

## Future maintenance (cheap after breakthrough)

1. **Pollers** — YAML/canary/HEAD chips above; cadence daily (YAML/HEAD) or 2–4×/day (Waves HTML with stub backoff)
2. **Fixtures as golden tests** — sha256 bodies; assert parsers still extract expected version
3. **Stub detectors** — Incapsula 212 B, SPA “Loading…”, empty Atom, brew lag vs YAML
4. **Identity registry** — each chip writes only to hub-app identities; SKU fan-out forbidden
5. **Brew as URL oracle** — weekly refresh cask JSON → compare CDN URL/version → never accept brew alone when YAML/HEAD exists
6. **Lane4 Atom ETag store** — per-repo ETag table; 304 short-circuit; escalate to API only on empty/noisy feeds

---

## Muse implement order (this week)

1. `waves_central_canary_poller` + stub detector + DMG Last-Modified fallback  
2. `ni_access_yml_poller` (arm64 + win YAML)  
3. `ik_pm_cdn_head_poller` (Referer HEAD)  
4. `ua_connect_brew_url_head_poller` + identity split from UAD 12.0  
5. `spitfire_app_brew_url_head_poller` (corroborate Intercom)  
6. Wire Lane4 `oss_github_releases_atom_etag_poller` skeleton (x42 first; airwindows park until feed populates)
