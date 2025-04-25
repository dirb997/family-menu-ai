import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import jsonPreprocessor from './vite-plugins/json-preprocessor'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Add our custom JSON preprocessor before other plugins
    jsonPreprocessor(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Add explicit JSON handling
  json: {
    stringify: true,
  },
  // Ensure all imported assets are properly processed
  assetsInclude: ['**/*.json'],
})
