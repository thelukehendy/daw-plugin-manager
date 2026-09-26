import { useEffect, useMemo, useRef, useState } from 'react'
import type { ConfidenceBand, PluginReportRow, ScanProgress, ScanReport } from '../shared/types'
import { WelcomeHero } from './components/WelcomeHero'
import { DetailPanel } from './components/DetailPanel'
import { AppSidebar } from './components/AppSidebar'
import { SplashScreen } from './components/SplashScreen'
import { FeedbackPanel } from './components/FeedbackPanel'
import { ExtraFoldersField } from './components/ExtraFoldersField'
import iconUrl from './assets/app-icon.svg'
import {
  LibraryTable,
  STATUS_ORDER,
  type SortKey,
  type VendorGroup,
} from './components/LibraryTable'
import { TRIAGE_CHIP_TITLE, TRIAGE_ORDER, productTriage, type TriageFilter } from './lib/triage'
import { identityLabel, scrubVisibleText } from './lib/labels'

type Mode = 'welcome' | 'library'
type ConfidenceFilter = 'all' | ConfidenceBand
type IdentityFilter = 'all' | string
type Theme = 'dark' | 'light'

const THEME_KEY = 'daw-pm-theme'
const GROUPED_KEY = 'daw-pm-grouped'

const VIEW_LABEL: Record<TriageFilter, string> = {
  needs_update: 'Updates',
  use_hub: 'Via hub app',
  paid: 'Paid upgrades',
  uncertain: 'Check manually',
  clear: 'Nothing to do',
  all: 'All',
}

const VIEW_EMPTY: Record<TriageFilter, string> = {
  needs_update: 'No updates waiting. Everything the catalog can verify is current.',
  use_hub: 'No plugins that update through a vendor hub app.',
  paid: 'No paid next-generation upgrades for what you have installed.',
  uncertain: 'Nothing to check by hand.',
  clear: 'Nothing here.',
  all: 'No plugins match.',
}

const IDENTITY_OPTIONS = [
  'plugin',
  'hub_app',
  'soundset',
  'expansion',
  'bundle',
  'suite_component',
  'discontinued',
  'gen_ambiguous',
  'hardware',
]

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null
    if (v && allowed.includes(v)) return v
  } catch {
    /* ignore */
  }
  return fallback
}

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

function emptyReport(daws: ScanReport['daws'], catalog?: Partial<ScanReport['catalog']>): ScanReport {
  return {
    system: { platform: 'darwin', osVersion: null, arch: 'arm64', homedir: '', scannedAt: new Date().toISOString() },
    daws,
    plugins: [],
    rows: [],
    manufacturers: [],
    catalog: {
      updatedAt: catalog?.updatedAt ?? new Date(0).toISOString(),
      source: catalog?.source ?? 'scanning',
      pluginCount: catalog?.pluginCount ?? 0,
      manufacturerCount: catalog?.manufacturerCount ?? 0,
    },
    summary: {
      dawCount: daws.length,
      pluginBundleCount: 0,
      pluginCount: 0,
      manufacturerCount: 0,
      current: 0,
      outdated: 0,
      unknown: 0,
      bundled: 0,
      legacy: 0,
      compatWarnings: 0,
    },
  }
}

function matchesQuery(row: PluginReportRow, q: string): boolean {
  if (!q) return true
  return (
    row.name.toLowerCase().includes(q) ||
    row.manufacturer.toLowerCase().includes(q) ||
    row.productLine.toLowerCase().includes(q) ||
    (row.portalApp || '').toLowerCase().includes(q)
  )
}

function compareRows(sort: SortKey) {
  return (a: PluginReportRow, b: PluginReportRow): number => {
    if (sort === 'status') {
      const d = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (d) return d
    } else if (sort === 'vendor') {
      const d = a.manufacturer.localeCompare(b.manufacturer)
      if (d) return d
    } else if (sort === 'installed') {
      const d = (a.installedVersion || '').localeCompare(b.installedVersion || '', undefined, {
        numeric: true,
      })
      if (d) return d
    }
    return a.name.localeCompare(b.name)
  }
}

function formatDate(iso: string | null | undefined, withTime = false): string | null {
  const t = iso ? Date.parse(iso) : NaN
  if (!Number.isFinite(t) || t <= 0) return null
  return new Date(t).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : { year: 'numeric' }),
  })
}

