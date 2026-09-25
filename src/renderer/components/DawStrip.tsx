import type { DawCatalogInfo, DawInfo, PluginReportRow } from '../../shared/types'

const DAW_VERDICT: Record<DawCatalogInfo['status'], string | null> = {
  current: 'Up to date',
  update_available: 'Update available',
  update_likely: 'Update likely available',
  check_in_app: null,
}

function dawTitle(d: DawInfo): string {
  const found = d.version ? `${d.name} ${d.version} — detected on this Mac.` : `${d.name} — detected on this Mac.`
  const cat = d.catalog
  if (!cat) return found
  if (cat.status === 'check_in_app') {
    const where = cat.portalApp || d.name
    return `${found} Check for updates in ${where}.`
  }
  return cat.latestVersion ? `${found} Latest: ${cat.latestVersion}.` : found
}

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
        {daws.map((d) => {
          const verdict = DAW_VERDICT[d.catalog?.status ?? 'check_in_app']
          return (
            <li key={d.id || d.path} className="daw-chip" title={dawTitle(d)}>
              <span className="daw-chip-name">{d.name}</span>
              {d.version && <span className="daw-chip-ver mono">{d.version}</span>}
              {verdict && (
                <span className={`daw-chip-verdict daw-verdict-${d.catalog?.status}`}>
                  {verdict}
                </span>
              )}
            </li>
          )
        })}
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
