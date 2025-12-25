const fs = require('fs');
const path = require('path');

/**
 * Service de stockage d'images
 * Responsabilité : Gestion du parsing et sauvegarde des images base64
 */

/**
 * Génère un nom de fichier unique pour une image
 * @param {string} extension - Extension du fichier (png, jpg, webp, etc.)
 * @returns {string} Nom de fichier unique
 */
function generateImageFileName(extension) {
  const timestamp = Date.now();
  const normalizedExt = extension === 'jpeg' ? 'jpg' : extension;
  return `selfie_${timestamp}.${normalizedExt}`;
}

/**
 * Sauvegarde une image base64 dans le système de fichiers
 * @param {string|null} imageUrl - URL data:image en base64
 * @returns {string|null} Chemin relatif de l'image sauvegardée, ou null
 */
function saveImageFromBase64(imageUrl) {
  // Pas d'image fournie
  if (!imageUrl || !imageUrl.startsWith('data:image')) {
    return null;
  }

  try {
    // Dossier public/selfies pour accès navigateur
    const publicSelfiesDir = path.join(process.cwd(), 'public', 'selfies');

    // Créer le dossier si nécessaire
    if (!fs.existsSync(publicSelfiesDir)) {
      fs.mkdirSync(publicSelfiesDir, { recursive: true });
    }

    // Extraire type et données base64 (supporte png, jpeg, jpg, webp, etc.)
    const matches = imageUrl.match(/^data:image\/(\w+);base64,(.*)$/);
    if (!matches) {
      console.warn('Invalid base64 image format');
      return null;
    }

    const imageType = matches[1]; // png, jpeg, jpg, webp, etc.
    const base64Data = matches[2];
    const fileName = generateImageFileName(imageType);
    const filePath = path.join(publicSelfiesDir, fileName);

    // Écrire le fichier
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Retourner le chemin relatif pour JSON (accessible dans le navigateur)
    return `selfies/${fileName}`;
  } catch (err) {
    console.error('Error saving image:', err.message || err);
    return null;
  }
}

module.exports = {
  saveImageFromBase64,
  generateImageFileName,
};
