# SSL Zendesk datalink parser — article 4849510029085 (WAVE-4)

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** SSL Native offline installers remain public on Zendesk despite Download Manager UX push. Parser must prefer **`data-link` filenames** (96 links), handle **Acoustifier dual-platform** (`1.0.18` Mac / `1.0.19` Win), tolerate folder typo **`Acuostifier`**, and apply **Mac-current** policy on splits. Complements novel SSL notes; implementable chip for Muse.
- **Context / evidence:**

### Live oracle (2026-09-25 WebFetch + API JSON)
| Field | Value |
|---|---|
| HTML | `https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-Plug-in-Downloads` |
| JSON | `https://support.solidstatelogic.com/api/v2/help_center/en-gb/articles/4849510029085.json` |
| HTTP | **200** both |
| `updated_at` | **`2026-09-22T08:57:30Z`** → **2026-09-22 01:57 PT** |
| Title | SSL Plug-in Downloads |
| `data-link` count in article body | **96 unique** |

### Live page quotes (WebFetch 2026-09-25)
> *"Please scroll down for offline installers. The offline installers available below are the latest versions."*  
> *"When owning perpetual licenses to plug-ins, we recommend the new SSL Download Manager…"*  
> *"If you are a Complete Access subscriber, please use Complete Access Hub…"*  
> Section **V2.1.12** / *"Released: 7th August 2026"* for SSL 360°  
> Table label: **`Acoustifier v1.0.18 (v1.0.19 Windows only)`**  
> Channel Strip 2 **v2.10.6**, Bus Compressor 2 **v1.9.6**, 4K G sonible add-on **v1.3.1**, SSL 360° **V2.1.12**, Meter **v1.6.6**, Meter Pro **v1.3.7**, …

### Filenames from `data-link` (Acoustifier teaching case)
| Platform | Filename (basename) | Version |
|---|---|---|
| Mac | `SSL Acoustifier macOS v1.0.18 Installer.dmg` | **1.0.18** |
| Win | `SSL Acoustifier 64-bit v1.0.19.exe` | **1.0.19** |

**Folder typo (still live in URL path):**  
`…/Plugins/Acuostifier/SSL%20Acoustifier%20macOS%20v1.0.18%20Installer.dmg`  
`…/Plugins/Acuostifier/2025.11.24%20–%20v1.0.19/SSL%20Acoustifier%2064-bit%20v1.0.19.exe`  

Parser rule: **`Acuostifier` ≡ `Acoustifier`** for path identity; **never** invent a product named Acuostifier. Prefer **filename version** over folder date stamp (`2025.11.24 – v1.0.19` folder vs `v1.0.19` file — file wins).

### Mac-current dual-platform policy (integrity/RETRACTION.md)
Precedent: catalog held **1.0.19** (Win / stale higher); Mac installer **1.0.18**; vendor later labeled split explicitly. Correct action under PROJECT-BRIEF *"mirrors what a user downloads TODAY"* with Mac as tracked platform:

| Class | Code | Action |
|---|---|---|
| Dual-platform Mac-current | `mac_current_split` | Accept **Mac** version; record Win in evidence; confidence_reasons include `mac-current-dual-platform` |
| Vendor retract | `vendor_retract` | Manufacturer confirms lower tip |
| Identity correct | `identity_correct` | Wrong product mapping fixed |

**Standing rule:** When article text documents `vA.B.C (vX.Y.Z Windows only)` → raise Mac-current immediately (watch end condition). Do **not** keep the higher Win build as catalog tip for Mac-tracked rows.

### Sample `data-link` inventory classes (96)
Representative basenames from novel notes / live body:

**360° / controllers**
- `SSL_360_v2.1.12.72214.dmg` / `.exe`
- Channel Strip 2 macOS/Win `v2.10.6`
- Bus Compressor 2 `v1.9.6`
- 360 Link `v1.4.8`, 360 Link Bus Comp `v1.3.9`
- Meter `v1.6.6`, Meter Pro `v1.3.7` — **never map Meter→Meter Pro**

**4K / sonible add-ons (dated folders)**
- `2026.09.01 - v1.3.1` → 4K G `v1.3.1`
- 4K B `v1.10.2`, 4K E `v1.7.1` (add-on) vs older non-add-on pins still linked (`v1.2.7` / `v1.6.8` / `v1.9.8`) — parser must keep **row identity** (add-on vs classic) distinct

