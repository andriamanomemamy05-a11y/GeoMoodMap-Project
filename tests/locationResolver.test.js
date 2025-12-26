jest.mock('../src/infrastructure/adapters/geocode/geocodeService');

const geocodeService = require('../src/infrastructure/adapters/geocode/geocodeService');
const { resolveLocation } = require('../src/application/services/LocationResolver');

describe('locationResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveLocation', () => {
    test('résout la localisation avec coordonnées (reverse geocoding)', async () => {
      geocodeService.reverseGeocode.mockResolvedValue({
        name: 'Paris, France',
        type: 'city',
        lat: 48.8566,
        lon: 2.3522,
      });

      const result = await resolveLocation({
        lat: 48.8566,
        lon: 2.3522,
        address: null,
      });

      expect(geocodeService.reverseGeocode).toHaveBeenCalledWith(48.8566, 2.3522);
      expect(result.lat).toBe(48.8566);
      expect(result.lon).toBe(2.3522);
      expect(result.place.name).toBe('Paris, France');
    });

    test('résout la localisation avec adresse (forward geocoding)', async () => {
      geocodeService.forwardGeocode.mockResolvedValue({
        name: 'Lyon, France',
        type: 'city',
        lat: 45.764,
        lon: 4.8357,
      });

      const result = await resolveLocation({
        lat: null,
        lon: null,
        address: 'Lyon, France',
      });

      expect(geocodeService.forwardGeocode).toHaveBeenCalledWith('Lyon, France');
      expect(result.lat).toBe(45.764);
      expect(result.lon).toBe(4.8357);
      expect(result.place.name).toBe('Lyon, France');
    });

    test('gère les erreurs de reverse geocoding gracieusement', async () => {
      geocodeService.reverseGeocode.mockRejectedValue(new Error('Nominatim error'));

      const result = await resolveLocation({
        lat: 48.8566,
        lon: 2.3522,
        address: null,
      });

      expect(result.lat).toBe(48.8566);
      expect(result.lon).toBe(2.3522);
      expect(result.place).toBeNull();
    });

    test('gère les erreurs de forward geocoding gracieusement', async () => {
      geocodeService.forwardGeocode.mockRejectedValue(new Error('Nominatim error'));

      const result = await resolveLocation({
        lat: null,
        lon: null,
        address: 'Invalid Address',
      });

      expect(result.lat).toBeNull();
      expect(result.lon).toBeNull();
      expect(result.place).toBeNull();
    });

    test('retourne null si coordonnées sont NaN', async () => {
      const result = await resolveLocation({
        lat: NaN,
        lon: NaN,
        address: null,
      });

      expect(geocodeService.reverseGeocode).not.toHaveBeenCalled();
      expect(result.lat).toBeNaN();
      expect(result.lon).toBeNaN();
      expect(result.place).toBeNull();
    });

    test('préfère les coordonnées si les deux sont fournis', async () => {
      geocodeService.reverseGeocode.mockResolvedValue({
        name: 'Paris from coords',
        type: 'city',
      });

      const result = await resolveLocation({
        lat: 48.8566,
        lon: 2.3522,
        address: 'Some Address',
      });

      expect(geocodeService.reverseGeocode).toHaveBeenCalled();
      expect(geocodeService.forwardGeocode).not.toHaveBeenCalled();
      expect(result.place.name).toBe('Paris from coords');
    });
  });
});
