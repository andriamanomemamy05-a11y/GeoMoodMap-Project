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

// - IMPORTER LES ADAPTERS D'INFRASTRUCTURE

// Adapters externes
const weatherService = require('../adapters/weather/weatherService');
const geocodeService = require('../adapters/geocode/geocodeService');
const { saveImageFromBase64 } = require('../adapters/image/ImageStorage');

// Persistence
const jsonStore = require('../persistence/json/jsonStore');

// Validators
const { validateMoodInput } = require('../../application/validators/moodValidator');

// - IMPORTER LES FACTORIES DE SERVICES D'APPLICATION

const { createMoodService } = require('../../application/services/MoodService');
const { createLocationResolver } = require('../../application/services/LocationResolver');
const { createSearchService } = require('../../application/services/SearchService');

// - INSTANCIER LES SERVICES EN INJECTANT LES ADAPTERS

// Créer LocationResolver avec geocodeService injecté
const locationResolver = createLocationResolver({ geocodeService });

// Créer ImageStorage adapter object (pour compatibilité avec l'injection)
const imageStorage = { saveImageFromBase64 };

// Créer MoodRepository adapter object (pour compatibilité avec l'injection)
const moodRepository = {
  save: jsonStore.save,
  loadAll: jsonStore.loadAll,
};

// Créer MoodService avec toutes ses dépendances injectées
const moodService = createMoodService({
  weatherService,
  locationResolver,
  imageStorage,
  moodRepository,
});

// Créer SearchService avec geocodeService injecté
const searchService = createSearchService({ geocodeService });

// -  CRÉER LES CONTROLLERS EN INJECTANT LES SERVICES

/**
 * Controller pour les moods
 */
const moodController = {
  async addMood(req, res) {
    try {
      // 1. Validation des entrées
      const validation = validateMoodInput(req.body);

      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      // 2. Délégation de la logique métier au service injecté
      const mood = await moodService.createNewMood(validation.data);

      // 3. Réponse HTTP
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

/**
 * Controller pour la recherche d'adresses
 */
const searchController = {
  async searchAddress(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.json([]);
      }

      // Délégation au service injecté
      const result = await searchService.searchLocation(q);

      // Retourne un tableau pour compatibilité avec Leaflet
      return res.json([result]);
    } catch (err) {
      console.error('searchAddress error:', err && (err.stack || err));
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  },
};

/**
 * Controller pour les selfies
 */
const selfieController = {
  saveSelfie(req, res) {
    try {
      const { image } = req.body; // dataURL base64

      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Délégation au service injecté
      const savedPath = imageStorage.saveImageFromBase64(image);

      if (!savedPath) {
        return res.status(400).json({ error: 'Invalid image format' });
      }

      // Convertir le chemin relatif en chemin absolu pour la réponse
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

// - CONFIGURER EXPRESS AVEC LES CONTROLLERS INSTANCIÉS

const app = express();

// Autoriser les payloads plus gros (ici jusqu'à 10MB)
app.use(express.json({ limit: '10mb' }));

// Simple logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir les fichiers statiques du dossier src/frontend
app.use(express.static(path.join(__dirname, '../../../frontend')));

// Routes API - Utilisation des controllers avec services injectés
app.get('/api/search', searchController.searchAddress);
app.post('/api/moods', moodController.addMood);
app.get('/api/moods', moodController.getMoods);
app.post('/api/selfie', selfieController.saveSelfie);

// Check de l'erreur 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Erreur handler sur le serveur
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});

// Déclaration du serveur à lancer
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
