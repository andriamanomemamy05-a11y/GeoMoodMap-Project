/**
 * fileSystemAdapter.js
 *
 * Responsabilité unique : Lire/Écrire des chaînes de caractères dans des fichiers.
 * Ne connaît rien du JSON, ne valide rien.
 * Gère uniquement les erreurs disque (ENOENT, permissions, etc.)
 */

const fs = require('fs');
const path = require('path');

/**
 * Assure l'existence d'un dossier
 * @param {string} dirPath - Chemin du dossier
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Assure l'existence d'un fichier avec un contenu par défaut
 * @param {string} filePath - Chemin du fichier
 * @param {string} defaultContent - Contenu par défaut si le fichier n'existe pas
 */
function ensureFile(filePath, defaultContent = '') {
  const dir = path.dirname(filePath);
  ensureDirectory(dir);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf8');
  }
}

/**
 * Lit le contenu d'un fichier
 * @param {string} filePath - Chemin du fichier
 * @returns {string} Contenu du fichier
 * @throws {Error} Si le fichier ne peut pas être lu
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
  }
}

/**
 * Écrit du contenu dans un fichier
 * @param {string} filePath - Chemin du fichier
 * @param {string} content - Contenu à écrire
 * @param {string} encoding - Encodage du fichier (utf8, base64, etc.)
 * @throws {Error} Si le fichier ne peut pas être écrit
 */
function writeFile(filePath, content, encoding = 'utf8') {
  try {
    fs.writeFileSync(filePath, content, encoding);
  } catch (err) {
    throw new Error(`Failed to write file ${filePath}: ${err.message}`);
  }
}

module.exports = {
  ensureDirectory,
  ensureFile,
  readFile,
  writeFile,
};
