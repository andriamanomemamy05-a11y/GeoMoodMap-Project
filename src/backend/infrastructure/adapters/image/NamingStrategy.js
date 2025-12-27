/**
 * Responsabilité: Générer des noms de fichiers uniques pour les images
 */

/**
 * Génère un nom de fichier unique pour une image
 * @param {string} extension - Extension du fichier (png, jpg, webp, etc.)
 * @returns {string} Nom de fichier unique
 */
function generateUniqueFileName(extension) {
  const timestamp = Date.now();
  const normalizedExt = extension === 'jpeg' ? 'jpg' : extension;
  return `selfie_${timestamp}.${normalizedExt}`;
}

/**
 * Génère le chemin relatif complet pour une image
 * @param {string} fileName - Nom du fichier
 * @returns {string} Chemin relatif (ex: "selfies/selfie_123456.png")
 */
function generateRelativePath(fileName) {
  return `selfies/${fileName}`;
}

module.exports = {
  generateUniqueFileName,
  generateRelativePath,
};
