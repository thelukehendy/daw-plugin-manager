import { useEffect, useRef, useState } from 'react'
import type { PluginReportRow, UpdateStatus } from '../../shared/types'
import { displayVersion, formatsHover, statusHover } from '../lib/labels'

export type SortKey = 'name' | 'vendor' | 'status' | 'installed'

export interface VendorGroup {
  key: string
  vendor: string
  portalApp: string | null
  updateUrl: string | null
  popularityTier: number | null
  rows: PluginReportRow[]
}

/** Short status words for a dense column; the drawer carries the long explanation. */
const STATUS_SHORT: Record<UpdateStatus, string> = {
  update_available: 'Update',
  update_likely: 'Likely update',
  paid_upgrade: 'Paid upgrade',
  use_vendor_hub: 'Via hub app',
  unverified: 'Check',
  unknown: 'Not tracked',
  current: 'Up to date',
  bundled: 'Bundled',
  legacy: 'Legacy',
  content: 'Content',
  discontinued: 'Discontinued',
}

export const STATUS_ORDER: Record<UpdateStatus, number> = {
  update_available: 0,
  update_likely: 1,
  paid_upgrade: 2,
  use_vendor_hub: 3,
  unverified: 4,
  unknown: 5,
  discontinued: 6,
  legacy: 7,
  current: 8,
  bundled: 9,
  content: 10,
}

function isBehind(row: PluginReportRow): boolean {
  return row.status === 'update_available' || row.status === 'update_likely'
}

/** Every row in the group has the same install → latest (one vendor installer, e.g. Melda). */
function uniformChange(rows: PluginReportRow[]): string | null {
  if (rows.length < 2) return null
  const { installedVersion: a, latestVersion: b, status } = rows[0]
  if (!a || !b || a === b) return null
  return rows.every((r) => r.installedVersion === a && r.latestVersion === b && r.status === status)
    ? `${a} → ${b}`
    : null
}

/** Long groups that repeat one change start collapsed; everything else starts open. */
const AUTO_COLLAPSE_AT = 8

function LatestCell({ row }: { row: PluginReportRow }) {
  if (row.status === 'discontinued') {
    return (
      <span className="v-final" title="Discontinued — last release shipped. Not an update.">
        {row.finalVersion ? `${row.finalVersion} final` : '—'}
      </span>
    )
  }
  if (!row.latestVersion) return <span className="v-none">—</span>
  return (
    <span className={isBehind(row) ? 'v-newer' : row.status === 'paid_upgrade' ? 'v-paid' : ''}>
      {row.latestVersion}
    </span>
  )
}

function RowTags({ row }: { row: PluginReportRow }) {
  const tags: { text: string; title: string; tone: string }[] = []
  if (row.successorName && row.status !== 'paid_upgrade') {
    tags.push({
      text: `${row.successorName} · paid`,
      title: row.notesForUser || `${row.successorName} is a paid upgrade.`,
      tone: 'paid',
    })
  }
  if (row.requiresIlok) tags.push({ text: 'iLok', title: 'Requires an iLok license.', tone: 'plain' })
  if (row.compatibilityFlags.some((f) => f.severity === 'block')) {
    tags.push({ text: 'Compat', title: 'Known compatibility problem with an installed DAW.', tone: 'bad' })
  }
  if (!tags.length) return null
  return (
    <>
      {tags.map((t) => (
        <span key={t.text} className={`row-tag tag-${t.tone}`} title={t.title}>
          {t.text}
        </span>
      ))}
    </>
  )
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
  className,
  title,
}: {
  label: string
  k: SortKey
  sort: SortKey
  onSort: (k: SortKey) => void
  className: string
  title?: string
}) {
  return (
    <th className={className} title={title} aria-sort={sort === k ? 'ascending' : 'none'}>
      <button type="button" className={`th-sort ${sort === k ? 'on' : ''}`} onClick={() => onSort(k)}>
        {label}
        {sort === k && <span aria-hidden> ↓</span>}
      </button>
    </th>
  )
}

