/**
 * Factory pour la construction d'objets Mood
 * Responsabilité : Centraliser la création d'objets Mood avec ID et timestamp
 */

/**
 * Construit un objet Mood complet
 * @param {Object} params - Paramètres du mood
 * @param {string} params.text - Texte de l'humeur
 * @param {number} params.rating - Note (1-5)
 * @param {number|null} params.lat - Latitude
 * @param {number|null} params.lon - Longitude
 * @param {Object|null} params.place - Objet lieu (geocoding)
 * @param {Object|null} params.weather - Données météo
 * @param {number} params.textScore - Score d'analyse de texte
 * @param {number} params.scoreResult - Score final d'humeur
 * @param {string|null} params.imageUrl - Chemin relatif de l'image
 * @returns {Object} Objet Mood complet avec ID et createdAt
 */
function buildMood({ text, rating, lat, lon, place, weather, textScore, scoreResult, imageUrl }) {
  return {
    id: Date.now(),
    text,
    rating,
    lat,
    lon,
    place,
    weather,
    textScore,
    scoreResult,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { buildMood };
