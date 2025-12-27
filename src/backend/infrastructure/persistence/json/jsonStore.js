/**
 * jsonStore.js (Repository Pattern)
 *
 * Responsabilité unique : Orchestrer le chargement/sauvegarde de moods en JSON.
 * Délègue l'accès disque à fileSystemAdapter.
 * Délègue la validation/parsing à jsonValidator.
 */

const path = require('path');
const fileSystemAdapter = require('./fileSystemAdapter');
const jsonValidator = require('./jsonValidator');

// Chemin vers le fichier JSON qui stocke les moods
const FILE = path.join(process.cwd(), 'data', 'moods.json');

/**
 * Lit et parse le fichier JSON
 * Retourne toujours un tableau
 */
function loadAll() {
  // Assure l'existence du fichier avec un tableau vide par défaut
  fileSystemAdapter.ensureFile(FILE, '[]');

  // Lit le contenu brut du fichier
  const raw = fileSystemAdapter.readFile(FILE);

  // Parse le JSON
  const data = jsonValidator.parseJSON(raw, []);

  // Valide que c'est un tableau
  const validData = jsonValidator.validateArray(data, []);

  // Si les données n'étaient pas valides, réinitialise le fichier
  if (validData.length === 0 && data !== validData) {
    fileSystemAdapter.writeFile(FILE, '[]');
  }

  return validData;
}

/**
 * Sauvegarde une entrée dans le fichier JSON.
 */
function save(entry) {
  if (!entry) throw new Error('entry is required');

  // Charge toutes les entrées existantes depuis le fichier
  const arr = loadAll();

  // Ajoute la nouvelle entrée au tableau
  arr.push(entry);

  // Sérialise et écrit le tableau mis à jour dans le fichier
  const jsonContent = jsonValidator.stringifyJSON(arr);
  fileSystemAdapter.writeFile(FILE, jsonContent);
}

module.exports = { loadAll, save };
