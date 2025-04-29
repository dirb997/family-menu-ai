import { createI18n } from 'vue-i18n'
import enLocale from './locales/en.json'
import jaLocale from './locales/ja.json'

// Ensure messages are loaded synchronously and properly bundled
console.log('Loading i18n configuration');

// Initialize messages object with imported JSON directly
const messages = {
  en: enLocale,
  ja: jaLocale
};

// Debug the loaded messages to ensure they're available
console.log('Loaded i18n messages object structure:', 
  Object.keys(messages).map(locale => `${locale}: ${Object.keys(messages[locale] || {}).length} keys`)
);

if (!messages.en || !messages.ja) {
  console.error('Failed to load one or more locale files!');
}

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
  console.warn('Locale value not set, forcing to "en"');
  i18n.global.locale.value = 'en';
}

console.log('i18n instance created with locale:', i18n.global.locale.value);

export default i18n;
