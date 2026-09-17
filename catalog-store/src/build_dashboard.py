#!/usr/bin/env python3
"""Build the DAW Plugin Catalog live dashboard (single self-contained HTML).

Reads the store DB + band history + blocked list + backups dir, writes:
  - catalog-store/dashboard.html          (tracked; Cursor-visible)
The weekly job also copies it to ~/workspace/your_files/ for one-tap viewing.
"""
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

STORE = Path(__file__).resolve().parent.parent
DB = STORE / "data" / "catalog.db"
HISTORY = STORE / "out" / "band_history.json"
BLOCKED = STORE / "dashboard_blocked.json"
BACKUPS = STORE / "backups"

BAND_SQL = """
SELECT CASE WHEN vo.confidence>=85 THEN 'green'
            WHEN vo.confidence>=70 THEN 'amber' ELSE 'yellow' END AS band,
       COUNT(*)
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
GROUP BY 1
"""

MFR_SQL = """
SELECT COALESCE(m.popularity_tier,99) AS tier, m.id, m.name,
       COUNT(p.id) AS plugins,
       SUM(CASE WHEN vo.confidence>=85 THEN 1 ELSE 0 END) AS green,
       SUM(CASE WHEN vo.confidence>=70 AND vo.confidence<85 THEN 1 ELSE 0 END) AS amber,
       SUM(CASE WHEN vo.confidence<70 THEN 1 ELSE 0 END) AS yellow
FROM manufacturers m
LEFT JOIN plugins p ON p.manufacturer_id = m.id
LEFT JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
LEFT JOIN version_observations vo ON vo.id = pvc.observation_id
GROUP BY tier, m.id, m.name
ORDER BY tier, yellow DESC, m.name
"""

RECENT_SQL = """
SELECT COALESCE(p.popularity_tier, m.popularity_tier, 99) AS tier,
       vo.plugin_id, p.name, vo.observed_version, vo.confidence,
       substr(vo.verified_at,1,16) AS vat, m.name AS mfr
FROM version_observations vo
JOIN plugins p ON p.id = vo.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status='accepted' AND vo.verified_at IS NOT NULL
ORDER BY vo.verified_at DESC LIMIT 400
"""

TIER_SQL = """
SELECT COALESCE(p.popularity_tier, m.popularity_tier, 99) AS tier,
       COUNT(DISTINCT m.id) AS mfrs,
       COUNT(*) AS plugins
FROM plugins p
JOIN manufacturers m ON m.id = p.manufacturer_id
GROUP BY 1 ORDER BY 1
"""

# Static tier framing: category name, who lives there, and a VERY rough guess
# of what share of the app's users have at least one plugin from the tier
# installed. Broad guesses for prioritization only — not measured data.
TIER_INFO = {
    1: ("Household names",
        "The brands nearly every producer knows — Waves, FabFilter, iZotope, "
        "Valhalla, Xfer/Serum, Native Instruments, Antares/Auto-Tune, Soundtoys, "
        "Universal Audio, Arturia, u-he, Slate, Softube, SSL, Eventide…",
        "~80–95%"),
    2: ("Established pros & beloved indies",
        "Working-studio staples and cult favorites — Acustica, AudioThing, "
        "Baby Audio, Blue Cat, Cherry Audio, DMG, Klanghelm, TAL, Tokyo Dawn…",
        "~40–60%"),
    3: ("Working commercial & niche pro",
        "Smaller commercial devs and specialist tools — Boom Library, Caelum, "
        "Dawesome, Eiosis, Audio Modern, Drumforge…",
        "~15–30%"),
    4: ("Boutique / specialist",
        "Tiny specialist commercial catalogs.",
        "~3–10%"),
    99: ("Long tail (unranked)",
        "Hundreds of mostly freeware / one-person developers. Any single plugin "
        "reaches <1–2% of users, but collectively ~10–20% of users have at least one.",
        "~10–20%*"),
}


def band_counts(con):
    bands = dict(con.execute(BAND_SQL).fetchall())
    return {b: bands.get(b, 0) for b in ("green", "amber", "yellow")}


