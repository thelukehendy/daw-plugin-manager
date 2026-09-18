/** Shared types for DAW Plugin Manager — discovery only, never mutates the filesystem. */

export type PluginFormat = 'AAX' | 'AU' | 'VST' | 'VST3' | 'UAD' | 'CLAP' | 'Unknown'

/**
 * Display / compare status for a row.
 * Yellow confidence never implies "update available" — use update_likely / unverified instead.
 */
export type UpdateStatus =
  | 'current'
  | 'update_available'
  | 'update_likely'
  | 'unverified'
  | 'unknown'
  | 'paid_upgrade'
  | 'use_vendor_hub'
  | 'content'
  | 'discontinued'
  | 'bundled'
  | 'legacy'

/** @deprecated Prefer UpdateStatus; kept for older report consumers */
export type LegacyUpdateStatus = 'outdated' | UpdateStatus

export type ConfidenceBand = 'high' | 'medium' | 'low'

export type CompatSeverity = 'info' | 'warn' | 'block'

export type IdentityKind =
  | 'plugin'
  | 'soundset'
  | 'expansion'
  | 'bundle'
  | 'suite_component'
  | 'hub_app'
  | 'hardware'
  | 'eurorack'
  | 'discontinued'
  | 'gen_ambiguous'
  | 'daw_stock_effect'
  | 'instrument'
  | 'effect'
  | 'standalone_app'
  | 'unknown_other'
  | string

export type VersionScheme =
  | 'semver'
  | 'semver4'
  | 'date'
  | 'build'
  | 'marketing'
  | string

export type AppleSilicon = 'native' | 'universal' | 'rosetta' | 'intel-only' | 'mixed'

export interface DawInfo {
  id: string
  name: string
  version: string | null
  path: string
  bundleId?: string
  detectedAt: string
}

export interface InstalledPlugin {
  id: string
  name: string
  manufacturer: string
  version: string | null
  formats: PluginFormat[]
  paths: string[]
  bundleId?: string
  manufacturerHint?: string
  modifiedAt?: string
}

export interface InstalledVersionInfo {
  version: string | null
  name: string
  formats: PluginFormat[]
  paths: string[]
  modifiedAt?: string
  /** True when this install is an older major line still on disk (e.g. Kontakt 6 beside Kontakt 8). */
  legacy?: boolean
}

export interface DawCompatibilityIssue {
  dawId?: string
  dawNamePattern: string
  severity: CompatSeverity
  note: string
  verified: boolean
  sourceUrl?: string
  verifiedAt?: string
  minDawVersion?: string
  maxDawVersion?: string
  pluginVersionFrom?: string
  pluginVersionTo?: string
}

export interface CatalogManufacturer {
  id: string
  name: string
  updatePortalUrl: string
  websiteUrl?: string
  aliases?: string[]
  notes?: string
  /** Vendor hub app name, e.g. Native Access, Waves Central */
  portalApp?: string
  appleSilicon?: AppleSilicon
  versionScheme?: VersionScheme
  versionExample?: string
  changelogUrl?: string
}

export interface CatalogPlugin {
  id: string
  manufacturerId: string
  name: string
  matchPatterns: string[]
  /** Absent = no accepted version — UI must show "unknown", never invent. */
  latestVersion?: string
  releaseDate?: string
  updatePortalUrl?: string
  formats?: PluginFormat[]
  minMacOS?: string
  dawCompatibility?: string
  notes?: string
  notesForUser?: string
  bundled?: boolean
  productLine?: string
  dawIssues?: DawCompatibilityIssue[]
  versionEvidence?: VersionEvidence
  versionSourceUrl?: string
  versionVerifiedAt?: string
  /** Catalog Policy-A confidence 0–100 — prefer over recomputing from evidence. */
  versionConfidence?: number
  versionConfidenceReasons?: string[]
  identityKind?: IdentityKind
  discontinued?: boolean
  requiresIlok?: boolean
  isFreeware?: boolean
  appleSilicon?: AppleSilicon
  successorPluginId?: string
  predecessorPluginId?: string
  updateClass?: string
  generation?: string | number
  generationRank?: number
  portalApp?: string
}

