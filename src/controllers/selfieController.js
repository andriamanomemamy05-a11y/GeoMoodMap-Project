const { saveBase64Image } = require('../utils/imageHandler');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * uploadSelfie - Sauvegarde une image selfie en base64
 */
function uploadSelfie(req, res) {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.NO_IMAGE_PROVIDED });
    }

    const savedPath = saveBase64Image(image);

    if (!savedPath) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.IMAGE_SAVE_FAILED });
    }

    res.status(HTTP_STATUS.CREATED).json({ success: true, path: savedPath });
  } catch (err) {
    console.error('uploadSelfie error:', err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.IMAGE_SAVE_FAILED });
  }
}

module.exports = { uploadSelfie };
