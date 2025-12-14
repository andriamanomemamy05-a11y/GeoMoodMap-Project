// Petit analyseur lexical : retourne un integer pouvant être négatif ou positif.

const { TEXT_ANALYSIS } = require('../config/constants');
const { clamp } = require('./mathHelpers');

function analyzeText(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let score = 0;

  // On ajoute au fur et à mesure si les textes contiennent des mots positifs ou négatifs
  for (const w of words) {
    if (TEXT_ANALYSIS.POSITIVE_WORDS.includes(w)) score += 1;
    if (TEXT_ANALYSIS.NEGATIVE_WORDS.includes(w)) score -= 1;
  }

  // Limitez le score à une plage raisonnable pour éviter une influence excessive
  return clamp(score, TEXT_ANALYSIS.MIN_SCORE, TEXT_ANALYSIS.MAX_SCORE);
}

module.exports = { analyzeText };
