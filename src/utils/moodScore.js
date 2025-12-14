// Ce fichier sert à faire le calcul SIMPLE et LOGIQUE du MoodScore.

const { MOOD_SCORE } = require('../config/constants');

/**
 * Calcul SIMPLE et LOGIQUE du MoodScore.
 * Score final = ratingScore + textScore + weatherScore
 * Résultat final toujours compris entre 0 et 100.
 */

function computeScoreWithBreakdown({ rating, textScore, weather }) {
    // -----------------------------
    // 1. RatingScore (20 → 100)
    // -----------------------------
    // rating est sur 1..5, on le transforme en pourcentage simple.
    // 1 → 20, 2 → 40, ..., 5 → 100
    let ratingScore = rating * MOOD_SCORE.RATING_MULTIPLIER;

    // -----------------------------
    // 2. TextScore (-30 → +30)
    // -----------------------------
    // textScore vient de moodAnalyzer :
    // positif = +1, négatif = -1, etc.
    // On transforme ça en points lisibles :
    // +1 → +10, +2 → +20, +3 → +30
    // -1 → -10, -2 → -20, -3 → -30
    let textPoints = textScore * MOOD_SCORE.TEXT_POINT_MULTIPLIER;

    // On limite pour éviter les abus :
    if (textPoints > MOOD_SCORE.MAX_TEXT_POINTS) textPoints = MOOD_SCORE.MAX_TEXT_POINTS;
    if (textPoints < MOOD_SCORE.MIN_TEXT_POINTS) textPoints = MOOD_SCORE.MIN_TEXT_POINTS;

    // -----------------------------
    // 3. WeatherScore (-15 → +15)
    // -----------------------------
    let weatherPoints = 0;

    if (weather) {
        const w = (weather.weather || "").toLowerCase();
        const temp = weather.temp;

        // Météo simple (à ajouter au fur et à mesure)
        if (w.includes("rain") || w.includes("pluie")) {
            weatherPoints += MOOD_SCORE.RAIN_PENALTY;
        }
        if (w.includes("snow") || w.includes("neige")) {
            weatherPoints += MOOD_SCORE.SNOW_PENALTY;
        }
        if (w.includes("cloud") || w.includes("nuage")) {
            weatherPoints += MOOD_SCORE.CLOUD_PENALTY;
        }
        if (w.includes("clear") || w.includes("sun") || w.includes("soleil")) {
            weatherPoints += MOOD_SCORE.CLEAR_BONUS;
        }

        // Température simple
        if (typeof temp === "number") {
            if (temp > MOOD_SCORE.HOT_TEMP_THRESHOLD) weatherPoints += MOOD_SCORE.HOT_TEMP_BONUS; // chaud agréable
            if (temp < MOOD_SCORE.COLD_TEMP_THRESHOLD) weatherPoints += MOOD_SCORE.COLD_TEMP_PENALTY;  // froid pénible
        }
    }

    // -----------------------------
    // 4. Score final
    // -----------------------------
    let final = ratingScore + textPoints + weatherPoints;

    // Clamp 0 → 100 pour rester cohérent
    if (final > MOOD_SCORE.MAX_SCORE) final = MOOD_SCORE.MAX_SCORE;
    if (final < MOOD_SCORE.MIN_SCORE) final = MOOD_SCORE.MIN_SCORE;

    // On retourne un entier pour le score final
    return Math.round(final);
}

module.exports = { computeScoreWithBreakdown };
