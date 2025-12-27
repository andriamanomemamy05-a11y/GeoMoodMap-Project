/**
 * jsonStore.js (Repository Pattern)
 *
 * Responsabilité: Orchestrer le chargement/sauvegarde de moods en JSON.
 * Délègue l'accès disque à fileSystemAdapter.
 * Délègue la validation/parsing à jsonValidator.
 */

const path = require('path');
const fileSystemAdapter = require('./fileSystemAdapter');
const jsonValidator = require('./jsonValidator');

const FILE = path.join(process.cwd(), 'data', 'moods.json');

function loadAll() {
  fileSystemAdapter.ensureFile(FILE, '[]');

  const raw = fileSystemAdapter.readFile(FILE);
  const data = jsonValidator.parseJSON(raw, []);
  const validData = jsonValidator.validateArray(data, []);

  if (validData.length === 0 && data !== validData) {
    fileSystemAdapter.writeFile(FILE, '[]');
  }

  return validData;
}

function save(entry) {
  if (!entry) throw new Error('entry is required');

  const arr = loadAll();
  arr.push(entry);

  const jsonContent = jsonValidator.stringifyJSON(arr);
  fileSystemAdapter.writeFile(FILE, jsonContent);
}

module.exports = { loadAll, save };
