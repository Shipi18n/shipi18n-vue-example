import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

// Create i18n instance with options
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en
  },
  // Enable pluralization
  pluralRules: {
    // Custom plural rules if needed
  }
})

// Function to dynamically load locale
export async function loadLocale(locale) {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale
    return
  }

  try {
    const messages = await import(`./locales/${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages.default)
    i18n.global.locale.value = locale
  } catch (error) {
    console.warn(`Locale ${locale} not found, falling back to en`)
    i18n.global.locale.value = 'en'
  }
}

// Function to add locale messages dynamically (for Shipi18n translations)
export function addLocaleMessages(locale, messages) {
  i18n.global.setLocaleMessage(locale, messages)
}

export default i18n
