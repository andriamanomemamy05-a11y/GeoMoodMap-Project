/**
 * ImageParser.js
 *
 * Responsabilité unique : Parser et valider les images base64
 * Aucune dépendance externe, aucune connaissance du file system
 */

/**
 * Parse une URL data:image en base64
 * @param {string|null} imageUrl - URL data:image en base64
 * @returns {Object|null} { type: string, base64Data: string } ou null si invalide
 */
function parseBase64Image(imageUrl) {
  // Pas d'image fournie
  if (!imageUrl || !imageUrl.startsWith('data:image')) {
    return null;
  }

  try {
    // Extraire type et données base64 (supporte png, jpeg, jpg, webp, etc.)
    const matches = imageUrl.match(/^data:image\/(\w+);base64,(.*)$/);
    if (!matches) {
      console.warn('Invalid base64 image format');
      return null;
    }

    const imageType = matches[1]; // png, jpeg, jpg, webp, etc.
    const base64Data = matches[2];

    return {
      type: imageType,
      base64Data,
    };
  } catch (err) {
    console.error('Error parsing base64 image:', err.message || err);
    return null;
  }
}

/**
 * Valide qu'une image base64 a un format supporté
 * @param {string} imageType - Type d'image (png, jpeg, jpg, webp)
 * @returns {boolean} true si supporté
 */
function isSupportedImageType(imageType) {
  const supportedTypes = ['png', 'jpeg', 'jpg', 'webp', 'gif'];
  return supportedTypes.includes(imageType.toLowerCase());
}

module.exports = {
  parseBase64Image,
  isSupportedImageType,
};
