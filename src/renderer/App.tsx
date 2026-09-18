import { useEffect, useMemo, useState } from 'react'
import type {
  CatalogBrowseReport,
  ManufacturerReportGroup,
  PluginReportRow,
  ScanProgress,
  ScanReport,
} from '../shared/types'
import { WelcomeHero } from './components/WelcomeHero'
import { FilterBar, type ConfidenceFilter, type IdentityFilter, type StatusFilter } from './components/FilterBar'
import { PluginList } from './components/PluginList'
import { DetailPanel } from './components/DetailPanel'

type Mode = 'welcome' | 'library' | 'catalog'

function filterGroups(
  groups: ManufacturerReportGroup[],
  opts: {
    query: string
    status: StatusFilter
    confidence: ConfidenceFilter
    identity: IdentityFilter
    manufacturer: string
  }
): ManufacturerReportGroup[] {
  const q = opts.query.trim().toLowerCase()
  return groups
    .map((g) => {
      if (opts.manufacturer && g.manufacturer !== opts.manufacturer) return null
      const products = g.products.filter((row) => {
        if (opts.status !== 'all' && row.status !== opts.status) return false
        if (opts.confidence !== 'all' && row.confidenceBand !== opts.confidence) return false
        if (opts.identity !== 'all' && row.identityKind !== opts.identity) return false
        if (!q) return true
        return (
          row.name.toLowerCase().includes(q) ||
          row.manufacturer.toLowerCase().includes(q) ||
          row.productLine.toLowerCase().includes(q) ||
          (row.installedVersion || '').toLowerCase().includes(q) ||
          (row.latestVersion || '').toLowerCase().includes(q) ||
          (row.portalApp || '').toLowerCase().includes(q) ||
          row.formats.join(' ').toLowerCase().includes(q)
        )
      })
      if (!products.length) return null
      return { ...g, products, productCount: products.length }
    })
    .filter(Boolean) as ManufacturerReportGroup[]
}

