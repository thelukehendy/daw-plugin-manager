import type { InstalledPlugin } from '../../shared/types'
import { compareVersions, normalizeVersion } from '../catalog/versionCompare'

/**
 * Canonical manufacturer display names + aliases for merging duplicates
 * (e.g. "Acon" vs "Acon Digital", "audiounit" Goodhertz bundles).
 */
const MANUFACTURER_CANONICAL: Record<string, string> = {
  acon: 'Acon Digital',
  'acon digital': 'Acon Digital',
  acondigital: 'Acon Digital',
  wavesaudio: 'Waves',
  waves: 'Waves',
  'plugin-alliance': 'Plugin Alliance',
  pluginalliance: 'Plugin Alliance',
  'plugin alliance': 'Plugin Alliance',
  brainworx: 'Plugin Alliance',
  'brainworx gmbh': 'Plugin Alliance',
  izotope: 'iZotope',
  fabfilter: 'FabFilter',
  valhalladsp: 'Valhalla DSP',
  'valhalla dsp': 'Valhalla DSP',
  antares: 'Antares',
  soundtoys: 'Soundtoys',
  'slate digital': 'Slate Digital',
  'slate-digital': 'Slate Digital',
  slateaudio: 'Slate Digital',
  accusonus: 'Accusonus',
  goodhertz: 'Goodhertz',
  audiounit: 'Goodhertz',
  'applied-acoustics': 'Applied Acoustics Systems',
  'applied acoustics systems': 'Applied Acoustics Systems',
  appliedacoustics: 'Applied Acoustics Systems',
  apple: 'Apple',
  nativeinstruments: 'Native Instruments',
  'native-instruments': 'Native Instruments',
  'native instruments': 'Native Instruments',
  softube: 'Softube',
  uaudio: 'Universal Audio',
  'universal audio': 'Universal Audio',
  ikmultimedia: 'IK Multimedia',
  'ik multimedia': 'IK Multimedia',
  celemony: 'Celemony',
  oeksound: 'oeksound',
  steinberg: 'Steinberg',
  se: 'Steinberg',
  'spectralayers-bridge': 'Steinberg',
  digidesign: 'Avid',
  avid: 'Avid',
  ssl: 'Solid State Logic',
  'solid state logic': 'Solid State Logic',
  mhz: 'Metric Halo',
  mhlabs: 'Metric Halo',
  'mh labs': 'Metric Halo',
  bbesound: 'BBE Sound',
  'bbe sound': 'BBE Sound',
  accentize: 'Accentize',
  sonarworks: 'Sonarworks',
  spitfireaudio: 'Spitfire Audio',
  liquidsonics: 'LiquidSonics',
  cableguys: 'Cableguys',
  // NOTE: do not map bare "de" — country-code bundle prefixes (de.brainworx…)
  hornet: 'HoRNet',
  tbproaudio: 'TBProAudio',
  blacksaltaudio: 'Black Salt Audio',
  aberrantdsp: 'Aberrant DSP',
  stevenslate: 'Steven Slate Audio',
  overloud: 'Overloud',
  eastwest: 'EastWest',
  nugenaudio: 'Nugen Audio',
  audiomodern: 'Audio Modern',
  waproduction: 'WA Production',
  karanyisounds: 'Karanyi Sounds',
  louderthanliftoff: 'Louder Than Liftoff',
  safaripedals: 'Safari Pedals',
  letimix: 'leotokarev',
  impulserecord: 'Impulse Record',
  uvisoundsource: 'UVI',
  thxltd: 'THX',
  mpegh: 'Fraunhofer',
  spectrasonics: 'Spectrasonics',
  sonnox: 'Sonnox',
  eventide: 'Eventide',
  kilohearts: 'Kilohearts',
  meldaproduction: 'MeldaProduction',
  'd16 group': 'D16 Group',
  d16: 'D16 Group',
  // Previously unknown / mis-tagged vendors
  eu: 'Bettermaker',
  bettermaker: 'Bettermaker',
  mycompany: 'Kiive Audio',
  kiive: 'Kiive Audio',
  'kiive audio': 'Kiive Audio',
  credland: 'Credland Audio',
  cymatics: 'Cymatics',
  linplug: 'LinPlug',
  scuffhamamps: 'Scuffham Amps',
  scuffham: 'Scuffham Amps',
  tekitaudio: "Tek'it Audio",
  "tek'it audio": "Tek'it Audio",
  unfilteredaudio: 'Unfiltered Audio',
  'unfiltered audio': 'Unfiltered Audio',
  celera: 'TAL Software',
  tal: 'TAL Software',
  'tal software': 'TAL Software',
}

