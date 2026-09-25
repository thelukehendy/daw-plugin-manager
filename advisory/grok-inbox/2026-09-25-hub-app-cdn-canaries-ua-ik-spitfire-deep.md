# Hub-app CDN / path canaries — UA Connect, IK PM, Spitfire (NEW angles)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot (wave 6)
- **Problem:** Cheap binary-tip canaries for hub apps without login; never stamp onto plugin SKUs.

## 1. UA Connect versioned DMG
- URL: `https://builds.uaudio.com/apps/UA_Connect/UA_Connect_1_10_0_3844_Mac.dmg`
- Tip from filename: **1.10.0** build **3844**
- HEAD 2026-09-25: `Last-Modified: Mon, 14 Sep 2026 18:09:48 GMT`, Content-Length ~415MB
- Discovery: Homebrew cask URL or download-page scrape (no public `latest-mac.yml`; listing 403)
- **Guard:** Connect app ≠ UAD Version History suite **12.0** (accepted suite oracle stays separate)

## 2. IK Product Manager CDN + Referer
- Page embeds `https://g1.ikmultimedia.com/plugins/ProductManager/ik_product_manager_1.1.15.dmg`
- HEAD **with** `Referer: https://www.ikmultimedia.com/products/productmanager/` → 200; `Last-Modified: Tue, 25 Aug 2026 …`
- Without Referer → **403**
- Tip **1.1.15** already known; **new** = durable HEAD poller + Referer requirement
- **Guard:** PM ≠ AmpliTube/Syntronik SKU stamp

## 3. Spitfire Audio app CloudFront path
- Brew-tracked URL embeds semver: `SpitfireAudio.Mac-3.4.17.dmg` → **3.4.17**
- Corroborates accepted Intercom changelog tip; binary path is the maintenance-friendly oracle
- **Guard:** App tip ≠ library/soundset greens

### Shared chip pattern
`hub_cdn_filename_poller`: discover URL → parse semver from basename → HEAD (Referer if required) → observe hub_app only → last-good retention on soft failure.

- **Recommendation:** Three small pollers; pair with Waves downloads canary + NI YAML as hub-app health pack.
- **New evidence:** Live HEAD/YAML/HTML fixtures under lane2.
