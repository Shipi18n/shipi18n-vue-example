<script setup>
import { ref } from 'vue'
import { translate } from '../lib/shipi18n'

const inputText = ref('Hello, welcome to our application!')
const targetLanguage = ref('es')
const translatedText = ref('')
const loading = ref(false)
const error = ref('')

const languages = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' }
]

async function handleTranslate() {
  if (!inputText.value.trim()) return

  loading.value = true
  error.value = ''
  translatedText.value = ''

  try {
    const result = await translate({
      text: inputText.value,
      targetLanguages: [targetLanguage.value],
      preservePlaceholders: true
    })

    // Extract translated text from response
    const langResult = result.translations?.[targetLanguage.value] || result[targetLanguage.value]
    if (Array.isArray(langResult) && langResult[0]) {
      translatedText.value = langResult[0].translated || langResult[0]
    } else if (typeof langResult === 'string') {
      translatedText.value = langResult
    } else {
      translatedText.value = JSON.stringify(langResult)
    }
  } catch (err) {
    error.value = err.message || 'Translation failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="live-translation">
    <h2>⚡ Live Translation</h2>
    <p class="description">
      Test the Shipi18n API with live text translation. Placeholders like <code>{name}</code> are preserved.
    </p>

    <div class="translation-box">
      <!-- Input -->
      <div class="input-section">
        <label>English (source)</label>
        <textarea
          v-model="inputText"
          placeholder="Enter text to translate..."
          rows="4"
        ></textarea>
      </div>

      <!-- Controls -->
      <div class="controls">
        <select v-model="targetLanguage">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.flag }} {{ lang.name }}
          </option>
        </select>
        <button
          class="translate-btn"
          :disabled="loading || !inputText.trim()"
          @click="handleTranslate"
        >
          {{ loading ? 'Translating...' : 'Translate →' }}
        </button>
      </div>

      <!-- Output -->
      <div class="output-section">
        <label>{{ languages.find(l => l.code === targetLanguage)?.name }} (translated)</label>
        <textarea
          :value="translatedText"
          placeholder="Translation will appear here..."
          rows="4"
          readonly
        ></textarea>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Examples -->
    <div class="examples">
      <h3>Try these examples:</h3>
      <div class="example-buttons">
        <button @click="inputText = 'Hello, {name}! Welcome back.'">
          With placeholder
        </button>
        <button @click="inputText = 'You have {count} new messages'">
          Count placeholder
        </button>
        <button @click="inputText = 'Click <strong>here</strong> to continue'">
          With HTML tags
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-translation {
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

.translation-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #555;
}

textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #4a90d9;
}

textarea[readonly] {
  background: #f9f9f9;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.translate-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
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

.examples {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.examples h3 {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.75rem;
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-buttons button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.example-buttons button:hover {
  background: #e8e8e8;
  border-color: #ccc;
}
</style>
