/**
 * Responsabilité: Orchestrer la sauvegarde d'images base64
 * Dépend d'abstractions (ImageParser, NamingStrategy, fileSystemAdapter)
 */

const path = require('path');
const { parseBase64Image, isSupportedImageType } = require('./ImageParser');
const { generateUniqueFileName, generateRelativePath } = require('./NamingStrategy');
const fileSystemAdapter = require('../../persistence/json/fileSystemAdapter');

/**
 * Sauvegarde une image base64 dans le système de fichiers
 * @param {string|null} imageUrl - URL data:image en base64
 * @returns {string|null} Chemin relatif de l'image sauvegardée, ou null
 */
function saveImageFromBase64(imageUrl) {
  const parsedImage = parseBase64Image(imageUrl);
  if (!parsedImage) {
    return null;
  }

  const { type: imageType, base64Data } = parsedImage;

  if (!isSupportedImageType(imageType)) {
    console.warn(`Unsupported image type: ${imageType}`);
    return null;
  }

  try {
    const fileName = generateUniqueFileName(imageType);
    const publicSelfiesDir = path.join(process.cwd(), 'src', 'frontend', 'selfies');

    fileSystemAdapter.ensureDirectory(publicSelfiesDir);

    const filePath = path.join(publicSelfiesDir, fileName);
    fileSystemAdapter.writeFile(filePath, base64Data, 'base64');

    return generateRelativePath(fileName);
  } catch (err) {
    console.error('Error saving image:', err.message || err);
    return null;
  }
}

module.exports = {
  saveImageFromBase64,
};
