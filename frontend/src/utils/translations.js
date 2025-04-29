// filepath: /Users/diego/Desktop/familyMenu-builder/frontend/src/utils/translations.js
import { ref, computed } from 'vue'
import enTranslations from '../i18n/locales/en.json'
import jaTranslations from '../i18n/locales/ja.json'

// Create a reactive currentLocale that can be changed throughout the app
const currentLocale = ref('en')

// Store all translations
const translations = {
  en: enTranslations,
  ja: jaTranslations
}

// Helper function to get nested properties using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined
  }, obj)
}

// Translation function
function t(key, params = {}) {
  const locale = currentLocale.value
  const message = getNestedValue(translations[locale], key) || key
  
  if (typeof message === 'string') {
    return message.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : `{${paramKey}}`
    })
  }
  
  return key
}

// Function to change the current locale
function setLocale(locale) {
  if (translations[locale]) {
    currentLocale.value = locale
    document.querySelector('html').setAttribute('lang', locale)
    return true
  }
  return false
}

// Current locale as a computed property for reactivity
const locale = computed({
  get: () => currentLocale.value,
  set: (value) => setLocale(value)
})

// Export a composable function to use in components
export function useTranslations() {
  return {
    t,
    locale,
    setLocale,
    availableLocales: Object.keys(translations)
  }
}

// Initialize HTML lang attribute
document.querySelector('html').setAttribute('lang', currentLocale.value)