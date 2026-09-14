#!/usr/bin/env python3
"""Export PluginCatalog schemaVersion 3 JSON (Policy A / strict versions).

Forward-compatible v2/v3 fields (generation, updateClass, successorPluginId,
versionConfidence, portalApp, identityKind, …) are emitted on plugin objects only when
non-null so older Electron clients can ignore unknown keys.
"""
from __future__ import annotations

import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"
OUT_PATH = ROOT / "out" / "catalog.json"

SOURCE_KIND_TO_EVIDENCE = {
    "vendorFeed": "manufacturer-feed",
    "labOnDisk": "agent-verified",
    "releaseNotesPage": "page-confirmed",
    "productPage": "page-confirmed",
    "downloadsPage": "page-confirmed",
    "other": "page-confirmed",  # prefer page-confirmed over curated-seed
}

# Optional identity / gen fields → camelCase export keys (omit when null/empty)
OPTIONAL_PLUGIN_FIELDS = [
    ("generation", "generation"),
    ("generation_rank", "generationRank"),
    ("update_class", "updateClass"),
    ("successor_plugin_id", "successorPluginId"),
    ("predecessor_plugin_id", "predecessorPluginId"),
    ("supersedes_plugin_id", "supersedesPluginId"),
    ("superseded_by_plugin_id", "supersededByPluginId"),
]

# v3 helpful app fields (omit when null/empty/0 as appropriate)
HELPFUL_BOOL_FIELDS = [
    ("is_freeware", "isFreeware"),
    ("requires_ilok", "requiresIlok"),
    ("discontinued", "discontinued"),
]
HELPFUL_TEXT_FIELDS = [
    ("portal_app", "portalApp"),
    ("update_channel", "updateChannel"),
    ("notes_for_user", "notesForUser"),
]

# v4 identity kind — emit identityKind only when not the default 'plugin'
IDENTITY_KIND_COL = "identity_kind"
IDENTITY_KIND_KEY = "identityKind"
IDENTITY_KIND_DEFAULT = "plugin"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def loads_json(s: str | None, default=None):
    if s is None or s == "":
        return default if default is not None else None
    return json.loads(s)


def plugin_columns(conn: sqlite3.Connection) -> set[str]:
    return {r[1] for r in conn.execute("PRAGMA table_info(plugins)")}


