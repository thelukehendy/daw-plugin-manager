# DAW Plugin Manager

Read-only discovery utility for macOS that finds installed DAWs and audio plugins, compares them to a version catalog, and opens manufacturer download portals when updates are available.

**This app never deletes, overwrites, or installs anything.** You install updates yourself from the manufacturer’s site.

## What it does

1. Detects DAWs (Pro Tools, Logic Pro, Ableton Live, REAPER, Studio One, FL Studio, Cubase, and others under `/Applications`)
2. Deep-scans plugin folders:
   - AAX — `/Library/Application Support/Avid/Audio/Plug-Ins` (+ user Library)
   - AU — `/Library/Audio/Plug-Ins/Components`
   - VST / VST3 / CLAP — standard Library paths
   - Vendor trees (Waves, iZotope, Universal Audio, Native Instruments, Softube, …)
   - Optional custom folders you add in the UI
3. Reads versions from plugin bundle `Info.plist` metadata
4. Refreshes a **remote version catalog** (falls back to the bundled seed) so latest-version knowledge stays current without shipping a new app binary
5. Builds a sortable report: name, manufacturer, installed version, latest version, release date, status, formats, compatibility
6. Each row can open the manufacturer’s **account / downloads portal** in your browser (not a forced direct installer download)

## Quick start

```bash
npm install
npm run electron:fetch   # if Electron binary did not install via npm scripts
npm run catalog:validate
npm run scan:cli         # headless discovery scan → scan-report.json
npm run dev              # Electron UI
```

If `npm run dev` fails with `electron.app` undefined, your shell may have `ELECTRON_RUN_AS_NODE=1` set (common in some IDE environments). The npm scripts clear that automatically.

## Architecture

| Piece | Role |
| --- | --- |
| `src/main/scanner/` | Read-only DAW + plugin filesystem scanners |
| `src/main/catalog/` | Catalog load (remote + bundled) + version compare |
| `catalog/catalog.json` | Seed manufacturers, latest versions, portal URLs |
| `src/renderer/` | Sortable report UI |
| `scripts/scan-cli.ts` | CLI scan for testing / automation |

### Keeping latest versions current for every user

Accuracy of public “latest version” data is the product’s primary goal.

Weekly refresh runs **without you clicking anything**:

1. **This Mac (LaunchAgent)** — `npm run catalog:install-weekly` (Mondays 08:15 local)
2. **GitHub Actions** — after push to GitHub (Mondays 15:00 UTC)

Each run: sticky `catalog/known-sources.json` (Soundtoys release log, iZotope release-notes pages, plus any newly discovered changelogs) → dedicated scrapers → free discovery that hunts for more release-note URLs and saves them forever → validate.

No paid Google/LLM APIs. Versions must come from fetched manufacturer pages.

The app calls `loadCatalog()` on each scan and prefers the newest remote/bundled catalog.
## Distribution

See [DISTRIBUTE.md](./DISTRIBUTE.md) for the cloud catalog checklist, weekly Actions, and `npm run dist:mac`.


- Scan paths are read-only
- No uninstall / move / overwrite helpers
- External links are restricted to `http:` / `https:` and open in the system browser
- Installers are always user-driven

## Notes

- Catalog coverage will not be perfect for every obscure plugin on day one; unmatched plugins still appear with status **Unknown**, and manufacturer portals are used when the vendor is recognized.
- UAD and other vendors that install outside the Avid AAX folder are included via Application Support roots and catalog matchers.
- Windows / Linux path maps can be added later; scanners are currently macOS-focused.
