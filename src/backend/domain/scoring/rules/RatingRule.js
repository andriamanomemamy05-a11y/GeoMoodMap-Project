/**
 * Responsabilité: Calculer le score basé sur le rating utilisateur (1-5 étoiles).
 * Transforme le rating en points sur 100.
 */

/**
 * Calcule le score basé sur le rating
 * @param {number} rating - Rating de l'utilisateur (1-5)
 * @returns {number} Score entre 20 et 100
 * rating est sur 1..5, on le transforme en pourcentage simple.
 */
function calculateRatingScore(rating) {
  const ratingScore = rating * 20;
  return ratingScore;
}

module.exports = { calculateRatingScore };
