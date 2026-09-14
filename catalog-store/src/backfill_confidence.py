#!/usr/bin/env python3
"""Set confidence + confidence_reasons on ALL version_observations.

Scoring follows CONFIDENCE.md / the rubric in this module. Idempotent —
re-running overwrites scores from extract_method / source_kind / URL.
"""
from __future__ import annotations

import json
import re
import sqlite3
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

# Official-ish domains where installer filenames are trusted more
OFFICIAL_DOMAIN_HINTS = (
    "fabfilter.com",
    "valhalladsp.com",
    "u-he.com",
    "dl.u-he.com",
    "plugin-alliance.com",
    "izotope.com",
    "soundtoys.com",
    "cytomic.com",
    "oeksound.com",
    "goodhertz.com",
    "klanghelm.com",
    "tal-software.com",
    "sonnox.com",
    "d16.pl",
    "audiothing.net",
    "xferrecords.com",
    "kilohearts.com",
    "apulsoft.ch",
    "surge-synthesizer.github.io",
    "github.com/surge-synthesizer",
    "liquidsonics.com",
    "babyaudio.io",
    "cableguys.com",
    "softube.com",
    "native-instruments.com",
    "arturia.com",
    "toontrack.com",
    "cherryaudio.com",
    "meldaproduction.com",
    "ssl.com",
    "solidstatelogic.com",
    "eventideaudio.com",
    "celemony.com",
    "antarestech.com",
    "waves.com",
    "uaudio.com",
    "focusrite.com",
    "steinberg.net",
    "spitfireaudio.com",
    "output.com",
    "newfangledaudio.com",
    "leapwing.com",
    "nugenaudio.com",
    "acondigital.com",
    "overloud.com",
    "ikmultimedia.com",
    "hornetplugins.com",
    "kazrog.com",
    "synchroarts.com",
    "audioease.com",
    "bettermaker.com",
    "aberrantdsp.com",
    "vital.audio",
    "splice.com",
)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def host_of(url: str) -> str:
    try:
        return (urlparse(url).hostname or "").lower()
    except Exception:
        return ""


def is_official_domain(url: str) -> bool:
    h = host_of(url)
    if not h:
        return False
    for d in OFFICIAL_DOMAIN_HINTS:
        if h == d or h.endswith("." + d) or d.endswith(h):
            return True
        # subdomain match e.g. downloads.fabfilter.com
        if d in h:
            return True
    return False


def is_wayback(url: str) -> bool:
    h = host_of(url)
    return "web.archive.org" in h or "archive.org" in h


def is_kvr(url: str) -> bool:
    h = host_of(url)
    return "kvraudio.com" in h


def looks_installer_method(em: str) -> bool:
    em_l = em.lower()
    keys = (
        "installer-filename",
        "installer_filename",
        "installerbasename",
        "installer-label",
        "cdn-installer",
        "demo-installer",
        "public-installer",
        "product-page-installer",
        "filename-semver",
        "filename",
        "dmg",
        "pkg",
    )
    return any(k in em_l for k in keys)


