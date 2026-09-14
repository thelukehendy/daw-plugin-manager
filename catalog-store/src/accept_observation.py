#!/usr/bin/env python3
"""CLI: insert a version observation and optionally set it as current (accepted)."""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

VALID_KINDS = {
    "vendorFeed",
    "releaseNotesPage",
    "productPage",
    "downloadsPage",
    "labOnDisk",
    "other",
}
VALID_STATUSES = {"candidate", "accepted", "rejected", "superseded"}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def columns(conn: sqlite3.Connection, table: str) -> set[str]:
    return {r[1] for r in conn.execute(f"PRAGMA table_info({table})")}


def main() -> int:
    ap = argparse.ArgumentParser(description="Insert version observation")
    ap.add_argument("--plugin-id", required=True)
    ap.add_argument("--version", required=True, help="observed_version")
    ap.add_argument("--source-url", required=True)
    ap.add_argument("--source-kind", required=True, choices=sorted(VALID_KINDS))
    ap.add_argument(
        "--status",
        default="candidate",
        choices=sorted(VALID_STATUSES),
    )
    ap.add_argument(
        "--set-current",
        action="store_true",
        help="Mark accepted and set plugin_version_current",
    )
    ap.add_argument("--normalized-version")
    ap.add_argument("--extract-method")
    ap.add_argument("--evidence-snippet")
    ap.add_argument("--content-hash")
    ap.add_argument("--verified-by")
    ap.add_argument("--reject-reason")
    ap.add_argument(
        "--confidence",
        type=int,
        help="0-100 confidence (default 50 if column exists and omitted)",
    )
    ap.add_argument(
        "--confidence-reason",
        action="append",
        default=[],
        help="Reason string (repeatable); stored as JSON array",
    )
    args = ap.parse_args()

    if args.set_current:
        args.status = "accepted"

    if args.confidence is not None and not (0 <= args.confidence <= 100):
        print("--confidence must be 0-100", file=sys.stderr)
        return 1

    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        row = conn.execute(
            "SELECT id FROM plugins WHERE id = ?", (args.plugin_id,)
        ).fetchone()
        if not row:
            print(f"Unknown plugin_id: {args.plugin_id}", file=sys.stderr)
            return 1

        obs_id = str(uuid.uuid4())
        ts = now_iso()
        verified_at = ts if args.status == "accepted" else None
        ocols = columns(conn, "version_observations")
        has_conf = "confidence" in ocols

        if has_conf:
            conf = 50 if args.confidence is None else args.confidence
            reasons = args.confidence_reason or (
                [f"manual accept via CLI (confidence={conf})"]
            )
            conn.execute(
                """
                INSERT INTO version_observations (
                  id, plugin_id, observed_version, normalized_version,
                  source_url, source_kind, extract_method, evidence_snippet,
                  content_hash, lab_on_disk_version, lab_evidence,
                  status, reject_reason, verified_at, verified_by,
                  confidence, confidence_reasons, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    obs_id,
                    args.plugin_id,
                    args.version,
                    args.normalized_version or args.version,
                    args.source_url,
                    args.source_kind,
                    args.extract_method,
                    args.evidence_snippet,
                    args.content_hash,
                    args.status,
                    args.reject_reason,
                    verified_at,
                    args.verified_by,
                    conf,
                    json.dumps(reasons, ensure_ascii=False),
                    ts,
                ),
            )
        else:
            conn.execute(
                """
                INSERT INTO version_observations (
                  id, plugin_id, observed_version, normalized_version,
                  source_url, source_kind, extract_method, evidence_snippet,
                  content_hash, lab_on_disk_version, lab_evidence,
                  status, reject_reason, verified_at, verified_by, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?)
                """,
                (
                    obs_id,
                    args.plugin_id,
                    args.version,
                    args.normalized_version or args.version,
                    args.source_url,
                    args.source_kind,
                    args.extract_method,
                    args.evidence_snippet,
                    args.content_hash,
                    args.status,
                    args.reject_reason,
                    verified_at,
                    args.verified_by,
                    ts,
                ),
            )

        if args.set_current:
            prev = conn.execute(
                "SELECT observation_id FROM plugin_version_current WHERE plugin_id = ?",
                (args.plugin_id,),
            ).fetchone()
            if prev:
                conn.execute(
                    "UPDATE version_observations SET status = 'superseded' WHERE id = ?",
                    (prev[0],),
                )
            conn.execute(
                """
                INSERT INTO plugin_version_current (plugin_id, observation_id, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(plugin_id) DO UPDATE SET
                  observation_id = excluded.observation_id,
                  updated_at = excluded.updated_at
                """,
                (args.plugin_id, obs_id, ts),
            )

        conn.commit()
        extra = f" confidence={args.confidence}" if has_conf else ""
        if has_conf and args.confidence is None:
            extra = " confidence=50"
        print(
            f"observation_id={obs_id} status={args.status} "
            f"set_current={args.set_current}{extra}"
        )
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
