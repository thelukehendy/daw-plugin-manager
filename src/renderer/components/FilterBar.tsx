import type { ConfidenceBand, IdentityKind, UpdateStatus } from '../../shared/types'
import { identityLabel } from '../lib/labels'

export type ConfidenceFilter = 'all' | ConfidenceBand
export type IdentityFilter = 'all' | string
export type StatusFilter = 'all' | UpdateStatus

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

/** Compact search + secondary filters. Triage lives in the clickable chips above. */
export function FilterBar({
  query,
  onQuery,
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
  status?: StatusFilter
  onStatus?: (v: StatusFilter) => void
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
        placeholder="Search vendors or plugins…"
        aria-label="Search"
      />
      <select
        value={manufacturer}
        onChange={(e) => onManufacturer(e.target.value)}
        aria-label="Manufacturer"
      >
        <option value="">All vendors</option>
        {manufacturers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={confidence}
        onChange={(e) => onConfidence(e.target.value as ConfidenceFilter)}
        aria-label="Confidence band"
      >
        <option value="all">All confidence</option>
        <option value="high">Verified (≥85)</option>
        <option value="medium">Likely (70–84)</option>
        <option value="low">Unknown (&lt;70)</option>
      </select>
      <select
        value={identity}
        onChange={(e) => onIdentity(e.target.value)}
        aria-label="Identity kind"
      >
        <option value="all">All kinds</option>
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
