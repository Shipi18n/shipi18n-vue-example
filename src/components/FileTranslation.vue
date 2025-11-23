<script setup>
import { ref, computed } from 'vue'
import { translateJSON } from '../lib/shipi18n'
import { addLocaleMessages } from '../i18n'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const fileContent = ref(null)
const fileName = ref('')
const selectedLanguages = ref(['es', 'fr'])
const translations = ref({})
const loading = ref(false)
const error = ref('')

const availableLanguages = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
]

const hasTranslations = computed(() => Object.keys(translations.value).length > 0)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name
  error.value = ''
  translations.value = {}

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      fileContent.value = JSON.parse(e.target.result)
    } catch (err) {
      error.value = 'Invalid JSON file. Please upload a valid JSON file.'
      fileContent.value = null
    }
  }
  reader.readAsText(file)
}

async function translateFile() {
  if (!fileContent.value || selectedLanguages.value.length === 0) return

  loading.value = true
  error.value = ''

  try {
    const result = await translateJSON({
      json: fileContent.value,
      targetLanguages: selectedLanguages.value,
      preservePlaceholders: true
    })

    translations.value = result.translations || result

    // Add translations to vue-i18n so user can switch to them
    for (const [lang, messages] of Object.entries(translations.value)) {
      addLocaleMessages(lang, messages)
    }
  } catch (err) {
    error.value = err.message || 'Translation failed. Please try again.'
  } finally {
    loading.value = false
  }
}

function downloadTranslation(langCode) {
  const content = translations.value[langCode]
  if (!content) return

  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${langCode}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function applyTranslation(langCode) {
  locale.value = langCode
}

function toggleLanguage(code) {
  const index = selectedLanguages.value.indexOf(code)
  if (index > -1) {
    selectedLanguages.value.splice(index, 1)
  } else {
    selectedLanguages.value.push(code)
  }
}
</script>

<template>
  <div class="file-translation">
    <h2>📁 File Translation</h2>
    <p class="description">
      Upload your <code>en.json</code> locale file, select target languages, and download translated files.
    </p>

    <!-- File Upload -->
    <div class="upload-section">
      <label class="upload-btn">
        <input type="file" accept=".json" @change="handleFileUpload" hidden />
        <span>{{ fileName || 'Choose JSON file...' }}</span>
      </label>
      <span v-if="fileContent" class="file-info">
        ✓ {{ Object.keys(fileContent).length }} keys loaded
      </span>
    </div>

    <!-- Language Selection -->
    <div class="language-section">
      <h3>Target Languages</h3>
      <div class="language-grid">
        <label
          v-for="lang in availableLanguages"
          :key="lang.code"
          class="language-option"
        >
          <input
            type="checkbox"
            :checked="selectedLanguages.includes(lang.code)"
            @change="toggleLanguage(lang.code)"
          />
          <span class="flag">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
        </label>
      </div>
    </div>

    <!-- Translate Button -->
    <button
      class="translate-btn"
      :disabled="!fileContent || selectedLanguages.length === 0 || loading"
      @click="translateFile"
    >
      <span v-if="loading">Translating...</span>
      <span v-else>Translate to {{ selectedLanguages.length }} language(s)</span>
    </button>

    <!-- Error Message -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Results -->
    <div v-if="hasTranslations" class="results">
      <h3>✅ Translations Ready</h3>
      <div class="result-grid">
        <div
          v-for="(content, langCode) in translations"
          :key="langCode"
          class="result-card"
        >
          <div class="result-header">
            <span class="lang-code">{{ langCode }}.json</span>
          </div>
          <div class="result-actions">
            <button class="action-btn download" @click="downloadTranslation(langCode)">
              ⬇️ Download
            </button>
            <button class="action-btn apply" @click="applyTranslation(langCode)">
              🔄 Apply
            </button>
          </div>
          <pre class="preview">{{ JSON.stringify(content, null, 2).slice(0, 200) }}...</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-translation {
  padding: 1rem;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
}

code {
  background: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.upload-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  border-color: #4a90d9;
  background: #f0f7ff;
}

.file-info {
  color: #27ae60;
  font-weight: 500;
}

.language-section {
  margin-bottom: 1.5rem;
}

.language-section h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #555;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.language-option:hover {
  background: #f5f5f5;
}

.language-option input:checked + .flag + span {
  font-weight: 600;
}

.flag {
  font-size: 1.2rem;
}

.translate-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: #4a90d9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.translate-btn:hover:not(:disabled) {
  background: #357abd;
}

.translate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffeaea;
  color: #c0392b;
  border-radius: 8px;
}

.results {
  margin-top: 2rem;
}

.results h3 {
  color: #27ae60;
  margin-bottom: 1rem;
}

.result-grid {
  display: grid;
  gap: 1rem;
}

.result-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
}

.result-header {
  margin-bottom: 0.75rem;
}

.lang-code {
  font-weight: 600;
  font-family: monospace;
  font-size: 1.1rem;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn.download {
  background: #27ae60;
  color: white;
}

.action-btn.apply {
  background: #f39c12;
  color: white;
}

.preview {
  background: #f8f8f8;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  overflow: auto;
  max-height: 150px;
  margin: 0;
}
</style>
