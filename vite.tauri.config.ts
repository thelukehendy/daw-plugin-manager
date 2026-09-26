import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Web-view build for the Tauri shell: same renderer, Tauri bridge instead of Electron preload. */
export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  define: { 'import.meta.env.VITE_SHELL': JSON.stringify('tauri') },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  publicDir: false,
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  build: {
    outDir: resolve(__dirname, 'dist-tauri/ui'),
    emptyOutDir: true,
    target: 'safari15',
  },
})
