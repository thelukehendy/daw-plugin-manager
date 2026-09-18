import semver from 'semver'
import type { VersionScheme } from '../../shared/types'

const CANONICAL_SCHEMES = new Set(['semver', 'semver4', 'date', 'build', 'marketing'])

/**
 * Only exact canonical scheme tokens drive the normalizer.
 * Free-text notes (e.g. "major.minor (2-part), some 3-part") are ignored → default semver.
 */
export function resolveScheme(scheme: VersionScheme | null | undefined): VersionScheme {
  if (scheme == null || scheme === '') return 'semver'
  const s = String(scheme).trim().toLowerCase()
  if (CANONICAL_SCHEMES.has(s)) return s as VersionScheme
  return 'semver'
}

/**
 * Normalize plugin versions for comparison.
 * Honors manufacturer versionScheme when it is a canonical token.
 */
export function normalizeVersion(
  input: string | null | undefined,
  scheme?: VersionScheme | null
): string | null {
  if (!input) return null
  let v = input.trim()
  if (!v) return null

  const kind = resolveScheme(scheme)

  if (kind === 'marketing') {
    return v.toLowerCase().replace(/^v/i, '').replace(/\s+/g, ' ')
  }

  if (kind === 'date') {
    const iso = v.match(/(\d{4}-\d{2}-\d{2})/)
    if (iso) {
      const rest = v.slice(v.indexOf(iso[1]) + iso[1].length).replace(/^[-_.\s]+/, '')
      return rest ? `${iso[1]}+${rest}` : iso[1]
    }
    const yymm = v.match(/(\d{2})\.(\d{2})/)
    if (yymm) return `20${yymm[1]}-${yymm[2]}-01`
    return v.toLowerCase()
  }

  if (kind === 'build') {
    const digits = v.match(/(\d+)/)
    return digits ? digits[1] : null
  }

  v = v.replace(/^v/i, '')
  v = v.replace(/\.f\d+$/i, '')
  v = v.replace(/\s*\(.*\)$/, '')
  v = v.replace(/_/g, '.')

  if (kind === 'semver4') {
    const m = v.match(/(\d+(?:\.\d+){0,3})/)
    if (!m) return null
    const parts = m[1].split('.')
    while (parts.length < 4) parts.push('0')
    return parts.slice(0, 4).join('.')
  }

  const match = v.match(/(\d+(?:\.\d+){0,3})/)
  if (!match) return null
  const coerced = semver.coerce(match[1])
  return coerced ? coerced.version : match[1]
}

export type VersionRelation = 'equal' | 'outdated' | 'newer' | 'unknown'

function compareNumericParts(a: string, b: string): VersionRelation {
  const ap = a.split(/[.+-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : x))
  const bp = b.split(/[.+-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : x))
  const len = Math.max(ap.length, bp.length)
  for (let i = 0; i < len; i++) {
    const x = ap[i] ?? 0
    const y = bp[i] ?? 0
    if (typeof x === 'number' && typeof y === 'number') {
      if (x < y) return 'outdated'
      if (x > y) return 'newer'
    } else {
      const xs = String(x)
      const ys = String(y)
      if (xs < ys) return 'outdated'
      if (xs > ys) return 'newer'
    }
  }
  return 'equal'
}

export function compareVersions(
  installed: string | null | undefined,
  latest: string | null | undefined,
  scheme?: VersionScheme | null
): VersionRelation {
  // Missing latest → cannot compare (caller shows literal unknown)
  if (latest == null || latest === '') return 'unknown'
  if (installed == null || installed === '') return 'unknown'

  const kind = resolveScheme(scheme)
  const a = normalizeVersion(installed, kind)
  const b = normalizeVersion(latest, kind)
  if (!a || !b) return 'unknown'

  if (kind === 'marketing') {
    return a === b ? 'equal' : 'unknown'
  }

  if (kind === 'date' || kind === 'build' || kind === 'semver4') {
    return compareNumericParts(a, b)
  }

  const aCoerced = semver.coerce(a)
  const bCoerced = semver.coerce(b)
  if (!aCoerced || !bCoerced) {
    if (a === b) return 'equal'
    return compareNumericParts(a, b)
  }

  const cmp = semver.compare(aCoerced, bCoerced)
  if (cmp === 0) return 'equal'
  if (cmp < 0) return 'outdated'
  return 'newer'
}

/** Compare macOS version strings like "14.5" vs "12.0" */
export function isOsAtLeast(
  current: string | null,
  minimum: string | null | undefined
): boolean | null {
  if (!current || !minimum) return null
  const a = semver.coerce(current)
  const b = semver.coerce(minimum)
  if (!a || !b) return null
  return semver.gte(a, b)
}
