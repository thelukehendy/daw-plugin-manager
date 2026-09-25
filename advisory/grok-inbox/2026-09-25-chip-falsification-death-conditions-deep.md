# Chip falsification / death conditions — dense matrix (Wave 8 Ask 3)

- **Date:** 2026-09-25 PT
- **Advisor:** Grok Bot (advisor-only; no catalog writes / no git / no telemetry / no logins)
- **Scope:** Pre-register death conditions for accepted wave-6/7 oracle chips so Muse can **maintain or kill** them. A chip without a stated death condition is unmaintainable.
- **Live re-check:** 2026-09-25 ~13:02 PT (public URLs only).
- **Negative fixtures:** `fixtures/wave8/falsify/<vendor>/` (one dir per vendor; contracts + tiny stubs). Golden bodies remain under wave7 chip packs — do not re-ship bulk HTML here.

## Severity legend

| Code | Meaning | Engine action |
|---|---|---|
| **KILL** | Oracle identity broken | Disable chip; retain last-good; alert `chip_dead` |
| **PARK** | Transport/shape flap | `fetch_degraded`; no tip write; keep last-good |
| **DEMOTE** | Signal weaker / split / ambiguous | Amber max; no green raise |
| **RETRACT-WATCH** | Tip moved *down* or identity contaminated | Open retraction watch; never decrease on fetch failure |

## Global MUST-NOT (every chip)

1. Never write on `fetch_degraded` / stub / soft-200 / WAF body.
2. Never invent tips between silent oracle events.
3. Never stamp **hub_app** tips onto plugin SKUs (and never stamp suite/generation onto every SKU).
4. Never decrease catalog version solely because a parse failed or a negative control "looked different."
5. If death fires: **do not** "helpfully" fall back to brew/KVR/reseller as SoT (alert-only corroboration at most).

---

## MATRIX — eight named chips (+ two related accepted oracles)

### 1) Moog `softwareUpdate/{slug}` — `moog-softwareupdate-walk-v1`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | `GET …/softwareUpdate/mf-106s` stays HTTP 200 **without** any `All Formats v\d+` match. Live 2026-09-25: 200 / ~15KB / **0** `All Formats` hits. Fixture contract: `fixtures/wave8/falsify/moog/mf-106s.negative.contract.json`. If mf-106s suddenly gains real buttons → **investigate ship**, do not silently treat all soft-200 detectors as broken. |
| **Page/file shape must not change** | Tip pages are HTML store shells with submit buttons labeled `{SLUG} {macOS\|Windows} All Formats v{semver}`. Healthy tip body typically ≥ ~8–18KB **and** ≥1 `All Formats v` match. Shape death: SPA/JSON API migration; button text drops `All Formats v`; checkout moved behind auth; slug path 404/301 to marketing home without buttons. |
| **Version / parse pattern that invalidates** | Rule: `(?P<label>[A-Za-z0-9-]+)\s+(?P<os>macOS\|Windows)\s+All Formats v(?P<ver>\d+\.\d+\.\d+)`. Invalidate if: zero matches; Mac≠Win without documented split; version scheme becomes `v1.3` / `1.3.0-build` / calendar `2026.09`; label no longer equals slug product token; changelog `<p class="sub-header">` disagrees with button tip. |
| **Observations → retract / park / demote** | **PARK:** HTTP≠200, or 200 with 0 `All Formats` on a previously-tip slug (soft-200). **DEMOTE:** Mac≠Win. **RETRACT-WATCH:** tip semver strictly **below** last-good on same slug with manufacturer evidence. **KILL:** site-wide loss of `All Formats v` control across ≥3 tip slugs in one sweep. |
| **MUST NOT if death fires** | Do **not** invent `mf-106s` as a product; do **not** cross-stamp Mariana ↔ MF-*S; do **not** copy a neighbor slug tip onto a soft-200 slug; do **not** treat HTTP 200 alone as healthy. |

**Live tip anchors (2026-09-25):** `mf-105s` → **1.3.0** (Mac+Win buttons); `mariana` → **1.2.0**; negative `mf-106s` empty.

---

