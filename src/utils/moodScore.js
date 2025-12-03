// Ce fichier sert à faire le calcul SIMPLE et LOGIQUE du MoodScore.


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
    let ratingScore = rating * 20;

    // -----------------------------
    // 2. TextScore (-30 → +30)
    // -----------------------------
    // textScore vient de moodAnalyzer : 
    // positif = +1, négatif = -1, etc.
    // On transforme ça en points lisibles :
    // +1 → +10, +2 → +20, +3 → +30
    // -1 → -10, -2 → -20, -3 → -30
    let textPoints = textScore * 10;

    // On limite pour éviter les abus :
    if (textPoints > 30) textPoints = 30;
    if (textPoints < -30) textPoints = -30;

    // -----------------------------
    // 3. WeatherScore (-15 → +15)
    // -----------------------------
    let weatherPoints = 0;

    if (weather) {
        const w = (weather.weather || "").toLowerCase();
        const temp = weather.temp;

        // Météo simple (à ajouter au fure et à mésure)
        if (w.includes("rain") || w.includes("pluie")) {
            weatherPoints -= 10;
        }
        if (w.includes("snow") || w.includes("neige")) {
            weatherPoints -= 8;
        }
        if (w.includes("cloud") || w.includes("nuage")) {
            weatherPoints -= 5;
        }
        if (w.includes("clear") || w.includes("sun") || w.includes("soleil")) {
            weatherPoints += 10;
        }

        // Température simple
        if (typeof temp === "number") {
            if (temp > 28) weatherPoints += 5; // chaud agréable
            if (temp < 5) weatherPoints -= 5;  // froid pénible
        }
    }

    // -----------------------------
    // 4. Score final
    // -----------------------------
    let final = ratingScore + textPoints + weatherPoints;

    // Clamp 0 → 100 pour rester cohérent
    if (final > 100) final = 100;
    if (final < 0) final = 0;

    // On retourne un entier pour le score finale
    return Math.round(final);
}

module.exports = { computeScoreWithBreakdown };
