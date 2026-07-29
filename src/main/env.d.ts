import { defineConfig } from 'electron-vite'

// Ambient for electron-vite env injected at runtime
declare namespace NodeJS {
  interface ProcessEnv {
    ELECTRON_RENDERER_URL?: string
  }
}

export {}
