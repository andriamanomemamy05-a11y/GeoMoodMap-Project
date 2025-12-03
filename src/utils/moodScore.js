// Ce fichier sert à faire le calcul SIMPLE et LOGIQUE du MoodScore.
function computeScoreWithBreakdown({ rating, textScore, weather }) {
    let ratingScore = rating * 20;

    let textPoints = textScore * 10;

    // On limite pour éviter les abus :
    if (textPoints > 30) textPoints = 30;
    if (textPoints < -30) textPoints = -30;

    let weatherPoints = 0;

    if (weather) {
        const w = (weather.weather || "").toLowerCase();
        const temp = weather.temp;

        // Météo simple (à ajouter au fure et à mésure)
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
    let final = ratingScore + textPoints + weatherPoints;

    // Clamp 0 → 100 pour rester cohérent
    if (final > 100) final = 100;
    if (final < 0) final = 0;

    // On retourne un entier
    return Math.round(final);
}

module.exports = { computeScoreWithBreakdown };
