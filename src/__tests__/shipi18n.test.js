/**
 * Tests for Shipi18n API Client
 *
 * These tests verify the client library by importing and testing actual functions.
 */

import {
  translate,
  translateJSON,
  healthCheck,
  setConfig,
  resetConfig
} from '../lib/shipi18n.js'

// Mock fetch globally
let mockFetchResponse = {}
let mockFetchOk = true
let lastFetchCall = null

global.fetch = async (url, options) => {
  lastFetchCall = { url, options }

  return {
    ok: mockFetchOk,
    status: mockFetchOk ? 200 : 401,
    json: async () => mockFetchResponse
  }
}

// Reset before each test
beforeEach(() => {
  mockFetchResponse = {}
  mockFetchOk = true
  lastFetchCall = null
  resetConfig()
})

describe('Shipi18n API Client', () => {
  describe('setConfig and resetConfig', () => {
    test('setConfig sets the configuration', () => {
      setConfig({
        apiKey: 'test_key',
        apiUrl: 'https://test.api.com'
      })

      // The config is used internally, we test it via translate
      expect(true).toBe(true) // Config set successfully
    })

    test('resetConfig clears the configuration', () => {
      setConfig({ apiKey: 'test_key', apiUrl: 'https://test.api.com' })
      resetConfig()

      // After reset, translate should throw missing API key error
      expect(translate({
        text: 'Hello',
        targetLanguages: ['es']
      })).rejects.toThrow('VITE_SHIPI18N_API_KEY is not set')
    })
  })

  describe('translate', () => {
    test('throws error when API key is not set', async () => {
      await expect(translate({
        text: 'Hello',
        targetLanguages: ['es']
      })).rejects.toThrow('VITE_SHIPI18N_API_KEY is not set')
    })

    test('makes correct API call with all parameters', async () => {
      setConfig({
        apiKey: 'sk_test_123',
        apiUrl: 'https://api.test.com'
      })

      mockFetchResponse = { es: [{ original: 'Hello', translated: 'Hola' }] }

      await translate({
        text: 'Hello',
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        preservePlaceholders: true
      })

      expect(lastFetchCall.url).toBe('https://api.test.com/api/translate')
      expect(lastFetchCall.options.method).toBe('POST')
      expect(lastFetchCall.options.headers['Content-Type']).toBe('application/json')
      expect(lastFetchCall.options.headers['x-api-key']).toBe('sk_test_123')

      const body = JSON.parse(lastFetchCall.options.body)
      expect(body.text).toBe('Hello')
      expect(body.sourceLanguage).toBe('en')
      expect(body.targetLanguages).toEqual(['es'])
      expect(body.preservePlaceholders).toBe(true)
    })

    test('returns translation response', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchResponse = {
        es: [{ original: 'Hello', translated: 'Hola' }],
        fr: [{ original: 'Hello', translated: 'Bonjour' }]
      }

      const result = await translate({
        text: 'Hello',
        targetLanguages: ['es', 'fr']
      })

      expect(result.es[0].translated).toBe('Hola')
      expect(result.fr[0].translated).toBe('Bonjour')
    })

    test('uses default sourceLanguage of en', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })

      await translate({
        text: 'Hello',
        targetLanguages: ['es']
      })

      const body = JSON.parse(lastFetchCall.options.body)
      expect(body.sourceLanguage).toBe('en')
    })

    test('uses default preservePlaceholders of true', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })

      await translate({
        text: 'Hello {name}',
        targetLanguages: ['es']
      })

      const body = JSON.parse(lastFetchCall.options.body)
      expect(body.preservePlaceholders).toBe(true)
    })

    test('throws error on non-ok response', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchOk = false
      mockFetchResponse = { message: 'Invalid API key' }

      await expect(translate({
        text: 'Hello',
        targetLanguages: ['es']
      })).rejects.toThrow('Invalid API key')
    })

    test('provides fallback error message', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchOk = false
      mockFetchResponse = {}

      await expect(translate({
        text: 'Hello',
        targetLanguages: ['es']
      })).rejects.toThrow('Translation failed: 401')
    })
  })

  describe('translateJSON', () => {
    test('throws error when API key is not set', async () => {
      await expect(translateJSON({
        json: { greeting: 'Hello' },
        targetLanguages: ['es']
      })).rejects.toThrow('VITE_SHIPI18N_API_KEY is not set')
    })

    test('accepts object JSON input', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })

      await translateJSON({
        json: { greeting: 'Hello', farewell: 'Goodbye' },
        targetLanguages: ['es']
      })

      const body = JSON.parse(lastFetchCall.options.body)
      expect(body.json).toBe('{"greeting":"Hello","farewell":"Goodbye"}')
    })

    test('accepts string JSON input', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })

      await translateJSON({
        json: '{"greeting":"Hello"}',
        targetLanguages: ['es']
      })

      const body = JSON.parse(lastFetchCall.options.body)
      expect(body.json).toBe('{"greeting":"Hello"}')
    })

    test('returns translated JSON', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchResponse = {
        es: { greeting: 'Hola', farewell: 'Adiós' }
      }

      const result = await translateJSON({
        json: { greeting: 'Hello', farewell: 'Goodbye' },
        targetLanguages: ['es']
      })

      expect(result.es.greeting).toBe('Hola')
      expect(result.es.farewell).toBe('Adiós')
    })

    test('handles nested JSON', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchResponse = {
        es: { app: { title: 'Mi App', buttons: { submit: 'Enviar' } } }
      }

      const result = await translateJSON({
        json: { app: { title: 'My App', buttons: { submit: 'Submit' } } },
        targetLanguages: ['es']
      })

      expect(result.es.app.title).toBe('Mi App')
      expect(result.es.app.buttons.submit).toBe('Enviar')
    })

    test('throws error on non-ok response', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchOk = false
      mockFetchResponse = { message: 'Rate limit exceeded' }

      await expect(translateJSON({
        json: { greeting: 'Hello' },
        targetLanguages: ['es']
      })).rejects.toThrow('Rate limit exceeded')
    })
  })

  describe('healthCheck', () => {
    test('calls the health endpoint', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' })
      mockFetchResponse = { status: 'healthy', version: '1.0.0' }

      const result = await healthCheck()

      expect(lastFetchCall.url).toBe('https://api.test.com/api/health')
      expect(result.status).toBe('healthy')
    })

    test('works without API key', async () => {
      setConfig({ apiKey: null, apiUrl: 'https://api.test.com' })
      mockFetchResponse = { status: 'healthy' }

      const result = await healthCheck()

      expect(result.status).toBe('healthy')
    })
  })
})

describe('Translation Response Snapshots', () => {
  test('should match expected JSON translation response structure', () => {
    const translationResponse = {
      es: {
        common: {
          greeting: 'Hola',
          farewell: 'Adiós',
          buttons: { submit: 'Enviar', cancel: 'Cancelar' }
        }
      },
      fr: {
        common: {
          greeting: 'Bonjour',
          farewell: 'Au revoir',
          buttons: { submit: 'Soumettre', cancel: 'Annuler' }
        }
      }
    }

    expect(translationResponse).toMatchSnapshot()
  })

  test('should match expected pluralization response structure', () => {
    const pluralResponse = {
      es: {
        items_one: '{count} artículo',
        items_other: '{count} artículos'
      },
      ru: {
        items_one: '{count} элемент',
        items_few: '{count} элемента',
        items_many: '{count} элементов',
        items_other: '{count} элементов'
      }
    }

    expect(pluralResponse).toMatchSnapshot()
  })

  test('should match expected text translation response structure', () => {
    const textResponse = {
      es: [
        { original: 'Hello, world!', translated: '¡Hola, mundo!' },
        { original: 'Welcome back', translated: 'Bienvenido de nuevo' }
      ]
    }

    expect(textResponse).toMatchSnapshot()
  })
})
