/**
 * Responsabilité: Analyser le sentiment d'un texte basé sur un dictionnaire
 */

const { positiveWords, negativeWords } = require('./dictionaries');

/**
 * Score minimum et maximum pour éviter les valeurs extrêmes
 */
const MIN_SCORE = -5;
const MAX_SCORE = 5;

/**
 * Analyse le sentiment d'un texte en comptant les mots positifs et négatifs
 * @param {string} text - Texte à analyser
 * @returns {number} Score de sentiment entre -5 et +5
 *
 * ALGORITHME :
 * 1. Validation de l'entrée
 * 2. Tokenization : extraction des mots (split sur non-alphanumériques)
 * 3. Calcul du score basé sur le dictionnaire
 * 4. Clamping : limitation du score à une plage raisonnable
 */
function analyzeText(text) {
  // Validation de l'entrée
  if (!text || typeof text !== 'string') {
    return 0;
  }

  // Tokenization : extraction des mots
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);

  // Calcul du score basé sur le dictionnaire
  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 1;
    }
    if (negativeWords.includes(word)) {
      score -= 1;
    }
  });

  // Clamping : limitation du score à une plage raisonnable
  if (score > MAX_SCORE) {
    score = MAX_SCORE;
  }
  if (score < MIN_SCORE) {
    score = MIN_SCORE;
  }

  return score;
}

module.exports = {
  analyzeText,
};
