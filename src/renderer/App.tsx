import { useEffect, useMemo, useState } from 'react'
import type {
  ManufacturerReportGroup,
  PluginReportRow,
  ScanProgress,
  ScanReport,
} from '../shared/types'
import { WelcomeHero } from './components/WelcomeHero'
import { FilterBar, type ConfidenceFilter, type IdentityFilter } from './components/FilterBar'
import { PluginList } from './components/PluginList'
import { DetailPanel } from './components/DetailPanel'
import { DawStrip } from './components/DawStrip'
import { type TriageFilter, TRIAGE_CHIP_TITLE, partitionByTriage } from './lib/triage'
import { scrubVisibleText } from './lib/labels'

type Mode = 'welcome' | 'library'
type Theme = 'dark' | 'light'

const THEME_KEY = 'daw-pm-theme'

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

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
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())
  const [report, setReport] = useState<ScanReport | null>(null)
  const [scanning, setScanning] = useState(false)
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
  const [fromSnapshot, setFromSnapshot] = useState(false)
  const [refreshingCatalog, setRefreshingCatalog] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    const api = window.dawPluginManager
    if (!api) return
    const unsub = api.onScanProgress((p) => {
      setProgress(p)
      const partial = p.partial
      if (partial?.daws) {
        const daws = partial.daws
        setReport((prev) => {
          if (!prev) {
            return {
              system: {
                platform: 'darwin',
                osVersion: null,
                arch: 'arm64',
                homedir: '',
                scannedAt: new Date().toISOString(),
              },
              daws,
              plugins: [],
              rows: [],
              manufacturers: partial.manufacturers || [],
              catalog: {
                updatedAt: new Date(0).toISOString(),
                source: 'scanning',
                pluginCount: 0,
                manufacturerCount: 0,
              },
              summary: {
                dawCount: daws.length,
                pluginBundleCount: 0,
                pluginCount: 0,
                manufacturerCount: partial.manufacturers?.length || 0,
                current: 0,
                outdated: 0,
                unknown: 0,
                bundled: 0,
                legacy: 0,
                compatWarnings: 0,
              },
            }
          }
          return {
            ...prev,
            daws: daws,
            manufacturers: partial.manufacturers || prev.manufacturers,
            summary: {
              ...prev.summary,
              dawCount: daws.length,
              manufacturerCount:
                partial.manufacturers?.length ?? prev.summary.manufacturerCount,
            },
          }
        })
        setMode('library')
        setFromSnapshot(false)
      }
    })
    return unsub
  }, [])

  // Instant reopen from persisted library snapshot
  useEffect(() => {
    const api = window.dawPluginManager
    if (!api?.loadLastLibrary) return
    let cancelled = false
    ;(async () => {
      try {
        const last = await api.loadLastLibrary()
        if (cancelled || !last) return
        setReport(last)
        setMode('library')
        setFromSnapshot(true)
      } catch {
        /* first launch */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const manufacturerNames = useMemo(() => {
    if (!report?.manufacturers) return [] as string[]
    return [...new Set(report.manufacturers.map((g) => g.manufacturer))].sort((a, b) =>
      a.localeCompare(b)
    )
  }, [report])

  const groups = useMemo(() => {
    if (!report?.manufacturers) return [] as ManufacturerReportGroup[]
    return filterGroups(report.manufacturers, {
      query,
      confidence: confidenceFilter,
      identity: identityFilter,
      manufacturer: manufacturerFilter,
    })
  }, [report, query, confidenceFilter, identityFilter, manufacturerFilter])

  const triageCounts = useMemo(() => {
    const p = partitionByTriage(groups)
    return {
      needs_update: p.needs_update.reduce((n, g) => n + g.productCount, 0),
      use_hub: p.use_hub.reduce((n, g) => n + g.productCount, 0),
      paid: p.paid.reduce((n, g) => n + g.productCount, 0),
      uncertain: p.uncertain.reduce((n, g) => n + g.productCount, 0),
      clear: p.clear.reduce((n, g) => n + g.productCount, 0),
    }
  }, [groups])

  const visibleCount = groups.reduce((n, g) => n + g.products.length, 0)
  const totalCount = report?.rows.length || 0

  async function handleRefreshCatalog() {
    const api = window.dawPluginManager
    if (!api?.refreshCatalog) return
    setRefreshingCatalog(true)
    setError(null)
    try {
      const meta = await api.refreshCatalog()
      setReport((prev) => {
        if (!prev) {
          return {
            system: {
              platform: 'darwin',
              osVersion: null,
              arch: 'arm64',
              homedir: '',
              scannedAt: new Date().toISOString(),
            },
            daws: [],
            plugins: [],
            rows: [],
            manufacturers: [],
            catalog: {
              updatedAt: meta.updatedAt,
              source: meta.source,
              pluginCount: meta.pluginCount,
              manufacturerCount: meta.manufacturerCount,
            },
            summary: {
              dawCount: 0,
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
        return {
          ...prev,
          catalog: {
            ...prev.catalog,
            updatedAt: meta.updatedAt,
            source: meta.source,
            pluginCount: meta.pluginCount,
            manufacturerCount: meta.manufacturerCount,
          },
        }
      })
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
      setQuery('')
      setTriageFilter('all')
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

  const catalogMeta = report?.catalog
  const showLibrary = mode === 'library' && report

  return (
    <div className={`app shell mode-${mode}`}>
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => {
            setMode(report ? 'library' : 'welcome')
            setSelected(null)
          }}
        >
          <span className="brand-mark">DAW Plugin Manager</span>
        </button>

        <div className="topbar-actions">
          {catalogMeta &&
            catalogMeta.source !== 'scanning' &&
            catalogMeta.source !== 'pending' &&
            catalogMeta.updatedAt &&
            Number.isFinite(Date.parse(catalogMeta.updatedAt)) && (
              <span
                className="catalog-meta mono"
                title={
                  catalogMeta.source === 'online'
                    ? 'When the version catalog you fetched was last published. Online = pulled fresh for this session.'
                    : catalogMeta.source === 'shipped'
                      ? 'When the version catalog bundled with this app was last published. Use Refresh catalog to pull newer.'
                      : 'When the version catalog was last published.'
                }
              >
                Catalog as of{' '}
                {new Date(catalogMeta.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {catalogMeta.source === 'online'
                  ? ' · Online'
                  : catalogMeta.source === 'shipped'
                    ? ' · Shipped'
                    : ''}
              </span>
            )}
          {fromSnapshot && !scanning && (
            <span
              className="snapshot-pill"
              title="Showing the last library scan saved on this Mac. Rescan to refresh installs."
            >
              Last scan
            </span>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title={
              theme === 'dark'
                ? 'Switch to light appearance'
                : 'Switch to dark appearance (default)'
            }
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleRefreshCatalog}
            disabled={refreshingCatalog || scanning}
            title="Download the newest published version catalog. Does not rescan plugins on disk."
          >
            {refreshingCatalog ? 'Refreshing…' : 'Refresh catalog'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setShowSettings((s) => !s)}
            aria-expanded={showSettings}
            title="Add extra folders to scan beyond the usual AU / VST3 / VST locations."
          >
            Paths
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleScan}
            disabled={scanning}
            title={
              report
                ? 'Walk plugin folders again and rematch to the catalog.'
                : 'Scan AU / VST3 / VST folders and match them to the version catalog.'
            }
          >
            {scanning ? `${progress?.percent ?? 0}%` : report ? 'Rescan' : 'Scan'}
          </button>
        </div>
      </header>

      {scanning && (
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${progress?.percent ?? 10}%` }} />
          <span>{progress?.message || 'Scanning…'}</span>
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
        </div>
      )}

      {/* DAWs always at top when we know them */}
      {(report?.daws?.length || scanning) && (
        <DawStrip daws={report?.daws || []} rows={report?.rows || []} />
      )}

      {mode === 'welcome' && !report && (
        <WelcomeHero onScan={handleScan} scanning={scanning} />
      )}

      {showLibrary && (
        <div className={`workspace ${selected ? 'with-detail' : ''}`}>
          <div className="workspace-main">
            <div className="triage-bar" role="toolbar" aria-label="Triage filters">
              <button
                type="button"
                className={`triage-chip ${triageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTriageFilter('all')}
                title={TRIAGE_CHIP_TITLE.all}
              >
                All
              </button>
              <button
                type="button"
                className={`triage-chip tone-bad ${triageFilter === 'needs_update' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'needs_update'))}
                title={TRIAGE_CHIP_TITLE.needs_update}
              >
                <b>{triageCounts.needs_update}</b> need update
              </button>
              <button
                type="button"
                className={`triage-chip tone-hub ${triageFilter === 'use_hub' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'use_hub'))}
                title={TRIAGE_CHIP_TITLE.use_hub}
              >
                <b>{triageCounts.use_hub}</b> hub
              </button>
              <button
                type="button"
                className={`triage-chip tone-paid ${triageFilter === 'paid' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'paid'))}
                title={TRIAGE_CHIP_TITLE.paid}
              >
                <b>{triageCounts.paid}</b> paid
              </button>
              <button
                type="button"
                className={`triage-chip tone-uncertain ${triageFilter === 'uncertain' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'uncertain'))}
                title={TRIAGE_CHIP_TITLE.uncertain}
              >
                <b>{triageCounts.uncertain}</b> unknown
              </button>
              <button
                type="button"
                className={`triage-chip tone-ok ${triageFilter === 'clear' ? 'active' : ''}`}
                onClick={() => setTriageFilter((t) => toggleTriage(t, 'clear'))}
                title={TRIAGE_CHIP_TITLE.clear}
              >
                <b>{triageCounts.clear}</b> clear
              </button>
              <span className="grow" />
              <span className="triage-bar-meta mono">
                {report.summary.pluginCount
                  ? `${report.summary.pluginCount} plugins`
                  : scanning
                    ? 'Organizing…'
                    : 'Scan to match plugins'}
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
                scanning
                  ? 'Matching your library to the catalog…'
                  : 'Nothing matches. Clear triage chips or search, then Rescan if needed.'
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
