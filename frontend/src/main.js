import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Initialize app without i18n
console.log('Starting app initialization')

const app = createApp(App)

app.use(router)
app.use(store)

// Using provide/inject pattern to make translations available globally
import { useTranslations } from './utils/translations'
const { t, locale, availableLocales } = useTranslations()
app.provide('translations', { t, locale, availableLocales })

app.mount('#app')

// Log when app is mounted
console.log('Vue app mounted with locale:', locale.value)