### 2) Sonnox Restore freeze + Pro-Codec RN — `sonnox-rn-freeze`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Wrong / missing RN path yields storefront shell **without** tip `<h2>` semver after product “Release Notes” `<h3>` (`fixtures/wave8/falsify/sonnox/wrong-rn.negative.contract.json`). Farewell URL 404 ⇒ **do not invent** `discontinued_frozen`. |
| **Page/file shape must not change** | Discovery: `sonnox.com/docs` still exposes “View Release Notes” → BigCommerce `…/content/plugins/release-notes/*.html`. RN tip shape: first `<h2>semver</h2>` after RN `<h3>`. Farewell article still names DeBuzzer / DeClicker / DeNoiser. Shape death: docs index loses RN links; RN host moves off `store-8pfrvbtcba.mybigcommerce.com` without redirect map; tip moves to PDF/login; H2 replaced by non-semver marketing headers. |
| **Version / parse pattern that invalidates** | Rule: first `<h2[^>]*>\s*(?P<ver>\d+\.\d+(?:\.\d+)?)\s*</h2>` after RN H3. Invalidate if: leading H2 is date-only / “What’s new”; version becomes `3.01` vs `3.1.0` scheme flip without note; multiple H2 candidates and first ≠ product tip; Pro-Codec file rename away from `SonnoxFPCRel.html` without docs-index discovery. |
| **Observations → retract / park / demote** | **PARK:** docs/RN fetch degraded or wrong-RN negative fails open (false tip). **DEMOTE:** farewell language softens / removed while Restore still listed as buyable → freeze posture uncertain. **KILL:** farewell 404 **and** RN pages gone → cannot claim discontinued; park Restore rows rather than invent. **RETRACT-WATCH:** RN tip H2 drops below freeze tip with vendor evidence (rare for discontinued). |
| **MUST NOT if death fires** | Do **not** stamp Restore **3.01.0** onto Pro-Codec / Oxford EQ / other Sonnox SKUs; do **not** invent `discontinued_frozen` from silence; do **not** hardcode RN URLs long-term if docs-index discovery dies — park instead of guessing paths. |

**Live anchors:** Restore trio RN tip **3.01.0**; Pro-Codec **4.00.0**; farewell still references DeBuzzer/DeClicker/DeNoiser (2026-09-25).

---

### 3) NI Native Access `latest-mac.yml` — `ni-electron-updater-yml`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Wrong key returns S3/XML `NoSuchKey` (or HTML), **never** parseable `version:`+`files:` — `fixtures/wave8/falsify/ni/wrong-path.NoSuchKey.xml`. Live wrong path 2026-09-25: HTTP 404 + `NoSuchKey`. |
| **Page/file shape must not change** | Electron-builder YAML at `na-update.native-instruments.com/{arm64/,}latest-mac.yml` and `latest.yml`. Must contain multiline `^version:\s*` and `^files:\s*`. Shape death: auth wall / HTML login; path rename; YAML → JSON; CDN returns empty 200; Cloudflare challenge HTML. |
| **Version / parse pattern that invalidates** | Health: `(?m)^version:\s*(?P<ver>\d+\.\d+\.\d+)\s*$` **AND** `(?m)^files:\s*$`. Invalidate if: `version: "3.26"` (field count change); channel tags `3.26.0-beta`; arm64≠intel≠win without recording split; primary tip taken from `path:` filename disagreeing with `version:`; treating `sha512` as version. |
| **Observations → retract / park / demote** | **PARK:** body matches NoSuchKey/HTML/truncated / missing `files:` → `fetch_degraded`, retain last-good. **DEMOTE:** arch split. **RETRACT-WATCH:** YAML `version` strictly below last-good with matching releaseDate regression. **KILL:** all three feeds simultaneously non-YAML for ≥2 consecutive healthy network sweeps. |
| **MUST NOT if death fires** | Emit **only** against Native Access **hub_app**. Do **not** stamp Access tip onto Komplete/Kontakt/SKU matrix; do **not** HEAD zip/dmg except on tip change; do **not** clear last-good on degraded fetch. |

**Live anchors:** arm64/intel/win all `version: 3.26.0` (2026-09-25).

---

