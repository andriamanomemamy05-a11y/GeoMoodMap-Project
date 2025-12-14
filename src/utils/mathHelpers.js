// Fonctions mathématiques utilitaires

/**
 * Limite une valeur entre un minimum et un maximum
 */
function clamp(value, min, max) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

module.exports = { clamp };
