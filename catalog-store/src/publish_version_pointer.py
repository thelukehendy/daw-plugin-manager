#!/usr/bin/env python3
"""Publish the immutable catalog feed pointer.

After the daily push commits catalog/catalog.json and the remote ref is
verified, run:

    python3 catalog-store/src/publish_version_pointer.py --commit <full-sha>

It writes catalog/catalog-version.json, a tiny pointer the app fetches to
discover the current catalog build. The app then downloads catalog.json
pinned to <commit> via jsDelivr — an immutable URL, so CDN caching can never
serve stale data.

The pointer commit is pushed separately (the catalog commit must exist first,
because the pointer names it). Push via the Git Data API script, never plain
`git push`.
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CATALOG_FILE = REPO_ROOT / "catalog" / "catalog.json"
POINTER_FILE = REPO_ROOT / "catalog" / "catalog-version.json"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--commit", required=True,
                    help="Full 40-char SHA of the commit containing catalog/catalog.json")
    ap.add_argument("--repo-root", default=str(REPO_ROOT))
    args = ap.parse_args()

    commit = args.commit.strip()
    if len(commit) != 40 or any(c not in "0123456789abcdef" for c in commit.lower()):
        print(f"error: --commit must be a full 40-char SHA, got {commit!r}", file=sys.stderr)
        return 2

    root = Path(args.repo_root)
    catalog = root / "catalog" / "catalog.json"
    if not catalog.exists():
        print(f"error: {catalog} not found", file=sys.stderr)
        return 2

    raw = catalog.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    data = json.loads(raw)

    manufacturers = data.get("manufacturers", [])
    plugins = data.get("plugins", [])
    tier1 = sum(1 for p in plugins if p.get("popularityTier") == 1)

    pointer = {
        "feedVersion": 1,
        "buildId": data.get("updatedAt"),
        "catalogCommit": commit,
        "catalogFile": "catalog/catalog.json",
        "sha256": digest,
        "sizeBytes": len(raw),
        "schemaVersion": data.get("schemaVersion"),
        "publishedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "counts": {
            "manufacturers": len(manufacturers),
            "plugins": len(plugins),
            "tier1Plugins": tier1,
        },
        "endpoints": {
            "jsdelivrPinned": (
                "https://cdn.jsdelivr.net/gh/thelukehendy/daw-plugin-manager"
                f"@{commit}/catalog/catalog.json"
            ),
            "rawPinned": (
                "https://raw.githubusercontent.com/thelukehendy/daw-plugin-manager"
                f"/{commit}/catalog/catalog.json"
            ),
        },
    }

    out = root / "catalog" / "catalog-version.json"
    out.write_text(json.dumps(pointer, indent=2) + "\n")
    print(json.dumps(pointer, indent=2))
    print(f"\nwrote {out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
