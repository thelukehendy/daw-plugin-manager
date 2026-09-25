import type { AuComponentKey, InstalledPlugin, PluginFormat } from '../../shared/types'
import { PLUGIN_EXTENSIONS, SKIP_DIR_NAMES, getPluginRoots } from './paths'
import { baseName, extName, joinPath, platform } from '../platform'
import { canonicalizeManufacturer, productFamilyName } from './grouping'
import { normalizeVersion } from '../catalog/versionCompare'

const BUNDLE_EXTS = new Set(Object.keys(PLUGIN_EXTENSIONS))

/** Normalize vendor slug from bundle identifiers into a display-ish key */
const BUNDLE_VENDOR_MAP: Record<string, string> = {
  'plugin-alliance': 'Plugin Alliance',
  pluginalliance: 'Plugin Alliance',
  PluginAlliance: 'Plugin Alliance',
  'Plugin Alliance': 'Plugin Alliance',
  izotope: 'iZotope',
  AVID: 'Avid',
  avid: 'Avid',
  digidesign: 'Avid',
  SSL: 'Solid State Logic',
  ssl: 'Solid State Logic',
  WavesAudio: 'Waves',
  wavesaudio: 'Waves',
  waves: 'Waves',
  wizoo: 'AIR Music Technology',
  Antares: 'Antares',
  antares: 'Antares',
  UnfilteredAudio: 'Unfiltered Audio',
  fabfilter: 'FabFilter',
  FabF: 'FabFilter',
  unitedplugins: 'United Plugins',
  lindellplugins: 'Lindell Audio',
  ValhallaDSP: 'Valhalla DSP',
  valhalladsp: 'Valhalla DSP',
  TokyoDawnLabs: 'Tokyo Dawn Labs',
  klanghelm: 'Klanghelm',
  spectrasonics: 'Spectrasonics',
  sonnox: 'Sonnox',
  bettermaker: 'Bettermaker',
  klevgrand: 'Klevgrand',
  xlnaudio: 'XLN Audio',
  audiomovers: 'Audiomovers',
  ADPTR: 'ADPTR Audio',
  adptr: 'ADPTR Audio',
  adptraudio: 'ADPTR Audio',
  soundtoys: 'Soundtoys',
  'slate digital': 'Slate Digital',
  eventide: 'Eventide',
  softube: 'Softube',
  'universal audio': 'Universal Audio',
  uaudio: 'Universal Audio',
  nativeinstruments: 'Native Instruments',
  'native-instruments': 'Native Instruments',
  melda: 'MeldaProduction',
  meldaproduction: 'MeldaProduction',
  kilohearts: 'Kilohearts',
  d16: 'D16 Group',
  'd16 group': 'D16 Group',
  eiosis: 'Eiosis',
  harrison: 'Harrison',
  newfangled: 'Newfangled Audio',
  'sir audio tools': 'SIR Audio Tools',
  bbe: 'BBE Sound',
  'bbe sound': 'BBE Sound',
  wavesfactory: 'Wavesfactory',
  Wavesfactory: 'Wavesfactory',
  fb: 'Focusrite',
  se: 'Steinberg',
  steinberg: 'Steinberg',
  // NOTE: do not map bare "de" / "eu" / "ch" — those are country-code bundle prefixes
  brainworx: 'Plugin Alliance',
  Brainworx: 'Plugin Alliance',
  ch: 'Celera',
  acon: 'Acon Digital',
  acondigital: 'Acon Digital',
  'acon digital': 'Acon Digital',
  accusonus: 'Accusonus',
  goodhertz: 'Goodhertz',
  audiounit: 'Goodhertz',
  'applied-acoustics': 'Applied Acoustics Systems',
  apple: 'Apple',
  ikmultimedia: 'IK Multimedia',
  celemony: 'Celemony',
  oeksound: 'oeksound',
  sonarworks: 'Sonarworks',
  spitfireaudio: 'Spitfire Audio',
  liquidsonics: 'LiquidSonics',
  cableguys: 'Cableguys',
  Cableguys: 'Cableguys',
  accentize: 'Accentize',
  hornet: 'HoRNet',
  tbproaudio: 'TBProAudio',
  blacksaltaudio: 'Black Salt Audio',
  aberrantdsp: 'Aberrant DSP',
  stevenslate: 'Steven Slate Audio',
  overloud: 'Overloud',
  eastwest: 'EastWest',
  nugenaudio: 'Nugen Audio',
  mhlabs: 'Metric Halo',
  audiomodern: 'Audio Modern',
  waproduction: 'WA Production',
  uvisoundsource: 'UVI',
  kazrog: 'Kazrog',
  kiive: 'Kiive Audio',
  bertom: 'Bertom Audio',
  supertone: 'Supertone',
  mixland: 'Mixland',
  fiedleraudio: 'Fiedler Audio',
  'fiedler-audio': 'Fiedler Audio',
  sonicacademy: 'Sonic Academy',
  modalics: 'Modalics',
  splice: 'Splice',
  thxltd: 'THX',
  mpegh: 'Fraunhofer',
  synthogy: 'Synthogy',
  soundspot: 'Soundspot',
  spl: 'SPL',
  unfilteredaudio: 'Unfiltered Audio',
  credland: 'Credland Audio',
  cymatics: 'Cymatics',
  linplug: 'LinPlug',
  scuffhamamps: 'Scuffham Amps',
  tekitaudio: "Tek'it Audio",
  myCompany: 'Kiive Audio',
  mycompany: 'Kiive Audio',
  'universal-audio': 'Universal Audio',
  universalaudio: 'Universal Audio',
}

