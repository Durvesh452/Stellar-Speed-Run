import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // stellar-sdk requires these Node.js globals in the browser
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      // Ensure Buffer is available (used by stellar-sdk)
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