**SSL plug-ins table**
- AutoEQ `v1.0.41`, AutoDYN `v1.0.5`, AutoBUS `v1.0.17`, Spring Verb `v1.0.4`, Digicrush `v1.1.4`, … X-Phase `v6.10.15`, Drumstrip `v6.8.2`, FlexVerb `v6.9.5`, …

---

## Implementable parser chip `ssl-zendesk-datalink-v1`

### Fetch
```
GET .../articles/4849510029085.json
IF updated_at unchanged AND body sha256 unchanged → hold-refresh verified_at only
ELSE parse(body)
```

### Extract
```
links = all data-link="https://…amazonaws.com/…/Filename.ext"
for url in links:
  path = urldecode(url)
  folder_typo_norm = path.replace('/Acuostifier/', '/Acoustifier/')
  basename = path.rsplit('/', 1)[-1]
  version = regex_first(
    r'v(\d+(?:\.\d+)+)',
    basename
  )  # prefer basename; ignore folder-only versions unless basename lacks v
  platform = 'mac' if basename matches /\.dmg|macOS/i else 'win' if /\.exe/i else 'unknown'
  product_key = normalize_product(basename, folder_typo_norm)
```

### Normalize product_key
- Strip `SSL `, `Installer`, `64-bit`, platform tokens.
- Collapse whitespace; case-fold.
- Alias map: `Acuostifier`→`Acoustifier`; `Bus Comp 2`→`Bus Compressor 2`; …
- **Banned joins:** Meter ↛ Meter Pro; Harrison Mixbus paths ↛ SSL Native rows.

### Catalog write
```
IF mac_ver and win_ver and mac_ver != win_ver:
  IF article_label matches "Windows only" OR playbook tracks Mac:
    tip = mac_ver
    evidence.win_version = win_ver
    confidence_reasons += mac-current-dual-platform
  ELSE:
    open retraction_watch class=mac_current_split
ELSE:
  tip = agreed version
Apply tip ONLY to matching plugin_id (identity guard)
```

### Cadence
- Poll JSON **2–3×/week** or when `updated_at` moves (last move 2026-09-22).
- Complements Complete Access Hub for subscribers — Hub tip ≠ per-plugin offline tip.

### Retraction hook
Every successful parse runs decrease detector (RETRACTION.md): if manufacturer tip `V < C` → watch; Acoustifier-class splits use Mac-current path, not "keep higher."

- **Recommendation:** Ship **`ssl-zendesk-datalink-v1`** as primary SSL Native version oracle; document Download Manager as UX preference only (not retraction of public S3 links).

- **If accepted, what changes in the engine:**
  - `playbooks/ssl.md` — JSON `data-link` primary; typo alias; Meter≠Meter Pro; Mac-current.
  - Retraction watch integration for dual-platform.
  - Vendor feed URL → article JSON.

- **Expected impact:** Stable high-confidence SSL greens; prevents Acoustifier false "raise to 1.0.19"; detects real retracts/splits on next `updated_at`.

- **Risks / caveats:**
  - Dualstack vs non-dualstack S3 hosts — both appear; dedupe by basename.
  - Legacy links remain on page (older 4K pins) — parse **table label pairing** or "current row" adjacency; don't tip from orphan legacy URLs without label.
  - AAX version footnote: *"AAX version number is included for reference only; AU and VST3 may differ"* — catalog tracks installer marketing version, note format skew in evidence.
  - Complete Access subscribers use Hub — offline oracle still valid for perpetual / catalog SoT.

- **Suggested first step:** Golden fixture from saved `ssl-api.json`: assert 96 links; Acoustifier Mac 1.0.18 / Win 1.0.19; typo path normalized; Meter Pro distinct.

- **New evidence since last verdict:** Live WebFetch 2026-09-25 confirms table label + dual Acoustifier; API `updated_at` 2026-09-22; 96 `data-link`s; `Acuostifier` typo still in S3 paths.


---

## Appendix A — Minimal golden fixture assertions

