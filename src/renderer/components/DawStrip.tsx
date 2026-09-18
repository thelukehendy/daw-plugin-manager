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
      <div
        className="daw-strip-panel empty"
        title="Hosts found in Applications after a scan. Run Scan to detect Logic, Ableton, and friends."
      >
        <span className="daw-strip-label">Installed DAWs</span>
        <span className="daw-strip-empty">None detected yet — run Scan</span>
      </div>
    )
  }

  const libraryCount = rows.length

  return (
    <div
      className="daw-strip-panel"
      aria-label="Installed DAWs"
      title="Music apps found on this Mac. Plugin counts below are your whole library, not per-DAW usage."
    >
      <span className="daw-strip-label">Installed DAWs</span>
      <ul className="daw-strip-list">
        {daws.map((d) => (
          <li
            key={d.id || d.path}
            className="daw-chip"
            title={
              d.version
                ? `${d.name} ${d.version} — detected on this Mac.`
                : `${d.name} — detected on this Mac.`
            }
          >
            <span className="daw-chip-name">{d.name}</span>
            {d.version && <span className="daw-chip-ver mono">{d.version}</span>}
          </li>
        ))}
      </ul>
      <span
        className="daw-strip-meta mono"
        title="How many hosts were found, and how many plugins matched in your last scan."
      >
        {daws.length} DAW{daws.length === 1 ? '' : 's'}
        {libraryCount > 0 ? ` · ${libraryCount} plugins in library` : ''}
      </span>
    </div>
  )
}
