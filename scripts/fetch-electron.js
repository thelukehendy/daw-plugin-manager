/**
 * Fetches the Electron binary when npm install scripts are blocked.
 * Usage: npm run electron:fetch
 */
const { execSync } = require('child_process')
const { existsSync, mkdirSync, writeFileSync, rmSync } = require('fs')
const { join } = require('path')

const pkg = require('../node_modules/electron/package.json')
const ver = pkg.version
const arch = process.arch === 'arm64' ? 'arm64' : 'x64'
const platform = process.platform
if (platform !== 'darwin') {
  console.error('This helper currently supports macOS only.')
  process.exit(1)
}

const url = `https://github.com/electron/electron/releases/download/v${ver}/electron-v${ver}-darwin-${arch}.zip`
const dist = join(__dirname, '../node_modules/electron/dist')
const zip = '/tmp/electron-daw-plugin-manager.zip'

console.log(`Fetching Electron ${ver} (${arch})…`)
rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })
execSync(`curl -L "${url}" -o "${zip}"`, { stdio: 'inherit' })
execSync(`unzip -q "${zip}" -d "${dist}"`, { stdio: 'inherit' })
writeFileSync(join(__dirname, '../node_modules/electron/path.txt'), 'Electron.app/Contents/MacOS/Electron')

const bin = join(dist, 'Electron.app/Contents/MacOS/Electron')
if (!existsSync(bin)) {
  console.error('Electron binary missing after download')
  process.exit(1)
}
console.log('Electron ready:', bin)
