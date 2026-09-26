import type { InstalledApp } from '../../shared/types'
import { joinPath, platform } from '../platform'

/** Folders that hold apps; vendors often nest them (/Applications/Avid/Avid Link/Avid Link.app). */
const MAX_DEPTH = 3

async function walk(dir: string, depth: number, out: string[]): Promise<void> {
  if (depth > MAX_DEPTH) return
  const entries = await platform().readDir(dir)
  if (!entries) return
  for (const e of entries) {
    if (!e.isDir || e.name.startsWith('.')) continue
    const full = joinPath(dir, e.name)
    if (e.name.endsWith('.app')) out.push(full)
    else if (!/uninstall/i.test(e.name)) await walk(full, depth + 1, out)
  }
}

function leadingVersion(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
}

/** Every application bundle under /Applications and ~/Applications. Read-only. */
export async function scanApps(): Promise<InstalledApp[]> {
  if (platform().os !== 'darwin') return []
  const paths: string[] = []
  for (const root of ['/Applications', joinPath(platform().homeDir, 'Applications')]) {
    await walk(root, 1, paths)
  }
  const plists = await platform().readPlists(paths.map((p) => joinPath(p, 'Contents', 'Info.plist')))
  return paths.map((path, i) => {
    const data = plists[i]
    const file = path.split('/').pop() || path
    return {
      name: file.replace(/\.app$/, ''),
      version: leadingVersion(data?.CFBundleShortVersionString) ?? leadingVersion(data?.CFBundleVersion),
      bundleId: typeof data?.CFBundleIdentifier === 'string' ? data.CFBundleIdentifier : undefined,
      path,
    }
  })
}
