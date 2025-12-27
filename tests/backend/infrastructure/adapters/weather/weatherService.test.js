process.env.OPENWEATHER_API_KEY = 'test-api-key';

jest.mock('node-fetch');

const fetch = require('node-fetch');
const weatherService = require('../../../../../src/backend/infrastructure/adapters/weather/weatherService');

describe('weatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.USE_MOCKS;
  });

  describe('getWeather', () => {
    test('retourne les données météo depuis les coordonnées', async () => {
      const mockResponse = {
        main: {
          temp: 22.5,
          humidity: 65,
        },
        weather: [
          {
            description: 'clear sky',
          },
        ],
        wind: {
          speed: 3.5,
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await weatherService.getWeather(48.8566, 2.3522);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.openweathermap.org/data/2.5/weather')
      );
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('lat=48.8566'));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('lon=2.3522'));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('units=metric'));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('appid=test-api-key'));
      expect(result).toEqual({
        source: 'openweather',
        data: {
          temp: 22.5,
          weather: 'clear sky',
          humidity: 65,
          wind_speed: 3.5,
        },
      });
    });

    test('throw une erreur si coordonnées invalides', async () => {
      await expect(weatherService.getWeather(NaN, 2.3522)).rejects.toThrow(
        'Invalid coordinates for getWeather'
      );
      await expect(weatherService.getWeather(48.8566, null)).rejects.toThrow(
        'Invalid coordinates for getWeather'
      );
    });

    test('throw une erreur si API retourne erreur', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Invalid API key',
      });

      await expect(weatherService.getWeather(48.8566, 2.3522)).rejects.toThrow(
        'OpenWeather error 401: Invalid API key'
      );
    });

    test('retourne null pour champs manquants', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await weatherService.getWeather(45.764, 4.8357);

      expect(result).toEqual({
        source: 'openweather',
        data: {
          temp: null,
          weather: '',
          humidity: null,
          wind_speed: null,
        },
      });
    });

    test('gère les réponses partielles', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 18 },
          weather: [{ description: 'cloudy' }],
        }),
      });

      const result = await weatherService.getWeather(43.2965, 5.3698);

      expect(result).toEqual({
        source: 'openweather',
        data: {
          temp: 18,
          weather: 'cloudy',
          humidity: null,
          wind_speed: null,
        },
      });
    });

    test('extrait correctement description du premier élément weather', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 20, humidity: 70 },
          weather: [{ description: 'scattered clouds' }, { description: 'should not use this' }],
          wind: { speed: 2.5 },
        }),
      });

      const result = await weatherService.getWeather(48.8566, 2.3522);

      expect(result.data.weather).toBe('scattered clouds');
    });
  });
});
