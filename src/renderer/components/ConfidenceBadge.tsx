import type { ConfidenceBand, IdentityKind, PluginReportRow, UpdateStatus } from '../../shared/types'
import { confidenceDisplayWord, confidenceTooltip } from '../lib/labels'

const CONTENT_KINDS = new Set<string>([
  'soundset',
  'expansion',
  'bundle',
  'suite_component',
  'hardware',
  'eurorack',
  'hub_app',
])

export function ConfidenceBadge({
  confidence,
  band,
  latestVersion,
  identityKind,
  status,
  reasons,
  sourceUrl,
  /** Detail pane: keep numeric score as secondary text. */
  showScoreSecondary,
  compact,
}: {
  confidence: number
  band: ConfidenceBand
  latestVersion?: string | null
  identityKind?: IdentityKind
  status?: UpdateStatus
  reasons?: string[]
  sourceUrl?: string | null
  showScoreSecondary?: boolean
  compact?: boolean
}) {
  const word = confidenceDisplayWord({
    confidence,
    band,
    latestVersion,
    identityKind,
    status,
  })
  const tone =
    word === 'Verified' ? 'conf-green' : word === 'Likely' ? 'conf-amber' : 'conf-yellow'
  const tip = confidenceTooltip({
    word,
    confidence,
    band,
    reasons,
    sourceUrl,
  })

  return (
    <span
      className={`conf-badge ${tone} ${compact ? 'compact' : ''}`}
      title={tip}
    >
      <span className="conf-dot" aria-hidden />
      <span className="conf-word">{word}</span>
      {showScoreSecondary && (
        <span className="conf-score-secondary mono">{confidence}%</span>
      )}
    </span>
  )
}

/** Helpers for callers that have a full row. */
export function confidencePropsFromRow(row: PluginReportRow) {
  return {
    confidence: row.confidence,
    band: row.confidenceBand,
    latestVersion: row.latestVersion,
    identityKind: row.identityKind,
    status: row.status,
    reasons: row.confidenceReasons?.length
      ? row.confidenceReasons
      : row.confidenceReason
        ? [row.confidenceReason]
        : [],
    sourceUrl: row.versionSourceUrl,
  }
}

export function isContentIdentity(kind: IdentityKind | undefined): boolean {
  return !!kind && CONTENT_KINDS.has(kind)
}
