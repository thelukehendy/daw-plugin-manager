#!/usr/bin/env python3
"""Migrate catalog.db to schema v4: plugins.identity_kind for Electron UX.

Safe / idempotent: adds identity_kind TEXT DEFAULT 'plugin'.
Classification of remaining unknowns is applied by classify_identity_kind.py
(or re-runnable classify() in this module when --classify is passed).

identity_kind values:
  plugin | soundset | expansion | hardware | eurorack | bundle |
  suite_component | daw_stock_effect | hub_app | gen_ambiguous |
  discontinued | unknown_other
"""
from __future__ import annotations

import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

VALID_KINDS = frozenset(
    {
        "plugin",
        "soundset",
        "expansion",
        "hardware",
        "eurorack",
        "bundle",
        "suite_component",
        "daw_stock_effect",
        "hub_app",
        "gen_ambiguous",
        "discontinued",
        "unknown_other",
    }
)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {r[1] for r in conn.execute(f"PRAGMA table_info({table})")}


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        print(f"Migrating {DB_PATH} → schema v4")

        pcols = columns(conn, "plugins")
        if "identity_kind" not in pcols:
            conn.execute(
                "ALTER TABLE plugins ADD COLUMN identity_kind TEXT DEFAULT 'plugin'"
            )
            print("  + plugins.identity_kind")
            # Ensure existing rows have explicit default
            conn.execute(
                "UPDATE plugins SET identity_kind = 'plugin' "
                "WHERE identity_kind IS NULL OR identity_kind = ''"
            )
        else:
            print("  plugins.identity_kind already present")

        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_version", "4"),
        )
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_v4_migrated_at", now_iso()),
        )
        conn.commit()

        ver = conn.execute(
            "SELECT value FROM meta WHERE key='schema_version'"
        ).fetchone()[0]
        kinds = conn.execute(
            """
            SELECT COALESCE(identity_kind, 'plugin'), COUNT(*)
            FROM plugins GROUP BY 1 ORDER BY 2 DESC
            """
        ).fetchall()
        print(f"schema_version = {ver}")
        print("identity_kind distribution (all plugins):")
        for k, n in kinds:
            print(f"  {k}: {n}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
