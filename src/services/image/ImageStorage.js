/**
 * ImageStorage.js
 *
 * Responsabilité unique : Orchestrer la sauvegarde d'images base64
 * Dépend d'abstractions (ImageParser, NamingStrategy, fileSystemAdapter)
 * Respecte le principe DIP (Dependency Inversion Principle)
 */

const path = require('path');
const { parseBase64Image, isSupportedImageType } = require('./ImageParser');
const { generateUniqueFileName, generateRelativePath } = require('./NamingStrategy');
const fileSystemAdapter = require('../../storage/fileSystemAdapter');

/**
 * Sauvegarde une image base64 dans le système de fichiers
 * @param {string|null} imageUrl - URL data:image en base64
 * @returns {string|null} Chemin relatif de l'image sauvegardée, ou null
 */
function saveImageFromBase64(imageUrl) {
  // 1. Parser l'image base64
  const parsedImage = parseBase64Image(imageUrl);
  if (!parsedImage) {
    return null;
  }

  const { type: imageType, base64Data } = parsedImage;

  // 2. Valider le type d'image
  if (!isSupportedImageType(imageType)) {
    console.warn(`Unsupported image type: ${imageType}`);
    return null;
  }

  try {
    // 3. Générer le nom de fichier unique
    const fileName = generateUniqueFileName(imageType);

    // 4. Construire le chemin absolu du dossier de destination
    const publicSelfiesDir = path.join(process.cwd(), 'public', 'selfies');

    // 5. Assurer l'existence du dossier via fileSystemAdapter
    fileSystemAdapter.ensureDirectory(publicSelfiesDir);

    // 6. Construire le chemin complet du fichier
    const filePath = path.join(publicSelfiesDir, fileName);

    // 7. Écrire le fichier via fileSystemAdapter (respecte DIP)
    fileSystemAdapter.writeFile(filePath, base64Data, 'base64');

    // 8. Retourner le chemin relatif pour JSON (accessible dans le navigateur)
    return generateRelativePath(fileName);
  } catch (err) {
    console.error('Error saving image:', err.message || err);
    return null;
  }
}

module.exports = {
  saveImageFromBase64,
};
