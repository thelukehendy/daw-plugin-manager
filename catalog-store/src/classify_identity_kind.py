#!/usr/bin/env python3
"""Classify remaining unknown plugins with identity_kind + notes_for_user.

Does NOT invent or accept versions. Non-version identity writes only.
Idempotent: re-running overwrites identity_kind/notes for listed IDs.
"""
from __future__ import annotations

import sqlite3
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "catalog.db"

# (identity_kind, notes_for_user)
# notes explain why there is no latestVersion for Electron UX.
C: dict[str, tuple[str, str]] = {}

# --- soundset (24) u-he expansions / soundsets — no installer semver ---
_UHE_SOUNDSETS = [
    ("u-he--arena", "Arena"),
    ("u-he--atmos", "Atmos"),
    ("u-he--automata", "Automata"),
    ("u-he--bricks", "Bricks"),
    ("u-he--catalyst", "Catalyst"),
    ("u-he--crystallia", "Crystallia"),
    ("u-he--deform", "Deform"),
    ("u-he--funkstation", "Funkstation"),
    ("u-he--hive-science", "Hive Science"),
    ("u-he--hive-science-2", "Hive Science 2"),
    ("u-he--kinesis", "Kinesis"),
    ("u-he--kling-klong", "Kling Klong"),
    ("u-he--metaphorium", "Metaphorium"),
    ("u-he--monochrome", "Monochrome"),
    ("u-he--objects", "Objects"),
    ("u-he--oxide", "Oxide"),
    ("u-he--performer", "Performer"),
    ("u-he--resequenced", "ReSequenced"),
    ("u-he--renaissance", "Renaissance"),
    ("u-he--sugar-and-spice", "Sugar & Spice"),
    ("u-he--tarot", "Tarot"),
    ("u-he--traveller", "Traveller"),
    ("u-he--vectors", "Vectors"),
    ("u-he--zoyd", "Zoyd"),
]
for pid, name in _UHE_SOUNDSETS:
    C[pid] = (
        "soundset",
        f"u-he soundset/expansion ({name}) — preset pack, not a DAW plugin installer; no plugin latestVersion.",
    )

# --- expansion / soundware ---
for pid, name in [
    ("audiothing--fields", "Fields"),
    ("audiothing--pong-glockenspiel", "Pong Glockenspiel"),
    ("audiothing--sx1500", "SX1500"),
    ("audiothing--soundscapes-vol-2", "Soundscapes Vol.2"),
]:
    C[pid] = (
        "expansion",
        f"AudioThing soundware/expansion ({name}) — sample/preset content, not a versioned plugin binary.",
    )
C["spitfire-audio--spitfire-symphony-orchestra"] = (
    "expansion",
    "Spitfire library/expansion — public verwin is year-only; no clean installer semver for latestVersion.",
)

# --- eurorack ---
C["u-he--cvilization"] = (
    "eurorack",
    "u-he CVilization is eurorack hardware — not a DAW plugin; no plugin latestVersion.",
)
C["u-he--melt-the-core-ingredient"] = (
    "eurorack",
    "u-he Melt (eurorack / hardware ingredient) — not a DAW plugin installer semver.",
)

