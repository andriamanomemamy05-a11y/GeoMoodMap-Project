const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');
const jsonStore = require('../storage/jsonStore');
const { computeScoreWithBreakdown } = require('../utils/moodScore');
const { analyzeText } = require('../utils/textAnalyzer');
const { saveBase64Image } = require('../utils/imageHandler');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * addMood
 * - Validation des données
 * - Récupération des coordonnées ou adresse
 * - Récupérer la météo selon les coords
 * - Calculer le mood score via utils/moodScore par rapport aux données
 * - Sauvegarder dans data/mood.json via storage/jsonStore
*/
async function addMood(req, res) {
  try {
    const { text = '', rating, lat, lon, address, imageUrl } = req.body;

    // Validation basique mais explicite
    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.TEXT_REQUIRED });
    }
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.RATING_REQUIRED });
    }

    // Normaliser le rating en nombre
    let numericRating = Number(rating);

    // S'assurer qu'on a des coordonnées ou une adresse
    const hasCoords = lat !== undefined && lon !== undefined && lat !== null && lon !== null;
    const hasAddress = typeof address === 'string' && address.trim() !== '';
    if (!hasCoords && !hasAddress) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.COORDS_OR_ADDRESS_REQUIRED });
    }

    // Décortiquer et initialiser les coords, l'adresse
    let usedLat = hasCoords ? Number(lat) : null;
    let usedLon = hasCoords ? Number(lon) : null;
    let place = null;

    if (hasCoords) {
      // Reverse geocode : pour récupérer l'adresse exacte depuis les coords
      try {
        place = await geocodeService.reverseGeocode(usedLat, usedLon);
      } catch (err) {
        console.warn('reverseGeocode failed:', err.message || err);
      }
    } else {
      // Forward geocode : pour récupérer les coords depuis l'adresse
      try {
        const f = await geocodeService.forwardGeocode(address);
        usedLat = f.lat ? Number(f.lat) : null;
        usedLon = f.lon ? Number(f.lon) : null;
        place = f;
      } catch (err) {
        console.warn('forwardGeocode failed:', err.message || err);
      }
    }

    // Obtenir la météo actuelle du jour (uniquement si les coordonnées sont présentes, ce qui est très utile)
    let weather = null;
    try {
      if (usedLat !== null && usedLon !== null && !Number.isNaN(usedLat) && !Number.isNaN(usedLon)) {
        const w = await weatherService.getWeather(usedLat, usedLon);
        weather = w && w.data ? w.data : null;
      }
    } catch (err) {
      console.warn('getWeather failed:', err.message || err);
      weather = null;
    }

    // Analyser le texte par rapport au facteur de sentiment écrit
    const textScore = analyzeText(text);

    // Calcul du score d'humeur final avec ventilation
    const scoreResult = computeScoreWithBreakdown({
      rating: numericRating,
      textScore,
      weather
    });

    // Sauvegarde du selfie via imageHandler
    const savedImagePath = saveBase64Image(imageUrl);

    // Construire une entrée d'humeur
    const mood = {
      id: Date.now(),
      text,
      rating: numericRating,
      lat: usedLat,
      lon: usedLon,
      place,
      weather,
      textScore,
      scoreResult,
      imageUrl: savedImagePath || null,
      createdAt: new Date().toISOString()
    };

    // Récupérer les données et les envoyer dans jsonStore pour les sauvegarder
    jsonStore.save(mood);

    return res.status(HTTP_STATUS.CREATED).json(mood);
  } catch (err) {
    console.error('addMood error:', err && (err.stack || err));
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message || 'Internal Server Error' });
  }
}

/**
  * getMoods - retourne la liste complète (simple)
*/
function getMoods(req, res) {
  try {
    const moods = jsonStore.loadAll();
    res.status(HTTP_STATUS.OK).json(moods);
  } catch (err) {
    console.error('getMoods error:', err && (err.stack || err));
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message || 'Internal Server Error' });
  }
}

module.exports = { addMood, getMoods };