def main():
    con = sqlite3.connect(DB)
    mfr_count = con.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
    plugin_count = con.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
    accepted = con.execute("SELECT COUNT(*) FROM plugin_version_current").fetchone()[0]
    bands = band_counts(con)
    mfrs = [dict(zip(("tier", "id", "name", "plugins", "green", "amber", "yellow"), r))
            for r in con.execute(MFR_SQL).fetchall()]
    recent_all = [dict(zip(("tier", "pid", "pname", "ver", "conf", "at", "mfr"), r))
                  for r in con.execute(RECENT_SQL).fetchall()]
    tiers = [(t, m, p) for (t, m, p) in con.execute(TIER_SQL).fetchall()]
    con.close()

    history = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
    blocked = json.loads(BLOCKED.read_text()) if BLOCKED.exists() else []
    blocked_n = len(blocked)
    backups = sorted((p.name for p in BACKUPS.iterdir() if p.is_dir()),
                     reverse=True) if BACKUPS.exists() else []

    now = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d %I:%M %p %Z")
    total = sum(bands.values()) or 1
    cov = accepted / plugin_count * 100 if plugin_count else 0

    def pct(n):
        return f"{n / total * 100:.1f}%"

    hist_rows = "\n".join(
        f"<tr><td>{h['date']}</td><td class=num>{h['green']}</td>"
        f"<td class=num>{h['amber']}</td><td class=num>{h['yellow']}</td>"
        f"<td>{h.get('note', '')}</td></tr>" for h in history)

    blocked_rows = "\n".join(
        f"<tr><td>{b['manufacturer']}</td><td>{b['yellows']}</td>"
        f"<td>{b['blocker']}</td><td>{b.get('path_forward', '')}</td></tr>"
        for b in blocked)

    tier_blocks = []
    for (t, tmfrs, tplugins) in tiers:
        mm = [m for m in mfrs if m["tier"] == t]
        mrows = "\n".join(
            f"<tr><td>{m['name']}</td><td class=num>{m['plugins']}</td>"
            f"<td class=num g>{m['green'] or 0}</td>"
            f"<td class=num a>{m['amber'] or 0}</td>"
            f"<td class=num y>{m['yellow'] or 0}</td></tr>" for m in mm)
        rr = [r for r in recent_all if r["tier"] == t][:15]
        rrows = "\n".join(
            f"<tr><td>{r['mfr']}</td><td>{r['pname']}</td>"
            f"<td class=num><b>{r['ver']}</b></td><td class=num>{r['conf']}</td>"
            f"<td>{r['at']}</td></tr>" for r in rr) or \
            "<tr><td colspan=5 class=note>No recent raises in this tier yet.</td></tr>"
        info = TIER_INFO.get(t, ("", "", ""))
        topen = " open" if t == 1 else ""
        mopen = " open" if t == 1 else ""
        tier_blocks.append(
            f"<details{topen}><summary><b>Tier {t} — {info[0]}</b> · "
            f"{tmfrs} manufacturers · {tplugins:,} plugins · {info[2]} of users</summary>\n"
            f"<div class=\"dbody\"><p class=\"note\">{info[1]}</p>\n"
            f"<details{mopen}><summary>Manufacturers ({len(mm)})</summary><div class=\"dbody\">\n"
            f"<input type=\"search\" placeholder=\"Filter manufacturers…\" oninput=\"fq(this)\">\n"
            f"<table><tr><th>Manufacturer</th><th class=num>Plugins</th><th class=num>Green</th>"
            f"<th class=num>Amber</th><th class=num>Yellow</th></tr>\n{mrows}</table></div></details>\n"
            f"<details><summary>Recent raises (latest {len(rr)})</summary><div class=\"dbody\">\n"
            f"<table><tr><th>Manufacturer</th><th>Plugin</th><th class=num>Version</th>"
            f"<th class=num>Conf</th><th>Verified</th></tr>\n{rrows}</table></div></details>\n"
            f"</div></details>")
    tier_blocks_html = "\n".join(tier_blocks)

    backup_rows = "\n".join(
        f"<tr><td>{b}</td><td>catalog-store/backups/{b}/catalog.json</td></tr>"
        for b in backups) or "<tr><td colspan=2>No backups yet.</td></tr>"

    html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DAW Plugin Catalog — Live Dashboard</title>
