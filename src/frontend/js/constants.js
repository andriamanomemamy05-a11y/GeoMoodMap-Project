/**
 * Configuration et constantes de l'application
 */
export const CONFIG = {
  MAP: {
    DEFAULT_LAT: 48.8566,
    DEFAULT_LON: 2.3522,
    DEFAULT_ZOOM: 13,
    TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '© OpenStreetMap contributors',
  },
  API: {
    SEARCH: '/api/search',
    MOODS: '/api/moods',
  },
  AUTOCOMPLETE: {
    DEBOUNCE_DELAY: 300,
  },
};

export const SELECTORS = {
  MAP: 'map',
  ADDRESS_INPUT: 'address',
  AUTOCOMPLETE: 'autocomplete',
  VIDEO: 'camera',
  CANVAS: 'canvas',
  SNAP_BTN: 'snap',
  SELFIE_PREVIEW: 'selfiePreview',
  DELETE_PHOTO: 'deletePhoto',
  CAMERA_CONTAINER: 'cameraContainer',
  UPLOAD_CONTAINER: 'uploadContainer',
  PHOTO_CONTAINER: 'photoContainer',
  SELFIE_BTN: 'selfieBtn',
  UPLOAD_BTN: 'uploadBtn',
  FILE_INPUT: 'fileInput',
  MOOD_FORM: 'moodForm',
  TEXT_INPUT: 'text',
  RATING_INPUT: 'rating',
  FEEDBACK_MODAL: 'feedbackModal',
  MODAL_BODY: 'modalBody',
  EXPORT_BTN: 'exportBtn',
};
