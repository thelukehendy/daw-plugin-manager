import type { ConfidenceBand, IdentityKind, UpdateStatus } from '../../shared/types'

export const STATUS_LABEL: Record<UpdateStatus, string> = {
  current: 'Up to date',
  update_available: 'Update available',
  update_likely: 'Update likely',
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
  update_available: 'Update',
  update_likely: 'Likely',
  unverified: 'Unverified',
  unknown: 'Unknown',
  paid_upgrade: 'Paid',
  use_vendor_hub: 'Hub',
  content: 'Content',
  discontinued: 'Gone',
  bundled: 'Bundled',
  legacy: 'Legacy',
}

export const STATUS_HINT: Record<UpdateStatus, string> = {
  current: 'Installed meets or exceeds the catalog latest.',
  update_available: 'A newer verified version is published.',
  update_likely: 'Catalog suggests a newer build — confidence is amber.',
  unverified:
    'Catalog has a version with low confidence. This is not an “update available” signal.',
  unknown: 'No accepted latestVersion in the catalog (shown as unknown — never guessed).',
  paid_upgrade: 'A paid next-generation product exists — not a free update.',
  use_vendor_hub: 'Updates are managed through the vendor’s hub / account app.',
  content: 'Not a version-tracked plugin (library, expansion, bundle, hardware, …).',
  discontinued: 'Vendor discontinued this product.',
  bundled: 'Ships with the OS or DAW.',
  legacy: 'Older major still installed beside a newer generation.',
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

export function confidenceTooltip(opts: {
  word: ConfidenceDisplayWord
  confidence: number
  band: ConfidenceBand
  reasons?: string[]
  sourceUrl?: string | null
}): string {
  const bandLabel =
    opts.band === 'high' ? '≥85 verified' : opts.band === 'medium' ? '70–84 likely' : '<70 weak'
  const lines = [
    `${opts.word} · ${opts.confidence}% · ${bandLabel}`,
    ...(opts.reasons?.filter(Boolean) ?? []),
  ]
  if (opts.sourceUrl) lines.push(opts.sourceUrl)
  return lines.join('\n')
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