export function LibraryTable({
  groups,
  grouped,
  sort,
  onSort,
  selectedId,
  onSelect,
  onOpenUrl,
  emptyHint,
}: {
  groups: VendorGroup[]
  grouped: boolean
  sort: SortKey
  onSort: (k: SortKey) => void
  selectedId: string | null
  onSelect: (row: PluginReportRow) => void
  onOpenUrl: (url: string | null) => void
  emptyHint: string
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedId) return
    const el = bodyRef.current?.querySelector(`[data-row-id="${CSS.escape(selectedId)}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  if (!groups.length) return <div className="empty-panel">{emptyHint}</div>

  const colCount = grouped ? 6 : 7
  const renderRow = (row: PluginReportRow) => (
    <tr
      key={row.id}
      data-row-id={row.id}
      className={`lib-row ${selectedId === row.id ? 'selected' : ''}`}
      onClick={() => onSelect(row)}
    >
      <td className="c-name">
        <span className="name-text" title={row.name}>
          {row.name}
        </span>
        <RowTags row={row} />
      </td>
      {!grouped && (
        <td className="c-vendor" title={row.manufacturer}>
          {row.manufacturer}
        </td>
      )}
      <td className="c-ver mono">{displayVersion(row.installedVersion)}</td>
      <td className="c-ver mono">
        <LatestCell row={row} />
      </td>
      <td className="c-status">
        <span
          className={`status s-${row.status}`}
          title={statusHover(row.status, { catalogOnly: row.catalogOnly, portalApp: row.portalApp })}
        >
          <i aria-hidden />
          {row.status === 'use_vendor_hub' && row.portalApp ? row.portalApp : STATUS_SHORT[row.status]}
        </span>
      </td>
      <td className="c-fmt mono" title={formatsHover(row.formats)}>
        {row.formats.join(' ')}
      </td>
      <td className="c-act">
        {row.updateUrl && (
          <button
            type="button"
            className="row-open"
            title={row.portalApp ? `Open ${row.portalApp}` : 'Open the vendor page for this plugin'}
            onClick={(e) => {
              e.stopPropagation()
              onOpenUrl(row.updateUrl)
            }}
          >
            ↗
          </button>
        )}
      </td>
    </tr>
  )

  return (
    <div className="lib-scroll" ref={bodyRef}>
      <table className={`lib-table ${grouped ? 'is-grouped' : 'is-flat'}`}>
        <colgroup>
          <col className="w-name" />
          {!grouped && <col className="w-vendor" />}
          <col className="w-ver" />
          <col className="w-ver" />
          <col className="w-status" />
          <col className="w-fmt" />
          <col className="w-act" />
        </colgroup>
        <thead>
          <tr>
            <SortHeader label="Plugin" k="name" sort={sort} onSort={onSort} className="c-name" />
            {!grouped && (
              <SortHeader label="Vendor" k="vendor" sort={sort} onSort={onSort} className="c-vendor" />
            )}
            <SortHeader
              label="Installed"
              k="installed"
              sort={sort}
              onSort={onSort}
              className="c-ver"
              title="Newest version found on this Mac"
            />
            <th className="c-ver" title="Newest version the catalog trusts">
              Latest
            </th>
            <SortHeader
              label="Status"
              k="status"
              sort={sort}
              onSort={onSort}
              className="c-status"
              title="Update = verified newer version. Likely = fairly sure. Check = weak source only."
            />
            <th className="c-fmt">Formats</th>
            <th className="c-act" aria-label="Open" />
          </tr>
        </thead>
        {grouped ? (
          groups.map((g) => {
            const uniform = uniformChange(g.rows)
            const isCollapsed =
              collapsed[g.key] ?? (!!uniform && g.rows.length >= AUTO_COLLAPSE_AT)
            const behind = g.rows.filter(isBehind).length
            return (
              <tbody key={g.key} className="vendor-group">
                <tr className="vendor-head">
                  <td colSpan={colCount}>
                    <div className="vendor-head-inner">
                      <button
                        type="button"
                        className="vendor-toggle"
                        aria-expanded={!isCollapsed}
                        onClick={() => setCollapsed((s) => ({ ...s, [g.key]: !isCollapsed }))}
                      >
                        <span className="caret" aria-hidden>
                          {isCollapsed ? '▸' : '▾'}
                        </span>
                        <span className="vendor-name">{g.vendor}</span>
                        <span className="vendor-count mono">
                          {behind === g.rows.length ? (
                            <em>{behind} behind</em>
                          ) : (
                            <>
                              {g.rows.length}
                              {behind > 0 && <em> · {behind} behind</em>}
                            </>
                          )}
                        </span>
                        {uniform && (
                          <span className="vendor-uniform mono" title="Every plugin in this group has the same update">
                            all {uniform}
                          </span>
                        )}
                      </button>
                      {g.updateUrl && (
                        <button
                          type="button"
                          className="vendor-open"
                          onClick={() => onOpenUrl(g.updateUrl)}
                          title={
                            g.portalApp
                              ? `Updates for ${g.vendor} go through ${g.portalApp}`
                              : `Open ${g.vendor}'s download / account page`
                          }
                        >
                          {g.portalApp ? `Open ${g.portalApp}` : 'Vendor page'} ↗
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {!isCollapsed && g.rows.map(renderRow)}
              </tbody>
            )
          })
        ) : (
          <tbody>{groups.flatMap((g) => g.rows).map(renderRow)}</tbody>
        )}
      </table>
    </div>
  )
}
