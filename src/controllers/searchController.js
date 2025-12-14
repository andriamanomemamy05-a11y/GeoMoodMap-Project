const geocodeService = require('../services/geocodeService');
const { HTTP_STATUS, RESPONSE_CONSTANTS } = require('../config/constants');

/**
 * searchAddress - Recherche une adresse via geocoding
 */
async function searchAddress(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.json(RESPONSE_CONSTANTS.EMPTY_ARRAY);
  }

  try {
    const result = await geocodeService.forwardGeocode(query);
    res.status(HTTP_STATUS.OK).json([result]);
  } catch (err) {
    console.error('searchAddress error:', err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
}

module.exports = { searchAddress };
