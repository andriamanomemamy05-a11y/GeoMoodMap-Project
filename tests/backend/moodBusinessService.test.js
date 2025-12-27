jest.mock('../../src/backend/domain/text-analysis/TextAnalyzer');
jest.mock('../../src/backend/domain/scoring/ScoreEngine');
jest.mock('../../src/backend/domain/factories/moodFactory');

const { analyzeText } = require('../../src/backend/domain/text-analysis/TextAnalyzer');
const { calculateGlobalScore } = require('../../src/backend/domain/scoring/ScoreEngine');
const { buildMood } = require('../../src/backend/domain/factories/moodFactory');

const { createMoodService } = require('../../src/backend/application/services/MoodService');

describe('moodBusinessService', () => {
  let mockWeatherService;
  let mockLocationResolver;
  let mockImageStorage;
  let mockMoodRepository;
  let moodService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock dependencies
    mockWeatherService = {
      getWeather: jest.fn().mockResolvedValue({
        source: 'mock',
        data: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
      }),
    };

    mockLocationResolver = {
      resolveLocation: jest.fn().mockResolvedValue({
        lat: 48.8566,
        lon: 2.3522,
        place: { name: 'Paris, France', type: 'city' },
      }),
    };

    mockImageStorage = {
      saveImageFromBase64: jest.fn().mockReturnValue('selfies/selfie_123.png'),
    };

    mockMoodRepository = {
      save: jest.fn(),
      loadAll: jest.fn().mockReturnValue([]),
    };

    // Mock domain functions
    analyzeText.mockReturnValue(2);
    calculateGlobalScore.mockReturnValue(75);
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

    // Create service instance with mocked dependencies
    moodService = createMoodService({
      weatherService: mockWeatherService,
      locationResolver: mockLocationResolver,
      imageStorage: mockImageStorage,
      moodRepository: mockMoodRepository,
    });
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

      const result = await moodService.createNewMood(validatedData);

      // Vérifie que tous les services ont été appelés
      expect(mockLocationResolver.resolveLocation).toHaveBeenCalledWith({
        lat: 48.8566,
        lon: 2.3522,
        address: null,
      });
      expect(mockWeatherService.getWeather).toHaveBeenCalledWith(48.8566, 2.3522);
      expect(analyzeText).toHaveBeenCalledWith('Je me sens bien');
      expect(mockImageStorage.saveImageFromBase64).toHaveBeenCalledWith('data:image/png;base64,abc123');
      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 4,
        textScore: 2,
        weather: { temp: 20, weather: 'clear sky', humidity: 60, wind_speed: 5 },
      });
      expect(buildMood).toHaveBeenCalled();
      expect(mockMoodRepository.save).toHaveBeenCalled();

      expect(result).toBeDefined();
      expect(result.id).toBe(123456);
    });

    test("gère l'absence de météo si coordonnées invalides", async () => {
      mockLocationResolver.resolveLocation.mockResolvedValue({
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

      await moodService.createNewMood(validatedData);

      expect(mockWeatherService.getWeather).not.toHaveBeenCalled();
      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 3,
        textScore: 2,
        weather: null,
      });
    });

    test('gère les erreurs de météo gracieusement', async () => {
      mockWeatherService.getWeather.mockRejectedValue(new Error('Weather API error'));

      const validatedData = {
        text: 'Test',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      };

      await moodService.createNewMood(validatedData);

      expect(calculateGlobalScore).toHaveBeenCalledWith({
        rating: 4,
        textScore: 2,
        weather: null,
      });
    });

    test("gère l'absence d'image correctement", async () => {
      mockImageStorage.saveImageFromBase64.mockReturnValue(null);

      const validatedData = {
        text: 'Test sans image',
        rating: 3,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      };

      await moodService.createNewMood(validatedData);

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

      mockLocationResolver.resolveLocation.mockResolvedValue({
        lat: 45.764,
        lon: 4.8357,
        place: { name: 'Lyon, France' },
      });

      await moodService.createNewMood(validatedData);

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

      const result = await moodService.createNewMood(validatedData);

      expect(mockMoodRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('getAllMoods', () => {
    test('retourne tous les moods depuis le store', () => {
      const mockMoods = [
        { id: 1, text: 'Mood 1', rating: 4 },
        { id: 2, text: 'Mood 2', rating: 3 },
        { id: 3, text: 'Mood 3', rating: 5 },
      ];

      mockMoodRepository.loadAll.mockReturnValue(mockMoods);

      const result = moodService.getAllMoods();

      expect(mockMoodRepository.loadAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMoods);
    });

    test('retourne un tableau vide si aucun mood', () => {
      mockMoodRepository.loadAll.mockReturnValue([]);

      const result = moodService.getAllMoods();

      expect(mockMoodRepository.loadAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    test('délègue correctement à moodRepository.loadAll', () => {
      const mockMoods = [{ id: 123, text: 'Test' }];
      mockMoodRepository.loadAll.mockReturnValue(mockMoods);

      moodService.getAllMoods();

      expect(mockMoodRepository.loadAll).toHaveBeenCalledWith();
    });
  });
});
