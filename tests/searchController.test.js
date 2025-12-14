jest.mock('../src/services/geocodeService');

const geocodeService = require('../src/services/geocodeService');
const { searchAddress } = require('../src/controllers/searchController');

describe('searchController', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('searchAddress', () => {
    test('retourne un tableau vide si query est vide', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn()
      };

      await searchAddress(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('retourne les résultats du geocoding si query est fourni', async () => {
      const mockResult = { name: 'Paris', type: 'city', lat: 48.8566, lon: 2.3522 };
      geocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const req = { query: { q: 'Paris' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await searchAddress(req, res);

      expect(geocodeService.forwardGeocode).toHaveBeenCalledWith('Paris');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockResult]);
    });

    test('retourne une erreur 500 en cas d\'erreur du service', async () => {
      geocodeService.forwardGeocode.mockRejectedValue(new Error('API Error'));

      const req = { query: { q: 'Paris' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await searchAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'API Error' });
    });
  });
});
