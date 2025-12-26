jest.mock('../src/services/weatherService');
jest.mock('../src/services/locationResolver');
jest.mock('../src/services/imageStorage');
jest.mock('../src/utils/textAnalyzer');
jest.mock('../src/scoring/ScoreEngine');
jest.mock('../src/factories/moodFactory');
jest.mock('../src/storage/jsonStore');

const weatherService = require('../src/services/weatherService');
const { resolveLocation } = require('../src/services/locationResolver');
const { saveImageFromBase64 } = require('../src/services/imageStorage');
const { analyzeText } = require('../src/utils/textAnalyzer');
const { calculateGlobalScore } = require('../src/scoring/ScoreEngine');
const { buildMood } = require('../src/factories/moodFactory');
const jsonStore = require('../src/storage/jsonStore');

const { createNewMood } = require('../src/services/moodBusinessService');

describe('moodBusinessService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mocks par défaut
    resolveLocation.mockResolvedValue({
      lat: 48.8566,
      lon: 2.3522,
      place: { name: 'Paris, France', type: 'city' },
    });

    weatherService.getWeather.mockResolvedValue({
      source: 'mock',
      data: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
    });

    analyzeText.mockReturnValue(2);

    calculateGlobalScore.mockReturnValue(75);

    saveImageFromBase64.mockReturnValue('selfies/selfie_123.png');

    buildMood.mockReturnValue({
      id: 123456,
      text: 'Test',
      rating: 4,
      lat: 48.8566,
      lon: 2.3522,
      place: { name: 'Paris, France', type: 'city' },
      weather: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
      textScore: 2,
      scoreResult: 75,
      imageUrl: 'selfies/selfie_123.png',
      createdAt: '2025-12-25T10:00:00.000Z',
    });

    jsonStore.save.mockImplementation(() => {});
  });

  describe('createNewMood', () => {
    test("orchestre correctement la création d'un mood complet", async () => {
      const validatedData = {
        text: 'Je me sens bien',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: 'data:image/png;base64,abc123',
      };

      const result = await createNewMood(validatedData);

      // Vérifie que tous les services ont été appelés
      expect(resolveLocation).toHaveBeenCalledWith({
        lat: 48.8566,
        lon: 2.3522,
        address: null,
      });
      expect(weatherService.getWeather).toHaveBeenCalledWith(48.8566, 2.3522);
      expect(analyzeText).toHaveBeenCalledWith('Je me sens bien');
      expect(saveImageFromBase64).toHaveBeenCalledWith('data:image/png;base64,abc123');
      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 4,
        textScore: 2,
        weather: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
      });
      expect(buildMood).toHaveBeenCalled();
      expect(jsonStore.save).toHaveBeenCalled();

      expect(result).toBeDefined();
      expect(result.id).toBe(123456);
    });

    test("gère l'absence de météo si coordonnées invalides", async () => {
      resolveLocation.mockResolvedValue({
        lat: null,
        lon: null,
        place: null,
      });

      const validatedData = {
        text: 'Test sans coords',
        rating: 3,
        lat: null,
        lon: null,
        address: 'Unknown Address',
        imageUrl: null,
      };

      await createNewMood(validatedData);

      expect(weatherService.getWeather).not.toHaveBeenCalled();
      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 3,
        textScore: 2,
        weather: null,
      });
    });

    test('gère les erreurs de météo gracieusement', async () => {
      weatherService.getWeather.mockRejectedValue(new Error('Weather API error'));

      const validatedData = {
        text: 'Test',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      };

      await createNewMood(validatedData);

      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 4,
        textScore: 2,
        weather: null,
      });
    });

    test("gère l'absence d'image correctement", async () => {
      saveImageFromBase64.mockReturnValue(null);

      const validatedData = {
        text: 'Test sans image',
        rating: 3,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      };

      await createNewMood(validatedData);

      expect(buildMood).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: null,
        })
      );
    });

    test('passe les bonnes données à buildMood', async () => {
      const validatedData = {
        text: 'Test complet',
        rating: 5,
        lat: 45.764,
        lon: 4.8357,
        address: null,
        imageUrl: 'data:image/jpeg;base64,xyz789',
      };

      resolveLocation.mockResolvedValue({
        lat: 45.764,
        lon: 4.8357,
        place: { name: 'Lyon, France' },
      });

      await createNewMood(validatedData);

      expect(buildMood).toHaveBeenCalledWith({
        text: 'Test complet',
        rating: 5,
        lat: 45.764,
        lon: 4.8357,
        place: { name: 'Lyon, France' },
        weather: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
        textScore: 2,
        scoreResult: 75,
        imageUrl: 'selfies/selfie_123.png',
      });
    });

    test('sauvegarde le mood dans le store', async () => {
      const validatedData = {
        text: 'Test',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      };

      const result = await createNewMood(validatedData);

      expect(jsonStore.save).toHaveBeenCalledWith(result);
    });
  });
});
