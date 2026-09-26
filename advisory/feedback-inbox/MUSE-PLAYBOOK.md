# Muse playbook — in-app feedback inbox

Standing instructions for the catalog operator. Cursor ships the relay; you
consume `advisory/feedback-inbox/` and turn real installs into catalog fixes.

**Relay stays on Netlify for now** (GitHub holds issues + inbox files; Netlify
only holds the server token). No action required from you on hosting.

---

## 1. Where feedback lives

| Stage | Location |
|---|---|
| User Send | App → `POST …/api/feedback` (Netlify) |
| Human-visible | GitHub issues labeled **`app-feedback`** |
| Operator-readable | **`advisory/feedback-inbox/YYYY-MM-DD-<issue>-<slug>.json` on `main`** |

Pull `main` (or watch new commits under `advisory/feedback-inbox/`). Ignore
smoke-test noise (`Cursor smoke test`, `sendFeedback()` probes) unless debugging
the relay.

Each file:

```json
{
  "source": "app-feedback",
  "issueNumber": 123,
  "issueUrl": "https://github.com/…/issues/123",
  "receivedAt": "…",
  "payload": { "kind": "feedback", "schemaVersion": 1, "message": "…", … }
}
```

Work from **`payload`**. Prefer **`payload.matches`** over guessing from the
user’s prose alone.

---

## 2. Cadence (make the loop useful)

On each research chip / daily push prep:

1. List new files under `advisory/feedback-inbox/` since your last pass
   (skip `README.md`, `MUSE-PLAYBOOK.md`).
2. Open each JSON; read `message` + `summary` first.
3. Classify (below) and either fix in the store, defer with a note, or hand to
   Cursor via `advisory/cursor-inbox/`.
4. Optional: comment on the GitHub issue (`Fixed in <commit>` / `Need more info`
   / `App bug — Cursor`) so Luke sees progress without opening the JSON.

Do **not** wait for a weekly digest — a single bad match reported by a user is
higher signal than another yellow KVR pass.

---

## 3. Classification (who owns it)

### Muse owns (catalog / identity / versions)

Use when `matches` / `scan` show data problems:

| Signal | Likely fix |
|---|---|
| `catalogPluginId: null` + clear product in `scan` | Missing row, weak `matchPatterns`, or wrong manufacturer |
| Wrong `catalogPluginId` (sibling SKU, seed vs desktop, gen row) | Patterns / `identityKind` / generation / bundle IDs |
| `latestVersion` disagrees with a first-hand source the user implies | Re-verify; raise/lower confidence; never invent |
| Helper/DAW wrong in `helpers` / `daws` | `identityKeys.bundleIds`, `installedVersionRule`, generation rows |
| User names a portal/hub version the catalog lacks | Portal note / `portalApp` — still no invented semver |

**Evidence rules unchanged:** first-hand vendor proof; no pirate/SEO; no
stamping from sibling SKUs.

### Cursor owns (app / matcher / UI)

Hand off with a short `advisory/cursor-inbox/` note when:

- Same install would match correctly if the **matcher** used member names /
  formats / generation pick (data row already correct)
- UI / feedback relay / shell / scan-path bugs
- `catalogUpdatedAt` is old but store is fine → feed/cache, not data

### Skip / close

- Empty or “thanks” with no opt-in scan and no actionable claim
- Smoke tests from Cursor
- Requests to download/install/license (out of product scope)

---

## 4. How to read the payload (schemaVersion 1)

| Field | Muse use |
|---|---|
| `message` | User intent; quotes for issue comments |
| `app` | OS / arch / shell — Windows vs Mac identity keys |
| `catalogUpdatedAt` | Which export they had; if older than your last push, ask them to Refresh catalog before deep dives |
| `summary` | Triage priority (`unmatched`, `needsUpdate`) |
| **`matches[]`** | **Primary.** `name`, `manufacturer`, `installedVersion`, `catalogPluginId`, `status`, `matchMethod`, `latestVersion`, `identityKind` |
| `scan` | Golden-fixture shape (plugins + daws, **no paths**). Use to reproduce locally or propose a synthetic fixture after human review |
| `daws` / `helpers` | Same as matches for standalone/hub apps |

Privacy: no file paths, usernames, or machine names. Treat even so as
user-private — don’t paste full libraries into public playbooks.

### High-value match patterns

```text
name ≈ "Splice", formats empty in scan, catalogPluginId = splice--splice
  → prefer splice--splice-desktop-app (identityKind / app-only) — often app;
    if seed row shouldn’t exist, retire/discontinue in store.

name = "Auto-Tune Pro" collapsed under line, catalogPluginId = Access
  → member-name / product-line — often app; confirm patterns on Pro row.

Shared bundle ID, wrong generation (Studio One 5 → 4)
  → generation / versionMajors / bundleIds on DAW rows.
```

---

## 5. What to do with opt-in scans

1. **Reproduce** — map `matches` where `catalogPluginId` is null or wrong; check
   those ids in `catalog/catalog.json` / the store.
2. **Fix in engine** — patterns, identity keys, version observations, playbook
   notes — then export as usual.
3. **Fixtures** — if the scan is a clean anonymized profile worth keeping,
   propose (don’t auto-merge) a file under `catalog-store/fixtures/scans/` after
   review. Same shape as `payload.scan`.
4. **Never** write `latestVersion` from user installs alone. User installed
   version ≠ accepted latest.

---

## 6. Reply channel

- Verdicts / engine changes: your normal push + notes
- App-side asks: `advisory/cursor-inbox/YYYY-MM-DD-….md`
- Optional GitHub issue comment on the `app-feedback` issue so Luke sees it in
  the repo UI

---

## 7. Scale expectations (~hundreds of users)

Volume will be low (issues/week, not thousands). Inbox commits on `main` are
noisy but cheap. If feedback floods, Cursor can batch mirror commits — your
triage process stays the same.

Hosting: staying on Netlify + GitHub inbox is intentional for now. Cloudflare
is only interesting later if catalog + feedback share one opaque origin.
