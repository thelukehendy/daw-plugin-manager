import type { DawCatalogInfo, DawInfo } from '../../shared/types'

/** "10.1.43 (2022-06-16_0e617fc804)" → "10.1.43"; "7.54.0_91d78b1u" → "7.54.0". Display only. */
export function cleanDawVersion(version: string | null): string | null {
  if (!version) return null
  const m = version.match(/^\s*(\d+(?:\.\d+){0,3})/)
  return m ? m[1] : version
}

const VERDICT: Record<DawCatalogInfo['status'], string | null> = {
  current: 'Up to date',
  update_available: 'Update',
  update_likely: 'Likely update',
  check_in_app: null,
}

function dawTitle(d: DawInfo): string {
  const found = `${d.name} ${d.version ?? ''}`.trim()
  const cat = d.catalog
  if (!cat) return `${found}. Not in the catalog yet — check for updates in the app.`
  if (cat.status === 'check_in_app') {
    const latest = cat.latestVersion ? ` Catalog latest: ${cat.latestVersion}.` : ''
    return `${found}.${latest} The catalog can't compare this install yet — check for updates in ${cat.portalApp || d.name}.`
  }
  return `${found}. Catalog latest: ${cat.latestVersion ?? 'unknown'}.`
}

/** Installed DAWs, one compact line. */
export function DawStrip({
  daws,
  onOpenUrl,
}: {
  daws: DawInfo[]
  onOpenUrl: (url: string | null) => void
}) {
  return (
    <div className="daw-strip" aria-label="Installed DAWs">
      <span className="daw-strip-label">DAWs</span>
      {daws.length === 0 ? (
        <span className="daw-strip-empty">Detecting…</span>
      ) : (
        <ul className="daw-list">
          {daws.map((d) => {
            const status = d.catalog?.status ?? 'check_in_app'
            const verdict = VERDICT[status]
            const actionable = status === 'update_available' || status === 'update_likely'
            return (
              <li key={d.id || d.path} className={`daw-item daw-${status}`} title={dawTitle(d)}>
                <span className="daw-name">{d.name}</span>
                <span className="daw-ver mono">{cleanDawVersion(d.version)}</span>
                {verdict &&
                  (actionable && d.catalog?.updateUrl ? (
                    <button
                      type="button"
                      className="daw-verdict"
                      onClick={() => onOpenUrl(d.catalog?.updateUrl ?? null)}
                    >
                      {verdict} {d.catalog?.latestVersion} ↗
                    </button>
                  ) : (
                    <span className="daw-verdict">{verdict}</span>
                  ))}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
