/**
 * Constants - Configuration globale de l'application
 * Centralise toutes les valeurs magiques et configurations
 */

// Configuration de la carte
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 13,
  DETAILED_ZOOM: 15,
  MAX_ZOOM: 19,
  PARIS_LAT: 48.8566,
  PARIS_LON: 2.3522,
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: "© OpenStreetMap contributors"
};

// Configuration de la caméra
export const CAMERA_CONFIG = {
  FACING_MODE: "user",
  IDEAL_WIDTH: 1280,
  IDEAL_HEIGHT: 720,
  IMAGE_FORMAT: "image/png"
};

// Configuration de l'autocomplétion
export const AUTOCOMPLETE_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms
  MAX_SUGGESTIONS_HEIGHT: 150 // px
};

// Configuration des modales
export const MODAL_CONFIG = {
  MAX_IMAGE_HEIGHT: 300 // px
};

// Configuration de la géolocalisation
export const GEOLOCATION_CONFIG = {
  ENABLE_HIGH_ACCURACY: false,
  TIMEOUT: 5000, // ms
  MAXIMUM_AGE: 0
};

// Seuils de score pour les badges
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  AVERAGE: 40
};

// Couleurs des badges selon le score
export const SCORE_BADGE_COLORS = {
  EXCELLENT: "success",
  GOOD: "info",
  AVERAGE: "warning",
  POOR: "danger",
  UNKNOWN: "secondary"
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  CAMERA_UNAVAILABLE: "La caméra n'est pas disponible",
  CAMERA_PERMISSION_DENIED: "Veuillez autoriser l'accès à la caméra.",
  CAMERA_NOT_FOUND: "Aucune caméra détectée.",
  CAMERA_IN_USE: "La caméra est déjà utilisée par une autre application.",
  MOOD_TEXT_REQUIRED: "Veuillez décrire votre humeur",
  RATING_REQUIRED: "Veuillez saisir une note entre 1 et 5",
  SUBMISSION_ERROR: "Une erreur est survenue lors de l'enregistrement.",
  GEOCODE_ERROR: "Erreur lors de la recherche d'adresse",
  APP_LOAD_ERROR: "Une erreur est survenue lors du chargement de l'application."
};

// Validation
export const VALIDATION = {
  MIN_RATING: 1,
  MAX_RATING: 5
};

// API Endpoints
export const API_ENDPOINTS = {
  MOODS: "/api/moods",
  SEARCH: "/api/search"
};
