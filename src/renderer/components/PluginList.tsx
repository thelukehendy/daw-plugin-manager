import { useState } from 'react'
import type { ManufacturerReportGroup, PluginReportRow } from '../../shared/types'
import { ConfidenceBadge, confidencePropsFromRow } from './ConfidenceBadge'
import {
  displayVersion,
  formatsHover,
  portalHover,
  statusHover,
  statusLabel,
  versionsColumnHover,
} from '../lib/labels'
import {
  TRIAGE_EXPLAINER,
  TRIAGE_LABEL,
  TRIAGE_ORDER,
  type TriageBucket,
  type TriageFilter,
  buildVendorSignal,
  partitionByTriage,
} from '../lib/triage'

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
      <span className="col-name product-name" title={row.name}>
        {row.name}
      </span>
      <span className="col-fmt mono" title={formatsHover(row.formats)}>
        {row.formats.length ? row.formats.slice(0, 4).join(' ') : '—'}
      </span>
      <span className="col-ver mono" title={versionsColumnHover()}>
        <span className="ver-installed">{displayVersion(row.installedVersion)}</span>
        <span className="ver-arrow" aria-hidden>
          →
        </span>
        <span className="ver-latest">{displayVersion(row.latestVersion)}</span>
      </span>
      <span className="col-conf">
        <ConfidenceBadge {...confidencePropsFromRow(row)} compact />
      </span>
      <span className="col-state">
        <span
          className={`state-pill state-${row.status}`}
          title={statusHover(row.status, {
            catalogOnly: row.catalogOnly,
            portalApp: row.portalApp,
          })}
        >
          {statusLabel(row.status, row.catalogOnly, true)}
        </span>
      </span>
      <span className="col-action" onClick={(e) => e.stopPropagation()}>
        {portalLabel ? (
          <button
            type="button"
            className="link-btn accent"
            disabled={!row.updateUrl}
            onClick={() => onOpenUrl(row.updateUrl)}
            title={portalHover({
              portalApp: row.portalApp,
              kind: row.portalApp ? 'hub' : 'portal',
            })}
          >
            {portalLabel}
          </button>
        ) : (
          <span className="action-none" title="No portal link on file for this plugin.">
            —
          </span>
        )}
      </span>
    </div>
  )
}

