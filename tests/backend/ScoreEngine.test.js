const { calculateGlobalScore } = require('../../src/backend/domain/scoring/ScoreEngine');

describe('ScoreEngine', () => {
  describe('calculateGlobalScore', () => {
    test('score maximum (rating 5 + texte positif + météo parfaite)', () => {
      const result = calculateGlobalScore({
        rating: 5,
        textScore: 3,
        weather: { weather: 'clear', temp: 30 },
      });
      // 100 (rating) + 30 (text) + 15 (weather) = 145 → clamped à 100
      expect(result).toBe(100);
    });

    test('score minimum (rating 1 + texte négatif + mauvaise météo)', () => {
      const result = calculateGlobalScore({
        rating: 1,
        textScore: -3,
        weather: { weather: 'rain', temp: 3 },
      });
      // 20 (rating) - 30 (text) - 15 (weather) = -25 → clamped à 0
      expect(result).toBe(0);
    });

    test('score moyen sans météo', () => {
      const result = calculateGlobalScore({
        rating: 3,
        textScore: 0,
        weather: null,
      });
      // 60 (rating) + 0 (text) + 0 (weather) = 60
      expect(result).toBe(60);
    });

    test('score avec rating élevé et texte négatif', () => {
      const result = calculateGlobalScore({
        rating: 5,
        textScore: -2,
        weather: null,
      });
      // 100 (rating) - 20 (text) + 0 (weather) = 80
      expect(result).toBe(80);
    });

    test('score avec rating faible et texte positif', () => {
      const result = calculateGlobalScore({
        rating: 2,
        textScore: 2,
        weather: null,
      });
      // 40 (rating) + 20 (text) + 0 (weather) = 60
      expect(result).toBe(60);
    });

    test('clamp supérieur fonctionne', () => {
      const result = calculateGlobalScore({
        rating: 5,
        textScore: 3,
        weather: { weather: 'sun', temp: 35 },
      });
      // 100 + 30 + 15 = 145 → clamped à 100
      expect(result).toBe(100);
    });

    test('clamp inférieur fonctionne', () => {
      const result = calculateGlobalScore({
        rating: 1,
        textScore: -3,
        weather: { weather: 'snow', temp: 0 },
      });
      // 20 - 30 - 13 = -23 → clamped à 0
      expect(result).toBe(0);
    });

    test('retourne un entier (pas de décimale)', () => {
      const result = calculateGlobalScore({
        rating: 3,
        textScore: 1,
        weather: { weather: 'cloud' },
      });
      expect(Number.isInteger(result)).toBe(true);
    });

    test('gère weather undefined', () => {
      const result = calculateGlobalScore({
        rating: 4,
        textScore: 0,
        weather: undefined,
      });
      // 80 + 0 + 0 = 80
      expect(result).toBe(80);
    });

    test('score réel cas usage typique', () => {
      const result = calculateGlobalScore({
        rating: 4,
        textScore: 1,
        weather: { weather: 'clear sky', temp: 20 },
      });
      // 80 (rating) + 10 (text) + 10 (clear) = 100
      expect(result).toBe(100);
    });

    test('score réel cas usage négatif', () => {
      const result = calculateGlobalScore({
        rating: 2,
        textScore: -1,
        weather: { weather: 'rain', temp: 5 },
      });
      // 40 (rating) - 10 (text) - 10 (rain) = 20
      expect(result).toBe(20);
    });

    test('textScore clamped avant calcul', () => {
      const result = calculateGlobalScore({
        rating: 3,
        textScore: 5, // sera clamped à 3 → 30 points
        weather: null,
      });
      // 60 + 30 = 90
      expect(result).toBe(90);
    });
  });
});
