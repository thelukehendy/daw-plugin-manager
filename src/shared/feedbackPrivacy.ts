/**
 * Scrub accidental personal machine details from free-text feedback.
 * Structured plugin lists are built without paths; this covers what users type.
 */

const EMAIL =
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
const MAC_HOME = /\/Users\/[^/\s"'`]+/gi
const LINUX_HOME = /\/home\/[^/\s"'`]+/gi
const WIN_HOME = /[A-Za-z]:\\Users\\[^\\\s"'`]+/gi
const WIN_HOME_FWD = /[A-Za-z]:\/Users\/[^/\s"'`]+/gi
const FILE_USER = /file:\/\/\/Users\/[^/\s"'`]+/gi
const HOST_LOCAL = /\b[a-z0-9][a-z0-9-]{0,62}\.local\b/gi
/** Common “my Mac is called …” style host tokens after keywords. */
const HOST_AFTER_LABEL =
  /\b((?:hostname|computer\s*name|machine\s*name|mac\s*name)\s*[:=]\s*["']?)([^\s"'`,;]+)(["']?)/gi

export function scrubFeedbackText(input: string): string {
  let text = input
  text = text.replace(EMAIL, '[email]')
  text = text.replace(FILE_USER, 'file:///Users/[user]')
  text = text.replace(MAC_HOME, '/Users/[user]')
  text = text.replace(LINUX_HOME, '/home/[user]')
  text = text.replace(WIN_HOME, (m) => `${m.slice(0, 1)}:\\Users\\[user]`)
  text = text.replace(WIN_HOME_FWD, (m) => `${m.slice(0, 1)}:/Users/[user]`)
  text = text.replace(HOST_LOCAL, '[host].local')
  text = text.replace(HOST_AFTER_LABEL, '$1[host]$3')
  return text
}

/** True if JSON still looks like it contains machine paths / home dirs. */
export function feedbackPayloadLooksLeaky(jsonText: string): boolean {
  if (/"homedir"\s*:/i.test(jsonText)) return true
  if (/"paths"\s*:/i.test(jsonText)) return true
  if (/"path"\s*:\s*"[^"]*\/Users\//i.test(jsonText)) return true
  if (/\/Users\/(?!\[user\])[^/"\s]+/i.test(jsonText)) return true
  if (/\/home\/(?!\[user\])[^/"\s]+/i.test(jsonText)) return true
  if (/[A-Za-z]:\\Users\\(?!\[user\])[^\\"\s]+/i.test(jsonText)) return true
  return false
}
