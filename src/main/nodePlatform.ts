/**
 * Node implementation of Platform (Electron main process, CLI scripts, tests).
 */
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { arch, homedir, platform as osPlatform, release } from 'os'
import { dirname, join } from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import plist from 'plist'
import type { DirEntry, Platform } from './platform'

const execFileAsync = promisify(execFile)

async function readPlist(path: string): Promise<Record<string, unknown> | null> {
  if (!existsSync(path)) return null
  try {
    const { stdout } = await execFileAsync('plutil', ['-convert', 'json', '-o', '-', path], {
      maxBuffer: 10 * 1024 * 1024,
    })
    return JSON.parse(stdout) as Record<string, unknown>
  } catch {
    /* fall through to the JS parser */
  }
  try {
    const raw = await readFile(path)
    return plist.parse(raw[0] === 0x62 ? (raw as unknown as string) : raw.toString('utf8')) as Record<
      string,
      unknown
    >
  } catch {
    return null
  }
}

function bundledCatalogCandidates(appPath?: string): string[] {
  const resourcePath = typeof process.resourcesPath === 'string' ? process.resourcesPath : undefined
  return [
    join(__dirname, '../../catalog/catalog.json'),
    join(__dirname, '../../../catalog/catalog.json'),
    join(process.cwd(), 'catalog/catalog.json'),
    appPath ? join(appPath, 'catalog/catalog.json') : '',
    resourcePath ? join(resourcePath, 'catalog/catalog.json') : '',
  ].filter(Boolean)
}

export function createNodePlatform(options?: {
  userDataDir?: string
  appPath?: string
  bundledCatalogPath?: string
}): Platform {
  const os = osPlatform() === 'win32' ? 'win32' : osPlatform() === 'darwin' ? 'darwin' : 'linux'
  const userDataDir =
    options?.userDataDir || join(homedir(), 'Library/Application Support/DAW Plugin Manager')

  return {
    kind: 'node',
    os,
    arch: arch(),
    homeDir: homedir(),
    userDataDir,
    sep: os === 'win32' ? '\\' : '/',
    env: (name) => process.env[name],
    async osVersion() {
      if (os !== 'darwin') return release()
      try {
        const { stdout } = await execFileAsync('sw_vers', ['-productVersion'])
        return stdout.trim() || release()
      } catch {
        return release()
      }
    },
    async readDir(path) {
      let names: string[]
      try {
        names = await readdir(path)
      } catch {
        return null
      }
      const entries: DirEntry[] = []
      for (const name of names) {
        try {
          const s = await stat(join(path, name))
          entries.push({ name, isDir: s.isDirectory(), mtimeMs: s.mtimeMs })
        } catch {
          /* vanished or unreadable */
        }
      }
      return entries
    },
    async exists(path) {
      return existsSync(path)
    },
    async readPlists(paths) {
      return Promise.all(paths.map(readPlist))
    },
    async readText(path) {
      try {
        return await readFile(path, 'utf8')
      } catch {
        return null
      }
    },
    async readBytes(path) {
      try {
        return new Uint8Array(await readFile(path))
      } catch {
        return null
      }
    },
    async writeAppFile(relativePath, data) {
      const target = join(userDataDir, relativePath)
      await mkdir(dirname(target), { recursive: true })
      const tmp = `${target}.tmp`
      await writeFile(tmp, typeof data === 'string' ? data : Buffer.from(data))
      await rename(tmp, target)
    },
    fetch: (input, init) => fetch(input, init),
    async bundledCatalogText() {
      const paths = options?.bundledCatalogPath
        ? [options.bundledCatalogPath]
        : bundledCatalogCandidates(options?.appPath)
      for (const path of paths) {
        if (existsSync(path)) return readFile(path, 'utf8')
      }
      return null
    },
  }
}
