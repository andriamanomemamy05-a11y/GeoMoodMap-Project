const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');
const jsonStore = require('../storage/jsonStore');
const { computeScoreWithBreakdown } = require('../utils/moodScore');
const { analyzeText } = require('../utils/textAnalyzer');
const { saveBase64Image } = require('../utils/imageHandler');
const { areCoordinatesUsable } = require('../utils/coordinateValidator');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Valide les données d'entrée du mood
 */
function validateMoodInput(text, rating) {
  if (typeof text !== 'string' || text.trim() === '') {
    return { valid: false, error: ERROR_MESSAGES.TEXT_REQUIRED };
  }
  if (rating === undefined || rating === null || isNaN(Number(rating))) {
    return { valid: false, error: ERROR_MESSAGES.RATING_REQUIRED };
  }
  return { valid: true, numericRating: Number(rating) };
}

/**
 * Valide qu'on a soit des coordonnées soit une adresse
 */
function validateLocationInput(lat, lon, address) {
  const hasCoords = lat !== undefined && lon !== undefined && lat !== null && lon !== null;
  const hasAddress = typeof address === 'string' && address.trim() !== '';

  if (!hasCoords && !hasAddress) {
    return { valid: false, error: ERROR_MESSAGES.COORDS_OR_ADDRESS_REQUIRED };
  }

  return { valid: true, hasCoords, hasAddress };
}

/**
 * Récupère les coordonnées et le lieu via geocoding
 */
async function resolveLocation(lat, lon, address, hasCoords) {
  let usedLat = hasCoords ? Number(lat) : null;
  let usedLon = hasCoords ? Number(lon) : null;
  let place = null;

  if (hasCoords) {
    try {
      place = await geocodeService.reverseGeocode(usedLat, usedLon);
    } catch (err) {
      console.warn('reverseGeocode failed:', err.message || err);
    }
  } else {
    try {
      const geocodeResult = await geocodeService.forwardGeocode(address);
      usedLat = geocodeResult.lat ? Number(geocodeResult.lat) : null;
      usedLon = geocodeResult.lon ? Number(geocodeResult.lon) : null;
      place = geocodeResult;
    } catch (err) {
      console.warn('forwardGeocode failed:', err.message || err);
    }
  }

  return { lat: usedLat, lon: usedLon, place };
}

/**
 * Récupère les données météo pour des coordonnées
 */
async function fetchWeatherData(lat, lon) {
  if (!areCoordinatesUsable(lat, lon)) {
    return null;
  }

  try {
    const weatherData = await weatherService.getWeather(lat, lon);
    return weatherData && weatherData.data ? weatherData.data : null;
  } catch (err) {
    console.warn('getWeather failed:', err.message || err);
    return null;
  }
}

/**
 * Construit l'objet mood à partir des données collectées
 */
function buildMoodEntry(text, rating, location, weather, textScore, scoreResult, imagePath) {
  return {
    id: Date.now(),
    text,
    rating,
    lat: location.lat,
    lon: location.lon,
    place: location.place,
    weather,
    textScore,
    scoreResult,
    imageUrl: imagePath || null,
    createdAt: new Date().toISOString()
  };
}

/**
 * Orchestre la création complète d'un mood
 */
async function createMoodFromRequest(requestBody) {
  const { text = '', rating, lat, lon, address, imageUrl } = requestBody;

  // Validation
  const inputValidation = validateMoodInput(text, rating);
  if (!inputValidation.valid) return { error: inputValidation.error, status: HTTP_STATUS.BAD_REQUEST };

  const locationValidation = validateLocationInput(lat, lon, address);
  if (!locationValidation.valid) return { error: locationValidation.error, status: HTTP_STATUS.BAD_REQUEST };

  // Récupération données
  const location = await resolveLocation(lat, lon, address, locationValidation.hasCoords);
  const weather = await fetchWeatherData(location.lat, location.lon);
  const textScore = analyzeText(text);
  const scoreResult = computeScoreWithBreakdown({ rating: inputValidation.numericRating, textScore, weather });
  const savedImagePath = saveBase64Image(imageUrl);

  // Construction
  return {
    mood: buildMoodEntry(text, inputValidation.numericRating, location, weather, textScore, scoreResult, savedImagePath),
    status: HTTP_STATUS.CREATED
  };
}

/**
 * addMood - Controller principal pour ajouter un mood
 */
async function addMood(req, res) {
  try {
    const result = await createMoodFromRequest(req.body);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    jsonStore.save(result.mood);
    return res.status(result.status).json(result.mood);
  } catch (err) {
    console.error('addMood error:', err && (err.stack || err));
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
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
