import type { ConfidenceBand, IdentityKind, UpdateStatus } from '../../shared/types'

export const STATUS_LABEL: Record<UpdateStatus, string> = {
  current: 'Up to date',
  update_available: 'Update available',
  update_likely: 'Update likely available',
  unverified: 'Unverified version',
  unknown: 'Unknown',
  paid_upgrade: 'Paid upgrade',
  use_vendor_hub: 'Use vendor hub',
  content: 'Content',
  discontinued: 'Discontinued',
  bundled: 'Bundled',
  legacy: 'Legacy',
}

/** Dense list labels — still readable, not cryptic. */
export const STATUS_LABEL_COMPACT: Record<UpdateStatus, string> = {
  current: 'OK',
  update_available: 'Update Available',
  update_likely: 'Update likely available',
  unverified: 'Unverified',
  unknown: 'Unknown',
  paid_upgrade: 'Paid',
  use_vendor_hub: 'Hub',
  content: 'Content',
  discontinued: 'Gone',
  bundled: 'Bundled',
  legacy: 'Legacy',
}

/** Visible one-liners (detail pane + section context). Hover can add more “why.” */
export const STATUS_HINT: Record<UpdateStatus, string> = {
  current: 'What you have matches or beats the catalog’s trusted latest.',
  update_available:
    'A newer version is published from a trusted source — open the vendor portal to update.',
  update_likely:
    'The catalog thinks a newer build exists, but we’re only fairly sure — check the portal.',
  unverified:
    'We have a version number from a weak source. That is not the same as “update available.”',
  unknown:
    'No trustworthy latest version is on file. Yellow here never means an update is waiting.',
  paid_upgrade: 'A paid next-generation product exists — not a free in-place update.',
  use_vendor_hub: 'This vendor ships updates through their hub / account app, not a one-off installer.',
  content: 'Library, expansion, or pack — not a version-tracked plugin installer.',
  discontinued: 'The vendor discontinued this product.',
  bundled: 'Ships with the OS or your DAW.',
  legacy: 'An older major is still on disk beside a newer generation.',
}

/** Hover “why this row” — producer language, no engineer jargon. */
export function statusHover(
  status: UpdateStatus,
  opts?: { catalogOnly?: boolean; portalApp?: string | null }
): string {
  if (opts?.catalogOnly && status === 'current') {
    return 'In the catalog only — we didn’t compare an install on this Mac.'
  }
  switch (status) {
    case 'update_available':
      return 'Update Available — installed is behind a trusted newer version (score 85+). Open the portal to get it.'
    case 'update_likely':
      return 'Update likely — installed looks behind, but confidence is only amber (70–84). Confirm on the vendor site.'
    case 'current':
      return 'OK — installed meets or exceeds the catalog latest we trust for this plugin.'
    case 'unknown':
      return 'Unknown — no trustworthy latest on file. Not an update alert.'
    case 'unverified':
      return 'Unverified — a weak or crowdsourced number only. Not “update available.”'
    case 'paid_upgrade':
      return 'Paid upgrade — next generation for sale; your current install isn’t “outdated” for free.'
    case 'use_vendor_hub':
      return opts?.portalApp
        ? `Use ${opts.portalApp} — open that app (or its portal) to check updates for this vendor.`
        : 'Use vendor hub — updates go through the manufacturer’s manager app.'
    case 'content':
      return 'Content — not a plug-in with its own installer version.'
    case 'discontinued':
      return 'Discontinued — vendor no longer ships this product.'
    case 'bundled':
      return 'Bundled — comes with macOS or your DAW; update with the host.'
    case 'legacy':
      return 'Legacy — older major still installed; usually safe to ignore if the new one is present.'
    default:
      return STATUS_HINT[status]
  }
}

export function displayVersion(version: string | null | undefined): string {
  if (version == null || version === '') return 'unknown'
  return version
}

/** Primary UI word for confidence — never lead with 0–100. */
export type ConfidenceDisplayWord = 'Verified' | 'Likely' | 'Unknown'

const NON_VERSION_KINDS = new Set<string>([
  'soundset',
  'expansion',
  'bundle',
  'suite_component',
  'hardware',
  'eurorack',
  'hub_app',
  'instrument',
  'effect',
  'discontinued',
  'gen_ambiguous',
  'daw_stock_effect',
  'standalone_app',
  'unknown_other',
])

export function confidenceDisplayWord(opts: {
  confidence: number
  band?: ConfidenceBand
  latestVersion?: string | null
  identityKind?: IdentityKind
  status?: UpdateStatus
}): ConfidenceDisplayWord {
  const { confidence, band, latestVersion, identityKind, status } = opts
  if (status === 'content' || status === 'discontinued') return 'Unknown'
  if (identityKind && NON_VERSION_KINDS.has(identityKind)) return 'Unknown'
  // Only gate on missing latest when the caller provided the field (plugin rows).
  if (latestVersion !== undefined && (latestVersion == null || latestVersion === '')) {
    return 'Unknown'
  }
  if (confidence >= 85 || band === 'high') return 'Verified'
  if (confidence >= 70 || band === 'medium') return 'Likely'
  return 'Unknown'
}

