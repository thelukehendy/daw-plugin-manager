import semver from 'semver'

/** Normalize plugin versions for comparison (strips build suffixes, letters). */
export function normalizeVersion(input: string | null | undefined): string | null {
  if (!input) return null
  let v = input.trim()
  v = v.replace(/^v/i, '')
  v = v.replace(/\.f\d+$/i, '')
  v = v.replace(/\s*\(.*\)$/, '')
  v = v.replace(/_/g, '.')
  // Take first semver-ish token
  const match = v.match(/(\d+(?:\.\d+){0,3})/)
  if (!match) return null
  const coerced = semver.coerce(match[1])
  return coerced ? coerced.version : match[1]
}

export type VersionRelation = 'equal' | 'outdated' | 'newer' | 'unknown'

export function compareVersions(
  installed: string | null | undefined,
  latest: string | null | undefined
): VersionRelation {
  const a = normalizeVersion(installed)
  const b = normalizeVersion(latest)
  if (!a || !b) return 'unknown'

  const aCoerced = semver.coerce(a)
  const bCoerced = semver.coerce(b)
  if (!aCoerced || !bCoerced) {
    if (a === b) return 'equal'
    return 'unknown'
  }

  const cmp = semver.compare(aCoerced, bCoerced)
  if (cmp === 0) return 'equal'
  if (cmp < 0) return 'outdated'
  return 'newer'
}

/** Compare macOS version strings like "14.5" vs "12.0" */
export function isOsAtLeast(current: string | null, minimum: string | null | undefined): boolean | null {
  if (!current || !minimum) return null
  const a = semver.coerce(current)
  const b = semver.coerce(minimum)
  if (!a || !b) return null
  return semver.gte(a, b)
}
