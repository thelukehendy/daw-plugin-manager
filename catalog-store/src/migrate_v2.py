#!/usr/bin/env python3
"""Migrate catalog.db to schema v2: micro/macro columns + manufacturer_playbooks.

Safe / idempotent: adds missing columns and tables; backfills obvious gen pairs
without inventing version numbers.
"""
from __future__ import annotations

import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

PLUGIN_NEW_COLUMNS = [
    ("generation", "TEXT"),
    ("generation_rank", "INTEGER"),
    ("update_class", "TEXT DEFAULT 'unknown'"),
    ("successor_plugin_id", "TEXT"),
    ("predecessor_plugin_id", "TEXT"),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def table_exists(conn: sqlite3.Connection, name: str) -> bool:
    row = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)
    ).fetchone()
    return row is not None


def columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {r[1] for r in conn.execute(f"PRAGMA table_info({table})")}


def add_column_if_missing(
    conn: sqlite3.Connection, table: str, col: str, decl: str, existing: set[str]
) -> bool:
    if col in existing:
        return False
    conn.execute(f"ALTER TABLE {table} ADD COLUMN {col} {decl}")
    print(f"  + {table}.{col}")
    return True


def ensure_playbooks(conn: sqlite3.Connection) -> None:
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


def ensure_indexes(conn: sqlite3.Connection) -> None:
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_plugins_product_line ON plugins(product_line)"
    )
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_plugins_successor ON plugins(successor_plugin_id)"
    )


def plugin_exists(conn: sqlite3.Connection, pid: str) -> bool:
    return (
        conn.execute("SELECT 1 FROM plugins WHERE id=?", (pid,)).fetchone()
        is not None
    )


def link_pair(
    conn: sqlite3.Connection,
    older_id: str,
    newer_id: str,
    *,
    product_line: str,
    older_gen: str,
    newer_gen: str,
    older_rank: int,
    newer_rank: int,
    older_class: str = "paid_upgrade",
    newer_class: str = "free_current",
) -> bool:
    """Set successor/predecessor + align legacy supersedes fields. No version writes."""
    if not plugin_exists(conn, older_id) or not plugin_exists(conn, newer_id):
        print(f"  skip missing pair {older_id} → {newer_id}")
        return False
    ts = now_iso()
    # older: points forward to paid successor
    conn.execute(
        """
        UPDATE plugins SET
          product_line = COALESCE(NULLIF(product_line, ''), ?),
          generation = ?,
          generation_rank = ?,
          update_class = ?,
          successor_plugin_id = ?,
          superseded_by_plugin_id = ?,
          updated_at = ?
        WHERE id = ?
        """,
        (
            product_line,
            older_gen,
            older_rank,
            older_class,
            newer_id,
            newer_id,
            ts,
            older_id,
        ),
    )
    # newer: points back to predecessor
    conn.execute(
        """
        UPDATE plugins SET
          product_line = COALESCE(NULLIF(product_line, ''), ?),
          generation = ?,
          generation_rank = ?,
          update_class = ?,
          predecessor_plugin_id = ?,
          supersedes_plugin_id = ?,
          updated_at = ?
        WHERE id = ?
        """,
        (
            product_line,
            newer_gen,
            newer_rank,
            newer_class,
            older_id,
            older_id,
            ts,
            newer_id,
        ),
    )
    print(f"  linked {older_id} → {newer_id} ({product_line})")
    return True


def mark_free_current(
    conn: sqlite3.Connection,
    plugin_id: str,
    *,
    product_line: str | None = None,
    generation: str | None = None,
    generation_rank: int | None = None,
) -> None:
    if not plugin_exists(conn, plugin_id):
        return
    ts = now_iso()
    conn.execute(
        """
        UPDATE plugins SET
          product_line = COALESCE(?, product_line),
          generation = COALESCE(?, generation),
          generation_rank = COALESCE(?, generation_rank),
          update_class = CASE
            WHEN update_class IS NULL OR update_class = 'unknown'
              THEN 'free_current'
            ELSE update_class
          END,
          updated_at = ?
        WHERE id = ?
        """,
        (product_line, generation, generation_rank, ts, plugin_id),
    )


