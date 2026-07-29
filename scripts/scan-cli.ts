/**
 * Headless CLI scan for testing / automation.
 * Usage: npm run scan:cli
 */
import { writeFileSync } from 'fs'
import { join } from 'path'
import { runFullScan } from '../src/main/scanService'

async function main() {
  console.log('DAW Plugin Manager — discovery scan (read-only)\n')

  const report = await runFullScan(
    (p) => {
      process.stdout.write(`\r[${String(p.percent).padStart(3)}%] ${p.message}`.padEnd(80))
    },
    { preferBundledCatalog: true }
  )

  console.log('\n')
  console.log(`DAWs: ${report.summary.dawCount}`)
  for (const daw of report.daws) console.log(`  - ${daw.name} ${daw.version || ''}`)
  console.log(`\nManufacturers: ${report.summary.manufacturerCount}`)
  console.log(`Products: ${report.summary.pluginCount}`)
  console.log(`Bundles: ${report.summary.pluginBundleCount}`)
  console.log(`  current: ${report.summary.current}`)
  console.log(`  outdated: ${report.summary.outdated}`)
  console.log(`  unknown: ${report.summary.unknown}`)
  console.log(`  bundled: ${report.summary.bundled}`)
  console.log(`  products with legacy installs: ${report.summary.legacy}`)
  console.log(`  compat warnings: ${report.summary.compatWarnings}`)
  console.log(`\nCatalog: ${report.catalog.source}`)

  const outPath = join(process.cwd(), 'scan-report.json')
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`\nFull report written to ${outPath}`)

  const kontakt = report.rows.filter((r) => /kontakt/i.test(r.productLine))
  if (kontakt.length) {
    console.log('\nKontakt line:')
    for (const row of kontakt) {
      console.log(
        `  ${row.name}: newest=${row.installedVersion} latest=${row.latestVersion} status=${row.status} bundles=${row.installCount}`
      )
      for (const v of row.versionDetails) {
        console.log(`    ${v.legacy ? 'legacy' : 'active'} ${v.name} ${v.version}`)
      }
    }
  }

  const outdated = report.rows.filter((r) => r.status === 'outdated').slice(0, 12)
  if (outdated.length) {
    console.log('\nSample outdated:')
    for (const row of outdated) {
      console.log(`  ${row.manufacturer} / ${row.name}: ${row.installedVersion} → ${row.latestVersion}`)
      if (row.updateUrl) console.log(`    portal: ${row.updateUrl}`)
    }
  }

  const unknown = report.rows.filter((r) => r.status === 'unknown')
  console.log(`\nUnknown remaining: ${unknown.length}`)
  for (const row of unknown.slice(0, 20)) {
    console.log(`  ${row.manufacturer} / ${row.name}: ${row.installedVersion}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
