/**
 * WeatherRule.js
 *
 * Responsabilité unique : Calculer le score basé sur les conditions météo.
 * Analyse la météo et la température pour attribuer des points (-15 à +15).
 */

/**
 * Calcule le score basé sur la météo
 * @param {Object|null} weather - Objet météo avec { weather, temp, ... }
 * @returns {number} Points entre -15 et +15
 * Météo simple (à ajouter au fur et à mesure)
 * - rain/pluie → -10
 * - snow/neige → -8
 * - cloud/nuage → -5
 * - clear/sun/soleil → +10
 * Température :
 * - > 28°C → +5 (chaud agréable)
 * - < 5°C → -5 (froid pénible)
 */
function calculateWeatherScore(weather) {
  let weatherPoints = 0;

  if (weather) {
    const w = (weather.weather || '').toLowerCase();
    const { temp } = weather;

    // Cas des méteo possibles
    if (w.includes('rain') || w.includes('pluie')) {
      weatherPoints -= 10;
    }
    if (w.includes('snow') || w.includes('neige')) {
      weatherPoints -= 8;
    }
    if (w.includes('cloud') || w.includes('nuage')) {
      weatherPoints -= 5;
    }
    if (w.includes('clear') || w.includes('sun') || w.includes('soleil')) {
      weatherPoints += 10;
    }

    if (w.includes('wind') || w.includes('vent')) {
      weatherPoints -= 4;
    }

    if (w.includes('storm') || w.includes('thunder') || w.includes('orage')) {
      weatherPoints -= 12;
    }

    if (w.includes('fog') || w.includes('mist') || w.includes('brouillard')) {
      weatherPoints -= 6;
    }

    if (w.includes('heat') || w.includes('hot') || w.includes('canicule')) {
      weatherPoints -= 5;
    }

    if (w.includes('cold') || w.includes('froid')) {
      weatherPoints -= 4;
    }

    // Température simple
    if (typeof temp === 'number') {
      if (temp > 28) weatherPoints += 5; // chaud agréable
      if (temp < 5) weatherPoints -= 5; // froid pénible
    }
  }

  return weatherPoints;
}

module.exports = { calculateWeatherScore };
