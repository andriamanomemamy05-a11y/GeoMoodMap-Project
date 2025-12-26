const weatherService = require('./weatherService');
const { resolveLocation } = require('./locationResolver');
const { saveImageFromBase64 } = require('./image/ImageStorage');
const { analyzeText } = require('../utils/textAnalyzer');
const { calculateGlobalScore } = require('../scoring/ScoreEngine');
const { buildMood } = require('../factories/moodFactory');
const jsonStore = require('../storage/jsonStore');

/**
 * Service métier pour la gestion des moods
 * Responsabilité : Orchestration de la logique métier (Use Case)
 */

/**
 * Crée une nouvelle entrée d'humeur (Use Case principal)
 * @param {Object} validatedData - Données validées par le validator
 * @returns {Promise<Object>} Mood créé
 */
async function createNewMood(validatedData) {
  const { text, rating, lat, lon, address, imageUrl } = validatedData;

  // 1. Résoudre la localisation (coords + place)
  const location = await resolveLocation({ lat, lon, address });

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

  // 3. Analyser le sentiment du texte
  const textScore = analyzeText(text);

  // 4. Calculer le score d'humeur final
  const scoreResult = calculateGlobalScore({
    rating,
    textScore,
    weather,
  });

  // 5. Sauvegarder l'image (si présente)
  const savedImagePath = saveImageFromBase64(imageUrl);

  // 6. Construire l'objet Mood
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

  // 7. Persister dans le store
  jsonStore.save(mood);

  return mood;
}

module.exports = { createNewMood };