/** Multi-generation product lines: older majors nest under the line, not separate alarms. */
const PRODUCT_LINE_PATTERNS: Array<{ re: RegExp; line: string }> = [
  { re: /^kontakt(?:\s+\d+)?$/i, line: 'Kontakt' },
  { re: /^guitar\s*rig(?:\s+\d+)?$/i, line: 'Guitar Rig' },
  { re: /^reaktor(?:\s+\d+)?$/i, line: 'Reaktor' },
  { re: /^melodyne(?:\s*(bridge|editor|assistant|essential|studio))?$/i, line: 'Melodyne' },
  { re: /^ozone(?:\s+\d+)?$/i, line: 'Ozone' },
  { re: /^neutron(?:\s+\d+)?$/i, line: 'Neutron' },
  { re: /^nectar(?:\s+\d+)?$/i, line: 'Nectar' },
  { re: /^rx(?:\s+\d+)?(?:\s+.*)?$/i, line: 'RX' },
  { re: /^amplitu(?:be)?(?:\s+\d+)?$/i, line: 'AmpliTube' },
  { re: /^auto-?tune(?:\s+.*)?$/i, line: 'Auto-Tune' },
  { re: /^spectralayers(?:\s*-?\s*bridge)?(?:\s+\d+)?$/i, line: 'SpectraLayers' },
  { re: /^omnisphere(?:\s+\d+)?$/i, line: 'Omnisphere' },
  { re: /^massive(?:\s*(x)?)?$/i, line: 'Massive' },
]

export function canonicalizeManufacturer(raw: string): string {
  const key = raw.trim().toLowerCase()
  if (!key || key === 'unknown') return 'Unknown'
  return (
    MANUFACTURER_CANONICAL[key] ||
    MANUFACTURER_CANONICAL[key.replace(/\s+/g, '')] ||
    MANUFACTURER_CANONICAL[key.replace(/_/g, '-')] ||
    raw.trim()
  )
}

/**
 * Strip format/version noise from plugin filenames so multi-install families group.
 */
const GOODHERTZ_STEMS: Record<string, string> = {
  canopenerstudio: 'CanOpener Studio',
  faradaylimiter: 'Faraday Limiter',
  gooddither: 'Good Dither',
  lohi: 'Lohi',
  lossy: 'Lossy',
  midside: 'Midside',
  midsidematrix: 'Midside Matrix',
  panpot: 'Panpot',
  tiltshift: 'Tiltshift',
  tonecontrol: 'Tone Control',
  tremcontrol: 'Trem Control',
  vulfcompressor: 'Vulf Compressor',
  wowcontrol: 'Wow Control',
  loudness: 'Loudness',
  vcme: 'VCME',
}

function formatGoodhertzStem(stem: string): string {
  const known = GOODHERTZ_STEMS[stem.toLowerCase()]
  if (known) return known
  // Fallback: split before final Capitalized word (ToneControl → Tone Control)
  return stem.replace(/([a-z])([A-Z][a-z]+)$/g, '$1 $2')
}

export function productFamilyName(name: string): string {
  let n = name.trim()

  if (/^waveshell/i.test(n) || /^wave.?shell/i.test(n)) return 'WaveShell'
  if (/studio\s*rack.*obs/i.test(n)) return 'Waves StudioRack for OBS'
  if (/^s-?gear/i.test(n) || /^sgear/i.test(n)) return 'S-Gear'

  // Goodhertz bundles: ghz2-CanOpenerStudio-CS2X → Goodhertz CanOpener Studio
  const ghz = n.match(/^ghz\d+-([A-Za-z0-9]+?)(?:-[A-Z]{1,4}\d*X?)?$/i)
  if (ghz) {
    return `Goodhertz ${formatGoodhertzStem(ghz[1])}`
  }
  if (/^goodhertz$/i.test(n)) return 'Goodhertz'

  // Sonarworks / host adapters often append "plugin" + format/arch
  n = n.replace(/\s+plugin$/i, '')
  n = n.replace(/\s*\(x86\)|\s*\(x64\)|\s*\(32-?bit\)|\s*\(64-?bit\)/gi, '')
  n = n.replace(/\s+(AAX|AU|VST3|VST2?|VST|CLAP)(\s+x86|\s+x64)?$/i, '')
  n = n.replace(/\s+x86$/i, '')
  n = n.replace(/\s+x64$/i, '')

  n = n.replace(/\s*[_\-]?\s*(AAX|AU|VST3|VST|CLAP)\s*$/i, '')
  n = n.replace(/\s+\d+(?:\.\d+){1,3}[a-z0-9.\-]*$/i, (match, offset, whole) => {
    const base = whole.slice(0, offset).toLowerCase()
    if (/shell|adapter|bridge|wrapper|host/.test(base)) return ''
    return match
  })
  n = n.replace(/^(WaveShell\d*)[-\s].*$/i, 'WaveShell')

  // Lowercase " sc" = leftover sidechain VST naming (elysia mpressor sc),
  // not branded "SC" products (bx_console Focusrite SC).
  n = n.replace(/\s+sc$/, '')

  return n.trim() || name.trim()
}

