import type { DawCatalogInfo, DawInfo, HelperAppInfo } from '../../shared/types'
import type { TriageFilter } from '../lib/triage'

/** "10.1.43 (2022-06-16_0e617fc804)" → "10.1.43"; "7.54.0_91d78b1u" → "7.54.0". Display only. */
export function cleanVersion(version: string | null): string | null {
  if (!version) return null
  const m = version.match(/^\s*(\d+(?:\.\d+){0,3})/)
  return m ? m[1] : version
}

type Verdict = DawCatalogInfo['status']

const ACTIONABLE: Verdict[] = ['update_available', 'update_likely', 'newer_major']

function verdictLine(installed: string | null, cat: DawCatalogInfo | null | undefined): string {
  const v = cleanVersion(installed) ?? '—'
  if (!cat) return v
  switch (cat.status) {
    case 'current':
      return `${v} · Up to date`
    case 'update_available':
    case 'update_likely':
      return `${v} → ${cat.latestVersion}`
    case 'newer_major':
      return `${v} · ${cat.latestVersion} out`
    case 'discontinued':
      return `${v} · Discontinued`
    case 'not_tracked':
      return `${v} · Not tracked`
    default:
      return v
  }
}

function verdictTitle(name: string, installed: string | null, cat: DawCatalogInfo | null | undefined): string {
  const have = `${name} ${installed ?? ''}`.trim()
  if (!cat) return `${have}. Not in the catalog yet — check for updates in the app.`
  const where = cat.portalApp || name
  const hedge = cat.inferred ? ' Compared without a catalog rule for this app, so confirm in the app.' : ''
  switch (cat.status) {
    case 'current':
      return `${have}. Matches the catalog latest (${cat.latestVersion}).${hedge}`
    case 'update_available':
      return `${have}. ${cat.latestVersion} is out. Click to open the update page.`
    case 'update_likely':
      return `${have}. ${cat.latestVersion} looks newer.${hedge} Click to open the update page.`
    case 'newer_major':
      return `${have}. ${cat.latestVersion} is a newer major version, often a paid upgrade. Click for details.`
    case 'discontinued':
      return `${have}. The vendor discontinued this app${cat.finalVersion ? ` (final version ${cat.finalVersion})` : ''}.`
    case 'not_tracked':
      return `${have}. The catalog doesn't track this app's version yet — open ${where} to check.`
    default:
      return `${have}. Check for updates in ${where}.`
  }
}

function AppItem({
  name,
  version,
  catalog,
  onOpenUrl,
}: {
  name: string
  version: string | null
  catalog: DawCatalogInfo | null | undefined
  onOpenUrl: (url: string | null) => void
}) {
  const status = catalog?.status ?? 'check_in_app'
  const url = catalog?.updateUrl ?? null
  const clickable = !!url && (ACTIONABLE.includes(status) || status === 'not_tracked')
  const body = (
    <>
      <span className="side-app-name">{name}</span>
      <span className="side-app-ver mono">
        <i className={`dot v-${status}${catalog?.inferred ? ' is-inferred' : ''}`} aria-hidden />
        {verdictLine(version, catalog)}
      </span>
    </>
  )
  return (
    <li title={verdictTitle(name, version, catalog)}>
      {clickable ? (
        <button type="button" className={`side-app app-${status}`} onClick={() => onOpenUrl(url)}>
          {body}
        </button>
      ) : (
        <div className={`side-app app-${status}`}>{body}</div>
      )}
    </li>
  )
}

function sectionCount(items: { catalog?: DawCatalogInfo | null }[]): number {
  return items.filter((i) => i.catalog && ACTIONABLE.includes(i.catalog.status)).length
}

export interface ViewItem {
  id: TriageFilter
  label: string
  count: number
  title: string
}

export function AppSidebar({
  views,
  view,
  onView,
  daws,
  helpers,
  scanning,
  onOpenUrl,
}: {
  views: ViewItem[]
  view: TriageFilter
  onView: (v: TriageFilter) => void
  daws: DawInfo[]
  helpers: HelperAppInfo[]
  scanning: boolean
  onOpenUrl: (url: string | null) => void
}) {
  const dawUpdates = sectionCount(daws)
  const helperUpdates = sectionCount(helpers)
  return (
    <aside className="sidebar" aria-label="Library navigation">
      <nav className="side-views" aria-label="Plugin views">
        <h2 className="side-heading">Plugins</h2>
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`side-view view-${v.id} ${view === v.id ? 'on' : ''} ${v.count ? '' : 'is-empty'}`}
            onClick={() => onView(v.id)}
            title={v.title}
            aria-pressed={view === v.id}
          >
            <span>{v.label}</span>
            <span className="count mono">{v.count}</span>
          </button>
        ))}
      </nav>

      <section className="side-section" aria-label="Installed DAWs">
        <h2 className="side-heading">
          DAWs
          {dawUpdates > 0 && <span className="side-badge">{dawUpdates}</span>}
        </h2>
        {daws.length ? (
          <ul className="side-apps">
            {daws.map((d) => (
              <AppItem key={d.id || d.path} name={d.name} version={d.version} catalog={d.catalog} onOpenUrl={onOpenUrl} />
            ))}
          </ul>
        ) : (
          <p className="side-empty">{scanning ? 'Detecting…' : 'None found'}</p>
        )}
      </section>

      <section className="side-section" aria-label="Helper apps">
        <h2 className="side-heading" title="License managers, installers and vendor hub apps">
          Helper apps
          {helperUpdates > 0 && <span className="side-badge">{helperUpdates}</span>}
        </h2>
        {helpers.length ? (
          <ul className="side-apps">
            {helpers.map((h) => (
              <AppItem key={h.path} name={h.name} version={h.version} catalog={h.catalog} onOpenUrl={onOpenUrl} />
            ))}
          </ul>
        ) : (
          <p className="side-empty">{scanning ? 'Detecting…' : 'Rescan to check helper apps'}</p>
        )}
      </section>
    </aside>
  )
}
