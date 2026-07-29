import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type {
  CompatibilityFlag,
  ManufacturerReportGroup,
  PluginReportRow,
  ScanProgress,
  ScanReport,
  UpdateStatus,
} from '../shared/types'

type StatusFilter = 'all' | UpdateStatus

const STATUS_LABEL: Record<UpdateStatus, string> = {
  current: 'Current',
  outdated: 'Outdated',
  unknown: 'Unknown',
  bundled: 'Bundled',
  legacy: 'Legacy',
}

function StatusBadge({
  status,
  confidence,
  confidenceBand,
  confidenceReason,
  label,
}: {
  status: UpdateStatus
  confidence: number
  confidenceBand: 'high' | 'medium' | 'low'
  confidenceReason: string
  label?: string
}) {
  const text = label || STATUS_LABEL[status]
  // Outdated is always red. OK/current/bundled: green when high confidence, yellow otherwise.
  const tone =
    status === 'outdated'
      ? 'outdated'
      : status === 'unknown'
        ? 'unknown'
        : confidenceBand === 'high'
          ? 'current'
          : 'conf-mid'

  return (
    <span
      className={`badge status-conf ${tone}`}
      title={`${confidence}% confidence — ${confidenceReason}`}
    >
      <span className="status-label">{text}</span>
      <span className="conf-pct">
        {confidence}% confidence
      </span>
    </span>
  )
}

function formatCompatNote(flag: CompatibilityFlag): { title: string; body: string } {
  const daw = [flag.dawName, flag.dawVersion].filter(Boolean).join(' ')
  if (flag.severity === 'block') {
    return {
      title: `May not work with ${daw}`,
      body: flag.note,
    }
  }
  if (flag.severity === 'warn') {
    return {
      title: `Check before using with ${daw}`,
      body: flag.note,
    }
  }
  return {
    title: `Note for ${daw}`,
    body: flag.note,
  }
}