# --- hardware ---
for pid, note in [
    (
        "universal-audio--anti-1992-high-gain-amp-emulator",
        "UA amp pedal / hardware emulator SKU — not a standalone DAW plugin semver.",
    ),
    (
        "universal-audio--dream-65-reverb-amplifier",
        "UA amp pedal / hardware SKU — not a standalone DAW plugin semver.",
    ),
    (
        "universal-audio--enigmatic-82-overdrive-special-amp",
        "UA amp pedal / hardware SKU — not a standalone DAW plugin semver.",
    ),
    (
        "universal-audio--lion-68-super-lead-amp-pedal",
        "UA amp pedal hardware — not a standalone DAW plugin semver.",
    ),
    (
        "universal-audio--ox-amp-top-box",
        "UA OX Amp Top Box hardware — not a DAW plugin installer semver.",
    ),
    (
        "universal-audio--volt-876",
        "UA Volt 876 audio interface hardware — not a DAW plugin.",
    ),
    (
        "ik-multimedia--amplitube-x-drive-guitar-pedal",
        "AmpliTube X-DRIVE physical guitar pedal — hardware, not a plugin latestVersion.",
    ),
    (
        "ik-multimedia--amplitube-x-space-reverb-pedal",
        "AmpliTube X-SPACE physical reverb pedal — hardware, not a plugin latestVersion.",
    ),
    (
        "ik-multimedia--amplitube-x-time-delay-pedal",
        "AmpliTube X-TIME physical delay pedal — hardware, not a plugin latestVersion.",
    ),
    (
        "ik-multimedia--amplitube-x-vibe-guitar-pedal",
        "AmpliTube X-VIBE physical guitar pedal — hardware, not a plugin latestVersion.",
    ),
    (
        "softube--console-1-compact",
        "Softube Console 1 Compact hardware controller — not a DAW plugin semver.",
    ),
    (
        "softube--console-1-fader-mk-iii",
        "Softube Console 1 Fader Mk III hardware — not a DAW plugin semver.",
    ),
    (
        "waves--puigchild-hardware-compressor",
        "Waves PuigChild hardware compressor — physical unit, not a plugin latestVersion.",
    ),
]:
    C[pid] = ("hardware", note)

# --- hub_app / shell / manager ---
for pid, note in [
    (
        "toontrack--toontrack-product-manager",
        "Toontrack Product Manager is a hub/installer app — not a DAW effect/instrument plugin.",
    ),
    (
        "universal-audio--uad-software",
        "UAD Software / UA Connect hub shell — not an individual plugin SKU with its own semver.",
    ),
    (
        "waves--waveshell",
        "WaveShell is Waves' plugin host shell — not a trackable effect SKU latestVersion.",
    ),
    (
        "waves--studiorack-obs",
        "Waves StudioRack for OBS is a host/integration shell — not a standard DAW plugin semver.",
    ),
    (
        "uvi--uviworkstationaax",
        "UVIWorkstation AAX is a sample player/host shell — track content via UVI hub, not this SKU semver.",
    ),
    (
        "celemony--melodyne-bridge",
        "MelodyneBridge is a host-integration bridge — not a standalone Melodyne plugin latestVersion.",
    ),
    (
        "spectralayers-bridge--spectralayers-bridge",
        "SpectraLayers Bridge is a DAW bridge/helper — not a SpectraLayers plugin SKU semver.",
    ),
]:
    C[pid] = ("hub_app", note)

# --- daw_stock_effect / OS ---
C["apple--asaf"] = (
    "daw_stock_effect",
    "Apple Spatial Audio is an OS/DAW-stock feature — not a third-party plugin with public installer semver.",
)

# --- bundle ---
for pid, name in [
    ("nugen-audio--focus", "Focus"),
    ("nugen-audio--modern-mastering", "Modern Mastering"),
    ("nugen-audio--nugen-post", "NUGEN Post"),
    ("nugen-audio--nugen-producer", "NUGEN Producer"),
]:
    C[pid] = (
        "bundle",
        f"NUGEN {name} is a bundle SKU (verwin N/A) — no single plugin latestVersion.",
    )