def backfill_generation_pairs(conn: sqlite3.Connection) -> int:
    """Obvious name-based gen pairs only; do not invent versions."""
    n = 0

    # --- FabFilter ---
    # Pro-Q 3 → Pro-Q 4 (two seed IDs for Pro-Q 3)
    # Link duplicate Pro-Q 3 id first, then canonical, so predecessor on Q4 is canonical
    for older in ("fabfilter--pro-q-3", "fabfilter--fabfilter-pro-q-3"):
        if link_pair(
            conn,
            older,
            "fabfilter--fabfilter-pro-q-4",
            product_line="FabFilter Pro-Q",
            older_gen="3",
            newer_gen="4",
            older_rank=3,
            newer_rank=4,
        ):
            n += 1
    if link_pair(
        conn,
        "fabfilter--fabfilter-pro-c-2",
        "fabfilter--fabfilter-pro-c-3",
        product_line="FabFilter Pro-C",
        older_gen="2",
        newer_gen="3",
        older_rank=2,
        newer_rank=3,
    ):
        n += 1

    # Current-gen FabFilter singles (no predecessor in universe)
    for pid, line, gen, rank in [
        ("fabfilter--fabfilter-pro-l-2", "FabFilter Pro-L", "2", 2),
        ("fabfilter--fabfilter-pro-r-2", "FabFilter Pro-R", "2", 2),
        ("fabfilter--fabfilter-saturn-2", "FabFilter Saturn", "2", 2),
        ("fabfilter--fabfilter-timeless-3", "FabFilter Timeless", "3", 3),
        ("fabfilter--fabfilter-twin-3", "FabFilter Twin", "3", 3),
        ("fabfilter--fabfilter-volcano-3", "FabFilter Volcano", "3", 3),
        ("fabfilter--fabfilter-pro-ds", "FabFilter Pro-DS", "1", 1),
        ("fabfilter--fabfilter-pro-g", "FabFilter Pro-G", "1", 1),
        ("fabfilter--fabfilter-pro-mb", "FabFilter Pro-MB", "1", 1),
        ("fabfilter--fabfilter-micro", "FabFilter Micro", "1", 1),
        ("fabfilter--fabfilter-one", "FabFilter One", "1", 1),
        ("fabfilter--fabfilter-simplon", "FabFilter Simplon", "1", 1),
    ]:
        mark_free_current(
            conn, pid, product_line=line, generation=gen, generation_rank=rank
        )

    # --- iZotope Ozone 9 → 11 (host + shared modules) ---
    if link_pair(
        conn,
        "izotope--ozone-9",
        "izotope--ozone-11",
        product_line="iZotope Ozone",
        older_gen="9",
        newer_gen="11",
        older_rank=9,
        newer_rank=11,
    ):
        n += 1
    # Elements: Ozone 9 Elements has no Ozone 11 Elements in universe → paid_upgrade
    # toward host Ozone 11 (macro path users take)
    if plugin_exists(conn, "izotope--ozone-9-elements") and plugin_exists(
        conn, "izotope--ozone-11"
    ):
        # Don't overwrite Ozone 11 predecessor (already Ozone 9). Just mark Elements.
        ts = now_iso()
        conn.execute(
            """
            UPDATE plugins SET
              product_line = 'iZotope Ozone',
              generation = '9',
              generation_rank = 9,
              update_class = 'paid_upgrade',
              successor_plugin_id = 'izotope--ozone-11',
              superseded_by_plugin_id = 'izotope--ozone-11',
              updated_at = ?
            WHERE id = 'izotope--ozone-9-elements'
            """,
            (ts,),
        )
        print("  marked izotope--ozone-9-elements → izotope--ozone-11")
        n += 1

    module_map = [
        ("dynamic-eq", "Dynamic EQ"),
        ("dynamics", "Dynamics"),
        ("equalizer", "Equalizer"),
        ("exciter", "Exciter"),
        ("imager", "Imager"),
        ("low-end-focus", "Low End Focus"),
        ("master-rebalance", "Master Rebalance"),
        ("match-eq", "Match EQ"),
        ("maximizer", "Maximizer"),
        ("spectral-shaper", "Spectral Shaper"),
        ("vintage-compressor", "Vintage Compressor"),
        ("vintage-eq", "Vintage EQ"),
        ("vintage-limiter", "Vintage Limiter"),
        ("vintage-tape", "Vintage Tape"),
    ]
    for slug, label in module_map:
        older = f"izotope--ozone-9-{slug}"
        newer = f"izotope--ozone-11-{slug}"
        if link_pair(
            conn,
            older,
            newer,
            product_line=f"iZotope Ozone / {label}",
            older_gen="9",
            newer_gen="11",
            older_rank=9,
            newer_rank=11,
        ):
            n += 1
    # Ozone 11-only modules
    for slug in ("clarity", "impact", "stabilizer"):
        mark_free_current(
            conn,
            f"izotope--ozone-11-{slug}",
            product_line="iZotope Ozone",
            generation="11",
            generation_rank=11,
        )

    # Neutron 3 Elements → Neutron 5
    if link_pair(
        conn,
        "izotope--neutron-3-elements",
        "izotope--neutron-5",
        product_line="iZotope Neutron",
        older_gen="3",
        newer_gen="5",
        older_rank=3,
        newer_rank=5,
    ):
        n += 1
    for r in conn.execute(
        "SELECT id FROM plugins WHERE id LIKE 'izotope--neutron-5-%'"
    ):
        mark_free_current(
            conn,
            r[0],
            product_line="iZotope Neutron",
            generation="5",
            generation_rank=5,
        )

    # Trash 2 → Trash (reimagined)
    if link_pair(
        conn,
        "izotope--izotope-trash-2",
        "izotope--trash",
        product_line="iZotope Trash",
        older_gen="2",
        newer_gen="1",
        older_rank=2,
        newer_rank=3,  # reimagined is successor gen despite "1.x" versioning
    ):
        n += 1

    # Iris 2 — no Iris successor in universe; leave generation only
    mark_free_current(
        conn,
        "izotope--iris-2",
        product_line="iZotope Iris",
        generation="2",
        generation_rank=2,
    )
    # Nectar 3 Elements — no Nectar 4 in universe
    mark_free_current(
        conn,
        "izotope--nectar-3-elements",
        product_line="iZotope Nectar",
        generation="3",
        generation_rank=3,
    )

    # RX modules: 8 → 9 → 11 by shared module suffix
    def rx_suffix(name: str, gen: int) -> str:
        return name.replace(f"RX {gen} ", "").strip().lower()

    by_gen: dict[int, dict[str, str]] = {}
    for gen in (8, 9, 11):
        by_gen[gen] = {}
        for r in conn.execute(
            "SELECT id, name FROM plugins WHERE id LIKE ?",
            (f"izotope--rx-{gen}-%",),
        ):
            by_gen[gen][rx_suffix(r["name"], gen)] = r["id"]

    # 8 → 9
    for suf, older in by_gen[8].items():
        newer = by_gen[9].get(suf)
        if newer and link_pair(
            conn,
            older,
            newer,
            product_line=f"iZotope RX / {suf}",
            older_gen="8",
            newer_gen="9",
            older_rank=8,
            newer_rank=9,
        ):
            n += 1
    # 9 → 11 (overwrite 9's successor to 11 — preferred paid next)
    for suf, older in by_gen[9].items():
        newer = by_gen[11].get(suf)
        if newer and link_pair(
            conn,
            older,
            newer,
            product_line=f"iZotope RX / {suf}",
            older_gen="9",
            newer_gen="11",
            older_rank=9,
            newer_rank=11,
        ):
            n += 1
            # if 8 exists for same module, also point 8 → 11 as ultimate successor?
            # Keep 8→9 as immediate; 9→11 as next. Optional: leave 8.successor=9.
    # 11-only modules
    for suf, pid in by_gen[11].items():
        if suf not in by_gen[9]:
            mark_free_current(
                conn,
                pid,
                product_line=f"iZotope RX / {suf}",
                generation="11",
                generation_rank=11,
            )
    # Ambiguous generic RX SKU
    mark_free_current(
        conn, "izotope--rx", product_line="iZotope RX", generation=None, generation_rank=None
    )

    # --- Plugin Alliance clear pairs ---
    if link_pair(
        conn,
        "plugin-alliance--bx-xl-v2",
        "plugin-alliance--bx-xl-v3",
        product_line="Brainworx bx_XL",
        older_gen="V2",
        newer_gen="V3",
        older_rank=2,
        newer_rank=3,
    ):
        n += 1
    if link_pair(
        conn,
        "plugin-alliance--spl-vitalizer-mk2-t",
        "plugin-alliance--spl-vitalizer-mk3-t",
        product_line="SPL Vitalizer",
        older_gen="MK2-T",
        newer_gen="MK3-T",
        older_rank=2,
        newer_rank=3,
    ):
        n += 1
    # bx_boom → bx_boom V3
    if plugin_exists(conn, "plugin-alliance--bx-boom") and plugin_exists(
        conn, "plugin-alliance--bx-boom-v3"
    ):
        if link_pair(
            conn,
            "plugin-alliance--bx-boom",
            "plugin-alliance--bx-boom-v3",
            product_line="Brainworx bx_boom",
            older_gen="1",
            newer_gen="V3",
            older_rank=1,
            newer_rank=3,
        ):
            n += 1
    # bx_refinement → bx_refinement V3
    if plugin_exists(conn, "plugin-alliance--bx-refinement") and plugin_exists(
        conn, "plugin-alliance--bx-refinement-v3"
    ):
        if link_pair(
            conn,
            "plugin-alliance--bx-refinement",
            "plugin-alliance--bx-refinement-v3",
            product_line="Brainworx bx_refinement",
            older_gen="1",
            newer_gen="V3",
            older_rank=1,
            newer_rank=3,
        ):
            n += 1

    # --- Valhalla: no paid gen successors in universe (version majors ≠ product SKUs) ---
    for r in conn.execute(
        "SELECT id, name FROM plugins WHERE manufacturer_id='valhalla-dsp'"
    ):
        mark_free_current(
            conn,
            r["id"],
            product_line=r["name"],
            generation="1",
            generation_rank=1,
        )

    # Bundled / discontinued flags → update_class
    conn.execute(
        """
        UPDATE plugins SET update_class = 'bundled'
        WHERE bundled = 1 AND (update_class IS NULL OR update_class IN ('unknown', 'free_current'))
        """
    )
    conn.execute(
        """
        UPDATE plugins SET update_class = 'discontinued'
        WHERE discontinued = 1 AND (update_class IS NULL OR update_class = 'unknown')
        """
    )

    return n


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        print(f"Migrating {DB_PATH} → schema v2")

        existing = columns(conn, "plugins")
        added = 0
        for col, decl in PLUGIN_NEW_COLUMNS:
            if add_column_if_missing(conn, "plugins", col, decl, existing):
                added += 1
                existing.add(col)

        # Normalize update_class default for existing rows
        conn.execute(
            """
            UPDATE plugins SET update_class = 'unknown'
            WHERE update_class IS NULL OR update_class = ''
            """
        )

        ensure_playbooks(conn)
        ensure_indexes(conn)

        print("Backfilling generation pairs…")
        n = backfill_generation_pairs(conn)

        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_version", "2"),
        )
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("schema_v2_migrated_at", now_iso()),
        )
        conn.commit()

        # Summary
        counts = conn.execute(
            """
            SELECT update_class, COUNT(*) FROM plugins
            GROUP BY update_class ORDER BY COUNT(*) DESC
            """
        ).fetchall()
        succ = conn.execute(
            "SELECT COUNT(*) FROM plugins WHERE successor_plugin_id IS NOT NULL"
        ).fetchone()[0]
        print(f"Added {added} plugin columns; linked/marked {n} generation relations")
        print(f"plugins with successor_plugin_id: {succ}")
        print("update_class distribution:")
        for c, k in counts:
            print(f"  {c}: {k}")
        ver = conn.execute(
            "SELECT value FROM meta WHERE key='schema_version'"
        ).fetchone()[0]
        print(f"schema_version = {ver}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
