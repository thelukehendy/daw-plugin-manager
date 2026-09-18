import { Fragment, useState } from 'react'
import type { ManufacturerReportGroup, PluginReportRow } from '../../shared/types'
import { ConfidenceBadge } from './ConfidenceBadge'
import { displayVersion, statusLabel } from '../lib/labels'

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
  const portalLabel =
    row.portalApp && (row.status === 'use_vendor_hub' || row.confidenceBand === 'low')
      ? row.portalApp
      : row.updateUrl
        ? 'Portal'
        : null

  return (
    <tr
      className={`product-row state-row-${row.status} ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <td className="cell-name">
        <span className="product-name">{row.name}</span>
        {row.successorPluginId && (
          <span className="micro-tag paid" title="Paid next generation exists">
            Paid
          </span>
        )}
        {row.portalApp && row.status === 'use_vendor_hub' && (
          <span className="micro-tag hub" title={row.portalApp}>
            {row.portalApp}
          </span>
        )}
        {row.formats.length > 0 && (
          <span className="fmt-inline mono" title={row.formats.join(' · ')}>
            {row.formats.slice(0, 3).join(' ')}
          </span>
        )}
      </td>
      <td className="cell-versions mono">
        <span className="ver-installed" title="Installed">
          {displayVersion(row.installedVersion)}
        </span>
        <span className="ver-arrow" aria-hidden>
          →
        </span>
        <span className="ver-latest" title="Catalog latest">
          {displayVersion(row.latestVersion)}
        </span>
        {showConf && (
          <ConfidenceBadge confidence={row.confidence} band={row.confidenceBand} compact />
        )}
      </td>
      <td className="cell-state">
        <span
          className={`state-pill state-${row.status}`}
          title={statusLabel(row.status, row.catalogOnly)}
        >
          {statusLabel(row.status, row.catalogOnly, true)}
        </span>
      </td>
      <td className="cell-action" onClick={(e) => e.stopPropagation()}>
        {portalLabel ? (
          <button
            type="button"
            className="link-btn accent"
            disabled={!row.updateUrl}
            onClick={() => onOpenUrl(row.updateUrl)}
            title={row.portalApp ? `Open ${row.portalApp}` : 'Open update portal'}
          >
            {portalLabel}
          </button>
        ) : (
          <span className="faint">—</span>
        )}
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
    setOpen((s) => ({ ...s, [id]: !(s[id] !== false) }))
  }

  if (!groups.length) {
    return <div className="empty-panel">{emptyHint}</div>
  }

  return (
    <div className="grid-wrap">
      <table className="grid dense">
        <thead>
          <tr>
            <th>Plugin</th>
            <th>Installed → latest</th>
            <th>State</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            // Default expanded so hundreds of results stay scannable by manufacturer sticky heads
            const show = open[g.id] !== false
            return (
              <Fragment key={g.id}>
                <tr className="mfg-row" onClick={() => toggle(g.id)}>
                  <td colSpan={4}>
                    <div className="mfg-head">
                      <span className="exp" aria-hidden>
                        {show ? '▾' : '▸'}
                      </span>
                      <strong className="mfg-name">{g.manufacturer}</strong>
                      <span className="mfg-meta">
                        {g.productCount}
                        {g.outdatedCount ? ` · ${g.outdatedCount} attn` : ''}
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
