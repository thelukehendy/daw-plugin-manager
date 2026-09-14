#!/usr/bin/env python3
"""Migrate catalog.db to schema v3: version confidence + helpful app fields.

Safe / idempotent: adds missing columns; backfills manufacturer/plugin portalApp
from playbooks + known hub map. Confidence scores are set by
backfill_confidence.py (not invented here).
"""
from __future__ import annotations

import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

OBS_NEW_COLUMNS = [
    ("confidence", "INTEGER NOT NULL DEFAULT 50"),
    ("confidence_reasons", "TEXT"),
]

PLUGIN_NEW_COLUMNS = [
    ("portal_app", "TEXT"),
    ("update_channel", "TEXT"),
    ("is_freeware", "INTEGER"),
    ("requires_ilok", "INTEGER"),
    ("notes_for_user", "TEXT"),
]

# manufacturer_id → portal app (HUB_WALLED + playbooks)
HUB_PORTAL_BY_MFG: dict[str, str] = {
    "avid": "Avid Link",
    "digidesign": "Avid Link",
    "air": "inMusic Software Center",
    "slate-digital": "inMusic Software Center",
    "slate": "inMusic Software Center",
    "eiosis": "inMusic Software Center",
    "steven-slate": "Steven Slate account",
    "plugin-alliance": "PA Installation Manager",
    "audiopunks": "PA Installation Manager",
    "united-plugins": "UnitedPluginsManager",
    "steinberg": "Steinberg Download Assistant",
    "spectralayers-bridge": "Steinberg Download Assistant",
    "focusrite": "Focusrite customer portal",
    "spectrasonics": "Spectrasonics account",
    "waves": "Waves Central",
    "native-instruments": "Native Access",
    "guitar-rig-5": "Native Access",
    "reaktor-6": "Native Access",
    "softube": "Softube Central",
    "ik-multimedia": "IK Product Manager",
    "universal-audio": "UA Connect",
    "izotope": "iZotope Product Portal",
    "accusonus": "iZotope Product Portal",
    "arturia": "Arturia Software Center",
    "toontrack": "Toontrack Product Manager",
    "cherry-audio": "Cherry Audio Sync",
    "hornet": "HoRNet DoIn",
    "ssl": "SSL Download Manager",
    "harrison": "SSL Download Manager",
    "splice": "Splice",
    "nugen-audio": "NUGEN My Products",
    "overloud": "Overloud account",
    "spitfire-audio": "Spitfire account",
    "meldaproduction": "MPluginManager",
    "antares": "AutoTune Central",
    "kazrog": "PluginUpdate",
    "output": "Output hub",
    "black-salt-audio": "Black Salt account",
    "eastwest": "Sounds Online",
    "uvi": "UVI Falcon / Workstation",
    "scuffham": "Scuffham account",
    "cymatics": "Cymatics downloads",
    "audiomodern": "Audiomodern account",
    "apple": "Apple system / support",
}

FREEWARE_PLUGIN_IDS = {
    "xfer-records--ott",
    "xfer-records--8-bit-shaper",
    "xfer-records--delta-modulator",
    "xfer-records--dimension-expander",
    "xfer-records--djmfilter",
    "surge-synthesizer--surge-xt",
    "surge-synthesizer--surge",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {r[1] for r in conn.execute(f"PRAGMA table_info({table})")}


def table_exists(conn: sqlite3.Connection, name: str) -> bool:
    return (
        conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)
        ).fetchone()
        is not None
    )


def add_column_if_missing(
    conn: sqlite3.Connection, table: str, col: str, decl: str, existing: set[str]
) -> bool:
    if col in existing:
        return False
    conn.execute(f"ALTER TABLE {table} ADD COLUMN {col} {decl}")
    print(f"  + {table}.{col}")
    return True


def backfill_manufacturer_portals(conn: sqlite3.Connection) -> int:
    n = 0
    # 1) From playbooks
    if table_exists(conn, "manufacturer_playbooks"):
        for mid, portal in conn.execute(
            """
            SELECT manufacturer_id, portal_app FROM manufacturer_playbooks
            WHERE portal_app IS NOT NULL AND TRIM(portal_app) != ''
            """
        ):
            cur = conn.execute(
                "SELECT portal_app FROM manufacturers WHERE id = ?", (mid,)
            ).fetchone()
            if not cur:
                continue
            if cur[0] and str(cur[0]).strip():
                continue
            conn.execute(
                "UPDATE manufacturers SET portal_app = ?, updated_at = ? WHERE id = ?",
                (portal, now_iso(), mid),
            )
            n += 1
            print(f"  mfg portal (playbook): {mid} → {portal}")

    # 2) From HUB map (fill remaining)
    for mid, portal in HUB_PORTAL_BY_MFG.items():
        cur = conn.execute(
            "SELECT portal_app FROM manufacturers WHERE id = ?", (mid,)
        ).fetchone()
        if not cur:
            continue
        if cur[0] and str(cur[0]).strip():
            continue
        conn.execute(
            "UPDATE manufacturers SET portal_app = ?, updated_at = ? WHERE id = ?",
            (portal, now_iso(), mid),
        )
        n += 1
        print(f"  mfg portal (hub map): {mid} → {portal}")
    return n


