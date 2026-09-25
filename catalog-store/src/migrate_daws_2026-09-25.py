#!/usr/bin/env python3
"""DAW + studio-app catalog migration (2026-09-25).

Adds flagship standalone_app identities for 14 DAWs, adds 5 missing
manufacturers, reclassifies mis-typed hub_app DAW rows to standalone_app,
and wires the Studio One -> Fender Studio Pro supersession.

Version observations are inserted separately via the zero-trust
accept_observation.py CLI. This script only touches identities/manufacturers.
"""
from __future__ import annotations

import sqlite3
import sys
import uuid
from datetime import datetime, timezone

DB_PATH = "/home/hatch/workspace/daw-plugin-manager/catalog-store/data/catalog.db"


def ts() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


NEW_MANUFACTURERS = [
    # (id, name, website, notes)
    ("ableton", "Ableton", "https://www.ableton.com/", "Makers of Ableton Live."),
    ("cockos", "Cockos", "https://www.cockos.com/", "Makers of REAPER."),
    (
        "reason-studios",
        "Reason Studios",
        "https://www.reasonstudios.com/",
        "Makers of Reason (formerly Propellerhead).",
    ),
    ("motu", "MOTU", "https://motu.com/", "Mark of the Unicorn; makers of Digital Performer."),
    (
        "fender",
        "Fender",
        "https://www.fender.com/",
        "Fender Studio Pro is the renamed successor of PreSonus Studio One (Jan 2026).",
    ),
]

# (plugin_id, manufacturer_id, name, match_patterns, notes)
NEW_PRODUCTS = [
    (
        "ableton--ableton-live",
        "ableton",
        "Ableton Live",
        ["Ableton Live"],
        "Flagship DAW. Editions (Intro/Standard/Suite) share the Live version line.",
    ),
    (
        "apple--logic-pro",
        "apple",
        "Logic Pro",
        ["Logic Pro"],
        "Apple flagship DAW (macOS). Version from Apple release notes.",
    ),
    (
        "apple--garageband",
        "apple",
        "GarageBand",
        ["GarageBand"],
        "Apple free DAW (macOS). Version from App Store release notes.",
    ),
    (
        "avid--pro-tools",
        "avid",
        "Pro Tools",
        ["Pro Tools"],
        "Avid flagship DAW. Editions (Artist/Studio/Ultimate) share the version line.",
    ),
    (
        "fender--fender-studio-pro",
        "fender",
        "Fender Studio Pro",
        ["Fender Studio Pro"],
        "Successor of PreSonus Studio One (Fender rebrand, Jan 2026).",
    ),
    (
        "cockos--reaper",
        "cockos",
        "REAPER",
        ["REAPER", "Reaper"],
        "Cockos flagship DAW. Universal macOS build.",
    ),
    (
        "reason-studios--reason",
        "reason-studios",
        "Reason",
        ["Reason"],
        "Reason Studios flagship DAW (also ships as Reason Rack Plugin).",
    ),
    (
        "motu--digital-performer",
        "motu",
        "Digital Performer",
        ["Digital Performer"],
        "MOTU flagship DAW.",
    ),
    (
        "tracktion--waveform",
        "tracktion",
        "Waveform",
        ["Waveform"],
        "Tracktion flagship DAW. Edition rows carry no version; this row carries the generation version.",
    ),
    (
        "harrison--mixbus",
        "harrison",
        "Mixbus",
        ["Mixbus"],
        "Harrison flagship DAW.",
    ),
    (
        "renoise--renoise",
        "renoise",
        "Renoise",
        ["Renoise"],
        "Renoise tracker DAW. renoise.com downloads are backstage-gated; version from corroborating sources.",
    ),
]

# (plugin_id,) rows promoted from hub_app to standalone_app as flagship version carriers
FLAGSHIP_PROMOTE = [
    "bitwig--bitwig-studio-6",
    "image-line--fl-studio-producer-edition",
    "steinberg--cubase-pro-15",
    "presonus--studio-one-artist",
]

# hub_app -> standalone_app reclassification for DAW editions/apps (no versions stamped on these)
EDITION_FIX = [
    "bitwig--bitwig-studio-16-track",
    "bitwig--bitwig-studio-essentials",
    "bitwig--bitwig-studio-producer",
    "image-line--fl-studio-fruity-edition",
    "image-line--fl-studio-all-plugins-edition",
    "image-line--fl-studio-signature-bundle",
    "image-line--fl-studio-mobile",
    "steinberg--cubase-artist-15",
    "steinberg--cubase-elements-15",
    "steinberg--nuendo",
    "steinberg--vst-live-elements",
    "steinberg--vst-live-pro-3",
    "tracktion--waveform-free-13",
    "tracktion--waveform-pro-13",
    "presonus--artist-bundle-studio-one-artist-and-notion",
    "presonus--pro-bundle-studio-one-pro-and-notion",
]


