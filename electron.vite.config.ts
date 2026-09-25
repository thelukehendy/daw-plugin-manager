import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Dev server only: serve a local scan for browser previews. Never part of a build. */
function devPreviewReport(): Plugin {
  const file = resolve(__dirname, '.dev/preview-report.json')
  return {
    name: 'dev-preview-report',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__dev-report.json', (_req, res) => {
        if (!existsSync(file)) {
          res.statusCode = 404
          res.end()
          return
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(readFileSync(file))
      })
    },
  }
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
        '@shared': resolve('src/shared')
      }
    },
    define: { 'import.meta.env.VITE_SHELL': JSON.stringify('electron') },
    plugins: [react(), devPreviewReport()]
  }
})
