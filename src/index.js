require('dotenv').config();
const express = require('express');
const { addMood, getMoods } = require('./controllers/moodController');

const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir les fichiers statiques du dossier /public
app.use(express.static(path.join(process.cwd(), 'public')));

// Endpoint de recherche d'adresse pour l'autocomplete
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const result = await geocodeService.forwardGeocode(q);
    // Retourne un tableau pour que le front fonctionne avec Leaflet
    res.json([result]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Création de l'api et appel de controller pour sauvegarder et lister les moods
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);

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