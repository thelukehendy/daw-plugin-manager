import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
import plist from 'plist'

const execFileAsync = promisify(execFile)

/**
 * Read a macOS Info.plist whether it is XML or binary.
 * Uses plutil JSON conversion when the JS plist parser cannot handle the file.
 */
export async function readInfoPlist(
  infoPath: string
): Promise<Record<string, unknown> | null> {
  if (!existsSync(infoPath)) return null

  try {
    const { stdout } = await execFileAsync('plutil', ['-convert', 'json', '-o', '-', infoPath], {
      maxBuffer: 10 * 1024 * 1024,
    })
    return JSON.parse(stdout) as Record<string, unknown>
  } catch {
    /* fall through */
  }

  try {
    const raw = await readFile(infoPath)
    // Binary plists start with "bplist"; XML starts with "<?xml" or whitespace + "<"
    if (raw[0] === 0x62 /* b */) {
      return plist.parse(raw as unknown as string) as Record<string, unknown>
    }
    return plist.parse(raw.toString('utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}