C["cherry-audio--novachord-solovox-synthesizers"] = (
    "bundle",
    "Novachord + Solovox is a dual-product bundle SKU — dual/ambiguous verwin; no single latestVersion.",
)
C["softube--amp-room-bass-suite"] = (
    "bundle",
    "Amp Room Bass Suite is a marketing/bundle suite SKU — not an exact Amp Room plugin title for semver.",
)
C["softube--amp-room-metal-suite"] = (
    "bundle",
    "Amp Room Metal Suite is a marketing/bundle suite SKU — not an exact Amp Room plugin title for semver.",
)
C["softube--amp-room-vintage-suite"] = (
    "bundle",
    "Amp Room Vintage Suite is a marketing/bundle suite SKU — not an exact Amp Room plugin title for semver.",
)
C["softube--console-1-core-mixing-suite"] = (
    "bundle",
    "Console 1 Core Mixing Suite is an edition/pack bundle — hub-walled; not a single plugin semver.",
)
C["izotope--rx"] = (
    "bundle",
    "iZotope RX umbrella product — no single SKU semver; track RX module/generation SKUs instead.",
)

# --- suite_component ---
_AIR_CC = [
    "air--airchorus",
    "air--airdistortion",
    "air--airdynamicdelay",
    "air--airenhancer",
    "air--airensemble",
    "air--airfiltergate",
    "air--airflanger",
    "air--airfrequencyshifter",
    "air--airfuzz-wah",
    "air--airkilleq",
    "air--airlo-fi",
    "air--airmulti-chorus",
    "air--airmulti-delay",
    "air--airnon-linearreverb",
    "air--airphaser",
    "air--airreverb",
    "air--airspringreverb",
    "air--airstereowidth",
    "air--airtalkbox",
    "air--airvintagefilter",
]
for pid in _AIR_CC:
    C[pid] = (
        "suite_component",
        "AIR Creative Collection / Creative FX suite component — no individual public installer semver.",
    )

for pid, note in [
    (
        "softube--british-class-a-compressor",
        "Component split of British Class A — not an exact standalone KVR/title match for All-plug-ins semver.",
    ),
    (
        "softube--british-class-a-drive",
        "Component split of British Class A — not an exact standalone title match for All-plug-ins semver.",
    ),
    (
        "softube--british-class-a-equalizer",
        "Component split of British Class A — not an exact standalone title match for All-plug-ins semver.",
    ),
    (
        "softube--overstayer-m-a-s-extended",
        "Overstayer M-A-S Extended edition ≠ parent Overstayer M-A-S — no exact public SKU semver mapped.",
    ),
    (
        "softube--tonelux-tilt-live",
        "Tonelux Tilt Live ≠ Tonelux Tilt parent — no exact public SKU semver mapped.",
    ),
    (
        "softube--valley-people-dyna-mite-gate",
        "Dyna-mite Gate is a component split of Valley People Dyna-mite — no exact title semver.",
    ),
    (
        "softube--valley-people-dyna-mite-slam",
        "Dyna-mite Slam is a component split of Valley People Dyna-mite — no exact title semver.",
    ),
    (
        "softube--model-72-envelope-filter",
        "Model 72 Envelope Filter FX spinout — no individual Softube/KVR product page for semver.",
    ),
    (
        "softube--model-77-reverb",
        "Model 77 Reverb FX spinout — no individual Softube/KVR product page for semver.",
    ),
    (
        "softube--model-84-chorus",
        "Model 84 Chorus FX spinout — no individual Softube/KVR product page for semver.",
    ),
    (
        "softube--chandler-limited-zener-bender-for-console-1",
        "Console 1 edition-pack component — not a standalone plugin KVR title.",
    ),
    (
        "softube--empirical-labs-trak-pak-for-console-1",
        "Console 1 edition-pack component — not a standalone plugin KVR title.",
    ),
    (
        "softube--weiss-gambit-series-for-console-1",
        "Console 1 edition-pack / series component — not a standalone plugin KVR title.",
    ),
    (
        "slate-digital--vbc-fg-grey",
        "VBC FG-Grey is a Virtual Buss Compressors suite component — hub-walled; no individual public semver.",
    ),
    (
        "slate-digital--vbc-fg-mu",
        "VBC FG-MU is a Virtual Buss Compressors suite component — hub-walled; no individual public semver.",
    ),
    (
        "slate-digital--vbc-fg-red",
        "VBC FG-Red is a Virtual Buss Compressors suite component — hub-walled; no individual public semver.",
    ),
    (
        "slate--virtual-channel",
        "Virtual Channel is a Virtual Mix Rack / suite-style component — hub-walled; no public per-SKU semver.",
    ),
    (
        "slate--virtual-mixbuss",
        "Virtual MixBuss is a suite-style component — hub-walled; no public per-SKU semver.",
    ),
    (
        "steinberg--6x-500",
        "Steinberg/partner 500-series suite component — SDA hub-walled; no public per-SKU installer semver.",
    ),
    (
        "steinberg--7x-500",
        "Steinberg/partner 500-series suite component — SDA hub-walled; no public per-SKU installer semver.",
    ),
    (
        "steinberg--channelx",
        "Steinberg ChannelX suite/partner component — SDA hub-walled; no public per-SKU installer semver.",
    ),
    (
        "steinberg--lindell-254e",
        "Lindell 254E (Steinberg distribution) suite/partner SKU — SDA hub-walled; no public per-SKU semver.",
    ),
    (
        "steinberg--lindell-354e",
        "Lindell 354E (Steinberg distribution) suite/partner SKU — SDA hub-walled; no public per-SKU semver.",
    ),
    (
        "steinberg--lindell-te-100",
        "Lindell TE-100 (Steinberg distribution) suite/partner SKU — SDA hub-walled; no public per-SKU semver.",
    ),
    (
        "steinberg--pex-500",
        "PEX-500 (Steinberg distribution) suite/partner SKU — SDA hub-walled; no public per-SKU semver.",
    ),
    (
        "d16-group--repeater-slate-digital-edition",
        "Repeater Slate Digital Edition is a rebranded/edition suite SKU — empty/ambiguous public verwin.",
    ),
    (
        "synchro-arts--double-tracker-doubler",
        "Double Tracker (Doubler) is a Revoice/suite-related component SKU — bad/dual verwin; no clean accept.",
    ),
]:
    C[pid] = ("suite_component", note)

