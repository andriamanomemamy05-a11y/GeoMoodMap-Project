const fs = require('fs');
const path = require('path');
const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');
const jsonStore = require('../storage/jsonStore');
const { computeScoreWithBreakdown } = require('../utils/moodScore');
const { analyzeText } = require('../utils/textAnalyzer');

/**
 * addMood
 * - Validatation des données
 * - R2cupération des coordinations ou adresse
 * - Récupérer la météo selon les coord
 * - Calculer le mood score via utils/moodScore par rapport aux données
 * - Sauvegarder dans data/mood.json via storage/jsonStore
 */
async function addMood(req, res) {
  try {
    const { text = '', rating, lat, lon, address, imageUrl } = req.body;

    // Validation basique mais explicite
    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'text is required and must be a non-empty string' });
    }
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return res
        .status(400)
        .json({ error: 'rating is required and must be a number (1-5 recommended)' });
    }

    // Normaliser le rating en nombre
    const numericRating = Number(rating);

    // S'assurer qu'on a des coordonnées ou une adresse
    const hasCoords = lat !== undefined && lon !== undefined && lat !== null && lon !== null;
    const hasAddress = typeof address === 'string' && address.trim() !== '';
    if (!hasCoords && !hasAddress) {
      return res.status(400).json({ error: 'Provide either lat+lon or address' });
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
      // Forward geocode : pour récupérer les coords depuis l'adrese
      try {
        const f = await geocodeService.forwardGeocode(address);
        usedLat = f.lat ? Number(f.lat) : null;
        usedLon = f.lon ? Number(f.lon) : null;
        place = f;
      } catch (err) {
        console.warn('forwardGeocode failed:', err.message || err);
      }
    }

    // Obtenir la météo actuel du jour (uniquement si les coordonnées sont présentes ceux qui sont très utiles)
    let weather = null;
    try {
      if (
        usedLat !== null &&
        usedLon !== null &&
        !Number.isNaN(usedLat) &&
        !Number.isNaN(usedLon)
      ) {
        const w = await weatherService.getWeather(usedLat, usedLon);
        weather = w && w.data ? w.data : null;
      }
    } catch (err) {
      console.warn('getWeather failed:', err.message || err);
      weather = null;
    }

    // Analyser le text par rapport ç la facteur de sentiment écrit
    const textScore = analyzeText(text);

    // Calcul du score d'humeur final avec ventilation
    const scoreResult = computeScoreWithBreakdown({
      rating: numericRating,
      textScore,
      weather,
    });

    // --- Sauvegarde du selfie : image en base64 ---
    let savedImagePath = null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      // Dossier public/selfies pour que le navigateur y accède
      const publicSelfiesDir = path.join(process.cwd(), 'public', 'selfies');

      // Crée le dossier si nécessaire
      if (!fs.existsSync(publicSelfiesDir)) fs.mkdirSync(publicSelfiesDir, { recursive: true });

      // Extraire le type d'image et les données base64 (supporte png, jpeg, jpg, webp, etc.)
      const matches = imageUrl.match(/^data:image\/(\w+);base64,(.*)$/);
      if (matches) {
        const imageType = matches[1]; // png, jpeg, jpg, webp, etc.
        const base64Data = matches[2];
        const extension = imageType === 'jpeg' ? 'jpg' : imageType;
        const fileName = `selfie_${Date.now()}.${extension}`;
        const filePath = path.join(publicSelfiesDir, fileName);

        // Écrire le fichier
        fs.writeFileSync(filePath, base64Data, 'base64');

        // Sauvegarder le chemin relatif pour JSON (accessible dans le navigateur)
        savedImagePath = `selfies/${fileName}`;
      }
    }

    // Construire une entrée d’humeur
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
      createdAt: new Date().toISOString(),
    };

    // Récupérer les données et l'envoeyr das jsonStore pour le sauvegarder
    jsonStore.save(mood);

    return res.status(201).json(mood);
  } catch (err) {
    console.error('addMood error:', err && (err.stack || err));
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

/**
 * getMoods - retourne la liste complète (simple)
 */
function getMoods(req, res) {
  try {
    const moods = jsonStore.loadAll();
    res.json(moods);
  } catch (err) {
    console.error('getMoods error:', err && (err.stack || err));
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

module.exports = { addMood, getMoods };
