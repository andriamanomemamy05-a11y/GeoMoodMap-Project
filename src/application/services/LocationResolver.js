const geocodeService = require('../../infrastructure/adapters/geocode/geocodeService');

/**
 * Service de résolution de localisation
 * Responsabilité : Résoudre les coordonnées ↔ adresse via geocoding
 */

/**
 * Résout la localisation à partir de coordonnées ou d'une adresse
 * @param {Object} params - Paramètres de localisation
 * @param {number|null} params.lat - Latitude
 * @param {number|null} params.lon - Longitude
 * @param {string|null} params.address - Adresse textuelle
 * @returns {Promise<Object>} { lat, lon, place }
 */
async function resolveLocation({ lat, lon, address }) {
  let usedLat = lat;
  let usedLon = lon;
  let place = null;

  const hasCoords =
    usedLat !== null && usedLon !== null && !Number.isNaN(usedLat) && !Number.isNaN(usedLon);

  if (hasCoords) {
    // Reverse geocode : récupérer l'adresse depuis les coords
    try {
      place = await geocodeService.reverseGeocode(usedLat, usedLon);
    } catch (err) {
      console.warn('reverseGeocode failed:', err.message || err);
    }
  } else if (address) {
    // Forward geocode : récupérer les coords depuis l'adresse
    try {
      const result = await geocodeService.forwardGeocode(address);
      usedLat = result.lat ? Number(result.lat) : null;
      usedLon = result.lon ? Number(result.lon) : null;
      place = result;
    } catch (err) {
      console.warn('forwardGeocode failed:', err.message || err);
    }
  }

  return {
    lat: usedLat,
    lon: usedLon,
    place,
  };
}

module.exports = { resolveLocation };
