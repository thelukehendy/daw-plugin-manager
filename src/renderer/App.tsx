import { useEffect, useMemo, useState } from 'react'
import type {
  CatalogBrowseReport,
  ManufacturerReportGroup,
  PluginReportRow,
  ScanProgress,
  ScanReport,
} from '../shared/types'
import { WelcomeHero } from './components/WelcomeHero'
import { FilterBar, type ConfidenceFilter, type IdentityFilter } from './components/FilterBar'
import { PluginList } from './components/PluginList'
import { DetailPanel } from './components/DetailPanel'
import { type TriageFilter, partitionByTriage } from './lib/triage'

type Mode = 'welcome' | 'library' | 'catalog'

function filterGroups(
  groups: ManufacturerReportGroup[],
  opts: {
    query: string
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

function toggleTriage(current: TriageFilter, next: TriageFilter): TriageFilter {
  return current === next ? 'all' : next
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
  const [triageFilter, setTriageFilter] = useState<TriageFilter>('all')
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
      confidence: confidenceFilter,
      identity: identityFilter,
      manufacturer: manufacturerFilter,
    })
  }, [activeGroups, query, confidenceFilter, identityFilter, manufacturerFilter])

  const triageCounts = useMemo(() => {
    const p = partitionByTriage(groups)
    return {
      needs_update: p.needs_update.reduce((n, g) => n + g.productCount, 0),
      use_hub: p.use_hub.reduce((n, g) => n + g.productCount, 0),
      paid: p.paid.reduce((n, g) => n + g.productCount, 0),
      uncertain: p.uncertain.reduce((n, g) => n + g.productCount, 0),
      clear: p.clear.reduce((n, g) => n + g.productCount, 0),
      vendorsNeedingUpdate: p.needs_update.length,
      vendorsHub: p.use_hub.length,
    }
  }, [groups])

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
      setTriageFilter('all')
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
      setTriageFilter('all')
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
            <div className="triage-bar" role="toolbar" aria-label="Triage filters">
              <button
                type="button"
                className={`triage-chip ${triageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTriageFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`triage-chip tone-bad ${triageFilter === 'needs_update' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'needs_update'))}
              >
                <b>{triageCounts.needs_update}</b> need update
              </button>
              <button
                type="button"
                className={`triage-chip tone-hub ${triageFilter === 'use_hub' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'use_hub'))}
              >
                <b>{triageCounts.use_hub}</b> hub
              </button>
              <button
                type="button"
                className={`triage-chip tone-paid ${triageFilter === 'paid' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'paid'))}
              >
                <b>{triageCounts.paid}</b> paid
              </button>
              <button
                type="button"
                className={`triage-chip tone-uncertain ${triageFilter === 'uncertain' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'uncertain'))}
              >
                <b>{triageCounts.uncertain}</b> unknown
              </button>
              <button
                type="button"
                className={`triage-chip tone-ok ${triageFilter === 'clear' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'clear'))}
              >
                <b>{triageCounts.clear}</b> clear
              </button>
              <span className="grow" />
              <span className="triage-bar-meta mono">
                {mode === 'library' && report
                  ? `${report.summary.pluginCount} plugins · ${report.summary.dawCount} DAWs`
                  : `${totalCount.toLocaleString()} catalog rows`}
              </span>
            </div>

            <FilterBar
              query={query}
              onQuery={setQuery}
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
              triageFilter={triageFilter}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
              onOpenUrl={openUpdate}
              emptyHint={
                mode === 'catalog'
                  ? 'Nothing matches. Clear triage or search.'
                  : 'Nothing matches. Clear triage chips or search, or Browse catalog.'
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