# --- gen_ambiguous ---
_ARTURIA_V = [
    ("arturia--arp2600-v", "ARP2600 V"),
    ("arturia--analog-lab-v", "Analog Lab V"),
    ("arturia--b-3-v", "B-3 V"),
    ("arturia--cs-80-v", "CS-80 V"),
    ("arturia--jup-8-v", "Jup-8 V"),
    ("arturia--matrix-12-v", "Matrix-12 V"),
    ("arturia--mini-v", "Mini V"),
    ("arturia--piano-v", "Piano V"),
    ("arturia--sem-v", "SEM V"),
    ("arturia--solina-v", "Solina V"),
    ("arturia--stage-73-v", "Stage-73 V"),
    ("arturia--vox-continental-v", "VOX Continental V"),
    ("arturia--wurli-v", "Wurli V"),
]
for pid, name in _ARTURIA_V:
    C[pid] = (
        "gen_ambiguous",
        f'Generation-ambiguous: store SKU "{name}" is not the same product generation as current Vn rewrites; '
        "do not map Vn version onto this V SKU.",
    )
C["spectrasonics--omnisphere"] = (
    "gen_ambiguous",
    "Omnisphere generation-ambiguous (Omnisphere 1 vs current major line) — KVR redirect is not a safe latestVersion map.",
)
C["spectrasonics--fx-omnisphere"] = (
    "gen_ambiguous",
    "FX-Omnisphere generation/title ambiguous vs Omnisphere major line — no safe public latestVersion map.",
)
C["air--vacuum"] = (
    "gen_ambiguous",
    "Vacuum vs Vacuum Pro / Classic generation-ambiguous — no safe individual Creative Collection semver.",
)
C["cableguys--shaperbox-2"] = (
    "gen_ambiguous",
    "ShaperBox 2 is a prior major generation — do not map newer ShaperBox line versions onto this SKU.",
)
C["izotope--nectar-3-elements"] = (
    "gen_ambiguous",
    "Nectar 3 Elements generation/edition mismatch vs current Nectar line — Elements SKU not mapped to full-version semver.",
)
C["ik-multimedia--miroslav-philharmonik-2"] = (
    "gen_ambiguous",
    "Miroslav Philharmonik 2 dual/ambiguous verwin — generation/edition unclear; no safe latestVersion.",
)
C["steven-slate--trigger-2"] = (
    "gen_ambiguous",
    "Trigger_2 is a prior major generation vs current Trigger line — hub-walled; do not invent a version.",
)

