const { validateMoodInput } = require('../validators/moodValidator');
const { createNewMood } = require('../services/moodBusinessService');
const jsonStore = require('../storage/jsonStore');

/**
 * Contrôleur HTTP pour les moods
 * Responsabilité : Gestion de la couche HTTP (req/res uniquement)
 */

/**
 * POST /api/moods - Ajouter une nouvelle humeur
 */
async function addMood(req, res) {
  try {
    // 1. Validation des entrées
    const validation = validateMoodInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // 2. Délégation de la logique métier au service
    const mood = await createNewMood(validation.data);

    // 3. Réponse HTTP
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
