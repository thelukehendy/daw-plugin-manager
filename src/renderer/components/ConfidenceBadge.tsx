import type { ConfidenceBand } from '../../shared/types'
import { confidenceLabel } from '../lib/labels'

export function ConfidenceBadge({
  confidence,
  band,
  compact,
}: {
  confidence: number
  band: ConfidenceBand
  compact?: boolean
}) {
  const tone = band === 'high' ? 'conf-green' : band === 'medium' ? 'conf-amber' : 'conf-yellow'
  return (
    <span
      className={`conf-badge ${tone} ${compact ? 'compact' : ''}`}
      title={`${confidence}% — ${confidenceLabel(band)}`}
    >
      <span className="conf-dot" aria-hidden />
      <span className="conf-score">{compact ? confidence : `${confidence}%`}</span>
      {!compact && <span className="conf-word">{confidenceLabel(band)}</span>}
    </span>
  )
}