function formatFromExt(ext: string): PluginFormat {
  return (PLUGIN_EXTENSIONS[ext.toLowerCase()] as PluginFormat) || 'Unknown'
}

function stripExtension(name: string): string {
  for (const ext of BUNDLE_EXTS) {
    if (name.toLowerCase().endsWith(ext)) {
      return name.slice(0, -ext.length)
    }
  }
  return name
}

function vendorFromBundleId(bundleId?: string): string | undefined {
  if (!bundleId) return undefined
  const parts = bundleId.split('.')
  if (parts.length < 2) return undefined
  // Skip 2-letter country/registry prefixes (de.brainworx…, eu.bettermaker…)
  let idx = 0
  if (
    (parts[0] === 'com' || parts[0] === 'net' || parts[0] === 'org') &&
    parts.length > 1
  ) {
    idx = 1
  } else if (/^[a-z]{2}$/i.test(parts[0]) && parts.length > 1) {
    idx = 1
  }
  const raw = parts[idx]
  return BUNDLE_VENDOR_MAP[raw] || BUNDLE_VENDOR_MAP[raw.toLowerCase()] || raw
}

function manufacturerFromFolder(folderName: string): string {
  return BUNDLE_VENDOR_MAP[folderName] || BUNDLE_VENDOR_MAP[folderName.toLowerCase()] || folderName
}

interface BundleMeta {
  name: string
  version: string | null
  bundleId?: string
  manufacturer?: string
  modifiedAt?: string
  auComponents?: AuComponentKey[]
  auVendor?: string
}

function readAuComponents(data: Record<string, unknown>): {
  keys: AuComponentKey[]
  vendor?: string
} {
  const list = data.AudioComponents
  if (!Array.isArray(list)) return { keys: [] }
  const keys: AuComponentKey[] = []
  let vendor: string | undefined
  for (const entry of list as Array<Record<string, unknown>>) {
    const manufacturer = typeof entry.manufacturer === 'string' ? entry.manufacturer : ''
    if (!manufacturer) continue
    keys.push({
      manufacturer,
      subtype: typeof entry.subtype === 'string' ? entry.subtype : undefined,
      type: typeof entry.type === 'string' ? entry.type : undefined,
    })
    const name = typeof entry.name === 'string' ? entry.name : ''
    const colon = name.indexOf(':')
    if (!vendor && colon > 0) vendor = name.slice(0, colon).trim()
  }
  return { keys, vendor }
}

function metaFromPlist(
  data: Record<string, unknown> | null,
  fallbackName: string,
  mtimeMs: number | undefined
): BundleMeta {
  let version: string | null = null
  let bundleId: string | undefined
  let manufacturer: string | undefined
  let name = fallbackName
  let auComponents: AuComponentKey[] | undefined
  let auVendor: string | undefined

  if (data) {
    version = pickPlistVersion(data)
    bundleId = data.CFBundleIdentifier as string | undefined
    name =
      (data.CFBundleName as string | undefined) ||
      (data.CFBundleDisplayName as string | undefined) ||
      fallbackName
    manufacturer = vendorFromBundleId(bundleId)
    const au = readAuComponents(data)
    if (au.keys.length) auComponents = au.keys
    auVendor = au.vendor
  }

  return {
    name: stripExtension(name),
    version,
    bundleId,
    manufacturer,
    modifiedAt: mtimeMs != null ? new Date(mtimeMs).toISOString() : undefined,
    auComponents,
    auVendor,
  }
}

function cleanVersionString(version: string): string {
  return version
    .replace(/\s*Authorization:.*$/i, '')
    .replace(/\.f\d+$/i, '')
    .replace(/\s*\(.*\)$/, '')
    .replace(/\s*build\s+\S+$/i, '')
    .replace(/\[.*?\]/g, '')
    .trim()
}

