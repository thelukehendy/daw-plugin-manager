import { useState } from 'react'
import type { ManufacturerReportGroup, PluginReportRow } from '../../shared/types'
import { ConfidenceBadge } from './ConfidenceBadge'
import { displayVersion, statusLabel } from '../lib/labels'

type GroupStats = {
  ok: number
  upd: number
  likely: number
  unverified: number
  hub: number
  paid: number
  unk: number
  content: number
  green: number
  amber: number
  yellow: number
  minConf: number
  minBand: 'high' | 'medium' | 'low'
  attn: number
}

function computeGroupStats(products: PluginReportRow[]): GroupStats {
  let ok = 0
  let upd = 0
  let likely = 0
  let unverified = 0
  let hub = 0
  let paid = 0
  let unk = 0
  let content = 0
  let green = 0
  let amber = 0
  let yellow = 0
  let minConf = 100
  let minBand: GroupStats['minBand'] = 'high'

  for (const p of products) {
    switch (p.status) {
      case 'current':
      case 'bundled':
      case 'legacy':
        ok++
        break
      case 'update_available':
        upd++
        break
      case 'update_likely':
        likely++
        break
      case 'unverified':
        unverified++
        break
      case 'use_vendor_hub':
        hub++
        break
      case 'paid_upgrade':
        paid++
        break
      case 'unknown':
        unk++
        break
      case 'content':
      case 'discontinued':
        content++
        break
      default:
        break
    }
    if (p.confidenceBand === 'high') green++
    else if (p.confidenceBand === 'medium') amber++
    else yellow++
    if (p.confidence < minConf) {
      minConf = p.confidence
      minBand = p.confidenceBand
    }
  }

  if (!products.length) {
    minConf = 0
    minBand = 'low'
  }

  return {
    ok,
    upd,
    likely,
    unverified,
    hub,
    paid,
    unk,
    content,
    green,
    amber,
    yellow,
    minConf,
    minBand,
    attn: upd + likely + unverified,
  }
}

function StatChip({
  n,
  label,
  tone,
}: {
  n: number
  label: string
  tone?: 'ok' | 'bad' | 'warn' | 'yellow' | 'hub' | 'paid' | 'muted'
}) {
  if (n <= 0) return null
  return (
    <span className={`mfg-chip ${tone || 'muted'}`}>
      <b>{n}</b> {label}
    </span>
  )
}

function ManufacturerHead({
  group,
  expanded,
  onToggle,
  onOpenUrl,
}: {
  group: ManufacturerReportGroup
  expanded: boolean
  onToggle: () => void
  onOpenUrl: (url: string | null) => void
}) {
  const stats = computeGroupStats(group.products)
  const primary =
    stats.attn > 0
      ? `${stats.attn} need update`
      : stats.hub > 0
        ? `${stats.hub} via hub`
        : stats.paid > 0
          ? `${stats.paid} paid upgrade`
          : stats.unk > 0
            ? `${stats.unk} unknown`
            : 'all clear'

  return (
    <div className={`mfg-head ${expanded ? 'is-open' : 'is-closed'}`}>
      <button
        type="button"
        className="mfg-toggle"
        onClick={onToggle}
        aria-expanded={expanded}
        title={expanded ? 'Collapse' : 'Expand plugins'}
      >
        <span className="exp" aria-hidden>
          {expanded ? '▾' : '▸'}
        </span>
        <strong className="mfg-name">{group.manufacturer}</strong>
        <span className="mfg-count mono">{group.productCount}</span>
      </button>

      <div className="mfg-primary" title="Primary attention signal">
        <span className={`mfg-primary-text ${stats.attn ? 'bad' : stats.hub || stats.paid ? 'hub' : 'ok'}`}>
          {primary}
        </span>
      </div>

      <div className="mfg-attn" title="Attention breakdown">
        <StatChip n={stats.upd} label="upd" tone="bad" />
        <StatChip n={stats.likely} label="likely" tone="warn" />
        <StatChip n={stats.unverified} label="unv" tone="yellow" />
        <StatChip n={stats.hub} label="hub" tone="hub" />
        <StatChip n={stats.paid} label="paid" tone="paid" />
        <StatChip n={stats.unk} label="unk" tone="muted" />
        {!stats.attn && !stats.hub && !stats.paid && !stats.unk && (
          <StatChip n={stats.ok || group.productCount} label="OK" tone="ok" />
        )}
      </div>

      <div className="mfg-conf" title="Lowest confidence and band mix">
        <span className="mfg-conf-min">
          min{' '}
          <ConfidenceBadge confidence={stats.minConf} band={stats.minBand} compact />
        </span>
        <span className="mfg-conf-mix mono">
          {stats.green > 0 && <span className="ok">{stats.green}≥85</span>}
          {stats.amber > 0 && (
            <span className="warn">
              {stats.green > 0 ? ' · ' : ''}
              {stats.amber}70–84
            </span>
          )}
          {stats.yellow > 0 && (
            <span className="yellow">
              {stats.green + stats.amber > 0 ? ' · ' : ''}
              {stats.yellow}&lt;70
            </span>
          )}
        </span>
      </div>

      <div className="mfg-hub">
        {group.portalApp ? (
          <button
            type="button"
            className="link-btn accent mfg-hub-btn"
            disabled={!group.updateUrl}
            onClick={(e) => {
              e.stopPropagation()
              onOpenUrl(group.updateUrl)
            }}
            title={group.updateUrl ? `Open ${group.portalApp}` : group.portalApp}
          >
            {group.portalApp}
          </button>
        ) : group.updateUrl ? (
          <button
            type="button"
            className="link-btn accent mfg-hub-btn"
            onClick={(e) => {
              e.stopPropagation()
              onOpenUrl(group.updateUrl)
            }}
          >
            Portal
          </button>
        ) : (
          <span className="mfg-hub-none">—</span>
        )}
      </div>
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
  const [open, setOpen] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }))
  }

  if (!groups.length) {
    return <div className="empty-panel">{emptyHint}</div>
  }

  return (
    <div className="grid-wrap">
      <div className="list-head mfg-list-head" aria-hidden>
        <span className="lh-mfg">Manufacturer</span>
        <span className="lh-primary">Signal</span>
        <span className="lh-attn">Attention</span>
        <span className="lh-conf">Confidence</span>
        <span className="lh-hub">Portal / hub</span>
      </div>
      <div className="plugin-list">
        {groups.map((g) => {
          const show = open[g.id] === true
          return (
            <div key={g.id} className={`mfg-block ${show ? 'is-open' : 'is-closed'}`}>
              <ManufacturerHead
                group={g}
                expanded={show}
                onToggle={() => toggle(g.id)}
                onOpenUrl={onOpenUrl}
              />
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
