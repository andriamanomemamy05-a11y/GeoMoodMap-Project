// Toujours utiliser les mocks pour les tests unitaires
process.env.USE_MOCKS = 'true';
const geocodeService = require('../src/services/geocodeService')

describe('Services de geolocalisation (avec mocks)', () => {

  test('geocodeService.reverseGeocode : test si un des données lat et lon passées n"est pas bonne', async () => {
    const result = await geocodeService.reverseGeocode(48.8566, 'bad_longitude');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat', 48.8566);
    expect(result).toHaveProperty('lon', 2.3522);
  });

  test('geocodeService.reverseGeocode : test si un des données lat et lon passées n"est pas complet', async () => {
    const result = await geocodeService.reverseGeocode(48.8566);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat', 48.8566);
    expect(result).toHaveProperty('lon');
  });


  test('geocodeService.forwardGeocode : test si le type d"adresse passée n"est pas bonne', async () => {
    const result = await geocodeService.forwardGeocode(78787878787878);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat');
    expect(result).toHaveProperty('lon');
  });

});