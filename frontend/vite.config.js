import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // JSON import handling - ensure proper bundling of translation files
  json: {
    stringify: false,
  },
  // Define proxy for API requests
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  // Critical to ensure proper handling of the single-page application
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 4096,
  }
})
