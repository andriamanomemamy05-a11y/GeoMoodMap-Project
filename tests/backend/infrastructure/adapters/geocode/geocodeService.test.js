jest.mock('node-fetch');

const fetch = require('node-fetch');
const geocodeService = require('../../../../../src/backend/infrastructure/adapters/geocode/geocodeService');

describe('geocodeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.USE_MOCKS;
  });

  describe('reverseGeocode', () => {
    test('retourne le lieu depuis les coordonnées', async () => {
      const mockResponse = {
        display_name: 'Paris, Île-de-France, France',
        type: 'city',
        lat: '48.8566',
        lon: '2.3522',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeService.reverseGeocode(48.8566, 2.3522);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://nominatim.openstreetmap.org/reverse'),
        expect.objectContaining({
          headers: { 'User-Agent': expect.any(String) },
        })
      );
      expect(result).toEqual({
        name: 'Paris, Île-de-France, France',
        type: 'city',
        lat: 48.8566,
        lon: 2.3522,
      });
    });

    test('throw une erreur si coordonnées invalides', async () => {
      await expect(geocodeService.reverseGeocode(NaN, 2.3522)).rejects.toThrow(
        'Invalid coordinates for reverseGeocode'
      );
      await expect(geocodeService.reverseGeocode(48.8566, undefined)).rejects.toThrow(
        'Invalid coordinates for reverseGeocode'
      );
    });

    test('throw une erreur si API retourne erreur', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(geocodeService.reverseGeocode(48.8566, 2.3522)).rejects.toThrow(
        'Nominatim reverse error: 500'
      );
    });

    test('retourne des valeurs par défaut si champs manquants', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await geocodeService.reverseGeocode(45.764, 4.8357);

      expect(result).toEqual({
        name: 'unknown',
        type: 'unknown',
        lat: 45.764,
        lon: 4.8357,
      });
    });
  });

  describe('forwardGeocode', () => {
    test('retourne les coordonnées depuis une adresse', async () => {
      const mockResponse = [
        {
          display_name: 'Lyon, Auvergne-Rhône-Alpes, France',
          type: 'city',
          lat: '45.764043',
          lon: '4.835659',
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeService.forwardGeocode('Lyon, France');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://nominatim.openstreetmap.org/search'),
        expect.objectContaining({
          headers: { 'User-Agent': expect.any(String) },
        })
      );
      expect(result).toEqual({
        name: 'Lyon, Auvergne-Rhône-Alpes, France',
        type: 'city',
        lat: 45.764043,
        lon: 4.835659,
      });
    });

    test('throw une erreur si adresse vide', async () => {
      await expect(geocodeService.forwardGeocode('')).rejects.toThrow(
        'address must be a non-empty string'
      );
      await expect(geocodeService.forwardGeocode(null)).rejects.toThrow(
        'address must be a non-empty string'
      );
    });

    test('throw une erreur si API retourne erreur', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      await expect(geocodeService.forwardGeocode('Invalid Address')).rejects.toThrow(
        'Nominatim forward error: 503'
      );
    });

    test('retourne adresse en fallback si aucun résultat', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await geocodeService.forwardGeocode('Unknown Place');

      expect(result).toEqual({
        name: 'Unknown Place',
        type: 'unknown',
        lat: null,
        lon: null,
      });
    });

    test('encode correctement les caractères spéciaux dans URL', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ display_name: 'Test', type: 'place', lat: '0', lon: '0' }],
      });

      await geocodeService.forwardGeocode("Rue de l'église");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent("Rue de l'église")),
        expect.any(Object)
      );
    });
  });
});
