import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { basename, extname, join } from 'path'
import type { InstalledPlugin, PluginFormat } from '../../shared/types'
import { PLUGIN_EXTENSIONS, SKIP_DIR_NAMES, getPluginRoots } from './paths'
import { readInfoPlist } from './plistReader'
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
  bettermaker: 'Bettermaker',
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
  uaudio: 'Universal Audio',
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
}

async function readBundleMeta(bundlePath: string, fallbackName: string): Promise<BundleMeta> {
  const infoPath = join(bundlePath, 'Contents', 'Info.plist')
  let version: string | null = null
  let bundleId: string | undefined
  let manufacturer: string | undefined
  let name = fallbackName
  let modifiedAt: string | undefined

  try {
    const s = await stat(bundlePath)
    modifiedAt = s.mtime.toISOString()
  } catch {
    /* ignore */
  }

  if (existsSync(infoPath)) {
    try {
      const data = await readInfoPlist(infoPath)
      if (data) {
        version = pickPlistVersion(data)
        bundleId = data.CFBundleIdentifier as string | undefined
        name =
          (data.CFBundleName as string | undefined) ||
          (data.CFBundleDisplayName as string | undefined) ||
          fallbackName
        manufacturer = vendorFromBundleId(bundleId)

        // AudioComponents manufacturer code sometimes present on AU/AAX duals
        const ac = data.AudioComponents as Array<{ manufacturer?: string; name?: string }> | undefined
        if (ac?.[0]?.name && !name) name = ac[0].name
      }
    } catch {
      /* ignore corrupt plists */
    }
  }

  // Fallback: some vendors stash a better version in nested plists / pkg info
  if (!version) {
    version = await readNestedVersion(bundlePath)
  }

  return { name: stripExtension(name), version, bundleId, manufacturer, modifiedAt }
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

async function readNestedVersion(bundlePath: string): Promise<string | null> {
  const candidates = [
    join(bundlePath, 'Contents', 'Resources', 'Info.plist'),
    join(bundlePath, 'Contents', 'version.plist'),
    join(bundlePath, 'Contents', 'PkgInfo'),
  ]
  for (const p of candidates) {
    if (!existsSync(p)) continue
    if (p.endsWith('PkgInfo')) continue
    try {
      const data = await readInfoPlist(p)
      if (!data) continue
      const v = pickPlistVersion(data)
      if (v) return v
    } catch {
      /* ignore */
    }
  }
  return null
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
}

async function scanDirectory(
  dir: string,
  formatHint: PluginFormat | null,
  manufacturerOverride: string | null,
  depth: number,
  out: RawHit[]
): Promise<void> {
  if (depth > 6) return
  if (!existsSync(dir)) return

  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.startsWith('.')) continue
    const full = join(dir, entry)

    if (isPluginBundle(entry)) {
      const ext = extname(entry).toLowerCase() || `.${entry.split('.').pop()}`
      // Handle .aaxplugin which is not always returned correctly by extname on all platforms
      let format = formatHint
      if (!format) {
        const matched = Object.keys(PLUGIN_EXTENSIONS).find((e) =>
          entry.toLowerCase().endsWith(e)
        )
        format = matched ? formatFromExt(matched) : 'Unknown'
      }
      if (entry.toLowerCase().endsWith('.aaxplugin')) format = 'AAX'
      else if (entry.toLowerCase().endsWith('.component')) format = 'AU'
      else if (entry.toLowerCase().endsWith('.vst3')) format = 'VST3'
      else if (entry.toLowerCase().endsWith('.vst')) format = 'VST'
      else if (entry.toLowerCase().endsWith('.clap')) format = 'CLAP'

      const meta = await readBundleMeta(full, stripExtension(entry))
      // Prefer the bundle's own vendor over parent-folder stamps (e.g. "Plugin Alliance/")
      const mfg =
        meta.manufacturer ||
        manufacturerOverride ||
        'Unknown'

      out.push({
        name: meta.name,
        manufacturer: mfg,
        manufacturerHint: meta.manufacturer,
        version: meta.version,
        format: format || 'Unknown',
        path: full,
        bundleId: meta.bundleId,
        modifiedAt: meta.modifiedAt,
      })
      continue
    }

    // Manufacturer folder (e.g. Soundtoys/, Slate Digital/) containing nested bundles
    let isDir = false
    try {
      isDir = (await stat(full)).isDirectory()
    } catch {
      continue
    }
    if (!isDir) continue

    // Skip known non-plugin / archive trees
    if (SKIP_DIR_NAMES.has(entry.toLowerCase())) continue
    if (
      /^(Help|Presets|Documentation|Resources|Logs|Cache|Caches|Uninstallers|Plug-Ins \(Unused\)|Plugins \(Don't Work\)|Plugins \(Maybe\))$/i.test(
        entry
      )
    ) {
      continue
    }
    // Also skip common "unused / disabled" archive folder name patterns
    if (/\(unused\)|\(don't work\)|\(dont work\)|\(maybe\)|\(disabled\)|\(old\)/i.test(entry)) {
      continue
    }
    // Don't descend into nested .app bundles (updaters, authorizers)
    if (entry.toLowerCase().endsWith('.app')) continue

    // Distributor / marketplace folders are not the product vendor
    const DISTRIBUTOR_FOLDERS =
      /^(plugin alliance|pluginalliance|ilok|pace|shared components|common files)$/i
    if (DISTRIBUTOR_FOLDERS.test(entry)) {
      await scanDirectory(full, formatHint, manufacturerOverride, depth + 1, out)
      continue
    }

    const nestedMfg = manufacturerOverride || manufacturerFromFolder(entry)
    const nextMfg = !extname(entry) ? nestedMfg : manufacturerOverride
    await scanDirectory(full, formatHint, nextMfg, depth + 1, out)
  }
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
  const hits: RawHit[] = []
  const existingRoots = roots.filter((r) => existsSync(r))

  for (let i = 0; i < existingRoots.length; i++) {
    const root = existingRoots[i]
    onProgress?.(
      `Scanning ${basename(root) || root}`,
      Math.round(((i + 1) / Math.max(existingRoots.length, 1)) * 80)
    )
    await scanDirectory(root, formatHintForRoot(root), null, 0, hits)
  }

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
        manufacturerHint: hit.manufacturerHint,
        modifiedAt: hit.modifiedAt,
      })
      continue
    }

    if (!existing.formats.includes(hit.format)) existing.formats.push(hit.format)
    if (!existing.paths.includes(hit.path)) existing.paths.push(hit.path)
    if (!existing.bundleId && hit.bundleId) existing.bundleId = hit.bundleId
  }

  onProgress?.('Merging plugin formats', 90)

  return [...merged.values()].sort((a, b) => {
    const m = a.manufacturer.localeCompare(b.manufacturer)
    return m !== 0 ? m : a.name.localeCompare(b.name)
  })
}
