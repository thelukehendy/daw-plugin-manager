import type { DawInfo, PluginReportRow } from '../../shared/types'

/** Readable installed-DAW strip — always at the top of Library. */
export function DawStrip({
  daws,
  rows,
}: {
  daws: DawInfo[]
  rows: PluginReportRow[]
}) {
  if (!daws.length) {
    return (
      <div className="daw-strip-panel empty">
        <span className="daw-strip-label">Installed DAWs</span>
        <span className="daw-strip-empty">None detected yet — run Scan</span>
      </div>
    )
  }

  // Cheap heuristic: count rows whose paths or formats suggest DAW usage is unknown;
  // show plugin totals from the library as context next to each DAW name.
  const libraryCount = rows.length

  return (
    <div className="daw-strip-panel" aria-label="Installed DAWs">
      <span className="daw-strip-label">Installed DAWs</span>
      <ul className="daw-strip-list">
        {daws.map((d) => (
          <li key={d.id || d.path} className="daw-chip" title={d.path}>
            <span className="daw-chip-name">{d.name}</span>
            {d.version && <span className="daw-chip-ver mono">{d.version}</span>}
          </li>
        ))}
      </ul>
      <span className="daw-strip-meta mono">
        {daws.length} DAW{daws.length === 1 ? '' : 's'}
        {libraryCount > 0 ? ` · ${libraryCount} plugins in library` : ''}
      </span>
    </div>
  )
}
