#!/usr/bin/env python3
"""Import manufacturers + plugins identity ONLY from seed catalog.

CRITICAL: Does NOT import latestVersion, versionEvidence, versionSourceUrl,
versionVerifiedAt into any trusted version tables.
"""
from __future__ import annotations

import json
import sqlite3
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"
LOCAL_SEED = Path("/tmp/dpm_catalog.json")
REMOTE_SEED = (
    "https://raw.githubusercontent.com/thelukehendy/"
    "daw-plugin-manager/main/catalog/catalog.json"
)
IDENTITY_SOURCE = "seed-catalog-2026-08-10"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_catalog() -> dict:
    if LOCAL_SEED.is_file():
        print(f"Using local seed: {LOCAL_SEED}")
        with LOCAL_SEED.open(encoding="utf-8") as f:
            return json.load(f)
    print(f"Downloading seed: {REMOTE_SEED}")
    with urllib.request.urlopen(REMOTE_SEED, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def dumps_json(value) -> str | None:
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False)


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}. Run init_db.py first.", file=sys.stderr)
        return 1

    catalog = load_catalog()
    manufacturers = catalog.get("manufacturers") or []
    plugins = catalog.get("plugins") or []
    ts = now_iso()

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        # Clear identity tables only (not observations / current — fresh import)
        # Universe re-seed: replace manufacturers + plugins identity.
        conn.execute("DELETE FROM plugin_version_current")
        conn.execute("DELETE FROM version_observations")
        conn.execute("DELETE FROM vendor_feeds")
        conn.execute("DELETE FROM plugins")
        conn.execute("DELETE FROM manufacturers")

        mfg_count = 0
        for m in manufacturers:
            portal = m.get("updatePortalUrl") or m.get("update_portal_url")
            if not portal:
                print(f"SKIP manufacturer missing portal: {m.get('id')}", file=sys.stderr)
                continue
            conn.execute(
                """
                INSERT INTO manufacturers (
                  id, name, aliases, website_url, update_portal_url,
                  portal_app, update_channel, notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    m["id"],
                    m["name"],
                    dumps_json(m.get("aliases") or []),
                    m.get("websiteUrl") or m.get("website_url"),
                    portal,
                    m.get("portalApp") or m.get("portal_app"),
                    m.get("updateChannel") or m.get("update_channel"),
                    m.get("notes"),
                    ts,
                    ts,
                ),
            )
            mfg_count += 1

        plugin_count = 0
        skipped_version_fields = 0
        for p in plugins:
            # Explicitly ignore untrusted version fields
            for bad in (
                "latestVersion",
                "versionEvidence",
                "versionSourceUrl",
                "versionVerifiedAt",
                "releaseDate",
            ):
                if bad in p and p[bad] is not None:
                    skipped_version_fields += 1

            patterns = p.get("matchPatterns") or p.get("match_patterns")
            if not patterns:
                print(f"SKIP plugin missing matchPatterns: {p.get('id')}", file=sys.stderr)
                continue

            mid = p.get("manufacturerId") or p.get("manufacturer_id")
            conn.execute(
                """
                INSERT INTO plugins (
                  id, manufacturer_id, name, match_patterns, formats,
                  product_line, bundled, min_macos, update_portal_url,
                  supersedes_plugin_id, superseded_by_plugin_id, discontinued,
                  notes, identity_source, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    p["id"],
                    mid,
                    p["name"],
                    dumps_json(patterns),
                    dumps_json(p.get("formats") or []),
                    p.get("productLine") or p.get("product_line"),
                    1 if p.get("bundled") else 0,
                    p.get("minMacOS") or p.get("min_macos"),
                    p.get("updatePortalUrl") or p.get("update_portal_url"),
                    p.get("supersedesPluginId") or p.get("supersedes_plugin_id"),
                    p.get("supersededByPluginId") or p.get("superseded_by_plugin_id"),
                    1 if p.get("discontinued") else 0,
                    # Keep identity notes but do not treat versionEvidence as trust
                    p.get("notes"),
                    IDENTITY_SOURCE,
                    ts,
                    ts,
                ),
            )
            plugin_count += 1

        conn.commit()
        print(
            f"Imported {mfg_count} manufacturers, {plugin_count} plugins "
            f"(identity only; identity_source={IDENTITY_SOURCE})"
        )
        print(
            f"Stripped untrusted version field occurrences: {skipped_version_fields} "
            "(not written to any version tables)"
        )
        obs = conn.execute("SELECT COUNT(*) FROM version_observations").fetchone()[0]
        cur = conn.execute("SELECT COUNT(*) FROM plugin_version_current").fetchone()[0]
        print(f"version_observations={obs}, plugin_version_current={cur}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
