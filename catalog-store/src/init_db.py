#!/usr/bin/env python3
"""Initialize the catalog SQLite database from schema.sql."""
from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"
SCHEMA_PATH = ROOT / "schema.sql"


def main() -> int:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(schema)
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_version", "3"),
        )
        conn.commit()
        print(f"Initialized {DB_PATH}")
        row = conn.execute(
            "SELECT value FROM meta WHERE key = 'schema_version'"
        ).fetchone()
        print(f"schema_version = {row[0]}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
