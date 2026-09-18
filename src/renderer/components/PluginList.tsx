import { useState } from 'react'
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
    <div
      className={`product-row state-row-${row.status} ${selected ? 'selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <span className="product-name" title={row.name}>
        {row.name}
      </span>
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
      <span className="cell-versions mono" title="Installed → catalog latest">
        <span className="ver-installed">{displayVersion(row.installedVersion)}</span>
        <span className="ver-arrow" aria-hidden>
          →
        </span>
        <span className="ver-latest">{displayVersion(row.latestVersion)}</span>
      </span>
      {showConf && (
        <ConfidenceBadge confidence={row.confidence} band={row.confidenceBand} compact />
      )}
      <span
        className={`state-pill state-${row.status}`}
        title={statusLabel(row.status, row.catalogOnly)}
      >
        {statusLabel(row.status, row.catalogOnly, true)}
      </span>
      <span
        className="cell-action"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
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
          <span className="action-none">—</span>
        )}
      </span>
    </div>
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
  // Session expand memory — manufacturers start collapsed
  const [open, setOpen] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }))
  }

  if (!groups.length) {
    return <div className="empty-panel">{emptyHint}</div>
  }

  return (
    <div className="grid-wrap">
      <div className="list-head" aria-hidden>
        <span>Plugin</span>
        <span>Installed → latest · conf · state</span>
      </div>
      <div className="plugin-list">
        {groups.map((g) => {
          const show = open[g.id] === true
          return (
            <div key={g.id} className={`mfg-block ${show ? 'is-open' : 'is-closed'}`}>
              <button
                type="button"
                className="mfg-head"
                onClick={() => toggle(g.id)}
                aria-expanded={show}
              >
                <span className="exp" aria-hidden>
                  {show ? '▾' : '▸'}
                </span>
                <strong className="mfg-name">{g.manufacturer}</strong>
                <span className="mfg-meta">
                  {g.productCount}
                  {g.outdatedCount ? ` · ${g.outdatedCount} attn` : ''}
                  {g.portalApp ? ` · ${g.portalApp}` : ''}
                </span>
                <ConfidenceBadge confidence={g.confidence} band={g.confidenceBand} compact />
              </button>
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
