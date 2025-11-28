# Shipi18n Vue Example

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/Shipi18n/shipi18n-vue-example)](https://github.com/Shipi18n/shipi18n-vue-example)
[![CI](https://github.com/Shipi18n/shipi18n-vue-example/actions/workflows/ci.yml/badge.svg)](https://github.com/Shipi18n/shipi18n-vue-example/actions)

A Vue 3 + vue-i18n example demonstrating how to integrate the [Shipi18n](https://shipi18n.com) translation API into your project.

> **Get started in 30 seconds**: Sign up at [shipi18n.com](https://shipi18n.com) to get your free API key instantly. No credit card required!

---

## Features

This example demonstrates:

- **File translation** - Upload `en.json`, download `es.json`, `fr.json`, etc.
- **Multi-language translation** in a single API call
- **vue-i18n integration** with dynamic locale loading
- **Placeholder preservation** for dynamic content (`{name}`, `{{value}}`, etc.)
- **Live translation** for quick testing
- **Native fetch API** (zero external HTTP dependencies)

---

## Prerequisites

- Node.js 18+ installed
- Free API key from [shipi18n.com](https://shipi18n.com)

---

## Quick start

### 1. Get your free API key

Visit [shipi18n.com](https://shipi18n.com) and sign up:

- **Free tier**: 100 translation keys, 3 languages
- **No credit card required**
- **Instant access**

### 2. Clone the repository

```bash
git clone https://github.com/shipi18n/shipi18n-vue-example.git
cd shipi18n-vue-example
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your API key

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
VITE_SHIPI18N_API_KEY=sk_live_your_api_key_here
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
shipi18n-vue-example/
├── src/
│   ├── components/
│   │   ├── FileTranslation.vue    # File upload/download workflow
│   │   ├── LiveTranslation.vue    # Live text translation
│   │   └── LocaleSwitcher.vue     # Language switcher
│   ├── lib/
│   │   └── shipi18n.js            # API client library
│   ├── locales/
│   │   └── en.json                # English translations
│   ├── App.vue                    # Main application
│   ├── i18n.js                    # vue-i18n configuration
│   ├── main.js                    # Entry point
│   └── style.css                  # Global styles
├── .env.example                   # Environment template
├── package.json
└── README.md
```

---

## Using the API client

The `src/lib/shipi18n.js` file provides a simple wrapper around the Shipi18n API.

### Basic translation

```javascript
import { translate } from './lib/shipi18n'

const result = await translate({
  text: 'Hello, World!',
  targetLanguages: ['es', 'fr', 'de']
})

console.log(result)
// {
//   es: [{ original: 'Hello, World!', translated: '¡Hola, Mundo!' }],
//   fr: [{ original: 'Hello, World!', translated: 'Bonjour le monde!' }],
//   de: [{ original: 'Hello, World!', translated: 'Hallo Welt!' }]
// }
```

### JSON translation

```javascript
import { translateJSON } from './lib/shipi18n'

const result = await translateJSON({
  json: {
    greeting: 'Hello',
    farewell: 'Goodbye'
  },
  targetLanguages: ['es']
})

console.log(result)
// {
//   es: {
//     greeting: 'Hola',
//     farewell: 'Adiós'
//   }
// }
```

### Preserve placeholders

```javascript
import { translate } from './lib/shipi18n'

const result = await translate({
  text: 'Hello {username}, you have {count} messages',
  targetLanguages: ['es'],
  preservePlaceholders: true
})

// Result: 'Hola {username}, tienes {count} mensajes'
```

---

## vue-i18n integration

This example shows how to dynamically add translated locales to vue-i18n:

```javascript
// src/i18n.js
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en }
})

// Add locale messages dynamically
export function addLocaleMessages(locale, messages) {
  i18n.global.setLocaleMessage(locale, messages)
}
```

After translating with Shipi18n, add the translations:

```javascript
import { translateJSON } from './lib/shipi18n'
import { addLocaleMessages } from './i18n'

const result = await translateJSON({
  json: englishMessages,
  targetLanguages: ['es', 'fr']
})

// Add to vue-i18n
addLocaleMessages('es', result.es)
addLocaleMessages('fr', result.fr)

// Now users can switch to Spanish or French!
```

---

## Workflow: Translating your locale files

1. **Upload your locale file** (e.g., `locales/en.json`)
2. **Select target languages** - Spanish, French, German, etc.
3. **Click "Translate"** - processed in one API call
4. **Download translated files** - drop into your `locales/` folder

### Before

```
my-app/
├── src/locales/
│   └── en.json        # You have this
```

### After

```
my-app/
├── src/locales/
│   ├── en.json        # Original
│   ├── es.json        # Downloaded
│   ├── fr.json        # Downloaded
│   └── de.json        # Downloaded
```

---

## Supported languages

Shipi18n supports **100+ languages** including:

- **es** - Spanish
- **fr** - French
- **de** - German
- **ja** - Japanese
- **zh** - Chinese (Simplified)
- **pt** - Portuguese
- **ru** - Russian
- **ar** - Arabic
- **ko** - Korean
- **it** - Italian
- And 90+ more...

---

## Environment variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SHIPI18N_API_KEY` | Your Shipi18n API key | Yes |
| `VITE_SHIPI18N_API_URL` | API base URL (optional) | No |

---

## Pricing

| Tier | Price | Keys | Languages | Rate Limit |
|------|-------|------|-----------|------------|
| **FREE** | $0/mo | 100 | 3 | 10 req/min |
| **STARTER** | $9/mo | 500 | 10 | 60 req/min |
| **PRO** | $29/mo | 10,000 | 100+ | 300 req/min |

---

## Building for production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Documentation & Resources

📚 **Full Documentation:** [shipi18n.com/integrations/vue](https://shipi18n.com/integrations/vue)

| Resource | Link |
|----------|------|
| **Getting Started** | [shipi18n.com](https://shipi18n.com) |
| **API Reference** | [shipi18n.com/api](https://shipi18n.com/api) |
| **i18next Best Practices** | [shipi18n.com/integrations/react](https://shipi18n.com/integrations/react) |
| **vue-i18n Documentation** | [vue-i18n.intlify.dev](https://vue-i18n.intlify.dev/) |
| **Blog & Tutorials** | [shipi18n.com/blog](https://shipi18n.com/blog) |

---

## Related Packages

| Package | Description |
|---------|-------------|
| [@shipi18n/api](https://www.npmjs.com/package/@shipi18n/api) | Node.js SDK for programmatic use |
| [@shipi18n/cli](https://www.npmjs.com/package/@shipi18n/cli) | CLI tool for translating files |
| [vite-plugin-shipi18n](https://www.npmjs.com/package/vite-plugin-shipi18n) | Vite plugin for build-time translation |
| [i18next-shipi18n-backend](https://www.npmjs.com/package/i18next-shipi18n-backend) | i18next backend for dynamic loading |
| [shipi18n-github-action](https://github.com/marketplace/actions/shipi18n-auto-translate) | GitHub Action for CI/CD |

## Other Examples

- [Node.js Example](https://github.com/Shipi18n/shipi18n-nodejs-example) - Basic usage examples

---

## License

MIT License

---

<p align="center">
  <a href="https://shipi18n.com">shipi18n.com</a> ·
  <a href="https://github.com/Shipi18n">GitHub</a> ·
  <a href="https://shipi18n.com/pricing">Pricing</a>
</p>
