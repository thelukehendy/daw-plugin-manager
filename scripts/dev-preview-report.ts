/**
 * Write a real scan report for previewing the renderer in a plain browser.
 * Usage: npx tsx scripts/dev-preview-report.ts  (writes .dev/preview-report.json, gitignored;
 * served only by the dev server, never bundled)
 */
import { mkdirSync, writeFileSync } from 'fs'
import '../src/main/registerNodePlatform'
import { runFullScan } from '../src/main/scanService'

runFullScan(() => {}, { preferBundledCatalog: true }).then((report) => {
  mkdirSync('.dev', { recursive: true })
  writeFileSync('.dev/preview-report.json', JSON.stringify(report))
  console.log(`${report.rows.length} rows, ${report.daws.length} DAWs`)
})
