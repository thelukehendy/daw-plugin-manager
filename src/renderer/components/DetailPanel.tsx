import type { PluginReportRow } from '../../shared/types'
import { ConfidenceBadge, confidencePropsFromRow } from './ConfidenceBadge'
import {
  STATUS_HINT,
  displayVersion,
  formatCheckedAt,
  humanizeConfidenceReason,
  identityLabel,
  portalHover,
  statusLabel,
  vendorVerifyUrl,
} from '../lib/labels'

export function DetailPanel({
  row,
  onClose,
  onOpenUrl,
}: {
  row: PluginReportRow
  onClose: () => void
  onOpenUrl: (url: string | null) => void
}) {
  const checked = formatCheckedAt(row.versionVerifiedAt)
  const reasons =
    row.confidenceReasons?.length > 0
      ? row.confidenceReasons
      : row.confidenceReason
        ? [row.confidenceReason]
        : []
  const whyLines = reasons
    .map(humanizeConfidenceReason)
    .filter(Boolean)
    .filter((s, i, arr) => arr.indexOf(s) === i)
  const verifyUrl = vendorVerifyUrl(row.versionSourceUrl)

  return (
    <aside className="detail-drawer" role="dialog" aria-label="Plugin details">
      <div className="detail-drawer-head">
        <div>
          <p className="detail-mfg">{row.manufacturer}</p>
          <h2 className="detail-title">{row.name}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>

      <div className="detail-status-row">
        <span className={`state-pill state-${row.status}`}>
          {statusLabel(row.status, row.catalogOnly)}
        </span>
        {(row.latestVersion != null ||
          row.status === 'unknown' ||
          row.status === 'unverified' ||
          row.status === 'update_available' ||
          row.status === 'update_likely' ||
          row.status === 'current' ||
          row.status === 'content' ||
          row.status === 'discontinued') && (
          <ConfidenceBadge
            {...confidencePropsFromRow(row)}
            showScoreSecondary
          />
        )}
      </div>
      <p className="detail-hint">
        {row.catalogOnly && row.status === 'current'
          ? 'Published catalog version for this product (no local install compared).'
          : STATUS_HINT[row.status]}
      </p>

      <dl className="detail-grid">
        <div>
          <dt>Installed</dt>
          <dd className="mono">{displayVersion(row.installedVersion)}</dd>
        </div>
        {row.status === 'discontinued' ? (
          <div>
            <dt>Final version</dt>
            <dd className="mono">{row.finalVersion || '—'}</dd>
          </div>
        ) : (
          <div>
            <dt>Catalog latest</dt>
            <dd className="mono">{displayVersion(row.latestVersion)}</dd>
          </div>
        )}
        <div>
          <dt>Identity</dt>
          <dd>{identityLabel(row.identityKind)}</dd>
        </div>
        <div>
          <dt>Formats</dt>
          <dd className="mono">{row.formats.length ? row.formats.join(' · ') : '—'}</dd>
        </div>
        {row.appleSilicon && (
          <div>
            <dt>Apple Silicon</dt>
            <dd>{row.appleSilicon}</dd>
          </div>
        )}
        {checked && (
          <div>
            <dt>Last checked</dt>
            <dd>{checked}</dd>
          </div>
        )}
      </dl>

      {(whyLines.length > 0 || verifyUrl) && (
        <section className="detail-section">
          <h3>Why this confidence</h3>
          {whyLines.length > 0 && (
            <ul className="reason-list">
              {whyLines.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
          {verifyUrl && (
            <p className="detail-verify">
              <button
                type="button"
                className="link-btn accent"
                onClick={() => onOpenUrl(verifyUrl)}
              >
                Check on manufacturer site
              </button>
            </p>
          )}
        </section>
      )}

      {row.notesForUser && (
        <section className="detail-section">
          <h3>Note</h3>
          <p>{row.notesForUser}</p>
        </section>
      )}

      {(row.successorPluginId || row.updateClass === 'paid_upgrade') && (
        <section className="detail-section paid-callout">
          <h3>Paid upgrade</h3>
          <p>
            Next generation{row.successorName ? `: ${row.successorName}` : ''} — not a free
            in-place update.
          </p>
        </section>
      )}

      {row.portalApp && (
        <section className="detail-section hub-callout">
          <h3>Vendor hub</h3>
          <p>
            Use <strong>{row.portalApp}</strong> to check for updates for this vendor.
          </p>
        </section>
      )}

      {row.versionDetails.length > 0 && (
        <section className="detail-section">
          <h3>Installed bundles</h3>
          <ul className="bundle-list">
            {row.versionDetails.map((v, i) => (
              <li key={i} className={v.legacy ? 'is-legacy' : ''}>
                <span className="mono">{displayVersion(v.version)}</span>
                <span>
                  {v.name}
                  {v.legacy ? ' · older leftover' : ''}
                </span>
                <span className="mono faint">{v.formats.join(',')}</span>
                <span className="path">{v.paths.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {row.compatibilityFlags
        .filter((f) => f.severity !== 'info')
        .map((f, i) => (
          <div key={i} className={`detail-warn sev-${f.severity}`}>
            <strong>
              {f.severity === 'block' ? 'May not work with' : 'Check before using with'}{' '}
              {[f.dawName, f.dawVersion].filter(Boolean).join(' ')}
            </strong>
            <span>{f.note}</span>
          </div>
        ))}

      <div className="detail-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!row.updateUrl}
          onClick={() => onOpenUrl(row.updateUrl)}
          title={portalHover({
            portalApp: row.portalApp,
            kind: row.portalApp ? 'hub' : 'portal',
          })}
        >
          {row.portalApp ? `Open ${row.portalApp} portal` : 'Open update portal'}
        </button>
      </div>
    </aside>
  )
}
