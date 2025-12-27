/**
 * Responsabilité: Calculer le score basé sur le sentiment du texte.
 * Transforme le textScore en points (-30 à +30).
 */

/**
 * Calcule le score basé sur le sentiment du texte
 * @param {number} textScore - Score de sentiment (typiquement -3 à +3)
 * @returns {number} Points entre -30 et +30
 * positif = +1, négatif = -1, etc.
 * On transforme ça en points lisibles :
 * +1 → +10, +2 → +20, +3 → +30
 * -1 → -10, -2 → -20, -3 → -30
 */
function calculateSentimentScore(textScore) {
  let textPoints = textScore * 10;

  // On limite pour éviter les abus :
  if (textPoints > 30) textPoints = 30;
  if (textPoints < -30) textPoints = -30;

  return textPoints;
}

module.exports = { calculateSentimentScore };
