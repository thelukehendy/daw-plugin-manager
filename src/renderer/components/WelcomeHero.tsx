export function WelcomeHero({
  onScan,
  onBrowse,
  scanning,
}: {
  onScan: () => void
  onBrowse: () => void
  scanning: boolean
}) {
  return (
    <section className="welcome">
      <div className="welcome-atmosphere" aria-hidden />
      <div className="welcome-inner">
        <p className="welcome-kicker">Discovery only · never installs or deletes</p>
        <h1 className="welcome-brand">DAW Plugin Manager</h1>
        <p className="welcome-lede">
          See what is on your Mac, what the catalog knows as latest, and how sure we are — without
          guessing versions.
        </p>
        <div className="welcome-cta">
          <button type="button" className="btn btn-primary btn-lg" onClick={onScan} disabled={scanning}>
            {scanning ? 'Scanning…' : 'Scan my library'}
          </button>
          <button type="button" className="btn btn-lg" onClick={onBrowse} disabled={scanning}>
            Browse catalog
          </button>
        </div>
        <p className="welcome-footnote">
          Confidence is always shown with versions. Yellow means weak evidence — not “update
          available.”
        </p>
      </div>
    </section>
  )
}