export default function App() {
  const [mode, setMode] = useState<Mode>('welcome')
  const [theme, setTheme] = useState<Theme>(() => readStored(THEME_KEY, ['dark', 'light'], 'dark'))
  const [grouped, setGrouped] = useState(() => readStored(GROUPED_KEY, ['1', '0'], '1') === '1')
  const [report, setReport] = useState<ScanReport | null>(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<TriageFilter>('all')
  const [sort, setSort] = useState<SortKey>('name')
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all')
  const [identityFilter, setIdentityFilter] = useState<IdentityFilter>('all')
  const [manufacturerFilter, setManufacturerFilter] = useState('')
  const [selected, setSelected] = useState<PluginReportRow | null>(null)
  const [extraRoots, setExtraRoots] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [fromSnapshot, setFromSnapshot] = useState(false)
  const [refreshingCatalog, setRefreshingCatalog] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashSticky, setSplashSticky] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const viewChosenFor = useRef<ScanReport | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    store(THEME_KEY, theme)
  }, [theme])

  useEffect(() => store(GROUPED_KEY, grouped ? '1' : '0'), [grouped])

  useEffect(() => {
    const api = window.dawPluginManager
    if (!api) return
    return api.onScanProgress((p) => {
      setProgress(p)
      const daws = p.partial?.daws
      if (!daws) return
      setReport((prev) => (prev ? { ...prev, daws } : emptyReport(daws)))
      setMode('library')
      setFromSnapshot(false)
    })
  }, [])

  useEffect(() => {
    const api = window.dawPluginManager
    if (!api?.loadLastLibrary) return
    let cancelled = false
    api
      .loadLastLibrary()
      .then((last) => {
        if (cancelled || !last) return
        setReport(last)
        setMode('library')
        setFromSnapshot(true)
      })
      .catch(() => {
        /* first launch */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const manufacturerNames = useMemo(
    () => [...new Set((report?.rows || []).map((r) => r.manufacturer))].sort((a, b) => a.localeCompare(b)),
    [report]
  )

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (report?.rows || []).filter(
      (row) =>
        (!manufacturerFilter || row.manufacturer === manufacturerFilter) &&
        (confidenceFilter === 'all' || row.confidenceBand === confidenceFilter) &&
        (identityFilter === 'all' || row.identityKind === identityFilter) &&
        matchesQuery(row, q)
    )
  }, [report, query, manufacturerFilter, confidenceFilter, identityFilter])

  const counts = useMemo(() => {
    const c: Record<TriageFilter, number> = {
      needs_update: 0,
      use_hub: 0,
      paid: 0,
      uncertain: 0,
      clear: 0,
      all: filteredRows.length,
    }
    for (const r of filteredRows) c[productTriage(r.status)]++
    return c
  }, [filteredRows])

  // Open on the view that needs attention first, once per loaded report.
  useEffect(() => {
    if (!report?.rows.length || viewChosenFor.current === report) return
    viewChosenFor.current = report
    const first = TRIAGE_ORDER.find((b) => b !== 'clear' && report.rows.some((r) => productTriage(r.status) === b))
    setView(first ?? 'all')
  }, [report])

  const groups = useMemo((): VendorGroup[] => {
    const rows = (view === 'all' ? filteredRows : filteredRows.filter((r) => productTriage(r.status) === view))
      .slice()
      .sort(compareRows(sort))
    if (!grouped) {
      return rows.length
        ? [{ key: 'all', vendor: '', portalApp: null, updateUrl: null, popularityTier: null, rows }]
        : []
    }
    const vendorMeta = new Map((report?.manufacturers || []).map((g) => [g.manufacturer, g]))
    const byVendor = new Map<string, PluginReportRow[]>()
    for (const r of rows) byVendor.set(r.manufacturer, [...(byVendor.get(r.manufacturer) || []), r])
    return [...byVendor.entries()]
      .map(([vendor, vrows]) => {
        const meta = vendorMeta.get(vendor)
        return {
          key: vendor,
          vendor,
          portalApp: meta?.portalApp ?? vrows.find((r) => r.portalApp)?.portalApp ?? null,
          updateUrl: meta?.updateUrl ?? vrows.find((r) => r.updateUrl)?.updateUrl ?? null,
          popularityTier: meta?.popularityTier ?? null,
          rows: vrows,
        }
      })
      .sort(
        (a, b) =>
          (a.popularityTier ?? 99) - (b.popularityTier ?? 99) ||
          b.rows.length - a.rows.length ||
          a.vendor.localeCompare(b.vendor)
      )
  }, [filteredRows, view, sort, grouped, report])

  const visibleRows = useMemo(() => groups.flatMap((g) => g.rows), [groups])

  // Keyboard: "/" search, ↑/↓ move selection, Esc close detail.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = (e.target as HTMLElement)?.closest('input, textarea, select')
      if (e.key === '/' && !typing) {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }
      if (e.key === 'Escape') {
        if (typing) (e.target as HTMLElement).blur()
        else setSelected(null)
        return
      }
      if (typing || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || !visibleRows.length) return
      e.preventDefault()
      const i = selected ? visibleRows.findIndex((r) => r.id === selected.id) : -1
      const next = e.key === 'ArrowDown' ? Math.min(i + 1, visibleRows.length - 1) : Math.max(i - 1, 0)
      setSelected(visibleRows[next])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visibleRows, selected])

  async function handleRefreshCatalog() {
    const api = window.dawPluginManager
    if (!api?.refreshCatalog) return
    setRefreshingCatalog(true)
    setError(null)
    try {
      const meta = await api.refreshCatalog()
      setReport((prev) => (prev ? { ...prev, catalog: { ...prev.catalog, ...meta } } : emptyReport([], meta)))
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err)
      setError(scrubVisibleText(raw) || "Couldn't verify the catalog")
    } finally {
      setRefreshingCatalog(false)
    }
  }

  async function handleScan() {
    const api = window.dawPluginManager
    if (!api) {
      setError('Electron bridge not available. Run with npm run dev.')
      return
    }
    setScanning(true)
    setError(null)
    setFromSnapshot(false)
    setProgress({ phase: 'daws', message: 'Starting scan…', percent: 0 })
    try {
      const roots = extraRoots.split('\n').map((s) => s.trim()).filter(Boolean)
      const result = await api.runScan({ extraPluginRoots: roots })
      setReport(result)
      setMode('library')
      setSelected(null)
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err)
      setError(scrubVisibleText(raw) || 'Scan failed. Try again.')
    } finally {
      setScanning(false)
    }
  }

  async function openUpdate(url: string | null) {
    if (!url || !window.dawPluginManager) return
    await window.dawPluginManager.openExternal(url)
  }

  const showLibrary = mode === 'library' && report
  const catalogDate = report?.catalog.source !== 'scanning' ? formatDate(report?.catalog.updatedAt) : null
  const scannedAt = formatDate(report?.system.scannedAt, true)
  const filtersActive =
    !!query || !!manufacturerFilter || confidenceFilter !== 'all' || identityFilter !== 'all'

  return (
    <div className={`app shell mode-${mode}`}>
      {showSplash && (
        <SplashScreen
          catalogDate={catalogDate}
          sticky={splashSticky}
          onDone={() => {
            setShowSplash(false)
            setSplashSticky(false)
          }}
        />
      )}
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => {
            setSplashSticky(true)
            setShowSplash(true)
          }}
          title="About DAW Plugin Manager"
        >
          <img className="brand-icon" src={iconUrl} alt="" width={20} height={20} />
          <span className="brand-mark">DAW Plugin Manager</span>
        </button>

        {showLibrary && (
          <div className="search-wrap">
            <input
              ref={searchRef}
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plugins, vendors, hub apps"
              aria-label="Search"
            />
            <kbd className="search-hint" aria-hidden>
              /
            </kbd>
          </div>
        )}

        <div className="topbar-actions">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={handleRefreshCatalog}
            disabled={refreshingCatalog || scanning}
            title="Download the newest published version catalog. Does not rescan plugins on disk."
          >
            {refreshingCatalog ? 'Refreshing…' : 'Refresh catalog'}
          </button>
          <button
            type="button"
            className={`btn btn-quiet ${showSettings ? 'on' : ''}`}
            onClick={() => setShowSettings((s) => !s)}
            aria-expanded={showSettings}
            title="Extra plugin folders, appearance, and feedback."
          >
            Settings
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleScan}
            disabled={scanning}
            title="Scan plugin folders on this Mac and match them to the catalog."
          >
            {scanning ? `Scanning ${progress?.percent ?? 0}%` : report ? 'Rescan' : 'Scan'}
          </button>
        </div>
      </header>

      {scanning && (
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${progress?.percent ?? 10}%` }} />
          <span>{progress?.message || 'Scanning…'}</span>
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button type="button" className="link-btn" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {showSettings && (
        <div className="settings-strip">
          <ExtraFoldersField value={extraRoots} onChange={setExtraRoots} />
          <div className="settings-row">
            <span className="settings-label">Appearance</span>
            <div className="seg">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={theme === t ? 'on' : ''}
                  onClick={() => setTheme(t)}
                >
                  {t === 'dark' ? 'Dark' : 'Light'}
                </button>
              ))}
            </div>
          </div>
          <FeedbackPanel hasScan={!!report} />
        </div>
      )}

      {mode === 'welcome' && !report && <WelcomeHero onScan={handleScan} scanning={scanning} />}

      {showLibrary && (
        <div className="body">
        <AppSidebar
          views={([...TRIAGE_ORDER, 'all'] as TriageFilter[]).map((v) => ({
            id: v,
            label: VIEW_LABEL[v],
            count: counts[v],
            title: TRIAGE_CHIP_TITLE[v],
          }))}
          view={view}
          onView={(v) => {
            setView(v)
            setSelected(null)
          }}
          daws={report.daws}
          helpers={report.helperApps || []}
          scanning={scanning}
          onOpenUrl={openUpdate}
        />
        <div className={`workspace ${selected ? 'with-detail' : ''}`}>
          <div className="workspace-main">
            <div className="view-bar">
              <h1 className="view-title">
                {VIEW_LABEL[view]}
                <span className="count mono">{counts[view]}</span>
              </h1>
              <div className="view-filters">
                <select
                  value={manufacturerFilter}
                  onChange={(e) => setManufacturerFilter(e.target.value)}
                  aria-label="Vendor"
                  className={manufacturerFilter ? 'on' : ''}
                >
                  <option value="">All vendors</option>
                  {manufacturerNames.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(e.target.value as ConfidenceFilter)}
                  aria-label="Confidence"
                  className={confidenceFilter !== 'all' ? 'on' : ''}
                  title="How sure the catalog is about the latest version"
                >
                  <option value="all">Any confidence</option>
                  <option value="high">Verified (85+)</option>
                  <option value="medium">Likely (70–84)</option>
                  <option value="low">Weak (&lt;70)</option>
                </select>
                <select
                  value={identityFilter}
                  onChange={(e) => setIdentityFilter(e.target.value)}
                  aria-label="Kind"
                  className={identityFilter !== 'all' ? 'on' : ''}
                >
                  <option value="all">All kinds</option>
                  {IDENTITY_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {identityLabel(k)}
                    </option>
                  ))}
                </select>
                {filtersActive && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setQuery('')
                      setManufacturerFilter('')
                      setConfidenceFilter('all')
                      setIdentityFilter('all')
                    }}
                  >
                    Clear
                  </button>
                )}
                <label className="group-toggle" title="Group rows under vendor headers">
                  <input type="checkbox" checked={grouped} onChange={(e) => setGrouped(e.target.checked)} />
                  Group by vendor
                </label>
              </div>
            </div>

            <LibraryTable
              groups={groups}
              grouped={grouped}
              sort={sort}
              onSort={setSort}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              onOpenUrl={openUpdate}
              emptyHint={
                scanning
                  ? 'Matching your library to the catalog…'
                  : filtersActive
                    ? 'Nothing matches these filters.'
                    : VIEW_EMPTY[view]
              }
            />

            <footer className="status-bar mono">
              <span>
                {visibleRows.length === (report.rows.length || 0)
                  ? `${visibleRows.length} plugins`
                  : `${visibleRows.length} of ${report.rows.length} plugins`}
                {grouped && groups.length > 0 && ` · ${groups.length} vendors`}
              </span>
              <span className="grow" />
              {scannedAt && (
                <span title={fromSnapshot ? 'Showing the last saved scan. Rescan to refresh.' : undefined}>
                  {fromSnapshot ? 'Last scan' : 'Scanned'} {scannedAt}
                </span>
              )}
              {catalogDate && (
                <span title="When the version catalog was published">Catalog {catalogDate}</span>
              )}
              <span className="kbd-hints">↑↓ select · / search · esc close</span>
            </footer>
          </div>

          {selected && (
            <DetailPanel row={selected} onClose={() => setSelected(null)} onOpenUrl={openUpdate} />
          )}
        </div>
        </div>
      )}
    </div>
  )
}
