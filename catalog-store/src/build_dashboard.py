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
SELECT m.id, m.name,
       COUNT(p.id) AS plugins,
       SUM(CASE WHEN vo.confidence>=85 THEN 1 ELSE 0 END) AS green,
       SUM(CASE WHEN vo.confidence>=70 AND vo.confidence<85 THEN 1 ELSE 0 END) AS amber,
       SUM(CASE WHEN vo.confidence<70 THEN 1 ELSE 0 END) AS yellow
FROM manufacturers m
LEFT JOIN plugins p ON p.manufacturer_id = m.id
LEFT JOIN plugin_version_current pvc ON pvc.plugin_id = p.id
LEFT JOIN version_observations vo ON vo.id = pvc.observation_id
GROUP BY m.id, m.name
ORDER BY yellow DESC, m.name
"""

RECENT_SQL = """
SELECT vo.plugin_id, p.name, vo.observed_version, vo.confidence,
       vo.verified_by, substr(vo.verified_at,1,16) AS vat, m.name AS mfr
FROM version_observations vo
JOIN plugins p ON p.id = vo.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
WHERE vo.status='accepted' AND vo.verified_at IS NOT NULL
ORDER BY vo.verified_at DESC LIMIT 40
"""


def band_counts(con):
    bands = dict(con.execute(BAND_SQL).fetchall())
    return {b: bands.get(b, 0) for b in ("green", "amber", "yellow")}


def main():
    con = sqlite3.connect(DB)
    mfr_count = con.execute("SELECT COUNT(*) FROM manufacturers").fetchone()[0]
    plugin_count = con.execute("SELECT COUNT(*) FROM plugins").fetchone()[0]
    accepted = con.execute("SELECT COUNT(*) FROM plugin_version_current").fetchone()[0]
    bands = band_counts(con)
    mfrs = [dict(zip(("id", "name", "plugins", "green", "amber", "yellow"), r))
            for r in con.execute(MFR_SQL).fetchall()]
    recent = [dict(zip(("pid", "pname", "ver", "conf", "by", "at", "mfr"), r))
              for r in con.execute(RECENT_SQL).fetchall()]
    con.close()

    history = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
    blocked = json.loads(BLOCKED.read_text()) if BLOCKED.exists() else []
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

    mfr_rows = "\n".join(
        f"<tr><td>{m['name']}</td><td class=num>{m['plugins']}</td>"
        f"<td class=num g>{m['green'] or 0}</td>"
        f"<td class=num a>{m['amber'] or 0}</td>"
        f"<td class=num y>{m['yellow'] or 0}</td></tr>" for m in mfrs)

    recent_rows = "\n".join(
        f"<tr><td>{r['mfr']}</td><td>{r['pname']}</td>"
        f"<td class=num><b>{r['ver']}</b></td><td class=num>{r['conf']}</td>"
        f"<td>{r['at']}</td></tr>" for r in recent)

    blocked_rows = "\n".join(
        f"<tr><td>{b['manufacturer']}</td><td>{b['yellows']}</td>"
        f"<td>{b['blocker']}</td><td>{b.get('path_forward', '')}</td></tr>"
        for b in blocked)

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
<details open><summary>Confidence history</summary><div class="dbody">
<table><tr><th>Date</th><th class=num>Green</th><th class=num>Amber</th><th class=num>Yellow</th><th>Note</th></tr>
{hist_rows}</table></div></details>
<details><summary>Per-manufacturer breakdown ({mfr_count})</summary><div class="dbody">
<input type="search" id="q" placeholder="Filter manufacturers…" oninput="f()">
<table id="mt"><tr><th>Manufacturer</th><th class=num>Plugins</th><th class=num>Green</th><th class=num>Amber</th><th class=num>Yellow</th></tr>
{mfr_rows}</table>
<script>function f(){{var q=document.getElementById('q').value.toLowerCase();
document.querySelectorAll('#mt tr').forEach(function(r,i){{if(i>0)r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'}})}}</script>
</div></details>
<details><summary>Recent raises (latest 40)</summary><div class="dbody">
<table><tr><th>Manufacturer</th><th>Plugin</th><th class=num>Version</th><th class=num>Conf</th><th>Verified</th></tr>
{recent_rows}</table></div></details>
<details><summary>Blocked manufacturers (needs Luke's login — can't automate)</summary><div class="dbody">
<p class="note">These hold versions behind account portals. The weekly automation can't reach them without a logged-in session.</p>
<table><tr><th>Manufacturer</th><th>Yellows</th><th>Blocker</th><th>Path forward</th></tr>
{blocked_rows}</table></div></details>
<details><summary>Weekly backups</summary><div class="dbody">
<p class="note">Before each weekly update, the outgoing export is snapshotted here. Retention: 12 weeks. Git history holds every version permanently.</p>
<table><tr><th>Date</th><th>Path</th></tr>{backup_rows}</table></div></details>
<details><summary>How the weekly automation works</summary><div class="dbody">
<p class="note">Every Monday ~2am PT, an autonomous run: (1) backs up the current export, (2) researches a bounded batch of yellow/amber targets from public manufacturer evidence only — no sign-ins, no purchases, no outreach, (3) coordinator-verifies every raise and inserts it with evidence + confidence, (4) bounded universe-expansion discovery, (5) green freshness spot-checks, (6) re-exports the store, syncs <code>catalog/catalog.json</code> (the file the app + CDN serve), rebuilds this dashboard, updates STATUS/HANDOFF/weekly notes, commits, and pushes to GitHub. Full contract: <code>catalog-store/WEEKLY-AUTOMATION.md</code>.</p>
</div></details>
</body></html>"""

    out = STORE / "dashboard.html"
    out.write_text(html)
    print(f"wrote {out} ({len(html)//1024}KB)")


if __name__ == "__main__":
    main()