export default function App() {
  const [mode, setMode] = useState<Mode>('welcome')
  const [report, setReport] = useState<ScanReport | null>(null)
  const [catalogReport, setCatalogReport] = useState<CatalogBrowseReport | null>(null)
  const [scanning, setScanning] = useState(false)
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all')
  const [identityFilter, setIdentityFilter] = useState<IdentityFilter>('all')
  const [manufacturerFilter, setManufacturerFilter] = useState('')
  const [selected, setSelected] = useState<PluginReportRow | null>(null)
  const [extraRoots, setExtraRoots] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const api = window.dawPluginManager
    if (!api) return
    return api.onScanProgress(setProgress)
  }, [])

  const activeGroups = mode === 'library' ? report?.manufacturers : catalogReport?.manufacturers
  const manufacturerNames = useMemo(() => {
    if (!activeGroups) return [] as string[]
    return [...new Set(activeGroups.map((g) => g.manufacturer))].sort((a, b) =>
      a.localeCompare(b)
    )
  }, [activeGroups])

  const groups = useMemo(() => {
    if (!activeGroups) return [] as ManufacturerReportGroup[]
    return filterGroups(activeGroups, {
      query,
      status: statusFilter,
      confidence: confidenceFilter,
      identity: identityFilter,
      manufacturer: manufacturerFilter,
    })
  }, [
    activeGroups,
    query,
    statusFilter,
    confidenceFilter,
    identityFilter,
    manufacturerFilter,
  ])

  const visibleCount = groups.reduce((n, g) => n + g.products.length, 0)
  const totalCount =
    mode === 'library' ? report?.rows.length || 0 : catalogReport?.rows.length || 0

  async function handleScan() {
    const api = window.dawPluginManager
    if (!api) {
      setError('Electron bridge not available. Run with npm run dev.')
      return
    }
    setScanning(true)
    setError(null)
    setProgress({ phase: 'daws', message: 'Starting scan…', percent: 0 })
    try {
      const roots = extraRoots.split('\n').map((s) => s.trim()).filter(Boolean)
      const result = await api.runScan({ extraPluginRoots: roots })
      setReport(result)
      setMode('library')
      setSelected(null)
      setQuery('')
      setStatusFilter('all')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setScanning(false)
    }
  }

  async function handleBrowse() {
    const api = window.dawPluginManager
    if (!api) {
      setError('Electron bridge not available. Run with npm run dev.')
      return
    }
    setLoadingCatalog(true)
    setError(null)
    try {
      const result = await api.browseCatalog()
      setCatalogReport(result)
      setMode('catalog')
      setSelected(null)
      setQuery('')
      setStatusFilter('all')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingCatalog(false)
    }
  }

  async function openUpdate(url: string | null) {
    if (!url || !window.dawPluginManager) return
    await window.dawPluginManager.openExternal(url)
  }

  const catalogMeta =
    mode === 'library'
      ? report?.catalog
      : mode === 'catalog'
        ? catalogReport?.catalog
        : null

  return (
    <div className={`app shell mode-${mode}`}>
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => {
            setMode('welcome')
            setSelected(null)
          }}
        >
          <span className="brand-mark">DAW Plugin Manager</span>
        </button>

        <nav className="mode-nav" aria-label="Mode">
          <button
            type="button"
            className={mode === 'library' ? 'active' : ''}
            onClick={() => report && setMode('library')}
            disabled={!report}
          >
            Library
          </button>
          <button
            type="button"
            className={mode === 'catalog' ? 'active' : ''}
            onClick={() => (catalogReport ? setMode('catalog') : handleBrowse())}
            disabled={loadingCatalog}
          >
            Catalog
          </button>
        </nav>

        <div className="topbar-actions">
          {catalogMeta && (
            <span className="catalog-meta mono" title={catalogMeta.source}>
              Catalog {new Date(catalogMeta.updatedAt).toLocaleDateString()} ·{' '}
              {catalogMeta.pluginCount.toLocaleString()} plugins
            </span>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setShowSettings((s) => !s)}
            aria-expanded={showSettings}
          >
            Paths
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? `${progress?.percent ?? 0}%` : report ? 'Rescan' : 'Scan'}
          </button>
        </div>
      </header>

      {(scanning || loadingCatalog) && (
        <div className="progress-line">
          <div
            className="progress-fill"
            style={{ width: `${scanning ? progress?.percent ?? 10 : 60}%` }}
          />
          <span>{scanning ? progress?.message : 'Loading catalog…'}</span>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {showSettings && (
        <div className="settings-strip">
          <label>
            Extra plugin folders (one per line)
            <textarea
              value={extraRoots}
              onChange={(e) => setExtraRoots(e.target.value)}
              rows={2}
              placeholder="/custom/plugin/path"
            />
          </label>
          {report && (
            <div className="daw-strip">
              <strong>DAWs found:</strong>{' '}
              {report.daws.length
                ? report.daws.map((d) => `${d.name}${d.version ? ` ${d.version}` : ''}`).join(' · ')
                : 'None detected'}
            </div>
          )}
        </div>
      )}

      {mode === 'welcome' && (
        <WelcomeHero onScan={handleScan} onBrowse={handleBrowse} scanning={scanning || loadingCatalog} />
      )}

      {(mode === 'library' || mode === 'catalog') && (
        <div className={`workspace ${selected ? 'with-detail' : ''}`}>
          <div className="workspace-main">
            {mode === 'library' && report && (
              <div className="summary-strip">
                <span>
                  <b className="ok">{report.summary.current}</b> OK
                </span>
                <span>
                  <b className="bad">{report.summary.updateAvailable ?? 0}</b> upd
                </span>
                <span>
                  <b className="warn">{report.summary.unknown}</b> unk
                </span>
                <span>
                  <b>{report.summary.useVendorHub ?? 0}</b> hub
                </span>
                <span>
                  <b>{report.summary.paidUpgrade ?? 0}</b> paid
                </span>
                <span className="grow" />
                <span className="mono faint">
                  {report.summary.pluginCount} · {report.summary.dawCount} DAWs
                </span>
              </div>
            )}
            {mode === 'catalog' && catalogReport && (
              <div className="summary-strip">
                <span>
                  <b className="ok">{catalogReport.summary.green}</b> ≥85
                </span>
                <span>
                  <b className="warn">{catalogReport.summary.amber}</b> 70–84
                </span>
                <span>
                  <b className="yellow">{catalogReport.summary.yellow}</b> &lt;70
                </span>
                <span>
                  <b>{catalogReport.summary.unknownVersion}</b> unk
                </span>
                <span>
                  <b>{catalogReport.summary.content}</b> content
                </span>
                <span className="grow" />
                <span className="teach-chip" title="Yellow is not an update signal">
                  Yellow ≠ update
                </span>
              </div>
            )}

            <FilterBar
              query={query}
              onQuery={setQuery}
              status={statusFilter}
              onStatus={setStatusFilter}
              confidence={confidenceFilter}
              onConfidence={setConfidenceFilter}
              identity={identityFilter}
              onIdentity={setIdentityFilter}
              manufacturer={manufacturerFilter}
              onManufacturer={setManufacturerFilter}
              manufacturers={manufacturerNames}
              visibleCount={visibleCount}
              totalCount={totalCount}
            />

            <PluginList
              groups={groups}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              onOpenUrl={openUpdate}
              emptyHint={
                mode === 'catalog'
                  ? 'No catalog rows match these filters. Try clearing confidence or identity.'
                  : 'No installed plugins match. Try Browse catalog, or clear filters.'
              }
            />
          </div>

          {selected && (
            <DetailPanel
              row={selected}
              onClose={() => setSelected(null)}
              onOpenUrl={openUpdate}
            />
          )}
        </div>
      )}
    </div>
  )
}
