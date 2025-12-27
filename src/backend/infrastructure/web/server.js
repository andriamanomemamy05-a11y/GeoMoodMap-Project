/**
 * server.js - COMPOSITION ROOT
 *
 * Point d'entrée de l'application et configuration de l'injection de dépendances.
 * C'est ICI et SEULEMENT ICI que nous assemblons les dépendances concrètes.
 *
 * ARCHITECTURE HEXAGONALE - COMPOSITION ROOT PATTERN:
 * - Importer les adapters d'infrastructure
 * - Importer les factories de services d'application
 * - Instancier les services en injectant les adapters
 * - Créer les controllers en injectant les services
 * - Configurer Express avec les controllers instanciés
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

const weatherService = require('../adapters/weather/weatherService');
const geocodeService = require('../adapters/geocode/geocodeService');
const { saveImageFromBase64 } = require('../adapters/image/ImageStorage');
const jsonStore = require('../persistence/json/jsonStore');
const { validateMoodInput } = require('../../application/validators/moodValidator');

const { createMoodService } = require('../../application/services/MoodService');
const { createLocationResolver } = require('../../application/services/LocationResolver');
const { createSearchService } = require('../../application/services/SearchService');

const locationResolver = createLocationResolver({ geocodeService });

const imageStorage = { saveImageFromBase64 };

const moodRepository = {
  save: jsonStore.save,
  loadAll: jsonStore.loadAll,
};

const moodService = createMoodService({
  weatherService,
  locationResolver,
  imageStorage,
  moodRepository,
});

const searchService = createSearchService({ geocodeService });

const moodController = {
  async addMood(req, res) {
    try {
      const validation = validateMoodInput(req.body);

      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const mood = await moodService.createNewMood(validation.data);

      return res.status(201).json(mood);
    } catch (err) {
      console.error('addMood error:', err && (err.stack || err));
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  },

  getMoods(req, res) {
    try {
      const moods = moodService.getAllMoods();
      res.json(moods);
    } catch (err) {
      console.error('getMoods error:', err && (err.stack || err));
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  },
};

const searchController = {
  async searchAddress(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.json([]);
      }

      const result = await searchService.searchLocation(q);

      return res.json([result]);
    } catch (err) {
      console.error('searchAddress error:', err && (err.stack || err));
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  },
};

const selfieController = {
  saveSelfie(req, res) {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const savedPath = imageStorage.saveImageFromBase64(image);

      if (!savedPath) {
        return res.status(400).json({ error: 'Invalid image format' });
      }

      const absolutePath = path.join(process.cwd(), 'src', 'frontend', savedPath);

      return res.json({
        success: true,
        path: absolutePath,
        relativePath: savedPath,
      });
    } catch (err) {
      console.error('saveSelfie error:', err && (err.stack || err));
      return res.status(500).json({ error: 'Failed to save image' });
    }
  },
};

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, '../../../frontend')));

app.get('/api/search', searchController.searchAddress);
app.post('/api/moods', moodController.addMood);
app.get('/api/moods', moodController.getMoods);
app.post('/api/selfie', selfieController.saveSelfie);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
