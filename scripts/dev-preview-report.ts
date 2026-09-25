/**
 * Write a real scan report for previewing the renderer in a plain browser.
 * Usage: npx tsx scripts/dev-preview-report.ts  (output is gitignored)
 */
import { writeFileSync } from 'fs'
import '../src/main/registerNodePlatform'
import { runFullScan } from '../src/main/scanService'

runFullScan(() => {}, { preferBundledCatalog: true }).then((report) => {
  writeFileSync('src/renderer/public/__dev-report.json', JSON.stringify(report))
  console.log(`${report.rows.length} rows, ${report.daws.length} DAWs`)
})
