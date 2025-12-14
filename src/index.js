require('dotenv').config();
const express = require('express');
const path = require('path');
const { addMood, getMoods } = require('./controllers/moodController');
const geocodeService = require('./services/geocodeService');
const { saveBase64Image } = require('./utils/imageHandler');
const { HTTP_STATUS, IMAGE_CONFIG, ERROR_MESSAGES } = require('./config/constants');

const app = express();

// Autoriser les payloads plus gros (ici jusqu'à 10MB)
app.use(express.json({ limit: IMAGE_CONFIG.MAX_SIZE }));

// Simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir les fichiers statiques du dossier /public
app.use(express.static(path.join(process.cwd(), IMAGE_CONFIG.PUBLIC_DIR)));

// Endpoint de recherche d'adresse pour l'autocomplete
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const result = await geocodeService.forwardGeocode(q);
    // Retourne un tableau pour que le front fonctionne avec Leaflet
    res.status(HTTP_STATUS.OK).json([result]);
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

// Création de l'API et appel de controller pour sauvegarder et lister les moods
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);

// Endpoint pour recevoir et enregistrer la photo (legacy)
app.post('/api/selfie', express.json({ limit: IMAGE_CONFIG.SELFIE_MAX_SIZE }), (req, res) => {
  try {
    const { image } = req.body; // dataURL base64
    if (!image) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.NO_IMAGE_PROVIDED });
    }

    const savedPath = saveBase64Image(image);
    if (!savedPath) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.IMAGE_SAVE_FAILED });
    }

    res.status(HTTP_STATUS.CREATED).json({ success: true, path: savedPath });
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.IMAGE_SAVE_FAILED });
  }
});

// Check de l'erreur 404
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not Found', path: req.originalUrl });
});

// Erreur handler sur le serveur
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
});

// Déclaration du serveur à lancer
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));