function pickPlistVersion(data: Record<string, unknown>): string | null {
  const candidates = [
    data.CFBundleShortVersionString,
    data.CFBundleVersion,
    data.CFBundleGetInfoString,
    (data as { Version?: unknown }).Version,
  ]
  for (const raw of candidates) {
    if (typeof raw !== 'string' || !raw.trim()) continue
    // GetInfoString often embeds "1.17.0, Copyright …"
    const cleaned = cleanVersionString(raw)
    const m = cleaned.match(/(\d+(?:\.\d+){1,4}[a-z0-9]*)/i)
    if (m) return m[1]
  }
  return null
}

/** Some vendors stash a better version in nested plists. */
function nestedPlistPaths(bundlePath: string): string[] {
  return [
    joinPath(bundlePath, 'Contents', 'Resources', 'Info.plist'),
    joinPath(bundlePath, 'Contents', 'version.plist'),
  ]
}

function isPluginBundle(entryName: string): boolean {
  const lower = entryName.toLowerCase()
  return [...BUNDLE_EXTS].some((ext) => lower.endsWith(ext))
}

interface RawHit {
  name: string
  manufacturer: string
  manufacturerHint?: string
  version: string | null
  format: PluginFormat
  path: string
  bundleId?: string
  modifiedAt?: string
  auComponents?: AuComponentKey[]
  auVendor?: string
}

/** A plugin bundle found on disk, before its plist is read. */
interface BundleSpot {
  path: string
  entry: string
  format: PluginFormat
  manufacturerOverride: string | null
  mtimeMs?: number
}

