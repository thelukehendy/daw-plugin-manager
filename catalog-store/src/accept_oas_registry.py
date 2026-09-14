#!/usr/bin/env python3
"""Bulk-accept Open Audio Stack registry versions into catalog.db.

Fetches (or reads) plugins/index.json, maps slug -> oas--{slugify(slug)},
inserts version_observations + plugin_version_current matching accept_observation.py.

Usage:
  python3 src/accept_oas_registry.py              # fetch live + accept
  python3 src/accept_oas_registry.py --from-file tmp-fetch/oas-plugins-live.json
  python3 src/accept_oas_registry.py --dry-run
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import sys
import unicodedata
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"
LIVE_URL = "https://open-audio-stack.github.io/open-audio-stack-registry/plugins/index.json"
PKG_URL = "https://open-audio-stack.github.io/open-audio-stack-registry/plugins/{slug}/index.json"
EXTRACT = "oas-registry-plugins-index"
VERIFIED_BY = "coding-assistant"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii").lower()
    text = text.replace("&", " and ").replace("'", "").replace("'", "")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")[:80] or "unnamed"


def plugin_id_for(slug: str) -> str:
    return "oas--" + slugify(slug)


def content_hash(obj: dict) -> str:
    blob = json.dumps(obj, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()


def load_registry(path: Path | None) -> dict:
    if path:
        data = json.loads(path.read_text(encoding="utf-8"))
    else:
        out = ROOT / "tmp-fetch" / "oas-plugins-live.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(LIVE_URL, timeout=120) as resp:
            raw = resp.read()
        out.write_bytes(raw)
        data = json.loads(raw.decode("utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"Expected dict registry, got {type(data)}")
    return data


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from-file", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--refresh-receipts", action="store_true",
                    help="Re-accept even when current version already matches (upgrade receipts)")
    args = ap.parse_args()

    reg = load_registry(args.from_file)
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    ts = now_iso()
    accepted = skipped_current = skipped_missing = skipped_weird = refreshed = 0

    try:
        for slug, obj in reg.items():
            if not isinstance(obj, dict):
                skipped_weird += 1
                continue
            ver = obj.get("version")
            if not isinstance(ver, str) or not ver.strip():
                skipped_weird += 1
                continue
            ver = ver.strip()
            pid = plugin_id_for(slug)
            if not conn.execute("SELECT 1 FROM plugins WHERE id=?", (pid,)).fetchone():
                skipped_missing += 1
                continue

            cur = conn.execute(
                """
                SELECT vo.observed_version FROM plugin_version_current pvc
                JOIN version_observations vo ON vo.id = pvc.observation_id
                WHERE pvc.plugin_id = ?
                """,
                (pid,),
            ).fetchone()
            if cur and not args.refresh_receipts:
                skipped_current += 1
                continue
            if cur and cur[0] == ver and not args.refresh_receipts:
                skipped_current += 1
                continue

            src_url = PKG_URL.format(slug=slug)
            evidence = f"OAS registry version field: {ver}"
            chash = content_hash(obj)
            obs_id = str(uuid.uuid4())

            if args.dry_run:
                print(f"WOULD accept {pid}={ver}")
                accepted += 1
                continue

            conn.execute(
                """
                INSERT INTO version_observations (
                  id, plugin_id, observed_version, normalized_version,
                  source_url, source_kind, extract_method, evidence_snippet,
                  content_hash, lab_on_disk_version, lab_evidence,
                  status, reject_reason, verified_at, verified_by, created_at
                ) VALUES (?, ?, ?, ?, ?, 'vendorFeed', ?, ?, ?, NULL, NULL,
                          'accepted', NULL, ?, ?, ?)
                """,
                (obs_id, pid, ver, ver, src_url, EXTRACT, evidence, chash, ts, VERIFIED_BY, ts),
            )
            prev = conn.execute(
                "SELECT observation_id FROM plugin_version_current WHERE plugin_id=?",
                (pid,),
            ).fetchone()
            if prev:
                conn.execute(
                    "UPDATE version_observations SET status='superseded' WHERE id=?",
                    (prev[0],),
                )
                refreshed += 1
            conn.execute(
                """
                INSERT INTO plugin_version_current (plugin_id, observation_id, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(plugin_id) DO UPDATE SET
                  observation_id=excluded.observation_id,
                  updated_at=excluded.updated_at
                """,
                (pid, obs_id, ts),
            )
            accepted += 1

        if not args.dry_run:
            conn.commit()
    finally:
        conn.close()

    print(
        f"OAS accept: accepted={accepted} refreshed_supersede={refreshed} "
        f"skipped_current={skipped_current} skipped_missing={skipped_missing} "
        f"skipped_weird={skipped_weird} registry={len(reg)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
