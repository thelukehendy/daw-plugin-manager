import { Fragment, useState } from 'react'
import type { ManufacturerReportGroup, PluginReportRow } from '../../shared/types'
import { ConfidenceBadge } from './ConfidenceBadge'
import { displayVersion, statusLabel } from '../lib/labels'

function RowActions({
  row,
  onOpenUrl,
  onSelect,
}: {
  row: PluginReportRow
  onOpenUrl: (url: string | null) => void
  onSelect: () => void
}) {
  const primaryHub = row.portalApp && (row.status === 'use_vendor_hub' || row.confidenceBand === 'low')
  return (
    <div className="row-actions">
      <button type="button" className="link-btn" onClick={onSelect}>
        Details
      </button>
      <button
        type="button"
        className="link-btn accent"
        disabled={!row.updateUrl}
        onClick={() => onOpenUrl(row.updateUrl)}
      >
        {primaryHub && row.portalApp ? row.portalApp : row.updateUrl ? 'Portal' : '—'}
      </button>
    </div>
  )
}

function ProductRow({
  row,
  selected,
  onSelect,
  onOpenUrl,
}: {
  row: PluginReportRow
  selected: boolean
  onSelect: () => void
  onOpenUrl: (url: string | null) => void
}) {
  const showConf =
    row.latestVersion != null ||
    ['unknown', 'unverified', 'update_available', 'update_likely', 'current', 'discontinued'].includes(
      row.status
    )

  return (
    <tr
      className={`product-row state-row-${row.status} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <td className="cell-name">
        <span className="product-name">{row.name}</span>
        {row.successorPluginId && (
          <span className="micro-tag paid" title="Paid next generation exists">
            Paid upgrade
          </span>
        )}
        {row.portalApp && row.status === 'use_vendor_hub' && (
          <span className="micro-tag hub">{row.portalApp}</span>
        )}
      </td>
      <td className="mono cell-ver">{displayVersion(row.installedVersion)}</td>
      <td className="mono cell-ver">
        <span>{displayVersion(row.latestVersion)}</span>
        {showConf && (
          <ConfidenceBadge confidence={row.confidence} band={row.confidenceBand} compact />
        )}
      </td>
      <td>
        <span className={`state-pill state-${row.status}`}>
          {statusLabel(row.status, row.catalogOnly)}
        </span>
      </td>
      <td className="mono cell-fmt">{row.formats.slice(0, 4).join(' ')}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <RowActions row={row} onOpenUrl={onOpenUrl} onSelect={onSelect} />
      </td>
    </tr>
  )
}

export function PluginList({
  groups,
  selectedId,
  onSelect,
  onOpenUrl,
  emptyHint,
}: {
  groups: ManufacturerReportGroup[]
  selectedId: string | null
  onSelect: (row: PluginReportRow) => void
  onOpenUrl: (url: string | null) => void
  emptyHint: string
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }))
  }

  if (!groups.length) {
    return <div className="empty-panel">{emptyHint}</div>
  }

  return (
    <div className="grid-wrap">
      <table className="grid">
        <thead>
          <tr>
            <th>Manufacturer / Plugin</th>
            <th>Installed</th>
            <th>Catalog latest</th>
            <th>State</th>
            <th>Fmt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const isOpen = open[g.id] !== false // default open for small sets; toggle stores false
            const expanded = open[g.id] === true || (open[g.id] === undefined && groups.length <= 12)
            const show = open[g.id] === undefined ? expanded : isOpen
            return (
              <Fragment key={g.id}>
                <tr className="mfg-row" onClick={() => toggle(g.id)}>
                  <td colSpan={6}>
                    <div className="mfg-head">
                      <span className="exp" aria-hidden>
                        {show ? '▾' : '▸'}
                      </span>
                      <strong>{g.manufacturer}</strong>
                      <span className="mfg-meta">
                        {g.productCount} ·{' '}
                        {g.outdatedCount
                          ? `${g.outdatedCount} need attention`
                          : `${g.currentCount} clear`}
                        {g.portalApp ? ` · ${g.portalApp}` : ''}
                      </span>
                      <ConfidenceBadge
                        confidence={g.confidence}
                        band={g.confidenceBand}
                        compact
                      />
                    </div>
                  </td>
                </tr>
                {show &&
                  g.products.map((row) => (
                    <ProductRow
                      key={row.id}
                      row={row}
                      selected={selectedId === row.id}
                      onSelect={() => onSelect(row)}
                      onOpenUrl={onOpenUrl}
                    />
                  ))}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
