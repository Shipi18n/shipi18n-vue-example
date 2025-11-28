/**
 * Shipi18n API Client for Vue
 *
 * A simple wrapper around the Shipi18n translation API.
 * Get your free API key at https://shipi18n.com
 */

// Configuration - can be overridden for testing
let config = null

function getConfig() {
  if (config) return config

  // Only access import.meta.env in browser/Vite context
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      apiKey: import.meta.env.VITE_SHIPI18N_API_KEY,
      apiUrl: import.meta.env.VITE_SHIPI18N_API_URL || 'https://x9527l3blg.execute-api.us-east-1.amazonaws.com'
    }
  }

  return {
    apiKey: null,
    apiUrl: 'https://x9527l3blg.execute-api.us-east-1.amazonaws.com'
  }
}

/**
 * Set configuration (useful for testing)
 * @param {Object} newConfig - Configuration object
 * @param {string} newConfig.apiKey - API key
 * @param {string} newConfig.apiUrl - API URL
 */
export function setConfig(newConfig) {
  config = newConfig
}

/**
 * Reset configuration to defaults (useful for testing)
 */
export function resetConfig() {
  config = null
}

/**
 * Translate text to one or more languages
 * @param {Object} options - Translation options
 * @param {string} options.text - Text to translate
 * @param {string} [options.sourceLanguage='en'] - Source language code
 * @param {string[]} options.targetLanguages - Array of target language codes
 * @param {boolean} [options.preservePlaceholders=true] - Preserve placeholders like {name}
 * @returns {Promise<Object>} Translation results keyed by language code
 */
export async function translate({
  text,
  sourceLanguage = 'en',
  targetLanguages,
  preservePlaceholders = true
}) {
  const { apiKey, apiUrl } = getConfig()

  if (!apiKey) {
    throw new Error('VITE_SHIPI18N_API_KEY is not set. Get your free API key at https://shipi18n.com')
  }

  const response = await fetch(`${apiUrl}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguages,
      preservePlaceholders
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Translation failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Translate JSON while preserving structure
 * @param {Object} options - Translation options
 * @param {Object|string} options.json - JSON object or string to translate
 * @param {string} [options.sourceLanguage='en'] - Source language code
 * @param {string[]} options.targetLanguages - Array of target language codes
 * @param {boolean} [options.preservePlaceholders=true] - Preserve placeholders
 * @returns {Promise<Object>} Translated JSON objects keyed by language code
 */
export async function translateJSON({
  json,
  sourceLanguage = 'en',
  targetLanguages,
  preservePlaceholders = true
}) {
  const { apiKey, apiUrl } = getConfig()

  if (!apiKey) {
    throw new Error('VITE_SHIPI18N_API_KEY is not set. Get your free API key at https://shipi18n.com')
  }

  const jsonString = typeof json === 'string' ? json : JSON.stringify(json)

  const response = await fetch(`${apiUrl}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      json: jsonString,
      sourceLanguage,
      targetLanguages,
      preservePlaceholders
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Translation failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Check API health status
 * @returns {Promise<Object>} Health status
 */
export async function healthCheck() {
  const { apiUrl } = getConfig()
  const response = await fetch(`${apiUrl}/api/health`)
  return response.json()
}

export default {
  translate,
  translateJSON,
  healthCheck,
  setConfig,
  resetConfig
}
