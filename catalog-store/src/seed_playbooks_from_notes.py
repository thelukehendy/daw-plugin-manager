#!/usr/bin/env python3
"""Seed manufacturer_playbooks from NOTES-*.md + MILESTONE + HUB_WALLED.

Extracts verified scrub methods/URLs for manufacturers we've already verified
in prior zero-trust passes. Idempotent upsert.
"""
from __future__ import annotations

import json
import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

# Curated playbooks from NOTES / MILESTONE (verified manufacturers).
# Keys must match manufacturers.id in the store.
CURATED: dict[str, dict] = {
    "fabfilter": {
        "method_summary": (
            "Public product/download pages on fabfilter.com; per-plugin "
            "current version listed on each product page / download section."
        ),
        "primary_urls": [
            "https://www.fabfilter.com/download",
            "https://www.fabfilter.com/products",
        ],
        "extract_notes": (
            "Parse product page version labels. Generations are separate SKUs "
            "(Pro-Q 3 vs Pro-Q 4); micro updates stay within generation."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": "High — public pages; 17/17 accepted in early pass.",
        "hub_walled": 0,
        "portal_app": None,
        "notes_glob": None,  # no dedicated NOTES file; identity from store
    },
    "kilohearts": {
        "method_summary": (
            "Public downloads page; Phase Plant / Snap Heap / kHs suite share "
            "installer family versions."
        ),
        "primary_urls": [
            "https://kilohearts.com/download",
        ],
        "extract_notes": "Suite/shared version from downloads page headings.",
        "cadence_hint": "weekly",
        "success_rate_notes": "High — 39/39 accepted @ 2.4.6 early pass.",
        "hub_walled": 0,
        "portal_app": None,
    },
    "meldaproduction": {
        "method_summary": (
            "Public /downloads page publishes shared kernel version for all "
            "plugins (prefer kernel over MPluginManager installer version)."
        ),
        "primary_urls": [
            "https://www.meldaproduction.com/downloads",
            "https://www.meldaproduction.com/changes/",
        ],
        "extract_notes": (
            "Seed portal /download may 403; use /downloads. Prefer "
            "'kernel version: X.Y.Z' over 'installer version'."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": "High — 42/42 @ kernel 17.10.01 (NOTES-soundtoys-melda).",
        "hub_walled": 0,
        "portal_app": "MPluginManager",
        "source_notes": "NOTES-soundtoys-melda.md",
    },
    "soundtoys": {
        "method_summary": (
            "Public release-log page; suite-wide Soundtoys 5.x.x Update headings. "
            "Downloads portal is account-gated for binaries."
        ),
        "primary_urls": [
            "https://www.soundtoys.com/release-log/",
        ],
        "extract_notes": (
            "Do not use login-walled downloads for version; parse "
            "'Soundtoys X.Y.Z Update' headings on release-log."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": "High — 23/23 @ 5.5.5 (NOTES-soundtoys-melda).",
        "hub_walled": 0,
        "portal_app": None,
        "source_notes": "NOTES-soundtoys-melda.md",
    },
    "ssl": {
        "method_summary": (
            "SSL Support offline-installer article (SSL and Harrison Plug-in "
            "Downloads) lists latest per-SKU versions. Consumer downloads page "
            "is incomplete / marketing-noise."
        ),
        "primary_urls": [
            "https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads",
        ],
        "extract_notes": (
            "Table 'Name vX.Y.Z'; page states offline installers are latest. "
            "Avoid mis-scraping 'SSL 360 Link v1.7 Release' marketing."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": "High — 38/39 accepted (NOTES-ssl-antares-harrison-tdr). Meter Pro left if not listed.",
        "hub_walled": 0,
        "portal_app": "SSL Download Manager",
        "source_notes": "NOTES-ssl-antares-harrison-tdr.md",
    },
    "antares": {
        "method_summary": (
            "Per-product public Release Notes articles on help.antarestech.com. "
            "AutoTune Central is manager-only (no per-plugin version table)."
        ),
        "primary_urls": [
            "https://help.antarestech.com/hc/en-us/sections/47811896963476-Release-Notes",
            "https://www.antarestech.com/software-download",
        ],
        "extract_notes": (
            "Seed /downloads/ 404. Accept heading semver; strip build suffixes "
            "(e.g. 11.6.0.1349 → 11.6.0)."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": "High — 26/26 accepted (NOTES-ssl-antares-harrison-tdr).",
        "hub_walled": 0,
        "portal_app": "AutoTune Central",
        "source_notes": "NOTES-ssl-antares-harrison-tdr.md",
    },
    "harrison": {
        "method_summary": (
            "Harrison Audio Support Plug-in Downloads article; 32 Classic may "
            "be newer on SSL Plug-in Downloads."
        ),
        "primary_urls": [
            "https://support.harrisonaudio.com/hc/en-gb/articles/15986119874845-Harrison-Plug-in-Downloads",
            "https://support.solidstatelogic.com/hc/en-gb/articles/4849510029085-SSL-and-Harrison-Plug-in-Downloads",
        ],
        "extract_notes": "Match display label to installer path version.",
        "cadence_hint": "weekly",
        "success_rate_notes": "Good — 15/17 (NOTES-ssl-antares-harrison-tdr).",
        "hub_walled": 0,
        "portal_app": "SSL Download Manager",
        "source_notes": "NOTES-ssl-antares-harrison-tdr.md",
    },
    "tokyo-dawn-labs": {
        "method_summary": "Public tokyodawn.net product pages publish 'Latest version: x.y.z'.",
        "primary_urls": [
            "https://www.tokyodawn.net/tokyo-dawn-labs/",
        ],
        "extract_notes": "Per-product page 'Latest version' field.",
        "cadence_hint": "monthly",
        "success_rate_notes": "High — 5/5 (NOTES-ssl-antares-harrison-tdr).",
        "hub_walled": 0,
        "portal_app": None,
        "source_notes": "NOTES-ssl-antares-harrison-tdr.md",
    },
    "valhalla-dsp": {
        "method_summary": (
            "Public product pages show Current Version; account downloads portal "
            "is login-walled. Corroborate on demos-downloads."
        ),
        "primary_urls": [
            "https://valhalladsp.com/demos-downloads/",
            "https://valhalladsp.com/shop/delay/valhalladelay/",
            "https://valhalladsp.com/shop/reverb/valhalla-room/",
        ],
        "extract_notes": (
            "Prefer page 'Current Version'; ignore spurious seed 28.0. "
            "Note Mac vs Win when dual-listed. Products are single SKUs "
            "(no paid gen successor in catalog)."
        ),
        "cadence_hint": "monthly",
        "success_rate_notes": "High — 8/8 (NOTES-valhalla-goodhertz).",
        "hub_walled": 0,
        "portal_app": None,
        "source_notes": "NOTES-valhalla-goodhertz.md",
    },
    "goodhertz": {
        "method_summary": "Public downloads page publishes one suite version for all plugins.",
        "primary_urls": [
            "https://goodhertz.com/downloads/",
        ],
        "extract_notes": "Heading 'Goodhertz X.Y.Z' / date line.",
        "cadence_hint": "monthly",
        "success_rate_notes": "High — 14/14 @ 3.14.1 (NOTES-valhalla-goodhertz).",
        "hub_walled": 0,
        "portal_app": None,
        "source_notes": "NOTES-valhalla-goodhertz.md",
    },
    "izotope": {
        "method_summary": (
            "Mix of public product/release-notes pages, legacy-products installer "
            "filenames for old gens, and Product Portal (hub) for current titles."
        ),
        "primary_urls": [
            "https://www.izotope.com/pages/legacy-products",
            "https://www.izotope.com/en/support/support-news/release-notes.html",
        ],
        "extract_notes": (
            "Legacy: accept only when Mac+Win installer filenames agree. "
            "Reject dual Mac/Win mismatches (Iris 2, Trash 2). "
            "Ozone/Neutron/RX gens are separate paid SKUs (macro); "
            "latestVersion is micro within that generation."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": (
            "Partial — Ozone 9 family accepted 9.13.0 from legacy filenames; "
            "many current titles portal-gated (MILESTONE / NOTES-izotope-*)."
        ),
        "hub_walled": 0,  # mixed; not fully walled
        "portal_app": "iZotope Product Portal",
        "source_notes": "NOTES-izotope-legacy-longtail.md;MILESTONE-hub-walled.md",
    },
    "plugin-alliance": {
        "method_summary": (
            "Public product pages often expose 'Installer vX.Y.Z' when SKU URL "
            "resolves; Installation Manager / accounts are hub-walled for many leftovers."
        ),
        "primary_urls": [
            "https://www.plugin-alliance.com/",
        ],
        "extract_notes": (
            "Prefer product-page Installer version. Do not grind PA Installation "
            "Manager login. Track V2→V3 SKU pairs as macro (bx_XL, Vitalizer, etc.)."
        ),
        "cadence_hint": "weekly",
        "success_rate_notes": (
            "Mixed — many accepted via product pages; ~13+ leftovers hub-walled "
            "(NOTES-plugin-alliance-chip / HUB_WALLED)."
        ),
        "hub_walled": 0,
        "portal_app": "Plugin Alliance Installation Manager",
        "source_notes": "NOTES-plugin-alliance-chip.md;HUB_WALLED.md",
    },
    "united-plugins": {
        "method_summary": (
            "Public /download/ only publishes UnitedPluginsManager version; "
            "per-plugin current versions not public. Legacy /download/old is not current."
        ),
        "primary_urls": [
            "https://unitedplugins.com/download/",
        ],
        "extract_notes": (
            "Do not accept manager version as plugin CFBundle. Hub-walled for "
            "current per-SKU versions."
        ),
        "cadence_hint": "monthly",
        "success_rate_notes": "0 accepted — manager-only public oracle (NOTES-soundtoys-melda).",
        "hub_walled": 1,
        "portal_app": "UnitedPluginsManager",
        "source_notes": "NOTES-soundtoys-melda.md;HUB_WALLED.md",
    },
}

# Additional hub-walled manufacturers from HUB_WALLED / MILESTONE (portal-only).
HUB_WALLED_EXTRA: dict[str, dict] = {
    "avid": {
        "method_summary": "Avid Link / avid.com account — no public per-plugin version table.",
        "primary_urls": ["https://www.avid.com/"],
        "extract_notes": "Do not grind Avid Link. Prefer labOnDisk when available.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled — 54 unknowns (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "Avid Link",
    },
    "air": {
        "method_summary": "inMusic Software Center portal.",
        "primary_urls": ["https://www.airmusictech.com/"],
        "extract_notes": "Do not grind inMusic Software Center for versions.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled — 26 unknowns (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "inMusic Software Center",
    },
    "slate-digital": {
        "method_summary": "Slate Digital / inMusic Software Center portal.",
        "primary_urls": ["https://slatedigital.com/"],
        "extract_notes": "Portal-gated current versions.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled — 26 unknowns (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "inMusic Software Center",
    },
    "waves": {
        "method_summary": "Waves Central — hub-walled.",
        "primary_urls": ["https://www.waves.com/downloads"],
        "extract_notes": "Do not grind Waves Central login.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled leftovers (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "Waves Central",
    },
    "native-instruments": {
        "method_summary": "Native Access — hub-walled for many titles.",
        "primary_urls": ["https://www.native-instruments.com/"],
        "extract_notes": "Do not grind Native Access.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled leftovers (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "Native Access",
    },
    "softube": {
        "method_summary": "Softube Central — hub-walled.",
        "primary_urls": ["https://www.softube.com/"],
        "extract_notes": "Do not grind Softube Central.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "Softube Central",
    },
    "universal-audio": {
        "method_summary": "UA Connect / UAD Software — hub-walled.",
        "primary_urls": ["https://www.uaudio.com/"],
        "extract_notes": "Do not grind UA Connect.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Hub-walled (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "UA Connect",
    },
    "steinberg": {
        "method_summary": "Steinberg Download Assistant — often login-gated.",
        "primary_urls": ["https://www.steinberg.net/"],
        "extract_notes": "Prefer public support pages when present; else lab.",
        "cadence_hint": "lab-only",
        "success_rate_notes": "Mostly hub-walled (HUB_WALLED).",
        "hub_walled": 1,
        "portal_app": "Steinberg Download Assistant",
    },
}


URL_RE = re.compile(r"https?://[^\s\)\]\>\"']+")


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def scrape_note_urls(path: Path) -> list[str]:
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8", errors="replace")
    urls = []
    seen = set()
    for m in URL_RE.finditer(text):
        u = m.group(0).rstrip(".,;")
        if u not in seen:
            seen.add(u)
            urls.append(u)
    return urls


def merge_urls(primary: list[str], extra: list[str], limit: int = 12) -> list[str]:
    out: list[str] = []
    seen = set()
    for u in primary + extra:
        if u in seen:
            continue
        # Prefer product/docs hosts; skip pure image/css noise
        host = urlparse(u).netloc.lower()
        if any(x in host for x in ("google.", "gstatic.", "facebook.", "twitter.")):
            continue
        seen.add(u)
        out.append(u)
        if len(out) >= limit:
            break
    return out


def last_scrub_from_notes(root: Path) -> str | None:
    """Use newest NOTES/MILESTONE mtime as scrub hint (ISO UTC)."""
    candidates = list(root.glob("NOTES*.md")) + list(root.glob("MILESTONE*.md"))
    if not candidates:
        return None
    newest = max(p.stat().st_mtime for p in candidates)
    return datetime.fromtimestamp(newest, tz=timezone.utc).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )


def upsert_playbook(conn: sqlite3.Connection, mfr_id: str, data: dict, scrub_at: str | None) -> None:
    exists = conn.execute(
        "SELECT 1 FROM manufacturers WHERE id=?", (mfr_id,)
    ).fetchone()
    if not exists:
        print(f"  skip unknown manufacturer_id={mfr_id}")
        return

    extra_urls: list[str] = []
    src = data.get("source_notes") or ""
    for part in src.split(";"):
        part = part.strip()
        if not part:
            continue
        extra_urls.extend(scrape_note_urls(ROOT / part))

    urls = merge_urls(list(data.get("primary_urls") or []), extra_urls)
    ts = now_iso()
    conn.execute(
        """
        INSERT INTO manufacturer_playbooks (
          manufacturer_id, method_summary, primary_urls, extract_notes,
          cadence_hint, last_scrub_at, success_rate_notes, hub_walled,
          portal_app, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(manufacturer_id) DO UPDATE SET
          method_summary = excluded.method_summary,
          primary_urls = excluded.primary_urls,
          extract_notes = excluded.extract_notes,
          cadence_hint = excluded.cadence_hint,
          last_scrub_at = COALESCE(excluded.last_scrub_at, manufacturer_playbooks.last_scrub_at),
          success_rate_notes = excluded.success_rate_notes,
          hub_walled = excluded.hub_walled,
          portal_app = excluded.portal_app,
          updated_at = excluded.updated_at
        """,
        (
            mfr_id,
            data.get("method_summary"),
            json.dumps(urls, ensure_ascii=False),
            data.get("extract_notes"),
            data.get("cadence_hint"),
            scrub_at,
            data.get("success_rate_notes"),
            int(data.get("hub_walled") or 0),
            data.get("portal_app"),
            ts,
        ),
    )
    print(f"  upserted playbook {mfr_id} ({len(urls)} urls, hub_walled={int(data.get('hub_walled') or 0)})")


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    # Ensure table exists (migrate may not have run)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        row = conn.execute(
            "SELECT value FROM meta WHERE key='schema_version'"
        ).fetchone()
        if not row or row[0] != "2":
            print(
                "WARN: schema_version is not 2; run src/migrate_v2.py first",
                file=sys.stderr,
            )
        # Ensure table
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS manufacturer_playbooks (
              manufacturer_id TEXT PRIMARY KEY REFERENCES manufacturers(id),
              method_summary TEXT,
              primary_urls TEXT,
              extract_notes TEXT,
              cadence_hint TEXT,
              last_scrub_at TEXT,
              success_rate_notes TEXT,
              hub_walled INTEGER DEFAULT 0,
              portal_app TEXT,
              updated_at TEXT
            )
            """
        )

        scrub_at = last_scrub_from_notes(ROOT)
        print(f"Seeding manufacturer_playbooks (last_scrub_at≈{scrub_at})")

        for mfr_id, data in {**CURATED, **HUB_WALLED_EXTRA}.items():
            upsert_playbook(conn, mfr_id, data, scrub_at)

        conn.commit()
        total = conn.execute(
            "SELECT COUNT(*) FROM manufacturer_playbooks"
        ).fetchone()[0]
        walled = conn.execute(
            "SELECT COUNT(*) FROM manufacturer_playbooks WHERE hub_walled=1"
        ).fetchone()[0]
        print(f"Done: {total} playbooks ({walled} hub_walled)")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