<style>
body{{font-family:-apple-system,system-ui,sans-serif;max-width:960px;margin:0 auto;padding:16px;color:#1a1a1a;background:#fafafa}}
h1{{font-size:1.5em;margin-bottom:0}} .sub{{color:#666;margin:4px 0 20px}}
.cards{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:20px}}
.card{{background:#fff;border:1px solid #e2e2e2;border-radius:10px;padding:12px}}
.card .v{{font-size:1.6em;font-weight:700}} .card .l{{color:#666;font-size:.85em}}
.bar{{height:8px;border-radius:4px;background:#eee;overflow:hidden;margin-top:8px}}
.bar span{{display:block;height:100%}}
details{{background:#fff;border:1px solid #e2e2e2;border-radius:10px;margin-bottom:10px}}
summary{{padding:12px;cursor:pointer;font-weight:600}}
.dbody{{padding:0 12px 12px}} table{{width:100%;border-collapse:collapse;font-size:.9em}}
th,td{{text-align:left;padding:6px 8px;border-bottom:1px solid #f0f0f0}}
.num{{text-align:right;font-variant-numeric:tabular-nums}}
.g{{color:#1a7f37;font-weight:600}} .a{{color:#9a6700}} .y{{color:#666}}
input[type=search]{{width:100%;padding:8px;margin-bottom:8px;border:1px solid #ddd;border-radius:8px}}
.note{{font-size:.85em;color:#666}}
</style></head><body>
<h1>DAW Plugin Catalog — Live Dashboard</h1>
<p class="sub">Updated {now} · regenerated by the weekly automation · no need to ask, just open this file</p>
<div class="cards">
<div class="card"><div class="v">{mfr_count}</div><div class="l">Manufacturers</div></div>
<div class="card"><div class="v">{plugin_count:,}</div><div class="l">Plugins tracked</div></div>
<div class="card"><div class="v">{accepted:,}</div><div class="l">Accepted versions ({cov:.1f}% coverage)</div></div>
<div class="card"><div class="v g">{bands['green']:,}</div><div class="l">Green ≥85 ({pct(bands['green'])})</div>
<div class="bar"><span style="width:{pct(bands['green'])};background:#1a7f37"></span></div></div>
<div class="card"><div class="v a">{bands['amber']}</div><div class="l">Amber 70–84 ({pct(bands['amber'])})</div>
<div class="bar"><span style="width:{pct(bands['amber'])};background:#9a6700"></span></div></div>
<div class="card"><div class="v y">{bands['yellow']:,}</div><div class="l">Yellow &lt;70 ({pct(bands['yellow'])})</div>
<div class="bar"><span style="width:{pct(bands['yellow'])};background:#999"></span></div></div>
</div>
<details open><summary>Popularity tiers — who the catalog serves</summary><div class="dbody">
<p class="note">Tiers are internal research-priority metadata (never exported to the app). The user-share figures are <b>very rough guesses</b> for prioritization — what share of the app's users likely have at least one plugin from the tier installed — not measured data. Research already works tier 1 first so the most users benefit. *Long-tail: any single plugin reaches &lt;1–2% of users.</p>
{tier_blocks_html}
<script>function fq(el){{var q=el.value.toLowerCase();var t=el.parentElement.querySelector('table');t.querySelectorAll('tr').forEach(function(r,i){{if(i>0)r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'}})}}</script>
</div></details>
<details open><summary>Confidence history</summary><div class="dbody">
<table><tr><th>Date</th><th class=num>Green</th><th class=num>Amber</th><th class=num>Yellow</th><th>Note</th></tr>
{hist_rows}</table></div></details>
<details><summary>Boundaries under assault ({blocked_n} — alternate evidence paths in progress)</summary><div class="dbody">
<p class="note">These manufacturers wall versions behind account portals. The weekly job attacks them via alternate paths — Wayback snapshots, forum archaeology, reseller listings, installer-filename leaks, release-note archives — and logs every attempt. A specific narrow ask goes to Luke only when a boundary is truly unbreakable without a login.</p>
<table><tr><th>Manufacturer</th><th>Yellows</th><th>Blocker</th><th>Path forward</th></tr>
{blocked_rows}</table></div></details>
<details><summary>Weekly backups</summary><div class="dbody">
<p class="note">Before each weekly update, the outgoing export is snapshotted here. Retention: 12 weeks. Git history holds every version permanently.</p>
<table><tr><th>Date</th><th>Path</th></tr>{backup_rows}</table></div></details>
<details><summary>How the weekly automation works</summary><div class="dbody">
<p class="note">An autonomous research engine works the catalog continuously (every 12h in tier-1 maintenance mode): it researches yellow-band plugins from public manufacturer evidence only — no sign-ins, no purchases, no outreach — coordinator-verifies every raise, does bounded universe-expansion discovery, green freshness checks, and Apple Silicon/version-scheme sweeps. A daily push (~6am PT) backs up, re-exports the store, syncs <code>catalog/catalog.json</code> (the file the app + CDN serve), rebuilds this dashboard, and pushes to GitHub. Full contract: <code>catalog-store/WEEKLY-AUTOMATION.md</code>.</p>
</div></details>
</body></html>"""

    out = STORE / "dashboard.html"
    out.write_text(html)
    print(f"wrote {out} ({len(html)//1024}KB)")


if __name__ == "__main__":
    main()
