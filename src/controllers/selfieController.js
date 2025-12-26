const path = require('path');
const { saveImageFromBase64 } = require('../services/image/ImageStorage');

/**
 * Contrôleur HTTP pour les selfies
 * Responsabilité : Gestion de la couche HTTP pour les selfies (req/res uniquement)
 */

/**
 * POST /api/selfie - Enregistrer un selfie (image base64)
 */
function saveSelfie(req, res) {
  try {
    const { image } = req.body; // dataURL base64

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Délégation au service imageStorage
    const savedPath = saveImageFromBase64(image);

    if (!savedPath) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Convertir le chemin relatif en chemin absolu pour la réponse
    const absolutePath = path.join(process.cwd(), 'public', savedPath);

    return res.json({
      success: true,
      path: absolutePath,
      relativePath: savedPath,
    });
  } catch (err) {
    console.error('saveSelfie error:', err && (err.stack || err));
    return res.status(500).json({ error: 'Failed to save image' });
  }
}

module.exports = { saveSelfie };