def backfill_plugin_app_fields(conn: sqlite3.Connection) -> dict[str, int]:
    stats = {"portal": 0, "freeware": 0, "ilok": 0, "notes": 0}
    if "portal_app" not in columns(conn, "plugins"):
        return stats

    mfg_portals = {
        r[0]: r[1]
        for r in conn.execute(
            """
            SELECT id, portal_app FROM manufacturers
            WHERE portal_app IS NOT NULL AND TRIM(portal_app) != ''
            """
        )
    }

    for pid, mid in conn.execute("SELECT id, manufacturer_id FROM plugins"):
        portal = mfg_portals.get(mid) or HUB_PORTAL_BY_MFG.get(mid)
        if not portal:
            continue
        row = conn.execute(
            "SELECT portal_app FROM plugins WHERE id = ?", (pid,)
        ).fetchone()
        if row and row[0] and str(row[0]).strip():
            continue
        conn.execute(
            "UPDATE plugins SET portal_app = ?, updated_at = ? WHERE id = ?",
            (portal, now_iso(), pid),
        )
        stats["portal"] += 1

    freeware_ids = set(FREEWARE_PLUGIN_IDS)
    for (pid,) in conn.execute(
        """
        SELECT DISTINCT c.plugin_id
        FROM plugin_version_current c
        JOIN version_observations o ON o.id = c.observation_id
        WHERE lower(COALESCE(o.extract_method, '')) LIKE '%freeware%'
        """
    ):
        freeware_ids.add(pid)

    for pid in sorted(freeware_ids):
        row = conn.execute(
            "SELECT is_freeware FROM plugins WHERE id = ?", (pid,)
        ).fetchone()
        if not row:
            continue
        if row[0]:
            continue
        conn.execute(
            "UPDATE plugins SET is_freeware = 1, updated_at = ? WHERE id = ?",
            (now_iso(), pid),
        )
        stats["freeware"] += 1

    # Plugin Alliance titles commonly require iLok
    cur = conn.execute(
        """
        UPDATE plugins SET requires_ilok = 1, updated_at = ?
        WHERE manufacturer_id = 'plugin-alliance'
          AND (requires_ilok IS NULL OR requires_ilok = 0)
        """,
        (now_iso(),),
    )
    stats["ilok"] = cur.rowcount

    for mid, portal in HUB_PORTAL_BY_MFG.items():
        hint = f"Updates via {portal} (hub-walled — no public installer semver)."
        cur = conn.execute(
            """
            UPDATE plugins SET notes_for_user = ?, updated_at = ?
            WHERE manufacturer_id = ?
              AND (notes_for_user IS NULL OR notes_for_user = '')
              AND id NOT IN (SELECT plugin_id FROM plugin_version_current)
            """,
            (hint, now_iso(), mid),
        )
        stats["notes"] += cur.rowcount

    return stats


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        print(f"Migrating {DB_PATH} → schema v3")

        obs_cols = columns(conn, "version_observations")
        added = 0
        for col, decl in OBS_NEW_COLUMNS:
            if add_column_if_missing(
                conn, "version_observations", col, decl, obs_cols
            ):
                added += 1
                obs_cols.add(col)

        pcols = columns(conn, "plugins")
        for col, decl in PLUGIN_NEW_COLUMNS:
            if add_column_if_missing(conn, "plugins", col, decl, pcols):
                added += 1
                pcols.add(col)

        print("Backfilling manufacturer portalApp…")
        mfg_n = backfill_manufacturer_portals(conn)
        print(f"  manufacturers portal filled: {mfg_n}")

        print("Backfilling plugin app fields…")
        pstats = backfill_plugin_app_fields(conn)
        print(
            f"  plugins portalApp={pstats['portal']} "
            f"freeware={pstats['freeware']} "
            f"ilok={pstats['ilok']} "
            f"notesForUser={pstats['notes']}"
        )

        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_version", "3"),
        )
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_v3_migrated_at", now_iso()),
        )
        conn.commit()

        ver = conn.execute(
            "SELECT value FROM meta WHERE key='schema_version'"
        ).fetchone()[0]
        print(f"Added {added} columns; schema_version = {ver}")
        with_portal = conn.execute(
            """
            SELECT COUNT(*) FROM plugins
            WHERE portal_app IS NOT NULL AND portal_app != ''
            """
        ).fetchone()[0]
        print(f"plugins with portal_app: {with_portal}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