export default function App() {
  const [report, setReport] = useState<ScanReport | null>(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [showDaws, setShowDaws] = useState(false)
  const [extraRoots, setExtraRoots] = useState('')
  const [selectedDawId, setSelectedDawId] = useState<string | null>(null)
  /** Manufacturer IDs expanded to show products */
  const [openMfgs, setOpenMfgs] = useState<Record<string, boolean>>({})
  /** Product IDs expanded to show bundles */
  const [openProducts, setOpenProducts] = useState<Record<string, boolean>>({})
  const pluginListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const api = window.dawPluginManager
    if (!api) return
    return api.onScanProgress(setProgress)
  }, [])

  const groups = useMemo(() => {
    if (!report) return [] as ManufacturerReportGroup[]
    const q = query.trim().toLowerCase()
    const selectedDaw = selectedDawId
      ? report.daws.find((d) => d.id === selectedDawId) || null
      : null

    return report.manufacturers
      .map((g) => {
        const products = g.products.filter((row) => {
          if (statusFilter !== 'all' && row.status !== statusFilter) return false
          if (selectedDaw) {
            const hit = row.compatibilityFlags.some(
              (f) =>
                f.dawName === selectedDaw.name ||
                selectedDaw.name.toLowerCase().includes(f.dawName.toLowerCase()) ||
                f.dawName.toLowerCase().includes(selectedDaw.name.split(' ')[0].toLowerCase())
            )
            if (!hit) return false
          }
          if (!q) return true
          return (
            row.name.toLowerCase().includes(q) ||
            row.manufacturer.toLowerCase().includes(q) ||
            row.productLine.toLowerCase().includes(q) ||
            (row.installedVersion || '').toLowerCase().includes(q) ||
            row.installedVersions.some((v) => v.toLowerCase().includes(q)) ||
            (row.latestVersion || '').toLowerCase().includes(q) ||
            row.formats.join(' ').toLowerCase().includes(q)
          )
        })
        if (!products.length) return null
        return { ...g, products }
      })
      .filter(Boolean) as ManufacturerReportGroup[]
  }, [report, query, statusFilter, selectedDawId])

  const visibleProductCount = groups.reduce((n, g) => n + g.products.length, 0)

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
      setOpenMfgs({})
      setOpenProducts({})
      setSelectedDawId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setScanning(false)
    }
  }

  async function openUpdate(url: string | null) {
    if (!url || !window.dawPluginManager) return
    await window.dawPluginManager.openExternal(url)
  }

  function toggleMfg(id: string) {
    setOpenMfgs((s) => ({ ...s, [id]: !s[id] }))
  }

  function toggleProduct(id: string) {
    setOpenProducts((s) => ({ ...s, [id]: !s[id] }))
  }

  function expandOutdated() {
    if (!report) return
    const nextMfgs: Record<string, boolean> = {}
    const nextProducts: Record<string, boolean> = {}
    for (const g of report.manufacturers) {
      if (g.outdatedCount > 0 || g.hasCompatWarning) {
        nextMfgs[g.id] = true
        for (const p of g.products) {
          if (p.status === 'outdated' || p.compatibilityFlags.some((f) => f.severity !== 'info')) {
            nextProducts[p.id] = true
          }
        }
      }
    }
    setOpenMfgs(nextMfgs)
    setOpenProducts(nextProducts)
  }

  function collapseAll() {
    setOpenMfgs({})
    setOpenProducts({})
  }

  function toggleDawDetails() {
    setShowDaws((open) => {
      if (open) {
        // Closing: clear DAW filter and return focus to the plugin list
        setSelectedDawId(null)
        requestAnimationFrame(() => {
          pluginListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
        return false
      }
      return true
    })
  }

  return (
    <div className="app sheet">
      <header className="bar">
        <div className="bar-left">
          <span className="logo">DAW Plugin Manager</span>
          <span className="tag">discovery only</span>
          {report && (
            <span className="meta-inline">
              {report.summary.manufacturerCount} companies · {report.summary.pluginCount} products ·{' '}
              {report.summary.pluginBundleCount} bundles
            </span>
          )}
        </div>
        <div className="bar-right">
          <button
            className={`btn ${showDaws ? 'btn-active' : ''}`}
            type="button"
            onClick={toggleDawDetails}
            disabled={!report}
          >
            {showDaws ? 'Hide DAW details' : 'Installed DAW Details'}
          </button>
          <button className="btn btn-primary" type="button" onClick={handleScan} disabled={scanning}>
            {scanning ? `${progress?.percent ?? 0}%` : report ? 'Rescan' : 'Scan'}
          </button>
        </div>
      </header>

      {scanning && progress && (
        <div className="scan-line">
          <div className="scan-fill" style={{ width: `${progress.percent}%` }} />
          <span>{progress.message}</span>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {showDaws && report && (
        <div className="meta-panel daw-panel">
          <div className="daw-panel-head">
            <strong>Installed DAWs</strong>
            <span className="mfg-meta">
              Click a DAW to highlight plugins with compatibility notes for it
              {selectedDawId ? ' · ' : ''}
              {selectedDawId && (
                <button type="button" className="link-btn" onClick={() => setSelectedDawId(null)}>
                  Clear filter
                </button>
              )}
            </span>
            <span className="grow" />
            <button type="button" className="btn" onClick={toggleDawDetails}>
              Back to plugins
            </button>
          </div>
          <div className="daw-grid">
            {report.daws.map((d) => {
              const active = selectedDawId === d.id
              const related = report.rows.filter((row) =>
                row.compatibilityFlags.some(
                  (f) =>
                    f.dawName === d.name ||
                    d.name.toLowerCase().includes(f.dawName.toLowerCase()) ||
                    f.dawName.toLowerCase().includes(d.name.split(' ')[0].toLowerCase())
                )
              ).length
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`daw-chip ${active ? 'active' : ''}`}
                  onClick={() => setSelectedDawId(active ? null : d.id)}
                >
                  <span className="daw-chip-name">{d.name}</span>
                  <span className="mono daw-chip-ver">{d.version || '—'}</span>
                  {related > 0 && <span className="daw-chip-flags">{related} notes</span>}
                </button>
              )
            })}
          </div>
          <div className="mfg-meta" style={{ marginTop: 8 }}>
            Catalog {report.catalog.source} · updated {report.catalog.updatedAt}
          </div>
          <label className="extra-label">
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

      {report && (
        <>
          <div className="stats-row" ref={pluginListRef}>
            <span>
              Current <b className="ok">{report.summary.current}</b>
            </span>
            <span>
              Outdated <b className="bad">{report.summary.outdated}</b>
            </span>
            <span>
              Unknown <b className="warn">{report.summary.unknown}</b>
            </span>
            <span>
              Compat <b className={report.summary.compatWarnings ? 'warn' : ''}>{report.summary.compatWarnings}</b>
            </span>
            <span className="grow" />
            <button className="btn" type="button" onClick={expandOutdated}>
              Expand outdated
            </button>
            <button className="btn" type="button" onClick={collapseAll}>
              Collapse all
            </button>
            <input
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="outdated">Outdated</option>
              <option value="current">Current</option>
              <option value="unknown">Unknown</option>
              <option value="bundled">Bundled</option>
            </select>
            <span className="count">
              {visibleProductCount}/{report.rows.length}
            </span>
          </div>

          <div className="grid-wrap">
            <table className="grid tree">
              <thead>
                <tr>
                  <th className="col-exp" />
                  <th className="col-name">Manufacturer / Plugin</th>
                  <th className="col-count">#</th>
                  <th className="col-ver" title="Version found on this Mac">
                    Currently
                    <br />
                    Installed
                  </th>
                  <th className="col-ver" title="Latest public version from the manufacturer catalog">
                    Latest
                    <br />
                    Available
                  </th>
                  <th className="col-status">Status</th>
                  <th className="col-fmt">Fmt</th>
                  <th className="col-compat">Compat</th>
                  <th className="col-update">Update</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => {
                  const mfgOpen = !!openMfgs[g.id]
                  return (
                    <Fragment key={g.id}>
                      <tr
                        className={`mfg-row ${g.outdatedCount ? 'row-outdated' : ''}`}
                        onClick={() => toggleMfg(g.id)}
                      >
                        <td className="col-exp">
                          <button type="button" className="exp">
                            {mfgOpen ? '▾' : '▸'}
                          </button>
                        </td>
                        <td className="cell-mfg-head">
                          <strong>{g.manufacturer}</strong>
                          <span className="mfg-meta">
                            {g.productCount} products · {g.bundleCount} bundles
                            {g.outdatedCount ? ` · ${g.outdatedCount} outdated` : ''}
                            {g.unknownCount ? ` · ${g.unknownCount} unknown` : ''}
                          </span>
                        </td>
                        <td className="mono center col-count">{g.bundleCount}</td>
                        <td className="mono col-ver">—</td>
                        <td className="mono col-ver">—</td>
                        <td className="col-status">
                          {g.outdatedCount ? (
                            <StatusBadge
                              status="outdated"
                              confidence={g.confidence}
                              confidenceBand={g.confidenceBand}
                              confidenceReason={`Weakest confidence in group · ${g.outdatedCount} outdated`}
                              label={`${g.outdatedCount} outdated`}
                            />
                          ) : (
                            <StatusBadge
                              status="current"
                              confidence={g.confidence}
                              confidenceBand={g.confidenceBand}
                              confidenceReason="Weakest product confidence in this manufacturer group"
                              label="OK"
                            />
                          )}
                        </td>
                        <td />
                        <td>
                          {g.hasCompatWarning ? <span className="badge unknown">flag</span> : '—'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="link-btn"
                            disabled={!g.updateUrl}
                            onClick={(e) => {
                              e.stopPropagation()
                              openUpdate(g.updateUrl)
                            }}
                          >
                            {g.updateUrl ? 'Portal' : '—'}
                          </button>
                        </td>
                      </tr>

                      {mfgOpen &&
                        g.products.map((row) => (
                          <ProductRows
                            key={row.id}
                            row={row}
                            open={!!openProducts[row.id]}
                            onToggle={() => toggleProduct(row.id)}
                            onOpenUpdate={openUpdate}
                            highlightCompat={!!selectedDawId}
                          />
                        ))}
                    </Fragment>
                  )
                })}
                {groups.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty">
                      No rows match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!report && !scanning && (
        <div className="empty-state">
          Click <strong>Scan</strong> to inventory DAWs and plugins. Results open collapsed by
          manufacturer.
        </div>
      )}
    </div>
  )
}

function ProductRows({
  row,
  open,
  onToggle,
  onOpenUpdate,
  highlightCompat,
}: {
  row: PluginReportRow
  open: boolean
  onToggle: () => void
  onOpenUpdate: (url: string | null) => void
  highlightCompat?: boolean
}) {
  const legacyCount = row.versionDetails.filter((v) => v.legacy).length
  const compat = row.compatibilityFlags.filter((f) => f.severity !== 'info')
  const infoCompat = row.compatibilityFlags.filter((f) => f.severity === 'info')

  return (
    <Fragment>
      <tr
        className={`product-row ${row.status === 'outdated' ? 'row-outdated' : ''} ${
          highlightCompat ? 'row-compat-hit' : ''
        }`}
        onDoubleClick={onToggle}
      >
        <td className="col-exp">
          <button type="button" className="exp" onClick={onToggle} title="Show installed bundles">
            {open ? '▾' : '▸'}
          </button>
        </td>
        <td className="cell-product" title={row.dawCompatibility || undefined}>
          <span className="indent">{row.name}</span>
          {legacyCount > 0 && (
            <span className="legacy-tag" title="Older major versions still installed">
              +{legacyCount} legacy
            </span>
          )}
        </td>
        <td className="mono center col-count">{row.installCount}</td>
        <td className="mono col-ver">{row.installedVersion || '—'}</td>
        <td className="mono col-ver">{row.latestVersion || '—'}</td>
        <td className="col-status">
          <StatusBadge
            status={row.status}
            confidence={row.confidence}
            confidenceBand={row.confidenceBand}
            confidenceReason={row.confidenceReason}
          />
        </td>
        <td className="mono formats col-fmt">{row.formats.join(' ')}</td>
        <td className="col-compat">
          {compat.length ? (
            <span className="badge unknown" title={compat.map((c) => c.note).join('\n')}>
              {compat.length} warn
            </span>
          ) : infoCompat.length ? (
            <span className="badge bundled" title={infoCompat.map((c) => c.note).join('\n')}>
              note
            </span>
          ) : (
            '—'
          )}
        </td>
        <td>
          <button
            type="button"
            className="link-btn"
            disabled={!row.updateUrl}
            onClick={() => onOpenUpdate(row.updateUrl)}
          >
            {row.updateUrl ? 'Portal' : '—'}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="detail-row">
          <td />
          <td colSpan={8}>
            <div className="detail">
              {row.compatibilityFlags.map((f, i) => {
                const msg = formatCompatNote(f)
                return (
                  <div key={`c-${i}`} className={`detail-warn sev-${f.severity}`}>
                    <strong>{msg.title}</strong>
                    <span>{msg.body}</span>
                  </div>
                )
              })}
              <div className="detail-line conf-detail">
                <span className="mono">{row.confidence}% confidence</span>
                <span>{row.confidenceReason}</span>
              </div>
              {row.versionDetails.map((v, i) => (
                <div key={`${row.id}-${i}`} className={`detail-line ${v.legacy ? 'is-legacy' : ''}`}>
                  <span className="mono">{v.version || 'no-ver'}</span>
                  <span>
                    {v.name}
                    {v.legacy ? ' · older leftover install' : ''}
                  </span>
                  <span className="mono">{v.formats.join(',')}</span>
                  <span className="path">{v.paths.join(' · ')}</span>
                </div>
              ))}
              {row.osCompatible === false && (
                <div className="detail-warn sev-warn">
                  <strong>Needs a newer macOS</strong>
                  <span>This plugin requires macOS {row.minMacOS}+</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