/** Collapse generationed titles (Kontakt 6/8) into one product line for status. */
export function productLineName(name: string): string {
  const family = productFamilyName(name)
  for (const { re, line } of PRODUCT_LINE_PATTERNS) {
    if (re.test(family)) return line
  }
  return family
}

export function productGroupKey(manufacturer: string, name: string): string {
  const mfg = canonicalizeManufacturer(manufacturer).toLowerCase()
  const line = productLineName(name).toLowerCase()
  return `${mfg}::${line}`
}

export interface PluginGroup {
  key: string
  name: string
  productLine: string
  manufacturer: string
  members: InstalledPlugin[]
  newestVersion: string | null
  /** Highest major generation among members (e.g. 8 for Kontakt 8). */
  newestGeneration: number | null
}

/**
 * Merge product keys that only differ by a trailing suffix into the base key,
 * but only when the base product group already exists.
 */
function mergeSuffixVariants(
  map: Map<string, InstalledPlugin[]>,
  suffixRe: RegExp
): void {
  for (const key of [...map.keys()]) {
    const sep = key.indexOf('::')
    if (sep < 0) continue
    const mfg = key.slice(0, sep)
    const line = key.slice(sep + 2)
    if (!suffixRe.test(line)) continue
    const baseLine = line.replace(suffixRe, '').trim()
    if (!baseLine || baseLine === line) continue
    const baseKey = `${mfg}::${baseLine}`
    if (!map.has(baseKey)) continue
    const extras = map.get(key) || []
    const base = map.get(baseKey) || []
    base.push(...extras)
    map.set(baseKey, base)
    map.delete(key)
  }
}

function extractGeneration(name: string): number | null {
  const family = productFamilyName(name)
  const m = family.match(/^(?:.*?\s)?(\d+)$/)
  if (m) return parseInt(m[1], 10)
  // "Kontakt" without number → treat as gen from version major if possible
  return null
}

function generationFromMember(plugin: InstalledPlugin): number {
  const fromName = extractGeneration(plugin.name)
  if (fromName != null) return fromName
  const ver = normalizeVersion(plugin.version)
  if (ver) {
    const major = parseInt(ver.split('.')[0], 10)
    if (!Number.isNaN(major)) return major
  }
  return 0
}

