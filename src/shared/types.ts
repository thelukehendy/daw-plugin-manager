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

/**
 * Catalog view of an installed app (DAW or helper). `check_in_app` = no trustworthy
 * comparison; `newer_major` = a newer major exists (DAWs: often a paid upgrade).
 */
export interface DawCatalogInfo {
  catalogPluginId: string | null
  latestVersion: string | null
  finalVersion?: string | null
  confidence: number | null
  status:
    | 'current'
    | 'update_available'
    | 'update_likely'
    | 'newer_major'
    | 'check_in_app'
    | 'not_tracked'
    | 'discontinued'
  /** True when compared without the catalog's installedVersionRule. */
  inferred?: boolean
  updateUrl: string | null
  portalApp: string | null
}

/** An application bundle found in /Applications (or ~/Applications). */
export interface InstalledApp {
  name: string
  version: string | null
  bundleId?: string
  path: string
}

export interface HelperAppInfo extends InstalledApp {
  catalog: DawCatalogInfo
}

export interface DawInfo {
  id: string
  name: string
  version: string | null
  path: string
  bundleId?: string
  detectedAt: string
  catalog?: DawCatalogInfo | null
}

/** Audio Unit component identity from a bundle's `AudioComponents` plist entry. */
export interface AuComponentKey {
  manufacturer: string
  subtype?: string
  type?: string
}

export interface InstalledPlugin {
  id: string
  name: string
  manufacturer: string
  version: string | null
  formats: PluginFormat[]
  paths: string[]
  bundleId?: string
  /** Every CFBundleIdentifier seen across formats (AU, VST3, AAX often differ). */
  bundleIds?: string[]
  auComponents?: AuComponentKey[]
  /** Vendor half of an AU component name ("FabFilter: Pro-Q 4" → "FabFilter"). */
  auVendor?: string
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
  /** 1 = household … 4 = long tail; omitted/null = unranked (never treat as tier 0). */
  popularityTier?: number | null
  /** Bundle-ID prefixes owned by this vendor, e.g. `com.fabfilter`. Omitted = unresearched. */
  bundleIdVendorPrefixes?: string[]
  /** 4-character AU manufacturer code, e.g. `FabF`. */
  auManufacturerCode?: string
}

/** Deterministic identifiers for a catalog row. All optional; omitted = unresearched. */
export interface CatalogIdentityKeys {
  bundleIds?: string[]
  bundleIdPrefixes?: string[]
  auComponents?: AuComponentKey[]
  vst3ClassIds?: string[]
  winProductNames?: string[]
}

export type InstalledVersionTransform =
  | 'strip-build-suffix'
  | 'prefix-year-2000'
  | 'semver-first-3'

/** How an installed app reports its version, and how to compare it with the catalog. */
export interface InstalledVersionRule {
  source?: 'CFBundleShortVersionString' | 'CFBundleVersion' | string
  transforms?: (InstalledVersionTransform | string)[]
  compareSegments?: number
}

export interface CatalogPlugin {
  id: string
  manufacturerId: string
  name: string
  matchPatterns: string[]
  /** Absent = no accepted version — UI must show "unknown", never invent. */
  latestVersion?: string
  /** Discontinued rows only: last release ever shipped. Never an update target. */
  finalVersion?: string
  discontinuedAt?: string
  identityKeys?: CatalogIdentityKeys
  installedVersionRule?: InstalledVersionRule
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
  /** Installed major versions this generation row covers, when not equal to `generation`. */
  versionMajors?: number[]
  generationRank?: number
  portalApp?: string
  /** 1 = household … 4 = long tail; omitted/null = unranked. */
  popularityTier?: number | null
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
  /** Installed v2 pointer buildId (ISO). Main-only; chrome uses it as freshness date. */
  catalogBuildId?: string
  manufacturers: CatalogManufacturer[]
  plugins: CatalogPlugin[]
}

/** How an installed product was tied to its catalog row, strongest first. */
export type MatchMethod =
  | 'bundle-id'
  | 'au-component'
  | 'bundle-prefix'
  | 'exact-name'
  | 'name-pattern'

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
  /** Discontinued products: last release shipped (informational only). */
  finalVersion?: string | null
  /** Catalog row this install resolved to; null when unmatched. */
  catalogPluginId?: string | null
  matchMethod?: MatchMethod | null
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
  /** Effective COALESCE(plugin, manufacturer) popularity; null = unranked. */
  popularityTier?: number | null
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
  /** Best (lowest) effective tier among products; null = all unranked. */
  popularityTier?: number | null
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
  /** Vendor helper apps (license managers, installers, hubs) with catalog verdicts. */
  helperApps?: HelperAppInfo[]
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
