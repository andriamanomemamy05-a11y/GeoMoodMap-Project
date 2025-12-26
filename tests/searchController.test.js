jest.mock('../src/services/geocodeService');

const geocodeService = require('../src/services/geocodeService');
const { searchAddress } = require('../src/controllers/searchController');

describe('searchController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchAddress', () => {
    test('retourne un tableau vide si aucune query fournie', async () => {
      const req = {
        query: {},
      };

      const res = {
        json: jest.fn(),
      };

      await searchAddress(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
      expect(geocodeService.forwardGeocode).not.toHaveBeenCalled();
    });

    test('retourne un tableau vide si query est vide', async () => {
      const req = {
        query: { q: '' },
      };

      const res = {
        json: jest.fn(),
      };

      await searchAddress(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
      expect(geocodeService.forwardGeocode).not.toHaveBeenCalled();
    });

    test('recherche une adresse et retourne un tableau', async () => {
      const mockResult = {
        name: 'Paris, France',
        type: 'city',
        lat: 48.8566,
        lon: 2.3522,
      };

      geocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const req = {
        query: { q: 'Paris' },
      };

      const res = {
        json: jest.fn(),
      };

      await searchAddress(req, res);

      expect(geocodeService.forwardGeocode).toHaveBeenCalledWith('Paris');
      expect(res.json).toHaveBeenCalledWith([mockResult]);
    });

    test('retourne un tableau avec un seul élément (compatibilité Leaflet)', async () => {
      const mockResult = {
        name: 'Lyon, France',
        type: 'city',
        lat: 45.764,
        lon: 4.8357,
      };

      geocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const req = {
        query: { q: 'Lyon' },
      };

      const res = {
        json: jest.fn(),
      };

      await searchAddress(req, res);

      const response = res.json.mock.calls[0][0];
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(1);
      expect(response[0]).toEqual(mockResult);
    });

    test('gère les erreurs de geocoding avec status 500', async () => {
      geocodeService.forwardGeocode.mockRejectedValue(new Error('Nominatim error'));

      const req = {
        query: { q: 'Invalid Address' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nominatim error',
      });
    });

    test('gère les erreurs sans message avec fallback', async () => {
      geocodeService.forwardGeocode.mockRejectedValue(new Error());

      const req = {
        query: { q: 'Test' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      });
    });
  });
});
