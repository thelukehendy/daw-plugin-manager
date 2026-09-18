import type { ConfidenceBand, IdentityKind, UpdateStatus } from '../../shared/types'
import { STATUS_LABEL_COMPACT, identityLabel } from '../lib/labels'

export type ConfidenceFilter = 'all' | ConfidenceBand
export type IdentityFilter = 'all' | string
export type StatusFilter = 'all' | UpdateStatus

const STATUS_OPTIONS: UpdateStatus[] = [
  'update_available',
  'update_likely',
  'unverified',
  'paid_upgrade',
  'use_vendor_hub',
  'unknown',
  'current',
  'content',
  'discontinued',
  'bundled',
]

const IDENTITY_OPTIONS: IdentityKind[] = [
  'plugin',
  'hub_app',
  'soundset',
  'expansion',
  'bundle',
  'suite_component',
  'discontinued',
  'gen_ambiguous',
  'hardware',
]

export function FilterBar({
  query,
  onQuery,
  status,
  onStatus,
  confidence,
  onConfidence,
  identity,
  onIdentity,
  manufacturer,
  onManufacturer,
  manufacturers,
  visibleCount,
  totalCount,
}: {
  query: string
  onQuery: (v: string) => void
  status: StatusFilter
  onStatus: (v: StatusFilter) => void
  confidence: ConfidenceFilter
  onConfidence: (v: ConfidenceFilter) => void
  identity: IdentityFilter
  onIdentity: (v: IdentityFilter) => void
  manufacturer: string
  onManufacturer: (v: string) => void
  manufacturers: string[]
  visibleCount: number
  totalCount: number
}) {
  return (
    <div className="filter-bar">
      <input
        className="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search…"
        aria-label="Search"
      />
      <select
        value={manufacturer}
        onChange={(e) => onManufacturer(e.target.value)}
        aria-label="Manufacturer"
      >
        <option value="">Manufacturer</option>
        {manufacturers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as StatusFilter)}
        aria-label="Update state"
      >
        <option value="all">State</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL_COMPACT[s]}
          </option>
        ))}
      </select>
      <select
        value={confidence}
        onChange={(e) => onConfidence(e.target.value as ConfidenceFilter)}
        aria-label="Confidence band"
      >
        <option value="all">Conf</option>
        <option value="high">≥85</option>
        <option value="medium">70–84</option>
        <option value="low">&lt;70</option>
      </select>
      <select
        value={identity}
        onChange={(e) => onIdentity(e.target.value)}
        aria-label="Identity kind"
      >
        <option value="all">Kind</option>
        {IDENTITY_OPTIONS.map((k) => (
          <option key={k} value={k}>
            {identityLabel(k)}
          </option>
        ))}
      </select>
      <span className="filter-count mono" title="Visible / total">
        {visibleCount}/{totalCount}
      </span>
    </div>
  )
}