# --- discontinued ---
C["plugin-alliance--bx-xl-v2"] = (
    "discontinued",
    "Discontinued / superseded by bx_XL V3 (in catalog). Native V2 page 404 — do not map V3 version onto V2.",
)
C["plugin-alliance--elysia-alpha-master"] = (
    "discontinued",
    "PA page 404; superseded by elysia alpha compressor V2 line (in catalog). UAD-branded alpha master is separate.",
)
C["plugin-alliance--elysia-alpha-mix"] = (
    "discontinued",
    "PA page 404; superseded by elysia alpha compressor V2 line (in catalog). UAD-branded alpha mix is separate.",
)
C["plugin-alliance--schoeps-mono-upmix-1to3"] = (
    "discontinued",
    "PA product page 404; 1to3 SKU unresolved/discontinued (1to2 remains live). No safe latestVersion.",
)
C["plugin-alliance--swivel-audio-the-sauce"] = (
    "discontinued",
    "PA product page 404; discontinued or renamed — no public successor receipt; no latestVersion.",
)
for pid, name in [
    ("audio-ease--deep-phase-nine", "Deep Phase Nine"),
    ("audio-ease--follo", "Follo"),
    ("audio-ease--orbit", "Orbit"),
    ("audio-ease--periscope", "PeriScope"),
    ("audio-ease--riverrun", "RiverRun"),
    ("audio-ease--roger", "Roger"),
    ("audio-ease--vst-wrapper-for-mas", "VST Wrapper for MAS"),
]:
    C[pid] = (
        "discontinued",
        f"Audio Ease legacy title ({name}) — KVR page empty verwin / discontinued era; no public installer latestVersion.",
    )
C["guitar-rig-5--guitar-rig-5"] = (
    "discontinued",
    "Guitar Rig 5 is a prior major generation (Native Access) — discontinued relative to current Guitar Rig; no new public SKU semver.",
)
C["native-instruments--b4"] = (
    "discontinued",
    "B4 II is a legacy NI organ — discontinued/superseded era; no clean public latestVersion for this SKU.",
)
C["reaktor-6--reaktor-6"] = (
    "discontinued",
    "Reaktor 6 major line is prior-gen relative to current Reaktor — hub-walled; no safe public SKU semver accept here.",
)
C["d16-group--plasticlicks"] = (
    "discontinued",
    "Plasticlicks appears legacy / empty public verwin — treated discontinued for UX; no latestVersion.",
)
C["liquidsonics--mobile-convolution"] = (
    "discontinued",
    "Mobile Convolution legacy/empty verwin — no current public installer semver.",
)
C["eiosis--eiosis-aireq-5-1"] = (
    "discontinued",
    "Eiosis AirEQ 5.1 legacy surround SKU — empty/ambiguous public verwin; no latestVersion.",
)

