// Toujours utiliser les mocks pour les tests unitaires
process.env.USE_MOCKS = 'true';
const geocodeService = require('../../../../../src/backend/infrastructure/adapters/geocode/geocodeService');

describe('Services de geolocalisation (avec mocks)', () => {
  test('geocodeService.reverseGeocode : retourne un lieu simulé', async () => {
    const result = await geocodeService.reverseGeocode(48.8566, 2.3522);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat', 48.8566);
    expect(result).toHaveProperty('lon', 2.3522);
  });

  test('geocodeService.forwardGeocode : retourner un lieu simulé avec lat et longitude', async () => {
    const result = await geocodeService.forwardGeocode('Avenue de la viste');
    expect(result).toHaveProperty('name', 'Avenue de la viste');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat');
    expect(result).toHaveProperty('lon');
  });
});
