import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'

// Ensure messages are properly loaded by creating a concrete object
const messages = {
  en: en,
  ja: ja
}

// Debug messages in console
console.log('Loaded i18n messages:', messages)

export default createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages,
  warnHtmlMessage: false, // Suppress HTML warnings
  missingWarn: false, // Suppress missing message warnings
  fallbackWarn: false // Suppress fallback warnings
})
