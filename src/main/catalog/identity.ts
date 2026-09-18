/**
 * identityKind contract (DATA-DICTIONARY / database-organization):
 * Only `plugin` (or omitted → plugin) is version-tracked.
 * Everything else is content/hub/hardware/etc. — never "unknown version".
 */

import type { CatalogPlugin, IdentityKind } from '../../shared/types'

/** Non-plugin kinds that must not chase semver / show unknown version. */
export const NON_VERSION_KINDS = new Set<string>([
  'soundset',
  'expansion',
  'bundle',
  'suite_component',
  'hub_app',
  'hardware',
  'eurorack',
  'instrument',
  'effect',
  'discontinued',
  'gen_ambiguous',
  'daw_stock_effect',
  'standalone_app',
  'unknown_other',
])

export function resolveIdentityKind(plugin: CatalogPlugin | null | undefined): IdentityKind {
  if (!plugin) return 'plugin'
  if (plugin.discontinued === true || plugin.identityKind === 'discontinued') {
    return 'discontinued'
  }
  // Omitted identityKind ⇒ plugin (dictionary contract)
  if (plugin.identityKind == null || plugin.identityKind === '') return 'plugin'
  return plugin.identityKind
}

/** True only for real version-tracked plugins. */
export function isVersionTrackedKind(kind: IdentityKind | null | undefined): boolean {
  if (kind == null || kind === '' || kind === 'plugin') return true
  return false
}

export function isContentLikeKind(kind: IdentityKind | null | undefined): boolean {
  if (!kind || kind === 'plugin') return false
  if (kind === 'discontinued') return false
  if (kind === 'hub_app') return false
  return NON_VERSION_KINDS.has(kind) || kind === 'gen_ambiguous'
}
