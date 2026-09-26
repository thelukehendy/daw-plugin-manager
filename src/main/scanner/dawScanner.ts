import type { DawInfo } from '../../shared/types'
import { DAW_CANDIDATES } from './paths'
import { joinPath as join, platform } from '../platform'

async function readPlistVersion(appPath: string): Promise<{
  version: string | null
  bundleId?: string
}> {
  const [data] = await platform().readPlists([join(appPath, 'Contents', 'Info.plist')])
  if (!data) return { version: null }
  const version =
    (data.CFBundleShortVersionString as string | undefined) ||
    (data.CFBundleVersion as string | undefined) ||
    null
  const bundleId = data.CFBundleIdentifier as string | undefined
  return { version, bundleId }
}

/**
 * Discover installed DAWs under /Applications, ~/Applications, and Setapp.
 * Read-only: never modifies anything.
 */
export async function scanDaws(): Promise<DawInfo[]> {
  const home = platform().homeDir
  const roots = [
    '/Applications',
    join(home, 'Applications'),
    join(home, 'Applications', 'Setapp'),
    '/Applications/Setapp',
  ]
  const found: DawInfo[] = []
  const now = new Date().toISOString()
  const seenPaths = new Set<string>()

  for (const root of roots) {
    const listing = await platform().readDir(root)
    if (!listing) continue
    const entries = listing.map((e) => e.name).sort()

    for (const entry of entries) {
      if (!entry.endsWith('.app')) continue
      const appName = entry.replace(/\.app$/, '')
      const candidate = DAW_CANDIDATES.find((d) =>
        d.appNamePatterns.some((pat) => appName.toLowerCase().startsWith(pat.toLowerCase()))
      )
      if (!candidate) continue

      // Skip companion / utility apps that share a brand prefix
      if (
        /companion|helper|uninstaller|updater|authorizer|control|connect|link|remote/i.test(
          appName
        ) &&
        !/^ableton live/i.test(appName) &&
        !/^pro tools/i.test(appName)
      ) {
        continue
      }

      const appPath = join(root, entry)
      if (seenPaths.has(appPath)) continue
      seenPaths.add(appPath)

      const { version, bundleId } = await readPlistVersion(appPath)

      found.push({
        id: `${candidate.id}:${appName}`,
        name: appName,
        version,
        path: appPath,
        bundleId,
        detectedAt: now,
      })
    }
  }

  return found.sort((a, b) => a.name.localeCompare(b.name))
}
