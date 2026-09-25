import type { UpdateStatus } from '../../shared/types'

/** Triage buckets — ordered by what a producer should look at first. */
export type TriageBucket = 'needs_update' | 'use_hub' | 'paid' | 'uncertain' | 'clear'

export type TriageFilter = 'all' | TriageBucket

export const TRIAGE_ORDER: TriageBucket[] = ['needs_update', 'use_hub', 'paid', 'uncertain', 'clear']

/** View-tab hover — what each view contains. */
export const TRIAGE_CHIP_TITLE: Record<TriageFilter, string> = {
  all: 'Every plugin found on this Mac.',
  needs_update: 'Plugins behind a newer version the catalog trusts (verified or likely).',
  use_hub: 'Plugins that update through a vendor hub app (Native Access, Waves Central, …).',
  paid: 'A paid next generation exists — not a free update.',
  uncertain:
    'No trusted latest version, or only a weak source. Check the vendor yourself; not an update alert.',
  clear: 'Up to date, bundled, content, or discontinued — nothing to do.',
}

const UPDATE_STATUSES: UpdateStatus[] = ['update_available', 'update_likely']
const UNCERTAIN_STATUSES: UpdateStatus[] = ['unverified', 'unknown']

export function productTriage(status: UpdateStatus): TriageBucket {
  if (UPDATE_STATUSES.includes(status)) return 'needs_update'
  if (status === 'use_vendor_hub') return 'use_hub'
  if (status === 'paid_upgrade') return 'paid'
  if (UNCERTAIN_STATUSES.includes(status)) return 'uncertain'
  return 'clear'
}