function VendorRow({
  group,
  bucket,
  expanded,
  selectedId,
  onToggle,
  onSelect,
  onOpenUrl,
}: {
  group: ManufacturerReportGroup
  bucket: TriageBucket
  expanded: boolean
  selectedId: string | null
  onToggle: () => void
  onSelect: (row: PluginReportRow) => void
  onOpenUrl: (url: string | null) => void
}) {
  const signal = buildVendorSignal(group, bucket)
  const ctaLabel = group.portalApp
    ? `Open ${group.portalApp}`
    : group.updateUrl
      ? 'Open portal'
      : null

  return (
    <div className={`vendor-block triage-${bucket} ${expanded ? 'is-open' : ''}`}>
      <div className="vendor-row">
        <button
          type="button"
          className="vendor-main"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="exp" aria-hidden>
            {expanded ? '▾' : '▸'}
          </span>
          <span className="vendor-name">{group.manufacturer}</span>
          <span className="vendor-signal-group">
            <span className="vendor-signal">{signal.primary}</span>
            <ConfidenceBadge
              confidence={signal.minConfidence}
              band={signal.minBand}
              compact
            />
          </span>
        </button>
        <div className="vendor-cta">
          {ctaLabel ? (
            <button
              type="button"
              className="btn btn-hub"
              disabled={!group.updateUrl}
              onClick={() => onOpenUrl(group.updateUrl)}
              title={portalHover({
                portalApp: group.portalApp,
                kind: group.portalApp ? 'hub' : 'portal',
              })}
            >
              {group.portalApp ? `Open hub` : 'Open portal'}
            </button>
          ) : (
            <span className="vendor-cta-none" title="No hub or portal link on file for this vendor.">
              —
            </span>
          )}
        </div>
      </div>
      {expanded && (
        <div className="vendor-plugins">
          <div className="plugin-cols-head" aria-hidden>
            <span className="col-name">Plugin</span>
            <span className="col-fmt" title={formatsHover(['AU', 'VST3', 'VST'])}>
              Formats
            </span>
            <span className="col-ver" title={versionsColumnHover()}>
              Installed → latest
            </span>
            <span
              className="col-conf"
              title="How sure we are about the catalog latest. Hover Verified / Likely / Unknown on a row for why."
            >
              Confidence
            </span>
            <span
              className="col-state"
              title="What to do with this install: update, use hub, paid upgrade, OK, or unknown."
            >
              State
            </span>
            <span
              className="col-action"
              title="Opens the manufacturer portal in your browser — never downloads for you."
            >
              Portal
            </span>
          </div>
          {signal.focusProducts.map((row) => (
            <ProductRow
              key={row.id}
              row={row}
              selected={selectedId === row.id}
              onSelect={() => onSelect(row)}
              onOpenUrl={onOpenUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TriageSection({
  bucket,
  groups,
  defaultCollapsed,
  open,
  onToggle,
  selectedId,
  onSelect,
  onOpenUrl,
}: {
  bucket: TriageBucket
  groups: ManufacturerReportGroup[]
  defaultCollapsed?: boolean
  open: Record<string, boolean>
  onToggle: (id: string) => void
  selectedId: string | null
  onSelect: (row: PluginReportRow) => void
  onOpenUrl: (url: string | null) => void
}) {
  const [sectionOpen, setSectionOpen] = useState(!defaultCollapsed)
  if (!groups.length) return null

  const pluginCount = groups.reduce((n, g) => n + g.productCount, 0)

  return (
    <section className={`triage-section triage-${bucket} ${sectionOpen ? 'is-open' : 'is-closed'}`}>
      <button
        type="button"
        className="triage-section-head"
        onClick={() => setSectionOpen((s) => !s)}
        aria-expanded={sectionOpen}
      >
        <span className="exp" aria-hidden>
          {sectionOpen ? '▾' : '▸'}
        </span>
        <span className="triage-title-block">
          <span className="triage-title-row">
            <span className="triage-title">{TRIAGE_LABEL[bucket]}</span>
            <span className="triage-meta mono">
              {groups.length} vendor{groups.length === 1 ? '' : 's'} · {pluginCount}
            </span>
          </span>
          <span className="triage-explainer">{TRIAGE_EXPLAINER[bucket]}</span>
        </span>
      </button>
      {sectionOpen && (
        <div className="triage-vendors">
          {groups.map((g) => {
            const key = `${bucket}:${g.id}`
            return (
              <VendorRow
                key={key}
                group={g}
                bucket={bucket}
                expanded={open[key] === true}
                selectedId={selectedId}
                onToggle={() => onToggle(key)}
                onSelect={onSelect}
                onOpenUrl={onOpenUrl}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export function PluginList({
  groups,
  triageFilter,
  selectedId,
  onSelect,
  onOpenUrl,
  emptyHint,
}: {
  groups: ManufacturerReportGroup[]
  triageFilter: TriageFilter
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

  const partitioned = partitionByTriage(groups)
  const buckets =
    triageFilter === 'all' ? TRIAGE_ORDER : ([triageFilter] as TriageBucket[])

  const any = buckets.some((b) => partitioned[b].length > 0)
  if (!any) {
    return <div className="empty-panel">{emptyHint}</div>
  }

  return (
    <div className="grid-wrap triage-wrap">
      <div className="plugin-list triage-list">
        {buckets.map((bucket) => (
          <TriageSection
            key={bucket}
            bucket={bucket}
            groups={partitioned[bucket]}
            defaultCollapsed={bucket === 'clear' && triageFilter === 'all'}
            open={open}
            onToggle={toggle}
            selectedId={selectedId}
            onSelect={onSelect}
            onOpenUrl={onOpenUrl}
          />
        ))}
      </div>
    </div>
  )
}