```
assert count(data-link) == 96
assert updated_at == "2026-09-22T08:57:30Z"  # freeze in fixture; live may move
assert basename_version("SSL Acoustifier macOS v1.0.18 Installer.dmg") == "1.0.18"
assert basename_version("SSL Acoustifier 64-bit v1.0.19.exe") == "1.0.19"
assert normalize_path_typo("/Plugins/Acuostifier/...") == "/Plugins/Acoustifier/..."
assert product_key(mac_dmg) == product_key(win_exe) == "Acoustifier"
assert tip_under_mac_current(mac="1.0.18", win="1.0.19",
                             label="Acoustifier v1.0.18 (v1.0.19 Windows only)") == "1.0.18"
assert not same_product("Meter", "Meter Pro")
```

## Appendix B — Host / URL variants
Observed hosts:
- `s3.dualstack.eu-west-2.amazonaws.com/zendesk.download.solidstatelogic.com/...`
- `s3.eu-west-2.amazonaws.com/zendesk.download.solidstatelogic.com/...`

Dedupe key = urldecoded basename (or basename + product_key). Dual hosts for same file are one installer.

## Appendix C — Decrease / watch examples (Acoustifier replay)
From RETRACTION.md teaching case:
```json
{
  "plugin_id": "ssl--ssl-acoustifier",
  "catalog": "1.0.19",
  "candidate": "1.0.18",
  "class": "mac_current_split",
  "oracle": "https://support.solidstatelogic.com/api/v2/help_center/en-gb/articles/4849510029085.json",
  "status": "resolved_accept_mac_current"
}
```
Muse should be able to replay this fixture end-to-end as a regression test whenever the parser changes.

## Appendix D — What "retraction" is not
Product pages soft-push Download Manager; offline S3 links remain and were edited **2026-09-22**. That is **not** a public wipe. Continue Zendesk JSON as SoT for perpetual / catalog tips. Complete Access Hub is separate (subscription UX).


---

## Appendix E — Parsed label tips from live article body (sample)

| Label name | Version | Note |
|---|---|---|
| 12 Mac Windows 4K G | `1.3.1` | sonible add-on |
| Mac Windows 4K B | `1.10.2` | sonible add-on |
| Mac Windows 4K E | `1.7.1` | sonible add-on |
| Mac Windows 4K G | `1.2.7` |  |
| Mac Windows 4K E | `1.6.8` |  |
| Mac Windows 4K B | `1.9.8` |  |
| Mac Windows Channel Strip 2 | `2.10.6` |  |
| Mac Windows Bus Compressor 2 | `1.9.6` |  |
| Mac Windows 360 Link | `1.4.8` |  |
| Mac Windows 360 Link Bus Comp | `1.3.9` |  |
| Mac Windows Meter | `1.6.6` |  |
| Mac Windows Meter Pro | `1.3.7` |  |
| 20 Mac Windows SSL Plug-ins Plug-in Platform AutoEQ | `1.0.41` |  |
| Mac Windows AutoDYN | `1.0.5` |  |
| Mac Windows AutoBUS | `1.0.17` |  |
| Mac Windows Spring Verb | `1.0.4` |  |
| Mac Windows Acoustifier | `1.0.18` | v1.0.19 Windows only |
| Mac Windows Digicrush | `1.1.4` |  |
| Mac Windows Gate Verb | `1.1.2` |  |
| Mac Windows Sourcerer | `1.2.1` |  |
| Mac Windows X-DynEQ | `1.2.1` |  |
| Mac Windows Module8 | `1.2.2` |  |
| Mac Windows Plate Verb | `1.2.2` |  |
| Mac Windows Fusion HF Compressor | `1.3.3` |  |
| Mac Windows Fusion Stereo Image | `1.3.3` |  |
| Mac Windows Fusion Transformer | `1.3.3` |  |
| Mac Windows Fusion Vintage Drive | `1.3.2` |  |
| Mac Windows Fusion Violet EQ | `1.3.3` |  |
| Mac Windows G3 MultiBusComp | `1.3.2` |  |
| Mac Windows SubGen | `1.2.2` |  |
| Mac Windows Blitzer | `1.2.5` |  |
| Mac Windows Drumstrip | `6.8.2` |  |
| Mac Windows FlexVerb | `6.9.5` |  |
| Mac Windows DeEss | `1.4.1` |  |
| Mac Windows Guitarstrip | `1.3.2` |  |
| Mac Windows LMC+ | `1.5.2` |  |
| Mac Windows Vocalstrip 2 | `6.9.4` |  |
| Mac Windows X-Comp | `6.8.2` |  |
| Mac Windows X-Delay | `1.4.4` |  |
| Mac Windows X-Echo | `6.8.4` |  |
| Mac Windows X-EQ 2 | `6.8.3` |  |
| Mac Windows X-Limit | `1.3.2` |  |
| Mac Windows X-Phase | `6.10.15` |  |
| Mac Windows X-Saturator | `6.9.3` |  |
| Mac Windows X-ValveComp | `6.9.2` |  |
| Mac Windows X-Gate | `1.3.2` |  |