const SKIP_DIR_RE =
  /^(Help|Presets|Documentation|Resources|Logs|Cache|Caches|Uninstallers|Plug-Ins \(Unused\)|Plugins \(Don't Work\)|Plugins \(Maybe\))$/i
const ARCHIVE_DIR_RE = /\(unused\)|\(don't work\)|\(dont work\)|\(maybe\)|\(disabled\)|\(old\)/i
/** Distributor / marketplace folders are not the product vendor. */
const DISTRIBUTOR_FOLDERS = /^(plugin alliance|pluginalliance|ilok|pace|shared components|common files)$/i

function bundleFormat(entry: string, formatHint: PluginFormat | null): PluginFormat {
  const lower = entry.toLowerCase()
  if (lower.endsWith('.aaxplugin')) return 'AAX'
  if (lower.endsWith('.component')) return 'AU'
  if (lower.endsWith('.vst3')) return 'VST3'
  if (lower.endsWith('.vst')) return 'VST'
  if (lower.endsWith('.clap')) return 'CLAP'
  if (formatHint) return formatHint
  const matched = Object.keys(PLUGIN_EXTENSIONS).find((e) => lower.endsWith(e))
  return matched ? formatFromExt(matched) : 'Unknown'
}

async function walkForBundles(
  dir: string,
  formatHint: PluginFormat | null,
  manufacturerOverride: string | null,
  depth: number,
  out: BundleSpot[]
): Promise<void> {
  if (depth > 6) return
  const entries = await platform().readDir(dir)
  if (!entries) return
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))

  for (const { name: entry, isDir, mtimeMs } of entries) {
    if (entry.startsWith('.')) continue
    const full = joinPath(dir, entry)

    if (isPluginBundle(entry)) {
      out.push({ path: full, entry, format: bundleFormat(entry, formatHint), manufacturerOverride, mtimeMs })
      continue
    }

    // Manufacturer folder (e.g. Soundtoys/, Slate Digital/) containing nested bundles
    if (!isDir) continue
    if (SKIP_DIR_NAMES.has(entry.toLowerCase())) continue
    if (SKIP_DIR_RE.test(entry) || ARCHIVE_DIR_RE.test(entry)) continue
    // Don't descend into nested .app bundles (updaters, authorizers)
    if (entry.toLowerCase().endsWith('.app')) continue

    if (DISTRIBUTOR_FOLDERS.test(entry)) {
      await walkForBundles(full, formatHint, manufacturerOverride, depth + 1, out)
      continue
    }
    const nestedMfg = manufacturerOverride || manufacturerFromFolder(entry)
    const nextMfg = !extName(entry) ? nestedMfg : manufacturerOverride
    await walkForBundles(full, formatHint, nextMfg, depth + 1, out)
  }
}

/** Read every bundle's Info.plist in one batch, then nested plists for the ones without a version. */
async function hitsFromSpots(spots: BundleSpot[]): Promise<RawHit[]> {
  const host = platform()
  const infos = await host.readPlists(spots.map((s) => joinPath(s.path, 'Contents', 'Info.plist')))
  const metas = spots.map((s, i) => metaFromPlist(infos[i], stripExtension(s.entry), s.mtimeMs))

  const missing = metas.flatMap((m, i) => (m.version ? [] : [i]))
  if (missing.length) {
    const nested = await host.readPlists(missing.flatMap((i) => nestedPlistPaths(spots[i].path)))
    missing.forEach((spotIndex, k) => {
      for (const data of nested.slice(k * 2, k * 2 + 2)) {
        const v = data ? pickPlistVersion(data) : null
        if (v) {
          metas[spotIndex].version = v
          break
        }
      }
    })
  }

  return spots.map((spot, i) => {
    const meta = metas[i]
    return {
      name: meta.name,
      // Prefer the bundle's own vendor over parent-folder stamps (e.g. "Plugin Alliance/")
      manufacturer: meta.manufacturer || spot.manufacturerOverride || 'Unknown',
      manufacturerHint: meta.manufacturer,
      version: meta.version,
      format: spot.format,
      path: spot.path,
      bundleId: meta.bundleId,
      modifiedAt: meta.modifiedAt,
      auComponents: meta.auComponents,
      auVendor: meta.auVendor,
    }
  })
}

function formatHintForRoot(root: string): PluginFormat | null {
  const lower = root.toLowerCase()
  if (lower.includes('aax') || lower.includes('avid/audio') || lower.includes('digidesign')) {
    return 'AAX'
  }
  if (lower.includes('/mas') || lower.endsWith('/mas')) return 'Unknown'
  if (lower.includes('components')) return 'AU'
  if (lower.includes('vst3')) return 'VST3'
  if (lower.includes('/vst') || lower.endsWith('/vst')) return 'VST'
  if (lower.includes('clap')) return 'CLAP'
  // Universal Audio Application Support: don't force UAD — real bundles keep AU/VST3/AAX
  return null
}

function mergeKey(name: string, manufacturer: string, version: string | null): string {
  const family = productFamilyName(name).toLowerCase()
  const mfg = canonicalizeManufacturer(manufacturer).toLowerCase()
  const ver = normalizeVersion(version) || version || 'no-ver'
  // Keep distinct versions as separate hits so product-line grouping can
  // collapse them and judge status from the newest only.
  return `${mfg}::${family}::${ver}`
}

/**
 * Deep-scan known plugin folders and merge multi-format installs into one row.
 * Read-only: never writes, deletes, or overwrites.
 */
export async function scanPlugins(
  extraRoots: string[] = [],
  onProgress?: (message: string, percent: number) => void
): Promise<InstalledPlugin[]> {
  const roots = [...new Set([...getPluginRoots(), ...extraRoots])]
  const spots: BundleSpot[] = []

  for (let i = 0; i < roots.length; i++) {
    const root = roots[i]
    onProgress?.(
      `Scanning ${baseName(root) || root}`,
      Math.round(((i + 1) / Math.max(roots.length, 1)) * 60)
    )
    await walkForBundles(root, formatHintForRoot(root), null, 0, spots)
  }
  onProgress?.(`Reading ${spots.length} plugin bundles`, 70)
  const hits = await hitsFromSpots(spots)

  const merged = new Map<string, InstalledPlugin>()

  for (const hit of hits) {
    const manufacturer = canonicalizeManufacturer(hit.manufacturer)
    const key = mergeKey(hit.name, manufacturer, hit.version)
    const existing = merged.get(key)
    if (!existing) {
      merged.set(key, {
        id: key,
        name: productFamilyName(hit.name),
        manufacturer,
        version: hit.version,
        formats: [hit.format],
        paths: [hit.path],
        bundleId: hit.bundleId,
        bundleIds: hit.bundleId ? [hit.bundleId] : [],
        auComponents: hit.auComponents ? [...hit.auComponents] : [],
        auVendor: hit.auVendor,
        manufacturerHint: hit.manufacturerHint,
        modifiedAt: hit.modifiedAt,
      })
      continue
    }

    if (!existing.formats.includes(hit.format)) existing.formats.push(hit.format)
    if (!existing.paths.includes(hit.path)) existing.paths.push(hit.path)
    if (!existing.bundleId && hit.bundleId) existing.bundleId = hit.bundleId
    if (hit.bundleId && !existing.bundleIds?.includes(hit.bundleId)) {
      existing.bundleIds = [...(existing.bundleIds || []), hit.bundleId]
    }
    for (const au of hit.auComponents || []) {
      const dup = existing.auComponents?.some(
        (k) => k.manufacturer === au.manufacturer && k.subtype === au.subtype
      )
      if (!dup) existing.auComponents = [...(existing.auComponents || []), au]
    }
    if (!existing.auVendor && hit.auVendor) existing.auVendor = hit.auVendor
  }

  onProgress?.('Merging plugin formats', 90)

  return [...merged.values()].sort((a, b) => {
    const m = a.manufacturer.localeCompare(b.manufacturer)
    return m !== 0 ? m : a.name.localeCompare(b.name)
  })
}
