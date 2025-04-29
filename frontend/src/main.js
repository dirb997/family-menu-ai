import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

// Enhanced debugging for i18n
console.log('Starting app initialization with i18n')
console.log('Current locale:', i18n.global.locale.value)

// Check if the messages are loaded properly
const availableMessages = i18n.global.availableLocales
console.log('Available locales:', availableMessages)
console.log('English messages sample:', 
  i18n.global.getLocaleMessage('en')?.nav ? 'Loaded correctly' : 'MISSING!'
)
console.log('Japanese messages sample:', 
  i18n.global.getLocaleMessage('ja')?.nav ? 'Loaded correctly' : 'MISSING!'
)

// Force set locale to ensure it's properly activated
i18n.global.locale.value = 'en'

const app = createApp(App)

// Mount i18n before router and store to ensure it's available
app.use(i18n)
app.use(router)
app.use(store)

app.mount('#app')

// Log when app is mounted
console.log('Vue app mounted with locale:', i18n.global.locale.value)