# --- unknown_other (docs, misfiles, mismatches, residual hard cases) ---
C["u-he--the-bazille-cookbook"] = (
    "unknown_other",
    "The Bazille Cookbook is documentation/PDF — not a plugin; no latestVersion.",
)
C["spl--uad-spl-vitalizer-mk2-t"] = (
    "unknown_other",
    "Misfiled UAD-branded SPL Vitalizer MK2-T under SPL — track canonical SKU under Universal Audio (UA Connect), not SPL/PA.",
)
C["spl--uad-spl-vitalizer-mk3-t"] = (
    "unknown_other",
    "Misfiled UAD-branded SPL Vitalizer MK3-T under SPL — track canonical SKU under Universal Audio (UA Connect), not SPL/PA.",
)
C["impulse-record--convologyxt"] = (
    "unknown_other",
    "Manufacturer mismatch (Wave Arts vs Impulse Record) — identity unresolved; no safe latestVersion.",
)
C["steinberg--reason-rack-plugin"] = (
    "unknown_other",
    "Manufacturer mismatch (Reason Studios vs Steinberg listing) — identity unresolved; no safe latestVersion.",
)
C["modalics--eon-arp-midi"] = (
    "unknown_other",
    "Title mismatch (EON-Arp vs EON-Arp MIDI) — no exact public product match for latestVersion.",
)
C["unfilteredaudio--ltl-silver-bullet-mk2"] = (
    "unknown_other",
    "Manufacturer/id mismatch (Unfiltered Audio vs Louder Than Liftoff Silver Bullet) — unresolved; no latestVersion.",
)
C["overloud--th-u-slate"] = (
    "unknown_other",
    "TH-U Slate edition/empty verwin — edition identity unclear; no safe latestVersion.",
)
C["celemony--capstan"] = (
    "unknown_other",
    "Capstan has no clean public installer semver on probed sources — left unknown_other (not invented).",
)
C["oeksound--sculpt"] = (
    "unknown_other",
    "oeksound Sculpt product page 404 / no public semver — left unknown_other (not invented).",
)
C["liquidsonics--verbsuite-classics"] = (
    "unknown_other",
    "Verbsuite Classics empty/ambiguous public verwin — left unknown_other (not invented).",
)
C["synchro-arts--titan"] = (
    "unknown_other",
    "Synchro Arts Titan bad/dual-alpha verwin — left unknown_other (not invented).",
)
C["synchro-arts--vocalign-pro"] = (
    "unknown_other",
    "VocAlign Pro dual/ambiguous verwin vs current VocALign line — left unknown_other (not invented).",
)
C["ik-multimedia--amplitube-live-le"] = (
    "unknown_other",
    "AmpliTube Live + LE no exact/bad verwin — left unknown_other (not invented).",
)
C["ik-multimedia--modo-bass-se"] = (
    "unknown_other",
    "MODO BASS SE edition no exact/bad verwin — left unknown_other (not invented).",
)
C["slate-digital--inf-horizon"] = (
    "unknown_other",
    "Inf Horizon hub-walled / no KVR page — left unknown_other pending public installer receipt.",
)
C["slate-digital--rotary-sd-147"] = (
    "unknown_other",
    "Rotary SD-147 hub-walled / no KVR page — left unknown_other pending public installer receipt.",
)
C["slate-digital--vsx"] = (
    "unknown_other",
    "VSX is a monitoring system (software+hardware) — no clean public plugin installer semver.",
)
C["waves--drifter"] = (
    "unknown_other",
    "Waves Drifter — no KVR page / no public installer semver found; hub-walled via Waves Central.",
)
C["waves--ignition"] = (
    "unknown_other",
    "Waves Ignition — no KVR page / no public installer semver found; hub-walled via Waves Central.",
)

