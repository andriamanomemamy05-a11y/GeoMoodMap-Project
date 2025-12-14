// Ce fichier sert à faire le calcul SIMPLE et LOGIQUE du MoodScore.

const { MOOD_SCORE } = require('../config/constants');
const { clamp } = require('./mathHelpers');

/**
 * Calcule le score basé sur la note (rating)
 */
function computeRatingScore(rating) {
    return rating * MOOD_SCORE.RATING_MULTIPLIER;
}

/**
 * Calcule le score basé sur l'analyse de texte
 */
function computeTextPoints(textScore) {
    const textPoints = textScore * MOOD_SCORE.TEXT_POINT_MULTIPLIER;
    return clamp(textPoints, MOOD_SCORE.MIN_TEXT_POINTS, MOOD_SCORE.MAX_TEXT_POINTS);
}

/**
 * Calcule les points liés aux conditions météo
 */
function computeWeatherConditionPoints(weatherDescription) {
    let points = 0;
    const description = weatherDescription.toLowerCase();

    if (description.includes("rain") || description.includes("pluie")) {
        points += MOOD_SCORE.RAIN_PENALTY;
    }
    if (description.includes("snow") || description.includes("neige")) {
        points += MOOD_SCORE.SNOW_PENALTY;
    }
    if (description.includes("cloud") || description.includes("nuage")) {
        points += MOOD_SCORE.CLOUD_PENALTY;
    }
    if (description.includes("clear") || description.includes("sun") || description.includes("soleil")) {
        points += MOOD_SCORE.CLEAR_BONUS;
    }

    return points;
}

/**
 * Calcule les points liés à la température
 */
function computeTemperaturePoints(temperature) {
    if (typeof temperature !== "number") {
        return 0;
    }

    let points = 0;
    if (temperature > MOOD_SCORE.HOT_TEMP_THRESHOLD) {
        points += MOOD_SCORE.HOT_TEMP_BONUS;
    }
    if (temperature < MOOD_SCORE.COLD_TEMP_THRESHOLD) {
        points += MOOD_SCORE.COLD_TEMP_PENALTY;
    }

    return points;
}

/**
 * Calcule le score total lié à la météo
 */
function computeWeatherScore(weather) {
    if (!weather) {
        return 0;
    }

    const conditionPoints = computeWeatherConditionPoints(weather.weather || "");
    const tempPoints = computeTemperaturePoints(weather.temp);

    return conditionPoints + tempPoints;
}

/**
 * Calcul SIMPLE et LOGIQUE du MoodScore.
 * Score final = ratingScore + textScore + weatherScore
 * Résultat final toujours compris entre 0 et 100.
 */
function computeScoreWithBreakdown({ rating, textScore, weather }) {
    const ratingScore = computeRatingScore(rating);
    const textPoints = computeTextPoints(textScore);
    const weatherPoints = computeWeatherScore(weather);

    const final = ratingScore + textPoints + weatherPoints;
    const clampedScore = clamp(final, MOOD_SCORE.MIN_SCORE, MOOD_SCORE.MAX_SCORE);

    return Math.round(clampedScore);
}

module.exports = { computeScoreWithBreakdown };
