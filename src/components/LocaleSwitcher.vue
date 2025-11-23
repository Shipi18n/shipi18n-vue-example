<script setup>
import { useI18n } from 'vue-i18n'
import { loadLocale } from '../i18n'

const { locale, availableLocales } = useI18n()

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' }
}

async function changeLocale(newLocale) {
  await loadLocale(newLocale)
}
</script>

<template>
  <div class="locale-switcher">
    <label>Language:</label>
    <select :value="locale" @change="changeLocale($event.target.value)">
      <option
        v-for="(lang, code) in languages"
        :key="code"
        :value="code"
      >
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
    <p class="hint">
      <em>Translate your locale files with Shipi18n to add more languages!</em>
    </p>
  </div>
</template>

<style scoped>
.locale-switcher {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

label {
  font-weight: 500;
  color: #555;
}

select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

select:hover {
  border-color: #4a90d9;
}

.hint {
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}
</style>
