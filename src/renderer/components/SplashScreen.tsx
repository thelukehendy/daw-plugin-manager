import { useEffect, useState } from 'react'
import iconUrl from '../assets/app-icon.svg'

const VISIBLE_MS = 2400
const FADE_MS = 350

/** Brief launch screen; dismisses itself, or on any click / key. */
export function SplashScreen({
  catalogDate,
  onDone,
}: {
  catalogDate: string | null
  onDone: () => void
}) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leave = () => setLeaving(true)
    const timer = setTimeout(leave, VISIBLE_MS)
    window.addEventListener('keydown', leave)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', leave)
    }
  }, [])

  useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(onDone, FADE_MS)
    return () => clearTimeout(timer)
  }, [leaving, onDone])

  return (
    <div
      className={`splash ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-label="DAW Plugin Manager"
      onClick={() => setLeaving(true)}
    >
      <div className="splash-inner">
        <img className="splash-icon" src={iconUrl} alt="" width={128} height={128} />
        <h1 className="splash-name">DAW Plugin Manager</h1>
        <p className="splash-tag">Find what needs updating across your plugins, DAWs and helper apps.</p>
        <p className="splash-meta">
          {catalogDate ? `Catalog updated ${catalogDate}` : 'Discovery only · never installs or deletes'}
        </p>
      </div>
    </div>
  )
}
