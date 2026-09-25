# Chip-ready: Moog `softwareUpdate/{slug}` (includes MF-105S gap close)

- **Date:** 2026-09-25 (Wave 7 Ask 1+2)
- **Advisor:** Grok Bot

## Ask 1 — MF-105S gap closed
Muse flagged missing `moog-mf-105s.html` while the table claimed 1.3.0. Live re-fetch 2026-09-25:

| Field | Value |
|---|---|
| URL | `https://software.moogmusic.com/softwareUpdate/mf-105s` |
| Tip | **1.3.0** (`All Formats v1.3.0` ×2) |
| Bytes / sha256 | 18518 / `89f1eab53d0f63db4b32d0ea118fafb2897bb665fc63f4543bbb3beaf58cee38` |
| Fixture | `fixtures/wave7/chips/moog/moog-mf-105s.html` (+ `.meta.json`) |

Table stands; gap was fixture-only.

## Fetch recipe
For each slug GET `https://software.moogmusic.com/softwareUpdate/{slug}` with browser UA.

| plugin_id (expected) | slug | tip (wave6+7) |
|---|---|---|
| `moog-music--mariana` (alt `moog--mariana`) | `mariana` | 1.2.0 |
| `moog-music--mf-10Xs` (alt `moog--mf-10Xs`) | `mf-101s`…`mf-105s`, `mf-107s`…`mf-109s` | **1.3.0** |
| (negative) | `mf-106s` | soft empty / not shipped |

## Parse rule
Regex (button / label): `(?P<label>[A-Za-z0-9-]+)\s+(?P<os>macOS|Windows)\s+All Formats v(?P<ver>\d+\.\d+\.\d+)`.
Tip field: `ver`. Require Mac==Win when both present; else prefer macOS. Optional changelog corroboration: `<p class="sub-header">(?P<chg>\d+\.\d+\.\d+)`.
Reject if zero `All Formats v` matches.

## Stub / soft-200 detector
HTTP 200 alone ≠ healthy. Reject ~15KB shells without `All Formats v` control (wrong-slug pattern). mf-106s is the golden negative.

## Identity guard
Per-slug tip only on that plugin_id. Never cross-stamp Mariana ↔ MF-*S.

## Golden fixtures
Under `fixtures/wave7/chips/moog/`: `moog-mariana.html`, `moog-mf-101s`…`mf-105s`, `mf-107s`…`mf-109s` (+ `.meta.json`). **mf-105s** gap-close golden (full body, tip 1.3.0, sha256 `89f1eab5…`). Negative: `moog-mf-106s.html` (soft-200 shell, no `All Formats v`).

**Ready for the engine to wire after operator re-fetch.**
