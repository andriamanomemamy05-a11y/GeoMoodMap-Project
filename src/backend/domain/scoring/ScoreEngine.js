/**
 * ScoreEngine.js
 *
 * Responsabilité: Orchestrer le calcul du score global en combinant toutes les règles.
 * Applique le clamping (min 0, max 100).
 */

const { calculateRatingScore } = require('./rules/RatingRule');
const { calculateSentimentScore } = require('./rules/SentimentRule');
const { calculateWeatherScore } = require('./rules/WeatherRule');

/**
 * Calcule le score global en combinant toutes les règles
 * @param {Object} data - { rating, textScore, weather }
 * @returns {number} Score final entre 0 et 100
 *
 * Score final = ratingScore + textScore + weatherScore
 * Résultat final toujours compris entre 0 et 100.
 */
function calculateGlobalScore({ rating, textScore, weather }) {
  // Applique chaque règle
  const ratingScore = calculateRatingScore(rating);
  const textPoints = calculateSentimentScore(textScore);
  const weatherPoints = calculateWeatherScore(weather);

  // Combine tous les scores
  let final = ratingScore + textPoints + weatherPoints;

  // Clamp 0 → 100 pour rester cohérent
  if (final > 100) final = 100;
  if (final < 0) final = 0;

  // On retourne un entier pour le score finale
  return Math.round(final);
}

module.exports = { calculateGlobalScore };
