const { calculateRatingScore } = require('../../src/backend/domain/scoring/rules/RatingRule');

describe('RatingRule', () => {
  describe('calculateRatingScore', () => {
    test('rating 1 retourne 20', () => {
      expect(calculateRatingScore(1)).toBe(20);
    });

    test('rating 2 retourne 40', () => {
      expect(calculateRatingScore(2)).toBe(40);
    });

    test('rating 3 retourne 60', () => {
      expect(calculateRatingScore(3)).toBe(60);
    });

    test('rating 4 retourne 80', () => {
      expect(calculateRatingScore(4)).toBe(80);
    });

    test('rating 5 retourne 100', () => {
      expect(calculateRatingScore(5)).toBe(100);
    });

    test('rating 0 retourne 0', () => {
      expect(calculateRatingScore(0)).toBe(0);
    });
  });
});