### 4) Waves Central downloads canary — `waves-downloads-canary`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Incapsula soft stub (~212B) with `_Incapsula_Resource` / `Incapsula` **must be rejected** — `fixtures/wave8/falsify/waves/incapsula-stub.html`. Detector: `len < 500` OR Incapsula markers OR missing Mac canary → degraded. |
| **Page/file shape must not change** | Full `/downloads` HTML carries `Waves Central` … `Mac: V{ver} \| {Mon DD, YYYY}` … `Windows: V{ver} \| …` within a bounded window. Live healthy ~114KB, V17.0.4 / Aug 02, 2026 (this egress 2026-09-25). Shape death: canary moved to React island not in static HTML; label renames (`Waves Central App`); date format changes; page permanently stubbed from automation egress. |
| **Version / parse pattern that invalidates** | Primary regex requiring Mac+Win canary pair. Invalidate if: only one platform line; `V17` without minor; date becomes ISO-only and regex fails; Central version diverges from DMG `Last-Modified` by months without vendor note; parser accidentally reads offline-installer pin (`16.7.2`) as tip. |
| **Observations → retract / park / demote** | **PARK:** Incapsula/stub after one retry → alert-only DMG LM / brew; **keep last-good**. **DEMOTE:** Mac≠Win Central. **RETRACT-WATCH:** canary version strictly below last-good on a non-stub body. **KILL:** canary regex fails on consecutive **non-stub** full pages (layout death). Related: Waves RN Incapsula oracle death is independent — see §9. |
| **MUST NOT if death fires** | `waves--waves-central` **hub_app ONLY**. Do **not** stamp V17 / Central tip onto plugin SKUs; do **not** treat generation “Across-the-board … V17” as per-SKU version; do **not** promote brew cask to SoT. |

---

### 5) UA Connect versioned DMG — `ua-connect-dmg`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | `…/UA_Connect/latest-mac.yml` (and invented basenames) stay **403** — proves there is **no** public electron-updater listing. Fixture: `fixtures/wave8/falsify/ua/latest-mac.yml.403.hdr`. Live 2026-09-25: 403. |
| **Page/file shape must not change** | Tip comes from **discovered** versioned DMG basename `UA_Connect_{maj}_{min}_{pat}_{build}_Mac.dmg` via brew cask `ua-connect` or download-page scrape, then HEAD for LM. Shape death: brew URL unversioned; basename drops build; path moves off `builds.uaudio.com`; DMG behind auth. |
| **Version / parse pattern that invalidates** | `UA_Connect_(?P<maj>\d+)_(?P<min>\d+)_(?P<pat>\d+)_(?P<build>\d+)_Mac\.dmg` → `version=maj.min.pat`. Invalidate if: separators change (`-` vs `_`); build omitted; four-part semver in filename; inventing basename without brew/page discovery; reading UAD Version History **12.0** as Connect tip. |
| **Observations → retract / park / demote** | **PARK:** brew discover fails + page has no versioned DMG; HEAD 403/404 on previously-good URL without rediscovery. **DEMOTE:** brew `version` string scheme change (`1.10.0,3844` → opaque). **RETRACT-WATCH:** discovered version/build tuple strictly below last-good. **KILL:** negative control flips to **200 YAML** with a different version than DMG (feed fork) — stop until human picks SoT. |
| **MUST NOT if death fires** | UA Connect **hub_app only**. Do **not** stamp Connect tip onto UAD plugin/suite **12.0**; do **not** invent DMG basenames; do **not** treat 403 YAML as “empty tip 0.0.0”. |

**Live anchors:** brew `1.10.0,3844` → `UA_Connect_1_10_0_3844_Mac.dmg`.

---

### 6) IK Product Manager CDN + Referer — `ik-pm-cdn-referer`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | HEAD CDN DMG **without** `Referer: https://www.ikmultimedia.com/products/productmanager/` → **403**. With Referer → **200** + `Last-Modified`. Live 2026-09-25 confirmed 403/200. Contract: `fixtures/wave8/falsify/ik/pm-dmg-noref.negative.contract.json`. |
| **Page/file shape must not change** | Product Manager page embeds `https://g1.ikmultimedia.com/plugins/ProductManager/ik_product_manager_{semver}.dmg`. Shape death: host leaves `g1.ikmultimedia.com`; filename drops semver; page becomes JS-only without URL in HTML; Referer allowlist expands/removes (403→200 without Referer is a **detector death**, not a free pass). |
| **Version / parse pattern that invalidates** | Page regex `ik_product_manager_(?P<ver>\d+\.\d+\.\d+)\.dmg`. Invalidate if: 4-part build; `latest.dmg`; query-string only versions; weekly page scrape finds **multiple** distinct semvers without a clear current; PDF host canary used as SoT. |
| **Observations → retract / park / demote** | **PARK:** page has no DMG URL; HEAD 403 **with** correct Referer; wrong version path 404. **DEMOTE:** Referer requirement disappears (negative control fails) → re-verify authenticity before trusting anonymous CDN. **RETRACT-WATCH:** page tip < last-good. **KILL:** CDN 403 with Referer across ≥2 sweeps after page still shows URL (policy change). |
| **MUST NOT if death fires** | Product Manager **hub_app only**. Do **not** stamp onto AmpliTube / Syntronik / T-RackS / SampleTank SKUs; do **not** omit Referer and treat 403 as “no update”; do **not** reopen hub-walled IK SKU grind via PM tip. |

