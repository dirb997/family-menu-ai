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
  // JSON import handling - for translation files
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
  // Optimize build for production
  build: {
    outDir: 'dist',
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Group core libraries together
          'vendor': ['vue', 'vue-router', 'vuex'],
          // Group utilities separately
          'utils': ['axios']
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Ensure proper handling of static assets
    assetsInlineLimit: 4096,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true
      }
    }
  },
  // Add SPA base configuration
  base: '/'
})
