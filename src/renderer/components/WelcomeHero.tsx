export function WelcomeHero({
  onScan,
  scanning,
  hasLibrary,
}: {
  onScan: () => void
  scanning: boolean
  hasLibrary?: boolean
}) {
  return (
    <section className="welcome">
      <div className="welcome-atmosphere" aria-hidden />
      <div className="welcome-inner">
        <p className="welcome-kicker">Discovery only · never installs or deletes</p>
        <h1 className="welcome-brand">DAW Plugin Manager</h1>
        <p className="welcome-lede">
          Scan the plugins on your Mac, match them to the catalog, and see what needs attention —
          with honest confidence, never guessed versions.
        </p>
        <div className="welcome-cta">
          <button type="button" className="btn btn-primary btn-lg" onClick={onScan} disabled={scanning}>
            {scanning ? 'Scanning…' : hasLibrary ? 'Rescan my library' : 'Scan my library'}
          </button>
        </div>
        <p className="welcome-footnote">
          Confidence shows as Verified, Likely, or Unknown. Yellow is weak evidence — not “update
          available.”
        </p>
      </div>
    </section>
  )
}