**Live anchors:** `ik_product_manager_1.1.15.dmg`, LM `Tue, 25 Aug 2026 16:25:00 GMT`.

---

### 7) Spitfire Audio CloudFront path semver — `spitfire-cloudfront-path`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Wrong semver path `SpitfireAudio.Mac-0.0.0.dmg` (same epoch prefix) → **403**. Contract: `fixtures/wave8/falsify/spitfire/wrong-semver.negative.contract.json`. |
| **Page/file shape must not change** | Brew cask `spitfire-audio` discovers CloudFront URL `…/p/files/lm/{epoch}/mac/SpitfireAudio.Mac-{semver}.dmg`. Shape death: brew URL host/path redesign; epoch folder expires (403) without brew refresh; basename loses semver; app renamed. |
| **Version / parse pattern that invalidates** | `SpitfireAudio\.Mac-(?P<ver>\d+\.\d+\.\d+)\.dmg`; brew may be `3.4.17,1770184800` — take semver before comma. Invalidate if: brew version opaque; path semver ≠ brew semver; Windows-only path used for Mac tip; treating epoch as version. |
| **Observations → retract / park / demote** | **PARK:** HEAD 403 on discovered URL → **rediscover via brew**, do not invent epoch. **DEMOTE:** brew unavailable and only stale cached URL exists. **RETRACT-WATCH:** new brew semver < last-good. **KILL:** wrong-semver negative starts returning 200 (unsigned/open bucket) — integrity model broken. |
| **MUST NOT if death fires** | Spitfire Audio **app** hub_app only. Do **not** green library/soundset rows from app tip; do **not** forge CloudFront paths; do **not** keep polling a 403 URL without rediscovery. |

**Live anchors:** tip **3.4.17** on epoch `1770184800` (brew+HEAD).

---

### 8) KORG Collection news-title feed — `korg_collection_news_tip_poller`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Hardware / Editor / Gadget / demo headlines that contain `version X.Y` **must not** map to Collection plugin_ids. Golden reject set: `fixtures/wave8/falsify/korg/hardware-news-false-positive.examples.json` (KRONOS OS, Keystage, Pa5X, microKORG2 hardware, wavestate/modwave **Editor**, Gadget, Switch, “demo version”). Silent news ⇒ rows stay `hub_walled`. |
| **Page/file shape must not change** | Collection page news list: `<dt>YYYY.MM.DD</dt><dd><a>… version X.Y…</a>`. Raise path: title tip → allowlisted product token → **article body confirms** tip (TRINITY pattern). Shape death: news widget JS-only; titles drop “version”; Software Pass-only tips with empty public news; locale path `/us/` removed without mirror. |
| **Version / parse pattern that invalidates** | Title `(?i)version\s+(\d+\.\d+(?:\.\d+)?)` plus product token → `korg--*` allowlist. Invalidate if: headline-only raise without body confirm promoted to green; bundle blurb “latest updates released” parsed as per-SKU tips; Editor/Librarian version stamped onto `*-native`; demo marketing copy parsed as tip; calendar `2025.12.05` misread as semver. |
| **Observations → retract / park / demote** | **PARK / default:** no matching headlines → **do not invent**; keep hub_walled + Software Pass. **DEMOTE:** headline tip without body agreement → amber max. **RETRACT-WATCH:** later article corrects tip downward. **KILL:** allowlist join table missing/stale causing hardware OS tips to hit plugin rows — disable chip until map fixed. |
| **MUST NOT if death fires** | Do **not** treat this as Software Pass replacement; do **not** stamp hub/news tip onto unrelated Collection SKUs; do **not** invent tips between events; do **not** accept hardware companion Editor versions as plugin tips. |

**Live anchors:** collection news still lists `KC - TRINITY version 1.1.0` (2025.12.05) + non-version marketing rows (Filter Ark, Splice, sales).

---

