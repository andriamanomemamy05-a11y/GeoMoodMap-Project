const geocodeService = require('../../adapters/geocode/geocodeService');

/**
 * Contrôleur HTTP pour la recherche d'adresses
 * Responsabilité : Gestion de la couche HTTP pour l'autocomplete (req/res uniquement)
 */

/**
 * GET /api/search - Recherche d'adresse pour autocomplete
 */
async function searchAddress(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // Délégation au service geocodeService
    const result = await geocodeService.forwardGeocode(q);

    // Retourne un tableau pour compatibilité avec Leaflet
    return res.json([result]);
  } catch (err) {
    console.error('searchAddress error:', err && (err.stack || err));
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

module.exports = { searchAddress };
