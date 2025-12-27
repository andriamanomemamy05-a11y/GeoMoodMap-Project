const { calculateWeatherScore } = require('../../../../../src/backend/domain/scoring/rules/WeatherRule');

describe('WeatherRule', () => {
  describe('calculateWeatherScore', () => {
    test('retourne 0 si weather est null', () => {
      expect(calculateWeatherScore(null)).toBe(0);
    });

    test('rain applique -10 points', () => {
      expect(calculateWeatherScore({ weather: 'rain' })).toBe(-10);
    });

    test('pluie applique -10 points', () => {
      expect(calculateWeatherScore({ weather: 'pluie' })).toBe(-10);
    });

    test('snow applique -8 points', () => {
      expect(calculateWeatherScore({ weather: 'snow' })).toBe(-8);
    });

    test('neige applique -8 points', () => {
      expect(calculateWeatherScore({ weather: 'neige' })).toBe(-8);
    });

    test('cloud applique -5 points', () => {
      expect(calculateWeatherScore({ weather: 'cloud' })).toBe(-5);
    });

    test('nuage applique -5 points', () => {
      expect(calculateWeatherScore({ weather: 'nuage' })).toBe(-5);
    });

    test('clear applique +10 points', () => {
      expect(calculateWeatherScore({ weather: 'clear' })).toBe(10);
    });

    test('sun applique +10 points', () => {
      expect(calculateWeatherScore({ weather: 'sun' })).toBe(10);
    });

    test('soleil applique +10 points', () => {
      expect(calculateWeatherScore({ weather: 'soleil' })).toBe(10);
    });

    test('température > 28°C applique +5 points', () => {
      expect(calculateWeatherScore({ weather: '', temp: 30 })).toBe(5);
    });

    test('température < 5°C applique -5 points', () => {
      expect(calculateWeatherScore({ weather: '', temp: 3 })).toBe(-5);
    });

    test('température = 5°C ne change pas le score', () => {
      expect(calculateWeatherScore({ weather: '', temp: 5 })).toBe(0);
    });

    test('température = 28°C ne change pas le score', () => {
      expect(calculateWeatherScore({ weather: '', temp: 28 })).toBe(0);
    });

    test('combine météo et température', () => {
      expect(calculateWeatherScore({ weather: 'clear', temp: 30 })).toBe(15);
    });

    test('combine pluie et froid', () => {
      expect(calculateWeatherScore({ weather: 'rain', temp: 3 })).toBe(-15);
    });

    test('gère majuscules (case insensitive)', () => {
      expect(calculateWeatherScore({ weather: 'RAIN' })).toBe(-10);
    });

    test('ignore température non numérique', () => {
      expect(calculateWeatherScore({ weather: 'clear', temp: 'hot' })).toBe(10);
    });
  });
});
