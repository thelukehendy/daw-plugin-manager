/**
 * Capture an anonymized scan snapshot of this machine (read-only scan).
 * Usage: npx tsx scripts/capture-scan-snapshot.ts <out.json>
 */
import '../src/main/registerNodePlatform'
import { writeFileSync } from 'fs'
import { arch, platform, release } from 'os'
import { execFileSync } from 'child_process'
import { scanPlugins } from '../src/main/scanner/pluginScanner'
import { scanDaws } from '../src/main/scanner/dawScanner'
import { toScanSnapshot } from '../src/shared/scanSnapshot'

function osVersion(): string | null {
  if (platform() !== 'darwin') return release()
  try {
    return execFileSync('sw_vers', ['-productVersion'], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

async function main() {
  const out = process.argv[2]
  if (!out) {
    console.error('Usage: npx tsx scripts/capture-scan-snapshot.ts <out.json>')
    process.exit(2)
  }
  const plugins = await scanPlugins([])
  const daws = await scanDaws()
  const snapshot = toScanSnapshot(plugins, daws, {
    platform: platform(),
    arch: arch(),
    osVersion: osVersion(),
  })
  writeFileSync(out, JSON.stringify(snapshot, null, 1) + '\n')
  console.log(`${snapshot.plugins.length} plugins, ${snapshot.daws.length} DAWs → ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
