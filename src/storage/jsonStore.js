// Ce fichier centralise la persistance, gère la création du dossier, la récupération et la réparation si JSON corrompu.

const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'data', 'moods.json');

function ensure() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf8');
}

function loadAll() {
  ensure();
  const raw = fs.readFileSync(FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    // Si fichier corrompu, on réinitialise proprement
    console.error('jsonStore: JSON parse error, resetting file', err);
    fs.writeFileSync(FILE, '[]', 'utf8');
    return [];
  }
}

function save(entry) {
  if (!entry) throw new Error('entry is required');
  const arr = loadAll();
  arr.push(entry);
  fs.writeFileSync(FILE, JSON.stringify(arr, null, 2), 'utf8');
}

module.exports = { loadAll, save };