export type VersionEvidence =
  | 'page-confirmed'
  | 'agent-verified'
  | 'live-scrape'
  | 'public-page'
  | 'search-verified'
  | 'manufacturer-feed'
  | 'curated-seed'
  | 'unverified-seed'
  | string

export interface PluginCatalog {
  schemaVersion: number
  updatedAt: string
  catalogSource?: string
  manufacturers: CatalogManufacturer[]
  plugins: CatalogPlugin[]
}

export interface CompatibilityFlag {
  severity: CompatSeverity
  dawName: string
  dawVersion: string | null
  note: string
}

export interface PluginReportRow {
  id: string
  name: string
  manufacturer: string
  manufacturerId: string | null
  productLine: string
  installedVersion: string | null
  installedVersions: string[]
  versionDetails: InstalledVersionInfo[]
  /** Null or absent → UI shows literal "unknown" */
  latestVersion: string | null
  releaseDate: string | null
  status: UpdateStatus
  confidence: number
  confidenceBand: ConfidenceBand
  confidenceReason: string
  confidenceReasons: string[]
  versionSourceUrl: string | null
  versionVerifiedAt: string | null
  identityKind: IdentityKind
  portalApp: string | null
  updateUrl: string | null
  successorPluginId: string | null
  successorName: string | null
  updateClass: string | null
  notesForUser: string | null
  appleSilicon: AppleSilicon | null
  requiresIlok: boolean
  isFreeware: boolean
  formats: PluginFormat[]
  dawCompatibility: string | null
  minMacOS: string | null
  osCompatible: boolean | null
  compatibilityFlags: CompatibilityFlag[]
  paths: string[]
  catalogMatched: boolean
  installCount: number
  /** True when this row comes from catalog browse (no local install). */
  catalogOnly?: boolean
}

export interface ManufacturerReportGroup {
  id: string
  manufacturer: string
  manufacturerId: string | null
  updateUrl: string | null
  portalApp: string | null
  productCount: number
  bundleCount: number
  outdatedCount: number
  unknownCount: number
  currentCount: number
  bundledCount: number
  hasCompatWarning: boolean
  confidence: number
  confidenceBand: ConfidenceBand
  products: PluginReportRow[]
}

export interface SystemInfo {
  platform: string
  osVersion: string | null
  arch: string
  homedir: string
  scannedAt: string
}

export interface ScanReport {
  system: SystemInfo
  daws: DawInfo[]
  plugins: InstalledPlugin[]
  rows: PluginReportRow[]
  manufacturers: ManufacturerReportGroup[]
  catalog: {
    updatedAt: string
    source: string
    pluginCount: number
    manufacturerCount: number
  }
  summary: ScanSummary
}

export interface ScanSummary {
  dawCount: number
  pluginBundleCount: number
  pluginCount: number
  manufacturerCount: number
  current: number
  outdated: number
  unknown: number
  bundled: number
  legacy: number
  compatWarnings: number
  updateAvailable?: number
  paidUpgrade?: number
  content?: number
  discontinued?: number
  useVendorHub?: number
}

/** Lightweight catalog browse payload (no filesystem scan). */
export interface CatalogBrowseReport {
  mode: 'catalog'
  rows: PluginReportRow[]
  manufacturers: ManufacturerReportGroup[]
  catalog: {
    updatedAt: string
    source: string
    pluginCount: number
    manufacturerCount: number
  }
  summary: {
    pluginCount: number
    manufacturerCount: number
    withVersion: number
    unknownVersion: number
    green: number
    amber: number
    yellow: number
    content: number
    discontinued: number
    hub: number
  }
}

export type SortKey =
  | 'name'
  | 'manufacturer'
  | 'installedVersion'
  | 'latestVersion'
  | 'releaseDate'
  | 'status'
  | 'formats'
  | 'dawCompatibility'
  | 'installCount'

export interface ScanProgress {
  phase: 'daws' | 'plugins' | 'catalog' | 'compare' | 'done' | 'error'
  message: string
  percent: number
  /** Progressive payloads so the UI can paint before the full report returns. */
  partial?: {
    daws?: DawInfo[]
    manufacturers?: ManufacturerReportGroup[]
  }
}
