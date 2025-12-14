require('dotenv').config();
const express = require('express');
const path = require('path');
const { addMood, getMoods } = require('./controllers/moodController');
const { searchAddress } = require('./controllers/searchController');
const { uploadSelfie } = require('./controllers/selfieController');
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

// Routes API
app.get('/api/search', searchAddress);
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);
app.post('/api/selfie', express.json({ limit: IMAGE_CONFIG.SELFIE_MAX_SIZE }), uploadSelfie);

// Check de l'erreur 404
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND, path: req.originalUrl });
});

// Erreur handler sur le serveur
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
});

module.exports = app;