def obs_columns(conn: sqlite3.Connection) -> set[str]:
    return {r[1] for r in conn.execute("PRAGMA table_info(version_observations)")}


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        pcols = plugin_columns(conn)
        ocols = obs_columns(conn)
        has_v2 = "successor_plugin_id" in pcols
        has_confidence = "confidence" in ocols

        manufacturers_out = []
        mcols = {r[1] for r in conn.execute("PRAGMA table_info(manufacturers)")}
        for m in conn.execute("SELECT * FROM manufacturers ORDER BY name"):
            portal = m["update_portal_url"]
            if not portal or not (
                portal.startswith("http://") or portal.startswith("https://")
            ):
                print(
                    f"VALIDATE FAIL: manufacturer {m['id']} missing http(s) portal",
                    file=sys.stderr,
                )
                return 1
            entry = {
                "id": m["id"],
                "name": m["name"],
                "updatePortalUrl": portal,
            }
            if m["website_url"]:
                entry["websiteUrl"] = m["website_url"]
            aliases = loads_json(m["aliases"], [])
            if aliases:
                entry["aliases"] = aliases
            if m["portal_app"]:
                entry["portalApp"] = m["portal_app"]
            if m["update_channel"]:
                entry["updateChannel"] = m["update_channel"]
            # v5 app-facing compat data (see DATA-DICTIONARY.md)
            if "apple_silicon" in mcols and m["apple_silicon"] not in (None, "", "unknown"):
                entry["appleSilicon"] = m["apple_silicon"]
            if "version_scheme" in mcols and m["version_scheme"]:
                entry["versionScheme"] = m["version_scheme"]
            if "version_example" in mcols and m["version_example"]:
                entry["versionExample"] = m["version_example"]
            if "changelog_url" in mcols and m["changelog_url"]:
                entry["changelogUrl"] = m["changelog_url"]
            if m["notes"]:
                entry["notes"] = m["notes"]
            manufacturers_out.append(entry)

        plugins_out = []
        versioned = 0
        with_successor = 0
        with_confidence = 0
        with_identity_kind = 0
        with_apple_silicon = 0
        # v5: manufacturer Apple Silicon defaults for per-plugin resolution
        mfr_as = {}
        try:
            for row in conn.execute("SELECT id, apple_silicon FROM manufacturers"):
                if row["apple_silicon"] not in (None, "", "unknown"):
                    mfr_as[row["id"]] = row["apple_silicon"]
        except sqlite3.OperationalError:
            pass
        for p in conn.execute("SELECT * FROM plugins ORDER BY name"):
            patterns = loads_json(p["match_patterns"], [])
            if not patterns:
                print(
                    f"VALIDATE FAIL: plugin {p['id']} missing match_patterns",
                    file=sys.stderr,
                )
                return 1

            entry = {
                "id": p["id"],
                "manufacturerId": p["manufacturer_id"],
                "name": p["name"],
                "matchPatterns": patterns,
            }
            formats = loads_json(p["formats"], [])
            if formats:
                entry["formats"] = formats
            if p["product_line"]:
                entry["productLine"] = p["product_line"]
            if p["bundled"]:
                entry["bundled"] = True
            if p["min_macos"]:
                entry["minMacOS"] = p["min_macos"]
            if p["update_portal_url"]:
                entry["updatePortalUrl"] = p["update_portal_url"]
            # legacy discontinued still emitted as bool when set
            if p["discontinued"]:
                entry["discontinued"] = True
            if p["notes"]:
                entry["notes"] = p["notes"]

            # Forward-compatible micro/macro fields (only if non-null)
            if has_v2:
                for col, key in OPTIONAL_PLUGIN_FIELDS:
                    if col not in pcols:
                        continue
                    val = p[col]
                    if val is None or val == "":
                        continue
                    if col == "update_class" and val == "unknown":
                        continue
                    entry[key] = val
                if entry.get("successorPluginId"):
                    with_successor += 1

            # v3 helpful app fields (plugin may override manufacturer portal/channel)
            for col, key in HELPFUL_TEXT_FIELDS:
                if col not in pcols:
                    continue
                val = p[col]
                if val is None or val == "":
                    continue
                entry[key] = val
            for col, key in HELPFUL_BOOL_FIELDS:
                if col not in pcols:
                    continue
                # discontinued already handled above; skip duplicate
                if col == "discontinued":
                    continue
                val = p[col]
                if val is None or val == 0:
                    continue
                entry[key] = True

            # v4: identityKind for Electron UX (omit default 'plugin')
            if IDENTITY_KIND_COL in pcols:
                ik = p[IDENTITY_KIND_COL]
                if ik and ik != IDENTITY_KIND_DEFAULT:
                    entry[IDENTITY_KIND_KEY] = ik
                    with_identity_kind += 1

            # v5: Apple Silicon status — per-plugin override wins, else manufacturer
            # default; omitted when unknown/unresearched (see DATA-DICTIONARY.md)
            if "apple_silicon" in pcols:
                resolved = p["apple_silicon"] or mfr_as.get(p["manufacturer_id"])
                if resolved:
                    entry["appleSilicon"] = resolved
                    with_apple_silicon += 1

            # Policy A: only attach version fields when current points at accepted obs
            conf_select = ", o.confidence, o.confidence_reasons" if has_confidence else ""
            cur = conn.execute(
                f"""
                SELECT o.observed_version, o.source_url, o.source_kind,
                       o.verified_at, o.status, o.id AS observation_id
                       {conf_select}
                FROM plugin_version_current c
                JOIN version_observations o ON o.id = c.observation_id
                WHERE c.plugin_id = ?
                """,
                (p["id"],),
            ).fetchone()

            if cur is not None:
                if cur["status"] != "accepted":
                    print(
                        f"VALIDATE FAIL: plugin {p['id']} current observation "
                        f"{cur['observation_id']} status={cur['status']} (not accepted)",
                        file=sys.stderr,
                    )
                    return 1
                entry["latestVersion"] = cur["observed_version"]
                entry["versionSourceUrl"] = cur["source_url"]
                if cur["verified_at"]:
                    entry["versionVerifiedAt"] = cur["verified_at"]
                evidence = SOURCE_KIND_TO_EVIDENCE.get(
                    cur["source_kind"], "page-confirmed"
                )
                entry["versionEvidence"] = evidence

                # Inherit confidence from the current observation
                if has_confidence:
                    conf = cur["confidence"]
                    if conf is None:
                        conf = 50
                    entry["versionConfidence"] = int(conf)
                    reasons = loads_json(cur["confidence_reasons"], [])
                    if not isinstance(reasons, list):
                        reasons = []
                    entry["versionConfidenceReasons"] = reasons
                    with_confidence += 1

                versioned += 1

            plugins_out.append(entry)

        catalog = {
            "schemaVersion": 3,
            "updatedAt": now_iso(),
            "catalogSource": "store-export:v4",
            "manufacturers": manufacturers_out,
            "plugins": plugins_out,
        }

        OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUT_PATH.write_text(
            json.dumps(catalog, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(
            f"Exported {OUT_PATH}: "
            f"{len(manufacturers_out)} manufacturers, "
            f"{len(plugins_out)} plugins, "
            f"{versioned} with accepted latestVersion, "
            f"{with_confidence} with versionConfidence, "
            f"{with_successor} with successorPluginId, "
            f"{with_identity_kind} with identityKind"
        )
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
