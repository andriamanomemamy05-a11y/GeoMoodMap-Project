require('dotenv').config();
const express = require('express');
const path = require('path');
const { addMood, getMoods } = require('./controllers/moodController');
const { searchAddress } = require('./controllers/searchController');
const { saveSelfie } = require('./controllers/selfieController');

const app = express();

// Autoriser les payloads plus gros (ici jusqu'à 10MB)
app.use(express.json({ limit: '10mb' }));

// Simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir les fichiers statiques du dossier /public
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes API
app.get('/api/search', searchAddress);
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);
app.post('/api/selfie', saveSelfie);

// Check de l'erreur 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Erreur handler sur le serveur
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});

// Déclaration du serveur à lancer
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
