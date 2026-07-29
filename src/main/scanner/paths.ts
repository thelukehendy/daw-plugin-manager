import { homedir, platform } from 'os'
import { join } from 'path'

/**
 * Standard plugin search roots.
 * macOS is fully supported; Windows roots are included for forward compatibility.
 * The scanner is read-only: it never writes, deletes, or overwrites.
 *
 * Roots cover system + user Library trees, legacy Digidesign, UAD, and common
 * vendor Application Support folders used across macOS versions.
 */
export function getPluginRoots(): string[] {
  if (platform() === 'win32') return getWindowsPluginRoots()
  return getMacPluginRoots()
}

/** @deprecated use getPluginRoots */
export function getMacPluginRoots(): string[] {
  const home = homedir()
  const systemLibrary = '/Library'
  const userLibrary = join(home, 'Library')

  const audioPluginFormats = ['Components', 'VST3', 'VST', 'CLAP', 'MAS']
  const roots: string[] = []

  for (const lib of [systemLibrary, userLibrary]) {
    for (const fmt of audioPluginFormats) {
      roots.push(join(lib, 'Audio', 'Plug-Ins', fmt))
    }
  }

  // Pro Tools / Avid (current + legacy Digidesign path on older systems)
  for (const lib of [systemLibrary, userLibrary]) {
    roots.push(join(lib, 'Application Support', 'Avid', 'Audio', 'Plug-Ins'))
    roots.push(join(lib, 'Application Support', 'Digidesign', 'Plug-Ins'))
  }

  // Universal Audio (UAD / UADx) — plugins usually land in standard AU/VST/AAX
  // folders; Application Support may hold additional components / helpers.
  for (const lib of [systemLibrary, userLibrary]) {
    roots.push(join(lib, 'Application Support', 'Universal Audio'))
  }
  roots.push('/Applications/Universal Audio')
  roots.push(join(home, 'Applications', 'Universal Audio'))

  // Vendor Application Support trees (often contain format-specific installs)
  const vendorSupport = [
    'Waves',
    'Native Instruments',
    'iZotope',
    'Softube',
    'Goodhertz',
    'FabFilter',
    'Valhalla DSP',
    'Antares',
    'Celemony',
    'Plugin Alliance',
    'Slate Digital',
    'Soundtoys',
    'Accusonus',
    'Acon Digital',
    'Applied Acoustics Systems',
    'Eventide',
    'McDSP',
    'Sonnox',
    'Spectrasonics',
    'Spitfire Audio',
    'MeldaProduction',
    'Kilohearts',
    'Cableguys',
    'Focusrite',
    'SSL',
    'Solid State Logic',
    'PreSonus',
    'Bitwig GmbH',
    'MOTU',
  ]
  for (const lib of [systemLibrary, userLibrary]) {
    for (const vendor of vendorSupport) {
      roots.push(join(lib, 'Application Support', vendor))
    }
  }

  return [...new Set(roots)]
}

function getWindowsPluginRoots(): string[] {
  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files'
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'
  const localAppData = process.env.LOCALAPPDATA || ''
  const appData = process.env.APPDATA || ''
  const common = process.env.COMMONPROGRAMFILES || join(programFiles, 'Common Files')
  const commonX86 =
    process.env['COMMONPROGRAMFILES(x86)'] || join(programFilesX86, 'Common Files')

  return [
    join(common, 'Avid', 'Audio', 'Plug-Ins'),
    join(commonX86, 'Avid', 'Audio', 'Plug-Ins'),
    join(common, 'VST3'),
    join(commonX86, 'VST3'),
    join(programFiles, 'Steinberg', 'VSTPlugins'),
    join(programFilesX86, 'Steinberg', 'VSTPlugins'),
    join(programFiles, 'VSTPlugins'),
    join(programFilesX86, 'VSTPlugins'),
    join(programFiles, 'Common Files', 'CLAP'),
    join(programFiles, 'Universal Audio'),
    join(programFilesX86, 'Universal Audio'),
    join(localAppData, 'Programs'),
    join(appData, 'VST3'),
  ].filter(Boolean)
}

export interface DawCandidate {
  id: string
  name: string
  appNamePatterns: string[]
  bundleIdHints?: string[]
}

export const DAW_CANDIDATES: DawCandidate[] = [
  {
    id: 'pro-tools',
    name: 'Pro Tools',
    appNamePatterns: ['Pro Tools'],
    bundleIdHints: ['com.avid.ProTools'],
  },
  {
    id: 'logic-pro',
    name: 'Logic Pro',
    appNamePatterns: ['Logic Pro'],
    bundleIdHints: ['com.apple.logic10'],
  },
  {
    id: 'ableton-live',
    name: 'Ableton Live',
    appNamePatterns: ['Ableton Live'],
    bundleIdHints: ['com.ableton.live'],
  },
  {
    id: 'reaper',
    name: 'REAPER',
    appNamePatterns: ['REAPER'],
    bundleIdHints: ['com.cockos.reaper'],
  },
  {
    id: 'studio-one',
    name: 'Studio One',
    appNamePatterns: ['Studio One'],
    bundleIdHints: ['com.presonus.studioone'],
  },
  {
    id: 'fl-studio',
    name: 'FL Studio',
    appNamePatterns: ['FL Studio'],
    bundleIdHints: ['com.image-line.flstudio'],
  },
  {
    id: 'cubase',
    name: 'Cubase',
    appNamePatterns: ['Cubase'],
    bundleIdHints: ['com.steinberg.cubase'],
  },
  { id: 'nuendo', name: 'Nuendo', appNamePatterns: ['Nuendo'] },
  { id: 'bitwig', name: 'Bitwig Studio', appNamePatterns: ['Bitwig Studio'] },
  { id: 'reason', name: 'Reason', appNamePatterns: ['Reason'] },
  { id: 'digital-performer', name: 'Digital Performer', appNamePatterns: ['Digital Performer'] },
  { id: 'garageband', name: 'GarageBand', appNamePatterns: ['GarageBand'] },
  { id: 'luna', name: 'Luna', appNamePatterns: ['Luna'] },
  { id: 'waveform', name: 'Waveform', appNamePatterns: ['Waveform'] },
  { id: 'mixbus', name: 'Mixbus', appNamePatterns: ['Mixbus', 'Harrison Mixbus'] },
  { id: 'samplitude', name: 'Samplitude', appNamePatterns: ['Samplitude'] },
  { id: 'sequoia', name: 'Sequoia', appNamePatterns: ['Sequoia'] },
  { id: 'audition', name: 'Adobe Audition', appNamePatterns: ['Adobe Audition'] },
]

/** Directories under Application Support that are never plugin bundles. */
export const SKIP_DIR_NAMES = new Set(
  [
    'caches',
    'cache',
    'logs',
    'log',
    'crashreporter',
    'crashes',
    'documentation',
    'docs',
    'help',
    'manuals',
    'presets',
    'preset',
    'samples',
    'sample content',
    'content',
    'factory content',
    'libraries',
    'library',
    'temp',
    'tmp',
    'updates',
    'download',
    'downloads',
    '.trash',
  ].map((s) => s.toLowerCase())
)

export const PLUGIN_EXTENSIONS: Record<string, string> = {
  '.aaxplugin': 'AAX',
  '.component': 'AU',
  '.vst3': 'VST3',
  '.vst': 'VST',
  '.clap': 'CLAP',
}