export function groupInstalledPlugins(plugins: InstalledPlugin[]): PluginGroup[] {
  const map = new Map<string, InstalledPlugin[]>()

  for (const plugin of plugins) {
    let manufacturer = canonicalizeManufacturer(plugin.manufacturer)
    const family = productFamilyName(plugin.name)
    const line = productLineName(plugin.name)
    if (family === 'WaveShell' || line === 'WaveShell') manufacturer = 'Waves'
    if (/^Goodhertz\b/i.test(family) || /^Goodhertz\b/i.test(line)) manufacturer = 'Goodhertz'
    if (line === 'SpectraLayers') manufacturer = 'Steinberg'
    if (line === 'S-Gear') manufacturer = 'Scuffham Amps'
    if (line === 'Kontakt' || line === 'Guitar Rig' || line === 'Reaktor' || line === 'Massive') {
      manufacturer = 'Native Instruments'
    }
    if (line === 'Melodyne') manufacturer = 'Celemony'
    if (line === 'Ozone' || line === 'Neutron' || line === 'Nectar' || line === 'RX') {
      manufacturer = 'iZotope'
    }
    if (line === 'AmpliTube') manufacturer = 'IK Multimedia'
    if (line === 'Auto-Tune') manufacturer = 'Antares'

    // Brainworx / bx_* always roll up under Plugin Alliance (distributor portal)
    if (
      /^bx[_ ]/i.test(family) ||
      /^brainworx/i.test(family) ||
      manufacturer === 'Brainworx'
    ) {
      manufacturer = 'Plugin Alliance'
    }

    // Leftover Plugin Alliance folder stamps → brand from product name when possible
    if (manufacturer === 'Plugin Alliance') {
      if (/^ltl\b/i.test(family) || /chop shop/i.test(family)) manufacturer = 'Louder Than Liftoff'
      else if (/^adptr\b/i.test(family)) manufacturer = 'ADPTR Audio'
      else if (/^unfiltered/i.test(family)) manufacturer = 'Unfiltered Audio'
      else if (/^lindell\b/i.test(family)) manufacturer = 'Lindell Audio'
      else if (/^elysia/i.test(family)) manufacturer = 'Plugin Alliance'
      else if (/^spl\b/i.test(family)) manufacturer = 'Plugin Alliance'
    }

    const key = productGroupKey(manufacturer, plugin.name)
    const list = map.get(key) || []
    list.push({ ...plugin, manufacturer })
    map.set(key, list)
  }

  // Fold leftover "… sc" / sidechain VST names into the base product when it exists
  // (e.g. elysia mpressor sc → elysia mpressor). Leave standalone products like
  // "bx_console Focusrite SC" alone when no base group is present.
  mergeSuffixVariants(map, /\s+sc$/i)

  const groups: PluginGroup[] = []
  for (const [key, members] of map) {
    const sorted = [...members].sort((a, b) => {
      const ga = generationFromMember(a)
      const gb = generationFromMember(b)
      if (ga !== gb) return gb - ga
      const rel = compareVersions(a.version, b.version)
      if (rel === 'newer') return -1
      if (rel === 'outdated') return 1
      return (a.name || '').localeCompare(b.name || '')
    })

    const newestGeneration = Math.max(...sorted.map(generationFromMember), 0) || null

    // Status version = newest among the highest generation only (Kontakt 8 beats Kontakt 6)
    const topGen = newestGeneration ?? 0
    const topMembers = sorted.filter((m) => generationFromMember(m) === topGen)
    const versionPool = topMembers.length ? topMembers : sorted

    // Prefer versions reported by modern formats (AAX / AU / VST3 / CLAP).
    // Legacy VST2 Info.plists are often left stale after Plugin Alliance updates.
    const modernPool = versionPool.filter((m) =>
      m.formats.some((f) => f === 'AAX' || f === 'AU' || f === 'VST3' || f === 'CLAP')
    )
    const authorityPool = modernPool.length ? modernPool : versionPool

    let newestVersion: string | null = null
    for (const m of authorityPool) {
      if (!m.version) continue
      if (!newestVersion || compareVersions(m.version, newestVersion) === 'newer') {
        newestVersion = m.version
      }
    }
    // Fall back to any format if modern ones lacked versions
    if (!newestVersion) {
      for (const m of versionPool) {
        if (!m.version) continue
        if (!newestVersion || compareVersions(m.version, newestVersion) === 'newer') {
          newestVersion = m.version
        }
      }
    }

    const line = productLineName(sorted[0].name)
    // Prefer a display name that reflects the newest generation when present
    const topNamed = versionPool.find((m) => extractGeneration(m.name) === topGen)
    const displayName = topNamed ? productFamilyName(topNamed.name) : line

    groups.push({
      key,
      name: displayName,
      productLine: line,
      manufacturer: sorted[0].manufacturer,
      members: sorted,
      newestVersion,
      newestGeneration,
    })
  }

  return groups.sort((a, b) => {
    const m = a.manufacturer.localeCompare(b.manufacturer)
    return m !== 0 ? m : a.name.localeCompare(b.name)
  })
}

export function uniqueSortedVersions(versions: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of versions) {
    if (!v) continue
    const norm = normalizeVersion(v) || v
    if (seen.has(norm)) continue
    seen.add(norm)
    out.push(v)
  }
  return out.sort((a, b) => {
    const rel = compareVersions(a, b)
    if (rel === 'newer') return -1
    if (rel === 'outdated') return 1
    return a.localeCompare(b, undefined, { numeric: true })
  })
}

export { generationFromMember }
