import { createI18n } from 'vue-i18n'
import enLocale from './locales/en.json'
import jaLocale from './locales/ja.json'

// Initialize messages object with imported JSON directly
const messages = {
  en: enLocale,
  ja: jaLocale
};

console.log('Loaded i18n messages:', messages);

// Create i18n instance with explicit locale initialization
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages, // Use directly imported messages
  warnHtmlMessage: false, // Suppress HTML warnings
  missingWarn: false, // Suppress missing message warnings
  fallbackWarn: false // Suppress fallback warnings
});

// Make sure the locale is properly set
if (!i18n.global.locale.value) {
  i18n.global.locale.value = 'en';
}

// We don't need a separate load function anymore, but keeping it for compatibility
export const loadI18nMessages = async () => {
  console.log('i18n messages already loaded:', messages);
  return messages;
};

export default i18n;
