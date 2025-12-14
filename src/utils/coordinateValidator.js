// Validation des coordonnées géographiques - évite la duplication dans les services

const { ERROR_MESSAGES } = require('../config/constants');

/**
 * Vérifie si les coordonnées sont valides (nombres finis)
 */
function validateCoordinates(lat, lon) {
  if (!isFinite(lat) || !isFinite(lon)) {
    throw new Error(ERROR_MESSAGES.INVALID_COORDS);
  }
  return true;
}

/**
 * Vérifie si les coordonnées sont utilisables (non null, non NaN)
 */
function areCoordinatesUsable(lat, lon) {
  return lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon);
}

module.exports = { validateCoordinates, areCoordinatesUsable };
