/**
 * Validator pour les données d'entrée de mood
 * Responsabilité : Validation et normalisation des inputs
 */

function validateText(text) {
  return typeof text === 'string' && text.trim() !== '';
}

function validateRating(rating) {
  return rating !== undefined && rating !== null && !Number.isNaN(Number(rating));
}

function validateLocation(lat, lon, address) {
  const hasCoords = lat !== undefined && lon !== undefined && lat !== null && lon !== null;
  const hasAddress = typeof address === 'string' && address.trim() !== '';
  return { hasCoords, hasAddress, isValid: hasCoords || hasAddress };
}

function validateMoodInput(body) {
  const errors = [];
  const { text = '', rating, lat, lon, address, imageUrl } = body;

  // Validation du texte
  if (!validateText(text)) {
    errors.push('text is required and must be a non-empty string');
  }

  // Validation du rating
  if (!validateRating(rating)) {
    errors.push('rating is required and must be a number (1-5 recommended)');
  }

  // Validation des coordonnées ou adresse
  const location = validateLocation(lat, lon, address);
  if (!location.isValid) {
    errors.push('Provide either lat+lon or address');
  }

  // Si des erreurs existent, retourner échec
  if (errors.length > 0) {
    return { isValid: false, errors, data: null };
  }

  // Normalisation des données
  return {
    isValid: true,
    errors: [],
    data: {
      text: text.trim(),
      rating: Number(rating),
      lat: location.hasCoords ? Number(lat) : null,
      lon: location.hasCoords ? Number(lon) : null,
      address: location.hasAddress ? address.trim() : null,
      imageUrl: imageUrl || null,
    },
  };
}

module.exports = { validateMoodInput };