def main() -> int:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    now = ts()
    cur = conn.cursor()

    # --- 1. manufacturers ---
    for mid, name, site, notes in NEW_MANUFACTURERS:
        if cur.execute("SELECT 1 FROM manufacturers WHERE id=?", (mid,)).fetchone():
            print(f"mfr exists: {mid}")
            continue
        cur.execute(
            """INSERT INTO manufacturers
               (id,name,aliases,website_url,update_portal_url,portal_app,update_channel,
                notes,created_at,updated_at,apple_silicon,version_scheme,version_example,
                changelog_url,popularity_tier)
               VALUES (?,?,?,?,'' ,NULL,NULL,?,?,?,NULL,NULL,NULL,NULL,1)""",
            (mid, name, "[]", site, notes, now, now),
        )
        print(f"mfr added: {mid}")

    # tier bump for harrison / tracktion / renoise
    for mid in ("harrison", "tracktion", "renoise"):
        cur.execute(
            "UPDATE manufacturers SET popularity_tier=1, updated_at=? WHERE id=?",
            (now, mid),
        )
        print(f"mfr tier 1: {mid}")
    cur.execute(
        "UPDATE manufacturers SET website_url='https://www.renoise.com', updated_at=? WHERE id='renoise'",
        (now,),
    )

    # --- 2. new product rows ---
    for pid, mfr, name, patterns, notes in NEW_PRODUCTS:
        if cur.execute("SELECT 1 FROM plugins WHERE id=?", (pid,)).fetchone():
            print(f"product exists: {pid}")
            continue
        import json as _json

        cur.execute(
            """INSERT INTO plugins
               (id,manufacturer_id,name,match_patterns,formats,product_line,bundled,
                min_macos,update_portal_url,supersedes_plugin_id,superseded_by_plugin_id,
                discontinued,notes,identity_source,created_at,updated_at,generation,
                generation_rank,update_class,successor_plugin_id,predecessor_plugin_id,
                portal_app,update_channel,is_freeware,requires_ilok,notes_for_user,
                identity_kind,apple_silicon,popularity_tier)
               VALUES (?,?,?,?,'[]',NULL,0,NULL,NULL,NULL,NULL,0,?,?,
                       ?,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,
                       'standalone_app','unknown',1)""",
            (
                pid,
                mfr,
                name,
                _json.dumps(patterns),
                notes,
                "operator-daw-migration-2026-09-25",
                now,
                now,
            ),
        )
        print(f"product added: {pid}")

    # --- 3. promote flagships ---
    for pid in FLAGSHIP_PROMOTE:
        cur.execute(
            """UPDATE plugins SET identity_kind='standalone_app', popularity_tier=1,
                                  identity_source='operator-daw-migration-2026-09-25', updated_at=?
               WHERE id=?""",
            (now, pid),
        )
        print(f"promoted to standalone_app flagship: {pid}")

    # --- 4. edition reclassification (no versions stamped) ---
    for pid in EDITION_FIX:
        cur.execute(
            """UPDATE plugins SET identity_kind='standalone_app',
                                  identity_source='operator-daw-migration-2026-09-25', updated_at=?
               WHERE id=? AND identity_kind='hub_app'""",
            (now, pid),
        )
        print(f"reclassified hub_app->standalone_app: {pid}")

    # Studio One Artist VST/AU/ReWire add-on is a feature add-on, not an app/hub
    cur.execute(
        """UPDATE plugins SET identity_kind='plugin', updated_at=? WHERE id=?""",
        (now, "presonus--studio-one-artist-vst-and-au-and-rewire-support"),
    )
    print("reclassified studio-one add-on -> plugin")

    # --- 5. Studio One -> Fender Studio Pro supersession ---
    for pid in (
        "presonus--studio-one-artist",
        "presonus--artist-bundle-studio-one-artist-and-notion",
        "presonus--pro-bundle-studio-one-pro-and-notion",
    ):
        cur.execute(
            """UPDATE plugins SET superseded_by_plugin_id='fender--fender-studio-pro',
                                  notes=COALESCE(notes||' ','')||'Superseded by Fender Studio Pro (Studio One renamed by Fender, Jan 2026).',
                                  updated_at=? WHERE id=?""",
            (now, pid),
        )
        print(f"supersession wired: {pid} -> fender--fender-studio-pro")
    cur.execute(
        """UPDATE plugins SET predecessor_plugin_id='presonus--studio-one-artist',
                              notes=COALESCE(notes||' ','')||'Successor of PreSonus Studio One (renamed Jan 2026); last Studio One release was 7.x.',
                              updated_at=? WHERE id='fender--fender-studio-pro'""",
        (now,),
    )

    # Waveform 13 editions superseded by Waveform 14 flagship
    for pid in ("tracktion--waveform-free-13", "tracktion--waveform-pro-13"):
        cur.execute(
            """UPDATE plugins SET superseded_by_plugin_id='tracktion--waveform', updated_at=? WHERE id=?""",
            (now, pid),
        )
        print(f"supersession wired: {pid} -> tracktion--waveform")

    conn.commit()
    conn.close()
    print("migration complete")
    return 0


if __name__ == "__main__":
    sys.exit(main())
