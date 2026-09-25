/**
 * Golden scan check: run anonymized scan snapshots through the app's matcher against a
 * catalog build and compare with hand-checked expectations.
 *
 * Usage:
 *   npx tsx scripts/golden-scan-check.ts [--catalog catalog/catalog.json]...
 *     [--with-previous] [--fixtures catalog-store/fixtures/scans] [--report-only] [--dump out.json]
 *
 * `--catalog` may repeat. `--with-previous` also checks the previous committed version of
 * catalog/catalog.json, so a matcher change is proven against data it wasn't tuned on.
 *
 * Fixtures: `<machine>.json` (ScanSnapshot) + `<machine>.expected.json`.
 * Exit 1 on any unexpected mismatch unless --report-only. Expectations flagged
 * `knownDataIssue` are reported but never fail the run.
 */
import { execFileSync } from 'child_process'
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
  /** Catalog buildId whose data fix makes this pass; older builds report it as known. */
  dataFixedIn?: string
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

function args(flag: string): string[] {
  return process.argv.flatMap((a, i) =>
    a === flag && process.argv[i + 1] ? [process.argv[i + 1]] : []
  )
}

interface CatalogSource {
  label: string
  json: string
}

function previousCatalog(): CatalogSource {
  const git = (...a: string[]) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 << 20 })
  const commits = git('log', '-2', '--format=%H', '--', 'catalog/catalog.json').trim().split('\n')
  if (commits.length < 2) throw new Error('No previous catalog/catalog.json commit found')
  return {
    label: `previous (${commits[1].slice(0, 8)})`,
    json: git('show', `${commits[1]}:catalog/catalog.json`),
  }
}

async function main() {
  const catalogPaths = args('--catalog')
  const sources: CatalogSource[] = (
    catalogPaths.length ? catalogPaths : ['catalog/catalog.json']
  ).map((p) => ({ label: p, json: readFileSync(resolve(p), 'utf8') }))
  if (process.argv.includes('--with-previous')) sources.push(previousCatalog())
  const fixturesDir = resolve(arg('--fixtures') || 'catalog-store/fixtures/scans')
  const reportOnly = process.argv.includes('--report-only')
  const dumpPath = arg('--dump')

  const snapshots = readdirSync(fixturesDir).filter(
    (f) => f.endsWith('.json') && !f.endsWith('.expected.json')
  )

  let hardTotal = 0
  const dump: Record<string, unknown[]> = {}

  for (const source of sources) {
    const catalog = parsePluginCatalog(JSON.parse(source.json), 'golden')
    const manufacturerIds = new Set(catalog.manufacturers.map((m) => m.id))
    const orphans = catalog.plugins.filter((p) => !manufacturerIds.has(p.manufacturerId))
    const failures: Failure[] = []
    let checked = 0
    console.log(`\n== ${source.label} (${catalog.updatedAt})`)
    if (orphans.length) {
      console.log(
        `  data: ${orphans.length} rows reference a manufacturerId that doesn't exist (${orphans
          .slice(0, 5)
          .map((p) => `${p.id} → ${p.manufacturerId}`)
          .join(', ')}${orphans.length > 5 ? ', …' : ''}); the app can't match them`
      )
    }

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
            knownDataIssue:
            !!exp.knownDataIssue || (!!exp.dataFixedIn && catalog.updatedAt < exp.dataFixedIn),
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
      console.log(
        `${machine}: ${rows.length} rows in ${ms} ms, ${expected.expectations.length} expectations`
      )
    }

    const hard = failures.filter((f) => !f.knownDataIssue)
    const known = failures.filter((f) => f.knownDataIssue)
    for (const f of known) {
      console.log(
        `  known data issue  ${f.machine} / ${f.name}: expected ${f.expected}, got ${f.actual}`
      )
    }
    for (const f of hard) {
      console.log(
        `  FAIL  ${f.machine} / ${f.name}: expected ${f.expected}, got ${f.actual}${f.note ? ` (${f.note})` : ''}`
      )
    }
    console.log(
      `${checked} checked, ${checked - failures.length} pass, ${hard.length} fail, ${known.length} known data issues`
    )
    hardTotal += hard.length
  }

  if (dumpPath) writeFileSync(dumpPath, JSON.stringify(dump, null, 1))
  if (hardTotal && !reportOnly) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
