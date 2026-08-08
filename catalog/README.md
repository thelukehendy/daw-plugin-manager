## Plugin Version Catalog

Seed + cloud-refreshable source of truth for latest versions, download portals, and DAW compatibility notes.

### Accuracy-first smart scrub (self-refining)

Pipeline goals: **no guessing**, then throughput within free-tier limits. Deterministic Monday scrapers find URLs/candidates only; high confidence requires **page-confirm** (version string must appear on a fetched public page).

```text
Monday:  catalog-refresh.yml  (dedicated scrapers + discovery → provisional live-scrape)
Daily:   smart-catalog-scrub.yml
           1) gap queue
           2) sticky URL reverify (no Gemini) → page-confirmed
           3) Flash parallel cheap tier → escalate hard cases → smart Flash tier
           4) Antigravity cold (opt-in last resort; expensive TPM)
           5) promote winners → known-sources.json
```

| Piece | Path / setting |
| --- | --- |
| Orchestrator | `npm run catalog:smart-scrub` |
| Gap report | `npm run catalog:gaps` → `catalog/gap-queue.json`, `catalog/coverage-report.json` |
| Sticky fast path | `npm run catalog:sticky-reverify` |
| Flash Lite extract | `npm run catalog:flash-extract` (`gemini-3.1-flash-lite`, paced ~12 RPM) |
| Cold agent (opt-in) | `npm run catalog:antigravity-scrub` (`antigravity-preview-05-2026`) |
| Daily workflow | `.github/workflows/smart-catalog-scrub.yml` (16:00 UTC + manual) |
| Monday scrapers | `.github/workflows/catalog-refresh.yml` (15:00 UTC) |
| Secret | Repo Actions secret `GEMINI_API_KEY` |
| Usage log | `catalog/antigravity-usage.json` (Flash + Antigravity run stats) |

Free-tier pacing (Project May 25th observed):
- **Cheap tier (parallel)** — `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, plus lighter 2.x Flash/Lite workers (~500 RPD on current Lite buckets)
- **Smart tier (parallel, escalations only)** — `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-2.5-flash` with small daily budgets
- Low-confidence / unclear extracts are logged to `catalog/flash-escalation.json` then retried by smart workers
- **Antigravity / Pro** — excluded from bulk (TPM / paid); optional separate cold path only
- Expect most of an ~800-plugin catalog in **1–2 days** when Lite buckets are healthy

Accuracy rules:
- Catalog high-trust versions require a real public `sourceUrl` (no binaries, no `example.com`, no Google search URLs).
- Flash / sticky / Antigravity findings are **page-confirmed** (version + product on page) before write as `page-confirmed` / `agent-verified`.
- Existing `latestVersion` values are never treated as truth for Gemini prompts.
- Successful URLs are merged into `catalog/known-sources.json` so future runs use the cheap sticky path.

### Recommended free hosting (suggestion)

| Piece | Choice | Why |
| --- | --- | --- |
| Source of truth | Public GitHub repo `catalog.json` | Free, versioned, reviewable PRs |
| CDN | [jsDelivr](https://www.jsdelivr.com/) `cdn.jsdelivr.net/gh/...` | Free CDN in front of GitHub |
| Schedule | GitHub Actions weekly (`catalog-refresh.yml`) | Free minutes; can move to daily later |
| Updates | Curated PRs + optional scrapers that only write **version + portal URL** | Avoid storing installer binaries |

App fetch order (see `catalogService.ts`):

1. jsDelivr CDN copy  
2. GitHub raw fallback  
3. Bundled seed  
4. Local floors (`~/Library/Application Support/DAW Plugin Manager/catalog-overrides.json`)

**Never** publish direct `.dmg` / `.pkg` links as the primary action — prefer manufacturer **download / Native Access / Waves Central / account** pages so users land on an authentic vendor site.

### Grouping rules

- Formats + leftover builds of the same product → one product row  
- Generations (Kontakt 6 + Kontakt 8) → one **product line**; status uses the newest generation only; older majors show as **legacy** installs  
- Report UI collapses by **manufacturer → product → bundles**

### Version confidence

Each status badge shows **`Current 70% confidence`** (word “confidence” after the number).

Confidence measures how sure we are about the **status on this machine**, with **page-confirm as the accuracy authority**:
- **100% / high (≥85%)** — `page-confirmed` (Flash Lite or sticky heuristic with hard gates) or `agent-verified` (Antigravity), plus readable installed version and a solid catalog match
- **~70% / medium-low** — deterministic `live-scrape` (useful provisional signal, awaiting page confirmation; capped below high)
- **~76%** — legacy `public-page` stamp (capped below high until hard page-confirm)
- **~62%** — unverified seed / weak provenance

Scrapers still update versions for coverage; the UI stays cautious until page-confirm.
### Weekly refresh (free, no click required)

Two hands-off paths (use both when possible):

1. **This Mac (LaunchAgent)** — `npm run catalog:install-weekly`  
   Runs every Monday 08:15 local, updates `catalog/catalog.json` + `catalog/known-sources.json`, logs under `~/Library/Logs/DAW Plugin Manager/`.

2. **GitHub Actions** — `.github/workflows/catalog-refresh.yml` (Mondays 15:00 UTC)  
   Same refresh in the cloud after the repo is pushed with Actions enabled. Commits catalog + known-sources automatically.

**Sticky scrape knowledge:** release-note URLs (Soundtoys release log, iZotope `/pages/release-notes/…`, anything discovery finds) live in `catalog/known-sources.json` and are re-scraped every week forever. New URLs discovered by search are appended automatically.

GitHub Action `catalog-refresh.yml` (Mondays 15:00 UTC, or manual `workflow_dispatch`):

1. **Known-sources registry** + dedicated manufacturer scrapers
2. **Free discovery pass** for remaining seed vendors (DuckDuckGo `site:` → fetch → parse; learn new release-note URLs)
3. Validate + commit if changed

**No paid LLM/Google APIs.** Local: `npm run catalog:refresh`

**Outdated** is always red; **Current/OK** is green at ≥85%.

### Compatibility flags

Optional `dawIssues[]` on catalog plugins. **Only verified, high-confidence issues alert.**

Required fields for an issue to appear:
- `verified: true`
- `severity`: `warn` or `block` (`info` is never shown)
- `minDawVersion` and/or `maxDawVersion` (concrete DAW version bound)
- `sourceUrl` and/or `verifiedAt` (public proof + last confirmation)
- Clear `note` describing the actual failure / unsupported range

Advisory “check the release notes” text is **not** an issue and must not be committed.
Weekly GitHub Action re-validates this and refreshes `updatedAt` / `verifiedAt`.
