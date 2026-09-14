#!/usr/bin/env python3
"""Idempotent identity_kind patterns for AAS / Blue Cat / UVI Falcon / Arturia hardware.

Companion to classify_identity_kind.py (which covered the original 183 unknowns).
Does NOT invent versions. Safe to re-run; skips rows that already have accepted versions
except when correcting lounge-lizard-ep-5 identity before version accept.
"""
from __future__ import annotations

import sqlite3
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

ALLOWED = {
    "plugin", "soundset", "expansion", "hardware", "eurorack", "bundle",
    "suite_component", "daw_stock_effect", "hub_app", "gen_ambiguous",
    "discontinued", "unknown_other",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# (identity_kind, notes, extra_cols dict optional)
C: dict[str, tuple[str, str, dict]] = {}

# AAS gen_ambiguous / discontinued
C["applied-acoustics--chromaphone"] = (
    "gen_ambiguous",
    'Generation-ambiguous: store SKU "Chromaphone" is not Chromaphone 3; do not map Chromaphone 3 installer version onto this SKU.',
    {},
)
C["applied-acoustics--chromaphone-1"] = (
    "discontinued",
    "Chromaphone 1 is a prior major generation vs Chromaphone 3 (current AAS support lineup).",
    {"discontinued": 1, "update_class": "discontinued"},
)
C["applied-acoustics--string-studio-vs-2"] = (
    "discontinued",
    "String Studio VS-2 superseded by VS-3 (current on AAS support). Do not map VS-3 version onto VS-2.",
    {
        "discontinued": 1,
        "update_class": "paid_upgrade",
        "successor_plugin_id": "applied-acoustics--string-studio-vs-3",
        "superseded_by_plugin_id": "applied-acoustics--string-studio-vs-3",
    },
)
C["applied-acoustics--ultra-analog-va-2"] = (
    "discontinued",
    "Ultra Analog VA-2 superseded by VA-3 (current on AAS support). Do not map VA-3 version onto VA-2.",
    {
        "discontinued": 1,
        "update_class": "paid_upgrade",
        "successor_plugin_id": "applied-acoustics--ultra-analog-va-3",
        "superseded_by_plugin_id": "applied-acoustics--ultra-analog-va-3",
    },
)
C["applied-acoustics--strum-acoustic-gs-1"] = (
    "discontinued",
    "Strum Acoustic GS-1 prior-gen vs current Strum GS-2. Do not map GS-2 version onto GS-1.",
    {
        "discontinued": 1,
        "update_class": "paid_upgrade",
        "successor_plugin_id": "applied-acoustics--strum-gs-2",
        "superseded_by_plugin_id": "applied-acoustics--strum-gs-2",
    },
)
C["applied-acoustics--strum-electric-gs-1"] = (
    "discontinued",
    "Strum Electric GS-1 prior-gen vs current Strum GS-2. Do not map GS-2 version onto GS-1.",
    {
        "discontinued": 1,
        "update_class": "paid_upgrade",
        "successor_plugin_id": "applied-acoustics--strum-gs-2",
        "superseded_by_plugin_id": "applied-acoustics--strum-gs-2",
    },
)
C["applied-acoustics--strum-session"] = (
    "gen_ambiguous",
    "Generation/title ambiguous vs Strum Session 2 / Strum Acoustic Session. Do not invent latestVersion.",
    {},
)
C["applied-acoustics--tassman"] = (
    "discontinued",
    "Tassman absent from AAS current support lineup — discontinued for UX; no public installer latestVersion.",
    {"discontinued": 1, "update_class": "discontinued"},
)

# Blue Cat packs/series
for pid, note in [
    ("blue-cat-audio--analysis-pack", "Blue Cat Analysis Pack is a marketing/bundle SKU — no single plugin latestVersion."),
    ("blue-cat-audio--axe-pack", "Blue Cat Axe Pack is a marketing/bundle SKU — no single plugin latestVersion."),
    ("blue-cat-audio--blue-cats-all-plug-ins-pack", "Blue Cat's All Plug-Ins Pack is a full catalog bundle — no single plugin latestVersion."),
    ("blue-cat-audio--crafters-pack", "Blue Cat Crafters Pack is a marketing/bundle SKU — no single plugin latestVersion."),
    ("blue-cat-audio--parametreq-series", "Parametr'EQ series is a product-line/series umbrella — track individual EQ SKUs."),
    ("blue-cat-audio--stereoscope-series", "StereoScope Series is a product-line/series umbrella — track StereoScope Multi/Pro SKUs."),
]:
    C[pid] = ("bundle", note, {})

for pid, note in [
    (
        "blue-cat-audio--blue-cats-digital-peak-meter",
        "Legacy freeware title distinct from DP Meter Pro — no safe current installer semver for this SKU.",
    ),
    (
        "blue-cat-audio--blue-cats-stereo-triple-eq",
        "Legacy dual/stereo Triple EQ variant; current Triple EQ dual-channel covers mid/side.",
    ),
    (
        "blue-cat-audio--blue-cats-widening-meter-pro",
        "Legacy/vault relative to current analysis line — no safe public installer semver.",
    ),
    (
        "blue-cat-audio--blue-cats-widening-triple-eq",
        "Legacy mid/side Triple EQ (vault). Do not map Triple EQ version onto this SKU.",
    ),
]:
    C[pid] = ("discontinued", note, {"discontinued": 1, "update_class": "discontinued"})

# Arturia hardware
for pid, note in [
    ("arturia--microbrute", "MicroBrute analog hardware synthesizer — not a DAW plugin installer semver."),
    ("arturia--minibrute", "MiniBrute analog hardware synthesizer — not a DAW plugin installer semver."),
    ("arturia--minibrute-2-noir", "MiniBrute 2 Noir hardware synthesizer — not a DAW plugin installer semver."),
    ("arturia--microfreak", "MicroFreak hardware synthesizer — not a DAW plugin."),
    ("arturia--minifreak", "MiniFreak hardware synthesizer — MiniFreak V is the versioned plugin SKU."),
    ("arturia--minifreak-vocoder", "MiniFreak Vocoder hardware accessory/variant — not a DAW plugin."),
    ("arturia--minifuse-1", "MiniFuse 1 audio interface hardware — not a DAW plugin."),
    ("arturia--minifuse-2", "MiniFuse 2 audio interface hardware — not a DAW plugin."),
    ("arturia--minifuse-4", "MiniFuse 4 audio interface hardware — not a DAW plugin."),
    ("arturia--minifuse-2-otg", "MiniFuse 2 OTG audio interface hardware — not a DAW plugin."),
    ("arturia--microlab-mk3", "MicroLab mk3 MIDI controller hardware — not a DAW plugin."),
    ("arturia--minilab-3", "MiniLab 3 MIDI controller hardware — not a DAW plugin."),
    ("arturia--polybrute-12", "PolyBrute 12 hardware synthesizer — not a DAW plugin installer semver."),
]:
    C[pid] = ("hardware", note, {})


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    ts = now_iso()
    versioned = {
        r[0]
        for r in conn.execute("SELECT plugin_id FROM plugin_version_current")
    }
    # Pattern: UVI *for Falcon* → expansion (dynamic)
    for r in conn.execute(
        """
        SELECT id, name FROM plugins
        WHERE manufacturer_id='uvi'
          AND (name LIKE '%for Falcon%' OR id LIKE '%-for-falcon')
        """
    ):
        C[r["id"]] = (
            "expansion",
            f"UVI Falcon expansion pack ({r['name']}) — soundbank/content for Falcon host, not a plugin installer semver.",
            {},
        )

    updated = 0
    skipped_versioned = 0
    kinds: Counter[str] = Counter()
    for pid, (kind, notes, extra) in C.items():
        if kind not in ALLOWED:
            print(f"bad kind {kind}", file=sys.stderr)
            return 1
        exists = conn.execute("SELECT 1 FROM plugins WHERE id=?", (pid,)).fetchone()
        if not exists:
            continue
        if pid in versioned:
            skipped_versioned += 1
            continue
        sets = ["identity_kind=?", "notes_for_user=?", "updated_at=?"]
        params: list = [kind, notes, ts]
        for col, val in extra.items():
            sets.append(f"{col}=?")
            params.append(val)
        params.append(pid)
        conn.execute(f"UPDATE plugins SET {', '.join(sets)} WHERE id=?", params)
        kinds[kind] += 1
        updated += 1

    conn.execute(
        "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
        ("identity_kind_aas_etc_at", ts),
    )
    conn.commit()
    conn.close()
    print(f"Updated {updated} (skipped versioned {skipped_versioned})")
    for k, n in sorted(kinds.items(), key=lambda x: (-x[1], x[0])):
        print(f"  {k}: {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
