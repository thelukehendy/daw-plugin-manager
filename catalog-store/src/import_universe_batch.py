#!/usr/bin/env python3
"""Upsert manufacturers + plugins identity from a JSON batch file.

Does NOT wipe existing data. Does NOT write latestVersion / version_observations.
Preserves existing version_observations and plugin_version_current rows.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def dumps_json(value) -> str | None:
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False)


def upsert_manufacturer(conn: sqlite3.Connection, m: dict, ts: str) -> str:
    """Insert or update manufacturer. Returns 'inserted'|'updated'|'skipped'."""
    mid = m.get("id")
    if not mid:
        print(f"SKIP manufacturer missing id: {m!r}", file=sys.stderr)
        return "skipped"
    portal = m.get("updatePortalUrl") or m.get("update_portal_url")
    name = m.get("name")
    if not portal or not name:
        print(f"SKIP manufacturer missing portal/name: {mid}", file=sys.stderr)
        return "skipped"

    existing = conn.execute(
        "SELECT id, created_at FROM manufacturers WHERE id = ?", (mid,)
    ).fetchone()

    aliases = dumps_json(m.get("aliases") or [])
    website = m.get("websiteUrl") or m.get("website_url")
    portal_app = m.get("portalApp") or m.get("portal_app")
    channel = m.get("updateChannel") or m.get("update_channel")
    notes = m.get("notes")

    if existing is None:
        conn.execute(
            """
            INSERT INTO manufacturers (
              id, name, aliases, website_url, update_portal_url,
              portal_app, update_channel, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (mid, name, aliases, website, portal, portal_app, channel, notes, ts, ts),
        )
        return "inserted"

    # Update identity fields; keep created_at
    conn.execute(
        """
        UPDATE manufacturers SET
          name = ?,
          aliases = ?,
          website_url = COALESCE(?, website_url),
          update_portal_url = ?,
          portal_app = COALESCE(?, portal_app),
          update_channel = COALESCE(?, update_channel),
          notes = COALESCE(?, notes),
          updated_at = ?
        WHERE id = ?
        """,
        (name, aliases, website, portal, portal_app, channel, notes, ts, mid),
    )
    return "updated"


