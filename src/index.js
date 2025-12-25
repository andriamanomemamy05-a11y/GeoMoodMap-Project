require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { addMood, getMoods } = require('./controllers/moodController');

const geocodeService = require('./services/geocodeService');

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

// Endpoint de recherche d'adresse pour l'autocomplete
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
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

// Endpoint pour recevoir et enregistrer la photo
app.post('/api/selfie', express.json({ limit: '5mb' }), (req, res) => {
  try {
    const { image } = req.body; // dataURL base64
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // Crée le dossier selfies si nécessaire
    const selfiesDir = path.join(process.cwd(), 'data', 'selfies');
    if (!fs.existsSync(selfiesDir)) fs.mkdirSync(selfiesDir, { recursive: true });

    // Extraire la partie base64
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const fileName = `selfie_${Date.now()}.png`;
    const filePath = path.join(selfiesDir, fileName);

    fs.writeFileSync(filePath, base64Data, 'base64');
    res.json({ success: true, path: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

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