### 9) Related — Softube Central `sc3` YAML — `softube-central-sc3-yaml-v1`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Root trap `…/softubecentral/latest-mac.yml` (no `sc3/`) remains a **different, stale** channel — live 2026-09-25: root **2.2.0** vs sc3 **3.0.5**. Fixture: `fixtures/wave8/falsify/softube/root-latest-mac.trap.yml`. CI canary **must fail** if chip ever reads root/brew as SoT. |
| **Page/file shape must not change** | `sc3/latest-mac.yml` + `sc3/latest.yml` electron-builder YAML. Shape death: `sc3/` → `sc4/` rename (404); YAML→HTML; Known Issues page loses CDN links. |
| **Version / parse pattern that invalidates** | `^version:\s*['\"]?([0-9.]+)`. Invalidate if: Mac≠Win without amber split; tip taken from root; brew livecheck (`2.2.0`) used as SoT; Central tip confused with suite RN **2.6.x**. |
| **Observations → retract / park / demote** | **PARK:** sc3 404 → HTML Known Issues fallback only; no invent `sc4`. **DEMOTE:** Mac/Win split. **KILL:** chip observes tip from blocklisted non-sc3 URL. |
| **MUST NOT if death fires** | Softube Central **hub_app only**. Do **not** stamp onto plugins; do **not** prefer Homebrew; do **not** equate Central↔suite RN. |

---

### 10) Related — Waves Incapsula RN oracle — `waves-rn-oracle-v1`

| Axis | Death condition |
|---|---|
| **Negative control (must keep passing)** | Datacenter/light curl Incapsula ~212B stub must never parse as RN success (same stub family as §4). Browser/Playwright path required. |
| **Page/file shape must not change** | RN sections: dated headers, generation bulk lines, Central/app builds, New Plugin, Fixed-in/Hotfix. Shape death: permanent stub despite browser; section taxonomy rename breaking diff kinds. |
| **Version / parse pattern that invalidates** | Treating `Across-the-board … VN` as per-SKU `version=VN`. Any parser that iterates catalog setting `plugin.version=V17` is **already dead on arrival**. |
| **Observations → retract / park / demote** | **PARK:** `fetch_degraded` → keep last snapshot; suppress publishes. **DEMOTE:** inventory-only deltas. **KILL:** browser path also stubbed for ≥2 scheduled runs. |
| **MUST NOT if death fires** | Do **not** stamp generation onto every SKU; do **not** clear last good snapshot; do **not** grind new API guesses from research IPs. |

---

## Cross-chip death quick-ref (one-liners)

| Chip | Death one-liner |
|---|---|
| Moog softwareUpdate/{slug} | Soft-200 without `All Formats v` (mf-106s NC) OR site-wide loss of that control → park; never cross-stamp slugs. |
| Sonnox RN freeze | Missing tip H2 / farewell 404 → park; never invent discontinued; never Restore→other SKU stamp. |
| NI latest-mac.yml | Non-YAML / NoSuchKey / missing `files:` → degraded keep last-good; hub_app only. |
| Waves downloads canary | Incapsula/stub or missing Mac canary → alert-only; never V17 SKU stamp. |
| UA Connect DMG | Invented basename or 403 YAML flipped to competing feed → kill/park; never stamp UAD 12.0. |
| IK PM CDN Referer | HEAD 403 **with** Referer or page loses versioned DMG → park; hub_app only. |
| Spitfire CloudFront path | Path 403 without brew rediscovery / open-bucket NC failure → park/kill; app tip ≠ libraries. |
| KORG news-title feed | Hardware/Editor/demo title mapped to plugin OR silent news invent → kill/park; not Software Pass. |
| Softube sc3 YAML | Reading root/`2.2.0` brew trap as SoT → kill canary; hub_app only. |
| Waves Incapsula RN | Stub parsed as success OR generation stamped to all SKUs → kill rule. |

## Operator wiring checklist

1. Load negative contracts from `fixtures/wave8/falsify/<vendor>/` into chip CI (assert NC still fails closed).
2. On any **KILL/PARK**, emit `chip_dead|fetch_degraded` with oracle URL + sha/bytes; **retain last-good**.
3. On **RETRACT-WATCH**, follow vendor-retraction protocol (manufacturer evidence; no decrease on fetch failure).
4. Re-fetch goldens only after operator approval — this advisory does not commit catalog/git.

**Ready for Muse to attach death monitors before wiring tips green.**