_Parser extracted 46 labeled name/version pairs from HTML text (may include section noise; filename `data-link` remains SoT)._


## Appendix F — All 96 `data-link` basenames (SoT inventory)

| # | Installer basename |
|---:|---|
| 1 | `Harrison 32Classic 64-bit v2.0.20.exe` |
| 2 | `Harrison 32Classic macOS v2.0.20 Installer.dmg` |
| 3 | `SSL 360 Link 64-bit v1.4.8.exe` |
| 4 | `SSL 360 Link Bus Compressor 64-bit v1.3.9.exe` |
| 5 | `SSL 360 Link Bus Compressor macOS v1.3.9 Installer.dmg` |
| 6 | `SSL 4K B 64-bit v1.10.2.exe` |
| 7 | `SSL 4K B 64-bit v1.9.8.exe` |
| 8 | `SSL 4K B macOS v1.10.2 Installer.dmg` |
| 9 | `SSL 4K B macOS v1.9.8 Installer.dmg` |
| 10 | `SSL 4K E 64-bit v1.6.8.exe` |
| 11 | `SSL 4K E 64-bit v1.7.1.exe` |
| 12 | `SSL 4K E macOS v1.6.8 Installer.dmg` |
| 13 | `SSL 4K E macOS v1.7.1 Installer.dmg` |
| 14 | `SSL 4K G 64-bit v1.2.7.exe` |
| 15 | `SSL 4K G 64-bit v1.3.1.exe` |
| 16 | `SSL 4K G macOS v1.2.7 Installer.dmg` |
| 17 | `SSL 4K G macOS v1.3.1 Installer.dmg` |
| 18 | `SSL Acoustifier 64-bit v1.0.19.exe` |
| 19 | `SSL Acoustifier macOS v1.0.18 Installer.dmg
` |
| 20 | `SSL Blitzer 64-bit v1.2.5.exe` |
| 21 | `SSL Blitzer macOS v1.2.5 Installer.dmg` |
| 22 | `SSL Bus Compressor 2 64-bit v1.9.6.exe` |
| 23 | `SSL Bus Compressor 2 macOS v1.9.6 Installer.dmg` |
| 24 | `SSL Channel Strip 2 64-bit v2.10.6.exe` |
| 25 | `SSL Channel Strip 2 macOS v2.10.6 Installer.dmg` |
| 26 | `SSL DeEss 64-bit v1.4.1.exe` |
| 27 | `SSL DeEss macOS v1.4.1 Installer.dmg` |
| 28 | `SSL Digicrush 64-bit v1.1.4.exe` |
| 29 | `SSL Digicrush macOS v1.1.4 Installer.dmg
` |
| 30 | `SSL Drumstrip 64-bit v6.8.2.exe` |
| 31 | `SSL Drumstrip macOS v6.8.2 Installer.dmg` |
| 32 | `SSL FlexVerb 64-bit v6.9.5.exe` |
| 33 | `SSL FlexVerb macOS v6.9.5 Installer.dmg` |
| 34 | `SSL Fusion HF Compressor 64-bit v1.3.3.exe` |
| 35 | `SSL Fusion HF Compressor macOS v1.3.3 Installer.dmg` |
| 36 | `SSL Fusion Stereo Image 64-bit v1.3.3.exe` |
| 37 | `SSL Fusion Stereo Image macOS v1.3.3 Installer.dmg` |
| 38 | `SSL Fusion Transformer 64-bit v1.3.3.exe` |
| 39 | `SSL Fusion Transformer macOS v1.3.3 Installer.dmg` |
| 40 | `SSL Fusion Vintage Drive 64-bit v1.3.2.exe` |
| 41 | `SSL Fusion Vintage Drive macOS v1.3.2 Installer.dmg` |
| 42 | `SSL Fusion Violet EQ 64-bit v1.3.3.exe` |
| 43 | `SSL Fusion Violet EQ macOS v1.3.3 Installer.dmg` |
| 44 | `SSL G3 MultiBusComp 64-bit v1.3.2.exe` |
| 45 | `SSL G3 MultiBusComp macOS v1.3.2 Installer.dmg` |
| 46 | `SSL GateVerb 64-bit v1.1.2.exe` |
| 47 | `SSL GateVerb macOS v1.1.2 Installer.dmg
` |
| 48 | `SSL Guitarstrip 64-bit v1.3.2.exe` |
| 49 | `SSL Guitarstrip macOS v1.3.2 Installer.dmg` |
| 50 | `SSL LMC+ 64-bit v1.5.2.exe` |
| 51 | `SSL LMC+ macOS v1.5.2 Installer.dmg` |
| 52 | `SSL Meter 64-bit v1.6.6.exe` |
| 53 | `SSL Meter Pro 64-bit v1.3.7.exe` |
| 54 | `SSL Meter Pro macOS v1.3.7 Installer.dmg` |
| 55 | `SSL Meter macOS v1.6.6 Installer.dmg` |
| 56 | `SSL Module8 64-bit v1.2.2.exe` |
| 57 | `SSL Module8 macOS v1.2.2 Installer.dmg
` |
| 58 | `SSL PlateVerb 64-bit v1.2.2.exe
` |
| 59 | `SSL PlateVerb macOS v1.2.2 Installer.dmg
` |
| 60 | `SSL Sourcerer 64-bit v1.2.1.exe` |
| 61 | `SSL Sourcerer macOS v1.2.1 Installer.dmg
` |
| 62 | `SSL SpringVerb 64-bit v1.0.4.exe` |
| 63 | `SSL SpringVerb macOS v1.0.4 Installer.dmg
` |
| 64 | `SSL SubGen 64-bit v1.2.2.exe` |
| 65 | `SSL SubGen macOS v1.2.2 Installer.dmg` |
| 66 | `SSL Vocalstrip 2 64-bit v6.9.4.exe` |
| 67 | `SSL Vocalstrip 2 macOS v6.9.4 Installer.dmg` |
| 68 | `SSL X-Comp 64-bit v6.8.2.exe` |
| 69 | `SSL X-Comp macOS v6.8.2 Installer.dmg` |
| 70 | `SSL X-Delay 64-bit v1.4.4.exe` |
| 71 | `SSL X-Delay macOS v1.4.4 Installer.dmg` |
| 72 | `SSL X-DynEQ 64-bit v1.2.1.exe` |
| 73 | `SSL X-DynEQ macOS v1.2.1 Installer.dmg
` |
| 74 | `SSL X-EQ 2 64-bit v6.8.3.exe` |
| 75 | `SSL X-EQ 2 macOS v6.8.3 Installer.dmg` |
| 76 | `SSL X-Echo 64-bit v6.8.4.exe` |
| 77 | `SSL X-Echo macOS v6.8.4 Installer.dmg` |
| 78 | `SSL X-Gate 64-bit v1.3.2.exe` |
| 79 | `SSL X-Gate macOS v1.3.2 Installer.dmg` |
| 80 | `SSL X-Limit 64-bit v1.3.2.exe` |
| 81 | `SSL X-Limit macOS v1.3.2 Installer.dmg` |
| 82 | `SSL X-Phase 64-bit v6.10.15.exe` |
| 83 | `SSL X-Phase macOS v6.10.15 Installer.dmg` |
| 84 | `SSL X-Saturator 64-bit v6.9.3.exe` |
| 85 | `SSL X-Saturator macOS v6.9.3 Installer.dmg` |
| 86 | `SSL X-ValveComp 64-bit v6.9.2.exe` |
| 87 | `SSL X-ValveComp macOS v6.9.2 Installer.dmg` |
| 88 | `SSL autoBUS 64-bit v1.0.17.exe` |
| 89 | `SSL autoBUS macOS v1.0.17 Installer.dmg
` |
| 90 | `SSL autoDYN 64-bit v1.0.5.exe` |
| 91 | `SSL autoDYN macOS v1.0.5 Installer.dmg
` |
| 92 | `SSL autoEQ 64-bit v1.0.41.exe` |
| 93 | `SSL autoEQ macOS v1.0.41 Installer.dmg
` |
| 94 | `SSL_360_v2.1.12.72214.dmg` |
| 95 | `SSL_360_v2.1.12.72214.exe` |
| 96 | `data-link` |
