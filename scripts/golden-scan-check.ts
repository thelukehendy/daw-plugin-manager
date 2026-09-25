/**
 * Golden scan check: run anonymized scan snapshots through the app's matcher against a
 * catalog build and compare with hand-checked expectations.
 *
 * Usage:
 *   npx tsx scripts/golden-scan-check.ts [--catalog catalog/catalog.json]
 *     [--fixtures catalog-store/fixtures/scans] [--report-only] [--dump out.json]
 *
 * Fixtures: `<machine>.json` (ScanSnapshot) + `<machine>.expected.json`.
 * Exit 1 on any unexpected mismatch unless --report-only. Expectations flagged
 * `knownDataIssue` are reported but never fail the run.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { buildReportRows } from '../src/main/catalog/catalogService'
import { parsePluginCatalog } from '../src/main/catalog/catalogParse'
import {
  dawsFromSnapshot,
  pluginsFromSnapshot,
  type ScanSnapshot,
} from '../src/shared/scanSnapshot'
import type { PluginReportRow, SystemInfo, UpdateStatus } from '../src/shared/types'

interface Expectation {
  /** Installed product name as grouped by the app (row name). */
  name: string
  /** Expected catalog row id; null = must stay unmatched. */
  catalogPluginId: string | null
  /** Only for statuses that don't drift with new releases (discontinued, content…). */
  status?: UpdateStatus
  statusNotIn?: UpdateStatus[]
  knownDataIssue?: boolean
  note?: string
}

interface ExpectedFile {
  snapshot: string
  expectations: Expectation[]
}

interface Failure {
  machine: string
  name: string
  expected: string
  actual: string
  knownDataIssue: boolean
  note?: string
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main() {
  const catalogPath = resolve(arg('--catalog') || 'catalog/catalog.json')
  const fixturesDir = resolve(arg('--fixtures') || 'catalog-store/fixtures/scans')
  const reportOnly = process.argv.includes('--report-only')
  const dumpPath = arg('--dump')

  const catalog = parsePluginCatalog(JSON.parse(readFileSync(catalogPath, 'utf8')), 'golden')
  const snapshots = readdirSync(fixturesDir).filter(
    (f) => f.endsWith('.json') && !f.endsWith('.expected.json')
  )

  const failures: Failure[] = []
  let checked = 0
  const dump: Record<string, unknown[]> = {}

  for (const file of snapshots) {
    const machine = file.replace(/\.json$/, '')
    const snapshot = JSON.parse(readFileSync(join(fixturesDir, file), 'utf8')) as ScanSnapshot
    const system: SystemInfo = {
      platform: snapshot.platform,
      osVersion: snapshot.osVersion,
      arch: snapshot.arch,
      homedir: '',
      scannedAt: snapshot.capturedAt,
    }
    const t0 = Date.now()
    const rows = await buildReportRows(
      pluginsFromSnapshot(snapshot),
      catalog,
      system,
      dawsFromSnapshot(snapshot)
    )
    const ms = Date.now() - t0
    const byName = new Map<string, PluginReportRow[]>()
    for (const r of rows) byName.set(r.name, [...(byName.get(r.name) || []), r])

    dump[machine] = rows.map((r) => ({
      name: r.name,
      manufacturer: r.manufacturer,
      installed: r.installedVersion,
      latest: r.latestVersion,
      finalVersion: r.finalVersion ?? null,
      status: r.status,
      catalogPluginId: r.catalogPluginId ?? null,
      matchMethod: r.matchMethod ?? null,
    }))

    const expectedPath = join(fixturesDir, `${machine}.expected.json`)
    if (!existsSync(expectedPath)) {
      console.log(`${machine}: ${rows.length} rows in ${ms} ms (no expectations file)`)
      continue
    }
    const expected = JSON.parse(readFileSync(expectedPath, 'utf8')) as ExpectedFile

    for (const exp of expected.expectations) {
      checked++
      const hits = byName.get(exp.name) || []
      const row = hits.length === 1 ? hits[0] : undefined
      const fail = (expectedText: string, actualText: string) =>
        failures.push({
          machine,
          name: exp.name,
          expected: expectedText,
          actual: actualText,
          knownDataIssue: !!exp.knownDataIssue,
          note: exp.note,
        })
      if (!row) {
        fail('exactly one row', `${hits.length} rows`)
        continue
      }
      const actualId = row.catalogPluginId ?? null
      if (actualId !== exp.catalogPluginId) {
        fail(`match ${exp.catalogPluginId ?? '(none)'}`, `match ${actualId ?? '(none)'}`)
        continue
      }
      if (exp.status && row.status !== exp.status) {
        fail(`status ${exp.status}`, `status ${row.status}`)
        continue
      }
      if (exp.statusNotIn?.includes(row.status)) {
        fail(`status not in [${exp.statusNotIn.join(', ')}]`, `status ${row.status}`)
      }
    }
    console.log(`${machine}: ${rows.length} rows in ${ms} ms, ${expected.expectations.length} expectations`)
  }

  if (dumpPath) writeFileSync(dumpPath, JSON.stringify(dump, null, 1))

  const hard = failures.filter((f) => !f.knownDataIssue)
  const known = failures.filter((f) => f.knownDataIssue)
  for (const f of known) {
    console.log(`  known data issue  ${f.machine} / ${f.name}: expected ${f.expected}, got ${f.actual}`)
  }
  for (const f of hard) {
    console.log(`  FAIL  ${f.machine} / ${f.name}: expected ${f.expected}, got ${f.actual}${f.note ? ` (${f.note})` : ''}`)
  }
  console.log(
    `\n${checked} checked, ${checked - failures.length} pass, ${hard.length} fail, ${known.length} known data issues`
  )
  if (hard.length && !reportOnly) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
