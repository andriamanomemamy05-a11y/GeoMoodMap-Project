/**
 * MoodService.js
 *
 * Service métier pour la gestion des moods (Use Cases)
 * Responsabilité : Orchestration de la logique métier
 *
 * DEPENDENCY INJECTION PATTERN:
 * Ce service ne dépend QUE d'abstractions (interfaces/ports).
 * Les implémentations concrètes sont injectées au moment de l'instanciation.
 */

const { analyzeText } = require('../../domain/text-analysis/TextAnalyzer');
const { calculateGlobalScore } = require('../../domain/scoring/ScoreEngine');
const { buildMood } = require('../../domain/factories/moodFactory');

/**
 * Factory pour créer une instance de MoodService avec ses dépendances
 *
 * @param {Object} dependencies - Dépendances injectées
 * @param {Object} dependencies.weatherService - Service météo (IWeatherService)
 * @param {Object} dependencies.locationResolver - Service de résolution de localisation
 * @param {Object} dependencies.imageStorage - Service de stockage d'images (IImageStorage)
 * @param {Object} dependencies.moodRepository - Repository des moods (IMoodRepository)
 * @returns {Object} Instance du service avec méthodes createNewMood et getAllMoods
 */
function createMoodService({ weatherService, locationResolver, imageStorage, moodRepository }) {
  async function createNewMood(validatedData) {
    const { text, rating, lat, lon, address, imageUrl } = validatedData;

    const location = await locationResolver.resolveLocation({ lat, lon, address });

    let weather = null;
    try {
      if (
        location.lat !== null &&
        location.lon !== null &&
        !Number.isNaN(location.lat) &&
        !Number.isNaN(location.lon)
      ) {
        const weatherResult = await weatherService.getWeather(location.lat, location.lon);
        weather = weatherResult && weatherResult.data ? weatherResult.data : null;
      }
    } catch (err) {
      console.warn('getWeather failed:', err.message || err);
      weather = null;
    }

    const textScore = analyzeText(text);

    const scoreResult = calculateGlobalScore({
      rating,
      textScore,
      weather,
    });

    const savedImagePath = imageStorage.saveImageFromBase64(imageUrl);

    const mood = buildMood({
      text,
      rating,
      lat: location.lat,
      lon: location.lon,
      place: location.place,
      weather,
      textScore,
      scoreResult,
      imageUrl: savedImagePath,
    });

    moodRepository.save(mood);

    return mood;
  }

  function getAllMoods() {
    return moodRepository.loadAll();
  }

  return {
    createNewMood,
    getAllMoods,
  };
}

module.exports = { createMoodService };
