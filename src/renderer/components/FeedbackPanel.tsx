import { useState } from 'react'

const MAX_CHARS = 4000

/** Feedback text plus an opt-in to attach the anonymized plugin list. */
export function FeedbackPanel({ hasScan }: { hasScan: boolean }) {
  const [message, setMessage] = useState('')
  const [includeScan, setIncludeScan] = useState(false)
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string }>({
    kind: 'idle',
  })

  async function send() {
    const api = window.dawPluginManager
    if (!api?.sendFeedback) return
    setState({ kind: 'sending' })
    const res = await api.sendFeedback({ message, includeScan: includeScan && hasScan })
    if (res.ok) {
      setMessage('')
      setIncludeScan(false)
      setState({ kind: 'sent', text: 'Thanks — feedback sent.' })
    } else {
      setState({ kind: 'error', text: res.error })
    }
  }

  return (
    <div className="feedback">
      <label className="feedback-label" htmlFor="feedback-text">
        Feedback
      </label>
      <textarea
        id="feedback-text"
        value={message}
        maxLength={MAX_CHARS}
        onChange={(e) => {
          setMessage(e.target.value)
          if (state.kind !== 'sending') setState({ kind: 'idle' })
        }}
        rows={3}
        placeholder="What's wrong, confusing, or missing? A plugin with the wrong version, a vendor we don't know…"
      />
      <div className="feedback-row">
        <span className="feedback-note">
          Plugin and app names, vendors, bundle IDs and versions only. No file paths, usernames
          or machine names.
        </span>
        <div className="feedback-actions">
          <label
            className="feedback-check"
            title={hasScan ? undefined : 'Scan (or reopen a saved library) first to attach your plugin list.'}
          >
            <input
              type="checkbox"
              checked={includeScan && hasScan}
              disabled={!hasScan}
              onChange={(e) => setIncludeScan(e.target.checked)}
            />
            Include my plugin list
          </label>
          <button
            type="button"
            className="btn btn-primary"
            onClick={send}
            disabled={!message.trim() || state.kind === 'sending'}
          >
            {state.kind === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
      {state.text && (
        <p className={`feedback-status ${state.kind === 'error' ? 'is-error' : ''}`} role="status">
          {state.text}
        </p>
      )}
    </div>
  )
}
