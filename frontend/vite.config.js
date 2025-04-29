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
  // JSON import handling - ensure proper bundling of i18n files
  json: {
    // Don't stringify for better compatibility with vue-i18n
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
    // Generate a _redirects file for Netlify/Render to handle SPA routing
    rollupOptions: {
      output: {
        manualChunks: {
          'i18n': ['vue-i18n'],
          'vendor': ['vue', 'vue-router', 'vuex'],
        },
      },
    },
    // Enable source maps for better debugging
    sourcemap: true,
  }
})
