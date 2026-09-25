/**
 * Write a real scan report for previewing the renderer in a plain browser.
 * Usage: npx tsx scripts/dev-preview-report.ts  (output is gitignored)
 */
import { writeFileSync } from 'fs'
import { runFullScan } from '../src/main/scanService'

runFullScan(() => {}, { preferBundledCatalog: true, userDataPath: '/tmp/dpm-preview-userdata' }).then((report) => {
  writeFileSync('src/renderer/public/__dev-report.json', JSON.stringify(report))
  console.log(`${report.rows.length} rows, ${report.daws.length} DAWs`)
})
