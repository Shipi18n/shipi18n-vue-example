import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import shipi18n from 'vite-plugin-shipi18n'

export default defineConfig({
  plugins: [
    vue(),
    // Translates src/locales/en/*.json into the target languages during the
    // build, using YOUR provider key from the environment. Results are cached,
    // so an unchanged build makes no model calls at all — and no key ever
    // reaches the browser, because this runs before the bundler.
    shipi18n({
      provider: 'anthropic',
      targetLanguages: ['es', 'fr', 'de'],
      sourceDir: 'src/locales/en',
      outputDir: 'src/locales',
      // apiKey defaults to ANTHROPIC_API_KEY / OPENAI_API_KEY
    }),
  ],
  server: { port: 3000 },
})