# Remaining "real plugin, just no version" → keep identity_kind plugin with explanatory notes
_PLUGIN_NO_VER = {
    "accusonus--era": "ERA / Accusonus — hub-walled (iZotope portal); no public installer semver found.",
    "audiopunks--ap-sansamp-rack": "AP SansAmp Rack — no exact KVR/public installer semver found.",
    "credland--pink": "Pink — no exact KVR/public installer semver found.",
    "cymatics--origin": "Cymatics Origin — no exact KVR/public installer semver found.",
    "harrison--harrison-vocalintensityprocessor": "Harrison Vocal Intensity Processor — SSL hub; no public per-SKU semver found.",
    "karanyi--karanyi-sounds-wavesurfer": "Karanyi Sounds Wavesurfer — no exact KVR/public installer semver found.",
    "kiive--xtressor": "Kiive Xtressor — probed rename path unclear; no public installer semver accepted.",
    "louder-than-liftoff--ltl-chop-shop-eq": "LTL Chop Shop EQ — no exact KVR/public installer semver found.",
    "mpegh--mpeg-h-renderer": "MPEG-H Renderer — no exact public installer semver found.",
    "pitchinnovations--groove-shaper-lite": "Groove Shaper LITE — no exact KVR/public installer semver found.",
    "soundspot--propane": "Propane — no exact KVR/public installer semver found.",
    "ssl--ssl-meter-pro": "SSL Meter Pro — product page/probe failed; no public installer semver accepted.",
    "thx--thx-spatial-creator": "THX Spatial Creator — no exact KVR/public installer semver found.",
    "unfiltered--indent": "Unfiltered Audio Indent — no exact KVR/public installer semver found.",
    "wa-production--heat2": "Heat2 — no exact KVR/public installer semver found.",
    "con--lurssen-mastering-console": "Lurssen Mastering Console — no exact KVR/public installer semver found.",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def apply_pa_spl_links(conn: sqlite3.Connection) -> list[str]:
    """Ensure discontinued PA/SPL successor/predecessor links where successors exist."""
    actions = []
    ts = now_iso()

    # elysia alpha master/mix → alpha compressor V2
    for old in (
        "plugin-alliance--elysia-alpha-master",
        "plugin-alliance--elysia-alpha-mix",
    ):
        succ = "plugin-alliance--elysia-alpha-compressor-v2"
        conn.execute(
            """
            UPDATE plugins SET
              discontinued = 1,
              update_class = 'discontinued',
              successor_plugin_id = ?,
              superseded_by_plugin_id = ?,
              updated_at = ?
            WHERE id = ?
            """,
            (succ, succ, ts, old),
        )
        actions.append(f"{old} → successor {succ} (discontinued)")

    # schoeps 1to3 / The Sauce: discontinued, no successor in DB
    for pid in (
        "plugin-alliance--schoeps-mono-upmix-1to3",
        "plugin-alliance--swivel-audio-the-sauce",
    ):
        conn.execute(
            """
            UPDATE plugins SET
              discontinued = 1,
              update_class = 'discontinued',
              updated_at = ?
            WHERE id = ?
            """,
            (ts, pid),
        )
        actions.append(f"{pid} marked discontinued (no successor)")

    # bx_xl_v2 already linked — ensure still set
    row = conn.execute(
        "SELECT successor_plugin_id, discontinued FROM plugins WHERE id=?",
        ("plugin-alliance--bx-xl-v2",),
    ).fetchone()
    if row and row[0] == "plugin-alliance--bx-xl-v3" and row[1]:
        actions.append("plugin-alliance--bx-xl-v2 already linked → bx_xl_v3")
    else:
        conn.execute(
            """
            UPDATE plugins SET
              discontinued = 1,
              update_class = 'paid_upgrade',
              successor_plugin_id = 'plugin-alliance--bx-xl-v3',
              superseded_by_plugin_id = 'plugin-alliance--bx-xl-v3',
              updated_at = ?
            WHERE id = 'plugin-alliance--bx-xl-v2'
            """,
            (ts,),
        )
        conn.execute(
            """
            UPDATE plugins SET
              predecessor_plugin_id = 'plugin-alliance--bx-xl-v2',
              updated_at = ?
            WHERE id = 'plugin-alliance--bx-xl-v3'
              AND (predecessor_plugin_id IS NULL OR predecessor_plugin_id = '')
            """,
            (ts,),
        )
        actions.append("plugin-alliance--bx-xl-v2 linked → bx_xl_v3")

    # Plus SKUs: set predecessor from legacy SPL rows (prefer canonical short id)
    plus_preds = [
        ("plugin-alliance--spl-attacker-plus", "spl--attacker"),
        ("plugin-alliance--spl-de-verb-plus", "spl--de-verb"),
        ("plugin-alliance--spl-mo-verb-plus", "spl--mo-verb"),
        ("plugin-alliance--spl-eq-ranger-plus", "spl--eq-rangers-vol-1"),
    ]
    for plus_id, pred_id in plus_preds:
        exists = conn.execute(
            "SELECT 1 FROM plugins WHERE id=?", (plus_id,)
        ).fetchone()
        pred_ok = conn.execute(
            "SELECT 1 FROM plugins WHERE id=?", (pred_id,)
        ).fetchone()
        if not exists or not pred_ok:
            continue
        conn.execute(
            """
            UPDATE plugins SET predecessor_plugin_id = ?, updated_at = ?
            WHERE id = ?
              AND (predecessor_plugin_id IS NULL OR predecessor_plugin_id = '')
            """,
            (pred_id, ts, plus_id),
        )
        actions.append(f"{plus_id} predecessor ← {pred_id}")

    return actions


def main() -> int:
    if not DB_PATH.is_file():
        print(f"DB missing: {DB_PATH}", file=sys.stderr)
        return 1

    # Merge plugin-no-ver into C
    for pid, note in _PLUGIN_NO_VER.items():
        C[pid] = ("plugin", note)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        cols = {r[1] for r in conn.execute("PRAGMA table_info(plugins)")}
        if "identity_kind" not in cols:
            print("Run migrate_v4.py first", file=sys.stderr)
            return 1

        unknown_ids = {
            r[0]
            for r in conn.execute(
                """
                SELECT id FROM plugins
                WHERE id NOT IN (SELECT plugin_id FROM plugin_version_current)
                """
            )
        }

        missing = sorted(unknown_ids - set(C))
        extra = sorted(set(C) - unknown_ids)
        if missing:
            print(f"ERROR: {len(missing)} unknowns not classified:", file=sys.stderr)
            for pid in missing:
                print(f"  {pid}", file=sys.stderr)
            return 1
        if extra:
            print(f"WARN: {len(extra)} classified IDs already have versions (skipping):")
            for pid in extra:
                print(f"  {pid}")

        ts = now_iso()
        updated = 0
        kind_counts: Counter[str] = Counter()
        for pid, (kind, notes) in C.items():
            if pid not in unknown_ids:
                continue
            if kind not in {
                "plugin",
                "soundset",
                "expansion",
                "hardware",
                "eurorack",
                "bundle",
                "suite_component",
                "daw_stock_effect",
                "hub_app",
                "gen_ambiguous",
                "discontinued",
                "unknown_other",
            }:
                print(f"bad kind {kind} for {pid}", file=sys.stderr)
                return 1
            conn.execute(
                """
                UPDATE plugins SET
                  identity_kind = ?,
                  notes_for_user = ?,
                  updated_at = ?
                WHERE id = ?
                """,
                (kind, notes, ts, pid),
            )
            kind_counts[kind] += 1
            updated += 1

        link_actions = apply_pa_spl_links(conn)
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            ("identity_kind_classified_at", ts),
        )
        conn.commit()

        print(f"Classified {updated} remaining unknowns")
        print("Counts by identity_kind (among remaining unknowns):")
        for k, n in sorted(kind_counts.items(), key=lambda x: (-x[1], x[0])):
            print(f"  {k}: {n}")
        print(f"Sum: {sum(kind_counts.values())} (expect {len(unknown_ids)})")
        print("PA/SPL link actions:")
        for a in link_actions:
            print(f"  {a}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
