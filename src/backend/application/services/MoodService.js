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
  /**
   * Crée une nouvelle entrée d'humeur (Use Case principal)
   * @param {Object} validatedData - Données validées par le validator
   * @returns {Promise<Object>} Mood créé
   */
  async function createNewMood(validatedData) {
    const { text, rating, lat, lon, address, imageUrl } = validatedData;

    // 1. Résoudre la localisation (coords + place)
    const location = await locationResolver.resolveLocation({ lat, lon, address });

    // 2. Récupérer la météo (si coordonnées disponibles)
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

    // 3. Analyser le sentiment du texte (Domain logic - pure)
    const textScore = analyzeText(text);

    // 4. Calculer le score d'humeur final (Domain logic - pure)
    const scoreResult = calculateGlobalScore({
      rating,
      textScore,
      weather,
    });

    // 5. Sauvegarder l'image (si présente)
    const savedImagePath = imageStorage.saveImageFromBase64(imageUrl);

    // 6. Construire l'objet Mood (Domain factory - pure)
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

    // 7. Persister dans le repository
    moodRepository.save(mood);

    return mood;
  }

  /**
   * Récupère tous les moods (Use Case de lecture)
   * @returns {Array<Object>} Liste de tous les moods
   */
  function getAllMoods() {
    return moodRepository.loadAll();
  }

  // Retourne l'instance du service avec ses méthodes
  return {
    createNewMood,
    getAllMoods,
  };
}

module.exports = { createMoodService };
