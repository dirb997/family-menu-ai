import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

// Add debugging for i18n
console.log('i18n instance:', i18n)
console.log('Current locale:', i18n.global.locale)

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n)

app.mount('#app')

// Log when app is mounted
console.log('Vue app mounted')
