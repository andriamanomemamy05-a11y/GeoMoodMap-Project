// Les controllers gèrent la logique liée aux routes API
// Ils reçoivent les requêtes HTTP et appellent les services.


const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');
const jsonStore = require('../storage/jsonStore');
const { computeScoreWithBreakdown } = require('../utils/moodScore');
const { analyzeText } = require('../utils/textAnalyzer');


async function addMood(req, res) {
  try {
    const { text = '', rating, lat, lon, address, imageUrl } = req.body;

    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'text is required and must be a non-empty string' });
    }
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return res.status(400).json({ error: 'rating is required and must be a number (1-5 recommended)' });
    }

    let numericRating = Number(rating);

    const hasCoords = lat !== undefined && lon !== undefined && lat !== null && lon !== null;
    const hasAddress = typeof address === 'string' && address.trim() !== '';
    if (!hasCoords && !hasAddress) {
      return res.status(400).json({ error: 'Provide either lat+lon or address' });
    }

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
        const f = await geocodeService.forwardGeocode(address);
        usedLat = f.lat ? Number(f.lat) : null;
        usedLon = f.lon ? Number(f.lon) : null;
        place = f;
      } catch (err) {
        console.warn('forwardGeocode failed:', err.message || err);
      }
    }

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

    const textScore = analyzeText(text);

    const scoreResult = computeScoreWithBreakdown({
      rating: numericRating,
      textScore,
      weather
    });

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
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString()
    };

    jsonStore.save(mood);

    return res.status(201).json(mood);
  } catch (err) {
    console.error('addMood error:', err && (err.stack || err));
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

module.exports = { addMood };
