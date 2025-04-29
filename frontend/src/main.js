import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

// Add debugging for i18n
console.log('i18n instance:', i18n)
console.log('Current locale:', i18n.global.locale)

// Log to confirm locale is set
if (i18n.global.locale.value) {
  console.log('Locale value confirmed as:', i18n.global.locale.value)
} else {
  console.warn('Locale value is not set correctly')
  // Force set it again just to be sure
  i18n.global.locale.value = 'en'
}

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.mount('#app')

// Log when app is mounted
console.log('Vue app mounted')
