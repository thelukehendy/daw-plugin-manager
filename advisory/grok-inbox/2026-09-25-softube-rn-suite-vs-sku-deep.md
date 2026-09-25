# Softube RN suite vs SKU — critical anti-pattern

- **Date:** 2026-09-25
- **Advisor:** Grok Bot
- **Problem:** New integrity/advisory catch (ties backlog #2 hub-walled + #5 retraction identity guards). Softube public release-notes index exposes a **suite/installer train version** that must never be stamped onto named product SKUs. CRITICAL anti-pattern.
- **Context / evidence:**
  - Oracle: https://www.softube.com/release-notes — plain curl HTTP 200 ~79 KB (control proving egress OK; contrast Waves Incapsula).
  - Index tip 2026-09-24 PT: **Release Notes for version 2.6.42 (Released on August 21th, 2026)**.
  - Article body quote (live):
    > **Monoment Bass, Parallels, and Statement Lead:** Fixed an issue that caused the plug-ins to fail to load and could crash the host in version 2.6.41.
  - That sentence means those three SKUs were **affected by suite build 2.6.41** and fixed in **suite 2.6.42**. It does **NOT** authorize `observed_version=2.6.42` on Monoment Bass / Parallels / Statement Lead product rows.
  - Suite version history sample (`advisory-deep/novel/softube-suite-versions.txt`): 2.6.42 (Aug 21 2026) … back through 2.5.97 (Dec 17 2024) — dense train, not per-SKU marketing versions.
  - portal_app: **Softube Central** covers **164** plugins — manager is the download path; RN is a public signal, not a per-SKU matrix.
  - Related NEW oracle (do use): Softube Central electron-builder YAML
    - `https://softubestorage.b-cdn.net/softubecentraldata/softubecentral/sc3/latest-mac.yml` → `version: 3.0.5`
    - Win twin `sc3/latest.yml` → 3.0.5
  - Homebrew **trap**: formulae cask still tracks pre-`sc3` channel `2.2.0` via non-sc3 `latest-mac.yml` — using brew as oracle would **regress** Central 3.0.5 → 2.2.0.
  - Plugin installers page login-walled; no anonymous CDN filename leak for per-plugin SKUs.

- **Recommendation:**
  Treat Softube RN as a **suite train + named-product signal list**, never as default `latestVersion` for named products unless a separate per-product oracle agrees.

  ## Correct uses of Softube RN

  1. **hub_app freshness** for Softube Central / suite train telemetry (identity_kind hub_app / portal) — or prefer `sc3/*.yml` for Central **app** row.
  2. **Signal list** of which SKUs need a per-product re-check (extract product names from RN bullets).
  3. Scope detection: if article says “All plug-ins” (or equivalent) → suite-wide narrative only; still do **not** invent per-SKU marketing versions from the suite number alone without policy decision.

  ## Forbidden uses (anti-patterns)

  | Anti-pattern | Why wrong | Example |
  |---|---|---|
  | Stamp suite `2.6.42` onto Monoment Bass / Parallels / Statement Lead | Named products in FIXED list ≠ their SKU version | Live 2.6.42 body |
  | Stamp suite onto every Softube plugin on index tip day | Creates false churn + wrong upgrade advice | Any “raise all Softube to 2.6.42” chip |
  | Treat “fixed in 2.6.41” as product version 2.6.41 | That is the broken suite build reference | Same sentence |
  | Use Homebrew Softube Central as tip | Tracks stale non-sc3 channel 2.2.0 | brew API vs sc3 3.0.5 |
  | Map Softube UAD-* DSP rows from Softube RN | UA DSP bundle is separate oracle (UAD Version History) | Cross-vendor stamp |

  ## Chip sketch `softube-rn-watch-v1`

  ```
  GET https://www.softube.com/release-notes
  parse index → list of {suite_version, date, article_url}
  if tip suite_version or content_sha256 changed:
    GET newest article
    extract:
      - suite_version / date
      - mentioned_product_names[] from bold headings / “Fixed” lines
      - scope_flag: all_plugins | named_list | unknown
    UPDATE Softube Central / suite hub_app current ONLY if policy maps suite→hub
       (prefer sc3 YAML for Central app version — distinct from plugin suite 2.6.x)
    ENQUEUE per-product digs for mentioned_product_names
       with note "softube-rn-signal suite=<ver>" — digs must find independent oracle
    NEVER write observed_version = suite_version onto product rows from this path
  ```

  ## Central app vs plugin suite (keep distinct)

  | Track | Tip (2026-09-24) | Source | Apply to |
  |---|---|---|---|
  | Softube Central **app** | **3.0.5** (2026-06-24) | `sc3/latest-mac.yml` / `sc3/latest.yml` | hub_app Softube Central only |
  | Plugin **suite train** | **2.6.42** (Aug 21, 2026) | softube.com/release-notes | Signal + optional suite/hub narrative field — **not** SKU `version` |
  | Per-plugin SKU | varies / often hub-only | Central login or future public per-product | Product rows only with first-hand SKU evidence |

  ## RN index parse regex (illustrative)

  ```regex
  RN_INDEX = (?i)Release Notes for version\s+(\d+(?:\.\d+)+)\s*\(Released on\s+([^)]+)\)
  FIXED_PRODUCTS = (?is)<b>([^:<]+):</b>\s*<p>?Fixed
  # or plain text: "Monoment Bass, Parallels, and Statement Lead:"
  ```

  Normalize product names against catalog Softube plugins; unmatched names → research_attempts note, no write.

  ## Acceptance tests

  1. Fixture 2.6.42 body → suite event recorded; **zero** raises for Monoment Bass / Parallels / Statement Lead with version 2.6.42.
  2. Mentioned names appear on a **re-check enqueue** list only.
  3. Central app observation uses **3.0.5** from sc3 YAML, never 2.6.42, never Homebrew 2.2.0.
  4. Softube UAD-* rows not touched by Softube RN chip.

- **If accepted, what changes in the engine:**
  - Playbook `playbooks/softube.md`: hard rule “suite RN ≠ SKU version”; document Monoment/Parallels/Statement Lead as teaching fixture.
  - Identity-guard checklist (shared with retraction): no suite→component stamp.
  - Optional `softube_suite_version` diagnostic field on manufacturer or hub_app — never exported as plugin `latestVersion`.
  - Prefer `sc3` YAML for Softube Central hub_app freshness; demote Homebrew livecheck.
  - Reflect log entry: Softube RN curl-success control vs Waves WAF.

- **Expected impact:**
  - Prevents a high-severity integrity incident (164 Softube portal-linked plugins wrongly stamped to suite train).
  - Still captures RN as a cheap daily signal for which SKUs churned.
  - Central 3.0.5 YAML becomes a durable green/hub freshness path.

- **Risks / caveats:**
  - Future Softube RN may say “All plug-ins” with a suite bump — still do not invent per-SKU marketing versions without an explicit Muse policy (recommend: suite field only).
  - Product marketing versions may coincidentally look like 2.6.x — require independent oracle before any raise.
  - Typo “August 21th” in Softube copy — date parser must tolerate ordinal typos.
  - Login-walled installers mean per-SKU greens remain scarce; do not grind account portals.

- **Suggested first step:**
  Add unit fixture from cached `softube-2642.html` asserting zero SKU stamps; wire RN index hash watch that only updates suite diagnostic + enqueue list; separately wire sc3 YAML for Central hub_app.

- **New evidence since last verdict:**
  Verdicts empty; live Aug 21 2026 **2.6.42** article naming Monoment Bass / Parallels / Statement Lead as FIXED products; sc3 Central **3.0.5**; Homebrew stale **2.2.0** trap. Sources: `advisory-deep/novel/SOFTUBE-SUITE-TRAP.md`, `softube-suite-versions.txt`, hubs REPORT Softube control row.
