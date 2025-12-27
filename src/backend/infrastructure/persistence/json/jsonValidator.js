/**
 * jsonValidator.js
 *
 * Responsabilité unique : Valider que les données correspondent au schéma attendu.
 * Ne sait rien du système de fichiers.
 */

/**
 * Valide qu'une chaîne est un JSON valide et retourne l'objet parsé
 * @param {string} rawData - Données brutes à parser
 * @param {*} fallback - Valeur de repli en cas d'erreur
 * @returns {*} Données parsées ou fallback
 */
function parseJSON(rawData, fallback = []) {
  try {
    return JSON.parse(rawData || JSON.stringify(fallback));
  } catch (err) {
    console.error('jsonValidator: JSON parse error', err.message);
    return fallback;
  }
}

/**
 * Valide que les données sont un tableau
 * @param {*} data - Données à valider
 * @param {Array} fallback - Valeur de repli si validation échoue
 * @returns {Array} Tableau validé ou fallback
 */
function validateArray(data, fallback = []) {
  if (!Array.isArray(data)) {
    console.warn('jsonValidator: data is not an array, using fallback');
    return fallback;
  }
  return data;
}

/**
 * Sérialise des données en JSON formaté
 * @param {*} data - Données à sérialiser
 * @returns {string} JSON formaté
 */
function stringifyJSON(data) {
  return JSON.stringify(data, null, 2);
}

module.exports = {
  parseJSON,
  validateArray,
  stringifyJSON,
};
