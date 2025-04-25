import { createI18n } from 'vue-i18n'
import { enFallback, jaFallback } from './fallback-translations'

// Try to import the actual translations
let en, ja;

try {
  // Dynamic imports for JSON files
  en = import.meta.glob('./locales/en.json', { eager: true })['./locales/en.json'].default;
  console.log('Successfully loaded English translations');
} catch (error) {
  console.warn('Falling back to hardcoded English translations:', error);
  en = enFallback;
}

try {
  ja = import.meta.glob('./locales/ja.json', { eager: true })['./locales/ja.json'].default;
  console.log('Successfully loaded Japanese translations');
} catch (error) {
  console.warn('Falling back to hardcoded Japanese translations:', error);
  ja = jaFallback;
}

// Create messages object
const messages = { en, ja };
console.log('Loaded i18n messages:', messages);

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  warnHtmlMessage: false,
  missingWarn: false,
  fallbackWarn: false
})
