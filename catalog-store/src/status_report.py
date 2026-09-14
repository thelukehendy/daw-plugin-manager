#!/usr/bin/env python3
"""One-page STATUS numbers for the DAW plugin catalog store (live from DB)."""
from __future__ import annotations

import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    try:
        schema = conn.execute(
            "SELECT value FROM meta WHERE key='schema_version'"
        ).fetchone()
        schema_v = schema[0] if schema else "?"

        mfg = conn.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
        plugins = conn.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
        accepted = conn.execute(
            """
            SELECT COUNT(*) FROM plugin_version_current c
            JOIN version_observations o ON o.id = c.observation_id
            WHERE o.status = 'accepted'
            """
        ).fetchone()[0]
        without = plugins - accepted

        bands = conn.execute(
            """
            SELECT
              SUM(CASE WHEN o.confidence >= 85 THEN 1 ELSE 0 END),
              SUM(CASE WHEN o.confidence BETWEEN 70 AND 84 THEN 1 ELSE 0 END),
              SUM(CASE WHEN o.confidence < 70 THEN 1 ELSE 0 END),
              SUM(CASE WHEN o.confidence = 60 THEN 1 ELSE 0 END)
            FROM plugin_version_current c
            JOIN version_observations o ON o.id = c.observation_id
            WHERE o.status = 'accepted'
            """
        ).fetchone()
        green, amber, yellow, kvr60 = bands

        print(f"schema_version (SQLite): {schema_v}")
        print(f"manufacturers:           {mfg}")
        print(f"plugins (universe):      {plugins}")
        print(f"accepted currents:       {accepted}")
        print(f"without version:         {without}")
        print()
        print("confidence bands (accepted currents):")
        print(f"  green  (≥85):  {green}")
        print(f"  amber  (70–84): {amber}")
        print(f"  yellow (<70):  {yellow}  (of which KVR@60: {kvr60})")
        print()
        print("unknowns by identity_kind:")
        rows = conn.execute(
            """
            SELECT COALESCE(identity_kind, 'NULL') AS ik, COUNT(*) AS n
            FROM plugins p
            WHERE NOT EXISTS (
              SELECT 1 FROM plugin_version_current c WHERE c.plugin_id = p.id
            )
            GROUP BY 1
            ORDER BY n DESC, ik
            """
        ).fetchall()
        true_gaps = 0
        for ik, n in rows:
            mark = "  ← true plugin gaps" if ik == "plugin" else ""
            print(f"  {ik}: {n}{mark}")
            if ik == "plugin":
                true_gaps = n
        if true_gaps:
            print()
            print("true plugin gaps (ids):")
            for (pid,) in conn.execute(
                """
                SELECT p.id FROM plugins p
                WHERE COALESCE(p.identity_kind, 'plugin') = 'plugin'
                  AND NOT EXISTS (
                    SELECT 1 FROM plugin_version_current c WHERE c.plugin_id = p.id
                  )
                ORDER BY p.id
                """
            ):
                print(f"  {pid}")

        pb = conn.execute("SELECT COUNT(*) FROM manufacturer_playbooks").fetchone()[0]
        pb_hub = conn.execute(
            "SELECT COUNT(*) FROM manufacturer_playbooks WHERE hub_walled=1"
        ).fetchone()[0]
        portal = conn.execute(
            "SELECT COUNT(*) FROM plugins WHERE portal_app IS NOT NULL AND portal_app != ''"
        ).fetchone()[0]
        ilok = conn.execute(
            "SELECT COUNT(*) FROM plugins WHERE requires_ilok = 1"
        ).fetchone()[0]
        free = conn.execute(
            "SELECT COUNT(*) FROM plugins WHERE is_freeware = 1"
        ).fetchone()[0]
        bundled = conn.execute(
            "SELECT COUNT(*) FROM plugins WHERE bundled = 1"
        ).fetchone()[0]
        succ = conn.execute(
            """
            SELECT COUNT(*) FROM plugins
            WHERE successor_plugin_id IS NOT NULL AND successor_plugin_id != ''
            """
        ).fetchone()[0]
        ik_non = conn.execute(
            """
            SELECT COUNT(*) FROM plugins
            WHERE identity_kind IS NOT NULL AND identity_kind != 'plugin'
            """
        ).fetchone()[0]

        obs = dict(
            conn.execute(
                "SELECT status, COUNT(*) FROM version_observations GROUP BY status"
            ).fetchall()
        )

        print()
        print(f"playbooks (DB rows):     {pb}  (hub_walled={pb_hub})")
        print(f"plugins with portalApp:  {portal}")
        print(f"requiresIlok:            {ilok}")
        print(f"isFreeware:              {free}")
        print(f"bundled:                 {bundled}")
        print(f"successorPluginId set:   {succ}")
        print(f"identityKind ≠ plugin:   {ik_non}")
        print()
        print(
            "observations: "
            f"accepted={obs.get('accepted', 0)} "
            f"superseded={obs.get('superseded', 0)} "
            f"rejected={obs.get('rejected', 0)} "
            f"total={sum(obs.values())}"
        )
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        print(f"reported_at (UTC):       {now}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
