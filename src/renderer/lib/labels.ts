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

export function confidenceLabel(band: ConfidenceBand): string {
  if (band === 'high') return 'Verified'
  if (band === 'medium') return 'Likely'
  return 'Weak'
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

export function statusLabel(status: UpdateStatus, catalogOnly?: boolean): string {
  if (catalogOnly && status === 'current') return 'In catalog'
  return STATUS_LABEL[status]
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
