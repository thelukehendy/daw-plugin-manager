/** Shared types for DAW Plugin Manager — discovery only, never mutates the filesystem. */

export type PluginFormat = 'AAX' | 'AU' | 'VST' | 'VST3' | 'UAD' | 'CLAP' | 'Unknown'

/** Report statuses shown to users. Installed ≥ catalog is always "current". */
export type UpdateStatus = 'current' | 'outdated' | 'unknown' | 'bundled' | 'legacy'

export type CompatSeverity = 'info' | 'warn' | 'block'

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
  /** Plugin version range / note about DAW conflict */
  dawId?: string
  dawNamePattern: string
  /** Only `warn` / `block` are shown. `info` is ignored (not a confirmed issue). */
  severity: CompatSeverity
  note: string
  /**
   * Must be true for the issue to surface. Unverified / advisory notes never alert.
   * Refresh weekly via catalog pipeline with a public source URL.
   */
  verified: boolean
  /** Public advisory / release-note URL proving the issue */
  sourceUrl?: string
  /** ISO date the issue was last confirmed */
  verifiedAt?: string
  /** If set, issue applies when installed DAW version is below this */
  minDawVersion?: string
  /** If set, issue applies when installed DAW version is above this */
  maxDawVersion?: string
  /** Plugin versions at/above which the issue was introduced */
  pluginVersionFrom?: string
  /** Plugin versions below which the issue no longer applies */
  pluginVersionTo?: string
}

export interface CatalogManufacturer {
  id: string
  name: string
  /** Direct manufacturer downloads / account / updater page */
  updatePortalUrl: string
  websiteUrl?: string
  aliases?: string[]
  notes?: string
}

export interface CatalogPlugin {
  id: string
  manufacturerId: string
  name: string
  matchPatterns: string[]
  latestVersion: string
  releaseDate?: string
  updatePortalUrl?: string
  formats?: PluginFormat[]
  minMacOS?: string
  dawCompatibility?: string
  notes?: string
  bundled?: boolean
  /** Product line key for multi-generation products (Kontakt, Guitar Rig, …) */
  productLine?: string
  /** Known conflicts between this plugin’s newer builds and specific DAWs */
  dawIssues?: DawCompatibilityIssue[]
  /**
   * How the latestVersion was obtained.
   * agent-verified = Gemini Antigravity (or equivalent) found + page-confirmed the version — highest trust;
   * live-scrape = dedicated manufacturer scraper hit a public page (provisional until agent-verified);
   * public-page = sticky/known public download page re-verify;
   * search-verified = weekly discovery found a manufacturer-domain page via free search, then fetched + parsed it;
   * manufacturer-feed = official API/feed; curated-seed = hand-verified once; unverified-seed = unknown provenance.
   */
  versionEvidence?: VersionEvidence
  /** Public page used to verify latestVersion (never an installer binary URL). */
  versionSourceUrl?: string
  /** ISO date (YYYY-MM-DD) when latestVersion was last confirmed. */
  versionVerifiedAt?: string
}

export type VersionEvidence =
  | 'agent-verified'
  | 'live-scrape'
  | 'public-page'
  | 'search-verified'
  | 'manufacturer-feed'
  | 'curated-seed'
  | 'unverified-seed'

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
  /** Product line used for hierarchy (often same as name). */
  productLine: string
  installedVersion: string | null
  installedVersions: string[]
  versionDetails: InstalledVersionInfo[]
  latestVersion: string | null
  releaseDate: string | null
  status: UpdateStatus
  /**
   * 0–100 confidence that status + latestVersion are correct.
   * Outdated always uses red styling; current/bundled use green when high, yellow when medium.
   */
  confidence: number
  /** high ≥85 (green OK), medium 70–84 (yellow OK), low <70 (yellow OK — improve catalog). */
  confidenceBand: 'high' | 'medium' | 'low'
  confidenceReason: string
  formats: PluginFormat[]
  updateUrl: string | null
  dawCompatibility: string | null
  minMacOS: string | null
  osCompatible: boolean | null
  compatibilityFlags: CompatibilityFlag[]
  paths: string[]
  catalogMatched: boolean
  installCount: number
}

export interface ManufacturerReportGroup {
  id: string
  manufacturer: string
  updateUrl: string | null
  productCount: number
  bundleCount: number
  outdatedCount: number
  unknownCount: number
  currentCount: number
  bundledCount: number
  hasCompatWarning: boolean
  /** Weakest confidence among child products (drives manufacturer badge tone). */
  confidence: number
  confidenceBand: 'high' | 'medium' | 'low'
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
  summary: {
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
}
