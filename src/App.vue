<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FileTranslation from './components/FileTranslation.vue'
import LiveTranslation from './components/LiveTranslation.vue'
import LocaleSwitcher from './components/LocaleSwitcher.vue'

const { t, locale } = useI18n()

const activeTab = ref('file')
const tabs = [
  { id: 'file', label: 'File Translation', icon: '📁' },
  { id: 'live', label: 'Live Translation', icon: '⚡' }
]
</script>

<template>
  <div class="app">
    <header>
      <h1>{{ t('app.title') }}</h1>
      <p class="subtitle">{{ t('app.description') }}</p>
      <LocaleSwitcher />
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </nav>

    <main>
      <FileTranslation v-if="activeTab === 'file'" />
      <LiveTranslation v-else-if="activeTab === 'live'" />
    </main>

    <footer>
      <p>
        Built with <a href="https://shipi18n.com" target="_blank">Shipi18n</a> +
        <a href="https://vue-i18n.intlify.dev/" target="_blank">vue-i18n</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s;
}

.tab:hover {
  background: #f5f5f5;
  color: #333;
}

.tab.active {
  background: #4a90d9;
  color: white;
}

.icon {
  font-size: 1.2rem;
}

main {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

footer {
  text-align: center;
  margin-top: 2rem;
  color: #888;
  font-size: 0.9rem;
}

footer a {
  color: #4a90d9;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
