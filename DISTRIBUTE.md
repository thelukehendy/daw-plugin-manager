# Distributing DAW Plugin Manager

Everyone’s copy of the app needs a **public, auto-updating version catalog**. That is the only required cloud piece (free).

## What every user gets

| Piece | Source | Cost |
| --- | --- | --- |
| App binary (DMG) | You build & share | Free |
| Bundled seed catalog | Inside the DMG | Free |
| **Live catalog** (newer than seed) | Public GitHub → jsDelivr CDN | Free |
| Weekly scrape | GitHub Actions on this repo | Free (public repo) |

Without a public GitHub repo matching `catalog/remote-urls.json`, users still run fine on the **bundled** catalog — they just won’t pick up weekly scrape improvements until you ship a new DMG.

## Cloud setup (one-time)

1. Public repo: `thelukehendy/daw-plugin-manager` (or your fork — then run `npm run catalog:sync-remote-urls`).
2. Push `main` including `catalog/` and `.github/workflows/catalog-refresh.yml`.
3. Confirm **Actions** is enabled. Monday job refreshes `catalog.json` automatically.
4. Smoke-test after push:
   ```bash
   curl -sI "https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager@main/catalog/catalog.json"
   curl -sI "https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager/main/catalog/catalog.json"
   ```
5. Rebuild the DMG so shipped `remote-urls.json` matches.

## Build a Mac DMG

```bash
npm install
npm run electron:fetch   # if needed
npm run dist:mac
```

Output: `dist/DAW Plugin Manager-*.dmg`

### Gatekeeper (unsigned builds)

Without an Apple Developer ID ($99/yr), macOS will warn on open. Recipients can:

1. Right-click the app → **Open** → confirm, or  
2. System Settings → Privacy & Security → allow anyway  

Notarization is optional paid polish — not required for the catalog cloud path.

## Local weekly scrape (optional backup)

Already installable on your Mac (does not replace GitHub for other users):

```bash
npm run catalog:install-weekly
```

Other users do **not** need this. They only need network access to fetch the public catalog on scan.

## After each catalog/repo change

1. Push to GitHub so jsDelivr can serve it (CDN may lag a few minutes).
2. Restart / rebuild the app if `remote-urls.json` or main-process code changed.
