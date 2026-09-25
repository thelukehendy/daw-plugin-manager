import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { installDevPreviewBridge } from './devPreviewBridge'

async function boot() {
  if (import.meta.env.VITE_SHELL === 'tauri') {
    const { installTauriBridge } = await import('./tauriBridge')
    await installTauriBridge()
  } else if (import.meta.env.DEV) {
    installDevPreviewBridge()
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

void boot()