def upsert_plugin(conn: sqlite3.Connection, p: dict, ts: str, default_source: str | None) -> str:
    """Insert or update plugin identity only. Returns status string."""
    pid = p.get("id")
    if not pid:
        print(f"SKIP plugin missing id: {p!r}", file=sys.stderr)
        return "skipped"

    # Explicitly ignore untrusted version fields — never write them
    for bad in (
        "latestVersion",
        "versionEvidence",
        "versionSourceUrl",
        "versionVerifiedAt",
        "releaseDate",
        "observed_version",
    ):
        if bad in p and p[bad] is not None:
            # strip silently; do not create observations
            pass

    patterns = p.get("matchPatterns") or p.get("match_patterns")
    if not patterns:
        print(f"SKIP plugin missing matchPatterns: {pid}", file=sys.stderr)
        return "skipped"
    if isinstance(patterns, str):
        patterns = [patterns]

    mid = p.get("manufacturerId") or p.get("manufacturer_id")
    name = p.get("name")
    if not mid or not name:
        print(f"SKIP plugin missing manufacturer/name: {pid}", file=sys.stderr)
        return "skipped"

    # Ensure manufacturer exists
    if conn.execute("SELECT 1 FROM manufacturers WHERE id = ?", (mid,)).fetchone() is None:
        print(f"SKIP plugin manufacturer missing: {pid} -> {mid}", file=sys.stderr)
        return "skipped"

    identity_source = (
        p.get("identity_source")
        or p.get("identitySource")
        or default_source
        or "universe-expansion-batch"
    )
    portal = p.get("updatePortalUrl") or p.get("update_portal_url")
    formats = dumps_json(p.get("formats") or [])
    product_line = p.get("productLine") or p.get("product_line")
    bundled = 1 if p.get("bundled") else 0
    min_macos = p.get("minMacOS") or p.get("min_macos")
    supersedes = p.get("supersedesPluginId") or p.get("supersedes_plugin_id")
    superseded_by = p.get("supersededByPluginId") or p.get("superseded_by_plugin_id")
    discontinued = 1 if p.get("discontinued") else 0
    notes = p.get("notes")
    identity_kind = p.get("identity_kind") or p.get("identityKind")
    notes_for_user = p.get("notes_for_user") or p.get("notesForUser")
    patterns_json = dumps_json(patterns)

    existing = conn.execute(
        "SELECT id, created_at, identity_source FROM plugins WHERE id = ?", (pid,)
    ).fetchone()

    if existing is None:
        conn.execute(
            """
            INSERT INTO plugins (
              id, manufacturer_id, name, match_patterns, formats,
              product_line, bundled, min_macos, update_portal_url,
              supersedes_plugin_id, superseded_by_plugin_id, discontinued,
              notes, identity_source, identity_kind, notes_for_user,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pid,
                mid,
                name,
                patterns_json,
                formats,
                product_line,
                bundled,
                min_macos,
                portal,
                supersedes,
                superseded_by,
                discontinued,
                notes,
                identity_source,
                identity_kind or "plugin",
                notes_for_user,
                ts,
                ts,
            ),
        )
        return "inserted"

    # Update identity; never touch version tables. Preserve created_at.
    # Keep existing identity_source if new one is empty; otherwise set.
    conn.execute(
        """
        UPDATE plugins SET
          manufacturer_id = ?,
          name = ?,
          match_patterns = ?,
          formats = COALESCE(?, formats),
          product_line = COALESCE(?, product_line),
          bundled = ?,
          min_macos = COALESCE(?, min_macos),
          update_portal_url = COALESCE(?, update_portal_url),
          supersedes_plugin_id = COALESCE(?, supersedes_plugin_id),
          superseded_by_plugin_id = COALESCE(?, superseded_by_plugin_id),
          discontinued = ?,
          notes = COALESCE(?, notes),
          identity_source = COALESCE(?, identity_source),
          identity_kind = COALESCE(?, identity_kind),
          notes_for_user = COALESCE(?, notes_for_user),
          updated_at = ?
        WHERE id = ?
        """,
        (
            mid,
            name,
            patterns_json,
            formats,
            product_line,
            bundled,
            min_macos,
            portal,
            supersedes,
            superseded_by,
            discontinued,
            notes,
            identity_source,
            identity_kind,
            notes_for_user,
            ts,
            pid,
        ),
    )
    return "updated"


def main() -> int:
    ap = argparse.ArgumentParser(description="Upsert universe identity batch (no version wipe)")
    ap.add_argument(
        "batch",
        nargs="?",
        default=str(ROOT / "data" / "universe-expansion-batch1.json"),
        help="Path to batch JSON",
    )
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    batch_path = Path(args.batch)
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}. Run init_db.py first.", file=sys.stderr)
        return 1
    if not batch_path.is_file():
        print(f"Batch missing: {batch_path}", file=sys.stderr)
        return 1

    with batch_path.open(encoding="utf-8") as f:
        batch = json.load(f)

    manufacturers = batch.get("manufacturers") or []
    plugins = batch.get("plugins") or []
    default_source = batch.get("identity_source") or batch.get("identitySource")
    ts = now_iso()

    before_m = before_p = before_obs = before_cur = 0
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        before_m = conn.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
        before_p = conn.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
        before_obs = conn.execute("SELECT COUNT(*) FROM version_observations").fetchone()[0]
        before_cur = conn.execute("SELECT COUNT(*) FROM plugin_version_current").fetchone()[0]

        m_stats = {"inserted": 0, "updated": 0, "skipped": 0}
        p_stats = {"inserted": 0, "updated": 0, "skipped": 0}

        for m in manufacturers:
            st = upsert_manufacturer(conn, m, ts)
            m_stats[st] = m_stats.get(st, 0) + 1

        for p in plugins:
            st = upsert_plugin(conn, p, ts, default_source)
            p_stats[st] = p_stats.get(st, 0) + 1

        if args.dry_run:
            conn.rollback()
            print("DRY RUN — rolled back")
        else:
            conn.commit()

        after_m = conn.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
        after_p = conn.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
        after_obs = conn.execute("SELECT COUNT(*) FROM version_observations").fetchone()[0]
        after_cur = conn.execute("SELECT COUNT(*) FROM plugin_version_current").fetchone()[0]

        print(f"Batch: {batch_path}")
        print(f"manufacturers: inserted={m_stats['inserted']} updated={m_stats['updated']} skipped={m_stats['skipped']}")
        print(f"plugins:       inserted={p_stats['inserted']} updated={p_stats['updated']} skipped={p_stats['skipped']}")
        print(f"counts before: manufacturers={before_m} plugins={before_p} observations={before_obs} current={before_cur}")
        print(f"counts after:  manufacturers={after_m} plugins={after_p} observations={after_obs} current={after_cur}")
        if after_obs != before_obs or after_cur != before_cur:
            print(
                "WARNING: observation/current counts changed (unexpected for identity-only upsert)",
                file=sys.stderr,
            )
            return 2
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
