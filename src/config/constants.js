/**
 * Configuration centralisée de l'application
 * Élimine les magic numbers et centralise toutes les valeurs de configuration
 */

// Codes de statut HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Configuration du MoodScore
const MOOD_SCORE = {
  // Rating (1-5) converti en pourcentage
  RATING_MULTIPLIER: 20,        // 1→20%, 2→40%, ..., 5→100%

  // Points de texte
  TEXT_POINT_MULTIPLIER: 10,    // +1→+10, +2→+20, etc.
  MAX_TEXT_POINTS: 30,          // Limite maximale pour le texte positif
  MIN_TEXT_POINTS: -30,         // Limite minimale pour le texte négatif

  // Points météo
  RAIN_PENALTY: -10,
  SNOW_PENALTY: -8,
  CLOUD_PENALTY: -5,
  CLEAR_BONUS: 10,
  HOT_TEMP_BONUS: 5,            // Bonus si temp > HOT_TEMP_THRESHOLD
  COLD_TEMP_PENALTY: -5,        // Pénalité si temp < COLD_TEMP_THRESHOLD

  // Seuils de température
  HOT_TEMP_THRESHOLD: 28,       // °C
  COLD_TEMP_THRESHOLD: 5,       // °C

  // Score final
  MAX_SCORE: 100,
  MIN_SCORE: 0
};

// Configuration de l'analyse de texte
const TEXT_ANALYSIS = {
  MAX_SCORE: 5,
  MIN_SCORE: -5,
  POSITIVE_WORDS: ['bien', 'heureux', 'content', 'joyeux', 'serein', 'love', 'happy', 'ravi', 'cool'],
  NEGATIVE_WORDS: ['mal', 'triste', 'hate', 'déçu', 'colère', 'anxieux', 'stress', 'mauvais', 'deteste']
};

// Configuration des images
const IMAGE_CONFIG = {
  MAX_SIZE: '10mb',
  SELFIE_MAX_SIZE: '5mb',
  ALLOWED_FORMAT: 'data:image',
  OUTPUT_FORMAT: 'png',
  BASE64_PREFIX: /^data:image\/png;base64,/,
  PUBLIC_DIR: 'public',
  SELFIES_SUBDIR: 'selfies',
  FILENAME_PREFIX: 'selfie_'
};

// Messages d'erreur
const ERROR_MESSAGES = {
  TEXT_REQUIRED: 'text is required and must be a non-empty string',
  RATING_REQUIRED: 'rating is required and must be a number (1-5 recommended)',
  COORDS_OR_ADDRESS_REQUIRED: 'Provide either lat+lon or address',
  INVALID_COORDS: 'Invalid coordinates',
  NO_IMAGE_PROVIDED: 'No image provided',
  IMAGE_SAVE_FAILED: 'Failed to save image',
  OPENWEATHER_KEY_MISSING: 'OPENWEATHER_API_KEY not set',
  ADDRESS_INVALID: 'address must be a non-empty string',
  ENTRY_REQUIRED: 'entry is required',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NOT_FOUND: 'Not Found'
};

// Configuration du serveur
const SERVER_CONFIG = {
  DEFAULT_PORT: 3030
};

// Constantes de réponse
const RESPONSE_CONSTANTS = {
  EMPTY_ARRAY: []
};

module.exports = {
  HTTP_STATUS,
  MOOD_SCORE,
  TEXT_ANALYSIS,
  IMAGE_CONFIG,
  ERROR_MESSAGES,
  SERVER_CONFIG,
  RESPONSE_CONSTANTS
};
