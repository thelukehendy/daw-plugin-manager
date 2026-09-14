#!/usr/bin/env python3
"""Print catalog store counts."""
from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    try:
        mfg = conn.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
        plugins = conn.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
        print(f"manufacturers: {mfg}")
        print(f"plugins:       {plugins}")

        print("observations by status:")
        rows = conn.execute(
            """
            SELECT status, COUNT(*) FROM version_observations
            GROUP BY status ORDER BY status
            """
        ).fetchall()
        if not rows:
            print("  (none)")
        else:
            for status, n in rows:
                print(f"  {status}: {n}")
        total_obs = conn.execute(
            "SELECT COUNT(*) FROM version_observations"
        ).fetchone()[0]
        print(f"observations total: {total_obs}")

        with_cur = conn.execute(
            "SELECT COUNT(*) FROM plugin_version_current"
        ).fetchone()[0]
        without = plugins - with_cur
        print(f"plugins with current version:    {with_cur}")
        print(f"plugins without current version: {without}")

        accepted_cur = conn.execute(
            """
            SELECT COUNT(*) FROM plugin_version_current c
            JOIN version_observations o ON o.id = c.observation_id
            WHERE o.status = 'accepted'
            """
        ).fetchone()[0]
        print(f"plugins with accepted current:   {accepted_cur}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
