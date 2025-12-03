// Ce fichier centralise la persistance, gère la création du dossier, la récupération et la réparation si JSON corrompu.

const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'data', 'moods.json');

/**
 * save - ajoute une entrée (append)
 */
function save(entry) {
  if (!entry) throw new Error('entry is required');
  const arr = loadAll();
  arr.push(entry);
  fs.writeFileSync(FILE, JSON.stringify(arr, null, 2), 'utf8');
}

module.exports = { loadAll, save };
