const { createSearchService } = require('../../../../src/backend/application/services/SearchService');

describe('SearchService', () => {
  let mockGeocodeService;
  let searchService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGeocodeService = {
      forwardGeocode: jest.fn(),
    };

    searchService = createSearchService({ geocodeService: mockGeocodeService });
  });

  describe('searchLocation', () => {
    test('recherche une adresse valide', async () => {
      const mockResult = {
        name: 'Paris, France',
        type: 'city',
        lat: 48.8566,
        lon: 2.3522,
      };

      mockGeocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const result = await searchService.searchLocation('Paris');

      expect(mockGeocodeService.forwardGeocode).toHaveBeenCalledWith('Paris');
      expect(result).toEqual(mockResult);
    });

    test('retourne null si query est vide', async () => {
      const result = await searchService.searchLocation('');

      expect(mockGeocodeService.forwardGeocode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('retourne null si query est null', async () => {
      const result = await searchService.searchLocation(null);

      expect(mockGeocodeService.forwardGeocode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('retourne null si query ne contient que des espaces', async () => {
      const result = await searchService.searchLocation('   ');

      expect(mockGeocodeService.forwardGeocode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('délègue correctement au geocodeService', async () => {
      const mockResult = {
        name: 'Lyon, France',
        type: 'city',
        lat: 45.764,
        lon: 4.8357,
      };

      mockGeocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const result = await searchService.searchLocation('Lyon');

      expect(mockGeocodeService.forwardGeocode).toHaveBeenCalledTimes(1);
      expect(mockGeocodeService.forwardGeocode).toHaveBeenCalledWith('Lyon');
      expect(result).toBe(mockResult);
    });

    test('propage les erreurs du geocodeService', async () => {
      const error = new Error('Geocode API error');
      mockGeocodeService.forwardGeocode.mockRejectedValue(error);

      await expect(searchService.searchLocation('Invalid')).rejects.toThrow('Geocode API error');
    });

    test('gère les requêtes avec espaces au début et fin', async () => {
      const mockResult = {
        name: 'Marseille, France',
        type: 'city',
        lat: 43.2965,
        lon: 5.3698,
      };

      mockGeocodeService.forwardGeocode.mockResolvedValue(mockResult);

      const result = await searchService.searchLocation('  Marseille  ');

      expect(mockGeocodeService.forwardGeocode).toHaveBeenCalledWith('  Marseille  ');
      expect(result).toEqual(mockResult);
    });
  });
});
