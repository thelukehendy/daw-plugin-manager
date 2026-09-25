/**
 * Everything the scanner and catalog code needs from the host: read-only file system
 * access, plist parsing, the app's own data folder, and system facts. Implemented by
 * Node (Electron main, CLI scripts, tests) and by the Tauri shell.
 */

export interface DirEntry {
  name: string
  isDir: boolean
  mtimeMs?: number
}

export interface Platform {
  kind: 'node' | 'tauri'
  os: 'darwin' | 'win32' | 'linux'
  arch: string
  homeDir: string
  /** Where the app keeps its own files (catalog cache, last library). */
  userDataDir: string
  sep: '/' | '\\'
  env(name: string): string | undefined
  osVersion(): Promise<string | null>
  /** Entries of a directory, or null when it doesn't exist or can't be read. */
  readDir(path: string): Promise<DirEntry[] | null>
  exists(path: string): Promise<boolean>
  /** Parse XML or binary plists; null entries for unreadable files. */
  readPlists(paths: string[]): Promise<(Record<string, unknown> | null)[]>
  readText(path: string): Promise<string | null>
  readBytes(path: string): Promise<Uint8Array | null>
  /** Write inside userDataDir only: temp file + rename, creating folders. */
  writeAppFile(relativePath: string, data: string | Uint8Array): Promise<void>
  /** Text of the catalog.json shipped with the app. */
  bundledCatalogText(): Promise<string | null>
}

let current: Platform | null = null

export function setPlatform(platform: Platform): void {
  current = platform
}

export function platform(): Platform {
  if (!current) throw new Error('Platform not initialized')
  return current
}

export function joinPath(...parts: string[]): string {
  const sep = current?.sep ?? '/'
  return parts
    .filter((p) => p !== '')
    .map((p, i) => (i === 0 ? p.replace(/[\\/]+$/, '') : p.replace(/^[\\/]+|[\\/]+$/g, '')))
    .join(sep)
}

export function baseName(path: string): string {
  const parts = path.split(/[\\/]/).filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

export function extName(name: string): string {
  const base = baseName(name)
  const i = base.lastIndexOf('.')
  return i > 0 ? base.slice(i) : ''
}

/** Let the UI paint between chunks of work, in Node and in a web view. */
export function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(bytes))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