/** @deprecated Prefer confidenceDisplayWord — kept for any legacy band-only call sites. */
export function confidenceLabel(band: ConfidenceBand): string {
  if (band === 'high') return 'Verified'
  if (band === 'medium') return 'Likely'
  return 'Unknown'
}

/** Hosts that must never appear in UI / tooltips (catalog distribution or non-vendor registries). */
const BLOCKED_VERIFY_HOST =
  /(?:^|\.)(?:githubusercontent\.com|jsdelivr\.net|github\.com|open-audio-stack\.github\.io|kvraudio\.com)$/i

/**
 * Keep only a manufacturer (or similar) page the producer can open to double-check.
 * Drops catalog CDN / GitHub / OAS registry URLs.
 */
export function vendorVerifyUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null
  try {
    const u = new URL(trimmed)
    if (BLOCKED_VERIFY_HOST.test(u.hostname)) return null
    if (/catalog-store|muse/i.test(trimmed)) return null
    return trimmed
  } catch {
    return null
  }
}

/** Drop URLs / file paths / catalog provenance from user-visible reason text. */
export function scrubVisibleText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(?:raw\.githubusercontent|jsdelivr\.net|github\.com\/[^\s)]+)\S*/gi, '')
    .replace(/\b(?:source|from|synced from)\s*:\s*\S+/gi, '')
    .replace(/\b(?:file|path)\s*:\s*\S+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Turn catalog reason codes / research notes into short producer sentences. */
export function humanizeConfidenceReason(raw: string): string {
  const t = scrubVisibleText(raw)
  if (!t) return ''
  const lower = t.toLowerCase()

  if (/oas-registry|open-audio-stack|manufacturer package version/i.test(t)) {
    return 'Listed in the manufacturer’s published package registry.'
  }
  if (/installer-filename on official manufacturer domain/i.test(t)) {
    return 'Read from an installer name on the manufacturer’s own site.'
  }
  if (/page-confirmed manufacturer releaseNotesPage/i.test(t)) {
    return 'Confirmed on the manufacturer’s release notes page.'
  }
  if (/page-confirmed manufacturer downloadsPage/i.test(t)) {
    return 'Confirmed on the manufacturer’s downloads page.'
  }
  if (/page-confirmed manufacturer productPage/i.test(t)) {
    return 'Confirmed on the manufacturer’s product page.'
  }
  if (/waves\.com latest offline installer|all waves plugins v\d+/i.test(t)) {
    return 'Matches Waves’ published current plugin train on their downloads page.'
  }
  if (/kvr-product-page|kvr product page|kvr audio|kvr-only|crowdsourced/i.test(lower)) {
    return 'Only listed on KVR Audio (crowdsourced) — treat cautiously.'
  }
  if (/github-release-tag|github tag/i.test(lower)) {
    return 'Taken from a public GitHub release tag.'
  }
  if (/suite-monorepo|shared kernel version|all plugins share kernel/i.test(lower)) {
    return 'This suite shares one kernel version across its plugins.'
  }
  if (/uad version history|uad dsp software train|help\.uaudio/i.test(lower)) {
    return 'Tied to Universal Audio’s published DSP / UAD software train.'
  }
  if (/daw-bundled-version|host daw public release/i.test(lower)) {
    return 'Bundled with a DAW — version follows the host’s public release.'
  }
  if (/arturia\.com|downloads-manuals/i.test(lower)) {
    return 'From Arturia’s public downloads / manuals listing.'
  }
  if (/spitfire|help centre changelog/i.test(lower)) {
    return 'From Spitfire’s official changelog / help centre.'
  }
  if (/eventide official downloads/i.test(lower)) {
    return 'From Eventide’s official downloads page.'
  }
  if (/melda downloads page/i.test(lower)) {
    return 'Melda publishes one shared version for these plugins.'
  }
  if (/ujam public standalone installers/i.test(lower)) {
    return 'Listed on UJAM’s public standalone installers page.'
  }
  if (/voxengo\.com primary|pspaudioware\.com primary/i.test(lower)) {
    return 'Taken from the manufacturer’s own product site.'
  }
  if (/public manufacturer product page|official.*product page/i.test(lower)) {
    return 'From the manufacturer’s public product page.'
  }
  if (/confidence raise|manufacturer corroboration|live html content hash/i.test(lower)) {
    return 'Cross-checked against another manufacturer-published source.'
  }
  if (/replaces stale kvr/i.test(lower)) {
    return 'Replaced an older crowdsourced listing with a better source.'
  }
  if (/universe-expansion|coordinator-verified|surge universe/i.test(lower)) {
    return 'Verified during a catalog research pass against public sources.'
  }
  if (/not a version-tracked plugin/i.test(lower)) {
    return 'Not a version-tracked plug-in (content, hub, or similar).'
  }
  if (/no accepted latestversion|no catalog match|no products/i.test(lower)) {
    return 'No trustworthy latest version is on file.'
  }
  if (/bundled with macos|bundled with macOS \/ DAW/i.test(t)) {
    return 'Bundled with macOS or your DAW.'
  }
  if (/lower-bound across manufacturer/i.test(lower)) {
    return 'Lowest confidence among this vendor’s plugins in view.'
  }
  if (/asc not required|account-gated/i.test(lower)) {
    return 'Public download listing (account portal may still be needed to install).'
  }

  // Soft cleanup for leftover research shorthand
  let out = t
    .replace(/\bverwin\b/gi, 'Windows version field')
    .replace(/\b(?:re-verified|fetched)\s+\d{4}-\d{2}-\d{2}[:)]*/gi, '')
    .replace(/\(\s*\+?\d+\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (out.length > 140) out = `${out.slice(0, 137)}…`
  return out
}

function meaningSentence(word: ConfidenceDisplayWord): string {
  if (word === 'Verified') {
    return 'Verified — we’re confident this is the real latest from a trusted source.'
  }
  if (word === 'Likely') {
    return 'Likely — probably right, but not rock-solid yet.'
  }
  return 'Unknown — we don’t have a trustworthy latest for this plug-in (not an update alert).'
}

function bandFallbackWhy(word: ConfidenceDisplayWord, confidence: number): string {
  if (word === 'Verified' || confidence >= 85) {
    return 'Score is 85 or higher from a verified manufacturer-style source.'
  }
  if (word === 'Likely' || confidence >= 70) {
    return 'Score is in the 70–84 range — good signal, not fully locked.'
  }
  if (confidence > 0) {
    return 'Score is under 70 — often a weak or KVR-only listing.'
  }
  return 'No accepted latest version is on file, so we can’t rate it.'
}

/**
 * Confidence hover: meaning → why this plugin → score → optional vendor page.
 * Write for a producer with no catalog context.
 */
export function confidenceTooltip(opts: {
  word: ConfidenceDisplayWord
  confidence: number
  band: ConfidenceBand
  reasons?: string[]
  versionSourceUrl?: string | null
}): string {
  const lines: string[] = [meaningSentence(opts.word)]

  const why = (opts.reasons || [])
    .map(humanizeConfidenceReason)
    .filter(Boolean)
    // de-dupe while preserving order
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .slice(0, 3)

  if (why.length) {
    lines.push(why.join(' '))
  } else {
    lines.push(bandFallbackWhy(opts.word, opts.confidence))
  }

  lines.push(`Score ${Math.round(opts.confidence)} of 100.`)

  const verify = vendorVerifyUrl(opts.versionSourceUrl)
  if (verify) {
    lines.push(`You can check: ${verify}`)
  }

  return lines.join('\n')
}

export function formatsHover(formats: string[]): string {
  if (!formats.length) {
    return 'No plugin formats detected for this install (AU / VST3 / VST, etc.).'
  }
  const set = new Set(formats.map((f) => f.toUpperCase()))
  const bits: string[] = []
  if (set.has('AU') || set.has('COMPONENT')) {
    bits.push('AU — Audio Units (Logic, GarageBand, and many Mac hosts)')
  }
  if (set.has('VST3')) bits.push('VST3 — modern Steinberg format (most current DAWs)')
  if (set.has('VST') || set.has('VST2')) {
    bits.push('VST — older Steinberg format (still used by some hosts)')
  }
  if (set.has('AAX')) bits.push('AAX — Pro Tools')
  if (set.has('CLAP')) bits.push('CLAP — newer open plugin standard')
  if (!bits.length) {
    return `Formats on disk: ${formats.join(', ')}.`
  }
  return bits.join('\n')
}

export function versionsColumnHover(): string {
  return 'Installed version on this Mac → latest the catalog trusts. “unknown” means we have no accepted latest — never a guessed number.'
}

export function portalHover(opts: {
  portalApp?: string | null
  kind: 'hub' | 'portal' | 'row'
}): string {
  if (opts.portalApp) {
    return `Opens the ${opts.portalApp} site or download portal in your browser. This app never downloads or installs for you.`
  }
  if (opts.kind === 'hub') {
    return 'Opens the vendor’s hub / account portal in your browser. Updates happen there — not inside this app.'
  }
  return 'Opens the manufacturer’s update / download page in your browser. Nothing is downloaded automatically.'
}

export function identityLabel(kind: IdentityKind): string {
  const map: Record<string, string> = {
    plugin: 'Plugin',
    soundset: 'Soundset',
    expansion: 'Expansion',
    bundle: 'Bundle',
    suite_component: 'Suite component',
    hub_app: 'Hub app',
    hardware: 'Hardware',
    eurorack: 'Eurorack',
    discontinued: 'Discontinued',
    gen_ambiguous: 'Generation unclear',
    daw_stock_effect: 'DAW stock',
    instrument: 'Instrument',
    effect: 'Effect',
    standalone_app: 'Standalone',
    unknown_other: 'Other',
  }
  return map[kind] || kind
}

export function statusLabel(status: UpdateStatus, catalogOnly?: boolean, compact?: boolean): string {
  if (catalogOnly && status === 'current') return compact ? 'Catalog' : 'In catalog'
  return compact ? STATUS_LABEL_COMPACT[status] : STATUS_LABEL[status]
}

export function formatCheckedAt(iso: string | null | undefined): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
