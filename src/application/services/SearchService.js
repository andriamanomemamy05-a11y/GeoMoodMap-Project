/**
 * SearchService.js
 *
 * Service de recherche d'adresses (Use Case)
 * Responsabilité : Orchestrer la recherche d'adresses pour l'autocomplete
 *
 * DEPENDENCY INJECTION PATTERN:
 * Ce service ne dépend QUE d'abstractions (interfaces/ports).
 * L'implémentation concrète du geocoding est injectée.
 */

/**
 * Factory pour créer une instance de SearchService avec ses dépendances
 *
 * @param {Object} dependencies - Dépendances injectées
 * @param {Object} dependencies.geocodeService - Service de geocoding (IGeocodeService)
 * @returns {Object} Instance du service avec méthode searchLocation
 */
function createSearchService({ geocodeService }) {
  /**
   * Recherche une adresse pour l'autocomplete
   * @param {string} query - Requête de recherche
   * @returns {Promise<Object>} Résultat du geocoding
   */
  async function searchLocation(query) {
    if (!query || query.trim() === '') {
      return null;
    }

    // Délégation au service de geocoding
    const result = await geocodeService.forwardGeocode(query);
    return result;
  }

  // Retourne l'instance du service avec ses méthodes
  return {
    searchLocation,
  };
}

module.exports = { createSearchService };
