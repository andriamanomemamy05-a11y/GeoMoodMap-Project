const { calculateSentimentScore } = require('../../src/backend/domain/scoring/rules/SentimentRule');

describe('SentimentRule', () => {
  describe('calculateSentimentScore', () => {
    test('textScore +1 retourne +10', () => {
      expect(calculateSentimentScore(1)).toBe(10);
    });

    test('textScore +2 retourne +20', () => {
      expect(calculateSentimentScore(2)).toBe(20);
    });

    test('textScore +3 retourne +30', () => {
      expect(calculateSentimentScore(3)).toBe(30);
    });

    test('textScore -1 retourne -10', () => {
      expect(calculateSentimentScore(-1)).toBe(-10);
    });

    test('textScore -2 retourne -20', () => {
      expect(calculateSentimentScore(-2)).toBe(-20);
    });

    test('textScore -3 retourne -30', () => {
      expect(calculateSentimentScore(-3)).toBe(-30);
    });

    test('textScore 0 retourne 0', () => {
      expect(calculateSentimentScore(0)).toBe(0);
    });

    test('textScore +5 est clamped à +30', () => {
      expect(calculateSentimentScore(5)).toBe(30);
    });

    test('textScore -5 est clamped à -30', () => {
      expect(calculateSentimentScore(-5)).toBe(-30);
    });

    test('textScore +4 est clamped à +30', () => {
      expect(calculateSentimentScore(4)).toBe(30);
    });

    test('textScore -4 est clamped à -30', () => {
      expect(calculateSentimentScore(-4)).toBe(-30);
    });
  });
});
