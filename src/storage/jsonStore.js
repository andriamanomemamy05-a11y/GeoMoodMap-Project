// Ce fichier centralise la persistance, gère la création du dossier, la récupération et la réparation si JSON corrompu.

const fs = require('fs');
const path = require('path');
const { ERROR_MESSAGES } = require('../config/constants');

// Chemin vers le fichier JSON qui stocke les moods
const FILE = path.join(process.cwd(), 'data', 'moods.json');

/**
 * Réinitialise le fichier avec un tableau vide
 */
function resetFile() {
  fs.writeFileSync(FILE, '[]', 'utf8');
}

// Vérifie que le dossier et le fichier existent, sinon les crée
function ensure() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) resetFile();
}


/**
 * Lit et parse le fichier JSON
 * Retourne toujours un tableau
*/
function loadAll() {
  // Assure l'existence du fichier
  ensure();

  // Lit le contenu du fichier
  const raw = fs.readFileSync(FILE, 'utf8');
  try {
    // Parse le JSON et retourne le tableau contenant la liste
    const data = JSON.parse(raw || '[]');

    // Si ce n'est pas un tableau, on réinitialise
    if (!Array.isArray(data)) {
      console.warn('jsonStore: data is not an array, resetting file');
      resetFile();
      return [];
    }
    return data;
  } catch (err) {
    // Si le JSON est corrompu, réinitialise le fichier
    console.error('jsonStore: JSON parse error, resetting file', err);
    resetFile();
    return [];
  }
}



/**
  * Sauvegarde une entrée dans le fichier JSON.
*/
function save(entry) {
  if (!entry) throw new Error(ERROR_MESSAGES.ENTRY_REQUIRED);

  // Charge toutes les entrées existantes depuis le fichier
  const arr = loadAll();

  // Ajoute la nouvelle entrée au tableau
  arr.push(entry);

  // Écrit le tableau mis à jour dans le fichier JSON
  fs.writeFileSync(FILE, JSON.stringify(arr, null, 2), 'utf8');
}

module.exports = { loadAll, save };
