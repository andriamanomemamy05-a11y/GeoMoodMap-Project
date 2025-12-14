/**
 * imageHandler - Gère la sauvegarde des images en base64
 * Responsabilités :
 * - Validation des images
 * - Conversion base64 vers fichier
 * - Création des dossiers nécessaires
 */

const fs = require('fs');
const path = require('path');
const { IMAGE_CONFIG } = require('../config/constants');

/**
 * Sauvegarde une image base64 dans le dossier public/selfies
 * @param {string} imageUrl - L'URL de l'image en base64
 * @returns {string|null} - Le chemin relatif de l'image sauvegardée ou null
 */
function saveBase64Image(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith(IMAGE_CONFIG.ALLOWED_FORMAT)) {
    return null;
  }

  try {
    // Dossier public/selfies pour que le navigateur y accède
    const publicSelfiesDir = path.join(
      process.cwd(),
      IMAGE_CONFIG.PUBLIC_DIR,
      IMAGE_CONFIG.SELFIES_SUBDIR
    );

    // Crée le dossier si nécessaire
    if (!fs.existsSync(publicSelfiesDir)) {
      fs.mkdirSync(publicSelfiesDir, { recursive: true });
    }

    // Extraire les données base64
    const base64Data = imageUrl.replace(IMAGE_CONFIG.BASE64_PREFIX, '');
    const fileName = `${IMAGE_CONFIG.FILENAME_PREFIX}${Date.now()}.${IMAGE_CONFIG.OUTPUT_FORMAT}`;
    const filePath = path.join(publicSelfiesDir, fileName);

    // Écrire le fichier
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Retourner le chemin relatif pour JSON (accessible dans le navigateur)
    return `${IMAGE_CONFIG.SELFIES_SUBDIR}/${fileName}`;
  } catch (err) {
    console.error('Error saving image:', err);
    return null;
  }
}

module.exports = { saveBase64Image };