def score_observation(
    *,
    source_kind: str,
    extract_method: str | None,
    source_url: str,
) -> tuple[int, list[str]]:
    """Return (confidence 0-100, reasons)."""
    em = extract_method or ""
    em_l = em.lower()
    kind = source_kind or "other"
    reasons: list[str] = []
    score: int | None = None

    # --- Explicit high-trust registries / feeds ---
    if "oas-registry" in em_l or em_l.startswith("oas-"):
        score = 95
        reasons.append("oas-registry: manufacturer package version field (95)")
    elif kind == "vendorFeed" or "manufacturer-feed" in em_l or em_l.endswith("-feed"):
        score = 95
        reasons.append("manufacturer-feed / vendorFeed (95)")

    # --- KVR crowdsourced ---
    elif "kvr-product-page" in em_l or (is_kvr(source_url) and "kvr" in em_l):
        score = 60
        reasons.append("kvr-product-page (crowdsourced verwin) — skeptical default (60)")
    elif is_kvr(source_url):
        score = 60
        reasons.append("KVR URL source — crowdsourced (60)")

    # --- DAW-bundled stock plugs (host version proxy) ---
    elif "daw-bundled-version" in em_l:
        score = 70
        reasons.append(
            "daw-bundled-version: host DAW public release used as proxy for stock plugs with no independent installer semver (70)"
        )

    # --- Homebrew ---
    elif "brew-cask" in em_l or "homebrew" in em_l:
        score = 80
        reasons.append("homebrew cask for hub app (80)")

    # --- Lab on-disk ---
    elif kind == "labOnDisk" or "cfbundle" in em_l or "lab-on-disk" in em_l:
        score = 98
        reasons.append("lab on-disk CFBundle / agent-verified (98)")

    # --- Wayback ---
    elif is_wayback(source_url) or "wayback" in em_l:
        score = 50
        reasons.append("wayback-only historical capture (50)")

    # --- Installer filename on official domain ---
    elif looks_installer_method(em) and is_official_domain(source_url):
        score = 88
        reasons.append(
            "installer-filename on official manufacturer domain (88)"
        )
    elif looks_installer_method(em):
        score = 85
        reasons.append("installer-filename (domain not in official list) (85)")

    # --- Page-confirmed manufacturer downloads/product/releaseNotes ---
    elif kind in ("downloadsPage", "productPage", "releaseNotesPage"):
        score = 92
        reasons.append(
            f"page-confirmed manufacturer {kind} with clear version (92)"
        )
    elif kind == "other" and is_official_domain(source_url):
        score = 90
        reasons.append("other extract on official manufacturer page (90)")

    # --- Fallback ---
    if score is None:
        score = 50
        reasons.append(
            f"default confidence for extract_method={em!r} source_kind={kind!r} (50)"
        )

    # Caps / adjustments
    if "suite" in em_l and "mismatch" in em_l:
        if score > 40:
            score = 40
            reasons.append("suite ambiguity / dual mismatch cap (40)")
    if "mac-win-mismatch" in em_l or "dual-mismatch" in em_l:
        if score > 40:
            score = 40
            reasons.append("dual Mac/Win mismatch cap (40)")

    # Slight bump when HTML hash proof accompanies page confirm
    if score >= 90 and "sha256" in em_l:
        score = min(100, score + 3)
        reasons.append("live HTML content hash corroboration (+3)")

    score = max(0, min(100, int(score)))
    return score, reasons


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        cols = {r[1] for r in conn.execute("PRAGMA table_info(version_observations)")}
        if "confidence" not in cols:
            print(
                "confidence column missing — run src/migrate_v3.py first",
                file=sys.stderr,
            )
            return 1

        rows = conn.execute(
            """
            SELECT id, source_kind, extract_method, source_url, status
            FROM version_observations
            """
        ).fetchall()

        hist: Counter[int] = Counter()
        by_bucket: Counter[str] = Counter()
        updated = 0
        for r in rows:
            score, reasons = score_observation(
                source_kind=r["source_kind"],
                extract_method=r["extract_method"],
                source_url=r["source_url"],
            )
            conn.execute(
                """
                UPDATE version_observations
                SET confidence = ?, confidence_reasons = ?
                WHERE id = ?
                """,
                (score, json.dumps(reasons, ensure_ascii=False), r["id"]),
            )
            updated += 1
            hist[score] += 1
            if score >= 85:
                by_bucket["green_ge_85"] += 1
            elif score >= 70:
                by_bucket["amber_70_84"] += 1
            else:
                by_bucket["yellow_lt_70"] += 1

        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("confidence_backfilled_at", now_iso()),
        )
        conn.commit()

        print(f"Updated confidence on {updated} observations")
        print("Band distribution (Electron UX):")
        for k in ("green_ge_85", "amber_70_84", "yellow_lt_70"):
            print(f"  {k}: {by_bucket[k]}")
        print("Score histogram (score → count):")
        for score in sorted(hist):
            print(f"  {score:3d}: {hist[score]}")

        # Accepted-current only histogram
        cur_hist: Counter[int] = Counter()
        for (score,) in conn.execute(
            """
            SELECT o.confidence
            FROM plugin_version_current c
            JOIN version_observations o ON o.id = c.observation_id
            WHERE o.status = 'accepted'
            """
        ):
            cur_hist[score] += 1
        print("Accepted-current score histogram:")
        for score in sorted(cur_hist):
            print(f"  {score:3d}: {cur_hist[score]}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
